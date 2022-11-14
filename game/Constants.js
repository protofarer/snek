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
  spawnTimers: {
    apple: 3000,
    banana: 15000,
    ant: 6000,
    antSwarm: 30000,
    mango: 60000,
    centipede: 60000,
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