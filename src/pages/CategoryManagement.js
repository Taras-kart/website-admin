import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost, apiPut } from './api';
import './CategoryManagement.css';
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
  "category-page": ["tadm-categorymanagement-category-page"],
  "category-container": ["tadm-categorymanagement-category-container"],
  "category-card": ["tadm-categorymanagement-category-card"],
  "category-header": ["tadm-categorymanagement-category-header"],
  "category-selected": ["tadm-categorymanagement-category-selected"],
  "category-actions": ["tadm-categorymanagement-category-actions"],
  "category-modal-header": ["tadm-categorymanagement-category-modal-header"],
  "category-modal-actions": ["tadm-categorymanagement-category-modal-actions"],
  "category-toast": ["tadm-categorymanagement-category-toast"],
  "category-selected-meta": ["tadm-categorymanagement-category-selected-meta"],
  "category-checkbox": ["tadm-categorymanagement-category-checkbox"],
  "category-dropdown-grid": ["tadm-categorymanagement-category-dropdown-grid"],
  "category-field": ["tadm-categorymanagement-category-field"],
  "category-form": ["tadm-categorymanagement-category-form"],
  "active": ["tadm-categorymanagement-active"],
  "inactive": ["tadm-categorymanagement-inactive"],
  "category-refresh": ["tadm-categorymanagement-category-refresh"],
  "category-add": ["tadm-categorymanagement-category-add"],
  "category-update": ["tadm-categorymanagement-category-update"],
  "category-delete": ["tadm-categorymanagement-category-delete"],
  "category-restore": ["tadm-categorymanagement-category-restore"],
  "category-cancel": ["tadm-categorymanagement-category-cancel"],
  "category-save": ["tadm-categorymanagement-category-save"],
  "category-confirm-delete": ["tadm-categorymanagement-category-confirm-delete"],
  "success": ["tadm-categorymanagement-success"],
  "error": ["tadm-categorymanagement-error"],
  "category-modal-overlay": ["tadm-categorymanagement-category-modal-overlay"],
  "category-modal": ["tadm-categorymanagement-category-modal"],
  "category-confirm": ["tadm-categorymanagement-category-confirm"],
  "category-impact": ["tadm-categorymanagement-category-impact"],
  "category-warning": ["tadm-categorymanagement-category-warning"],
  "category-loading": ["tadm-categorymanagement-category-loading"]
})[name] || ["tadm-categorymanagement-" + name]).join(' ');
const GENDERS = [{
  value: '',
  label: 'Select gender'
}, {
  value: 'MEN',
  label: 'Men'
}, {
  value: 'WOMEN',
  label: 'Women'
}, {
  value: 'KIDS',
  label: 'Kids'
}];
const cleanText = value => String(value || '').replace(/\s+/g, ' ').trim();
const formatCount = value => Number(value || 0).toLocaleString('en-IN');
function Modal({
  title,
  children,
  onClose
}) {
  return <div className={portalClass("category-modal-overlay")} onMouseDown={onClose}>
      <div className={portalClass("category-modal")} onMouseDown={event => event.stopPropagation()}>
        <div className={portalClass("category-modal-header")}>
          <h2 className="tadm-categorymanagement-node-0">{title}</h2>
          <button type="button" onClick={onClose} className="tadm-categorymanagement-node-1">×</button>
        </div>
        {children}
      </div>
    </div>;
}
export default function CategoryManagement() {
  const [rows, setRows] = useState([]);
  const [gender, setGender] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [statusDialog, setStatusDialog] = useState(null);
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/categories/admin');
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (error) {
      setRows([]);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to load categories'
      });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [message]);
  const genderRows = useMemo(() => {
    return rows.filter(category => category.gender === gender);
  }, [rows, gender]);
  const rootCategory = useMemo(() => {
    return genderRows.find(category => category.parent_id == null) || null;
  }, [genderRows]);
  const childrenMap = useMemo(() => {
    const map = new Map();
    for (const category of genderRows) {
      const key = category.parent_id == null ? 'ROOT' : String(category.parent_id);
      map.set(key, [...(map.get(key) || []), category]);
    }
    for (const categories of map.values()) {
      categories.sort((a, b) => {
        const orderDifference = Number(a.sort_order || 0) - Number(b.sort_order || 0);
        if (orderDifference !== 0) return orderDifference;
        return String(a.name || '').localeCompare(String(b.name || ''), undefined, {
          numeric: true
        });
      });
    }
    return map;
  }, [genderRows]);
  const dropdownLevels = useMemo(() => {
    if (!rootCategory) return [];
    const levels = [];
    let parent = rootCategory;
    let index = 0;
    while (parent) {
      const options = childrenMap.get(String(parent.id)) || [];
      if (!options.length) break;
      const selectedId = selectedIds[index] || '';
      levels.push({
        index,
        parent,
        options,
        selectedId,
        label: index === 0 ? 'Category' : index === 1 ? 'Subcategory' : `Subcategory Level ${index + 1}`
      });
      if (!selectedId) break;
      const selected = options.find(category => String(category.id) === String(selectedId));
      if (!selected) break;
      parent = selected;
      index += 1;
    }
    return levels;
  }, [rootCategory, childrenMap, selectedIds]);
  const selectedCategory = useMemo(() => {
    if (!selectedIds.length) return null;
    const selectedId = selectedIds[selectedIds.length - 1];
    return rows.find(category => String(category.id) === String(selectedId)) || null;
  }, [rows, selectedIds]);
  const handleGenderChange = event => {
    setGender(event.target.value);
    setSelectedIds([]);
    setEditor(null);
    setStatusDialog(null);
  };
  const handleCategoryChange = (levelIndex, value) => {
    setSelectedIds(current => {
      if (!value) return current.slice(0, levelIndex);
      return [...current.slice(0, levelIndex), String(value)];
    });
  };
  const openAdd = () => {
    if (!gender || !rootCategory) {
      setMessage({
        type: 'error',
        text: 'Select gender first'
      });
      return;
    }
    const parent = selectedCategory || rootCategory;
    if (!parent.is_active) {
      setMessage({
        type: 'error',
        text: 'Cannot add under an inactive category'
      });
      return;
    }
    setEditor({
      mode: 'create',
      category: null,
      parent,
      name: '',
      sort_order: ''
    });
  };
  const openUpdate = () => {
    if (!selectedCategory) {
      setMessage({
        type: 'error',
        text: 'Select category first'
      });
      return;
    }
    setEditor({
      mode: 'edit',
      category: selectedCategory,
      parent: rows.find(category => String(category.id) === String(selectedCategory.parent_id)) || null,
      name: selectedCategory.name || '',
      sort_order: String(selectedCategory.sort_order ?? 0)
    });
  };
  const saveCategory = async event => {
    event.preventDefault();
    if (!editor) return;
    const name = cleanText(editor.name);
    const sortOrder = editor.sort_order === '' ? null : Number(editor.sort_order);
    if (!name) {
      setMessage({
        type: 'error',
        text: 'Enter category name'
      });
      return;
    }
    if (editor.mode === 'edit' && (!Number.isInteger(sortOrder) || sortOrder < 0)) {
      setMessage({
        type: 'error',
        text: 'Enter a valid sort order'
      });
      return;
    }
    setSaving(true);
    try {
      if (editor.mode === 'create') {
        const created = await apiPost('/api/categories', {
          name,
          parent_id: Number(editor.parent.id),
          sort_order: sortOrder
        });
        const nextIds = selectedCategory ? [...selectedIds, String(created.id)] : [String(created.id)];
        await loadCategories();
        setSelectedIds(nextIds);
        setMessage({
          type: 'success',
          text: 'Category added successfully'
        });
      } else {
        await apiPut(`/api/categories/${editor.category.id}`, {
          name,
          parent_id: Number(editor.category.parent_id),
          sort_order: sortOrder
        });
        await loadCategories();
        setMessage({
          type: 'success',
          text: 'Category updated successfully'
        });
      }
      setEditor(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to save category'
      });
    } finally {
      setSaving(false);
    }
  };
  const openStatusDialog = async () => {
    if (!selectedCategory) {
      setMessage({
        type: 'error',
        text: 'Select category first'
      });
      return;
    }
    setStatusDialog({
      category: selectedCategory,
      impact: null,
      loading: true,
      cascade: false
    });
    try {
      const impact = await apiGet(`/api/categories/${selectedCategory.id}/impact`);
      setStatusDialog(current => {
        if (!current) return current;
        return {
          ...current,
          impact,
          loading: false
        };
      });
    } catch (error) {
      setStatusDialog(null);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to check category'
      });
    }
  };
  const updateStatus = async () => {
    if (!statusDialog?.category || !statusDialog?.impact) return;
    const category = statusDialog.category;
    const nextStatus = !category.is_active;
    const activeChildren = Number(statusDialog.impact.active_descendant_count || 0);
    if (!nextStatus && activeChildren > 0 && !statusDialog.cascade) {
      setMessage({
        type: 'error',
        text: 'Select the child categories option'
      });
      return;
    }
    setSaving(true);
    try {
      await apiPatch(`/api/categories/${category.id}/status`, {
        is_active: nextStatus,
        cascade: statusDialog.cascade
      });
      await loadCategories();
      setStatusDialog(null);
      setMessage({
        type: 'success',
        text: nextStatus ? 'Category restored successfully' : 'Category deleted successfully'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to update category'
      });
    } finally {
      setSaving(false);
    }
  };
  const addDisabled = !gender || !rootCategory || Boolean(selectedCategory && !selectedCategory.is_active);
  return <div className={portalClass("category-page")}>
      

      {message && <div className={portalClass(`category-toast ${message.type}`)}>
          <span className="tadm-categorymanagement-node-2">{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="tadm-categorymanagement-node-3">×</button>
        </div>}

      <main className={portalClass("category-container")}>
        <section className={portalClass("category-card")}>
          <div className={portalClass("category-header")}>
            <h1 className="tadm-categorymanagement-node-4">Category Management</h1>
            <button type="button" className={portalClass("category-refresh")} onClick={loadCategories} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className={portalClass("category-dropdown-grid")}>
            <label className={portalClass("category-field")}>
              <span className="tadm-categorymanagement-node-5">Gender</span>
              <select value={gender} onChange={handleGenderChange} className="tadm-categorymanagement-node-6">
                {GENDERS.map(option => <option key={option.value} value={option.value} className="tadm-categorymanagement-node-7">{option.label}</option>)}
              </select>
            </label>

            {dropdownLevels.map(level => <label className={portalClass("category-field")} key={`${level.parent.id}-${level.index}`}>
                <span className="tadm-categorymanagement-node-8">{level.label}</span>
                <select value={level.selectedId} onChange={event => handleCategoryChange(level.index, event.target.value)} className="tadm-categorymanagement-node-9">
                  <option value="" className="tadm-categorymanagement-node-10">Select {level.label.toLowerCase()}</option>
                  {level.options.map(category => <option key={category.id} value={category.id} className="tadm-categorymanagement-node-11">
                      {category.name}{category.is_active ? '' : ' (Inactive)'}
                    </option>)}
                </select>
              </label>)}
          </div>

          {selectedCategory && <div className={portalClass("category-selected")}>
              <div className="tadm-categorymanagement-node-12">
                <span className="tadm-categorymanagement-node-13">Selected</span>
                <strong className="tadm-categorymanagement-node-14">{selectedCategory.category_path}</strong>
              </div>

              <div className={portalClass("category-selected-meta")}>
                <span className={portalClass(selectedCategory.is_active ? 'active' : 'inactive')}>
                  {selectedCategory.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="tadm-categorymanagement-node-15">{formatCount(selectedCategory.product_count)} products</span>
              </div>
            </div>}

          <div className={portalClass("category-actions")}>
            <button type="button" className={portalClass("category-add")} disabled={addDisabled} onClick={openAdd}>
              Add Category
            </button>

            <button type="button" className={portalClass("category-update")} disabled={!selectedCategory} onClick={openUpdate}>
              Update Category
            </button>

            <button type="button" className={portalClass(selectedCategory?.is_active ? 'category-delete' : 'category-restore')} disabled={!selectedCategory} onClick={openStatusDialog}>
              {selectedCategory?.is_active ? 'Delete Category' : 'Restore Category'}
            </button>
          </div>
        </section>
      </main>

      {editor && <Modal title={editor.mode === 'create' ? 'Add Category' : 'Update Category'} onClose={() => !saving && setEditor(null)}>
          <form className={portalClass("category-form")} onSubmit={saveCategory}>
            <label className="tadm-categorymanagement-node-16">
              <span className="tadm-categorymanagement-node-17">Gender</span>
              <input type="text" value={gender} disabled className="tadm-categorymanagement-node-18" />
            </label>

            <label className="tadm-categorymanagement-node-19">
              <span className="tadm-categorymanagement-node-20">Parent category</span>
              <input type="text" value={editor.parent?.category_path || editor.parent?.name || ''} disabled className="tadm-categorymanagement-node-21" />
            </label>

            <label className="tadm-categorymanagement-node-22">
              <span className="tadm-categorymanagement-node-23">Category name</span>
              <input type="text" autoFocus maxLength={100} value={editor.name} onChange={event => setEditor(current => ({
            ...current,
            name: event.target.value
          }))} className="tadm-categorymanagement-node-24" />
            </label>

            <label className="tadm-categorymanagement-node-25">
              <span className="tadm-categorymanagement-node-26">Sort order</span>
              <input type="number" min="0" step="1" placeholder="Automatic" value={editor.sort_order} onChange={event => setEditor(current => ({
            ...current,
            sort_order: event.target.value
          }))} className="tadm-categorymanagement-node-27" />
            </label>

            <div className={portalClass("category-modal-actions")}>
              <button type="button" className={portalClass("category-cancel")} disabled={saving} onClick={() => setEditor(null)}>Cancel</button>
              <button type="submit" className={portalClass("category-save")} disabled={saving}>
                {saving ? 'Saving...' : editor.mode === 'create' ? 'Add Category' : 'Update Category'}
              </button>
            </div>
          </form>
        </Modal>}

      {statusDialog && <Modal title={statusDialog.category.is_active ? 'Delete Category' : 'Restore Category'} onClose={() => !saving && setStatusDialog(null)}>
          {statusDialog.loading ? <div className={portalClass("category-loading")}>Checking category...</div> : <div className={portalClass("category-confirm")}>
              <p className="tadm-categorymanagement-node-28">
                {statusDialog.category.is_active ? 'Delete' : 'Restore'} <strong className="tadm-categorymanagement-node-29">{statusDialog.category.name}</strong>?
              </p>

              <div className={portalClass("category-impact")}>
                <div className="tadm-categorymanagement-node-30">
                  <span className="tadm-categorymanagement-node-31">Products</span>
                  <strong className="tadm-categorymanagement-node-32">{formatCount(statusDialog.impact.subtree_product_count)}</strong>
                </div>

                <div className="tadm-categorymanagement-node-33">
                  <span className="tadm-categorymanagement-node-34">Child categories</span>
                  <strong className="tadm-categorymanagement-node-35">{formatCount(statusDialog.impact.descendant_count)}</strong>
                </div>
              </div>

              {statusDialog.category.is_active && Number(statusDialog.impact.subtree_product_count || 0) > 0 && <div className={portalClass("category-warning")}>
                  Products connected to this category will stop displaying on the website.
                </div>}

              {Number(statusDialog.impact.descendant_count || 0) > 0 && <label className={portalClass("category-checkbox")}>
                  <input type="checkbox" checked={statusDialog.cascade} onChange={event => setStatusDialog(current => ({
            ...current,
            cascade: event.target.checked
          }))} className="tadm-categorymanagement-node-36" />
                  <span className="tadm-categorymanagement-node-37">
                    {statusDialog.category.is_active ? 'Delete all child categories also' : 'Restore all child categories also'}
                  </span>
                </label>}

              <div className={portalClass("category-modal-actions")}>
                <button type="button" className={portalClass("category-cancel")} disabled={saving} onClick={() => setStatusDialog(null)}>Cancel</button>
                <button type="button" className={portalClass(statusDialog.category.is_active ? 'category-confirm-delete' : 'category-save')} disabled={saving} onClick={updateStatus}>
                  {saving ? 'Updating...' : statusDialog.category.is_active ? 'Delete' : 'Restore'}
                </button>
              </div>
            </div>}
        </Modal>}
    </div>;
}
