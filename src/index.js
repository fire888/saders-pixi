var SPECTOR = require("spectorjs");

import texture from './assets/s1200.jpg'
// https://www.shadertoy.com/view/wssfzr
// https://www.shadertoy.com/results?query=&sort=newest&from=696&num=12

// https://www.shadertoy.com/view/WsXfRH hair
/*
https://www.shadertoy.com/view/tdjyDd pulsar
https://www.shadertoy.com/view/WsSyDt tubes
https://www.shadertoy.com/view/ts2yWV  sphere castle
https://www.shadertoy.com/view/3sByRc black contur
https://www.shadertoy.com/view/WsScDK eye lines
https://www.shadertoy.com/view/WsBcWG cube bubles
https://www.shadertoy.com/view/ts2cRc spermatozoids glow
https://www.shadertoy.com/view/3djczc techno toroid
https://www.shadertoy.com/view/Wd2yWw ref tubes

https://www.shadertoy.com/results?query=&sort=newest&from=2112&num=12

////////////////////////////////////////////////////////////// ADDDDDDD 
https://www.shadertoy.com/view/tsSyWh

NOISE 

vec2 random22(vec2 st)
{
    st = vec2(dot(st, vec2(127.1, 311.7)),
                dot(st, vec2(269.5, 183.3))
                );
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

vec3 celler2D(vec2 i,vec2 sepc)
{
    vec2 sep = i * sepc;
    vec2 fp = floor(sep);
    vec2 sp = fract(sep);
    float dist = 5.;
    vec2 mp = vec2(0.);

    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 neighbor = vec2(x, y);
            vec2 pos = vec2(random22(fp+neighbor));
            pos = sin( (pos*6. +iTime/2.) )* 0.5 + 0.5;
            float divs = length(neighbor + pos - sp);
            mp = (dist >divs)?pos:mp;
            dist = (dist > divs)?divs:dist;
        }
    }
    return vec3(mp,dist);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
	float cell = celler2D(uv,vec2(6.5)).z;
    float celln = 0.;
    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 ne = vec2(x, y);
            celln +=  celler2D(uv + ne,vec2(6.5)).z;
        }
    }
    cell = smoothstep(cell,celln,2.2);
    vec3 col = vec3(1.) * sin( cell * 8. + iTime) ;
    fragColor = vec4(col,1.0);
}

















*/

import * as PIXI from 'pixi.js-legacy'

//import { Shader } from './Shaders/Rainbow'
//import { Shader } from './Shaders/Rainbow2'
import { Shader } from './Shaders/Rainbow3'

//import { Shader } from './Shaders/Stars'
//import { Shader } from './Shaders/Stars2'
//import { Shader } from './Shaders/StarsN'
//import { Shader } from './Shaders/StarSingle'
//import { Shader } from './Shaders/StarSingle2'
//import { Shader } from './Shaders/StarsStay'

//import { Shader } from './Shaders/SphereIce'
//import { Shader } from './Shaders/TextureWaves'


//import { Shader } from './Shaders/CubicNoise'
//import { Shader } from './Shaders/Voronoi'
//import { Shader } from './Shaders/Water'
//import { Shader } from './Shaders/Sky'
//import { Shader } from './Shaders/Toroid'

const initApp = () => {
  var spector = new SPECTOR.Spector();
  spector.displayUI();

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

