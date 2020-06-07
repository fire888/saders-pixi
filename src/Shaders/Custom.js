
export const Shader = { fragmentShader: `
precision lowp int;
#define TWO_PI 6.28318530718

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float iTime;
uniform vec2 iResolution;


vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp( abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0), 6.0)-3.0 )-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}


void main () {
    float t = iTime * .2;
    float ratio = iResolution.x/iResolution.y;
    float offset = ratio / 2. - .5;
    vec2 uv = vec2(ratio * vTextureCoord.x - offset, vTextureCoord.y);  
    float clampLR = step(0., uv.x)-step(1., uv.x);

    vec2 toCenter = vec2(0.5)-uv;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*5.0;

    vec3 col = hsb2rgb( vec3((angle/TWO_PI)-0.5 * t, radius, 1.0) );

    //float p = (sin(t) + 1.) / 2.;
    //float p2 = (sin(t + 1.) + 1.) / 2.;

    //vec3 col1 = mix(vec3(0.850, 0.8, 0.349), vec3(0.443, 0.619, 0.937), p);
    //vec3 col2 = mix(vec3(0.917, 0.501, 0.866), vec3(0.443, 0.937, 0.756), p2);


    //float l = smoothstep(p -.15, p - .0, uv.y) - smoothstep(p +.0, p + .15, uv.y);
    //l += smoothstep(p2 -.15, p2 - .0, uv.x) - smoothstep(p2 +.0, p2 + .15, uv.x);

    //vec3 col = mix(col1, col2, l); 

    gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col * clampLR, 1.);
}`,
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
}


/*

y = mod(x,0.5); // x по модулю 0.5
//y = fract(x); // возвращает дробную часть аргумента
//y = ceil(x);  // ближайшее целое, большее либо равное x
//y = floor(x); // ближайшее целое, меньшее либо равное x
//y = sign(x);  // знак x
//y = abs(x);   // абсолютное значение x
//y = clamp(x,0.0,1.0); // ограничение x промежутком от 0.0 до 1.0
//y = min(0.0,x);   // меньшее из x и 0.0
//y = max(0.0,x);   // большее из x и 0.0 

*/