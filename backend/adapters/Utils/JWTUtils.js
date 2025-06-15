// Import crypto module
const crypto = require('crypto');

// Define the JwtTokenGenerator class
class JwtTokenGenerator {
  constructor() {
    // Optionally, we can initialize properties here if needed
  }

  // Method to generate a dynamic JWT token
  generateDynamicJwtToken() {
    const secretKey = crypto.randomBytes(64).toString('hex');
    return {
      secret: secretKey,
      algorithm: 'HS256'
    };
  }
}

// Export the JwtTokenGenerator class
module.exports = JwtTokenGenerator;