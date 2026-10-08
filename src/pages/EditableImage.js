import React, { useRef, useState } from 'react';
import './EditableImage.css';
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
  "editable-image-wrapper": ["tadm-editableimage-editable-image-wrapper"],
  "editable-image-img": ["tadm-editableimage-editable-image-img"],
  "editable-image-overlay": ["tadm-editableimage-editable-image-overlay"],
  "editable-image-btn": ["tadm-editableimage-editable-image-btn"],
  "editable-image-input": ["tadm-editableimage-editable-image-input"]
})[name] || ["tadm-editableimage-" + name]).join(' ');
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://taras-kart-backend.vercel.app';
const MAX_FILE_SIZE_BYTES = 3.5 * 1024 * 1024;
export default function EditableImage({
  slotId,
  section,
  imageUrl,
  defaultUrl,
  altText,
  onUpdated
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) inputRef.current.click();
  };
  const handleChange = async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('File is too large. Please upload an image smaller than 3.5 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) {
        if (uploadRes.status === 413) {
          alert('Image is too large for the server. Please upload a smaller image (under 3.5 MB).');
        } else {
          alert('Failed to upload image.');
        }
        setUploading(false);
        return;
      }
      const uploadJson = await uploadRes.json();
      const newImageUrl = uploadJson.imageUrl;
      const body = {
        section: section || null,
        imageUrl: newImageUrl,
        altText: altText || '',
        link: null,
        extra: null
      };
      const patchRes = await fetch(`${API_BASE}/api/homepage-images/${encodeURIComponent(slotId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!patchRes.ok) {
        alert('Failed to save homepage image mapping.');
        setUploading(false);
        return;
      }
      const updated = await patchRes.json();
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      alert('Something went wrong while uploading. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  const label = uploading ? 'Uploading...' : 'Replace';
  return <div className={portalClass("editable-image-wrapper")}>
      <img src={imageUrl || defaultUrl} alt={altText || ''} className={portalClass("editable-image-img")} />
      <div className={portalClass("editable-image-overlay")}>
        <button type="button" className={portalClass("editable-image-btn")} onClick={handleClick} disabled={uploading}>
          {label}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className={portalClass("editable-image-input")} onChange={handleChange} />
    </div>;
}
