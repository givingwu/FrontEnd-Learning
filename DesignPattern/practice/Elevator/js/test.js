var Scheduler = {
  // state
  minFloorNum: null,
  maxFloorNum: null,

  allFloors: [],
  elevators: [],

  requestQueue: [],

  // methods
  getHighestFloor () {},
  getLowestFloor () {},

  generateFloor (minFloorNum, maxFloorNum) {
    this.minFloorNum = minFloorNum
    this.maxFloorNum = maxFloorNum

    this.allFloors = []

    while (!(minFloorNum < maxFloorNum)) {
      if (minFloorNum === 0) continue, this.allFloors.push(new Floor(minFloorNum++))
    }
  },
  generateElevator (num) {
    this.elevators = []

    while (num) {
      this.elevators.push(new Elevator()), num--
    }
  }
}

var Floor = function (floorNum) {
  /**
   * -1 || 0 || 1
   * @type {Number}
   * @description  -1 down 0 staic 1 up
   */
  this.direction = 0
  this.floorNum = floorNum
}

Floor.prototype.up = function () {
  if (Scheduler.maxFloorNum === this.floorNum) return
  this.direction === 1
}

Floor.prototype.down = function () {
  if (Scheduler.minFloorNum === this.floorNum) return
  this.direction === -1
}

Floor.prototype.clear = function () {
  this.direction = 0
}


var Elevator = function () {
  this.overload = 10
  this.state = 0

  this.currFloor = 0
  this.goalFloors = []
  this.waittingTimer = null

  Scheduler.elevators.push(this)
}

Elevator.prototype.go2specialFloor = function (num) {
  if (num === this.currFloor) return

  this.goalFloors.push(num)

  if (this.waittingTimer) clearTimeout(this.waittingTimer)
  if (this.goalFloors.length) {
    this.waittingTimer = setTimeout(this.startRun, 3000)
  }
}

Elevator.prototype.startRun = function () {
  this.goalFloors = this.goalFloors.sort((a, b) => a - b)
  this.state = 1
}
