
# What's this in JavaScript?

> this 既不指向 函数自身 也不指向函数的词法作用域。 this 是函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

> this 是在运行时绑定，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。 this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

# Details

## this 调用位置

* 找到函数的调用位置，chrome的 * breakpoints * 很实用关于这一点。

## 绑定规则

### 默认绑定

* 独立函数调用

> 非严格模式下直接使用不带任何修饰的函数引用进行调用的，因此只能使用 ** 默认绑定 ** 即 `this = window`（全局对象），无法应用其他规则。

+  只有函数运行在非严格模式下，this 默认绑定到 window。

```
  // non-strict mode
  function foo () {
    debugger
    console.log(this)     // window
  }

  foo()   // 'bar'
```

```
  (function () {
    "use strict";
    foo() //  因为函数 foo 在非严格模式下被运行   // window
  })()
```

+  严格模式下，this is undefined。

```
  function foo () {
    "use strict";
    debugger
    console.log(this)     // undefined
  }

  foo()   // TypeError: this is undefined
```

### 隐式绑定 (优先级 0)

> 当函数引用位置有上下文对象，隐式绑定规则会把函数调用中的this绑定到这个上下文对象 即 this=context。对象属性引用链中只有最顶层或者说最后一层会影响调用位置。

```
  function foo () {
    console.log(this)
  }

  var obj = {
    bar: 'bar',
    foo: foo
  }

  var obj1 = {
    bar: 'bar2',
    foo: foo,
    obj: obj
  }

  obj.foo()         // obj
  obj1.foo()        // obj1
  obj1.obj.foo()    // obj

** 隐式丢失 ** (优先级 1)

> 当被隐式绑定的函数丢失绑定对象，会回退到 ** 默认绑定 ** 模式。

** 参数传递其实就是 函数传参 的隐式赋值 **

```
  // bar 指向了 obj.foo 的引用。 而 obj.foo 中 foo 不是一个 Primitive value 且 函数就是对象，所以其指向的其实是 obj 下 foo 函数自身的引用。
  var bar = obj.foo

  bar()     // 相当于直接执行了 foo 函数，并没有任何上下文，所以 failback 自动回退 -> **默认绑定**.   window

  function doFoo (fn) {
    fn()
  }

  // callback function mode
  doFoo(obj.foo) // 与上同理 window

  // setTimeout syntax
  setTimeout(obj.foo, 100)    //window

```

### 显式绑定 `call` and `apply` (优先级 2)

> Function.prototype.call(context, param...) Function.prototype.apply(context, param...)

```
  function foo() {
    console.log(this)
  }

  var obj = {
    bar: 'bar',
    foo: foo
  }

  foo.call(obj)
```

** 但是显式绑定依然存在 上文中的 丢失绑定 问题 **

+ 硬绑定

```
  // hard binding
  var bar = function () {
    return foo.call(obj)
  }
  bar() // obj

  // bind function
  // it's same as the Function.prototype.bind method
  function bind (fn, ctx) {
    return function () {
      return fn.apply(ctx, arguments)
    }
  }
  var bar = bind(foo, obj)
  bar()   //obj
```

### new binding (优先级 3)

+ 创建或者说构造一个新对象
+ 新对象被执行[[prototype]]类型连接
+ 这个新对象会绑定到函数调用的 this
+ 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```
function foo(a) {
  this.a = a
}

var bar = new foo(2)
console.log(bar.a)
```

## 判定this

> 根据优先级来判断函数调用位置应用了那条规则.

