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
    endConditions: {
      winByLevel: {
        WORD: 'WIN_BY_LEVEL',
        segCount: 12
      },
      loseByPoop: {
        WORD: 'LOSE_BY_POOP',
        limit: 1,
        warningDuration: 60000,
      },
      loseByDeath: {
        WORD: 'LOSE_BY_DEATH'
      },
    }
  },

  normal: {
    endConditions: {
      loseByPoop: {
        WORD: 'LOSE_BY_POOP',
        warningDuration: 60000
      },
      loseByDeath: {
        WORD: 'LOSE_BY_DEATH'
      },
      winByLevel: {
        WORD: 'WIN_BY_LEVEL',
      },
      winByLifespan: {
        WORD: 'WIN_BY_TIME_ALIVE', 
      },
    },
  },

  endConditions: {
    frequencyMS: 200
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