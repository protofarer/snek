
export default class Digestion {

  static activatePostDigestionEffects(postDigestionData, headEnt) {
    postDigestionData.forEach(pDD => {
      headEnt.postDigestionEffects.push(pDD)

      switch (pDD.effect) {
        case 'moveSpeed':
          headEnt.currMoveSpeed += pDD.moveSpeed
          break
        case 'turnRate':
          headEnt.currTurnRate += pDD.turnRate
          break
        case 'addSeg':
          headEnt?.addSegment()
          break
        default:
          throw Error(`Unhandled postDigestionEffect: ${pDD.effect}`)
      }
      console.log(`postDigestEffect ${pDD.effect} from ${this.entUnderDigestion.species} activated`, )
    })
  }

  static cancelPostDigestionEffects(expiredPostDigestionEffects) {
    expiredPostDigestionEffects.forEach(postDigestionData => {
    switch (postDigestionData.effect) {
      case 'moveSpeed':
        this.currMoveSpeed -= postDigestionData.moveSpeed
        break
      case 'turnRate':
        this.currTurnRate -= postDigestionData.turnRate
        break
      default:
        console.log(`snek expiredDigestionEffect switch/case defaulted`, )
    }
    console.log(`postDigestEffect ${postDigestionData.effect} ended`, )
    })
  }
}