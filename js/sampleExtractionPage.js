/**
 * Sample Extraction Page - Step 4
 * Display 2 sample records to preview extraction results
 */
const SampleExtractionPage = {

  render() {
    const content = document.getElementById('wizardContent');
    const samples = MockData.sampleExtractions;

    content.innerHTML = `
      <div class="sample-extraction-header">
        <h2>Sample Extraction Preview</h2>
        <p style="font-size:13px; color:var(--gray-500);">
          Review the extracted data from 2 sample images before proceeding.
        </p>
      </div>

      <div class="sample-cards">
        ${samples.map((sample, index) => `
          <div class="sample-card">
            <div class="sample-card-header">
              <i class="fas fa-image"></i>
              Sample ${index + 1} — ${this._escapeHtml(sample.imageName)}
            </div>
            <div class="sample-card-image">
              <div class="placeholder-card-img">
                <div class="card-text">
                  <div style="font-size:11px; opacity:0.6; margin-bottom:8px;">${this._escapeHtml(sample.cardInfo.company)}</div>
                  <div class="name">${this._escapeHtml(sample.cardInfo.name)}</div>
                  <div class="role">${this._escapeHtml(sample.cardInfo.role)}</div>
                </div>
              </div>
            </div>
            <div class="sample-card-body">
              <table class="extraction-table">
                <thead>
                  <tr>
                    <th class="check-col"></th>
                    <th>Extracted Value</th>
                    <th style="text-align:center;">→</th>
                    <th>CRM Field</th>
                  </tr>
                </thead>
                <tbody>
                  ${sample.fields.map((f, fi) => `
                    <tr>
                      <td class="check-col">
                        <input type="checkbox" ${f.checked ? 'checked' : ''}
                          data-sample="${sample.id}" data-field="${fi}">
                      </td>
                      <td class="field-value">${this._escapeHtml(f.value)}</td>
                      <td style="text-align:center; color:var(--gray-400);">→</td>
                      <td class="field-name">${this._escapeHtml(f.field)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:24px; padding:16px 20px; background:var(--green-light); border-radius:var(--radius); display:flex; align-items:center; gap:12px;">
        <i class="fas fa-check-circle" style="color:var(--green); font-size:20px;"></i>
        <div>
          <strong style="font-size:14px; color:var(--gray-800);">Extraction looks good!</strong>
          <p style="font-size:13px; color:var(--gray-600); margin-top:2px;">
            The sample extractions above show how your data will be mapped. Uncheck any fields you want to exclude.
          </p>
        </div>
      </div>
    `;

    this._bindEvents();
  },

  _bindEvents() {
    document.querySelectorAll('.extraction-table input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const sampleId = parseInt(e.target.dataset.sample, 10);
        const fieldIdx = parseInt(e.target.dataset.field, 10);
        const sample = MockData.sampleExtractions.find(s => s.id === sampleId);
        if (sample) {
          sample.fields[fieldIdx].checked = e.target.checked;
        }
      });
    });
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  validate() {
    return true;
  }
};
