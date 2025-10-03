import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import { apiGet, apiUpload, apiPost } from './api';
import './ImportStock.css';

export default function ImportStock() {
  const { user } = useAuth();
  const { show, hide } = useLoading();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(null);

  const branchId = user?.branch_id;
  const canUpload = useMemo(() => !!file && !!branchId && !uploading, [file, branchId, uploading]);

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

  async function processJob(jobId) {
    let start = 0;
    setProgress({ jobId, state: 'Processing…', done: 0, total: null });
    for (;;) {
      const r = await apiPost(`/api/branch/${encodeURIComponent(branchId)}/import/process/${jobId}?start=${start}&limit=200`);
      const next = r.nextStart ?? (start + (r.processed || 0));
      const total = r.totalRows ?? null;
      const doneCount = Math.min(next, total ?? next);
      setProgress({ jobId, state: r.done ? 'Completed' : 'Processing…', done: doneCount, total });
      if (r.done) break;
      start = next;
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file || !branchId) return;
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
      const job = await apiUpload(`/api/branch/${encodeURIComponent(branchId)}/import`, fd);
      setMessage('Uploaded. Starting processing…');
      setFile(null);
      await processJob(job.id);
      await fetchJobs();
    } catch (err) {
      setMessage(err?.payload?.message || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      hide();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  return (
    <div className="import-page-admin">
      <Navbar />
      <div className="import-wrap-admin">
        <div className="import-card-admin">
          <div className="import-title-admin">Import Stock</div>
          <div className="import-subtitle-admin">Upload your branch Excel file (.xlsx, .xls, .csv)</div>
          <form onSubmit={onUpload} className="import-form-admin">
            <div className="import-filebox-admin">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? <div className="import-filehint-admin">{file.name} • {(file.size/1024/1024).toFixed(2)} MB</div> : <div className="import-filehint-admin">No file selected</div>}
            </div>
            <button className="import-btn-admin" type="submit" disabled={!canUpload}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            {message ? <div className="import-msg-admin">{message}</div> : null}
            {progress ? (
              <div className="import-msg-admin">
                {progress.state} {progress.total ? `${progress.done}/${progress.total}` : `${progress.done}+`} rows
              </div>
            ) : null}
          </form>
        </div>

        <div className="import-card-admin">
          <div className="import-title-admin">Recent Imports</div>
          <div className="import-actions-admin">
            <button className="import-ghost-btn-admin" onClick={fetchJobs} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh'}</button>
          </div>

          <div className="import-tablewrap-admin">
            <table className="import-table-admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>File</th>
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
                    <td data-label="Status"><span className={`pill-admin ${String(j.status_enum || '').toLowerCase()}`}>{j.status_enum}</span></td>
                    <td data-label="Total">{j.rows_total ?? 0}</td>
                    <td data-label="Success">{j.rows_success ?? 0}</td>
                    <td data-label="Error">{j.rows_error ?? 0}</td>
                    <td data-label="Uploaded">{j.uploaded_at ? new Date(j.uploaded_at).toLocaleString() : '-'}</td>
                    <td data-label="Completed">{j.completed_at ? new Date(j.completed_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
                {!jobs.length && (
                  <tr>
                    <td colSpan="8" className="import-empty-admin">No imports yet</td>
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
