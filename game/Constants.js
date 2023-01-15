export default {
  PHASE_END: 0,
  PHASE_PLAY: 1,
  PHASE_PAUSE: 2,
  TICK: 16,
  SNEK_START_POS: { xRatio: 0.5, yRatio: 0.9 },
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  HARM_COOLDOWN: 2000,
  survival: {
    victory: {
      segcount: 16
    }
  },
  spawnIntervals: {
    apple: {
      recurring: 2000,
    },
    banana: {
      recurring: 15000,
    },
    ant: {
      recurring: 5000,
    },
    antSwarm: { 
      initial: 120000,
      recurring: 20000,
    },
    mango: {
      recurring: 30000,
    },
    centipede: {
      initial: 60000,
    },
  },
  spawnConditionals: {
    secondCentipede: { segcount: 15 },
  },

  sweets: ['apple', 'banana', 'mango'],

  underDigestionFunction: {
    WORD: 'underDigestionFunction',
    BASE_ABSORB_EXP: 'baseAbsorbExp'
  },

  collisionFunction: {
    WORD: 'collisionFunction',
    BASE_CHOMP: 'baseChomp',
    SMALL_CHOMP: 'smallChomp',
    BIG_CHOMP: 'bigChomp'
  },

  postDigestionFunction: {

  },
}