/**
 * Standard API body: { success, message, data, error }
 * Callers use `return res.json(success(...))` — Express ends the response on `res.json`;
 * no `res.end()` is required. Returning stops your handler from sending twice.
 * @param {string} message
 * @param {Record<string, unknown>|null} [data] defaults to {}
 */
function success(message, data = {}) {
  return {
    success: true,
    message,
    data: data == null ? {} : data,
    error: null,
  };
}

/**
 * @param {string} message
 * @param {string | { code: string, [key: string]: unknown }} error string code or { code, ... }
 * @param {null | Record<string, unknown>} [data] usually null on errors
 */
function failure(message, error, data = null) {
  const errorObj =
    typeof error === "string" ? { code: error } : { ...error };
  return {
    success: false,
    message,
    data,
    error: errorObj,
  };
}

module.exports = { success, failure };
