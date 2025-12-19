import React, { useEffect, useMemo, useState } from 'react';
import './OrderDetailPopup.css';
import { useAuth } from './AdminAuth';

export default function OrderDetailPopup({
  open,
  loading,
  detail,
  onClose,
  apiBase,
  orderSteps,
  statusText,
  computeStepFromLocal,
  computeStepFromShiprocket,
  computeStepFromShipment,
  buildExpectedDeliveryText,
  fmt
}) {
  const { token } = useAuth();

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const [courierLoading, setCourierLoading] = useState(false);
  const [courierError, setCourierError] = useState('');
  const [courierData, setCourierData] = useState(null);
  const [selectedCourierId, setSelectedCourierId] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionOk, setActionOk] = useState('');

  const [localShipment, setLocalShipment] = useState(null);

  const sale = detail?.sale || null;
  const items = Array.isArray(detail?.items) ? detail.items : [];
  const shipments = Array.isArray(detail?.shipments) ? detail.shipments : [];
  const trackingSnapshot =
    detail?.trackingSnapshot ||
    {
      status: '',
      eddText: null,
      lastEventText: null,
      core: null
    };

  const latestShipmentFromDetail = detail?.latestShipment || (shipments.length ? shipments[shipments.length - 1] : null);
  const latestShipment = localShipment || latestShipmentFromDetail;

  const localOrderStatus = sale ? statusText(sale.status || 'PLACED') : '';
  const isCancelled = localOrderStatus === 'CANCELLED';

  const shiprocketStatus = statusText(trackingSnapshot.status);
  const shipmentStepIndex = computeStepFromShipment(latestShipment, trackingSnapshot.core);
  const baseLocalStep = computeStepFromLocal(localOrderStatus);
  const baseShiprocketStep = computeStepFromShiprocket(shiprocketStatus);

  const effectiveStepIndex = sale ? Math.max(baseLocalStep, baseShiprocketStep, shipmentStepIndex) : 0;

  const placedText = sale?.created_at ? new Date(sale.created_at).toLocaleString('en-IN') : '-';
  const expectedDelivery = sale ? buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) : '-';

  const lastUpdateTime = (() => {
    if (!detail) return '-';
    if (trackingSnapshot.lastEventText) return trackingSnapshot.lastEventText;
    const fallbackTime = latestShipment?.updated_at || latestShipment?.created_at || sale?.updated_at || sale?.created_at;
    if (!fallbackTime) return '-';
    const t = new Date(fallbackTime);
    if (Number.isNaN(t.getTime())) return '-';
    return t.toLocaleString('en-IN');
  })();

  const hasShipments = !!latestShipment;
  const hasAwb = !!latestShipment?.awb;
  const hasShipmentId = !!latestShipment?.shipment_id || !!latestShipment?.shiprocket_shipment_id;
  const shipmentId = latestShipment?.shipment_id || latestShipment?.shiprocket_shipment_id || null;
  const shiprocketOrderId = latestShipment?.shiprocket_order_id || latestShipment?.order_id || null;

  const availableCouriers = courierData?.data?.available_courier_companies || [];
  const recommendedCourierCompanyId =
    courierData?.data?.recommended_courier_company_id ||
    courierData?.data?.shiprocket_recommended_courier_id ||
    null;

  useEffect(() => {
    if (!open) {
      setCourierLoading(false);
      setCourierError('');
      setCourierData(null);
      setSelectedCourierId(null);
      setActionLoading(false);
      setActionError('');
      setActionOk('');
      setLocalShipment(null);
    }
  }, [open]);

  useEffect(() => {
    if (!courierData) return;
    const initial =
      selectedCourierId ||
      recommendedCourierCompanyId ||
      (availableCouriers.length ? availableCouriers[0]?.courier_company_id : null);
    if (initial) setSelectedCourierId(initial);
  }, [courierData]);

  const tryFetchJson = async (url, options) => {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => null);
    return { res, json };
  };

  const loadServiceability = async () => {
    if (!sale?.id) return;
    setCourierLoading(true);
    setCourierError('');
    setCourierData(null);
    setSelectedCourierId(null);
    setActionOk('');
    try {
      const candidates = [
        {
          url: `${apiBase}/api/shiprocket/serviceability/by-sale/${sale.id}`,
          opts: { headers: { ...authHeaders } }
        },
        {
          url: `${apiBase}/api/shiprocket/serviceability/sale/${sale.id}`,
          opts: { headers: { ...authHeaders } }
        },
        {
          url: `${apiBase}/api/shiprocket/serviceability/${sale.id}`,
          opts: { headers: { ...authHeaders } }
        }
      ];

      let ok = false;
      let payload = null;

      for (const c of candidates) {
        try {
          const { res, json } = await tryFetchJson(c.url, c.opts);
          if (res.ok && json) {
            ok = true;
            payload = json;
            break;
          }
        } catch {
          ok = false;
        }
      }

      if (!ok) {
        setCourierError('Could not fetch courier options for this order. Please check backend Shiprocket serviceability route.');
        return;
      }

      setCourierData(payload);
    } finally {
      setCourierLoading(false);
    }
  };

  const assignCourierAndGenerateAwb = async () => {
    if (!sale?.id) return;
    if (!selectedCourierId) {
      setActionError('Please select a courier partner.');
      return;
    }

    setActionLoading(true);
    setActionError('');
    setActionOk('');

    try {
      const body = {
        sale_id: sale.id,
        courier_company_id: Number(selectedCourierId)
      };

      const candidates = [
        {
          url: `${apiBase}/api/shiprocket/assign-courier`,
          opts: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(body)
          }
        },
        {
          url: `${apiBase}/api/shiprocket/assign-awb`,
          opts: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(body)
          }
        },
        {
          url: `${apiBase}/api/shiprocket/assign-courier/by-sale/${sale.id}`,
          opts: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ courier_company_id: Number(selectedCourierId) })
          }
        }
      ];

      let ok = false;
      let payload = null;

      for (const c of candidates) {
        try {
          const { res, json } = await tryFetchJson(c.url, c.opts);
          if (res.ok && json) {
            ok = true;
            payload = json;
            break;
          }
        } catch {
          ok = false;
        }
      }

      if (!ok) {
        setActionError('Could not assign courier / generate AWB. Please check backend Shiprocket AWB route.');
        return;
      }

      const nextShipment = {
        ...(latestShipment || {}),
        awb: payload?.awb || payload?.data?.awb || payload?.shipment?.awb || latestShipment?.awb,
        courier_name:
          payload?.courier_name ||
          payload?.data?.courier_name ||
          payload?.shipment?.courier_name ||
          latestShipment?.courier_name,
        courier_company_id:
          payload?.courier_company_id ||
          payload?.data?.courier_company_id ||
          payload?.shipment?.courier_company_id ||
          latestShipment?.courier_company_id,
        shiprocket_order_id:
          payload?.shiprocket_order_id ||
          payload?.data?.shiprocket_order_id ||
          payload?.shipment?.shiprocket_order_id ||
          latestShipment?.shiprocket_order_id,
        shipment_id:
          payload?.shipment_id ||
          payload?.data?.shipment_id ||
          payload?.shipment?.shipment_id ||
          latestShipment?.shipment_id,
        shiprocket_shipment_id:
          payload?.shiprocket_shipment_id ||
          payload?.data?.shiprocket_shipment_id ||
          payload?.shipment?.shiprocket_shipment_id ||
          latestShipment?.shiprocket_shipment_id,
        status: payload?.status || payload?.shipment_status || latestShipment?.status
      };

      setLocalShipment(nextShipment);
      setActionOk('Courier assigned and AWB generated.');
    } finally {
      setActionLoading(false);
    }
  };

  const requestPickup = async () => {
    const sid = shipmentId || localShipment?.shipment_id || localShipment?.shiprocket_shipment_id;
    if (!sid) {
      setActionError('Shipment id not available. Generate AWB first.');
      return;
    }

    setActionLoading(true);
    setActionError('');
    setActionOk('');

    try {
      const body = { shipment_id: [Number(sid)] };

      const candidates = [
        {
          url: `${apiBase}/api/shiprocket/pickup`,
          opts: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(body)
          }
        },
        {
          url: `${apiBase}/api/shiprocket/pickup/by-sale/${sale.id}`,
          opts: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ shipment_id: Number(sid) })
          }
        }
      ];

      let ok = false;

      for (const c of candidates) {
        try {
          const { res } = await tryFetchJson(c.url, c.opts);
          if (res.ok) {
            ok = true;
            break;
          }
        } catch {
          ok = false;
        }
      }

      if (!ok) {
        setActionError('Could not create pickup request. Please check backend Shiprocket pickup route.');
        return;
      }

      setActionOk('Pickup requested successfully.');
    } finally {
      setActionLoading(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  if (!open) return null;

  const shiprocketBaseUrl = 'https://app.shiprocket.in';

  const courierSummary = (c) => {
    const price = c?.rate ?? c?.freight_charge ?? c?.cost ?? null;
    const etd = c?.etd || null;
    const days = c?.estimated_delivery_days || null;
    const rating = c?.rating ?? null;
    const mode = c?.is_surface ? 'Surface' : c?.mode === 0 ? 'Surface' : 'Air';
    return { price, etd, days, rating, mode };
  };

  const selectedCourier = availableCouriers.find((c) => Number(c.courier_company_id) === Number(selectedCourierId)) || null;
  const selectedCourierMeta = selectedCourier ? courierSummary(selectedCourier) : null;

  return (
    <div className="orders-modal-backdrop" onClick={onClose}>
      <div className="orders-modal orders-modal-detail odp-modal" onClick={stop}>
        {loading ? (
          <div className="orders-loader">
            <div className="orders-spinner" />
            <span className="orders-loader-text">Loading order details</span>
          </div>
        ) : !detail || !sale ? (
          <div className="orders-empty-state">
            <div className="orders-empty-icon" />
            <h3 className="orders-empty-title">Unable to load order</h3>
            <p className="orders-empty-text">Please refresh and try again.</p>
            <button className="orders-btn-small odp-btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="orders-modal-header">
              <div>
                <h3 className="orders-modal-title">Order #{sale?.id}</h3>
                <p className="orders-modal-subtitle">Placed on {placedText}</p>
              </div>
              <div className="orders-modal-header-actions">
                <span className={`orders-status-pill orders-status-${String(sale?.status || '').toLowerCase()} orders-status-pill-lg`}>
                  {localOrderStatus || '-'}
                </span>
                <button className="orders-btn-small orders-btn-ghost" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>

            <div className="orders-meta-grid">
              <div className="orders-meta-item">
                <div className="orders-meta-label">Payment</div>
                <div className="orders-meta-value">{String(sale?.payment_status || 'COD').toUpperCase()}</div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Customer</div>
                <div className="orders-meta-value">
                  {sale?.customer_name || (sale?.branch_id ? `Branch #${sale.branch_id}` : '-')}
                  {sale?.customer_mobile ? ` · ${sale?.customer_mobile}` : ''}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Email</div>
                <div className="orders-meta-value">{sale?.customer_email || '-'}</div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Amount payable</div>
                <div className="orders-meta-value orders-meta-value-strong">{fmt(sale?.totals?.payable ?? sale?.total)}</div>
              </div>
            </div>

            <div className="orders-progress-card">
              <div className="orders-progress-header">
                <div className="orders-progress-header-main">
                  <div className="orders-progress-title">Fulfilment progress</div>
                  <div className="orders-progress-header-sub">Live view of where this order is in the journey</div>
                </div>
                <div className="orders-progress-status-pill">
                  {isCancelled ? 'Order cancelled' : effectiveStepIndex === orderSteps.length - 1 ? 'Delivered to customer' : `Currently ${orderSteps[effectiveStepIndex].toLowerCase()}`}
                </div>
              </div>

              <div className={`orders-timeline ${isCancelled ? 'orders-timeline-cancelled' : ''}`}>
                <div className="orders-timeline-line" />
                <div className="orders-timeline-steps">
                  {orderSteps.map((step, index) => {
                    const stepState = isCancelled && step !== 'PLACED' ? 'upcoming' : index < effectiveStepIndex ? 'done' : index === effectiveStepIndex ? 'active' : 'upcoming';
                    return (
                      <div className="orders-timeline-step" key={step}>
                        <div className={`orders-timeline-dot orders-timeline-dot-${stepState}`} />
                        <div className="orders-timeline-label">{step}</div>
                        <div className="orders-timeline-caption">
                          {step === 'PLACED' && 'Order captured in the system'}
                          {step === 'CONFIRMED' && 'Details verified by the team'}
                          {step === 'PACKED' && 'Items packed and ready to ship'}
                          {step === 'SHIPPED' && 'With the courier for delivery'}
                          {step === 'DELIVERED' && 'Delivered to the customer'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="orders-progress-footer">
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">AWB</span>
                  <span className="orders-progress-meta-value">{latestShipment?.awb || '-'}</span>
                </div>
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">Expected delivery</span>
                  <span className="orders-progress-meta-value">{expectedDelivery}</span>
                </div>
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">Last update</span>
                  <span className="orders-progress-meta-value">{lastUpdateTime}</span>
                </div>
                <div className="orders-progress-meta orders-progress-meta-actions">
                  {hasShipments ? (
                    <div className="orders-doc-buttons">
                      <a
                        href={`${apiBase}/api/shiprocket/label/${sale?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="orders-btn-small"
                      >
                        Label
                      </a>
                      <a
                        href={`${apiBase}/api/shiprocket/invoice/${sale?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="orders-btn-small"
                      >
                        Tax invoice
                      </a>
                      <a
                        href={`${apiBase}/api/shiprocket/manifest/${sale?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="orders-btn-small"
                      >
                        Manifest
                      </a>
                    </div>
                  ) : (
                    <a href={shiprocketBaseUrl} target="_blank" rel="noopener noreferrer" className="orders-btn-small">
                      Go to Shiprocket
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="odp-courier-card">
              <div className="odp-courier-head">
                <div>
                  <div className="odp-courier-title">Courier partner</div>
                  <div className="odp-courier-sub">
                    {hasAwb ? 'Courier is already assigned for this order.' : 'Fetch courier options, select partner, and generate AWB from here.'}
                  </div>
                </div>

                <div className="odp-courier-actions">
                  {!hasAwb ? (
                    <button className="orders-btn-small" onClick={loadServiceability} disabled={courierLoading || actionLoading}>
                      {courierLoading ? 'Loading couriers…' : 'Get courier options'}
                    </button>
                  ) : (
                    <button className="orders-btn-small odp-muted-btn" disabled>
                      AWB Generated
                    </button>
                  )}
                </div>
              </div>

              {courierError ? <div className="odp-alert odp-alert-error">{courierError}</div> : null}
              {actionError ? <div className="odp-alert odp-alert-error">{actionError}</div> : null}
              {actionOk ? <div className="odp-alert odp-alert-ok">{actionOk}</div> : null}

              {courierData && !hasAwb ? (
                <>
                  <div className="odp-courier-summary">
                    <div className="odp-summary-pill">
                      <span className="odp-summary-label">Recommended</span>
                      <span className="odp-summary-value">{recommendedCourierCompanyId ? `#${recommendedCourierCompanyId}` : '-'}</span>
                    </div>
                    <div className="odp-summary-pill">
                      <span className="odp-summary-label">Available</span>
                      <span className="odp-summary-value">{availableCouriers.length}</span>
                    </div>
                    <div className="odp-summary-pill">
                      <span className="odp-summary-label">COD</span>
                      <span className="odp-summary-value">{String(courierData?.data?.cod ? 'Yes' : 'No')}</span>
                    </div>
                  </div>

                  <div className="odp-courier-list">
                    {availableCouriers.length ? (
                      availableCouriers.map((c) => {
                        const meta = courierSummary(c);
                        const isSelected = Number(selectedCourierId) === Number(c.courier_company_id);
                        const isRecommended = recommendedCourierCompanyId && Number(recommendedCourierCompanyId) === Number(c.courier_company_id);
                        return (
                          <button
                            key={String(c.id || c.courier_company_id)}
                            type="button"
                            className={`odp-courier-row ${isSelected ? 'odp-courier-row-selected' : ''}`}
                            onClick={() => setSelectedCourierId(Number(c.courier_company_id))}
                          >
                            <div className="odp-courier-left">
                              <div className="odp-courier-name">
                                <span className="odp-courier-radio" aria-hidden="true">
                                  <span className={`odp-courier-radio-dot ${isSelected ? 'on' : ''}`} />
                                </span>
                                <span>{c.courier_name || `Courier #${c.courier_company_id}`}</span>
                                {isRecommended ? <span className="odp-tag">Recommended</span> : null}
                                {c.blocked ? <span className="odp-tag odp-tag-danger">Blocked</span> : null}
                              </div>
                              <div className="odp-courier-meta">
                                <span>{meta.mode}</span>
                                {meta.days ? <span>· {meta.days} days</span> : null}
                                {meta.etd ? <span>· ETD {meta.etd}</span> : null}
                                {meta.rating ? <span>· ⭐ {meta.rating}</span> : null}
                              </div>
                            </div>
                            <div className="odp-courier-right">
                              <div className="odp-courier-price">{meta.price != null && meta.price !== '' ? fmt(meta.price) : '-'}</div>
                              <div className="odp-courier-id">#{c.courier_company_id}</div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="odp-empty">No couriers returned for this order.</div>
                    )}
                  </div>

                  <div className="odp-action-bar">
                    <div className="odp-action-left">
                      <div className="odp-action-title">Selected</div>
                      <div className="odp-action-sub">
                        {selectedCourier ? selectedCourier.courier_name : 'No courier selected'}
                        {selectedCourierMeta?.price != null && selectedCourierMeta?.price !== '' ? ` · ${fmt(selectedCourierMeta.price)}` : ''}
                        {selectedCourierMeta?.days ? ` · ${selectedCourierMeta.days} days` : ''}
                      </div>
                    </div>

                    <div className="odp-action-right">
                      <button
                        className="orders-btn-small odp-primary-btn"
                        onClick={assignCourierAndGenerateAwb}
                        disabled={actionLoading || courierLoading || !selectedCourierId}
                      >
                        {actionLoading ? 'Processing…' : 'Pay & Generate AWB'}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {hasAwb ? (
                <div className="odp-awb-panel">
                  <div className="odp-awb-grid">
                    <div className="odp-awb-item">
                      <div className="odp-awb-label">Courier</div>
                      <div className="odp-awb-value">{latestShipment?.courier_name || latestShipment?.courier || '-'}</div>
                    </div>
                    <div className="odp-awb-item">
                      <div className="odp-awb-label">AWB</div>
                      <div className="odp-awb-value">{latestShipment?.awb}</div>
                    </div>
                    <div className="odp-awb-item">
                      <div className="odp-awb-label">Shipment id</div>
                      <div className="odp-awb-value">{shipmentId || '-'}</div>
                    </div>
                    <div className="odp-awb-item">
                      <div className="odp-awb-label">Shiprocket order</div>
                      <div className="odp-awb-value">{shiprocketOrderId || '-'}</div>
                    </div>
                  </div>

                  <div className="odp-awb-actions">
                    <button className="orders-btn-small" onClick={requestPickup} disabled={actionLoading}>
                      {actionLoading ? 'Working…' : 'Request pickup'}
                    </button>

                    <a
                      href={`${apiBase}/api/shiprocket/label/${sale?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orders-btn-small"
                    >
                      Open label
                    </a>

                    <a
                      href={`${apiBase}/api/shiprocket/invoice/${sale?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orders-btn-small"
                    >
                      Open invoice
                    </a>

                    <a
                      href={`${apiBase}/api/shiprocket/manifest/${sale?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orders-btn-small"
                    >
                      Open manifest
                    </a>
                  </div>

                  <div className="odp-awb-note">
                    After pickup request is successful, generate manifest from backend flow if required, then print manifest.
                  </div>
                </div>
              ) : null}
            </div>

            {sale?.shipping_address ? (
              <div className="orders-shipping-card">
                <div className="orders-shipping-header">
                  <h4 className="orders-shipping-title">Shipping address</h4>
                  <span className="orders-shipping-tag">Delivery</span>
                </div>
                <div className="orders-shipping-body">
                  <p>{sale.shipping_address.line1}</p>
                  {sale.shipping_address.line2 ? <p>{sale.shipping_address.line2}</p> : null}
                  <p>
                    {sale.shipping_address.city} {sale.shipping_address.state} - {sale.shipping_address.pincode}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="orders-items-header">
              <div>
                <p className="orders-items-title">Items in this order</p>
                <p className="orders-items-subtitle">
                  {items.length} item{items.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="orders-items-grid">
              {items.length ? (
                items.map((it, i) => (
                  <div className="orders-item-card" key={`${it.variant_id}-${i}`}>
                    <div className="orders-item-media">
                      {it.image_url ? <img src={it.image_url} alt="" /> : <div className="orders-item-placeholder" />}
                    </div>
                    <div className="orders-item-main">
                      <div className="orders-item-top">
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Variant</span>
                          <span className="orders-item-value">#{it.variant_id}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Size</span>
                          <span className="orders-item-value">{it.size || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Colour</span>
                          <span className="orders-item-value">{it.colour || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">EAN</span>
                          <span className="orders-item-value orders-text-soft">{it.ean_code || '-'}</span>
                        </div>
                      </div>
                      <div className="orders-item-pricing">
                        <div className="orders-item-qty">x{it.qty}</div>
                        <div className="orders-item-price">{fmt(it.price)}</div>
                        {it.mrp != null && Number(it.mrp) > 0 ? <div className="orders-item-mrp">MRP {fmt(it.mrp)}</div> : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="orders-empty-inline">No items in this order</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
