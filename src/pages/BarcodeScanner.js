import React, { useEffect, useRef, useState } from 'react';
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
  "ops-password": ["tadm-operations-ops-password"]
})[name] || ["tadm-barcodescanner-" + name]).join(' ');
export default function BarcodeScanner({
  onDetected
}) {
  const videoRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [manual, setManual] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let codeReader = null;
    let cancelled = false;
    async function start() {
      try {
        const mod = await import('@zxing/browser').catch(() => null);
        if (!mod) return;
        const {
          BrowserMultiFormatReader
        } = mod;
        codeReader = new BrowserMultiFormatReader();
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices || !devices.length) return;
        setSupported(true);
        await codeReader.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (res, err) => {
          if (cancelled) return;
          if (res?.text) {
            onDetected?.(res.text.trim());
          } else if (err) {}
        });
      } catch (e) {
        setError('Camera scan unavailable');
      }
    }
    start();
    return () => {
      cancelled = true;
      try {
        codeReader?.reset();
      } catch {}
    };
  }, [onDetected]);
  return <div className={portalClass("scanner-wrap")} style={{
    display: 'grid',
    gap: 8
  }}>
      {supported ? <video ref={videoRef} style={{
      width: '100%',
      maxWidth: 420,
      borderRadius: 8
    }} muted playsInline className="tadm-barcodescanner-node-0" /> : <>
          <input placeholder="Enter/scan barcode" value={manual} onChange={e => setManual(e.target.value)} onKeyDown={e => {
        if (e.key === 'Enter' && manual.trim()) {
          onDetected?.(manual.trim());
          setManual('');
        }
      }} className="tadm-barcodescanner-node-1" />
          {error ? <small style={{
        color: '#f66'
      }} className="tadm-barcodescanner-node-2">{error}</small> : <small className="tadm-barcodescanner-node-3">Camera scanning not available. Type or use a USB barcode scanner here.</small>}
        </>}
    </div>;
}
