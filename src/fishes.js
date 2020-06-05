import * as PIXI from 'pixi.js-legacy'
import KEY_IMG from './assets/az-fish.png'
import { generatePositions } from './Fishes/generatePositions'


document.title = 'Ocean'

class BackgroundEffect {
    constructor() {
        this.container = new PIXI.Container()

        this._fishes = new Fishes()
        this.container.addChild(this._fishes.container)
    }
}


const FULL_TICK = 1000

class Fishes {
    constructor() {
        this.container = new PIXI.Container()

        this._tick = 0
        this._canMove = true

        this.arrFishes = []

        const arrPoses = generatePositions()
        for (let i = 0; i < arrPoses.length; i ++) {
            const fish = new Fish(this.container, arrPoses[i])
            this.container.addChild(fish.container)
            this.arrFishes.push(fish)
        }

        const animate = () => {
            requestAnimationFrame(animate)
            this._update() 
        }

        animate()
    }

    _update(data) {
        if (this._tick > FULL_TICK * 2) {
            this._tick = 0
            this.arrFishes.forEach(item => item.initSpd())
        }


        if (this._canMove) {
            this._tick ++
        }

        const noMove = this._tick === FULL_TICK
        this.arrFishes.forEach(item => item.update(noMove))

        if (noMove && this._canMove) {
            this._canMove = false
            setTimeout(() => this._canMove = true, 50)
        }
    }
}


const wApp = window.innerWidth
const maxX = wApp / 2
const minX = -maxX

class Fish {
    constructor(cont, targetPos) {
        this.parent = cont
        this._targetPos = targetPos
        this.moveForvard = true


        this.phase = Math.random() * 80
        this._orient = Math.random() < 0.5 ? -1 : 1

        const len = 5
        const dist = 70
        this.step = dist / len

        this.points = []
        for (let i = 0; i < len; i++) {
            this.points.push(new PIXI.Point(this.step * i, 0))
        }

        const spr = new PIXI.SimpleRope(PIXI.Texture.from(KEY_IMG), this.points)

        spr.alpha = 0.9
        spr.scale.set(0.5 + Math.random() * 0.2)

        if (this._orient === -1) {
            spr.x = maxX * (Math.random()* 0.8 + 0.1)
        }

        if (this._orient === 1) {
            spr.scale.x *= -1
            spr.x = minX * (Math.random() * 0.8 + 0.1)
        }

        spr.y = this._targetPos.y + (Math.random() * 150 - 75)
        this._spd = [0, 0]

        this.container = spr

        this.initSpd()

    }

    initSpd() {
        this.container.scale.x *= -1
        this.container.x += Math.sign(this.container.scale.x) * (-40)

        this._spd[0] = (this._targetPos.x - this.container.x  + (Math.sign(this.container.scale.x) * (-20))) / FULL_TICK
        this._spd[1] = (this._targetPos.y - this.container.y) / FULL_TICK

        this._spdPhase = 0.1 + Math.sqrt(Math.pow(this._spd[0], 2) * Math.pow(this._spd[1], 2)) * 2
    }

    update(noMove) {
        this.phase += this._spdPhase

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].y = Math.sin(this.phase + i) * (this.points.length - 1 - i)
        }

        if (noMove) return;

        this.container.x += this._spd[0]
        this.container.y += this._spd[1]
    }

}


const initApp = () => {
    const htmWrapper = document.querySelector(".canvas-wrapper")

    const app = new PIXI.Application({
      width: window.innerWidth, 
      height: window.innerHeight, 
      backgroundColor: 0x101121, 
      resolution: 1,
    })
    document.querySelector(".canvas-wrapper").appendChild(app.view)

    const effect = new BackgroundEffect()
    app.stage.addChild(effect.container)

    effect.container.scale.set(window.innerWidth / 900)

    effect.container.y = 200
    effect.container.x = window.innerWidth / 2
}    

window.onload = function() { initApp() }
