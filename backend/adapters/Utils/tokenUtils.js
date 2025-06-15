// Import crypto module
const crypto = require('crypto');

// Define the TokenGenerator class
class TokenGenerator {
  constructor() {
    // This can be used to initialize properties if needed
  }

  // Method to generate a random token
  generateRandomToken() {
    const secretKey = crypto.randomBytes(64).toString('hex');
    return {
      secret: secretKey,
      algorithm: 'HS256',
    };
  }
}

// Export the TokenGenerator class
module.exports = TokenGenerator;
