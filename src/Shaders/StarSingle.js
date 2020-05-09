/*
https://www.shadertoy.com/view/3slBD8

#define SPIKE_WIDTH 0.01
#define CORE_SIZE 0.4

float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
}

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

vec3 starWithSpikes(vec2 uv, vec3 starColor){
    float d = 1.0 - length(uv - 0.5);

    float spikeV = cubicPulse(0.5, SPIKE_WIDTH, uv.x) * parabola(uv.y, 2.0) * 0.5;
    float spikeH = cubicPulse(0.5, SPIKE_WIDTH, uv.y) * parabola(uv.x, 2.0) * 0.5;
    float core = pow(d, 20.0) * CORE_SIZE;
    float corona = pow(d, 6.0);
    
    float val = spikeV + spikeH + core + corona;
    return vec3(val * (starColor + val));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.x;
    uv.y += 0.2;
    
    vec3 starColor = vec3(abs(sin(iTime)), 0.1, abs(cos(iTime)));
    vec3 col = starWithSpikes(uv, starColor);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
*/

export const Shader = {
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
    fragmentShader: `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float iTime;
        uniform vec2 iResolution;

        #define SPIKE_WIDTH 0.01
        #define CORE_SIZE 0.4

        float parabola( float x, float k ){
            return pow( 4.0*x*(1.0-x), k );
        }

        float cubicPulse( float c, float w, float x ){
            x = abs(x - c);
            if( x>w ) return 0.0;
            x /= w;
            return 1.0 - x*x*(3.0-2.0*x);
        }

        vec3 starWithSpikes(vec2 uv, vec3 starColor){
            float d = 1.0 - length(uv - 0.5);

            float spikeV = cubicPulse(0.5, SPIKE_WIDTH, uv.x) * parabola(uv.y, 2.0) * 0.5;
            float spikeH = cubicPulse(0.5, SPIKE_WIDTH, uv.y) * parabola(uv.x, 2.0) * 0.5;
            float core = pow(d, 20.0) * CORE_SIZE;
            float corona = pow(d, 6.0);
    
            float val = spikeV + spikeH + core + corona;
            return vec3(val * (starColor + val));
        }



        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5) +0.5;        
            uv *= 1.;

            
            vec3 starColor = vec3(abs(sin(iTime)), 0.1, abs(cos(iTime)));
            vec3 col = starWithSpikes(uv, starColor);
        

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}