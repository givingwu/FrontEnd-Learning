# 设计模式
  将不变的部分和变化的部分隔开，是设计模式永恒的主题。
  > Keep It Simple, Stupid, KISS

## JavaScript 常见模式

### 单例模式 [singletom](/examples/singletom/index.html)

  比如线程池、全剧缓存、浏览器中的 window、docuemnt对象

  > 保证一个类仅有一个实例，并提供一个访问实例的全局访问点（或者 method）。

  > 通常的做法是给 单例对象一个 key 或者一个 外部 或者 一个闭包中的 var 或者一个 属性 来判断当前 单例 的实例是否已经存在，如果存在的话则不再重新创建实例，而是返回该单例 new 后的实例。

  ```
    var getSingletom = function (fn) {
      // closure
      var result = null
      return function () {
        // curry function
        return result || (result = fn.apply(null, arguments))
      }
    }
  ```


### 代理模式 [proxy](/examples/proxy/Proxy-Virtual_Proxy_imageLazyLoad.html)

  比如很忙的明星，他们通常都会有个经纪人。再比如像马云这种商界大佬，都会有私人的代理律师。

  > 代理模式即当用户不方便或者不被满足需要直接访问对象本身，则提供一个代理对象来控制对这个对象的访问。由代理对象来做一些处理，处理完后再交于本体对象。
  > * 客户 -> 本体
  > * 客户（美女粉丝） -> 代理（经纪人判断是否漂亮满足明星要求） -> 本体（明星再决定是否下一步）

  ```

    var fans = [{
      gender: 'female',
      faceScore: 9,
      stature: 'good',
      age: 22
    }
    //, .... 可能有许多各种各样的粉丝 男女老少 etc...
    ]

    // 有点不太确定这个概念是否准确  这个列子更像过滤器  尴尬。。。
    // 但是如果依照定义 则这个 过滤器 的确是对 star 对象的 代理
    var starProxyMan = function (fans) {
      for (let i = 0, fan; fan = fans[i++]; ) {
        if (fan.gender === 'female' && fan.age <= 18 && fan.age >= 28 && fan.faceScore >= 8 && fan.stature === 'good') {
          startHandler(fan)
        } else {
          saySorry2fan()
        }
      }
    }

    var startHandler = function (fan) {
      var star = {
        name: 'someone',
        meetfans: function (fan) { goHotel(fan)  // 走 去high },
        talking20Mins: function (someone) {},
        takeSomeone: function () {someone},
        goHotel: function () {}
      }fan
      start.meetfans(fan).talking20Mins(fan).takeSomeone(fan).goHotel()
    }
  ```


### 迭代器模式 [iterator](/examples/iterator/Iterator-Internal_iterator.html)

  比如我们要去看美女，那么怎么才能快速看到美女呢？ 我们肯定去人多的地方，眼睛一扫就知道了呗。大脑对视线所及之处做了一次快速迭代和过滤，于是你迅速找到了你的菜。

  > 一种顺序的方法访问一个聚合对象中的各个元素 而又不需要暴露对象的内部表示。 `` Array.prototype.forEach ``
  > `` generator function ``

  #### 内部迭代器

  ```
    var people = [{}, ..... ]

    var isBeauty = function (man, num, all) {
      if (man.gender === 'female' && man.age <= 18 && man.age >= 28 && man.faceScore >= 8 && man.stature === 'good') {
        return true
      }
      return false
    }

    var each = function (people, isBeauty) {
      for (let i = 0, man; man = people[i++]; ) {
        isBeauty(man, i, people)
      }
    }
  ```

  #### 外部迭代器


  #### 生成器模式



### 策略模式 [strategy](/examples/srategy/index.html)

  要实现一个功能有多种方式可以选择，然后定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。

  > 一个策略模式对象至少由两部分组成。第一部分是 一组策略类，策略类封装饿了具体的算法，并负责计算的过程。 第二部分是 环境类 接受客户的请求，随后把请求委托给某一个策略类。 context 要维护 对某个策略对象的引用。

  ```
    // strategy object
    var strategies = {
      'console': function (str) { console.log(str)},
      'alert': function (str) { alert(str) },
      'prompt': function (str) { prompt(str) },
      'comfirm': function (str) { confirm(str) }
    }
    // context
    var showStr = function (method, str) {
      return stategies[method](str)
    }
  ```


### 发布订阅模式 or 观察者模式 [Obsever](/examples/watch_public/index.html) or [watch-publish](/examples/watch_public/index.html)

  发布订阅模式在现实生活中最经典的应用莫过于 高考的时候所有人都在等录取通知书 此时学生是订阅者 而大学就是发布者 他们之间的交互事件就是 订阅者（学生）收到发布者（大学）通知（录取通知书）后 在规定的时间内前往学校报道

  > 定义一种一对多或多对多的依赖关系，当发布者的状态发生变化的时候则通知所有订阅者。换句话说 发布者发生变化时订阅发布者变化的所有观察者对象都会收到通知并触发各自事件

  ```
  var Observer = function () {
    this.cache = {}
  }

  Observer.prototype.listen = function (name, callback) {
    if (!this.cache[name]) {
      this.cache[name] = []
    }
    this.cache[name].push(callback)
  }

  Observer.prototype.remove = function (name, callback) {
    if (this.cache[name] && this.cache[name].length) {
      if (callback) {
        for (let i = this.cache[name].length; i >= 0; i--) {
          if (this.cache[name][i] === callback) {
            this.cache[name].splice(i, 1)
            return
          }
        }
      } else {
        this.cache[name] && delete this.cache[name]
      }
    }
  }

  Observer.prototype.trigger = function (name) {
    if (name) {
      this.cache[name] && this.cache[name].length && this.cache[name].forEach(fn => fn.call(null, this.cache))
    } else {
      Object.keys(this.cache).forEach(KEY => this.cache[KEY].forEach(fn => fn.call(null, this.cache)))
    }
  }
  ```


### [命令模式](/examples/command/index.html)

  命令模式中的命令指的是执行某些特定事情的指令。需要向对象发送请求，但是不清楚接受者，也不知道请求的操作，希望用松耦合的方式来设计程序，接触请求者和接受者之间的耦合关系。命令模式也支持*撤销*，*排队*等操作。

  * 简单形式

```
  html
    div>button*n

  js
    var setCommand = function (button, command) {
      button.addEventListener('click', command.execute)
    }
```

  > 客人进餐厅点餐，不知道厨师是谁，也不知道厨师怎么做菜。只需要点好单，下达命令。服务员传递订单到厨师手中立即开始做菜。这样子 客户，服务员，厨师 之间责任分离，松耦合。
  > 命令模式把客人的订单封装成 command 对象（点菜订单），在程序中被四处传递。而一旦接受者接受到命令，则立即执行。

```
  // 顾客的菜单  即是命令
  var Customer = {
    orderList: ['麻辣牛肉', '大白菜', '酥肉'],
    orderDishes: function () {
      var command = this.orderList
      Waiter.recieve(command)
    }
  }

  // 服务员接受指令后传递其给厨师
  var Waiter = {
    recieve: function (command) {
      this.transmitOrderToKitchen(command)
    },
    transmitOrderToKitchen (command) {
      Kitchener.startCooking(command)
    }
  }

  // 厨师收到指令开始做菜
  var Kitchener = {
    startCooking: function (command) {
      var that = this
      for (var i = 0, l = command.length; i < l; i++) {
        // 模拟厨师炒菜 每隔两秒输出一个菜
        setTimeout(function(dish) {
          that.cooked(dish)
        }, i * 2000, command[i]); // we're passing x
      }
    },
    cooked: function (dish) {
      this.callWaiterServing(dish)
    },
    callWaiterServing: function (dish) {
      console.log('The Kitchener have done cooked the dish ' + dish)
    }
  }

  Customer.orderDishes()
  // The Kitchener have done cooked the dThe Kitchenersh 麻辣牛肉
  // The Kitchener have done cooked the dThe Kitchenersh 大白菜
  // The Kitchener have done cooked the dish 酥肉

```


#### 宏命令(Macro Command)

  > 宏命令是一组命令的集合，可以批量执行指令。or we could use another name to called it named '命令集', but when i read the next chapter it tells me Macro Command 是 命令模式 与 组合模式的联用产物？！！

  * 简单形式

```
  var a = {
    execute: function () {
      console.log('open door')
    }
  }
  var b = {
    execute: function () {
      console.log('close door')
    }
  }
  var c = {
    execute: function () {
      console.log('open TV')
    }
  }
  var MacroCommand = function (command) {
    return {
      commandList: [],
      add: function (command) {
        this.commandList.push(command)
        return this
      },
      execute: function () {
        for (var i = 0, command; command = this.commandList[i++]; ) {
          command.execute()
        }
      }
    }
  }

  var macroCommand = MacroCommand()
  macroCommand.add(a).add(b).add(c).execute()
```


### [组合模式](/examples/combine/index.html)

  > 组合模式将对象组合成树形结构，以表示 “部分-整体” 的层次结构。

  * 简单形式

```
  var Tree = class Tree {
    constructor () {
      this.leafs = {}
    }
    do () {
      for (var i = 0, leaf; leaf = this.leafs[i++]; ) {
        this.leafs.do()
      }
    }
    add (key, value) {
      value.parent = this
      this.leaf[key] = value
    }
  }

  var Leaf = class Leaf extends Tree {
    constructor (name) {
      super()
      this.name = name
    }
    do () {
      console.log(this.name)
    }
    add (key, value) {
      super.add(value)
    }
  }

  var root = new Tree()
  var leaf1 = new Leaf('leaf1')
  root.add()
```


### [模版方法模式]

> 抽象父类定义方法，子类实现该方法。JS中直译集，父类定义公用方法，子类定义私有方法。其效果 $.extend(target, options). 抽象出字类共有的方法，再在各个子类上实现其字类的个体区别。

```
// coffee or tea

// the parent template method
// 定义公用方法
var Drink = function (opts) {
  var boilWater = function () {
    console.log('把水煮沸')
  }

  var brew = opts.brew || function () {
    throw new Error('必须传入 brew 方法')
  }

  var pourInCup = opts.pourInCup || function () {
    throw new Error('必须传入 pourInCup 方法')
  }

  var addCondiments = opts.addCondiments || function () {
    throw new Error('必须传入 addCondiments 方法')
  }

  return {
    init () {  // 暴露出去的接口
      boilWater()
      brew()
      pourInCup()
      addCondiments()
    }
  }
}

// the child template method
// 定义私有方法
var Coffee = Drink({
  brew () {
    console.log('用水冲咖啡')
  },
  pourInCup () {
    console.log('把咖啡倒进杯子')
  },
  addCondiments () {
    console.log('加糖或者牛奶')
  }
})

Coffee.init()

var Tea = Drink({
  brew () {
    console.log('用水泡茶叶')
  },
  pourInCup () {
    console.log('把茶叶倒进杯子')
  },
  addCondiments () {
    console.log('加柠檬或茉莉花')
  }
})

Tea.init()
```


### 享元模式

> 如果系统中创建了大量 ** 类似的对象 ** 而导致内存占用过高，运用共享技术来有效支持大量细粒度对象，以此来节省内存占用。享元模式的目标是尽量减少共享对象的数量。

1. 享元模式要求将对象的属性划分内部状态，外部状态（状态通常指属性）。如何区分内部？
  * 内部状态存储在对象内部
  * 内部状态可以被一些对象共享
  * 内部状态独立于具体的场景，通常不会改变
  * 外部状态取决于具体的场景，并根据场景而变化，外部状体不能被共享

2. 剥离外部状态的对象成为共享对象，外部状态在必要时被传入共享对象来组装成一个完整对象。
3. 享元模式是一种 时间换空间 的优化模式。


### 中介者模式(Mediator Patthen)

> use a menitor catch and handle each different situations. // monitor pattern?

### 职责链模式


### 装饰器模式


### 状态机模式

> 管理复杂的状态，而不是太多的 if...else... 逻辑判断，更优雅和更利于复用的实现.

```
// 很简单的登陆状态 需要很多状态维护 比如 login form
// login -> submit -> loading  -> 1.success -> profile -> logout -> loading -> login
//                             -> 2.failure -> error
//                             -> 3.try again

const machine = {
  currentState: 'login',
  states: {
    'login': {
      submit: 'loading'
    },
    'loading': {
      success: 'profile',
      failure: 'error'
    },
    'profile': {
      success: 'view',
      failure: 'login'
    },
    'view': {
      logout: 'login',
    },
    'error': {
      tryAgain: 'loading'
    }
  }
}

const input = function (name) {
  const state = machine.currentState
  const action = machine.states[state][name]

  if (action) {
    machine.currentState = action
  }

  console.log(` ${state} + ${name} ---> ${machine.currentState}`)
}


/**
 normal path of state

 'login' -> 'submit' - loading -> 'success' - profile - 'view' - logout
 'login' -> 'submit' - loading -> 'failure' - error - 'tryAgain'
 'openAdapter' -> success -> 'search' -> searching -> 'success' -> connect -> 'success' -> transfer
*/


input('submit')

input('success')

input('success')

input('logout')

```


### [状态模式](/examples/states_machine/state_machine_example--light.html)

1. 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换。
2. 状态切换的逻辑被分配在状态类中，避免了context中过多的条件分支。
3. 用对象代替字符串来记录当前状态，使得状态切换更加一目了然。
4. context中的请求动作和状态类中封装的行为可以非常容易地独立变化而不互相影响。

state 性能优化：

1. 当需要state时才创建该类，并在应用后销毁。
2. 一开始创建好state类，并在应用后销毁。
3. 一开始创建好state类，若应用频繁，应用后也不销毁。
4. 为每个context创建一组state对象，使用享元模式，在所有context中共享state。

```
class OffState {
  constructor (light) {
    this.light = light
  }

  toggle () {
    this.light.button && (this.light.button.innerHTML = '点击关' + this.light.id + '灯') && console.log('点击开灯')
    this.light.setState(this.light.onState)
  }
}

class OnState {
  constructor (light) {
    this.light = light
  }

  toggle () {
    this.light.button && (this.light.button.innerHTML = '点击开' + this.light.id + '灯') && console.log('点击关灯')
    this.light.setState(this.light.offState)
  }
}

let uid = 0
class Light {
  constructor () {
    this.id = ++uid
    this.offState  = new OffState(this)
    this.onState   = new OnState(this)

    this.currState = this.offState
  }

  setState (state) {
    this.currState = state
  }

  init () {
    const button = document.createElement('button'), self = this
    button.innerHTML = '点击开' + this.id + '灯'

    this.button = document.body.appendChild(button)
    this.button.onclick = function () {
      self.currState.toggle()
    }
  }
}

var light = new Light()
var light1 = new Light()

light.init()
light1.init()
```


### 后记

