/**
 * Stepper component for the wizard navigation
 */
const Stepper = {
  steps: [
    { id: 'upload', label: 'Upload', number: 1 },
    { id: 'actions', label: 'Actions', number: 2 },
    { id: 'field-mapping', label: 'Field Mapping', number: 3 },
    { id: 'sample-extraction', label: 'Sample Extraction', number: 4 },
    { id: 'assign', label: 'Assign', number: 5 },
  ],

  currentStep: 0,

  render(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = this.steps.map((step, index) => {
      const stateClass = index < this.currentStep ? 'completed' :
                         index === this.currentStep ? 'active' : '';
      const connector = index > 0 ? '<div class="step-connector"></div>' : '';
      return `
        ${connector}
        <div class="step ${stateClass}" data-step="${index}">
          <div class="step-bubble">
            <span class="step-number">${index < this.currentStep ? '' : step.number}</span>
            ${step.label}
          </div>
        </div>
      `;
    }).join('');
  },

  setStep(stepIndex) {
    this.currentStep = stepIndex;
    this.render('stepper');
    this.updateProgressBar();
  },

  updateProgressBar() {
    const bar = document.getElementById('progressBar');
    const percent = (this.currentStep / (this.steps.length - 1)) * 100;
    bar.style.width = percent + '%';
  }
};
