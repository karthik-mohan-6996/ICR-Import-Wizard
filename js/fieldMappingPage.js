/**
 * Field Mapping Page - Step 3
 * Multi-select dropdown for fields, with editable prompt instructions per field.
 */
const FieldMappingPage = {
  selectedGeneralFields: [],
  selectedSubformFields: {},
  generalPrompts: [],    // [{fieldId, fieldName, prompt}]
  subformPrompts: {},    // { subform_id: [{fieldId, fieldName, prompt}] }
  advancedGeneralEnabled: true,
  advancedSubformEnabled: {},
  generalDropdownOpen: false,
  subformDropdownOpen: {},
  maxGeneralFields: 15,
  maxSubformFields: 15,
  _initialized: false,

  _init() {
    if (this._initialized) return;
    this._initialized = true;
    this.selectedGeneralFields = MockData.generalFields.slice(0, 8).map(f => f.id);
    MockData.subforms.forEach(sf => {
      this.selectedSubformFields[sf.id] = sf.fields.slice(0, 8).map(f => f.id);
      this.advancedSubformEnabled[sf.id] = true;
      this.subformDropdownOpen[sf.id] = false;
      this.subformPrompts[sf.id] = sf.prompts.map((p, i) => ({
        fieldId: sf.fields[i] ? sf.fields[i].id : sf.fields[0].id,
        fieldName: sf.fields[i] ? sf.fields[i].label : sf.fields[0].label,
        prompt: p.prompt
      }));
    });
    this.generalPrompts = MockData.generalPrompts.slice(0, 2).map((p, i) => ({
      fieldId: MockData.generalFields[i] ? MockData.generalFields[i].id : MockData.generalFields[0].id,
      fieldName: MockData.generalFields[i] ? MockData.generalFields[i].label : MockData.generalFields[0].label,
      prompt: p.prompt
    }));
  },

  render() {
    this._init();
    const content = document.getElementById('wizardContent');

    content.innerHTML = `
      <div class="field-mapping-header">
        <h2>Fields configured for extraction</h2>
        <button class="assign-default-btn" id="assignDefaultBtn">Assign Default Value</button>
      </div>

      <!-- General Fields Section -->
      <div class="extraction-section">
        <div class="extraction-section-header">
          <h3>General Fields to be Extracted <span class="badge" id="generalFieldCount">${this.selectedGeneralFields.length}</span></h3>
        </div>
        <div class="extraction-section-body">
          <!-- Maximum Limit -->
          <div class="field-limit-bar">
            <span class="limit-label">Maximum Limit</span>
            <span class="limit-count">${this.selectedGeneralFields.length}/${this.maxGeneralFields}</span>
          </div>

          <!-- Multi-select dropdown -->
          <div class="multiselect-field">
            <label class="multiselect-label">Choose fields</label>
            <div class="multiselect-box" id="generalMultiselect">
              <div class="multiselect-tags">
                ${this.selectedGeneralFields.map(fid => {
                  const f = MockData.generalFields.find(x => x.id === fid);
                  return f ? `<span class="ms-tag">${this._escapeHtml(f.label)}<i class="fas fa-times ms-tag-remove" data-group="general" data-id="${f.id}"></i></span>` : '';
                }).join('')}
                <span class="ms-placeholder">${this.selectedGeneralFields.length === 0 ? 'None' : ''}</span>
              </div>
              <i class="fas fa-chevron-down ms-arrow" id="generalDropdownToggle"></i>
            </div>
            <div class="multiselect-dropdown ${this.generalDropdownOpen ? '' : 'hidden'}" id="generalDropdown">
              ${MockData.generalFields.map(f => `
                <label class="ms-option">
                  <input type="checkbox" value="${f.id}" data-group="general"
                    ${this.selectedGeneralFields.includes(f.id) ? 'checked' : ''}
                    ${!this.selectedGeneralFields.includes(f.id) && this.selectedGeneralFields.length >= this.maxGeneralFields ? 'disabled' : ''}>
                  ${this._escapeHtml(f.label)}
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Advanced Extraction Instructions -->
          <div class="advanced-instructions">
            <div class="advanced-header">
              <input type="checkbox" id="advancedGeneralCheck" ${this.advancedGeneralEnabled ? 'checked' : ''}>
              <label for="advancedGeneralCheck">
                <strong>Advanced Extraction Instructions for Zia</strong>
                <i class="fas fa-sparkles" style="color:var(--blue); font-size:12px; margin-left:4px;"></i>
              </label>
            </div>
            <p class="advanced-desc">You can add detailed guidelines to help Zia perform data extraction more effectively and in alignment with your organization's specific preferences.</p>

            <div class="prompt-instructions-list" id="generalPromptsList">
              ${this.generalPrompts.map((p, i) => this._renderPromptRow(p, i, 'general')).join('')}
            </div>

            <button class="btn-link add-field-btn" id="addGeneralPrompt" ${!this.advancedGeneralEnabled ? 'disabled' : ''}>
              <i class="fas fa-plus"></i> Add Field
            </button>
          </div>
        </div>
      </div>

      <!-- Subform Fields Section -->
      ${MockData.subforms.map(sf => `
        <div class="extraction-section" style="margin-top:32px;">
          <div class="extraction-section-header">
            <h3>Subform Fields to be Extracted <span class="badge" id="subformFieldCount_${sf.id}">${(this.selectedSubformFields[sf.id] || []).length}</span></h3>
          </div>
          <div class="extraction-section-body">
            <div class="subform-header">
              <strong>${sf.label}</strong> <span class="badge">${sf.fieldCount}</span>
            </div>

            <div class="field-limit-bar">
              <span class="limit-label">Maximum Limit</span>
              <span class="limit-count">${(this.selectedSubformFields[sf.id] || []).length}/${this.maxSubformFields}</span>
            </div>

            <div class="multiselect-field">
              <label class="multiselect-label">Choose fields</label>
              <div class="multiselect-box" data-sf-multiselect="${sf.id}">
                <div class="multiselect-tags">
                  ${(this.selectedSubformFields[sf.id] || []).map(fid => {
                    const f = sf.fields.find(x => x.id === fid);
                    return f ? `<span class="ms-tag">${this._escapeHtml(f.label)}<i class="fas fa-times ms-tag-remove" data-group="subform" data-subform="${sf.id}" data-id="${f.id}"></i></span>` : '';
                  }).join('')}
                  <span class="ms-placeholder">${(this.selectedSubformFields[sf.id] || []).length === 0 ? 'None' : ''}</span>
                </div>
                <i class="fas fa-chevron-down ms-arrow" data-sf-toggle="${sf.id}"></i>
              </div>
              <div class="multiselect-dropdown ${this.subformDropdownOpen[sf.id] ? '' : 'hidden'}" data-sf-dropdown="${sf.id}">
                ${sf.fields.map(f => `
                  <label class="ms-option">
                    <input type="checkbox" value="${f.id}" data-group="subform" data-subform="${sf.id}"
                      ${(this.selectedSubformFields[sf.id] || []).includes(f.id) ? 'checked' : ''}
                      ${!(this.selectedSubformFields[sf.id] || []).includes(f.id) && (this.selectedSubformFields[sf.id] || []).length >= this.maxSubformFields ? 'disabled' : ''}>
                    ${this._escapeHtml(f.label)}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="advanced-instructions">
              <div class="advanced-header">
                <input type="checkbox" id="advancedSubformCheck_${sf.id}" ${this.advancedSubformEnabled[sf.id] ? 'checked' : ''}>
                <label for="advancedSubformCheck_${sf.id}">
                  <strong>Advanced Extraction Instructions for Zia</strong>
                  <i class="fas fa-sparkles" style="color:var(--blue); font-size:12px; margin-left:4px;"></i>
                </label>
              </div>
              <p class="advanced-desc">You can add detailed guidelines to help Zia perform data extraction more effectively and in alignment with your organization's specific preferences.</p>

              <div class="prompt-instructions-list" data-sf-prompts="${sf.id}">
                ${(this.subformPrompts[sf.id] || []).map((p, i) => this._renderPromptRow(p, i, 'subform', sf.id)).join('')}
              </div>

              <button class="btn-link add-field-btn" data-add-sf-prompt="${sf.id}" ${!this.advancedSubformEnabled[sf.id] ? 'disabled' : ''}>
                <i class="fas fa-plus"></i> Add Field
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    `;

    this._bindEvents();
  },

  _renderPromptRow(p, index, group, subformId) {
    const fields = group === 'general' ? MockData.generalFields : (MockData.subforms.find(s => s.id === subformId) || {}).fields || [];
    const dataAttrs = group === 'general' ? `data-group="general" data-index="${index}"` : `data-group="subform" data-subform="${subformId}" data-index="${index}"`;

    return `
      <div class="prompt-instruction-row" ${dataAttrs}>
        <div class="prompt-row-fields">
          <div class="prompt-field-group">
            <label class="prompt-field-label">Field Name</label>
            <select class="prompt-field-select" data-role="fieldName" ${dataAttrs}>
              ${fields.map(f => `<option value="${f.id}" ${p.fieldId === f.id ? 'selected' : ''}>${this._escapeHtml(f.label)}</option>`).join('')}
            </select>
          </div>
          <div class="prompt-field-group">
            <label class="prompt-field-label">Prompt</label>
            <textarea class="prompt-field-textarea" data-role="prompt" ${dataAttrs} rows="1" placeholder="Sample text">${this._escapeHtml(p.prompt)}</textarea>
          </div>
        </div>
        <button class="prompt-delete-btn" data-role="delete" ${dataAttrs} title="Delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  },

  _bindEvents() {
    // --- General multi-select dropdown ---
    document.getElementById('generalDropdownToggle').addEventListener('click', () => {
      this.generalDropdownOpen = !this.generalDropdownOpen;
      document.getElementById('generalDropdown').classList.toggle('hidden');
    });
    document.getElementById('generalMultiselect').addEventListener('click', (e) => {
      if (e.target.closest('.ms-arrow') || e.target.closest('.ms-tag-remove')) return;
      this.generalDropdownOpen = !this.generalDropdownOpen;
      document.getElementById('generalDropdown').classList.toggle('hidden');
    });

    // General checkbox changes
    document.querySelectorAll('#generalDropdown input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const fid = e.target.value;
        if (e.target.checked) {
          if (this.selectedGeneralFields.length < this.maxGeneralFields) {
            this.selectedGeneralFields.push(fid);
          } else {
            e.target.checked = false;
            App.showToast(`Maximum ${this.maxGeneralFields} fields allowed`, 'error');
            return;
          }
        } else {
          this.selectedGeneralFields = this.selectedGeneralFields.filter(id => id !== fid);
        }
        this.render();
      });
    });

    // General tag remove
    document.querySelectorAll('.ms-tag-remove[data-group="general"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fid = btn.dataset.id;
        this.selectedGeneralFields = this.selectedGeneralFields.filter(id => id !== fid);
        this.render();
      });
    });

    // --- Subform multi-select dropdowns ---
    document.querySelectorAll('[data-sf-toggle]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const sfId = toggle.dataset.sfToggle;
        this.subformDropdownOpen[sfId] = !this.subformDropdownOpen[sfId];
        document.querySelector(`[data-sf-dropdown="${sfId}"]`).classList.toggle('hidden');
      });
    });
    document.querySelectorAll('[data-sf-multiselect]').forEach(box => {
      box.addEventListener('click', (e) => {
        if (e.target.closest('.ms-arrow') || e.target.closest('.ms-tag-remove')) return;
        const sfId = box.dataset.sfMultiselect;
        this.subformDropdownOpen[sfId] = !this.subformDropdownOpen[sfId];
        document.querySelector(`[data-sf-dropdown="${sfId}"]`).classList.toggle('hidden');
      });
    });

    // Subform checkbox changes
    document.querySelectorAll('.multiselect-dropdown input[data-group="subform"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const fid = e.target.value;
        const sfId = e.target.dataset.subform;
        if (!this.selectedSubformFields[sfId]) this.selectedSubformFields[sfId] = [];
        if (e.target.checked) {
          if (this.selectedSubformFields[sfId].length < this.maxSubformFields) {
            this.selectedSubformFields[sfId].push(fid);
          } else {
            e.target.checked = false;
            App.showToast(`Maximum ${this.maxSubformFields} fields allowed`, 'error');
            return;
          }
        } else {
          this.selectedSubformFields[sfId] = this.selectedSubformFields[sfId].filter(id => id !== fid);
        }
        this.render();
      });
    });

    // Subform tag remove
    document.querySelectorAll('.ms-tag-remove[data-group="subform"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fid = btn.dataset.id;
        const sfId = btn.dataset.subform;
        this.selectedSubformFields[sfId] = (this.selectedSubformFields[sfId] || []).filter(id => id !== fid);
        this.render();
      });
    });

    // --- Advanced toggle ---
    const advGenCheck = document.getElementById('advancedGeneralCheck');
    if (advGenCheck) {
      advGenCheck.addEventListener('change', (e) => {
        this.advancedGeneralEnabled = e.target.checked;
        this.render();
      });
    }
    MockData.subforms.forEach(sf => {
      const check = document.getElementById(`advancedSubformCheck_${sf.id}`);
      if (check) {
        check.addEventListener('change', (e) => {
          this.advancedSubformEnabled[sf.id] = e.target.checked;
          this.render();
        });
      }
    });

    // --- Prompt edits (general) ---
    document.querySelectorAll('.prompt-field-select[data-group="general"]').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(sel.dataset.index, 10);
        const field = MockData.generalFields.find(f => f.id === e.target.value);
        this.generalPrompts[idx].fieldId = e.target.value;
        this.generalPrompts[idx].fieldName = field ? field.label : e.target.value;
      });
    });
    document.querySelectorAll('.prompt-field-textarea[data-group="general"]').forEach(ta => {
      ta.addEventListener('input', (e) => {
        const idx = parseInt(ta.dataset.index, 10);
        this.generalPrompts[idx].prompt = e.target.value;
      });
    });

    // Prompt delete (general)
    document.querySelectorAll('.prompt-delete-btn[data-group="general"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        this.generalPrompts.splice(idx, 1);
        this.render();
      });
    });

    // Add general prompt
    const addGenBtn = document.getElementById('addGeneralPrompt');
    if (addGenBtn) {
      addGenBtn.addEventListener('click', () => {
        const firstField = MockData.generalFields[0];
        this.generalPrompts.push({ fieldId: firstField.id, fieldName: firstField.label, prompt: '' });
        this.render();
      });
    }

    // --- Prompt edits (subform) ---
    document.querySelectorAll('.prompt-field-select[data-group="subform"]').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const sfId = sel.dataset.subform;
        const idx = parseInt(sel.dataset.index, 10);
        const sf = MockData.subforms.find(s => s.id === sfId);
        const field = sf ? sf.fields.find(f => f.id === e.target.value) : null;
        this.subformPrompts[sfId][idx].fieldId = e.target.value;
        this.subformPrompts[sfId][idx].fieldName = field ? field.label : e.target.value;
      });
    });
    document.querySelectorAll('.prompt-field-textarea[data-group="subform"]').forEach(ta => {
      ta.addEventListener('input', (e) => {
        const sfId = ta.dataset.subform;
        const idx = parseInt(ta.dataset.index, 10);
        this.subformPrompts[sfId][idx].prompt = e.target.value;
      });
    });

    // Prompt delete (subform)
    document.querySelectorAll('.prompt-delete-btn[data-group="subform"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sfId = btn.dataset.subform;
        const idx = parseInt(btn.dataset.index, 10);
        this.subformPrompts[sfId].splice(idx, 1);
        this.render();
      });
    });

    // Add subform prompt
    document.querySelectorAll('[data-add-sf-prompt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sfId = btn.dataset.addSfPrompt;
        const sf = MockData.subforms.find(s => s.id === sfId);
        const firstField = sf.fields[0];
        if (!this.subformPrompts[sfId]) this.subformPrompts[sfId] = [];
        this.subformPrompts[sfId].push({ fieldId: firstField.id, fieldName: firstField.label, prompt: '' });
        this.render();
      });
    });

    // Assign default value
    document.getElementById('assignDefaultBtn').addEventListener('click', () => {
      App.showToast('Default values assigned', 'success');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.multiselect-field')) {
        if (this.generalDropdownOpen) {
          this.generalDropdownOpen = false;
          const dd = document.getElementById('generalDropdown');
          if (dd) dd.classList.add('hidden');
        }
        MockData.subforms.forEach(sf => {
          if (this.subformDropdownOpen[sf.id]) {
            this.subformDropdownOpen[sf.id] = false;
            const dd = document.querySelector(`[data-sf-dropdown="${sf.id}"]`);
            if (dd) dd.classList.add('hidden');
          }
        });
      }
    }, { once: true });
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  validate() {
    if (this.selectedGeneralFields.length === 0 && Object.values(this.selectedSubformFields).every(arr => arr.length === 0)) {
      App.showToast('Please select at least one field for extraction', 'error');
      return false;
    }
    return true;
  }
};
