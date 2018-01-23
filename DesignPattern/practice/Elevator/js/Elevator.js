
/**
 * @class Elevator
 * @desc The constructor of Elevator
 */
class Elevator {
  constructor (identifier, capacity) {
    this.state = 0                   // 0 static 1 up -1 down 2 enough
    this.identifier = identifier
    this.maxCapacity = capacity      // Maximum passenger carrying capacity
    this.currFloor = 0               // which floor is it
    this.currDestFloor = 0           // the current destination of elevator
    this.direction = null            // if curr destination floor is less than currFloor it should be 'down' or 'up'
    this.currInsidePeoplesNum = 0    // the current capacity inside of elevator
  }

  // 检查是否超载
  checkOverload () {
    if (this.currInsidePeople >= this.maxCapacity) {
      return this.warningOverload()
    }
    return this
  }

  // 开始移动
  startMoving (dest) {
    if (!this.currDestFloor) this.currDestFloor = dest
    if (this.currDestFloor === dest) return
    if (this.currFloor > dest) {

    }
  }

  // 超载警报
  warningOverload () {
    console.log(`${this.identifier} is overloading, pls check to keep safety!`)
  }
}