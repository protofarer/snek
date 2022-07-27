import CONSTANTS from './Constants'
import Clock from './utils/Clock'
import World from './ents/World'
import Panel from './Panel'

import Snek from './mobs/Snek'
import Centipede from './mobs/Centipede'
import Ant from './mobs/Ant'

import Apple from './immobs/Apple'
import Mango from './immobs/Mango'
import Pebble from './immobs/Pebble'
import Poop from './immobs/Poop'
import Entity from './Entity'

export default class Game {
  species = 'game'
  constructor (container) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'layerGame'
    this.canvas.width = this.canvas.height = 800
    this.container.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.rect = this.canvas.getBoundingClientRect()

    // * Related to normal game flow and info directly relevant to player
    this.state = {
      msg: '',
      phase: CONSTANTS.PHASE_PLAY,
      score: 0,
    }

    // * Adjustable parameters for testing design, performance, and debugging
    this.params = {
      // * capped at 1 on test slider because of how it divides the elapsed time 't' from draw= {
      speed: 1,
      pauseLength: 0
    }

    this.snek = null

    this.world = new World(this.ctx, this),
    this.clock = new Clock(this.ctx, this)

    this.mobs = []
    this.immobs = []

    // Update code not belonging to entity
    this.updateFunctions = []

    this.panel = new Panel(this)
    this.container.appendChild(this.panel.panelContainer)

    const isDebugOn = window.sessionStorage.getItem('isDebugOn') 
    if (isDebugOn === 'false' || isDebugOn === null) {
      this.initSpawn()
    }
  }

  addUpdateFunction(f) {
    this.updateFunctions.push(f)
  }

  seamlessMove(mob) {
    if (mob.state.position.x >= this.canvas.width) {
      mob.state.position.x = 0
    } else if (mob.state.position.x < 0) {
      mob.state.position.x = this.canvas.width
    }

    if (mob.state.position.y >= this.canvas.height) {
      mob.state.position.y = 0
    } else if (mob.state.position.y < 0) {
      mob.state.position.y = this.canvas.height
    }
  }

  isContactingMouth(objHitArea, mouthCoords) {
    // console.log(`objhitarea`, objHitArea)
    // console.log(`mouthcoords in iscontactingmouth`, mouthCoords)
    return this.ctx.isPointInPath(objHitArea, mouthCoords.x, mouthCoords.y)
  }

  checkEndCondition() {
    console.log('IN checkEndCondition()')
  }

  end() {
    console.log(`Ending game...`, )
  }

  clr() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  addEnt(entClass, position=null) {
    const ent = new entClass(
      this.ctx, 
      {
        x: position?.x || 170,
        y: position?.y || 400,
      }, 
      this
    )
    
    const bigEnt = new Entity(ent)
    
    if (!position) {
      ent.state.position.x += (50 * bigEnt.id)
    }
    ent.state.mobile = false
    // Handle setting hit area when position arg specified since immobs
    //  only set it only once at instantiation
    if (entClass.entGroup === 'immob') ent.setHitAreas()
    console.log(`ent.position`, ent.state.position)
    
    return ent
  }

  spawnEnts(entClass, n=1, position=null) {
    const ents = []
    for(let i = 0; i < n; i++) {
      const ent = new entClass(
        this.ctx, 
        position || 
        {
          x:Math.random()*this.canvas.width,
          y:Math.random()*this.canvas.height,
        }, 
        this
      )
      if (ent.entGroup === 'mob') ent.state.directionAngle = Math.random() * 360
      new Entity(ent)
      ents.push(ent)
    // console.log(`ent`, ent)
    }
    
    return ents
  }

  removeEnt(id) {
    delete Entity.stack[id]
  }

  render() {
    this.clock.render()
    for(const ent of Object.values(Entity.stack)) {
      // console.log(`rendering ent:`, ent)
      
      ent.render()
    }
    this.snek?.render()
    this.panel.render()
  }

  update() {
    // **********************************************************************
    // * 1. Add new objects
    // **********************************************************************
    this.world.randomSpawns()
    // **********************************************************************
    // * 2. Update all objects
    // **********************************************************************
    this.clock.update()

    this.updateFunctions.forEach(f => f())

    this.snek && this.seamlessMove(this.snek)
    this.snek?.update()

    for(const [id, ent] of Object.entries(Entity.stack)) {
      ent.update()
      if (ent.species === 'ant' && !ent.carriedEnt) {
        let sweets = Entity.bySpecies(['apple', 'mango'])
        for(let [id, sweet] of Object.entries(sweets)) {
          const isContacting = this.isContactingMouth(
            sweet.hitArea,
            ent.state.mouthCoords
            )
            
            if (isContacting) {
            //   console.log(`****************************************`, )
            //   console.log(`****************************************`, )
            //   console.log(`****************************************`, )
            //   console.log(`****************************************`, )
            //   console.log(`****************************************`, )
            //   console.log(`****************************************`, )
              
            // console.log(`ant mouthcoords`, ent.state.mouthCoords.x)
            // console.log(`ant mouthcoords`, ent.state.mouthCoords.y)
            // console.log( sweet.hitArea )
            // console.log(`isContacting!`, isContacting)
            
            ent.grab(sweet)
            // console.log( sweet.hitArea )
            // console.log(`sweet`, sweet)
            // console.log(`id`, id)
            
            
            this.removeEnt(id)
          }
        }
      }
      if (ent.entGroup === 'mob') {
        
        this.seamlessMove(ent)

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            ent.hitArea,
            this.snek.state.mouthCoords,
          )
  
          if (isContacting) {
            
            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.swallow(ent)
              this.state.score++
              this.removeEnt(id)
            }
          }
        } // * DRY
      } else if (ent.entGroup === 'immob') {

        if (this.snek) {
          const isContacting = this.isContactingMouth(
            ent.hitArea,
            this.snek.state.mouthCoords, 
          )
          if (isContacting) {
            if (this.snek.swallowables.includes(ent.species)) {
              this.snek.swallow(ent)
              this.state.score++
              this.removeEnt(id)
            }
          }
        }
      }
    // **********************************************************************
    // * 3. Update UI
    // **********************************************************************
      // this.panel.updateMsg()
    }
  }

  initSpawn() {

    // this.spawnEnts(Pebble, 55)
    // this.spawnEnts(Mango, 10)
    // this.spawnEnts(Apple, 30)
    // this.snek = new Snek(this.ctx, null, this)
    // this.spawnEnts(Ant, 40)
    // this.spawnEnts(Centipede, 2)


    // this.spawnEnts(Apple, 50)
    // this.spawnEnts(Pebble, 55)
    // this.spawnEnts(Ant, 50)
    // this.spawnEnts(Mango, 50)
    // this.spawnEnts(Centipede, 2)

      // const ant = this.addEnt(Ant)
      // ant.state.canTurn = false
      // ant.state.mobile = true
      // const m = this.addEnt(Mango)
  }
}