/**
 * Approval View - Post-submission module for reviewing extracted records
 * Users can view, edit, approve, or delete records
 */
const ApprovalView = {
  selectedRecords: [],
  currentDetailRecord: null,
  recordAnalysis: {},

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="approval-view" style="padding:24px; max-width:1100px; margin:0 auto;">
        <!-- Toolbar -->
        <div class="approval-toolbar">
          <div class="approval-toolbar-left">
            <a href="#" class="back-link" id="backToWizard"><i class="fas fa-arrow-left"></i></a>
            <h2>Contact Approval</h2>
          </div>
          <button class="help-btn"><i class="fas fa-question-circle"></i> Help</button>
        </div>

        <p style="font-size:14px; color:var(--gray-600); margin-bottom:20px;">
          Please approve the Contacts listed below.
        </p>

        <!-- Filters -->
        <div class="view-filters">
          <label>View :</label>
          <select id="userFilter">
            ${MockData.users.map(u => `<option value="${u}">${u}</option>`).join('')}
          </select>
          <select id="contactTypeFilter">
            <option value="unique">Unique Contacts</option>
            <option value="all">All Contacts</option>
          </select>
          <span style="margin-left:auto; font-size:13px; color:var(--gray-500);">
            Displaying 1 to ${MockData.approvalRecords.length}
          </span>
        </div>

        <!-- Approval Table -->
        <div class="approval-table-container">
          <table class="approval-table">
            <thead>
              <tr>
                <th style="width:40px;">
                  <input type="checkbox" id="selectAllCheck">
                </th>
                <th>Contact Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created Time</th>
                <th>Contact Owner</th>
                <th>Review Readiness</th>
              </tr>
            </thead>
            <tbody id="approvalTableBody">
              ${MockData.approvalRecords.map(record => `
                <tr data-id="${record.id}">
                  <td>
                    <input type="checkbox" class="record-check" value="${record.id}"
                      ${this.selectedRecords.includes(record.id) ? 'checked' : ''}>
                  </td>
                  <td>
                    <a href="#" class="contact-link" data-id="${record.id}">
                      ${this._escapeHtml(record.contactName)}
                    </a>
                  </td>
                  <td>${record.email || '—'}</td>
                  <td>${record.phone || '—'}</td>
                  <td>${record.createdTime}</td>
                  <td>${record.owner}</td>
                  <td class="readiness-cell" id="readiness-${record.id}">
                    <span class="review-readiness analyzing"><span class="readiness-spinner"></span> Analyzing…</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Action Bar -->
          <div class="approval-actions-bar">
            <button class="btn btn-outline btn-sm" id="approveBtn">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-outline btn-sm" id="changeOwnerBtn">
              <i class="fas fa-user-edit"></i> Change Owner and Approve
            </button>
            <button class="btn btn-outline btn-sm" id="deleteBtn" style="color:var(--primary);">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar">
            <div>
              <select>
                <option>10 Records Per Page</option>
                <option>25 Records Per Page</option>
                <option>50 Records Per Page</option>
              </select>
            </div>
            <div class="pagination-nav">
              <button disabled>&lsaquo;</button>
              <span>1 to ${MockData.approvalRecords.length}</span>
              <button disabled>&rsaquo;</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Overlay for record detail -->
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content" id="modalContent" style="max-width:900px;"></div>
      </div>
    `;

    this._bindEvents();
    this._analyzeAllRecords();
  },

  _bindEvents() {
    // Back button
    document.getElementById('backToWizard').addEventListener('click', (e) => {
      e.preventDefault();
      App.restoreWizard();
    });

    // Select all
    document.getElementById('selectAllCheck').addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('.record-check').forEach(cb => {
        cb.checked = checked;
      });
      this.selectedRecords = checked ? MockData.approvalRecords.map(r => r.id) : [];
    });

    // Individual checkboxes
    document.querySelectorAll('.record-check').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.value, 10);
        if (e.target.checked) {
          if (!this.selectedRecords.includes(id)) this.selectedRecords.push(id);
        } else {
          this.selectedRecords = this.selectedRecords.filter(r => r !== id);
        }
      });
    });

    // Contact name links -> open record detail
    document.querySelectorAll('.contact-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(link.dataset.id, 10);
        this._showRecordDetail(id);
      });
    });

    // Approve button
    document.getElementById('approveBtn').addEventListener('click', () => {
      if (this.selectedRecords.length === 0) {
        this._showToast('Please select at least one record to approve', 'error');
        return;
      }
      this._approveRecords(this.selectedRecords);
    });

    // Delete button
    document.getElementById('deleteBtn').addEventListener('click', () => {
      if (this.selectedRecords.length === 0) {
        this._showToast('Please select at least one record to delete', 'error');
        return;
      }
      this._deleteRecords(this.selectedRecords);
    });

    // Change Owner btn
    document.getElementById('changeOwnerBtn').addEventListener('click', () => {
      if (this.selectedRecords.length === 0) {
        this._showToast('Please select at least one record', 'error');
        return;
      }
      this._showToast('Owner changed and records approved!', 'success');
      this._approveRecords(this.selectedRecords);
    });
  },

  _showRecordDetail(recordId) {
    const record = MockData.approvalRecords.find(r => r.id === recordId);
    if (!record) return;

    const detail = MockData.recordDetail;
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:16px;">
          <h3>Create Lead</h3>
          <span style="padding:4px 12px; background:var(--gray-100); border-radius:4px; font-size:13px;">Standard</span>
          <a href="#" class="btn-link" style="font-size:13px;">Edit Page Layout</a>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-primary btn-sm" id="sendEmailBtn">Send Email</button>
          <button class="btn btn-success btn-sm" id="approveRecordBtn">Approve</button>
          <button class="btn btn-outline btn-sm" id="editRecordBtn">Edit</button>
          <button class="modal-close" id="closeRecordModal">&times;</button>
        </div>
      </div>
      <div class="modal-body">
        <!-- Extraction Info -->
        <div class="extraction-info-card">
          <i class="fas fa-magic"></i>
          <div class="info-text">
            Field update via image field
            <br>
            <span style="font-size:13px; color:var(--gray-500);">
              Extracted text : <span style="color:var(--blue);">${detail.extractedText}</span> •
              Enriched field : <span style="color:var(--blue);">${detail.enrichedField}</span>
            </span>
          </div>
          <i class="fas fa-pencil-alt edit-icon" id="editExtractionBtn"></i>
        </div>

        <!-- Lead Image section -->
        <div style="margin-bottom:24px;">
          <label style="font-size:13px; font-weight:500; color:var(--gray-600); display:block; margin-bottom:8px;">Lead Image</label>
          <div style="width:60px; height:60px; border-radius:50%; background:var(--gray-200); display:flex; align-items:center; justify-content:center;">
            <i class="fas fa-user" style="font-size:24px; color:var(--gray-400);"></i>
          </div>
        </div>

        <!-- Lead Information Form -->
        <h4 style="font-size:14px; font-weight:600; margin-bottom:16px; color:var(--gray-700);">Lead Information</h4>
        <div class="record-form-grid">
          <div class="form-field">
            <label>Lead Owner</label>
            <div style="display:flex; gap:8px;">
              <select style="flex:1; padding:8px 12px; border:1px solid var(--gray-300); border-radius:6px;">
                <option>${detail.leadOwner}</option>
              </select>
              <button style="background:var(--gray-100); border:1px solid var(--gray-300); border-radius:6px; padding:8px 12px; cursor:pointer;">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="form-field">
            <label>Company</label>
            <input type="text" value="${this._escapeAttr(detail.company)}" class="highlighted" placeholder="Enter company">
          </div>
          <div class="form-field">
            <label>Image Upload 1</label>
            <div class="image-upload-preview">
              <div style="text-align:center; padding:8px;">
                <i class="fas fa-id-card" style="font-size:28px; color:var(--gray-400);"></i>
                <div style="font-size:10px; color:var(--gray-400); margin-top:4px;">Business Card</div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" style="margin-top:6px; width:fit-content;">Upload Image</button>
          </div>
          <div class="form-field">
            <label>Last Name</label>
            <input type="text" value="${this._escapeAttr(detail.lastName)}" class="highlighted">
          </div>
          <div class="form-field">
            <label>Date of birth</label>
            <input type="text" placeholder="DD/MM/YYYY" value="${detail.dateOfBirth}">
          </div>
          <div class="form-field">
            <label>Email</label>
            <input type="text" value="${this._escapeAttr(detail.email)}" placeholder="Enter email">
          </div>
          <div class="form-field">
            <label>First Name</label>
            <input type="text" value="${this._escapeAttr(detail.firstName)}">
          </div>
          <div class="form-field">
            <label>Fax</label>
            <input type="text" value="${this._escapeAttr(detail.fax)}" placeholder="Enter fax">
          </div>
          <div class="form-field">
            <label>Phone</label>
            <input type="text" value="${this._escapeAttr(detail.phone)}">
          </div>
          <div class="form-field">
            <label>Website</label>
            <input type="text" value="${this._escapeAttr(detail.website)}" placeholder="Enter website">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" id="cancelRecordBtn">Cancel</button>
        <button class="btn btn-blue" id="saveRecordBtn">Save</button>
      </div>
    `;

    modal.classList.add('active');

    // Bind modal events
    const closeModal = () => modal.classList.remove('active');
    document.getElementById('closeRecordModal').addEventListener('click', closeModal);
    document.getElementById('cancelRecordBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.getElementById('approveRecordBtn').addEventListener('click', () => {
      this._approveRecords([recordId]);
      closeModal();
    });

    document.getElementById('saveRecordBtn').addEventListener('click', () => {
      this._showToast('Record saved successfully', 'success');
      closeModal();
    });

    document.getElementById('editExtractionBtn').addEventListener('click', () => {
      closeModal();
      this._showAssociationModal(recordId);
    });
  },

  _showAssociationModal(recordId) {
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Associate extracted value with Leads fields
          <span style="padding:4px 10px; background:var(--gray-100); border-radius:4px; font-size:12px; margin-left:8px;">Standard</span>
        </h3>
        <button class="modal-close" id="closeAssocModal">&times;</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <div class="association-layout">
          <!-- Image Preview -->
          <div>
            <div class="association-image">
              <div class="mock-business-card">
                <div class="company">Hansen Group</div>
                <div class="person-name">Anthony D'Silva</div>
                <div class="person-role">Senior Executive</div>
                <div class="contact-info">
                  <i class="fas fa-phone"></i> +91 22 6718 6718<br>
                  <i class="fas fa-globe"></i> www.hansengroup.com
                </div>
              </div>
            </div>
            <div class="zoom-controls">
              <button>−</button>
              <span>100%</span>
              <button>+</button>
            </div>
          </div>

          <!-- Extracted Fields -->
          <div class="association-fields" style="padding:16px;">
            <table>
              <thead>
                <tr>
                  <th style="width:30px;"></th>
                  <th>Extracted Value</th>
                  <th class="arrow-col">→</th>
                  <th>CRM Field</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>+91 22 6718 6718</td>
                  <td class="arrow-col">→</td>
                  <td>Phone</td>
                </tr>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>+91 22 6718 6718</td>
                  <td class="arrow-col">→</td>
                  <td>Mobile</td>
                </tr>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>Anthony</td>
                  <td class="arrow-col">→</td>
                  <td>First Name</td>
                </tr>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>D'Silva</td>
                  <td class="arrow-col">→</td>
                  <td>Last Name</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" id="cancelAssocBtn">Cancel</button>
        <button class="btn btn-outline" id="tryNewImageBtn">Try New Image</button>
        <button class="btn btn-blue" id="proceedAssocBtn">Proceed</button>
      </div>
    `;

    modal.classList.add('active');

    const closeModal = () => modal.classList.remove('active');
    document.getElementById('closeAssocModal').addEventListener('click', closeModal);
    document.getElementById('cancelAssocBtn').addEventListener('click', closeModal);
    document.getElementById('tryNewImageBtn').addEventListener('click', () => {
      this._showToast('Ready for new image upload', 'info');
    });
    document.getElementById('proceedAssocBtn').addEventListener('click', () => {
      this._showToast('Field associations saved', 'success');
      closeModal();
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  },

  _approveRecords(ids) {
    // Remove approved records from the list
    ids.forEach(id => {
      const index = MockData.approvalRecords.findIndex(r => r.id === id);
      if (index >= 0) {
        MockData.approvalRecords[index].status = 'approved';
      }
    });
    this.selectedRecords = [];
    this._showToast(`${ids.length} record(s) approved successfully!`, 'success');
    this.render();
  },

  _deleteRecords(ids) {
    ids.forEach(id => {
      const index = MockData.approvalRecords.findIndex(r => r.id === id);
      if (index >= 0) {
        MockData.approvalRecords.splice(index, 1);
      }
    });
    this.selectedRecords = [];
    this._showToast(`${ids.length} record(s) deleted`, 'info');
    this.render();
  },

  _showToast(message, type) {
    // Re-use the global toast since we replaced the DOM
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:2000;';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  _escapeAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  // ===== REVIEW READINESS =====
  _analyzeAllRecords() {
    MockData.approvalRecords.forEach(record => {
      const delay = 600 + Math.random() * 1400;
      setTimeout(() => {
        const result = this._analyzeRecord(record);
        this.recordAnalysis[record.id] = result;
        this._renderReadinessBadge(record.id, result);
      }, delay);
    });
  },

  _analyzeRecord(record) {
    const extracted = record.extractedData;
    const existing = record.existingData;

    if (!extracted || Object.keys(extracted).length === 0) {
      return { status: 'no-data', matched: 0, mismatched: 0, newFields: 0, total: 0, details: [] };
    }

    let matched = 0, mismatched = 0, newFields = 0;
    const details = [];
    const fieldLabels = {
      firstName: 'First Name', lastName: 'Last Name', email: 'Email',
      phone: 'Phone', company: 'Company', mobile: 'Mobile',
      website: 'Website', dateOfBirth: 'Date of Birth'
    };

    Object.keys(extracted).forEach(key => {
      const extVal = (extracted[key] || '').trim();
      const exVal = existing ? (existing[key] || '').trim() : '';
      const label = fieldLabels[key] || key;

      if (!extVal) return;

      if (!exVal) {
        newFields++;
        details.push({ field: label, type: 'new', extracted: extVal, existing: '—' });
      } else if (extVal.toLowerCase() === exVal.toLowerCase()) {
        matched++;
        details.push({ field: label, type: 'match', extracted: extVal, existing: exVal });
      } else {
        mismatched++;
        details.push({ field: label, type: 'mismatch', extracted: extVal, existing: exVal });
      }
    });

    const total = matched + mismatched + newFields;
    const status = (mismatched > 0 || newFields > 0) ? 'needs-review' : 'up-to-date';
    return { status, matched, mismatched, newFields, total, details };
  },

  _renderReadinessBadge(recordId, analysis) {
    const cell = document.getElementById('readiness-' + recordId);
    if (!cell) return;

    let icon, label, cls, tooltipHtml;

    if (analysis.status === 'needs-review') {
      cls = 'needs-review';
      icon = '<i class="fas fa-exclamation-circle"></i>';
      const parts = [];
      if (analysis.mismatched > 0) parts.push(analysis.mismatched + ' mismatched');
      if (analysis.newFields > 0) parts.push(analysis.newFields + ' new');
      label = 'Review Needed';
      tooltipHtml = this._buildTooltip(analysis, 'Review Needed — ' + parts.join(', '));
    } else if (analysis.status === 'up-to-date') {
      cls = 'up-to-date';
      icon = '<i class="fas fa-check-circle"></i>';
      label = 'Up to Date';
      tooltipHtml = this._buildTooltip(analysis, 'All extracted fields match');
    } else {
      cls = 'no-data';
      icon = '<i class="fas fa-minus-circle"></i>';
      label = 'No Data';
      tooltipHtml = '<div class="readiness-tooltip"><div class="tip-title">No extractable data found in document</div></div>';
    }

    cell.innerHTML = '<span class="review-readiness ' + cls + '">' + icon + ' ' + label + tooltipHtml + '</span>';
  },

  _buildTooltip(analysis, title) {
    let html = '<div class="readiness-tooltip">';
    html += '<div class="tip-title">' + this._escapeHtml(title) + '</div>';

    const order = ['mismatch', 'new', 'match'];
    order.forEach(type => {
      analysis.details.forEach(d => {
        if (d.type !== type) return;
        const dotCls = type === 'mismatch' ? 'mismatch' : type === 'new' ? 'new-data' : 'match';
        let suffix = '';
        if (type === 'mismatch') suffix = ' <span style="opacity:0.7">(' + this._escapeHtml(d.existing) + ' → ' + this._escapeHtml(d.extracted) + ')</span>';
        else if (type === 'new') suffix = ' <span style="opacity:0.7">(' + this._escapeHtml(d.extracted) + ')</span>';
        html += '<div class="tip-field"><span class="dot ' + dotCls + '"></span>' + this._escapeHtml(d.field) + suffix + '</div>';
      });
    });

    html += '<div class="tip-stats">' + analysis.matched + ' matched · ' + analysis.mismatched + ' mismatched · ' + analysis.newFields + ' new</div>';
    html += '</div>';
    return html;
  }
};
