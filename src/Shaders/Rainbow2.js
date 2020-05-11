export const Shader = { fragmentShader: `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float iTime;
uniform vec2 iResolution;


float star_luminosity = 5.0;

vec3 draw_star(vec2 pos, vec3 star_col, float size) { 
    pos.y -=.5;
    
    float d = length(pos) * 10.0/ size;
    
    vec3 col, 
        spectrum = star_col;
        
    col = spectrum / (d * d * d);

    // produce spikes
    d = length(pos * vec2(10., .2)) * (50.0 / size);
    col += spectrum / (d * d * d);
    d = length(pos * vec2(.2, 10.)) * (50.0 / size);
    col += spectrum / (d * d * d);

    return col;
}


float hash(vec2 p) {
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}


vec3 drawStartArea (vec2 pos, vec3 col) {
    pos.y -=.5;
    pos.x *=.3;

    float d = length(pos);
    float ds = smoothstep(.145, .08, d);
    //return vec3(.7, .8, .9)*d*ds;
    return col*ds;
}


void main () {
    float t =iTime*0.5;
    float ratio = iResolution.x/iResolution.y;   
    //vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x - 1., vTextureCoord.y);    
    vec2 uv = vec2(vTextureCoord.x - .5, vTextureCoord.y -.5);   
    uv *= 1.;
    
    uv.y -= 1./3.;


    vec3 col;
    
    float offsetY = 0.;
    float offsetX = .06;

    float addToX = .3;
    
    for (int i = 0; i < 20; i++) {
        offsetY += .05;
        addToX += .4434;
        offsetX += sin(fract((offsetX + addToX) * 123.45) * 234.45) * .07;
        float star_size = (uv.y +.7) * 0.7;
        vec3 star_color = vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity;
        col += draw_star(
                vec2(uv.x + offsetX, fract((uv.y + offsetY) + t)), 
                star_color, star_size
            );
    }

    col *= step(uv.y, 0.); 


    col += drawStartArea(vec2(uv.x, uv.y + .5), vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity);

    gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
}`,
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
}