# Snek!

You are Snek. You're small and always hungry. Your appetite is endless and so are your enemies: armies of mindless ants, voracious skittering centipedes, poo-bombing birds, and hidden spider traps. Your only hope is to get bigger and faster than everything else, evading until you can face them head on and clear your habitat. You can learn to dash, counter attack, and hide, all of which are unlocked as you gain in your length. Everything is swallowable, yes that includes things like rocks, bottlecaps, bird poo, Snek's own skin: experience is gained and your body is lengthened. Find the mottled egg and care for it, or eat it! All in all, things go in the front and out the back, anything and everything. You are Snek!<br>

## Roadmap
- 0.1 -> 1.0:
  - [x] add GameOverState
  - [x] add touch controls
  - fix resize to fit viewport/avail view
  - add a scripted event
  - add a detrimental swallowable
  - tablify ent attributes for easier design iteration
  - normal mode with 10 levels
  - survival mode with basic reactive spawning/difficulty
  - hookup leaderboard and user mgt
  - affect outlines (red: frenzy/aggro, yellow: curious, black: panic)
  - prettify UI
  - add sounds and music
  - gameplay streamlining (playtesting)
  - optimize performance
    - replace Math.randoms with a super-pseudo-random literal or function
    - truncate pi and avoid floating points
- 1.0: first release for mobile

- ?: typescriptify
- ?: active slithering for dynamic movement
- ?: make a lever designer
- ?: build tester and test suite
- ?: turn into PWA

## Looking far out<br>
- 1: single player mobile<br>
- 2: online dual player mobile<br>
- 3: daily to weekly meta-gameplay
- 4: advanced features/3+ multiplayer (or new game)<br>

## Backlog
- Survival Mode
	- [ ] create survival mode easy spawn algorithm
	- [ ] create survival mode medium spawn algorithm
	- [ ] create responsive survival mode spawn algorithm
	- [ ] make rain and lightning as a survival mode screen refresh: wash away rocks, food, ents then pop in new ones in a wave-like fashion
	- [ ] add sounds for individual ent spawns (avoid sound crowding from mass spawn via spawnEnts)
- [ ] make a levelDesigner?
	- hotkey to place items -> ent stuck to mouse -> click to place -> click + drag to move -> click + click to delete
	- debugGui button to spit json file out that: ent type and coord with unique filename
- [ ] try snek speed as function of distance from head to tail
- [ ] add bad food
- [ ] joyous, silly font for panel
- [ ] employ AABB collision, quantify performance change
- [ ] build test suite
  - edge wrap
  - snek eat each ent
  - snek eat alternate pebble and ent, leading or tailing pebble
  - ant carry
  - snek eat ant carry
  - snek touch ant carry before ant
  - digesting ant touches external carryable
  - ent digestion effects work: exp, under, post, chomp
  - cent chomp snek seg and head
  - snek can level up
  - snek segs can level up and reset lvl up exp when lose a seg
  - snek creates poop and excretes and excreted poop is unhittable
  - check all ent hitareas correct
  - segmentless snek do all above
- [ ] BUG On full turns, snek segments point further upstream than their immediate upstream seg's tail
- [ ] design a negative immob
- [ ] design a supporting mob / ally mob
- [ ] make snake deccelerate instead of instantly slow, upon any slow effect
- [ ] when add segments at tail rather than at head
- [ ] snek seg widths become healthy while under positive postdigestion fx
	- [ ] snek seg widths become skinny coincidentally when under no postdigestion fx?
- [ ] how should r, hitR, and scale be related?
	- is r a purely graphical dimension or does it represent ent's power in some way?... no separate. r proportionates draw lengths and hitArea. Scale is used as a graphical tweaking (applied peculiarly and dynamically for each ent) for animations or temporary effects but not the base graphic representation.
	- scale is generally used to modify the base ent visuals independent of change in r or power/level.
		- if scale is modified, it must affect the wrapper ctx.scale() and possibly modify hitR
- [ ] imbue secondaryColor with primaryColor methods
	- [ ] consider making a color morphing class
- [ ] ent recycling, prime case: snek fully digests ent
- [ ] Do I need webkit vs moz versions of requestAnimationFrame? : https://stackoverflow.com/questions/16554094/canvas-requestanimationframe-pause
- [ ] when digestion nears finishing (~3sec) flash it until it poopifies or is excreted
- [x] add non-nutritious eating
- [x] snake can poop
- [x] BUG new segments sweep in from nowhere
- [ ] Add cockaroacheros
- [ ] debug show game ticks elapsed
- [ ] debug show digestion state
- [x] separate steps from draw for all code
	- [x] rename and separate, updates and renders
- [ ] make digestion rate depend on elapsed time rather than game ticks?
- [ ] delete digested items from game or put back into a RingBuff
- [ ] randomly get a poop backup which causes snek to panic, he has to swallow things to get it to pass, after which he gets an extra good speed boost (because of handling a random effect)
- [ ] let debuggui recursively traverse ents via new childEnt prop in order to call new drawDebugOverlays
- [ ] Does segment directionAngle update tan function need to be handle for case dx = 0?
- [x] centipede addEnt spawns segments away from head
- features
	- new ents
	- [ ] Add Beetle larvae: the juiciest of juicies, everybody wants some.
	- [ ] add smart centipede as enemy
	- [ ] add juicy beetle larvae
	- [ ] add holes that arewolf spider traps (visible cue)
	- [ ] Add millipede: pretty slow, eat apples, centis eat millipedes, millipedes are low nutrition food, like a string of pebbles, mostly are a negative because they feed centipedes (get stronger) and eat fruits/powerups (if eat a super powerup they get super strong and aggressive)
	- holes
	- [ ] add holes that have something good: beetle that scurry
	- [ ] add holes that are ambiguous
	- [ ] add holes that transport to another area
- [ ] centipedes can swallow and digest
- [ ] make snake turnRate max to eat its own tail (special ability activate or unlock for player => that is how snek levels up)
- [ ] ensure world.spawnents not broken.. doesnt spawn in debug mode
- image smoothing settings: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabledmust be big enough to eat them, they are large critters. They randomly launch pebbles and toss rocks that may injure surrounding ents.
- design
	- [ ] snake animation: head enlarges cartoonishly, eyes bulging to size of object swalling before passing to segment

### .streamline workflow and improve productivity, readability
- [ ] x
- [ ] prepend "Abstract" as appropriate (entity, immob, mob, ...)
- [x] should digestedEnts get the headEnt or let segment getHeadEnt? :: let segments be the interface
- make ents collision functions "proactiveCollision" "reactiveCollision", for aggressor/chomp/grab and getHit/detach/drop respectively
- [ ] PROBLEM: since segments' are not game Entities, they do not get render/update at game level, this makes it convoluted since neither game nor debugGUI can readily call them, instead must rig up head to do it
- [ ] explore using event emmitters
- [ ] make snek just another ent
- [ ] make easy to work with milliseconds and elapsed durations
- [x] Create walking behavior library and use compositionally
- [x] add numeric scale debug param, eg 3x 4x game speed
- [x] make methods and objects chainable with returns
- [x] make the fill function of fruits and simple objects specifiable with gradients or change to stroke
- [ ] on Game Slowed, turn on all debug logs
	- [ ] setup debug logging system https://developer.mozilla.org/en-US/docs/Web/API/Console/debug
- [ ] easy ent making system: make fruit object classes on the fly, same for bugs, and inorganics
- [ ] Develop a game test suite:
	- [ ] run different parameters for extended periods of time: log errors, run with debug logs on, strain system, run probable game scenarios, test new code and mechanics
- [x] ent rotator tool for getting hitareas drawn correctly :: too complex, just use square hitAreas
- [ ] gameTickMultiplier improve functionality by truly only updating game and then rendering after the added game ticks.
- [ ] adding an ent under another ent should be generalized: ent.parentEnt is set, parentEnt adds childEnt into an array and updates them in its own update()
- [x] define mob by ents with a "mobile" property instead of explicit "mob" type.
	- [x] same for immobs

### .optimize performance
- [ ] x
- use symbol for keys
- Use map
- [ ] segments only check for headent when it changes; checking every update is taxing compute
- [ ] use array for Enttiy.stack
- [ ] pebble runs setHitAreas (pebble updates r after super()) after its superclass immob does it
- [ ] remove unecessary runtime Math.random()'s'
	- [ ] instead of turnerratically or turn randomly smoothly triggering only a turn step, have them trip a flag to continuously turn for so many game ticks then set the flag off
- [ ] develop good algorithm for handling collision detection (bites/swallows/carries) across entities so it doesn't double check
- [ ] more controlled spawning, guassian random number generator: : https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
- [ ] consider ringBuffer when objects get numerous
- [ ] make own circle collision algo
- [ ] replace Math.PI with 3.142 or more truncated, globally
- [ ] interpolate segment position for when movespeed decreases.                                                                                             
	- upon movespeed decrease and thus an increase in number of headTrail elements kept, check that the distance between headTrailElements is around the same as movespeed. Halve the too long distances by adding an element in between, do this for all of headtrail before the segment starts doing its catch up.
- [ ] measure performance, address hogs, all this leading up to multiplayer: https://www.youtube.com/watch?v=Sp5_d6coiqU

# .TODO

11/12
Tablification
- memory considerations
	- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management
		- reference counting GC
			- > Circular references are a common cause of memory leaks.
			- > Internet Explorer 6 and 7 are known to have reference-counting garbage collectors, which have caused memory leaks with circular references. No modern engine uses reference-counting for garbage collection anymore.
		- Currently, all modern engines ship a mark-and-sweep garbage collector.
	- https://medium.com/7factor/javascript-objects-and-memory-consumption-a3dae9c15fce
	- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
	- > JavaScript was originally designed for use in browsers; if a random webpage could choose to allocate memory in such a way that the garbage collector would never reclaim it without manual intervention, that's basically asking for memory leaks (unintentional or malicious denial of service by the web page).
- adhoc review: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
- [x] consolidate gameplay constants
	- cantHarm period
- [x] JSONify ent base attributes, have ent "load" variables via a loop
	- didnt traitify: species, subspecies
	- should traitify: shadowcolor, shadowblur, shadowoffsets
- [x] build an loadTraits function that each entclass can call in constructor to set them up automatically
	- [x] when JSONparse/stringify... lose object references... it's best for literals... can structuredClone work?:: no, instead simplify TraitsFile and use Constants and Intermediate Function libraries to help
- woohoo building methods with CONSTANTS names
- getting more higher level and abstracted
- What is cost of importing the whole `trait.js` for each ent class?

- [ ] add new game to end dialog
- [ ] make snek mouth half as wide as head
- [ ] buttons for start menu
	- [ ] click path is off... checkout checkers' use of the Button offset object

- [ ] halt game before each level, flash snek, render a big snek head on the "Start/Action" button to begin playing
- [ ] BUG: after eating apples or ants? (happened during basic 10ant 10app debug level), snek movespeed goes into negative after digestion
	- the effect is deactivating twice for each activation, even for single apple
- [ ] BUG: lifespan NaN

Gameplay
- [ ] get a basic survival mode working!!!!
	- [ ] spawning behavior
	- [ ] enddialog newgame button
	- [ ] prettify buttons, hide A
	- [ ] lower seg exp req


- [ ] eating mango gives a segment, no matter what (and current exp value of remaining seg level added as result), ie save mangoes till snek is longer for big exp boost and free seg, no chomp effect
	- [ ] abstract away difference between currExp and segCurrExp, abstract for ent so that calls to immobs and mobs modify appropriate exp types
	- [ ] whats best method, should class fields be declared and initiated with undefined or empty objects/null/zero values
		- IE should fields be used to init or purely for declaring?
	- [ ] create public methods for modifying mob state
		- movespeed, turnrate, primarycolor