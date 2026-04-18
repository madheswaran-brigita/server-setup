const { randomUUID } = require("crypto");

/**
 * Standard API envelope: status, message, data, and a unique id per payload.
 * @param {"success"|"error"|"failed"} status
 * @param {string} message
 * @param {unknown} [data]
 */
function envelope(status, message, data = null) {
  return {
    id: randomUUID(),
    status,
    message,
    data,
  };
}

function success(message, data = null) {
  return envelope("success", message, data);
}

function error(message, data = null) {
  return envelope("error", message, data);
}

function failed(message, data = null) {
  return envelope("failed", message, data);
}

module.exports = { envelope, success, error, failed };
