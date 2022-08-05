import { recycle } from '../utils/helpers'

export function baseChompEffect(entAffected) {
  const chompRatio = 0.5
  if (this.currExp / this.baseExp > 0.25) {
    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= 1 - chompRatio

  } else {
  // Consume all on the 3rd clean bite or when ent low on digestable material
    entAffected.currExp += this.currExp
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.currExp = 0
    this.digestion.timeLeft = 0
    recycle(this)
  }
}

export function bigChompEffect(entAffected) {
  // * Fresh chomp is big, second chomp fully consumes, no underDigest effects
  const chompRatio = 0.8
  if (this.digestion.timeLeft === this.digestion.baseTime) {

    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= 1 - chompRatio

  } else {

    entAffected.currExp += this.currExp
    this.currExp = 0
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.digestion.timeLeft = 0
    recycle(this)

  }
}

export function smallChompEffect(entAffected) {
  // * Chomp has small effect magnitude, the effects for ents with small chomp
  // * effects are dominated by digestive effects
  const chompRatio = 0.2
  if (this.digestion.timeLeft/this.digestion.baseTime > 0.60) {

    const expDiff = this.currExp * chompRatio
    entAffected.currExp += expDiff
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += expDiff
    }
    this.currExp -= expDiff
    this.digestion.timeLeft *= 1 - chompRatio

  } else {

    entAffected.currExp += this.currExp
    if (entAffected.currSegExp != undefined) {
      entAffected.currSegExp += this.currExp
    }
    this.currExp = 0
    this.digestion.timeLeft = 0
    recycle(this)

  }
}
<<<<<<< HEAD

export function activatePostDigestionEffects(postDigestionData, headEnt) {
  postDigestionData.forEach(pDD => {
    headEnt.postDigestionEffects.push(pDD)

    switch (pDD.effect) {
      case 'moveSpeed':
        headEnt.currMoveSpeed += pDD.moveSpeed
        break
      case 'turnRate':
        headEnt.currTurnRate += pDD.turnRate
        break
      default:
        console.log(`snek postDigestionEffect switch/case defaulted`, )
    }
    console.log(`\
      postDigestEffect ${pDD.effect} from \
      ${this.entUnderDigestion.species} activated`, 
    )
  })
}

export function cancelPostDigestionEffects(expiredPostDigestionEffects) {
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
=======
>>>>>>> dede83c40f5d66d6e3612719391b6fdb22679d3e
