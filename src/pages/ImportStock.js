import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import { apiGet, apiUpload, apiPost } from './api';
import JSZip from 'jszip';
import './ImportStock.css';

const CLOUD_NAME = 'deymt9uyh';
const UPLOAD_PRESET = 'unsigned_ean';

export default function ImportStock() {
  const { user } = useAuth();
  const { show, hide } = useLoading();
  const [file, setFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);
  const [gender, setGender] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageProgress, setImageProgress] = useState({ done: 0, total: 0 });
  const [eanSet, setEanSet] = useState(null);
  const [matchStats, setMatchStats] = useState({ matched: 0, total: 0, skipped: 0 });
  const [unmatchedList, setUnmatchedList] = useState([]);

  const branchId = user?.branch_id;
  const canUpload = useMemo(() => !!file && !!branchId && !uploading && !!gender, [file, branchId, uploading, gender]);
  const canUploadImages = useMemo(() => !!imageZip && !!branchId && !uploadingImages, [imageZip, branchId, uploadingImages]);

  useEffect(() => {
    const saved = localStorage.getItem('import_gender') || '';
    setGender(saved);
  }, []);

  async function fetchJobs() {
    if (!branchId) return;
    setRefreshing(true);
    show();
    try {
      const data = await apiGet(`/api/branch/${encodeURIComponent(branchId)}/import-jobs`);
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setRefreshing(false);
      hide();
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [branchId]);

  async function processJob(jobId, setProg) {
    let start = 0;
    setProg({ jobId, state: 'Processing…', done: 0, total: null });
    for (;;) {
      const r = await apiPost(`/api/branch/${encodeURIComponent(branchId)}/import/process/${jobId}?start=${start}&limit=200`);
      const next = r.nextStart ?? (start + (r.processed || 0));
      const total = r.totalRows ?? null;
      const doneCount = Math.min(next, total ?? next);
      setProg({ jobId, state: r.done ? 'Completed' : 'Processing…', done: doneCount, total });
      if (r.done) break;
      start = next;
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file || !branchId || !gender) {
      setMessage('Please select a category and choose a file.');
      return;
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setMessage('You are not logged in');
      return;
    }
    setUploading(true);
    setMessage('');
    show();
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('gender', gender);
      localStorage.setItem('import_gender', gender);
      const job = await apiUpload(`/api/branch/${encodeURIComponent(branchId)}/import`, fd);
      setMessage('Uploaded. Starting processing…');
      setFile(null);
      await processJob(job.id, setProgress);
      await fetchJobs();
    } catch (err) {
      setMessage(err?.payload?.message || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      hide();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  function baseNameNoExt(name) {
    const n = name.split('/').pop() || name;
    const i = n.lastIndexOf('.');
    return i > 0 ? n.slice(0, i) : n;
  }

  function isImagePath(p) {
    const n = p.toLowerCase();
    return n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.png') || n.endsWith('.webp');
  }

  async function uploadToCloudinary(blob, publicIdBase) {
    const form = new FormData();
    form.append('file', blob);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('folder', `products`);
    form.append('public_id', publicIdBase);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form
    });
    if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
    return res.json();
  }

  async function ensureEanSet() {
    if (eanSet) return eanSet;
    try {
      const list = await apiGet(`/api/products?limit=10000`);
      const s = new Set((Array.isArray(list) ? list : []).map(p => String(p.ean_code || '').trim()).filter(Boolean));
      setEanSet(s);
      return s;
    } catch {
      const s = new Set();
      setEanSet(s);
      return s;
    }
  }

  async function onUploadImages(e) {
    e.preventDefault();
    if (!imageZip || !branchId) {
      setImageMessage('Please choose a ZIP file.');
      return;
    }
    setUploadingImages(true);
    setImageMessage('');
    setImageProgress({ done: 0, total: 0 });
    setMatchStats({ matched: 0, total: 0, skipped: 0 });
    setUnmatchedList([]);
    show();
    try {
      const eans = await ensureEanSet();
      const zip = await JSZip.loadAsync(imageZip);
      const entries = Object.values(zip.files).filter(f => !f.dir && isImagePath(f.name));
      const total = entries.length;
      let done = 0;
      let matched = 0;
      const unmatched = [];
      for (const f of entries) {
        const base = baseNameNoExt(f.name).trim();
        if (!base || !eans.has(base)) {
          unmatched.push({ file: f.name, ean: base || '(none)' });
          done += 1;
          setImageProgress({ done, total });
          continue;
        }
        const blob = await f.async('blob');
        await uploadToCloudinary(blob, base);
        matched += 1;
        done += 1;
        setImageProgress({ done, total });
      }
      setMatchStats({ matched, total, skipped: total - matched });
      setUnmatchedList(unmatched);
      setImageMessage(`Finished. Uploaded ${matched}/${total}. Unmatched ${unmatched.length}.`);
      setImageZip(null);
    } catch (err) {
      setImageMessage(err?.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
      hide();
      setTimeout(() => setImageMessage(''), 5000);
    }
  }

  return (
    <div className="import-page-admin">
      <Navbar />
      <div className="import-wrap-admin">

        <div className="import-card-admin">
          <div className="import-title-admin">Import Stock (Excel)</div>
          <div className="import-subtitle-admin">Upload your branch Excel file for a selected category.</div>
          <form className="import-form-admin" onSubmit={(e) => e.preventDefault()}>
            <div className="excel-block">
              <div className="select-wrap">
                <label className="label">Category</label>
                <select
                  className={`audience-select ${gender ? '' : 'invalid'}`}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="KIDS">Kids</option>
                </select>
              </div>
              <div className="import-filebox-admin">
                <label className="label">Excel / CSV</label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="import-filehint-admin">{file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB</div>
                ) : (
                  <div className="import-filehint-admin">No file selected</div>
                )}
                <button className="import-btn-admin" onClick={onUpload} disabled={!canUpload}>
                  {uploading ? 'Uploading…' : 'Upload Excel'}
                </button>
                {message ? <div className="import-msg-admin">{message}</div> : null}
                {progress ? (
                  <div className="import-msg-admin">
                    {progress.state} {progress.total ? `${progress.done}/${progress.total}` : `${progress.done}+`} rows
                  </div>
                ) : null}
              </div>
              <div className="inline-info">
                <span className={`pill-mini ${gender ? 'ok' : 'warn'}`}>{gender ? `Category: ${gender}` : 'Select a category for Excel upload'}</span>
              </div>
            </div>
          </form>
        </div>

        <div className="import-card-admin">
          <div className="import-title-admin">Upload Product Images (ZIP by EAN)</div>
          <div className="import-subtitle-admin">Images will be matched by EAN across all categories. Only unmatched EANs will be listed below.</div>
          <form className="import-form-admin" onSubmit={(e) => e.preventDefault()}>
            <div className="zip-block">
              <div className="import-filebox-admin">
                <label className="label">Images ZIP Folder</label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => setImageZip(e.target.files?.[0] || null)}
                />
                {imageZip ? (
                  <div className="import-filehint-admin">{imageZip.name} • {(imageZip.size / 1024 / 1024).toFixed(2)} MB</div>
                ) : (
                  <div className="import-filehint-admin">No ZIP selected</div>
                )}
                <button className="import-btn-admin" onClick={onUploadImages} disabled={!canUploadImages || uploadingImages}>
                  {uploadingImages ? `Uploading ${imageProgress.done}/${imageProgress.total}…` : 'Upload Images ZIP'}
                </button>
                {imageMessage ? <div className="import-msg-admin">{imageMessage}</div> : null}
                <div className="image-stats">
                  <span>Matched: {matchStats.matched}</span>
                  <span>Unmatched: {matchStats.skipped}</span>
                  <span>Total: {matchStats.total}</span>
                </div>
                {!!unmatchedList.length && (
                  <div className="unmatched-wrap">
                    <div className="unmatched-title">Unmatched EANs</div>
                    <ul className="unmatched-list">
                      {unmatchedList.map((u, i) => (
                        <li key={`${u.file}-${i}`}>
                          <span className="unmatched-ean">{u.ean}</span>
                          <span className="unmatched-file">{u.file}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="import-card-admin">
          <div className="import-title-admin">Recent Imports</div>
          <div className="import-actions-admin">
            <button className="import-ghost-btn-admin" onClick={fetchJobs} disabled={refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <div className="import-tablewrap-admin">
            <table className="import-table-admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>File</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Success</th>
                  <th>Error</th>
                  <th>Uploaded</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="import-row-card">
                    <td data-label="ID">{j.id}</td>
                    <td data-label="File">{j.file_name || '-'}</td>
                    <td data-label="Gender">{j.gender || '-'}</td>
                    <td data-label="Status">
                      <span className={`pill-admin ${String(j.status_enum || '').toLowerCase()}`}>{j.status_enum}</span>
                    </td>
                    <td data-label="Total">{j.rows_total ?? 0}</td>
                    <td data-label="Success">{j.rows_success ?? 0}</td>
                    <td data-label="Error">{j.rows_error ?? 0}</td>
                    <td data-label="Uploaded">{j.uploaded_at ? new Date(j.uploaded_at).toLocaleString() : '-'}</td>
                    <td data-label="Completed">{j.completed_at ? new Date(j.completed_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
                {!jobs.length && (
                  <tr>
                    <td colSpan="9" className="import-empty-admin">No imports yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="import-note-admin">Each upload affects only your branch inventory.</div>
        </div>
      </div>
    </div>
  );
}
