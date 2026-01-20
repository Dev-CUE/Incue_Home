const FormValidator = require('./main.js');

describe('FormValidator', () => {

  describe('validateEmail', () => {

    test('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        const result = FormValidator.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@domain',
        'user @domain.com',
        'user@domain .com',
        'user@@domain.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = FormValidator.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });

    test('should reject null or undefined email', () => {
      expect(FormValidator.validateEmail(null).isValid).toBe(false);
      expect(FormValidator.validateEmail(undefined).isValid).toBe(false);
      expect(FormValidator.validateEmail(null).error).toBe('Email is required');
    });

    test('should reject non-string email', () => {
      expect(FormValidator.validateEmail(123).isValid).toBe(false);
      expect(FormValidator.validateEmail({}).isValid).toBe(false);
      expect(FormValidator.validateEmail([]).isValid).toBe(false);
    });

    test('should trim whitespace from email', () => {
      const result = FormValidator.validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
    });

    test('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      const result = FormValidator.validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should reject whitespace-only email', () => {
      const result = FormValidator.validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email cannot be empty');
    });
  });

  describe('validateName', () => {

    test('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'Jane',
        "O'Brien",
        'Mary-Jane',
        '홍길동',
        '山田太郎',
        'Jean-Pierre'
      ];

      validNames.forEach(name => {
        const result = FormValidator.validateName(name);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    test('should reject names that are too short', () => {
      const result = FormValidator.validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 2 characters');
    });

    test('should reject names that are too long', () => {
      const longName = 'A'.repeat(101);
      const result = FormValidator.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should reject null or undefined name', () => {
      expect(FormValidator.validateName(null).isValid).toBe(false);
      expect(FormValidator.validateName(undefined).isValid).toBe(false);
      expect(FormValidator.validateName(null).error).toBe('Name is required');
    });

    test('should reject empty or whitespace-only name', () => {
      expect(FormValidator.validateName('').isValid).toBe(false);
      expect(FormValidator.validateName('   ').isValid).toBe(false);
      expect(FormValidator.validateName('').error).toBe('Name is required');
      expect(FormValidator.validateName('   ').error).toBe('Name cannot be empty');
    });

    test('should reject names with invalid characters', () => {
      const invalidNames = [
        'John123',
        'Jane@Doe',
        'Test#Name',
        'Name!',
        'User$Name'
      ];

      invalidNames.forEach(name => {
        const result = FormValidator.validateName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('invalid characters');
      });
    });

    test('should trim whitespace from name', () => {
      const result = FormValidator.validateName('  John Doe  ');
      expect(result.isValid).toBe(true);
    });

    test('should accept Korean names', () => {
      const result = FormValidator.validateName('김철수');
      expect(result.isValid).toBe(true);
    });

    test('should accept Japanese names', () => {
      const result = FormValidator.validateName('田中太郎');
      expect(result.isValid).toBe(true);
    });

    test('should accept Chinese names', () => {
      const result = FormValidator.validateName('王小明');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateCompany', () => {

    test('should accept valid company names', () => {
      const validCompanies = [
        'Acme Corporation',
        'Tech Inc.',
        '삼성전자',
        'Google LLC'
      ];

      validCompanies.forEach(company => {
        const result = FormValidator.validateCompany(company);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    test('should accept empty company name (optional field)', () => {
      expect(FormValidator.validateCompany('').isValid).toBe(true);
      expect(FormValidator.validateCompany(null).isValid).toBe(true);
      expect(FormValidator.validateCompany(undefined).isValid).toBe(true);
      expect(FormValidator.validateCompany('   ').isValid).toBe(true);
    });

    test('should reject company name that is too long', () => {
      const longCompany = 'A'.repeat(201);
      const result = FormValidator.validateCompany(longCompany);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept company name at max length', () => {
      const maxLengthCompany = 'A'.repeat(200);
      const result = FormValidator.validateCompany(maxLengthCompany);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePhone', () => {

    test('should accept valid Korean phone numbers', () => {
      const validPhones = [
        '010-1234-5678',
        '02-123-4567',
        '02-1234-5678',
        '031-123-4567',
        '031-1234-5678',
        '01012345678',
        '0212345678',
        '010 1234 5678',
        '+82-10-1234-5678'
      ];

      validPhones.forEach(phone => {
        const result = FormValidator.validatePhone(phone);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    test('should accept empty phone number (optional field)', () => {
      expect(FormValidator.validatePhone('').isValid).toBe(true);
      expect(FormValidator.validatePhone(null).isValid).toBe(true);
      expect(FormValidator.validatePhone(undefined).isValid).toBe(true);
      expect(FormValidator.validatePhone('   ').isValid).toBe(true);
    });

    test('should reject phone numbers with invalid characters', () => {
      const invalidPhones = [
        '010-1234-567a',
        '010@1234@5678',
        '010#1234#5678',
        'abc-defg-hijk',
        '010.1234.5678'
      ];

      invalidPhones.forEach(phone => {
        const result = FormValidator.validatePhone(phone);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('only contain numbers');
      });
    });

    test('should reject phone numbers that are too short', () => {
      const result = FormValidator.validatePhone('123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too short');
    });

    test('should reject phone numbers that are too long', () => {
      const longPhone = '1'.repeat(16);
      const result = FormValidator.validatePhone(longPhone);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept phone with parentheses', () => {
      const result = FormValidator.validatePhone('(02) 1234-5678');
      expect(result.isValid).toBe(true);
    });

    test('should accept phone at minimum length', () => {
      const result = FormValidator.validatePhone('02-123-4567');
      expect(result.isValid).toBe(true);
    });

    test('should accept international format', () => {
      const result = FormValidator.validatePhone('+82 10 1234 5678');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMessage', () => {

    test('should accept valid messages', () => {
      const validMessages = [
        'This is a valid message with enough characters.',
        'Hello, I would like to inquire about your services.',
        '안녕하세요. 제품에 대해 문의드립니다.'
      ];

      validMessages.forEach(message => {
        const result = FormValidator.validateMessage(message);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    test('should reject messages that are too short', () => {
      const result = FormValidator.validateMessage('Short');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 10 characters');
    });

    test('should reject messages that are too long', () => {
      const longMessage = 'A'.repeat(5001);
      const result = FormValidator.validateMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should reject null or undefined message', () => {
      expect(FormValidator.validateMessage(null).isValid).toBe(false);
      expect(FormValidator.validateMessage(undefined).isValid).toBe(false);
      expect(FormValidator.validateMessage(null).error).toBe('Message is required');
    });

    test('should reject empty or whitespace-only message', () => {
      expect(FormValidator.validateMessage('').isValid).toBe(false);
      expect(FormValidator.validateMessage('   ').isValid).toBe(false);
    });

    test('should trim whitespace from message', () => {
      const result = FormValidator.validateMessage('  This is a valid message.  ');
      expect(result.isValid).toBe(true);
    });

    test('should accept message at minimum length', () => {
      const result = FormValidator.validateMessage('1234567890');
      expect(result.isValid).toBe(true);
    });

    test('should accept message at maximum length', () => {
      const maxMessage = 'A'.repeat(5000);
      const result = FormValidator.validateMessage(maxMessage);
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {

    test('should trim whitespace from input', () => {
      expect(FormValidator.sanitizeInput('  hello  ')).toBe('hello');
      expect(FormValidator.sanitizeInput('\n\ntest\n\n')).toBe('test');
    });

    test('should remove control characters', () => {
      const inputWithControlChars = 'hello\x00\x01\x02world';
      const result = FormValidator.sanitizeInput(inputWithControlChars);
      expect(result).toBe('helloworld');
    });

    test('should normalize whitespace including newlines and tabs', () => {
      const input = 'hello\nworld\ttest';
      const result = FormValidator.sanitizeInput(input);
      // Multiple whitespace characters are normalized to single spaces
      expect(result).toBe('hello world test');
    });

    test('should remove multiple consecutive spaces', () => {
      const result = FormValidator.sanitizeInput('hello    world');
      expect(result).toBe('hello world');
    });

    test('should handle null or undefined input', () => {
      expect(FormValidator.sanitizeInput(null)).toBe('');
      expect(FormValidator.sanitizeInput(undefined)).toBe('');
    });

    test('should handle non-string input', () => {
      expect(FormValidator.sanitizeInput(123)).toBe('');
      expect(FormValidator.sanitizeInput({})).toBe('');
      expect(FormValidator.sanitizeInput([])).toBe('');
    });

    test('should handle empty string', () => {
      expect(FormValidator.sanitizeInput('')).toBe('');
    });

    test('should preserve valid special characters', () => {
      const input = "O'Brien-Smith";
      expect(FormValidator.sanitizeInput(input)).toBe(input);
    });
  });

  describe('validateContactForm', () => {

    test('should validate a complete valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '010-1234-5678',
        message: 'I would like to inquire about your services.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(result.sanitizedData.name).toBe('John Doe');
      expect(result.sanitizedData.email).toBe('john@example.com');
      expect(result.sanitizedData.company).toBe('Acme Corp');
      expect(result.sanitizedData.phone).toBe('010-1234-5678');
      expect(result.sanitizedData.message).toBe('I would like to inquire about your services.');
    });

    test('should validate form without optional company and phone fields', () => {
      const formData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: '',
        phone: '',
        message: 'This is my inquiry message.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should return errors for invalid name', () => {
      const formData = {
        name: 'A',
        email: 'test@example.com',
        company: 'Test Corp',
        phone: '010-1234-5678',
        message: 'This is a test message.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeTruthy();
    });

    test('should return errors for invalid email', () => {
      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        company: 'Test Corp',
        phone: '010-1234-5678',
        message: 'This is a test message.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeTruthy();
    });

    test('should return errors for invalid phone', () => {
      const formData = {
        name: 'John Doe',
        email: 'test@example.com',
        company: 'Test Corp',
        phone: '123',
        message: 'This is a test message.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeTruthy();
    });

    test('should return errors for invalid message', () => {
      const formData = {
        name: 'John Doe',
        email: 'test@example.com',
        company: 'Test Corp',
        phone: '010-1234-5678',
        message: 'Short'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeTruthy();
    });

    test('should return multiple errors for multiple invalid fields', () => {
      const formData = {
        name: 'A',
        email: 'invalid',
        company: 'Test Corp',
        phone: '123',
        message: 'Short'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.phone).toBeTruthy();
      expect(result.errors.message).toBeTruthy();
    });

    test('should sanitize all inputs before validation', () => {
      const formData = {
        name: '  John Doe  ',
        email: '  test@example.com  ',
        company: '  Acme Corp  ',
        phone: '  010-1234-5678  ',
        message: '  This is a valid message with extra spaces.  '
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.name).toBe('John Doe');
      expect(result.sanitizedData.email).toBe('test@example.com');
      expect(result.sanitizedData.company).toBe('Acme Corp');
      expect(result.sanitizedData.phone).toBe('010-1234-5678');
      expect(result.sanitizedData.message).toBe('This is a valid message with extra spaces.');
    });

    test('should handle Korean input correctly', () => {
      const formData = {
        name: '홍길동',
        email: 'hong@example.com',
        company: '삼성전자',
        phone: '010-1234-5678',
        message: '제품에 대해 문의드립니다. 상세한 정보를 알고 싶습니다.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.name).toBe('홍길동');
      expect(result.sanitizedData.phone).toBe('010-1234-5678');
    });
  });

  describe('containsSuspiciousContent', () => {

    test('should detect script tags', () => {
      expect(FormValidator.containsSuspiciousContent('<script>alert("XSS")</script>')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('<SCRIPT>alert("XSS")</SCRIPT>')).toBe(true);
    });

    test('should detect javascript: protocol', () => {
      expect(FormValidator.containsSuspiciousContent('javascript:alert("XSS")')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('JavaScript:alert("XSS")')).toBe(true);
    });

    test('should detect event handlers', () => {
      expect(FormValidator.containsSuspiciousContent('onclick=alert("XSS")')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('onerror=alert("XSS")')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('onload=malicious()')).toBe(true);
    });

    test('should detect iframe tags', () => {
      expect(FormValidator.containsSuspiciousContent('<iframe src="evil.com"></iframe>')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('<IFRAME src="evil.com"></IFRAME>')).toBe(true);
    });

    test('should detect eval function', () => {
      expect(FormValidator.containsSuspiciousContent('eval(maliciousCode)')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('eval (code)')).toBe(true);
    });

    test('should detect object and embed tags', () => {
      expect(FormValidator.containsSuspiciousContent('<object data="evil.swf"></object>')).toBe(true);
      expect(FormValidator.containsSuspiciousContent('<embed src="evil.swf">')).toBe(true);
    });

    test('should not flag normal text', () => {
      expect(FormValidator.containsSuspiciousContent('Hello, this is a normal message')).toBe(false);
      expect(FormValidator.containsSuspiciousContent('I love JavaScript programming')).toBe(false);
      expect(FormValidator.containsSuspiciousContent('Please evaluate my application')).toBe(false);
    });

    test('should handle null or undefined input', () => {
      expect(FormValidator.containsSuspiciousContent(null)).toBe(false);
      expect(FormValidator.containsSuspiciousContent(undefined)).toBe(false);
    });

    test('should handle non-string input', () => {
      expect(FormValidator.containsSuspiciousContent(123)).toBe(false);
      expect(FormValidator.containsSuspiciousContent({})).toBe(false);
      expect(FormValidator.containsSuspiciousContent([])).toBe(false);
    });

    test('should handle empty string', () => {
      expect(FormValidator.containsSuspiciousContent('')).toBe(false);
    });
  });

  describe('Edge cases and integration tests', () => {

    test('should handle form with all fields at maximum length', () => {
      const formData = {
        name: 'A'.repeat(100),
        email: 'test@example.com',
        company: 'B'.repeat(200),
        phone: '010-1234-5678',
        message: 'C'.repeat(5000)
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
    });

    test('should handle form with all fields at minimum valid length', () => {
      const formData = {
        name: 'Jo',
        email: 'a@b.co',
        company: '',
        phone: '',
        message: '1234567890'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
    });

    test('should handle mixed language content', () => {
      const formData = {
        name: 'John 홍길동',
        email: 'test@example.com',
        company: 'Acme 삼성',
        phone: '010-1234-5678',
        message: 'Hello 안녕하세요. This is a test message.'
      };

      const result = FormValidator.validateContactForm(formData);
      expect(result.isValid).toBe(true);
    });
  });
});
