import Constants from '../Constants'

export default {
  Immob: {
    r: 1,
    hitOffset: 7,
    position: {
      x: 25,
      y: 25
    },
    scale: {
      x: 1,
      y: 1
    },
    headingDegrees: 0,
    digestion: {
      baseTime: 3000,
      timeLeft: 3000
    },
    underDigestionData: null,
    baseExp: 0,
    primaryColor: {
      hueStart: 125,
      hueEnd: 125 ,
      satStart: 70, 
      satEnd: 30,
      lumStart: 50, 
      lumEnd: 25,
    },
    secondaryColor: ''
  },

  Apple: {
    r: 6,
    baseExp: 10,
    primaryColor: {
      hueStart: 0, 
      hueEnd: 25, 
      satStart: 70,
      satEnd: 30,
      lumStart: 50,
      lumEnd: 25,
    },
    secondaryColor: 'hsl(95, 60%, 50%)',
    chompEffectWord: Constants.collisionFunction.BASE_CHOMP,
    digestion: {
      timeLeft: 5000,
      baseTime: 5000
    },
    postDigestionData: [
      {
        effect: 'moveSpeed',
        type: 'offset',
        moveSpeed: 0.25,
        duration: 5000,
        timeLeft: 5000
      }
    ],
  },
  
  Pebble: {
    r: 2,
    primaryColor: {
      hueStart: 220,
      hueEnd: 220 ,
      satStart: 10, 
      satEnd: 10,
      lumStart: 48, 
      lumEnd: 48,
    },
    digestion: {
      baseTime: 60000,
      timeLeft: 60000
    },
  },

  Poop: {
    r: 5,
    primaryColor: {
      hueStart: 40,
      hueEnd: 40,
      satStart: 100,
      satEnd: 40,
      lumStart: 20,
      lumEnd: 11
    },
    digestion: {
      timeLeft: 2000,
      baseTime: 2000,
    },
  },

  Banana: {
    r: 7,
    baseExp: 20,
    primaryColor: {
      hueStart: 65,
      hueEnd: 50,
      satStart: 70,
      satEnd: 0,
      lumStart: 50,
      lumEnd: 20
    },
    secondaryColor: 'black',
    chompEffectWord: Constants.collisionFunction.BIG_CHOMP,
    digestion: {
      timeLeft: 6000,
      baseTime: 6000
    },
    underDigestionData: [
      {
        effect: 'moveSpeed',
        type: 'boolean',
        moveSpeed: 4,
        duration: 1000,
        timeLeft: 1000
      },
    ],
  },

  Mango: {
    r: 6,
    baseExp: 0,
    primaryColor: {
      hueStart: 35,
      hueEnd: 35,
      satStart: 100,
      satEnd: 25,
      lumStart: 50,
      lumEnd: 40
    },
    secondaryColor: 'green',
    chompEffect: Constants.collisionFunction.SMALL_CHOMP,
    digestion: {
      timeLeft: 10000,
      baseTime: 10000
    },
    postDigestionData: [
      {
        effect: 'turnRate',
        type: 'boolean',
        turnRate: 1,
        duration: 32000,
        timeLeft: 32000
      },
      {
        effect: 'moveSpeed',
        type: 'boolean',
        moveSpeed: 0.25,
        duration: 32000,
        timeLeft: 32000
      },
      {
        effect: 'addSeg',
        type: 'mutation',
      }
    ],
  },

  Mob: {
    headingDegrees: -90,
    primaryColor: 'blue',
    secondaryColor: '',
    chompEffectWord: Constants.collisionFunction.BASE_CHOMP,
    baseMoveSpeed: 1,
    minMoveSpeed: 0.3,
    turnRateOffset: 5,
    minTurnRate: 0,
  },

  Ant: {
    r: 4,
    baseExp: 10,
    primaryColor: {
      hueStart: 0,
      hueEnd: 0,
      satStart: 0,
      satEnd: 0,
      lumStart: 0,
      lumEnd: 0,
      alphaStart: 1,
      alphaEnd: 0.2
    },
    baseMoveSpeed: 2,
    turnRateOffset: 5,
    swallowables: [
      'apple', 
      'mango', 
      'ant', 
      'pebble'
    ],
  },

  Segment: {
    baseExp: 20,
    digestion: {
      timeLeft: 20000,
      baseTime: 20000
    },
    postDigestionData: [
      {
        effect: 'moveSpeed',
        moveSpeed: 0.5,
        duration: 20000,
        timeLeft: 20000
      },
    ],
  },

  Snek: {
    r: 10,
    hitOffset: 4,
    baseExp: 100,
    level: 1,
    levelMultiplier: 2,
    segLevelMultiplier: 1.25,
    baseSegmentCount: 3,
    basePrimaryColor: `hsl(100, 100%, 32%)`,
    colorTongue: 'red',
    colorEyeWhites: 'white',
    colorFangs: 'white',
    colorLeftEye: 'hsl(55, 100%, 25%)',
    colorRightEye: 'hsl(230, 100%, 80%)',
    baseMoveSpeed: 1,
    turnRateOffset: 2,
    swallowables: [ 'apple', 'mango', 'ant', 'pebble', 'banana' ],
    enemySpecies: ['centipede'],
    effectPanic: {
      effect: 'panic',
      moveSpeed: 2,
      turnRate: 10,
      timeLeft: 4000,
      duration: 4000
    },
  },

  Centipede: {
    r: 10,
    hitOffset: 5,
    baseExp: 100,
    baseSegmentCount: 5,
    basePrimaryColor: 'hsl(35, 50%, 55%)',
    secondaryColor: 'hsl(30, 70%, 7%)',
    baseMoveSpeed: 2,
    turnRateOffset: 5,
    colorLeg: 'hsl(30, 70%, 10%)',
    colorFangs: 'hsl(0, 0%, 0%)',
    colorEyes: 'hsl(0, 100%, 50%)',
    swallowables: ['snek', 'snek-segment'],
  }
}