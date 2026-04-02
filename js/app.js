/**
 * App - Main orchestrator for the Import Wizard
 */
const App = {
  currentStep: 0,
  pages: [UploadPage, ActionsPage, FieldMappingPage, SampleExtractionPage, AssignPage],
  savedAppHTML: null,

  init() {
    Stepper.setStep(0);
    this.renderCurrentPage();
    this._bindNavigation();
  },

  renderCurrentPage() {
    const page = this.pages[this.currentStep];
    page.render();
    Stepper.setStep(this.currentStep);
    this._updateNavButtons();
  },

  _bindNavigation() {
    document.getElementById('btnNext').addEventListener('click', () => this.nextStep());
    document.getElementById('btnPrevious').addEventListener('click', () => this.prevStep());
    document.getElementById('btnCancel').addEventListener('click', () => this.cancel());
  },

  nextStep() {
    const currentPage = this.pages[this.currentStep];

    // Validate current page
    if (currentPage.validate && !currentPage.validate()) return;

    // Auto-simulate upload if on upload page with no files
    if (this.currentStep === 0 && UploadPage.uploadedFiles.length === 0) {
      UploadPage.simulateUpload();
      return;
    }

    if (this.currentStep < this.pages.length - 1) {
      this.currentStep++;
      this.renderCurrentPage();
    }
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderCurrentPage();
    }
  },

  cancel() {
    if (confirm('Are you sure you want to cancel the import?')) {
      this.currentStep = 0;
      UploadPage.uploadedFiles = [];
      UploadPage.uploadMode = null;
      this.renderCurrentPage();
    }
  },

  _updateNavButtons() {
    const prevBtn = document.getElementById('btnPrevious');
    const nextBtn = document.getElementById('btnNext');
    const migrateLink = document.getElementById('migrateLink');

    prevBtn.style.display = this.currentStep > 0 ? 'inline-block' : 'none';

    if (this.currentStep === this.pages.length - 1) {
      // On the last step (Assign), hide the Next button (Submit is in-page)
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = 'Next';
    }

    migrateLink.style.display = this.currentStep === 0 ? 'inline' : 'none';
  },

  showApprovalView() {
    // Save current wizard state HTML
    this.savedAppHTML = document.getElementById('app').innerHTML;
    ApprovalView.render();
  },

  restoreWizard() {
    const app = document.getElementById('app');
    app.innerHTML = this.savedAppHTML;
    // Re-bind navigation buttons
    document.getElementById('btnNext').addEventListener('click', () => this.nextStep());
    document.getElementById('btnPrevious').addEventListener('click', () => this.prevStep());
    document.getElementById('btnCancel').addEventListener('click', () => this.cancel());
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
      // Fallback toast if container doesn't exist
      const fallback = document.createElement('div');
      fallback.className = 'toast-container';
      fallback.style.cssText = 'position:fixed; top:20px; right:20px; z-index:2000;';
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      fallback.appendChild(toast);
      document.body.appendChild(fallback);
      setTimeout(() => fallback.remove(), 3000);
      return;
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
