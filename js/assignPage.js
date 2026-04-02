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

  render() {
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

    document.getElementById('manualApprovalCheck').addEventListener('change', (e) => {
      this.manualApproval = e.target.checked;
    });

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

    App.showToast('Import submitted successfully!', 'success');

    // If manual approval is enabled, navigate to approval view
    if (this.manualApproval) {
      setTimeout(() => {
        App.showApprovalView();
      }, 1000);
    }
  },

  validate() {
    return true;
  }
};
