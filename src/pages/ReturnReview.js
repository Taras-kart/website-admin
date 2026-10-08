import React, { useEffect, useState, useCallback } from 'react';
import './ReturnReview.css';
import { useParams, useNavigate } from 'react-router-dom';
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
  "rr-screen": ["tadm-returnreview-rr-screen"],
  "rr-layout": ["tadm-returnreview-rr-layout"],
  "rr-header": ["tadm-returnreview-rr-header"],
  "rr-header-main": ["tadm-returnreview-rr-header-main"],
  "rr-back-btn": ["tadm-returnreview-rr-back-btn"],
  "rr-back-icon": ["tadm-returnreview-rr-back-icon"],
  "rr-header-title-block": ["tadm-returnreview-rr-header-title-block"],
  "rr-title": ["tadm-returnreview-rr-title"],
  "rr-subtitle": ["tadm-returnreview-rr-subtitle"],
  "rr-header-tags": ["tadm-returnreview-rr-header-tags"],
  "rr-pill": ["tadm-returnreview-rr-pill"],
  "rr-pill-status": ["tadm-returnreview-rr-pill-status"],
  "rr-pill-status-requested": ["tadm-returnreview-rr-pill-status-requested"],
  "rr-pill-status-approved": ["tadm-returnreview-rr-pill-status-approved"],
  "rr-pill-status-rejected": ["tadm-returnreview-rr-pill-status-rejected"],
  "rr-pill-refund": ["tadm-returnreview-rr-pill-refund"],
  "rr-pill-refund-not-started": ["tadm-returnreview-rr-pill-refund-not-started"],
  "rr-pill-refund-pending-refund": ["tadm-returnreview-rr-pill-refund-pending-refund"],
  "rr-pill-refund-refunded": ["tadm-returnreview-rr-pill-refund-refunded"],
  "rr-loader": ["tadm-returnreview-rr-loader"],
  "rr-spinner": ["tadm-returnreview-rr-spinner"],
  "rr-loader-text": ["tadm-returnreview-rr-loader-text"],
  "rr-empty": ["tadm-returnreview-rr-empty"],
  "rr-empty-title": ["tadm-returnreview-rr-empty-title"],
  "rr-empty-text": ["tadm-returnreview-rr-empty-text"],
  "rr-primary-btn": ["tadm-returnreview-rr-primary-btn"],
  "ghost": ["tadm-returnreview-ghost"],
  "rr-danger-btn": ["tadm-returnreview-rr-danger-btn"],
  "rr-error": ["tadm-returnreview-rr-error"],
  "rr-top-grid": ["tadm-returnreview-rr-top-grid"],
  "rr-bottom-grid": ["tadm-returnreview-rr-bottom-grid"],
  "rr-card": ["tadm-returnreview-rr-card"],
  "rr-card-header": ["tadm-returnreview-rr-card-header"],
  "rr-card-caption": ["tadm-returnreview-rr-card-caption"],
  "rr-summary-grid": ["tadm-returnreview-rr-summary-grid"],
  "rr-summary-item": ["tadm-returnreview-rr-summary-item"],
  "rr-label": ["tadm-returnreview-rr-label"],
  "rr-value": ["tadm-returnreview-rr-value"],
  "rr-chip": ["tadm-returnreview-rr-chip"],
  "rr-section-block": ["tadm-returnreview-rr-section-block"],
  "rr-box": ["tadm-returnreview-rr-box"],
  "rr-box-line": ["tadm-returnreview-rr-box-line"],
  "rr-box-text": ["tadm-returnreview-rr-box-text"],
  "rr-tag-mini": ["tadm-returnreview-rr-tag-mini"],
  "rr-card-bank": ["tadm-returnreview-rr-card-bank"],
  "rr-form-grid": ["tadm-returnreview-rr-form-grid"],
  "rr-form-field": ["tadm-returnreview-rr-form-field"],
  "rr-form-field-full": ["tadm-returnreview-rr-form-field-full"],
  "rr-note": ["tadm-returnreview-rr-note"],
  "rr-card-evidence": ["tadm-returnreview-rr-card-evidence"],
  "rr-evidence-empty": ["tadm-returnreview-rr-evidence-empty"],
  "rr-evidence-grid": ["tadm-returnreview-rr-evidence-grid"],
  "rr-evidence-item": ["tadm-returnreview-rr-evidence-item"],
  "rr-evidence-thumb": ["tadm-returnreview-rr-evidence-thumb"],
  "rr-evidence-label": ["tadm-returnreview-rr-evidence-label"],
  "rr-card-actions": ["tadm-returnreview-rr-card-actions"],
  "rr-action-section": ["tadm-returnreview-rr-action-section"],
  "rr-action-row": ["tadm-returnreview-rr-action-row"],
  "rr-divider": ["tadm-returnreview-rr-divider"],
  "rr-refund-line": ["tadm-returnreview-rr-refund-line"],
  "rr-refund-pill": ["tadm-returnreview-rr-refund-pill"],
  "rr-message": ["tadm-returnreview-rr-message"],
  "rr-message-ok": ["tadm-returnreview-rr-message-ok"],
  "rr-message-error": ["tadm-returnreview-rr-message-error"]
})[name] || ["tadm-returnreview-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('en-IN');
}
function formatPriceFromTotals(totals) {
  if (!totals) return '';
  try {
    const obj = typeof totals === 'string' ? JSON.parse(totals) : totals;
    const payable = Number(obj.payable || 0);
    if (!payable) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(payable);
  } catch {
    return '';
  }
}
export default function ReturnReview() {
  const {
    id: requestIdParam
  } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('ok');
  const loadRequest = useCallback(async () => {
    if (!requestIdParam) {
      setLoading(false);
      setError('Missing request id');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/${requestIdParam}`, {
        cache: 'no-store'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Unable to load request');
      }
      if (!data || !data.ok || !data.request) {
        throw new Error('Invalid response from server');
      }
      setRequest(data.request);
    } catch (e) {
      setError(e.message || 'Unable to load request');
    } finally {
      setLoading(false);
    }
  }, [requestIdParam]);
  useEffect(() => {
    loadRequest();
  }, [loadRequest]);
  async function handleApprove() {
    if (!request) return;
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/${request.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to approve request');
      }
      setMessageType('ok');
      setMessage('Request approved successfully. Refund is now approved and pending completion.');
      await loadRequest();
    } catch (e) {
      setMessageType('error');
      setMessage(e.message || 'Error approving request.');
    } finally {
      setActionLoading(false);
    }
  }
  async function handleReject() {
    if (!request) return;
    if (!rejectReason.trim()) {
      setMessageType('error');
      setMessage('Please enter a reason before rejecting.');
      return;
    }
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/${request.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: rejectReason
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to reject request');
      }
      setMessageType('ok');
      setMessage('Request rejected successfully.');
      await loadRequest();
    } catch (e) {
      setMessageType('error');
      setMessage(e.message || 'Error rejecting request.');
    } finally {
      setActionLoading(false);
    }
  }
  async function handleRefundComplete() {
    if (!request) return;
    setRefundLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/returns/${request.id}/refund-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to mark refund as completed');
      }
      setMessageType('ok');
      setMessage('Refund marked as completed.');
      await loadRequest();
    } catch (e) {
      setMessageType('error');
      setMessage(e.message || 'Error updating refund status.');
    } finally {
      setRefundLoading(false);
    }
  }
  if (loading) {
    return <div className={portalClass("rr-screen")}>
        
        <div className={portalClass("rr-layout")}>
          <div className={portalClass("rr-loader")}>
            <div className={portalClass("rr-spinner")} />
            <div className={portalClass("rr-loader-text")}>Loading return request…</div>
          </div>
        </div>
      </div>;
  }
  if (error || !request) {
    return <div className={portalClass("rr-screen")}>
        
        <div className={portalClass("rr-layout")}>
          <div className={portalClass("rr-empty")}>
            <h2 className={portalClass("rr-empty-title")}>Unable to open request</h2>
            <p className={portalClass("rr-empty-text")}>{error || 'Request not found.'}</p>
            <button type="button" className={portalClass("rr-primary-btn")} onClick={() => navigate('/returns')}>
              Back to returns
            </button>
          </div>
        </div>
      </div>;
  }
  const sale = request.sale || {};
  const images = Array.isArray(request.image_urls) ? request.image_urls : [];
  const bank = request.bank_details || {};
  const status = String(request.status || 'REQUESTED').toUpperCase();
  const refundStatus = String(request.refund_status || '').toUpperCase();
  const statusClass = status.toLowerCase();
  const refundClass = refundStatus ? refundStatus.toLowerCase() : 'not-started';
  const isRequested = status === 'REQUESTED';
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';
  const canDecide = isRequested;
  const canMarkRefundComplete = refundStatus === 'PENDING_REFUND';
  let progressLabel = 'Requested';
  if (refundStatus === 'REFUNDED') {
    progressLabel = 'Refund completed';
  } else if (refundStatus === 'PENDING_REFUND') {
    progressLabel = 'Refund approved';
  } else if (isRejected) {
    progressLabel = 'Rejected by admin';
  } else if (isApproved) {
    progressLabel = 'Accepted by admin';
  }
  return <div className={portalClass("rr-screen")}>
      
      <div className={portalClass("rr-layout")}>
        <header className={portalClass("rr-header")}>
          <div className={portalClass("rr-header-main")}>
            <button type="button" className={portalClass("rr-back-btn")} onClick={() => navigate('/returns')}>
              <span className={portalClass("rr-back-icon")} />
              <span className="tadm-returnreview-node-0">Back to returns</span>
            </button>
            <div className={portalClass("rr-header-title-block")}>
              <h1 className={portalClass("rr-title")}>Return / refund review</h1>
              <p className={portalClass("rr-subtitle")}>
                Review product images and bank details, then approve, reject, or complete the refund.
              </p>
            </div>
          </div>
          <div className={portalClass("rr-header-tags")}>
            <span className={portalClass(`rr-pill rr-pill-status rr-pill-status-${statusClass}`)}>
              Status: {status}
            </span>
            <span className={portalClass(`rr-pill rr-pill-refund rr-pill-refund-${refundClass}`)}>
              Refund: {refundStatus || 'Not started'}
            </span>
          </div>
        </header>

        <div className={portalClass("rr-top-grid")}>
          <div className={portalClass("rr-card")}>
            <div className={portalClass("rr-card-header")}>
              <h2 className="tadm-returnreview-node-1">Order and customer</h2>
              <div className={portalClass("rr-card-caption")}>
                Request ID {request.id} for order {sale.id || request.sale_id}
              </div>
            </div>

            <div className={portalClass("rr-summary-grid")}>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Request type</div>
                <div className={portalClass("rr-value")}>
                  {request.type === 'REFUND' ? 'Refund' : request.type === 'REPLACE' ? 'Replacement' : 'Return'}
                </div>
              </div>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Order ID</div>
                <div className={portalClass("rr-value")}>{sale.id || request.sale_id}</div>
              </div>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Order date</div>
                <div className={portalClass("rr-value")}>{formatDate(sale.created_at)}</div>
              </div>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Customer email</div>
                <div className={portalClass("rr-value")}>{request.customer_email || '-'}</div>
              </div>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Customer mobile</div>
                <div className={portalClass("rr-value")}>{request.customer_mobile || '-'}</div>
              </div>
              <div className={portalClass("rr-summary-item")}>
                <div className={portalClass("rr-label")}>Paid amount</div>
                <div className={portalClass("rr-value")}>
                  {sale.totals ? formatPriceFromTotals(sale.totals) : '-'}
                </div>
              </div>
            </div>

            <div className={portalClass("rr-section-block")}>
              <div className={portalClass("rr-label")}>Request notes</div>
              <div className={portalClass("rr-box")}>
                <div className={portalClass("rr-box-line")}>
                  <span className={portalClass("rr-tag-mini")}>Notes</span>
                  <span className={portalClass("rr-box-text")}>
                    {request.notes && request.notes.trim().length ? request.notes : 'No additional notes provided.'}
                  </span>
                </div>
              </div>
            </div>

            <div className={portalClass("rr-section-block")}>
              <div className={portalClass("rr-label")}>Progress</div>
              <div className={portalClass("rr-box")}>
                <div className={portalClass("rr-box-line")}>
                  <span className={portalClass("rr-tag-mini")}>Stage</span>
                  <span className={portalClass("rr-box-text")}>{progressLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={portalClass("rr-card rr-card-evidence")}>
            <div className={portalClass("rr-card-header")}>
              <h2 className="tadm-returnreview-node-2">Product images</h2>
              <div className={portalClass("rr-card-caption")}>
                Verify condition from the uploaded evidence before you approve.
              </div>
            </div>
            {images.length === 0 ? <div className={portalClass("rr-evidence-empty")}>
                No evidence images were uploaded with this request.
              </div> : <div className={portalClass("rr-evidence-grid")}>
                {images.map((url, index) => <button type="button" className={portalClass("rr-evidence-item")} key={index} onClick={() => window.open(url, '_blank', 'noopener')}>
                    <div className={portalClass("rr-evidence-thumb")}>
                      <img src={url} alt={`Evidence ${index + 1}`} className="tadm-returnreview-node-3" />
                    </div>
                    <div className={portalClass("rr-evidence-label")}>View image {index + 1}</div>
                  </button>)}
              </div>}
          </div>
        </div>

        <div className={portalClass("rr-bottom-grid")}>
          <div className={portalClass("rr-card rr-card-bank")}>
            <div className={portalClass("rr-card-header")}>
              <h2 className="tadm-returnreview-node-4">Bank / UPI details</h2>
              <div className={portalClass("rr-card-caption")}>
                Refund will be processed to these details after approval.
              </div>
            </div>
            <div className={portalClass("rr-form-grid")}>
              <div className={portalClass("rr-form-field")}>
                <label className="tadm-returnreview-node-5">Account holder name</label>
                <input type="text" value={bank.accountName || ''} disabled className="tadm-returnreview-node-6" />
              </div>
              <div className={portalClass("rr-form-field")}>
                <label className="tadm-returnreview-node-7">Bank name</label>
                <input type="text" value={bank.bankName || ''} disabled className="tadm-returnreview-node-8" />
              </div>
              <div className={portalClass("rr-form-field")}>
                <label className="tadm-returnreview-node-9">Account number</label>
                <input type="text" value={bank.accountNumber || ''} disabled className="tadm-returnreview-node-10" />
              </div>
              <div className={portalClass("rr-form-field")}>
                <label className="tadm-returnreview-node-11">IFSC code</label>
                <input type="text" value={bank.ifsc || ''} disabled className="tadm-returnreview-node-12" />
              </div>
              <div className={portalClass("rr-form-field rr-form-field-full")}>
                <label className="tadm-returnreview-node-13">UPI ID</label>
                <input type="text" value={bank.upiId || ''} disabled className="tadm-returnreview-node-14" />
              </div>
            </div>
            <div className={portalClass("rr-note")}>
              If these details look incorrect, contact the customer before initiating the refund.
            </div>
          </div>

          <div className={portalClass("rr-card rr-card-actions")}>
            <div className={portalClass("rr-action-section")}>
              <div className={portalClass("rr-card-header")}>
                <h2 className="tadm-returnreview-node-15">Decision</h2>
                <div className={portalClass("rr-card-caption")}>
                  Approve if the product condition and details are valid, otherwise reject.
                </div>
              </div>
              <div className={portalClass("rr-form-field rr-form-field-full")}>
                <label className="tadm-returnreview-node-16">Rejection reason (only required when rejecting)</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Example: Used product, missing tags, wrong images, etc." disabled={!canDecide || actionLoading} className="tadm-returnreview-node-17" />
              </div>
              <div className={portalClass("rr-action-row")}>
                <button type="button" className={portalClass("rr-primary-btn")} onClick={handleApprove} disabled={!canDecide || actionLoading}>
                  {actionLoading ? 'Processing…' : 'Approve request'}
                </button>
                <button type="button" className={portalClass("rr-danger-btn")} onClick={handleReject} disabled={!canDecide || actionLoading}>
                  {actionLoading ? 'Processing…' : 'Reject request'}
                </button>
              </div>
              {!canDecide && <div className={portalClass("rr-note")}>
                  This request is already {status.toLowerCase()}. You cannot change the decision.
                </div>}
            </div>

            <div className={portalClass("rr-divider")} />

            <div className={portalClass("rr-action-section")}>
              <div className={portalClass("rr-card-header")}>
                <h2 className="tadm-returnreview-node-18">Refund handling</h2>
                <div className={portalClass("rr-card-caption")}>
                  After you send the refund from your payment gateway or bank, mark it completed.
                </div>
              </div>
              <div className={portalClass("rr-refund-line")}>
                <span className={portalClass("rr-refund-pill")}>
                  Current refund status: {refundStatus || 'Not started'}
                </span>
                <button type="button" className={portalClass("rr-primary-btn ghost")} onClick={handleRefundComplete} disabled={!canMarkRefundComplete || refundLoading}>
                  {refundLoading ? 'Updating…' : 'Mark refund completed'}
                </button>
              </div>
              {!canMarkRefundComplete && <div className={portalClass("rr-note")}>
                  Refund can be marked completed only after the request is approved and refund is
                  pending.
                </div>}
            </div>

            {message && <div className={portalClass(`rr-message ${messageType === 'error' ? 'rr-message-error' : 'rr-message-ok'}`)}>
                {message}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
