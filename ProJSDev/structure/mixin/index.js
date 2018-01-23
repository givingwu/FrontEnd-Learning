
/**
 * [mixin description]
 * @Author   GivingWu
 * @DateTime 2017-11-24T00:33:39+0800
 * @return   {Object}
 */
function mixin () {
  var target = arguments[0] || {},
   i = 1,
   l = arguments.length,
   deep, obj, key, val

  if (target && isBoolean(target)) {
    deep = true
    target = arguments[i] || {}
    i = 2
  }

  for (; i < l; i++) {
    if ((obj = arguments[i]) !== null) {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          val = obj[key]

          if (!val) continue
          if (deep) {
            if (isArray(val)) {
              target[key] = val.slice()   // Array.prototype.slice will deep copy an array
            }

            if (isObject(val)) {
              target[key] = mixin({}, val)
            }

            target[key] = val
          } else {
            target[key] = val
          }
        }
      }
    }
  }

  return target
}
