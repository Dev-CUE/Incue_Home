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

// Mobile menu toggle will go here
