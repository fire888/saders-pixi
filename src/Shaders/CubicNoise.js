/*
https://www.shadertoy.com/view/wsXfDM

//	3D Cubic Noise
//
//  https://github.com/jobtalle/CubicNoise

float random(vec3 x) {
    return fract(sin(x.x + x.y * 211.081 + x.z * 937.016) * 991.012);
}

float interpolate(float a, float b, float c, float d, float x) {
    float p = (d - c) - (a - b);
    
    return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
}

float sampleX(vec3 at) {
    float floored = floor(at.x);
    
    return interpolate(
        random(vec3(floored - 1.0, at.yz)),
        random(vec3(floored, at.yz)),
        random(vec3(floored + 1.0, at.yz)),
        random(vec3(floored + 2.0, at.yz)),
    	at.x - floored) * 0.5 + 0.25;
}

float sampleY(vec3 at) {
    float floored = floor(at.y);
    
    return interpolate(
        sampleX(vec3(at.x, floored - 1.0, at.z)),
        sampleX(vec3(at.x, floored, at.z)),
        sampleX(vec3(at.x, floored + 1.0, at.z)),
        sampleX(vec3(at.x, floored + 2.0, at.z)),
        at.y - floored);
}

float cubicNoise(vec3 at) {
    float floored = floor(at.z);
    
    return interpolate(
        sampleY(vec3(at.xy, floored - 1.0)),
        sampleY(vec3(at.xy, floored)),
        sampleY(vec3(at.xy, floored + 1.0)),
        sampleY(vec3(at.xy, floored + 2.0)),
        at.z - floored);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    vec2 coords = fragCoord.xy * 0.08;
    
    // The noise is sampled with a tilted plane to avoid directional artifacts
    vec3 X = vec3(coords, iTime);
    X = mat3(
        0.788675134594813, -0.211324865405187, -0.577350269189626,
        -0.211324865405187, 0.788675134594813, -0.577350269189626,
        0.577350269189626, 0.577350269189626, 0.577350269189626) * X;
    float n = cubicNoise(X);
    
    vec3 a = vec3(0.9, 0.8, 0.25);
    vec3 b = vec3(0.1, 0.5, 0.9);
    
    fragColor = vec4(n > 0.5 ? a : b, 1.0);
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

        
        
        float random(vec3 x) {
            return fract(sin(x.x + x.y * 211.081 + x.z * 937.016) * 991.012);
        }
        
        float interpolate(float a, float b, float c, float d, float x) {
            float p = (d - c) - (a - b);
            
            return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
        }

        float sampleX(vec3 at) {
            float floored = floor(at.x);
            
            return interpolate(
                random(vec3(floored - 1.0, at.yz)),
                random(vec3(floored, at.yz)),
                random(vec3(floored + 1.0, at.yz)),
                random(vec3(floored + 2.0, at.yz)),
                at.x - floored) * 0.5 + 0.25;
        }


        float sampleY(vec3 at) {
            float floored = floor(at.y);
            
            return interpolate(
                sampleX(vec3(at.x, floored - 1.0, at.z)),
                sampleX(vec3(at.x, floored, at.z)),
                sampleX(vec3(at.x, floored + 1.0, at.z)),
                sampleX(vec3(at.x, floored + 2.0, at.z)),
                at.y - floored);
        }


        float cubicNoise(vec3 at) {
            float floored = floor(at.z);
            
            return interpolate(
                sampleY(vec3(at.xy, floored - 1.0)),
                sampleY(vec3(at.xy, floored)),
                sampleY(vec3(at.xy, floored + 1.0)),
                sampleY(vec3(at.xy, floored + 2.0)),
                at.z - floored);
        }
        
        


        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);
            uv = uv * 20.;

            vec3 col = vec3(1.);


            vec3 X = vec3(uv, iTime);
            X = mat3(
                0.788675134594813, -0.211324865405187, -0.577350269189626,
                -0.211324865405187, 0.788675134594813, -0.577350269189626,
                0.577350269189626, 0.577350269189626, 0.577350269189626) * X;
            float n = cubicNoise(X);
           
            float c = smoothstep(0.4, 0.6, n) - smoothstep(0.45, 0.55, n);


            vec3 a = vec3(0.9, 0.8, 0.25);
            vec3 b = vec3(0.1, 0.5, 0.9);
            
            col = col * c*5.;//vec3(n > 0.5 ? a : b);
                

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}