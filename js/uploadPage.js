/**
 * Upload Page - Step 1
 * Two side-by-side cards: From File and From Image
 */
const UploadPage = {
  uploadedFiles: [],
  uploadMode: null, // 'file' or 'image'

  render() {
    const content = document.getElementById('wizardContent');
    content.innerHTML = `
      <!-- Uploaded Files List -->
      ${this.uploadedFiles.length > 0 ? `
        <div class="uploaded-files-section" id="uploadedFilesSection">
          <div class="uploaded-files-header">
            Uploaded Files <span style="color:var(--gray-400); margin-left:4px;">${this.uploadedFiles.length}</span>
          </div>
          <div id="uploadedFilesList">
            ${this.uploadedFiles.map((file, i) => `
              <div class="uploaded-file-item">
                <i class="fas fa-${file.name.endsWith('.zip') ? 'file-archive' : 'file-image'} file-icon"></i>
                <span class="file-name">${this._escapeHtml(file.name)}</span>
                <i class="fas fa-times file-remove" data-index="${i}"></i>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="upload-cards-row">
        <!-- From File Card -->
        <div class="upload-card-v2 ${this.uploadMode === 'file' ? 'active' : ''}" id="uploadFromFile">
          <div class="card-v2-header">
            <span class="card-v2-icon file-icon-circle"><i class="fas fa-file-alt"></i></span>
            <strong>From File</strong>
          </div>
          <p class="card-v2-desc">Drag and drop your file here.</p>
          <p class="card-v2-or">- or -</p>
          <button class="browse-btn-v2 browse-file" id="browseFileBtn">Browse</button>
          <div class="card-v2-sample">
            Download sample file <a href="#" class="link-green">CSV</a> or <a href="#" class="link-green">XLSX</a>
          </div>
          <p class="card-v2-note">
            You can import up to 5000 records through an .xls,
            .xlsx, .vcf or .csv file. To import more than 5000
            records at a time, use a .csv file.
          </p>
        </div>

        <!-- Or Divider -->
        <div class="upload-or-divider">
          <div class="or-line"></div>
          <span>or</span>
          <div class="or-line"></div>
        </div>

        <!-- From Image Card -->
        <div class="upload-card-v2 ${this.uploadMode === 'image' ? 'active' : ''}" id="uploadFromImage">
          <div class="card-v2-header">
            <span class="card-v2-icon image-icon-circle"><i class="fas fa-file-image"></i></span>
            <strong>From Image</strong>
          </div>
          <p class="card-v2-desc">Drag and drop your file here.</p>
          <p class="card-v2-or">- or -</p>
          <button class="browse-btn-v2 browse-image" id="browseImageBtn">Browse</button>
          <div class="card-v2-sample">
            Download sample file <a href="#" class="link-blue">Jpg</a> <strong>or</strong> <a href="#" class="link-green">PNG</a>
          </div>
          <p class="card-v2-note">
            <strong>you can import upto 30 images<br>through a zipped folder</strong>
          </p>
        </div>
      </div>

      <!-- Upload Notes -->
      <div class="upload-notes">
        <ul>
          <li>To import more than 5000 records at a time, use a .csv file.</li>
          <li>Each file size cannot exceed 25MB.</li>
          <li>You cannot upload more than 10 files.</li>
        </ul>
      </div>

      <!-- Hidden file inputs -->
      <input type="file" id="fileInput" accept=".csv,.xls,.xlsx,.vcf" style="display:none;" multiple>
      <input type="file" id="imageInput" accept=".zip,.jpg,.jpeg,.png" style="display:none;" multiple>
    `;

    this._bindEvents();
  },

  _bindEvents() {
    // Card click selects mode
    document.getElementById('uploadFromFile').addEventListener('click', (e) => {
      if (e.target.closest('.browse-btn-v2')) return;
      this.uploadMode = 'file';
      this.render();
    });
    document.getElementById('uploadFromImage').addEventListener('click', (e) => {
      if (e.target.closest('.browse-btn-v2')) return;
      this.uploadMode = 'image';
      this.render();
    });

    // Browse buttons
    document.getElementById('browseFileBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.uploadMode = 'file';
      document.getElementById('fileInput').click();
    });
    document.getElementById('browseImageBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.uploadMode = 'image';
      document.getElementById('imageInput').click();
    });

    // File input handlers
    document.getElementById('fileInput').addEventListener('change', (e) => this._handleFiles(e.target.files));
    document.getElementById('imageInput').addEventListener('change', (e) => this._handleFiles(e.target.files));

    // Remove file buttons
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        this.uploadedFiles.splice(index, 1);
        this.render();
      });
    });
  },

  _handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    for (const file of fileList) {
      if (this.uploadedFiles.length >= 10) {
        App.showToast('Cannot upload more than 10 files', 'error');
        break;
      }
      this.uploadedFiles.push({ name: file.name, size: file.size, type: file.type });
    }

    if (this.uploadedFiles.length === 0) {
      this.uploadedFiles.push({ name: 'images.zip', size: 2048000, type: 'application/zip' });
    }

    this.render();
    App.showToast('Files uploaded successfully', 'success');
  },

  simulateUpload() {
    if (this.uploadedFiles.length === 0) {
      this.uploadMode = 'image';
      this.uploadedFiles = [{ name: 'images.zip', size: 2048000, type: 'application/zip' }];
      this.render();
    }
  },

  validate() {
    if (this.uploadedFiles.length === 0) {
      App.showToast('Please upload at least one file to continue', 'error');
      return false;
    }
    return true;
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
