
// src/utils/util.js

/**
 * Check if the JWT token is still valid.
 * * @param {number} minutes - The number of minutes before expiration to check for.

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
  export function isTokenExpiringSoon(minutes = 5) {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payloadBase64));
      const exp = decodedPayload.exp;
      // Calculate the time left until the token expires in seconds
      const timeLeft = exp - (Date.now() / 1000);
      // Check if the token will expire within the next specified number of minutes
      return timeLeft < minutes * 60;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
}