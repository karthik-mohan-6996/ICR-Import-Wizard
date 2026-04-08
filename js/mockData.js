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

  // Sample extracted records for preview
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
    },
    {
      id: 2,
      imageName: 'business_card_002.jpg',
      cardInfo: { name: 'Sarah Johnson', role: 'Marketing Director', company: 'Apex Digital' },
      fields: [
        { field: 'Phone', value: '+1 415 555 0198', checked: true },
        { field: 'Email', value: 'sarah.j@apexdigital.com', checked: true },
        { field: 'First Name', value: 'Sarah', checked: true },
        { field: 'Last Name', value: 'Johnson', checked: true },
      ]
    }
  ],

  // Records for approval view — each has extractedFields for Review Readiness
  approvalRecords: [
    {
      id: 1, contactName: 'அRj', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending',
      extractedData: {
        firstName: 'அRj', lastName: '', email: 'arj@example.com', phone: '+91 98765 43210', company: 'TechCorp'
      },
      existingData: {
        firstName: '', lastName: '', email: '', phone: '', company: ''
      }
    },
    {
      id: 2, contactName: 'test', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending',
      extractedData: {
        firstName: 'Anthony', lastName: "D'Silva", email: '', phone: '+91 22 6718 6718', company: 'Hansen Group'
      },
      existingData: {
        firstName: 'Anthony', lastName: "D'Silva", email: '', phone: '+91 22 6718 6718', company: 'Hansen Group'
      }
    },
    {
      id: 3, contactName: 'car image', email: '', phone: '', createdTime: 'Jan 7, 2026 17:54', owner: 'Vigneshwaran', status: 'pending',
      extractedData: null,
      existingData: { firstName: '', lastName: '', email: '', phone: '', company: '' }
    },
    {
      id: 4, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending',
      extractedData: {
        firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@apexdigital.com', phone: '+1 415 555 0198', company: 'Apex Digital'
      },
      existingData: {
        firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@old-email.com', phone: '+1 415 555 0198', company: ''
      }
    },
    {
      id: 5, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending',
      extractedData: {
        firstName: 'James', lastName: 'Lee', email: '', phone: '', company: 'Innovate Labs'
      },
      existingData: {
        firstName: '', lastName: '', email: '', phone: '', company: ''
      }
    },
    {
      id: 6, contactName: 'test', email: '', phone: '', createdTime: 'Dec 24, 2025 12:33', owner: 'Vigneshwaran', status: 'pending',
      extractedData: {
        firstName: 'Maria', lastName: 'Gomez', email: 'maria@gomez.co', phone: '+52 55 1234 5678', company: 'Gomez Corp'
      },
      existingData: {
        firstName: 'Maria', lastName: 'Gomez', email: 'maria@gomez.co', phone: '+52 55 1234 5678', company: 'Gomez Corp'
      }
    },
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
