
/**
 * Cookie 是一个闭包返回的单例对象
 */
var Cookie = (function () {
  var allCookies = document.cookie.split(";"), cookies = {}, cookiesIndex = 0, cookiesLen = allCookies.length, cookie

  for (; cookiesIndex < cookiesLen; cookiesIndex++) {
    cookie = allCookies[cookiesIndex].split("=")
    cookies[('' + unescape(cookie[0])).trim()] = ('' + unescape(cookie[1])).trim()
  }

  return {
    get: function(key) {
      return key ? cookies[key] || '' : cookies
    },

    set: function(key, val) {
      if (!key || !val) throw new TypeError()

      cookies[key] = val
      document.cookie = escape(key) + "=" + escape(val)
    },

    del: function(key) {} // TODO
  }
}())
