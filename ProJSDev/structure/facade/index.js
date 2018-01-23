
/**
 * ajax
 * @param {String}    type        http requeset method
 * @param {String}    url         http request url
 * @param {Function}  callback    the callback function after request end will be trigger
 * @param {Any*}      data        request data
 * @return undefined
 * @example
 * ajax("get", "/users", function(res) {
 *   console.log(res)
 * })
 */
function ajax (type, url, callback, data) {
  var xhr = (function () {
    try {
      return new XMLHttpRquest()
    } catch (e) {}

    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0')
    } catch (e) {}

    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0')
    } catch (e) {}

    try {
      return new ActiveXObject("Microsoft.XMLHTTP")
    } catch (e) {}

    throw new Error("Ajax not supported in this browser.")
  }()),
  STATA_LOADED = 4,
  STATUS_OK = 200

  xhr.onReadyStateChange = function () {
    if (xhr.readyState !== STATA_LOADED) return
    if (xhr.status === STATUS_OK) {
      callback(xhr.responseText)
    }
  }

  xhr.open(type.toUpperCase(), url)
  xhr.send(data)
}
