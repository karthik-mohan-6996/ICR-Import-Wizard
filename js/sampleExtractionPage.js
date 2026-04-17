/**
 * Sample Extraction Page - Step 4
 * Association view: single image preview + field mapping with checkboxes & dropdowns
 */
const SampleExtractionPage = {
  recordCreated: false,
  zoomLevel: 100,

  render() {
    const content = document.getElementById('wizardContent');
    const sample = MockData.sampleExtraction;
    const fieldOptions = MockData.contactFieldOptions;

    // Hide the default wizard footer when on this page
    const wizardFooter = document.getElementById('wizardFooter');
    if (wizardFooter) wizardFooter.style.display = 'none';

    content.innerHTML = `
      <div class="association-page">
        <div class="association-page-header">
          <h2>Associate extracted data with contact fields</h2>
          <select class="layout-dropdown" id="assocLayoutSelect">
            <option selected>Standard</option>
            <option>Custom</option>
          </select>
        </div>

        ${this.recordCreated ? `
          <div class="inline-success-msg" id="inlineSuccess">
            <i class="fas fa-check-circle"></i>
            <span>Record created successfully! You can update field associations below for enrichment.</span>
          </div>
        ` : ''}

        <div class="association-split-layout">
          <!-- Left: Image Preview -->
          <div class="assoc-image-panel">
            <div class="assoc-card-preview">
              <div class="mock-id-card">
                <div class="id-card-top">
                  <div class="id-card-logo">YOUR<br>LOGO</div>
                  <div class="id-card-photo">
                    <i class="fas fa-user-tie"></i>
                  </div>
                </div>
                <div class="id-card-body">
                  <div class="id-card-name">${this._escapeHtml(sample.cardInfo.name)}</div>
                  <div class="id-card-role">${this._escapeHtml(sample.cardInfo.role)}</div>
                  <div class="id-card-divider"></div>
                  <div class="id-card-details">
                    <div>${this._escapeHtml(sample.cardInfo.id)}</div>
                    <div>${this._escapeHtml(sample.cardInfo.department)}</div>
                    <div>${this._escapeHtml(sample.cardInfo.email)}</div>
                    <div>${this._escapeHtml(sample.cardInfo.phone)}</div>
                    <div>${this._escapeHtml(sample.cardInfo.website)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="zoom-controls">
              <button id="zoomOut">−</button>
              <span id="zoomLabel">${this.zoomLevel}%</span>
              <button id="zoomIn">+</button>
            </div>
          </div>

          <!-- Right: Extracted Fields Table -->
          <div class="assoc-fields-panel">
            <table class="assoc-fields-table">
              <thead>
                <tr>
                  <th style="width:30px;"></th>
                  <th>Extracted Value</th>
                  <th class="arrow-col">→</th>
                  <th>Contact Field</th>
                </tr>
              </thead>
              <tbody>
                ${sample.fields.map((f, fi) => `
                  <tr class="${f.checked ? '' : 'row-unchecked'}">
                    <td>
                      <input type="checkbox" ${f.checked ? 'checked' : ''} data-field="${fi}">
                    </td>
                    <td class="extracted-val">
                      ${f.isImage ? '<div class="extracted-photo-thumb"><i class="fas fa-user-tie"></i></div>' : this._escapeHtml(f.value)}
                    </td>
                    <td class="arrow-col">→</td>
                    <td>
                      ${f.checked ? `
                        <span class="mapped-field-name">${this._escapeHtml(f.field)}</span>
                      ` : `
                        <select class="field-dropdown" data-field="${fi}">
                          ${fieldOptions.map(opt => `<option value="${opt}" ${f.field === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer buttons -->
        <div class="assoc-footer">
          <button class="btn btn-outline" id="assocCancelBtn">Cancel</button>
          <button class="btn btn-blue" id="assocUpdateBtn">Update</button>
        </div>
      </div>
    `;

    this._bindEvents();
  },

  _bindEvents() {
    const sample = MockData.sampleExtraction;

    // Checkboxes
    document.querySelectorAll('.assoc-fields-table input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const fi = parseInt(e.target.dataset.field, 10);
        sample.fields[fi].checked = e.target.checked;
        if (!e.target.checked) {
          sample.fields[fi].field = 'None';
        }
        this.render();
      });
    });

    // Dropdowns
    document.querySelectorAll('.field-dropdown').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const fi = parseInt(e.target.dataset.field, 10);
        sample.fields[fi].field = e.target.value;
        if (e.target.value !== 'None') {
          sample.fields[fi].checked = true;
          this.render();
        }
      });
    });

    // Zoom controls
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        if (this.zoomLevel < 200) {
          this.zoomLevel += 10;
          document.getElementById('zoomLabel').textContent = this.zoomLevel + '%';
          this._applyZoom();
        }
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        if (this.zoomLevel > 50) {
          this.zoomLevel -= 10;
          document.getElementById('zoomLabel').textContent = this.zoomLevel + '%';
          this._applyZoom();
        }
      });
    }

    // Cancel
    const cancelBtn = document.getElementById('assocCancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const wizardFooter = document.getElementById('wizardFooter');
        if (wizardFooter) wizardFooter.style.display = '';
        App.prevStep();
      });
    }

    // Update → go to Create Contact page
    const updateBtn = document.getElementById('assocUpdateBtn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        CreateContactPage.isEnrichment = this.recordCreated;
        CreateContactPage.render();
      });
    }
  },

  _applyZoom() {
    const card = document.querySelector('.mock-id-card');
    if (card) {
      const scale = this.zoomLevel / 100;
      card.style.transform = `scale(${scale})`;
    }
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Called after record is saved in CreateContactPage
  onRecordSaved() {
    this.recordCreated = true;
    const wizardFooter = document.getElementById('wizardFooter');
    if (wizardFooter) wizardFooter.style.display = 'none';
    this.render();
  },

  validate() {
    return true;
  }
};
