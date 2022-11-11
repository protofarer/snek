// **********************************************************************
// ********************   Load Audio Assets
// **********************************************************************

export default function Audio() {
  // eslint-disable-next-line no-unused-vars
  let assetsLoaded = 0

  // Arrayed collection of sounds for randomized selection for play
  //    or ordered, deliberate access (king)
  let sounds = {
    swallow: [],
    death: [],
  }

  // const music1 = document.querySelector('#introMusic1')
  // sounds.music.push(music1)

  const swallowC2 = document.querySelector('#swallowC2')
  sounds.swallow.push(swallowC2)
  const swallowE2 = document.querySelector('#swallowE2')
  sounds.swallow.push(swallowE2)
  const swallowG2 = document.querySelector('#swallowG2')
  sounds.swallow.push(swallowG2)
  const swallowB2 = document.querySelector('#swallowB2')
  sounds.swallow.push(swallowB2)

  // const deathSound1 = document.querySelector('#death1')
  // sounds.death.push(deathSound1)
  
  // const playRandomMusic = playRandomSoundType(sounds.music)

  function loadSounds() {
    for (let soundsOfType of Object.values(sounds)) {
      soundsOfType.forEach(s => {
        s.addEventListener(
          'canplaythrough', 
          soundLoadHandler, 
          { capture: false, once: true }
        )
        s.load()
      })
    }
    
    // let randomMusic = playRandomMusic()
    // randomMusic.volume = 0.1
  }
  loadSounds()

  function soundLoadHandler() {
    assetsLoaded++
    
    // for (let soundsOfType of Object.values(sounds)) {
    //   soundsOfType.forEach(s => {
    //     s.removeEventListener('canplaythrough', soundLoadHandler, false)
    //   })
    // }
  }

  // **********************************************************************
  // ********************   Sound Play Factories
  // **********************************************************************

  // const playRandomDeathSound = playRandomSoundType(sounds.death)

  const playRandomSwallowSound = (species) => {
    const playSwallowSound = playRandomSoundType(sounds.swallow)
    const swallowSound = playSwallowSound(species)
    return swallowSound

    // let deathSound
    // swallowSound.addEventListener('ended', () => {
    //   if (species === 'ant') {
    //     // ant being swallowed sound
    //     sounds.king[1].currentTime = 0
    //     sounds.king[1].play()
    //     deathSound = sounds.king[1]
    //   } else {
    //     deathSound = playRandomDeathSound()
    //   }
    // }, { once: true })
    // return deathSound
  }

  function playRandomSoundType(sounds) {
    return () => {
      const sound = sounds[Math.floor(Math.random() * sounds.length)]
      sound.currentTime = 0
      sound.play()
      return sound
    }
  }
  
  return { 
    sounds, 
    play: {
      playRandomSwallowSound,
    }
  }
}


