
export default class Digestion {

  static activatePostDigestionEffects(postDigestionData, headEnt) {
    postDigestionData.forEach(pDD => {
      headEnt.postDigestionEffects.push(pDD)
      console.log(`pushed pDE to headent`, headEnt.postDigestionEffects)
      

      switch (pDD.effect) {
        case 'moveSpeed':
          headEnt.currMoveSpeed += pDD.moveSpeed
          break
        case 'turnRate':
          headEnt.currTurnRate += pDD.turnRate
          break
        case 'levelUp':
          headEnt?.levelUp()
          break
        default:
          throw Error(`Unhandled postDigestionEffect: ${pDD.effect}`)
      }
      console.log(`postDigestEffect ${pDD.effect} from ${this.entUnderDigestion.species} activated`, )
    })
  }

  static cancelPostDigestionEffects(expiredPostDigestionEffect) {
    switch (expiredPostDigestionEffect.effect) {
      case 'moveSpeed':
        this.currMoveSpeed -= expiredPostDigestionEffect.moveSpeed
        break
      case 'turnRate':
        this.currTurnRate -= expiredPostDigestionEffect.turnRate
        break
      default:
        console.log(`snek expiredDigestionEffect switch/case defaulted`, )
    }
  }
}