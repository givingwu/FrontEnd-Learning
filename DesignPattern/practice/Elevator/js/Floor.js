
/**
 * @class Floor
 * @desc The constructor of Floor
 */
class Floor {
  constructor (floor) {
    this.status = null              // 楼层状态 waiting -> 'up' or 'down' 即有人等待中
    this.floor = floor              // 几楼
    this.waitingPeoplesNum = 0      // 等待人数
  }

  press2Waiting (direction, number) {
    this.status = direction
    this.waitingPeoplesNum = number
  }

  arrivedHandler (elevator) {
    // if (elevator.direction !== this.status) return
    if (elevator.checkOverload()) return
    if (elevator.currInsidePeoplesNum + this.waitingPeoplesNum > elevator.maxCapacity) {
      this.waitingPeoplesNum
    }
  }
}