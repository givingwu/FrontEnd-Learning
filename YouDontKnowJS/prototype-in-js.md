
# [[prototype]]

> JavaScript 中几乎所有对象都有内置的 `[[prototype]]` 属性，是对其他对象的引用，几乎所有对象在创建时 `[[prototype]]` 属性都会被赋予一个非空的值。

# "类"

> JavaScript 是少有的不通过类直接创建对象的语言。

** JavaScript 中只有对象 **

# "类" 函数

> 所有函数默认都会拥有一个名为 `prototype` 的公有且不可枚举属性，它指向另一个对象

> "类" 函数 - 即对普通函数进行 `new FunctionName(...)` 调用，称之为 ** 构造函数调用 **

构造函数调用的过程：

1. `new FunctionName(...)` 调用函数，在函数内部创建一个 **新对象**
2. 并将 **新对象** 的 `[[prototype]]` 关联到 FunctionName.prototype 指向的那个对象
3. **新对象** 会绑定到函数调用的 `this`
4. 如果函数没有返回其他对象，则自动返回该 **新对象**

+ 在 JavaScript 中并不会向面向类的语言一样，将类复制多次，就像用模具制作东西一样。
+ 之所以会这样是因为实例化一个类就意味着把类的行为复制到物理对象中，对于每一个新实例都会重复这个过程。

**
但是在 JavaScript 中并没有类似的复制机制。不能创建类的多个实例，而是创建多个对象，它们的 `[[prototype]]` 关联的是同一对象。
最后我们得到两个对象 一个是 构造函数 的实例对象，一个是构造函数的 原型对象。它们之间互相关联。
我们并没有初始化一个类，也并没有从 “类” 中复制任何行为到一个对象中，我们只是建立了这样的一种关联。
**

> 所以 构造函数的实例 与 构造函数的原型对象 间只是创建了一种 **关联**， 这样一个对象就可以通过 **委托** 访问另一个对象的属性和函数。

```
function Foo() {
  // ...
}

Foo.prototype
/**
{
  constructor: ƒ Foo()
  __proto__: Object
}
*/

Object.getOwnPropertyDescriptor(Foo, 'prototype')
/**
  {
    configurable: false,
    enumerable: false,
    value: {
      constructor: ƒ Foo()
      __proto__: Object
    },
    writable: true,
    __proto__: Object
  }
*/

Object.getOwnPropertyDescriptor(Foo.prototype, 'constructor')
/**
  {
    configurable: true,
    enumerable: false,
    value: ƒ Foo(),
    writable: true,
    __proto__: Object
  }
*/

var bar = new Foo()

bar // {}

Object.getPrototypeOf(bar)
/**
{
  constructor: ƒ Foo()
  __proto__: Object
}
*/

Object.getPrototypeOf(bar) === Foo.prototype
```

# 原型继承

## Object.create(...)

> Object.create(...) 会凭空创建一个新对象并把对象内部的 `[[prototype]]` 关联到指定的对象。

`Polyfill`
```
if (!Object.create) {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj
    return new F()
  }
}
```

## Object.setPrototypeOf

> Object.setPrototypeOf(Bar.prototype, Foo.prototype)

## obj.__proto__

## __proto__ 访问

a.__proto__ = Foo.prototype

> `__proto__` 属性引用了内部的 [[prototype]] 对象

`Internal Implements`
```
Object.defineProperty(Object.prototype, '__proto__', {
  get () {
    return Object.getPrototypeOf(this)
  },
  set (obj) {
    Object.setPrototypeOf(this, obj)
    return obj
  }
})
```


# 检查 “类” 的关系

# a instanceof Foo

> 在 a 整条原型链上是否有指向 Foo.prototype 的对象？

这个方法只能处理对象和构造函数之间的关系





