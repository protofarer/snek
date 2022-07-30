export function setupPostDigestionEffect (effectObj) {
  this.postDigestionEffect = () => {
    if (!this.wasExcreted) {
      return effectObj
    }
    return null
  }
}

export function setupSwallowEffect (swallowF) {
  this.swallowEffect = (entAffected) => {
    if (!this.wasExcreted) {
      swallowF.call(this, entAffected)
    } else {
      console.log(`no swallowEffect, wasExcreted`, )
    }
  }
}