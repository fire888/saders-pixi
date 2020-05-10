import texture from './assets/s1200.jpg'
// https://www.shadertoy.com/view/wssfzr
// https://www.shadertoy.com/results?query=&sort=newest&from=696&num=12



import * as PIXI from 'pixi.js-legacy'

//import { Shader } from './Shaders/Stars'
//import { Shader } from './Shaders/Stars2'
//import { Shader } from './Shaders/StarsN'
//import { Shader } from './Shaders/StarSingle'
//import { Shader } from './Shaders/StarSingle2'
//import { Shader } from './Shaders/StarsStay'

//import { Shader } from './Shaders/SphereIce'
import { Shader } from './Shaders/TextureWaves'


//import { Shader } from './Shaders/CubicNoise'
//import { Shader } from './Shaders/Voronoi'
//import { Shader } from './Shaders/Water'
//import { Shader } from './Shaders/Sky'
//import { Shader } from './Shaders/Toroid'

const initApp = () => {
  let image = PIXI.Texture.from(texture);

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


  Shader.uniforms.iChannel0 = image

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

