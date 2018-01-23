
/**
 * flyweight
 * 当需要创建大量相似对象的时候消耗了大量内存，使用享元模式(flyweight) -> 创建少量的可对象来替代大量相似对象。
 * 使代码运行内存更少，更加高效。
 *
 * 享元模式
 * 1. 创建各个新 “类”  表示外部状态数据
 * 2. 应用工厂模式确保之前创建对象不会再次被创建
 * 3. 编写代码，使得对象的创建可以按原来的方式运行
 */

// old code
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype = {
  constructor: Person,
  getName: function () {
    return this.name
  },
  getAge: function () {
    return this.age
  }
}

var me = new Person("Giving Wu", 21)
var gf = new Person("Sandily Miao", 23)

// 实际上，我理解的享元模式是 抽离不同对象的 内部状态和外部状态， 内部状态由 所谓的该 “元” 对象写入，
// 而外部状态则通过其他方法写入。但是其写入过程不干扰该内部状态对象。从而共享 一个 “元” 对象。