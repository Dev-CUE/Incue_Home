// Main JavaScript file
console.log('Incue Website Loaded');

// Form Validation Module
const FormValidator = {
  /**
   * Validates email format
   * @param {string} email - Email address to validate
   * @returns {object} - Validation result with isValid and error message
   */
  validateEmail: function(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      return { isValid: false, error: 'Email cannot be empty' };
    }

    // RFC 5322 simplified email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (trimmedEmail.length > 254) {
      return { isValid: false, error: 'Email is too long (max 254 characters)' };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validates name field
   * @param {string} name - Name to validate
   * @returns {object} - Validation result with isValid and error message
   */
  validateName: function(name) {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return { isValid: false, error: 'Name cannot be empty' };
    }

    if (trimmedName.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters' };
    }

    if (trimmedName.length > 100) {
      return { isValid: false, error: 'Name is too long (max 100 characters)' };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes, Korean, Chinese, Japanese)
    const nameRegex = /^[a-zA-Z\s\-'가-힣\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;

    if (!nameRegex.test(trimmedName)) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validates company name field (optional field)
   * @param {string} company - Company name to validate
   * @returns {object} - Validation result with isValid and error message
   */
  validateCompany: function(company) {
    // Company is optional, so empty is valid
    if (!company || typeof company !== 'string') {
      return { isValid: true, error: null };
    }

    const trimmedCompany = company.trim();

    if (trimmedCompany.length === 0) {
      return { isValid: true, error: null };
    }

    if (trimmedCompany.length > 200) {
      return { isValid: false, error: 'Company name is too long (max 200 characters)' };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validates message field
   * @param {string} message - Message to validate
   * @returns {object} - Validation result with isValid and error message
   */
  validateMessage: function(message) {
    if (!message || typeof message !== 'string') {
      return { isValid: false, error: 'Message is required' };
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    if (trimmedMessage.length < 10) {
      return { isValid: false, error: 'Message must be at least 10 characters' };
    }

    if (trimmedMessage.length > 5000) {
      return { isValid: false, error: 'Message is too long (max 5000 characters)' };
    }

    return { isValid: true, error: null };
  },

  /**
   * Sanitizes input by trimming whitespace and removing potentially harmful characters
   * @param {string} input - Input to sanitize
   * @returns {string} - Sanitized input
   */
  sanitizeInput: function(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Trim whitespace
    let sanitized = input.trim();

    // Remove control characters except newlines and tabs
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Remove multiple consecutive spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
  },

  /**
   * Validates entire contact form
   * @param {object} formData - Form data with name, email, company, message
   * @returns {object} - Validation result with isValid, errors object, and sanitized data
   */
  validateContactForm: function(formData) {
    const errors = {};
    const sanitizedData = {};

    // Sanitize all inputs first
    const sanitizedName = this.sanitizeInput(formData.name);
    const sanitizedEmail = this.sanitizeInput(formData.email);
    const sanitizedCompany = this.sanitizeInput(formData.company);
    const sanitizedMessage = this.sanitizeInput(formData.message);

    // Validate name
    const nameValidation = this.validateName(sanitizedName);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
    } else {
      sanitizedData.name = sanitizedName;
    }

    // Validate email
    const emailValidation = this.validateEmail(sanitizedEmail);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    } else {
      sanitizedData.email = sanitizedEmail;
    }

    // Validate company (optional)
    const companyValidation = this.validateCompany(sanitizedCompany);
    if (!companyValidation.isValid) {
      errors.company = companyValidation.error;
    } else {
      sanitizedData.company = sanitizedCompany;
    }

    // Validate message
    const messageValidation = this.validateMessage(sanitizedMessage);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.error;
    } else {
      sanitizedData.message = sanitizedMessage;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      sanitizedData: sanitizedData
    };
  },

  /**
   * Checks if a string contains potentially malicious content
   * @param {string} input - Input to check
   * @returns {boolean} - True if suspicious content is detected
   */
  containsSuspiciousContent: function(input) {
    if (!input || typeof input !== 'string') {
      return false;
    }

    // Check for common XSS patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers like onclick=
      /<iframe/i,
      /eval\s*\(/i,
      /<object/i,
      /<embed/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }
};

// Export for Node.js (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}

// Contact Form Handler
const ContactFormHandler = {
  // EmailJS Configuration
  // IMPORTANT: Replace these values with your actual EmailJS credentials
  // Get them from: https://www.emailjs.com/
  config: {
    serviceId: 'YOUR_SERVICE_ID',        // Replace with your EmailJS Service ID
    templateId: 'YOUR_TEMPLATE_ID',      // Replace with your EmailJS Template ID
    publicKey: 'YOUR_PUBLIC_KEY'         // Replace with your EmailJS Public Key
  },

  /**
   * Initializes the contact form
   */
  init: function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', this.handleSubmit.bind(this));
  },

  /**
   * Handles form submission
   * @param {Event} event - Form submit event
   */
  handleSubmit: function(event) {
    event.preventDefault();

    // Clear previous error messages
    this.clearErrors();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      message: document.getElementById('message').value
    };

    // Validate form
    const validation = FormValidator.validateContactForm(formData);

    if (!validation.isValid) {
      this.displayErrors(validation.errors);
      return;
    }

    // Check for suspicious content
    const allContent = Object.values(formData).join(' ');
    if (FormValidator.containsSuspiciousContent(allContent)) {
      this.showMessage('보안상의 이유로 문의를 전송할 수 없습니다. 특수문자를 확인해주세요.', 'error');
      return;
    }

    // Show loading state
    this.setLoading(true);

    // Send email using EmailJS
    this.sendEmail(validation.sanitizedData);
  },

  /**
   * Sends email using EmailJS
   * @param {object} data - Sanitized form data
   */
  sendEmail: function(data) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      this.showMessage('EmailJS 라이브러리를 로드할 수 없습니다. 페이지를 새로고침해주세요.', 'error');
      this.setLoading(false);
      return;
    }

    // Check if configuration is set
    if (this.config.serviceId === 'YOUR_SERVICE_ID') {
      this.showMessage('EmailJS 설정이 필요합니다. 관리자에게 문의하세요.', 'error');
      this.setLoading(false);
      console.error('EmailJS configuration not set. Please update the config object in main.js');
      return;
    }

    // Prepare template parameters
    const templateParams = {
      to_email: 'sales@incue.co.kr',
      from_name: data.name,
      from_email: data.email,
      company: data.company || '미입력',
      message: data.message,
      reply_to: data.email
    };

    // Send email
    emailjs.send(this.config.serviceId, this.config.templateId, templateParams, this.config.publicKey)
      .then((response) => {
        console.log('Email sent successfully:', response);
        this.showMessage('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
        this.resetForm();
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        this.showMessage('문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      })
      .finally(() => {
        this.setLoading(false);
      });
  },

  /**
   * Displays validation errors
   * @param {object} errors - Validation errors
   */
  displayErrors: function(errors) {
    Object.keys(errors).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[fieldName];
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
      }
    });
  },

  /**
   * Clears all error messages
   */
  clearErrors: function() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
  },

  /**
   * Shows success or error message
   * @param {string} message - Message to display
   * @param {string} type - Message type ('success' or 'error')
   */
  showMessage: function(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    // Insert message at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);

    // Auto-remove success message after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  },

  /**
   * Sets loading state
   * @param {boolean} isLoading - Loading state
   */
  setLoading: function(isLoading) {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? '전송 중...' : '문의하기';
    }
  },

  /**
   * Resets the form
   */
  resetForm: function() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.reset();
    }
  }
};

// Initialize contact form when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    ContactFormHandler.init();
  });
}

// Mobile menu toggle will go here
