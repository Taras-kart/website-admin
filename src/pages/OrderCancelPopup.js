import React, { useEffect, useState } from 'react';
import './OrderCancelPopup.css';
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
  "ocp-backdrop": ["tadm-ordercancelpopup-ocp-backdrop"],
  "ocp-dialog": ["tadm-ordercancelpopup-ocp-dialog"],
  "ocp-header": ["tadm-ordercancelpopup-ocp-header"],
  "ocp-header-main": ["tadm-ordercancelpopup-ocp-header-main"],
  "ocp-header-top": ["tadm-ordercancelpopup-ocp-header-top"],
  "ocp-header-icon": ["tadm-ordercancelpopup-ocp-header-icon"],
  "ocp-header-text": ["tadm-ordercancelpopup-ocp-header-text"],
  "ocp-title": ["tadm-ordercancelpopup-ocp-title"],
  "ocp-chip-subtle": ["tadm-ordercancelpopup-ocp-chip-subtle"],
  "ocp-subtitle": ["tadm-ordercancelpopup-ocp-subtitle"],
  "ocp-close-btn": ["tadm-ordercancelpopup-ocp-close-btn"],
  "ocp-section": ["tadm-ordercancelpopup-ocp-section"],
  "ocp-section-summary": ["tadm-ordercancelpopup-ocp-section-summary"],
  "ocp-summary-row": ["tadm-ordercancelpopup-ocp-summary-row"],
  "ocp-summary-row-secondary": ["tadm-ordercancelpopup-ocp-summary-row-secondary"],
  "ocp-summary-block": ["tadm-ordercancelpopup-ocp-summary-block"],
  "ocp-summary-right": ["tadm-ordercancelpopup-ocp-summary-right"],
  "ocp-label": ["tadm-ordercancelpopup-ocp-label"],
  "ocp-value": ["tadm-ordercancelpopup-ocp-value"],
  "ocp-subvalue": ["tadm-ordercancelpopup-ocp-subvalue"],
  "ocp-value-strong": ["tadm-ordercancelpopup-ocp-value-strong"],
  "ocp-summary-pill-row": ["tadm-ordercancelpopup-ocp-summary-pill-row"],
  "ocp-chip": ["tadm-ordercancelpopup-ocp-chip"],
  "ocp-chip-payment": ["tadm-ordercancelpopup-ocp-chip-payment"],
  "ocp-chip-neutral": ["tadm-ordercancelpopup-ocp-chip-neutral"],
  "ocp-chip-cancelled": ["tadm-ordercancelpopup-ocp-chip-cancelled"],
  "ocp-summary-meta": ["tadm-ordercancelpopup-ocp-summary-meta"],
  "ocp-meta-label": ["tadm-ordercancelpopup-ocp-meta-label"],
  "ocp-meta-value": ["tadm-ordercancelpopup-ocp-meta-value"],
  "ocp-banner": ["tadm-ordercancelpopup-ocp-banner"],
  "ocp-body-scroll": ["tadm-ordercancelpopup-ocp-body-scroll"],
  "ocp-field-label": ["tadm-ordercancelpopup-ocp-field-label"],
  "ocp-radio-group": ["tadm-ordercancelpopup-ocp-radio-group"],
  "ocp-radio": ["tadm-ordercancelpopup-ocp-radio"],
  "ocp-textarea": ["tadm-ordercancelpopup-ocp-textarea"],
  "ocp-section-confirm": ["tadm-ordercancelpopup-ocp-section-confirm"],
  "ocp-confirm-cards": ["tadm-ordercancelpopup-ocp-confirm-cards"],
  "ocp-checkbox-card": ["tadm-ordercancelpopup-ocp-checkbox-card"],
  "ocp-checkbox-inner": ["tadm-ordercancelpopup-ocp-checkbox-inner"],
  "ocp-checkbox-text": ["tadm-ordercancelpopup-ocp-checkbox-text"],
  "ocp-checkbox-title": ["tadm-ordercancelpopup-ocp-checkbox-title"],
  "ocp-checkbox-desc": ["tadm-ordercancelpopup-ocp-checkbox-desc"],
  "ocp-footer": ["tadm-ordercancelpopup-ocp-footer"],
  "ocp-btn-secondary": ["tadm-ordercancelpopup-ocp-btn-secondary"],
  "ocp-btn-primary": ["tadm-ordercancelpopup-ocp-btn-primary"],
  "ocp-btn-primary-disabled": ["tadm-ordercancelpopup-ocp-btn-primary-disabled"]
})[name] || ["tadm-ordercancelpopup-" + name]).join(' ');
function fmtAmount(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}
function getPayable(sale) {
  if (sale && sale.totals && sale.totals.payable != null) return Number(sale.totals.payable);
  if (sale && sale.total != null) return Number(sale.total);
  if (Array.isArray(sale?.items) && sale.items.length) {
    return sale.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
  }
  return 0;
}
function getPaymentLabel(sale) {
  if (!sale) return '-';
  const raw = String(sale.payment_status || 'COD').toUpperCase();
  if (raw.includes('COD')) return 'Cash on Delivery';
  if (raw.includes('PREPAID') || raw.includes('ONLINE') || raw.includes('PAID')) return 'Prepaid / Online';
  return raw || '-';
}
export default function OrderCancelPopup({
  open,
  sale,
  onClose,
  onConfirm,
  isSubmitting
}) {
  const [reasonType, setReasonType] = useState('stock');
  const [notes, setNotes] = useState('');
  const [confirmNotify, setConfirmNotify] = useState(false);
  const [confirmIrreversible, setConfirmIrreversible] = useState(false);
  useEffect(() => {
    if (open) {
      setReasonType('stock');
      setNotes('');
      setConfirmNotify(false);
      setConfirmIrreversible(false);
    }
  }, [open, sale?.id]);
  if (!open || !sale) return null;
  const payable = getPayable(sale);
  const paymentLabel = getPaymentLabel(sale);
  const cancelDisabled = !confirmNotify || !confirmIrreversible || isSubmitting;
  const itemCount = Array.isArray(sale.items) ? sale.items.length : 0;
  const handleBackdropClick = () => {
    if (isSubmitting) return;
    onClose && onClose();
  };
  const handleDialogClick = e => {
    e.stopPropagation();
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (cancelDisabled) return;
    const baseLabel = reasonType === 'stock' ? 'Cancelled by admin: stock or product issue' : reasonType === 'address' ? 'Cancelled by admin: address or contact issue' : reasonType === 'payment' ? 'Cancelled by admin: payment or refund risk' : reasonType === 'customer' ? 'Cancelled by admin: customer requested cancellation' : 'Cancelled by admin';
    const trimmedNotes = notes.trim();
    const finalReason = trimmedNotes ? `${baseLabel}. Notes: ${trimmedNotes}` : baseLabel;
    onConfirm && onConfirm(finalReason);
  };
  return <div className={portalClass("ocp-backdrop")} onClick={handleBackdropClick}>
      <div className={portalClass("ocp-dialog")} onClick={handleDialogClick}>
        <div className={portalClass("ocp-header")}>
          <div className={portalClass("ocp-header-main")}>
            <div className={portalClass("ocp-header-top")}>
              <div className={portalClass("ocp-header-icon")}>
                <span className="tadm-ordercancelpopup-node-0">!</span>
              </div>
              <div className={portalClass("ocp-header-text")}>
                <div className={portalClass("ocp-title")}>Cancel order</div>
                <div className={portalClass("ocp-chip-subtle")}>
                  Order #{sale.id}
                </div>
              </div>
            </div>
            <div className={portalClass("ocp-subtitle")}>
              You are cancelling this order. This will stop fulfilment and the customer should be informed clearly.
            </div>
          </div>
          <button className={portalClass("ocp-close-btn")} onClick={onClose} disabled={isSubmitting}>
            ✕
          </button>
        </div>

        <div className={portalClass("ocp-section ocp-section-summary")}>
          <div className={portalClass("ocp-summary-row")}>
            <div className={portalClass("ocp-summary-block")}>
              <div className={portalClass("ocp-label")}>Customer</div>
              <div className={portalClass("ocp-value")}>
                {sale.customer_name || '-'}
              </div>
              <div className={portalClass("ocp-subvalue")}>
                {sale.customer_mobile || 'No phone added'}
              </div>
            </div>
            <div className={portalClass("ocp-summary-block ocp-summary-right")}>
              <div className={portalClass("ocp-label")}>Amount payable</div>
              <div className={portalClass("ocp-value-strong")}>{fmtAmount(payable)}</div>
              <div className={portalClass("ocp-summary-pill-row")}>
                <div className={portalClass("ocp-chip ocp-chip-payment")}>
                  {paymentLabel}
                </div>
                {itemCount > 0 && <div className={portalClass("ocp-chip ocp-chip-neutral")}>
                    {itemCount} item{itemCount > 1 ? 's' : ''}
                  </div>}
              </div>
            </div>
          </div>
          <div className={portalClass("ocp-summary-row ocp-summary-row-secondary")}>
            <div className={portalClass("ocp-summary-block")}>
              <div className={portalClass("ocp-summary-meta")}>
                <span className={portalClass("ocp-meta-label")}>Order ID</span>
                <span className={portalClass("ocp-meta-value")}>#{sale.id}</span>
              </div>
              {sale.created_at && <div className={portalClass("ocp-summary-meta")}>
                  <span className={portalClass("ocp-meta-label")}>Placed on</span>
                  <span className={portalClass("ocp-meta-value")}>
                    {new Date(sale.created_at).toLocaleString()}
                  </span>
                </div>}
            </div>
          </div>
          <div className={portalClass("ocp-banner")}>
            Use a clear reason and short note. This helps your team and makes it easier to explain the cancellation to the customer.
          </div>
        </div>

        <div className={portalClass("ocp-body-scroll")}>
          <div className={portalClass("ocp-section")}>
            <div className={portalClass("ocp-field-label")}>Main reason</div>
            <div className={portalClass("ocp-radio-group")}>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="stock" checked={reasonType === 'stock'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-1" />
                <span className="tadm-ordercancelpopup-node-2">Stock or product issue (out of stock, damaged piece, wrong SKU)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="address" checked={reasonType === 'address'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-3" />
                <span className="tadm-ordercancelpopup-node-4">Address or contact issue (invalid address, phone not reachable)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="payment" checked={reasonType === 'payment'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-5" />
                <span className="tadm-ordercancelpopup-node-6">Payment or refund concern (duplicate order, suspicious payment)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="customer" checked={reasonType === 'customer'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-7" />
                <span className="tadm-ordercancelpopup-node-8">Customer requested cancellation through call or message</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="other" checked={reasonType === 'other'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-9" />
                <span className="tadm-ordercancelpopup-node-10">Other internal reason</span>
              </label>
            </div>
            <textarea className={portalClass("ocp-textarea")} placeholder="Short note for internal use and for customer explanation. Example: Customer asked to cancel as delivery date was too late." value={notes} onChange={e => setNotes(e.target.value)} disabled={isSubmitting} />
          </div>

          <div className={portalClass("ocp-section ocp-section-confirm")}>
            <div className={portalClass("ocp-field-label")}>Before you cancel</div>
            <div className={portalClass("ocp-confirm-cards")}>
              <label className={portalClass("ocp-checkbox-card")}>
                <div className={portalClass("ocp-checkbox-inner")}>
                  <input type="checkbox" checked={confirmNotify} onChange={e => setConfirmNotify(e.target.checked)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-11" />
                  <div className={portalClass("ocp-checkbox-text")}>
                    <div className={portalClass("ocp-checkbox-title")}>
                      Inform the customer
                    </div>
                    <div className={portalClass("ocp-checkbox-desc")}>
                      I will make sure the customer is told that this order is cancelled and why it was cancelled.
                    </div>
                  </div>
                </div>
              </label>
              <label className={portalClass("ocp-checkbox-card")}>
                <div className={portalClass("ocp-checkbox-inner")}>
                  <input type="checkbox" checked={confirmIrreversible} onChange={e => setConfirmIrreversible(e.target.checked)} disabled={isSubmitting} className="tadm-ordercancelpopup-node-12" />
                  <div className={portalClass("ocp-checkbox-text")}>
                    <div className={portalClass("ocp-checkbox-title")}>
                      Final action
                    </div>
                    <div className={portalClass("ocp-checkbox-desc")}>
                      I understand this action cannot be reversed here. The order status will be set to cancelled.
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={portalClass("ocp-footer")}>
          <button type="button" className={portalClass("ocp-btn-secondary")} onClick={onClose} disabled={isSubmitting}>
            Keep order
          </button>
          <button type="button" className={portalClass(cancelDisabled ? 'ocp-btn-primary ocp-btn-primary-disabled' : 'ocp-btn-primary')} disabled={cancelDisabled} onClick={handleSubmit}>
            {isSubmitting ? 'Cancelling…' : 'Confirm cancellation'}
          </button>
        </div>
      </div>
    </div>;
}
