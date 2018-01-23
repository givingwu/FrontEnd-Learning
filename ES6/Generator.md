
# Generator

> 首先，个人认为如果一个人能简单明了的复述所谓的复杂概念。则该概念被该人理解得非常深入。


## 纪要

+ `Generator` 不是函数，不是函数，不是函数

+ `Generator()` 不会立即触发执行，而是一上来就暂停并返回一个 `Iterable` 对象

+ 每次 `generator.next()` 都会打破暂停状态去执行，直到遇到下一个 `yield` 或者 `return`

+ 遇到 `yield` 时，会执行 `yeild` 后面的表达式，并返回执行之后的值，然后再次进入暂停状态，此时 `done: false`。

+ 遇到 `return` 时，会返回值，执行结束，即 `done: true`

+ 每次 `generator.next()` 的返回值永远都是 `{ value: Any*, done: true | false }` 的形式


## 应用场景


### 延迟执行

> Generator 函数的暂停执行效果，意味着可以把异步的操作写在yield语句里面，等到调用next方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield语句下面，反正要等到调用next方法时再执行。所以，Generator函数的一个重要实际意义就是用来处理异步操作，改写回调函数。


### 无限长的序列

> 由于generator是延迟执行的，因此你可以使用generator创建一个无限长的序列


### 惰性求值

所以 Generator 函数相当于提供了 JavaScript 惰性求值的功能。在函数的表达式中无论如何执行，yield 位置每次返回的结果都会重新结算。


## 概念

1. 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

2. 形式上，Generator 函数是一个普通函数，但是有两个特征。

  2.1 function关键字与函数名之间有一个星号；

  2.2 函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）;

  2.3 generator.next(value) 则用来控制代码的运行并处理输入输出。


```

function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw    // helloWorldGenerator {<suspended>} 暂停状态中的 helloWorldGenerator 生成器

hw.next() // 执行hw的next方法 生成第一个yield 就是 {value: 'hello', done: false}
hw.next() // 执行hw的next方法 生成第二个yield 就是 {value: 'world', done: false}
hw.next() // 执行hw的next方法 生成第三个return(*yield) 就是 {value: "ending", done: true}

hw.next() // 因为不存在返回值 所有value为undefined 至此所有状态切换完成 生成器无法再生成有效状态

```

调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。


## yield 和 return 的区别

1. 在一个生成器函数中可以有多个 yield，且函数在执行到 yield 是会记录当前位置便于下一次从当前位置开始执行。

2. return 语句不具备位置记忆的功能。

3. 一个函数里面，只能执行一次（或者说一个）return 语句，但是可以执行多次（或者说多个）yield表达式。

4. yield 表达式只能用在 Generator 函数里面，用在其他地方都会报错。


## yield

1. 当程序解析器走到生成器函数的第一个 yield 时，如果没有默认值，其会默认返回 undefined，且在第一个 yield 通过 next 传值是无效的。

2. yield 本身具有 `return` 或者称之为 `input` `output` 的功能，即`first-execution => output yield => exit iterator => return (value || undefined) ` 之后 `next(value) => input yield => return input => execute next step in iterator` 。

3. 因为上面第2条，所以在`Iterator`第一次执行 ``it.next(parameter)`` 时的 `parameter` 会被丢弃然后无法生效。而在第二次的执行中，`iterator` 有效。


````

/**
 * @description 处理输入和输出
 */
function * input(i){
    let array = [];

    while(i) {
      array.push(yield array);
    }
}

var gen = input(true);

gen.next(0)  // 上解读第2步原因  0会被丢弃 return { value: [], done: false } 因为第一步执行到这里的时 `output` array，然后退出函数

gen.next(1) // 第3条

````


## **yield**

> 用来在一个 Generator 函数里面执行另一个 Generator 函数。

如果 `yield` 表达式后面跟的是一个遍历器对象，需要在 `yield` 表达式后面加上星 `*` 号，表明它返回的是一个遍历器对象。

````

function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()

gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()  // yield*
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"

````


> `yield*` 后面的 `Generator`函数（没有 `return` 语句时），不过是 `for...of` 的一种简写形式，完全可以用后者替代前者。反之，在有 `return` 语句时，则需要用 `var value = yield* iterator` 的形式获取 `return` 语句的值。

````

function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}

````

## next

1. yield表达式本身没有返回值，或者说总是返回 undefined。next方法可以带一个参数，该参数就会被当作 **上一个** `yield` 表达式的返回值。

2. 无论 `Itrator.next()` 方法中参数如何传递， 其在 `next` 第一次执行时始终返回的都是 Generator 中第一个 yield 的值，因为第一次的 next 传值无法生效，在 yield 或 Itrator 还未开始执行时，next(parameter) parameter时无法替换为 yield 默认值的。

3. 另一说是，第一个 `next` 仅仅是开启 `iterator` 而不是正式启用 `iterator`.


```

function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }

```


```

function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);

a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);

b.next() // { value:6, done:false }     第一次调用b的next方法时，返回x+1的值6
b.next(12) // { value:8, done:false }   第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8
b.next(13) // { value:42, done:true }   第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。

```

---

### `throw` 方法

1. `throw` 方法被捕获以后，会附带执行下一条 `yield` 表达式。也就是说，会附带执行一次 `next` 方法。

2. 只要 `Generator` 函数内部部署了 `try...catch` 代码块，那么遍历器的 `throw` 方法抛出的错误，不影响下一次遍历。

3. 一旦 `Generator` 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用 `next` 方法，将返回一个 `value` 属性等于 `undefined`、`done` 属性等于 `true` 的对象，即 JavaScript 引擎认为这个 `Generator` 已经运行结束了。


### `return` 方法

1. 返回给定的值，并且终结遍历 `Generator` 函数。

2. `return` 方法调用时，不提供参数，则返回值的 `value` 属性为 `undefined`。

3. 如果 `Generator` 函数内部有 `try...finally` 代码块，那么 `return` 方法会推迟到 `finally` 代码块执行完再执行。


### NOTE

** 由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。V8 引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。 **


```

function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b

```


### `next()`、`throw()`、`return()` 的共同点

> 它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。

1. next()是将yield表达式替换成一个值。

2. throw()是将yield表达式替换成一个throw语句。

3. return()是将yield表达式替换成一个return语句。


### References

+ [Generator functions](http://es6.ruanyifeng.com/#docs/generator)
+ [CSDN Blog](http://www.cnblogs.com/wangfupeng1988/p/6532713.html)

























