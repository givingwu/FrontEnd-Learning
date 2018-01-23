

# Promise
// nothing to say


# Generator-function

> 生成器函数 会返回一个 Iterator 的对象 var it = GeneratorFunctionName() 同时it的方法有 next return throw

## 打破完整运行

```
var x = 1
function *foo () {
  x++;
  yield;
  console.log('x:', x)
}

function bar() {
  x++
}

// 生成迭代器
var it = foo()

// 启动迭代器 运行第一行x++ 并在 yield 处暂停
it.next()

// *foo 在 yield 处暂停，所以x的值为2
console.log(x)    //2

// 调用bar 通过x++递增x 所以x=3
bar()
console.log(x)    //3

// 恢复 *foo 的执行
it.next()
console.log(x)    //3
```

> 每个 `yield` 实际上是提出了一个问题 ** 这里我该插入一个什么值呢？ **

```
function *foo (x) {
  var y = x * (yield)
  return y
}

var it = foo(6) // x =6

it.next() // start it

it.next(7)  // pass the 7 to be the yield and it will return the value of 6 * 7
```

> `yield...` 作为一个表达式可以发出消息响应 `next(...)` 调用，同时也可以向暂停的 `yield` 表达式发送值。

```
function *foo (x) {
  var y = x * (yield 'Hello')   // <-- the first value of the yield
  return y
}

var it = foo(6)     // carete a new Iterator and the paramter X is equal to 6

it.next()   // start it. the First yield does not pass anything so it return the first value: 'Hello' false

it.next(7)    // 42 true
```

** 只有暂停的 `yield` 才能接收一个值。 启动生成器时传入任何值都会被忽略，所以不要传递任何参数给生成器。**

```
function *foo () {
  var x = yield 2
  z++
  var y = yield (x * z)
  console.log(x, y, z)
}

var z = 1

var it1 = foo()
var it2 = foo()

var val1 = it1.next().value // <-- yield 2
var val2 = it2.next().value // <-- yield 2

val1 = it1.next(val2 * 10).value  // <-- 40 = x: 20 * z:2 因为在这里正式的 next 才开始执行
  // 正式执行 val2 为第一次调用默认的 yield 2，而在当前 yield 中 x 被替换为 2 * 10 = 20 而执行下一步 z++ 则 z 为 2 次时
  // 这时返回默认的 第二个 yield 的默认调用格式 val1 = x * z = 20 * 2 = 40
val2 = it2.next(val1 * 5).value   // <-- x: 100 z:3 因为在这里正式的 next 被执行两次
  // 因为上面的 val1 被重新赋值为 40， 所以这时 val2 = x * z = 40 * 5 = 200 而 z++ 为 3， 所以 yield (x*z = 200 * 3) 返回600


it1.next(val2 / 2)
  // 因为上面已经 yield 完成了两次 `*foo` 中的 `yield`. 所以这时函数会完整执行
  // 上面执行结果 val2 = 600 所以这时 y = yield `self` 的值，及当前位置 y = 600 / 2 = 300
  // x = 20, y = 300, z = 2
it2.next(val1 / 4)
  // 上面执行结果 val1 = 40 所以这时 y = yield `self` 的值，及当前位置 y = 40 / 4 = 10
  // x = 200, y = 10, z = 3
```

** 交替执行 **

```
var a = 1
var b = 2
function foo () {
  a++;
  b = b * a;
  a = b + 3
}

function bar () {
  b--;
  a = 8 + b;
  b = a * 2
}

foo()
bar()

// generator function version
var a = 1
var b = 2
function *foo () {
  a++
  yield
  b = b * a
  a = (yield b) + 3
}

function *bar () {
  b--
  yield
  a = (yield 8) + b
  b = a * (yield 2)
}

function step(gene) {
  var it = gene()
  var last = null

  return function () {
    // whatever anything be yield, pass it back by the same at next time
    last = it.next(last).value
  }
}

// make sure each time you have reset the a and b
a = 1, b = 2

var s1 = step(foo)
var s2 = step(bar)

s1()
s1()
s1()

s2()
s2()
s2()
s2()


// The second is not in order
a = 1, b= 2

var s1 = step(foo)
var s2 = step(bar)

s2()  // start bar Iterator and wait yield      {a -> 1, b -> 1},  // 遇到 yield 即停止并等待
s2()  // start bar first yield                  {a -> 1, b -> 1}
s1()  // start foo Iterator                     {a -> 2, b -> 1}
s2()  // start bar second yield                 {a -> 9, b -> 1}

s1()  // start foo first yield                  {a -> 9, b -> 9}

s2()  // start bar third yield                  {a -> 9, b -> 18}
s1()  // start foo second yield                 {a -> 12, b -> 18}
```

Iterator 迭代器模式

```
var sth = (function () {
  var nextVal;

  return {
    [Symbol.iterator]: function () { return this },
    next: function next() {
      if (nextVal === undefined) nextVal = 1
      else nextVal = 3 * nextVal + 6

      return {
        done: false,
        value: nextVal
      }
    }
  }
})()

var arr = [1, 2, 3, 4, 5]

var it = arr[Symbol.iterator]()     //Class[Iterator]
it.next()   // {value: 1, done: false}
```

Generator Function Pattern
```
function *sth() {
  var nextVal;
  while (true) {
    if (nextVal === undefined) nextVal = 1
    else nextVal = 3 * nextVal + 6
  }
  yield nextVal
}

var it = sth()

it.next()
```

async function demo
```
function asyncFn () {
  setTimeout(function() {
    it.next('The aync data')  //  {1}
  }, 3000)
}

function *main () {
  // 当第一次进来的时候 执行到 yield *man 函数被暂停 返回了 undefined
  // 而下一次这里调用的时候是 这里的值在 line 1 处被传入  所以yield 替换其值
  // 所以到这里 *main function 执行成功 也正确受到了 async function 的值
  var data = yield asyncFn()
  console.log(data, it)
}

var it = main()
it.next()   // start it
```

async Promise demo
```
function asyncPromise () {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if (Math.random() * 10 > 5) {
        reject('The number is less than 5')
      } else {
        resolve('The aync data')  //  {1}
      }
    }, 3000)
  })
}

function *main () {
  try {
    // 如果 yield 接收到 Promise 的 reject 则会直接抛出错误 ?!
    var data = yield asyncPromise()
    console.log(data, it)
  } catch (error) {
    console.error(error)
  }
}

var it = main()
var p = it.next().value

// 等待 Promise p 决议
p.then(data => it.next(data))     // 如果 resolve 成功，则执行 main yield
.catch(error => it.throw(error))  // 如果 reject，则执行 main catch

```

```
 
```


























