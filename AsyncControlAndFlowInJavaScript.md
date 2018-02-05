
# Start

Question: What does the following code print?

```js
console.log(1);

Promise.resolve('123').then(function(){
  console.log(2)
})

setTimeout(function() {
  Promise.resolve(3).then(function(data){
    console.log(data)
  })

  console.log(4);
});

setTimeout(function(){
  Promise.resolve(5).then(function(data){
    console.log(data)
  })
  console.log(6);
}, 0)

console.log(7);
```

Result:
```js
// nodeJS 1724635
// Brower 1724365
```

# Flow Control

## Function Execution Stack

当进入一段 JS 脚本逻辑，或者函数时，如果是同步代码将被 push 进当前函数执行上下文的`Stack`。异步任务将被放入 `Tasks Queue`，只要主线程空了，就会去读取"任务队列"，这就是`JavaScript`的运行机制。

## Tasks Queue

+ JS 是单线程执行，当引擎执行到异步代码时，就将其放入 `EventTable`
+ `EventTable` 由两部分组成**宏任务队列**(macro tasks)和**微任务队列**(micro tasks)
+ 宏任务队列可以有多个，但是微任务只能有一个
+ 不同的异步任务将分配到不同的队列
  + 宏任务: `script`(全局任务), `setTimeout`, `setInterval`, `setImmediate`, `I/O`, `UI Rendering`
  + 微任务: `process.nextTick`, `Promise`, `Object.obserer`, `MutationObserver`


当**Function Execution Stack**为空的时候就会从`EventTable`中取出任务执行：

1. 取一个宏任务来执行，执行完毕后，下一步
2. 取一个微任务来执行，执行完毕后，再取一个微任务来执行，直至微任务队列为空，执行下一步
3. 更新UI渲染 or End

`Event Loop` 会无限循环执行上面3步，这就是`Event Loop`的主要控制逻辑。其中，第3步（更新UI渲染）会根据浏览器的逻辑，决定要不要马上执行更新。毕竟更新UI成本大，所以，一般都会比较长的时间间隔，执行一次更新。

## Diff between Browsers and NodeJS

```js
process.nextTick(function A() {
  console.log(1);
  process.nextTick(function B(){console.log(2);});

  setTimeout(function(){
    console.log(3)
  })

  setImmediate(_ => console.log(4))
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)
```

Node.js还提供了另外两个与"任务队列"有关的方法：`process.nextTick`和`setImmediate`。它们可以帮助我们加深对"任务队列"的理解。

`process.nextTick`方法可以在当前"执行栈"的尾部----下一次`Event Loop`（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。

`setImmediate`方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次`Event Loop`时执行，这与`setTimeout(fn, 0)`很像。

由于`process.nextTick`指定的回调函数是在本次"事件循环"触发，而`setImmediate`指定的是在下次"事件循环"触发，所以很显然，前者总是比后者发生得早，而且执行效率也高（因为不用检查"任务队列"）。

# Conclusion


# References

[Philip Roberts: Help, I’m stuck in an event-loop.](https://vimeo.com/96425312)
[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
[JavaScript 异步、栈、事件循环、任务队列](https://segmentfault.com/a/1190000011198232)
