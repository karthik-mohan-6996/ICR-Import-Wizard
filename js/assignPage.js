/**
 * Assign Page - Step 5
 * Approval Process: Default Manual Approval, with opt-out option
 */
const AssignPage = {
  assignmentRules: false,
  manualApproval: true, // Default: Manual Approval enabled
  triggerAutomation: false,
  followUpTask: 'Choose follow-up task',
  complianceConfirmed: false,

  _isUpdateOnly() {
    return ActionsPage.selectedAction === 'update_existing';
  },

  render() {
    const isUpdate = this._isUpdateOnly();
    const content = document.getElementById('wizardContent');
    content.innerHTML = `
      <div class="assign-section">

        <!-- Assignment Rules -->
        <div class="assign-group">
          <h3>Assignment Rules</h3>
          <div class="checkbox-item">
            <input type="checkbox" id="assignRulesCheck" ${this.assignmentRules ? 'checked' : ''}>
            <label for="assignRulesCheck">Assign owner based on assignment rules</label>
          </div>
        </div>

        ${!isUpdate ? `
        <!-- Manual Record Approval -->
        <div class="assign-group">
          <h3>Manual Record Approval</h3>
          <div class="checkbox-item">
            <input type="checkbox" id="manualApprovalCheck" ${this.manualApproval ? 'checked' : ''}>
            <label for="manualApprovalCheck">Enable Manual Contact Approval</label>
          </div>
          <p style="font-size:12px; color:var(--gray-400); padding-left:26px; margin-top:4px;">
            When enabled, extracted records will appear in the Approve Module View for review before being added to the CRM.
          </p>
        </div>
        ` : ''}

        <!-- Trigger Automation -->
        <div class="assign-group">
          <h3>Trigger Automation and Process Management</h3>
          <div class="checkbox-item">
            <input type="checkbox" id="triggerAutoCheck" ${this.triggerAutomation ? 'checked' : ''}>
            <label for="triggerAutoCheck">Trigger configured automations and processes for new and updated records</label>
          </div>
        </div>

        <!-- Follow-up Tasks -->
        <div class="assign-group">
          <h3>Assign follow-up tasks</h3>
          <div class="follow-up-row">
            <label>Add follow-up task to new records and assign it to record owner</label>
            <select id="followUpSelect">
              ${MockData.followUpTasks.map(t => `
                <option value="${t}" ${this.followUpTask === t ? 'selected' : ''}>${t}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Compliance Note -->
        <div class="compliance-note">
          <input type="checkbox" id="complianceCheck" ${this.complianceConfirmed ? 'checked' : ''}>
          <p>
            I confirm that all email addresses in this import will be used only to reach individuals with their explicit consent,
            or with legitimate business interest, in compliance with <a href="#">Zoho's anti-spam policy</a>.
          </p>
        </div>

        <!-- Submit button -->
        <div class="submission-btn-group">
          <button class="btn btn-primary" id="submitImportBtn" ${!this.complianceConfirmed ? 'disabled' : ''}>
            Submit
          </button>
        </div>
      </div>
    `;

    this._bindEvents();
  },

  _bindEvents() {
    document.getElementById('assignRulesCheck').addEventListener('change', (e) => {
      this.assignmentRules = e.target.checked;
    });

    const manualApprovalCheck = document.getElementById('manualApprovalCheck');
    if (manualApprovalCheck) {
      manualApprovalCheck.addEventListener('change', (e) => {
        this.manualApproval = e.target.checked;
      });
    }

    document.getElementById('triggerAutoCheck').addEventListener('change', (e) => {
      this.triggerAutomation = e.target.checked;
    });

    document.getElementById('followUpSelect').addEventListener('change', (e) => {
      this.followUpTask = e.target.value;
    });

    document.getElementById('complianceCheck').addEventListener('change', (e) => {
      this.complianceConfirmed = e.target.checked;
      document.getElementById('submitImportBtn').disabled = !this.complianceConfirmed;
    });

    document.getElementById('submitImportBtn').addEventListener('click', () => {
      this._handleSubmit();
    });
  },

  _handleSubmit() {
    if (!this.complianceConfirmed) {
      App.showToast('Please confirm the compliance note to proceed', 'error');
      return;
    }

    if (this._isUpdateOnly()) {
      this._showUpdateConfirmation();
      return;
    }

    App.showToast('Import submitted successfully!', 'success');

    // If manual approval is enabled, navigate to approval view
    if (this.manualApproval) {
      setTimeout(() => {
        App.showApprovalView();
      }, 1000);
    }
  },

  _showUpdateConfirmation() {
    // Remove existing modal if any
    const existing = document.getElementById('updateConfirmModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'updateConfirmModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:520px;">
        <div class="modal-header">
          <h3>Confirm Import</h3>
          <button class="modal-close" id="updateModalClose">&times;</button>
        </div>
        <div class="modal-body">
          <p style="line-height:1.6; color:var(--gray-700);">
            Records will be updated with extracted values and overridden if there is also an existing value.
            Subform rows extracted will be concatenated to the existing rows. If the limit exceeds, we skip enriching those rows.
          </p>
          <p style="margin-top:12px; font-weight:600; color:var(--gray-800);">Are you sure you would like to proceed to import?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="updateModalCancel">Cancel</button>
          <button class="btn btn-primary" id="updateModalConfirm">Yes, Proceed</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('updateModalClose').addEventListener('click', () => modal.remove());
    document.getElementById('updateModalCancel').addEventListener('click', () => modal.remove());
    document.getElementById('updateModalConfirm').addEventListener('click', () => {
      modal.remove();
      App.showToast('Import has been initiated. You will be notified on completion as a WMS notification.', 'success');
    });
  },

  validate() {
    return true;
  }
};
