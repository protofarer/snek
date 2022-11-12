import Constants from '../Constants'

export default {
  Immob: {
    r: 1,
    position: {
      x: 25,
      y: 25
    },
    scale: {
      x: 1,
      y: 1
    },
    digestion: {
      baseTime: 3000,
      timeLeft: 3000
    },
    chompEffectWord: Constants.collisionFunction.BASE_CHOMP,
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
    digestion: {
      timeLeft: 5000,
      baseTime: 5000
    },
    baseExp: 10,
    secondaryColor: 'hsl(95, 60%, 50%)',
    primaryColor: {
      hueStart: 0, 
      hueEnd: 25, 
      satStart: 70,
      satEnd: 30,
      lumStart: 50,
      lumEnd: 25,
    },
    postDigestionData: [
      {
        effect: 'moveSpeed',
        type: 'offset',
        moveSpeed: 0.55,
        duration: 5000,
        timeLeft: 5000
      }
    ],
  },
  
  Pebble: {
    r: 3,
    digestion: {
      baseTime: 600000,
      timeLeft: 600000
    },
    primaryColor: 'hsl(220, 10%, 48%)',
  },

  Poop: {
    r: 5,
    digestion: {
      timeLeft: 2000,
      baseTime: 2000,
    },
   primaryColor: 'hsl(40, 100%, 13%)' 
  },

  Banana: {
    r: 7,
    digestion: {
      timeLeft: 6000,
      baseTime: 6000
    },
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
    underDigestionData: [
    {
      effect: 'moveSpeed',
      type: 'boolean',
      moveSpeed: 3,
      duration: 3000,
      timeLeft: 3000
    },
    {
      effect: 'exp',
      type: 'function',
      exp: Constants.underDigestionFunction.BASE_ABSORB_EXP
    }
    ],
    // chompEffect: bigChompEffect,
  },

  Mango: {
    r: 6,
    digestion: {
      timeLeft: 16000,
      baseTime: 16000
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
        moveSpeed: 0.5,
        duration: 32000,
        timeLeft: 32000
      }
    ],
    baseExp: 40,
    primaryColor: {
      hueStart: 35,
      hueEnd: 35,
      satStart: 100,
      satEnd: 25,
      lumStart: 50,
      lumEnd: 40
    },
    secondaryColor: 'green',
    // chompEffect: smallChompEffect,
  },
  
  Mob: {
    primaryColor: 'blue',
    secondaryColor: '',
    baseMoveSpeed: 1,
    minMoveSpeed: 0.3,
    turnRateOffset: 5,
    minTurnRate: 0,
  },

  Ant: {
    r: 4,
    baseExp: 10,
    primaryColor: 'black',
    baseMoveSpeed: 2,
    turnRateOffset: 5,
    swallowables: [
      'apple', 
      'mango', 
      'ant', 
      'pebble'
    ],
  },

  Snek: {
    r: 10,
    level: 1,
    levelMultiplier: 2,
    segLevelMultiplier: 1.25,
    baseExp: 100,
    baseSegmentCount: 3,
    headingDegrees: -90,
    basePrimaryColor: `hsl(100, 100%, 32%)`,
    baseMoveSpeed: 1,
    turnRateOffset: 3,
    colorTongue: 'red',
    colorEyeWhites: 'white',
    colorFangs: 'white',
    colorLeftEye: 'hsl(55, 100%, 25%)',
    colorRightEye: 'hsl(230, 100%, 80%)',
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
    baseExp: 100,
    swallowables: ['snek', 'snek-segment'],
    baseSegmentCount: 3,
    basePrimaryColor: 'hsl(35, 50%, 55%)',
    secondaryColor: 'hsl(30, 70%, 7%)',
    baseMoveSpeed: 3,
    turnRateOffset: 5,
    colorLeg: 'hsl(30, 70%, 10%)',
    colorFangs: 'hsl(0, 0%, 0%)',
    colorEyes: 'hsl(0, 100%, 50%)'
  }
}