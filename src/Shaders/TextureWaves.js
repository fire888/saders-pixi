
/*
https://www.shadertoy.com/view/tssBz8

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    float speed = .21 * (iTime * 0.0005);
    float scale = 0.0075;
    fragCoord.x = abs(fragCoord.x * 0.5);
    fragCoord.y = abs(fragCoord.y);
    vec2 p = fragCoord * scale; 
    for(int i=1; i<11; i++){
        p.x+=(sin( .55)) * .55/float(i)*sin(float(i)*1.5*p.y+iTime*speed)+ (iTime * 69.)/1000.;
        p.y+=(sin( 0.25)) * 0.75/float(i)*cos(float(i)*5.*p.x+iTime*speed)+(iTime * .69)/1000.;
    }
    float r=cos(p.x+p.y+.025)*.009 + .003;
    float g=cos(p.x+p.y+1.)*.55+.5;
    float b=(cos(p.x * 1. +p.y)+cos(p.x+(p.y)))*.1+.28;
    vec3 color = vec3(r * .5,g,b) /3.;
    
    color += texture(iChannel0, p * .5 - iTime * .0012).rbg;
    
    color -= .85;
    fragColor = vec4(sqrt(color + 0.09) * 1.5566,1);
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


        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
    
            float t = iTime * 0.2;


            float speed = .21 * (iTime * 0.0005);
            float scale = 3.5;
            uv.x = uv.x  * 0.5;
            uv.y = uv.y;
            vec2 p = uv * scale; 
            for(int i=1; i<11; i++){
                p.x+=(sin( .55)) * .55/float(i)*sin(float(i)*1.5*p.y+iTime*speed)+ (iTime * 69.)/1000.;
                p.y+=(sin( 0.25)) * 0.75/float(i)*cos(float(i)*5.*p.x+iTime*speed)+(iTime * .69)/1000.;
            }
            float r=cos(p.x+p.y+.025)*.009 + .003;
            float g=cos(p.x+p.y+1.)*.55+.5;
            float b=(cos(p.x * 1. +p.y)+cos(p.x+(p.y)))*.1+.28;
            vec3 color = vec3(r * .5,g,b);
    
            color += texture2D(iChannel0, (p*5. + .5)  - iTime * .0012).rbg;
    
            //color -= .85;
            //gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(color, 1.) + vec4(sqrt(color + 0.09) * 1.5566, 1);
                
        
            
            //col += texture2D(iChannel0, pz * .4 + .5).rbg;

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(color, 1.);
        }`
}