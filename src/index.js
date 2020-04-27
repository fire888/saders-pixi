import * as PIXI from 'pixi.js-legacy'
import { Shader } from './Shaders/Shader'

const initApp = () => {
  const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight, 
    backgroundColor: 0x1099bb, 
    resolution: window.devicePixelRatio || 1,
    resizeTo: document.querySelector(".canvas-wrapper"), 
  })
  document.querySelector(".canvas-wrapper").appendChild(app.view)

  const graphics = new PIXI.Graphics()
  graphics.beginFill(0x000000)
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  graphics.endFill()

  const filter = new PIXI.Filter(null, Shader.fragmentShader, Shader.uniforms)
  graphics.filters = [filter]

  app.stage.addChild(graphics)

  const animate = () => {
    requestAnimationFrame(animate)
    Shader.uniforms.iTime += 0.02
  }

  
  animate()

  window.addEventListener('resize', () => {
    graphics.clear()
    graphics.beginFill(0x000000)
    graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
    graphics.endFill()
    Shader.uniforms.iResolution = [window.innerWidth, window.innerHeight]
  })
}

window.addEventListener('load', initApp)

