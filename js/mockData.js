/**
 * Mock data for the ICR Import Wizard prototype
 */
const MockData = {
  // Field definitions grouped by general and subform
  generalFields: [
    { id: 'age', label: 'Age' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'first_name', label: 'First name' },
    { id: 'city', label: 'City' },
    { id: 'job_title', label: 'Job tittle' },
    { id: 'first_name_2', label: 'First name' },
    { id: 'city_2', label: 'City' },
    { id: 'city_3', label: 'City' },
    { id: 'pin', label: 'Pin' },
    { id: 'phone', label: 'Phone' },
    { id: 'job_title_2', label: 'Job tittle' },
  ],

  generalPrompts: [
    { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
    { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
    { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
    { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
    { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
  ],

  subforms: [
    {
      id: 'subform_1',
      label: 'Subform - 1',
      fieldCount: 10,
      fields: [
        { id: 'sf_age', label: 'Age' },
        { id: 'sf_name', label: 'Name' },
        { id: 'sf_email', label: 'Email' },
        { id: 'sf_first_name', label: 'First name' },
        { id: 'sf_city', label: 'City' },
        { id: 'sf_job_title', label: 'Job tittle' },
        { id: 'sf_first_name_2', label: 'First name' },
        { id: 'sf_city_2', label: 'City' },
        { id: 'sf_city_3', label: 'City' },
        { id: 'sf_pin', label: 'Pin' },
        { id: 'sf_phone', label: 'Phone' },
        { id: 'sf_job_title_2', label: 'Job tittle' },
      ],
      prompts: [
        { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
        { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
        { fieldName: 'Lead Source', prompt: 'When your sales team manually adds a new lead, a good prompt should specify the required fields.' },
      ]
    }
  ],

  // Combined icrFields for backward compatibility
  icrFields: [
    { id: 'first_name', label: 'First Name', group: 'general', prompt: 'Extract the first name from the document' },
    { id: 'last_name', label: 'Last Name', group: 'general', prompt: 'Extract the last name from the document' },
    { id: 'email', label: 'Email', group: 'general', prompt: 'Extract email address' },
    { id: 'phone', label: 'Phone', group: 'general', prompt: 'Extract phone number' },
    { id: 'city', label: 'City', group: 'general', prompt: 'Extract city name' },
    { id: 'age', label: 'Age', group: 'subform', prompt: 'Extract age if visible' },
    { id: 'job_title', label: 'Job Title', group: 'subform', prompt: 'Extract job title or designation' },
  ],

  // CRM contact field options for association dropdowns
  contactFieldOptions: [
    'None', 'Contact Image', 'First Name', 'Last Name', 'Job Title',
    'Account Number', 'Email', 'Phone', 'Mobile', 'Website', 'Department', 'Fax'
  ],

  // Single sample extraction for association view
  sampleExtraction: {
    id: 1,
    imageName: 'business_card_001.jpg',
    cardInfo: {
      name: 'Philip Wilkerson',
      role: 'Marketing Director',
      company: 'Your Company',
      id: 'ID 1234556',
      department: 'Marketing Department',
      email: 'yourmail@companymail.com',
      phone: '(654) 334-2233',
      website: 'www.webcompany.com'
    },
    fields: [
      { value: '📷 Photo', field: 'Contact Image', checked: true, isImage: true },
      { value: 'Philip Wilkerson', field: 'First Name', checked: true, isImage: false },
      { value: 'Marketing Director', field: 'Job Title', checked: true, isImage: false },
      { value: 'ID 1234556', field: 'Account Number', checked: true, isImage: false },
      { value: 'Marketing Department', field: 'None', checked: false, isImage: false },
      { value: 'yourmail@companymail.com', field: 'None', checked: false, isImage: false },
      { value: '(654) 334-2233', field: 'None', checked: false, isImage: false },
      { value: 'www.webcompany.com', field: 'None', checked: false, isImage: false },
    ]
  },

  // Sample extracted records for preview (legacy)
  sampleExtractions: [
    {
      id: 1,
      imageName: 'business_card_001.jpg',
      cardInfo: { name: 'Anthony D\'Silva', role: 'Senior Executive', company: 'Hansen Group' },
      fields: [
        { field: 'Phone', value: '+91 22 6718 6718', checked: true },
        { field: 'Mobile', value: '+91 22 6718 6718', checked: true },
        { field: 'First Name', value: 'Anthony', checked: true },
        { field: 'Last Name', value: 'D\'Silva', checked: true },
      ]
    }
  ],

  // Create Contact form layout fields
  contactFormFields: [
    { label: 'Last Name', value: 'Philip Wilkerson', type: 'text', required: true, highlighted: true },
    { label: 'Email 18', value: 'yourmail@companymail.com', type: 'text', required: false, highlighted: false },
    { label: 'Email', value: 'yourmail@companymail.com', type: 'text', required: true, highlighted: true },
    { label: 'Test', value: '', type: 'text', required: false, highlighted: false },
    { label: 'First Name', value: '', type: 'picklist', required: false, highlighted: false },
    { label: 'User 3', value: '', type: 'picklist', required: false, highlighted: false },
    { label: 'File Upload 5', value: '', type: 'file', required: false, highlighted: false },
    { label: 'Single Name', value: '', type: 'file', required: false, highlighted: false },
    { label: 'Currency', value: '$', type: 'currency', required: false, highlighted: false },
    { label: 'Currency', value: '$', type: 'currency', required: false, highlighted: false },
    { label: 'Pick List 4', value: 'None', type: 'picklist', required: false, highlighted: false },
    { label: 'Pick List 4', value: 'None', type: 'picklist', required: false, highlighted: false },
    { label: 'Website', value: 'www.webcompany.com', type: 'text', required: false, highlighted: true },
    { label: 'Website', value: 'www.webcompany.com', type: 'text', required: false, highlighted: true },
    { label: 'Multi-Line', value: '', type: 'textarea', required: false, highlighted: false },
    { label: 'Multi-Line', value: '', type: 'textarea', required: false, highlighted: false },
  ],

  // Records for approval view
  approvalRecords: [
    { id: 1, contactName: 'அRj', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending' },
    { id: 2, contactName: 'test', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending' },
    { id: 3, contactName: 'car image', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending' },
    { id: 4, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending' },
    { id: 5, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending' },
    { id: 6, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending' },
  ],

  // Record detail for view/edit
  recordDetail: {
    leadOwner: 'Zia Team',
    firstName: 'Anthony',
    lastName: 'D\'Silva',
    company: '',
    email: '',
    phone: '+91 22 6718 6718',
    mobile: '+91 22 6718 6718',
    fax: '',
    website: '',
    dateOfBirth: '',
    extractedText: 4,
    enrichedField: 4,
  },

  // Layout options
  layouts: ['None', 'Standard', 'Custom Layout 1'],

  // Follow-up task options
  followUpTasks: ['Choose follow-up task', 'Call', 'Email', 'Meeting', 'Task'],

  // Skip duplicate options
  skipDuplicateFields: ['None', 'Email', 'Phone', 'Name + Email', 'Name + Phone'],

  // Users list
  users: ['All Users', 'Vigneshwaran', 'Zia Team', 'Admin'],
};
