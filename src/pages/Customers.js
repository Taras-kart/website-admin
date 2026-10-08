import React, { useEffect, useMemo, useState } from 'react';
import { Shell } from './Operations';
import { apiGet, apiPost } from './api';
import './Operations.css';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tadm-operations-ops-main"],
  "ops-heading": ["tadm-operations-ops-heading"],
  "ops-panel": ["tadm-operations-ops-panel"],
  "ops-actions": ["tadm-operations-ops-actions"],
  "ops-row-actions": ["tadm-operations-ops-row-actions"],
  "ops-primary": ["tadm-operations-ops-primary"],
  "ops-metrics": ["tadm-operations-ops-metrics"],
  "ops-quick": ["tadm-operations-ops-quick"],
  "ops-table-wrap": ["tadm-operations-ops-table-wrap"],
  "ops-badge": ["tadm-operations-ops-badge"],
  "ops-toolbar": ["tadm-operations-ops-toolbar"],
  "ops-dates": ["tadm-operations-ops-dates"],
  "ops-pagination": ["tadm-operations-ops-pagination"],
  "ops-alert": ["tadm-operations-ops-alert"],
  "ops-success": ["tadm-operations-ops-success"],
  "ops-empty": ["tadm-operations-ops-empty"],
  "ops-overlay": ["tadm-operations-ops-overlay"],
  "ops-modal": ["tadm-operations-ops-modal"],
  "ops-form": ["tadm-operations-ops-form"],
  "ops-form-grid": ["tadm-operations-ops-form-grid"],
  "ops-nav": ["tadm-operations-ops-nav"],
  "ops-nav-top": ["tadm-operations-ops-nav-top"],
  "ops-brand": ["tadm-operations-ops-brand"],
  "ops-nav-controls": ["tadm-operations-ops-nav-controls"],
  "ops-nav-links": ["tadm-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tadm-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tadm-operations-ops-pos-grid"],
  "ops-pos-total": ["tadm-operations-ops-pos-total"],
  "ops-pos-qty": ["tadm-operations-ops-pos-qty"],
  "ops-danger": ["tadm-operations-ops-danger"],
  "ops-password": ["tadm-operations-ops-password"],
  "is-low": ["tadm-operations-is-low"],
  "is-muted": ["tadm-operations-is-muted"],
  "active": ["tadm-operations-active"],
  "is-open": ["tadm-operations-is-open"]
})[name] || ["tadm-customers-" + name]).join(' ');
const blank = {
  name: '',
  email: '',
  mobile: '',
  city: '',
  password: '',
  confirm: ''
};
export default function Customers() {
  const [type, setType] = useState('B2B'),
    [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0),
    [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [adding, setAdding] = useState(false),
    [form, setForm] = useState(blank),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState(''),
    [success, setSuccess] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setRows([]);
    apiGet(type === 'B2B' ? '/b2b-customers' : '/b2c-customers', {}, {
      signal: controller.signal
    }).then(data => {
      if (!Array.isArray(data)) throw new Error('Customer list could not be read. Please refresh.');
      if (!controller.signal.aborted) setRows(data);
    }).catch(e => {
      if (!controller.signal.aborted) setError(e.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [type, revision]);
  useEffect(() => setPage(0), [search, type]);
  useEffect(() => {
    if (!adding) return;
    const key = e => {
      if (e.key === 'Escape' && !busy) setAdding(false);
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [adding, busy]);
  const filtered = useMemo(() => rows.filter(row => [row.name, row.email, row.mobile, row.city].some(value => String(value || '').toLowerCase().includes(search.toLowerCase().trim()))), [rows, search]);
  const save = async e => {
    e.preventDefault();
    setFormError('');
    if (form.password !== form.confirm) return setFormError('Passwords do not match.');
    setBusy(true);
    try {
      await apiPost('/b2b-customers', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        password: form.password
      });
      setAdding(false);
      setForm(blank);
      setSuccess('Wholesale customer created.');
      setRevision(v => v + 1);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell title="Customers" subtitle="Retail and wholesale customer accounts" actions={<><button onClick={() => setRevision(v => v + 1)} disabled={loading} className="tadm-customers-node-0">Refresh</button>{type === 'B2B' && <button className={portalClass("ops-primary")} onClick={() => {
      setAdding(true);
      setFormError('');
      setSuccess('');
    }}>Add wholesale customer</button>}</>}>
  <div className={portalClass("ops-toolbar")}><div className={portalClass("ops-actions")} role="group" aria-label="Customer type">{[['B2C', 'Retail customers'], ['B2B', 'Wholesale customers']].map(([value, label]) => <button key={value} aria-pressed={type === value} className={portalClass(type === value ? 'ops-primary' : '')} onClick={() => {
          setType(value);
          setPage(0);
          setSuccess('');
        }}>{label}</button>)}</div><input aria-label="Search customers" placeholder="Search name, email, mobile or city" value={search} onChange={e => setSearch(e.target.value)} className="tadm-customers-node-1" /></div>
  {success && <p className={portalClass("ops-success")} role="status">{success}</p>}
  {error ? <div className={portalClass("ops-alert")} role="alert">{error} <button onClick={() => setRevision(v => v + 1)} className="tadm-customers-node-2">Try again</button></div> : <section className={portalClass("ops-panel")} aria-busy={loading}><div className={portalClass("ops-table-wrap")}><table className="tadm-customers-node-3"><thead className="tadm-customers-node-4"><tr className="tadm-customers-node-5"><th className="tadm-customers-node-6">Customer</th><th className="tadm-customers-node-7">Email</th><th className="tadm-customers-node-8">Mobile</th>{type === 'B2B' && <th className="tadm-customers-node-9">City</th>}</tr></thead><tbody className="tadm-customers-node-10">{filtered.slice(page * 25, page * 25 + 25).map(row => <tr key={row.id} className="tadm-customers-node-11"><td className="tadm-customers-node-12"><strong className="tadm-customers-node-13">{row.name || 'Unnamed customer'}</strong><small className="tadm-customers-node-14">{type === 'B2B' ? 'Wholesale' : 'Retail'}</small></td><td className="tadm-customers-node-15">{row.email || 'Not provided'}</td><td className="tadm-customers-node-16">{row.mobile || 'Not provided'}</td>{type === 'B2B' && <td className="tadm-customers-node-17">{row.city || 'Not provided'}</td>}</tr>)}</tbody></table></div>{loading ? <div className={portalClass("ops-empty")} role="status">Loading customers...</div> : !filtered.length ? <div className={portalClass("ops-empty")}>{search ? 'No customers match your search.' : 'No customers found.'}</div> : <div className={portalClass("ops-pagination")}><button disabled={!page} onClick={() => setPage(v => v - 1)} className="tadm-customers-node-18">Previous</button><span className="tadm-customers-node-19">{filtered.length} customers, page {page + 1} of {Math.max(1, Math.ceil(filtered.length / 25))}</span><button disabled={(page + 1) * 25 >= filtered.length} onClick={() => setPage(v => v + 1)} className="tadm-customers-node-20">Next</button></div>}</section>}
  {adding && <div className={portalClass("ops-overlay")}><section className={portalClass("ops-modal")} role="dialog" aria-modal="true" aria-label="Add wholesale customer"><header className="tadm-customers-node-21"><h2 className="tadm-customers-node-22">Add wholesale customer</h2><button aria-label="Close dialog" disabled={busy} onClick={() => setAdding(false)} className="tadm-customers-node-23">Close</button></header><form className={portalClass("ops-form")} onSubmit={save}><div className={portalClass("ops-form-grid")}>{[['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['mobile', 'Mobile', 'tel'], ['city', 'City (optional)', 'text'], ['password', 'Password', 'password'], ['confirm', 'Confirm password', 'password']].map(([key, label, inputType]) => <label key={key} className="tadm-customers-node-24">{label}<input autoFocus={key === 'name'} required={key !== 'city'} type={inputType} autoComplete={inputType === 'password' ? 'new-password' : 'off'} minLength={inputType === 'password' ? 8 : undefined} value={form[key]} onChange={e => setForm({
                ...form,
                [key]: e.target.value
              })} className="tadm-customers-node-25" /></label>)}</div>{formError && <p role="alert" className={portalClass("ops-alert")}>{formError}</p>}<button className={portalClass("ops-primary")} disabled={busy}>{busy ? 'Creating...' : 'Create customer'}</button></form></section></div>}
 </Shell>;
}
