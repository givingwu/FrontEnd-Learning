# async

将 `async` 放在 function 的前面的意思非常简单：这个 `function` 永远返回一个 `promise`。如果不是，那该返回值会被 `Promise.resolve`包裹起来

```js
async function f() {
  return 1
}

// {promise}
f()

// 1
f().then(alert)
```

显式的返回一个`Promise`，效果：
```js
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

所以，`async` 保证 `function` 返回一个 `promise`，用 `promise` 包裹非 `promise`。非常简单，对吧？但是这不是全部。另外一个关键词 `await` 只在 `async function` 内部工作，这非常的 coooool。


# await

```js
let value = await promise
```

关键词 `await` 使 `JavaScript` 一直等到 `promise` 执行完成并且返回它的结果。

```js
async function f() {
  let timer = Math.ceil(Math.random() * 10000)
  console.log(timer)
  console.time('timer')
  let promise = new Promise((resolve, rejcet) => {
    setTimeout(() => resolve('done'), timer)
  });

  let result = await promise  // *
  console.log(timer)
  console.timeEnd('timer', timer)
  console.log(promise)

  alert(result)
}

f()
```

`function`在`*`处被暂停，然后`promise`完成以后回复执行，这有点像`Generator`的`next`特性，`result`变成了`Promise`的结果。

它只是一个比 `promise.then` 更优雅的获取 `promise` 结果的语法，阅读和书写更简单。

+ `await`必须放在`async`函数中
+ 和 `promise.then` 一样, `await` 允许使用 `thenable` 对象（那些有一个可执行的 `then` 方法）
+ 第三方对象可能不是一个 `promise`，但是兼容 `promise`：如果它支持 `.then`,那它就可以使用 `await`


# example

```js
async function showAvatar(username) {
  // 读取 github 用户
  let githubResponse = await fetch(`https://api.github.com/users/${username}`);
  let githubUser = await githubResponse.json();

  // 显示头像
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // 等待3秒
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

  return githubUser;
}

showAvatar('givingwu');
```


# Conclusion

`function` 前面的 `async` 关键词有两个效果：

1. 让函数永远返回一个 promise。
2. 允许在函数里面使用 `await` 。

`promise` 前面的 `await` 关键词让 JavaScript 等待直到该 `promise` 完成，然后：

1. 如果它是一个错误，就会生成异常，就像 `throw error` 在那个地方被执行一样。
2. 否则，它返回结果，然后我们可以分配它给一个变量。

它们提供了一个非常棒的框架来编写异步代码，读和写都非常简单。

使用 `async/await` 的时候，我们基本不需要写 `promise.then/catch`，但是我们仍然不应该忘记它们是基于 promises，因为有时（e.g. 在最外层）我们不得不使用那些方法。同时， `Promise.all` 用来同时等待多个任务非常棒。


# References

[JavaScript.info -> async/await](https://github.com/iliakan/javascript-tutorial-cn/blob/master/6-async/05-async-await/article.md)

