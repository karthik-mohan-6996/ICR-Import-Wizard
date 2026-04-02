/**
 * Actions Page - Step 2
 * User chooses: Create new records or Add to existing records
 */
const ActionsPage = {
  selectedAction: 'add_new',
  selectedLayout: 'None',
  skipField: 'None',

  render() {
    const content = document.getElementById('wizardContent');
    content.innerHTML = `
      <div class="actions-section">
        <h2>Choose Layout</h2>
        <div class="layout-select">
          <label>Select layout to import leads</label>
          <select id="layoutSelect">
            ${MockData.layouts.map(l => `
              <option value="${l}" ${this.selectedLayout === l ? 'selected' : ''}>${l}</option>
            `).join('')}
          </select>
        </div>

        <p class="action-question">What do you want to do with the records in this file?</p>

        <!-- Add as new Leads -->
        <div class="action-option ${this.selectedAction === 'add_new' ? 'selected' : ''}" data-action="add_new">
          <input type="radio" name="importAction" value="add_new"
            ${this.selectedAction === 'add_new' ? 'checked' : ''}>
          <div class="action-option-content">
            <strong>Add as new Leads</strong>
            <div class="skip-field">
              <label>Skip existing leads based on</label>
              <select id="skipFieldSelect">
                ${MockData.skipDuplicateFields.map(f => `
                  <option value="${f}" ${this.skipField === f ? 'selected' : ''}>${f}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Update existing Leads only -->
        <div class="action-option ${this.selectedAction === 'update_existing' ? 'selected' : ''}" data-action="update_existing">
          <input type="radio" name="importAction" value="update_existing"
            ${this.selectedAction === 'update_existing' ? 'checked' : ''}>
          <div class="action-option-content">
            <strong>Update existing Leads only</strong>
            <span>Match and update existing lead records with imported data</span>
          </div>
        </div>

        <!-- Both -->
        <div class="action-option ${this.selectedAction === 'both' ? 'selected' : ''}" data-action="both">
          <input type="radio" name="importAction" value="both"
            ${this.selectedAction === 'both' ? 'checked' : ''}>
          <div class="action-option-content">
            <strong>Both</strong>
            <span>Create new records and update existing ones</span>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  },

  _bindEvents() {
    // Action option selection
    document.querySelectorAll('.action-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectedAction = option.dataset.action;
        option.querySelector('input[type="radio"]').checked = true;
        this.render();
      });
    });

    // Layout select
    document.getElementById('layoutSelect').addEventListener('change', (e) => {
      this.selectedLayout = e.target.value;
    });

    // Skip field select
    const skipSelect = document.getElementById('skipFieldSelect');
    if (skipSelect) {
      skipSelect.addEventListener('change', (e) => {
        this.skipField = e.target.value;
      });
    }
  },

  validate() {
    return true; // Always valid, default selection exists
  }
};
