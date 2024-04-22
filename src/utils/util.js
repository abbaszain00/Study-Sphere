/**
 * Check if the JWT token is still valid.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
export function isTokenValid() {
    const token = localStorage.getItem('token');  // Retrieve the token from local storage
    if (!token) {
      return false; // If there's no token return false
    }
  
    try {
      // Decode the token: JWTs are split into three parts by '.', where the second part is the payload
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payloadBase64));
      const exp = decodedPayload.exp;
  
      // Check if the current time is less than the expiration time (JWT expiration time is in seconds)
      return Date.now() < exp * 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Return false if there's an error in decoding the token
    }
  }

  /**
 * Check if the JWT token is expiring soon.
 * @param {number} minutes - The number of minutes before expiration to start considering the token as expiring soon.
 *
 * @returns {boolean} True if the token is expiring within the specified number of minutes, false otherwise.
 */
  export function isTokenExpiringSoon(minutes = 5) {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      return false; // Return false immediately if no token is found
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