/**
 * Scheduler 调度器/中介者对象
 * @type {Object}
 */
var Scheduler = {
  // state
  minFloorNum: null,
  maxFloorNum: null,

  floors: {},
  elevators: [],

  requestQueue: {
    up: [],
    down: []
  },

  waittingQueue: {
    up: [],
    down: []
  },

  // methods
  generateFloor (minFloorNum, maxFloorNum) {
    this.minFloorNum = minFloorNum
    this.maxFloorNum = maxFloorNum
    this.floors = []

    while (minFloorNum <= maxFloorNum) {
      // handle the floors number do not have any zeor order.
      if (minFloorNum === 0) continue
      this.floors[minFloorNum] = new Floor(minFloorNum++)
    }
  },
  generateElevator (num) {
    this.elevators = []

    while (num) {
      this.elevators.push(new Elevator()), num--
    }
  }
}


/**
 * Passenger 电梯乘客
 * @param    {String}                 direction 'up' or 'down'
 * @param    {Number}                 floorNum  要去的楼层
 */
var Passenger = function Passenger(direction, floorNum) {
  this.direction = direction
  this.goalFloor = floorNum
  this.triggerWaittingElevator()
}

Passenger.prototype.triggerWaittingElevator = function() {
  Scheduler.waittingQueue[direction].push(this)
}

Passenger.prototype.intoEvelator = function (Elevator) {
  Elevator.setGoalFloor(this.goalFloor)
}


/**
 * Floor 每一层楼
 * @param    {Number}                 floorNum 当前楼层的数字例如： -1楼，1楼，2楼等
 * @param    {Number}                 peopleNum 当前楼层搭乘电梯的人数
 * @return   {Object}                 Floor Instance
 */
var Floor = function Floor(floorNum, peopleNum) {
  /**
   * -1 || 0 || 1
   * @type {Number}
   * @description  -1 down 0 staic 1 up
   */
  this.direction = 0
  this.floorNum = floorNum
  this.floorPeople = peopleNum || 0
}

/**
 * Floor.up 楼层请求上行
 */
Floor.prototype.up = function () {
  if (Scheduler.maxFloorNum === this.floorNum) return
  Scheduler.requestQueue['up'].push(this.floorNum)
  this.direction = 1
}

/**
 * Floor.down 楼层请求下行
 */
Floor.prototype.down = function () {
  if (Scheduler.minFloorNum === this.floorNum) return
  Scheduler.requestQueue['down'].push(this.floorNum)
  this.direction = -1
}

/**
 * Floor.clear 清空楼层状态
 */
Floor.prototype.clear = function () {
  this.direction = 0
}

/**
 * Elevator 电梯对象
 * @return {Object}         Elevator Instance
 */
var Elevator = function Elevator() {
  this.state = 0                // 当前电梯状态 0: static, 1: running
  this.direction = 0            // 0: static, 1: up, -1: down

  this.overloaded = false       // 是否已经超载
  this.overload = 10            // 超载人数
  this.currPeople = 0           // 当前电梯内人数

  this.currFloor = 0            // 电梯当前所停楼层
  this.goalFloors = []          // 电梯接下来要暂停的目标楼层

  this.waittingTimer = null
  Scheduler.elevators.push(this)
}

/**
 * Elevator.joinPassenger 乘客加入电梯
 * @param    {Number}                 floorNum  当前电梯停留楼层号
 */
Elevator.prototype.joinPassenger = function (floorNum) {
  var peopleNum = Scheduler.floors[floorNum].floorPeople

  if (this.currPeople + peopleNum > this.overload) {
    alert('Warning! Elevator cannot overload.')
  }

  Scheduler.floors[floorNum].floorPeople = peopleNum - (this.overload - this.currPeople)
  this.currPeople = this.overload
  this.overloaded = true
}

/**
 * Elevator.go2specialFloor 向电梯发送指令使其到特定楼层
 * @param    {Number}                 goalFloorNum       要到达的目标楼层
 */
Elevator.prototype.setGoalFloor = function (goalFloorNum) {
  if (goalFloorNum === this.currFloor) return
  this.goalFloors.push(goalFloorNum)

  if (this.waittingTimer) clearTimeout(this.waittingTimer)
  if (this.goalFloors.length) {
    this.waittingTimer = setTimeout(this.startRun, 3000)  // 等待所有人上齐电梯三秒后 电梯将开始运行
  }
}

/**
 * Elevator.startRun 电梯开始运行之其自身的所有有效目标楼层
 */
Elevator.prototype.startRun = function () {
  // this.current()
  this.goalFloors = this.goalFloors.sort((a, b) => a - b)
  this.state = 1
}

/**
 * Elevator.stopRun 电梯到达楼层后停止运行等待下人，如果调度器的请求队列中不存在请求则持续静止状态
 */
Elevator.prototype.stopRun = function () {

}


