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
      segcount: 10
    },
    loseConditions: {
      POOPIFICATION: 'POOPIFICATION',
      KILLED: 'KILLED'
    },
    poopification: {
      limit: 75,
      countdownMS: 5000,
    }
  },
  endConditions: {
    LOSE_BY_POOP: 'LOSE_BY_POOP',
    LOSE_BY_DEATH: 'LOSE_BY_DEATH',
    WIN_BY_LEVEL: 'WIN_BY_LEVEL',
    WIN_BY_TIME_ALIVE: 'WIN_BY_TIME_ALIVE',
  },
  events: {
    centipedeSwarm: {
      WORD: 'CENTIPEDE_SWARM',
      initial: 7*60000,
      // initial: 10000,
      warningDuration: 60000
    },
    antSwarm: {
      WORD: 'ANT_SWARM',
      cooldown: 30000,
    }
  },
  spawnIntervals: {
    apple: {
      recurring: 2000,
    },
    banana: {
      recurring: 20000,
    },
    ant: {
      recurring: 3000,
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
  VERSION_DESCRIPTION: 'survival gameplay and kade integration'
}