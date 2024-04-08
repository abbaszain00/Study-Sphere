
// src/utils/util.js

/**
 * Check if the JWT token is still valid.
 *
 * @returns {boolean} True if the token is valid, false otherwise.
 */
export function isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    try {
      // Decode the token (Base64) and parse the payload
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payloadBase64));
      const exp = decodedPayload.exp;
  
      // Convert the expiration time from JWT (seconds) to milliseconds and compare
      return Date.now() < exp * 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }
  