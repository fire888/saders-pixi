import * as PIXI from 'pixi.js-legacy'
import KEY_IMG from './assets/az-fish.png'

document.title = 'Ocean'

class BackgroundEffect {
    constructor() {
        this.container = new PIXI.Container()

        this._fishes = new Fishes()
        this.container.addChild(this._fishes.container)
    }
}


const NUM_FISH = 80
const H = 1


class Fishes {
    constructor() {
        this.container = new PIXI.Container()

        this.arrFishes = []
        for (let i = 0; i < NUM_FISH; i ++) {
            const fish = new Fish(this.container, 'left')
            this.container.addChild(fish.container)
            this.arrFishes.push(fish)
        }

        for (let i = 0; i < NUM_FISH; i ++) {
            const fish = new Fish(this.container, 'right')
            this.container.addChild(fish.container)
            this.arrFishes.push(fish)
        }

        const animate = () => {
            requestAnimationFrame(animate)
            this._update() 
        }

        animate()
    }

    _update (data) {
        this.arrFishes.forEach(item => item.update())
    }
}


class Fish {
    constructor(cont, area) {
        this.parent = cont
        this.area = area
        this.moveForvard = true

        this.wApp = window.innerWidth
        this.halfWApp = this.wApp / 2
        this.hApp = window.innerHeight
        this.h = this.hApp * H

        this.maxX = this.wApp / 2 + 250
        this.minX = -this.maxX
        this.maxY = this.hApp / 2 * H
        this.minY = -this.maxY

        this.phase = Math.random() * 100

        this.points = []
        const len = 5
        const dist = 50
        this.step = dist / len

        for (let i = 0; i < len; i++) {
            this.points.push(new PIXI.Point(this.step * i, 0))
        }


        const spr = new PIXI.SimpleRope(PIXI.Texture.from(KEY_IMG), this.points)
        spr.alpha = 0.9
        spr.scale.set(0.5 + Math.random() * 0.2)

        if (this.area === 'left') {
            spr.x = this.minX * Math.random()
        }

        if (this.area === 'right') {
            spr.x = this.maxX * Math.random()
        }

        spr.y = Math.random() * 200 * (Math.random() < 0.5 ? 1 : -1)

        this.container = spr

        this.initNewTarget()

    }

    update() {
        this.container.x += this.speeds[0]
        this.container.y += this.speeds[1]

        this.phase += this.spd / 5

        for (let i = 0; i < this.points.length; i ++) {
            this.points[i].y = Math.sin(this.phase + i) * (this.points.length - 1 - i)
        }

        if (
            Math.abs(this.container.x - this.targetPoint[0]) < 15
            && Math.abs(this.container.y - this.targetPoint[1]) < 15
        ) {
            this.initNewTarget()
        }
    }


    initNewTarget () {
        this.moveForvard = !this.moveForvard

        let targetX
        if (this.area === 'left') {
            if (this.moveForvard) {
                targetX = this.maxX
            }
            if (!this.moveForvard) {
                targetX = this.minX
            }
        }

        if (this.area === 'right') {
            if (this.moveForvard) {
                targetX = this.minX
            }
            if (!this.moveForvard) {
                targetX = this.maxX
            }
        }


        this.targetPoint = [
            targetX,
            Math.random() * 200 * (Math.random() < 0.5 ? 1 : -1),
        ]

        const distX = this.targetPoint[0] - this.container.x
        const distY = this.targetPoint[1] - this.container.y
        const dist = Math.sqrt((distX * distX) + (distY * distY))

        this.spd = Math.random() + 0.1

        this.speeds = [
            distX/dist * this.spd,
            distY/dist * this.spd,
        ]

        this.container.scale.x = this.speeds[0] >= 0 ? 1 : -1
    }
}


const initApp = () => {
  
    const app = new PIXI.Application({
      width: window.innerWidth, 
      height: window.innerHeight, 
      backgroundColor: 0x101121, 
      resolution: window.devicePixelRatio || 1,
      resizeTo: document.querySelector(".canvas-wrapper"), 
    })
    document.querySelector(".canvas-wrapper").appendChild(app.view)

    const effect = new BackgroundEffect()
    app.stage.addChild(effect.container)
    effect.container.y = 200
    effect.container.x = window.innerWidth / 2
}    

window.onload = function() { initApp() }
