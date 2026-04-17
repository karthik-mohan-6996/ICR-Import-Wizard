/**
 * Create Contact Page
 * Full-page record edit form shown after clicking Update on association view.
 * On Save: record created, inline success, returns to association preview.
 * On enrichment re-save: updates existing record.
 */
const CreateContactPage = {
  isEnrichment: false,

  render() {
    const content = document.getElementById('wizardContent');
    const sample = MockData.sampleExtraction;
    const formFields = MockData.contactFormFields;
    const checkedFields = sample.fields.filter(f => f.checked);

    // Hide wizard footer
    const wizardFooter = document.getElementById('wizardFooter');
    if (wizardFooter) wizardFooter.style.display = 'none';

    // Hide stepper header
    const wizardHeader = document.querySelector('.wizard-header');
    if (wizardHeader) wizardHeader.style.display = 'none';
    const progressBar = document.querySelector('.progress-bar-container');
    if (progressBar) progressBar.style.display = 'none';

    content.innerHTML = `
      <div class="create-contact-page">
        <!-- Header bar -->
        <div class="cc-header">
          <div class="cc-header-left">
            <h2>${this.isEnrichment ? 'Update Contact' : 'Create Contact'}</h2>
            <select class="layout-dropdown">
              <option selected>Standard</option>
              <option>Custom</option>
            </select>
          </div>
          <div class="cc-header-right">
            <button class="btn btn-outline" id="ccCancelBtn">Cancel</button>
            <button class="btn btn-outline" id="ccSaveNewBtn">Save and New</button>
            <button class="btn btn-blue" id="ccSaveBtn">Save</button>
          </div>
        </div>

        <!-- Extraction Info Card -->
        <div class="cc-extraction-card">
          <div class="cc-extraction-thumb">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="cc-extraction-info">
            <div class="cc-extraction-title">
              Field update via image field
              <i class="fas fa-pencil-alt cc-edit-icon" id="ccEditExtraction"></i>
            </div>
            <div class="cc-extraction-stats">
              Enriched: <strong>${checkedFields.length > 0 ? 150 : 0}</strong> &bull; Mapped: <strong>${checkedFields.length > 0 ? 100 : 0}</strong>
            </div>
          </div>
        </div>

        <!-- Contact Image -->
        <div class="cc-section">
          <h4>Contact Image</h4>
          <div class="cc-contact-image">
            <i class="fas fa-user-tie"></i>
          </div>
        </div>

        <!-- Inline success message -->
        <div class="cc-inline-msg hidden" id="ccInlineMsg">
          <i class="fas fa-check-circle"></i>
          <span></span>
        </div>

        <!-- Contact Information -->
        <div class="cc-section">
          <h4>Contact Information</h4>
          <div class="cc-form-grid">
            ${formFields.map((f, i) => this._renderField(f, i)).join('')}
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  },

  _renderField(f, index) {
    const highlightClass = f.highlighted ? 'cc-highlighted' : '';
    const requiredClass = f.required ? 'cc-required' : '';

    if (f.type === 'picklist') {
      return `
        <div class="cc-form-field">
          <label>${this._escapeHtml(f.label)}</label>
          <div class="cc-picklist-field">
            <select class="${highlightClass}" data-index="${index}">
              <option>None</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <input type="text" value="${this._escapeAttr(f.value)}" class="${highlightClass}" data-index="${index}">
          </div>
        </div>
      `;
    }

    if (f.type === 'file') {
      return `
        <div class="cc-form-field">
          <label>${this._escapeHtml(f.label)}</label>
          <div class="cc-file-field">
            <select class="cc-file-select">
              <option>Choose file</option>
            </select>
          </div>
        </div>
      `;
    }

    if (f.type === 'currency') {
      return `
        <div class="cc-form-field">
          <label>${this._escapeHtml(f.label)}</label>
          <div class="cc-currency-field">
            <input type="text" value="${this._escapeAttr(f.value)}" class="${highlightClass}" data-index="${index}">
            <i class="fas fa-info-circle cc-currency-info"></i>
          </div>
        </div>
      `;
    }

    if (f.type === 'textarea') {
      return `
        <div class="cc-form-field">
          <label>${this._escapeHtml(f.label)}</label>
          <textarea class="${highlightClass}" placeholder="Description" data-index="${index}">${this._escapeHtml(f.value)}</textarea>
        </div>
      `;
    }

    // default text
    return `
      <div class="cc-form-field">
        <label>${this._escapeHtml(f.label)}</label>
        <input type="text" value="${this._escapeAttr(f.value)}" class="${highlightClass} ${requiredClass}" data-index="${index}">
      </div>
    `;
  },

  _bindEvents() {
    // Cancel → go back to association view
    document.getElementById('ccCancelBtn').addEventListener('click', () => {
      this._goBackToAssociation();
    });

    // Save → create/update record
    document.getElementById('ccSaveBtn').addEventListener('click', () => {
      this._saveRecord();
    });

    // Save and New
    document.getElementById('ccSaveNewBtn').addEventListener('click', () => {
      this._saveRecord(true);
    });

    // Edit extraction → go back to association
    document.getElementById('ccEditExtraction').addEventListener('click', () => {
      this._goBackToAssociation();
    });
  },

  _saveRecord(saveAndNew) {
    const msgEl = document.getElementById('ccInlineMsg');
    const msgText = this.isEnrichment
      ? 'Record updated successfully! Enrichment applied.'
      : 'Record created successfully!';

    // Show inline success
    msgEl.classList.remove('hidden');
    msgEl.querySelector('span').textContent = msgText;
    msgEl.className = 'cc-inline-msg cc-success';

    // After a brief moment, go back to association view with record marked as created
    setTimeout(() => {
      if (saveAndNew) {
        // Reset & stay on create page
        this.isEnrichment = false;
        SampleExtractionPage.recordCreated = false;
        this.render();
      } else {
        SampleExtractionPage.onRecordSaved();
      }
    }, 1500);
  },

  _goBackToAssociation() {
    // Restore header/footer visibility
    const wizardHeader = document.querySelector('.wizard-header');
    if (wizardHeader) wizardHeader.style.display = '';
    const progressBar = document.querySelector('.progress-bar-container');
    if (progressBar) progressBar.style.display = '';

    SampleExtractionPage.render();
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  _escapeAttr(text) {
    return String(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
};
