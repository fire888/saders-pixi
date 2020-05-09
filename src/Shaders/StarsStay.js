
/*
https://www.shadertoy.com/view/3dXBR4

#define M_PI 3.14159265358979323846264338

vec3 Rainbow(vec2 uv, float zoomAmnt, float speed, vec2 startFinishSteps){
    
    float ratioRnbow = uv.x * 20.;
    float angleRnbow = uv.y * 6. * cos(1.1 * speed);
    vec3 rgbRnbow = cos(speed + ratioRnbow + angleRnbow + vec3(0., 1., 2.));
    
    
    float ratioStartStep = startFinishSteps.x;
    float ratioFinishStep = startFinishSteps.y;
    
    vec2 sStep = smoothstep(0., ratioStartStep * zoomAmnt, abs(uv));
	vec2 fStep = smoothstep(ratioFinishStep * zoomAmnt, ratioStartStep * zoomAmnt, abs(uv)); 
    
    float stepper = sStep.x * fStep.x + sStep.y * fStep.y;
    
    return stepper * rgbRnbow; 
}

float Hash21(vec2 p) {
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}

mat2 Rot(float a){
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}
vec3 Star(vec2 uv, float flare, float zoomAmnt, float rotSpeed){
    float d = length(uv);
    vec3 m = vec3(.04/d);
    
    
    vec3 rnb = Rainbow(uv, zoomAmnt, iTime + uv.x * uv.y, vec2(0.3, 0.55));
    float ray = max(0., 1. - abs(uv.x * uv.y * 400.));
    m += ray * (1. + rnb) * (abs(flare) + .4);
    
    uv *= Rot(M_PI / 4. + iTime * rotSpeed);
    ray = max(0., 1. - abs(uv.x * uv.y * 800.));
    m += ray * (.6 + .5 * rnb) * (abs(flare) + .4);
    
    m *= smoothstep(1., .2, d);
    
    return m;
}

vec3 starLayer(vec2 uv, float zoomAmnt, float index){
    
    vec3 col = vec3(0);
    vec2 gv = fract(uv) -.5;
    vec2 id = floor(uv);
    
    int y,x;
    
    for(y = -1; y <=1; y++){
        for(x = -1; x <=1; x++){
            vec2 offs = vec2(x,y);
            float r = Hash21(id + offs + index);
            float size = 1. - .5 * fract(r * 345.223);

            vec3 star = Star(gv - offs - vec2(r, fract(r* 34.)) + .5, sin(iTime * size) * r, zoomAmnt, (-.4 + fract(r * 1723.2)));
            
            
    		star *= sin(iTime * (.4 + r)) * .5 + .5; 
            col += star * size * (sin(iTime + index * 32.1) * .5 + .5);
        }
    }
    
    return col ;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    
    float zoomAmnt = 3.;
    uv *= zoomAmnt;

    vec3 col = vec3(0.);
	
    int k = 0;
    int AmnLayers = 6;
    for( k = 0; k < AmnLayers; k++){
        
        
    	col += starLayer(uv, zoomAmnt, float(k) / float(AmnLayers) * 3.);
    }
    
    

    //if(gv.x >.48 || gv.y > .48) col.r = 1.;
    
    // Output to screen
    fragColor = vec4(col,1.0);
    //fragColor = vec4(vec3(stepper), 1.0);
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
        uniform sampler2D iChannel0;


        #define M_PI 3.14159265358979323846264338

        
        vec3 Rainbow(vec2 uv, float zoomAmnt, float speed, vec2 startFinishSteps){
            
            float ratioRnbow = uv.x * 20.;
            float angleRnbow = uv.y * 6. * cos(1.1 * speed);
            vec3 rgbRnbow = cos(speed + ratioRnbow + angleRnbow + vec3(0., 1., 2.));
            
            
            float ratioStartStep = startFinishSteps.x;
            float ratioFinishStep = startFinishSteps.y;
            
            vec2 sStep = smoothstep(0., ratioStartStep * zoomAmnt, abs(uv));
            vec2 fStep = smoothstep(ratioFinishStep * zoomAmnt, ratioStartStep * zoomAmnt, abs(uv)); 
            
            float stepper = sStep.x * fStep.x + sStep.y * fStep.y;
            
            return stepper * rgbRnbow; 
        }
        
        float Hash21(vec2 p) {
            p = fract(p*vec2(123.34, 456.21));
            p += dot(p, p+45.32);
            return fract(p.x*p.y);
        }
        
        mat2 Rot(float a){
            float s=sin(a), c=cos(a);
            return mat2(c, -s, s, c);
        }
        vec3 Star(vec2 uv, float flare, float zoomAmnt, float rotSpeed){
            float d = length(uv);
            vec3 m = vec3(.04/d);
            
            
            vec3 rnb = Rainbow(uv, zoomAmnt, iTime + uv.x * uv.y, vec2(0.3, 0.55));
            float ray = max(0., 1. - abs(uv.x * uv.y * 400.));
            m += ray * (1. + rnb) * (abs(flare) + .4);
            
            uv *= Rot(M_PI / 4. + iTime * rotSpeed);
            ray = max(0., 1. - abs(uv.x * uv.y * 800.));
            m += ray * (.6 + .5 * rnb) * (abs(flare) + .4);
            
            m *= smoothstep(1., .2, d);
            
            return m;
        }
        
        vec3 starLayer(vec2 uv, float zoomAmnt, float index){
            
            vec3 col = vec3(0);
            vec2 gv = fract(uv) -.5;
            vec2 id = floor(uv);
            
            
            for(int y = -1; y <=1; y++){
                for(int x = -1; x <=1; x++){
                    vec2 offs = vec2(x,y);
                    float r = Hash21(id + offs + index);
                    float size = 1. - .5 * fract(r * 345.223);
        
                    vec3 star = Star(gv - offs - vec2(r, fract(r* 34.)) + .5, sin(iTime * size) * r, zoomAmnt, (-.4 + fract(r * 1723.2)));
                    
                    
                    star *= sin(iTime * (.4 + r)) * .5 + .5; 
                    col += star * size * (sin(iTime + index * 32.1) * .5 + .5);
                }
            }
            
            return col ;
        }
        


        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
            uv *= 1.;
    
            float t = iTime * 0.2;
                
            
            float zoomAmnt = 3.;
            uv *= zoomAmnt;
        
            vec3 col = vec3(0.);
            
            int AmnLayers = 6;
            for(int k = 0; k < 6; k++){
                col += starLayer(uv, zoomAmnt, float(k) / float(AmnLayers) * 3.);
            }
            
            
        
            //if(gv.x >.48 || gv.y > .48) col.r = 1.;
            
            // Output to screen
            //fragColor = vec4(col,1.0);
            //fragColor = vec4(vec3(stepper), 1.0);
            
            col += texture2D(iChannel0, uv * .4 + .5).rbg;

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}