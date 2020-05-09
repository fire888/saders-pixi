/*
float rand(vec2 r)
{
	r = fract(r * vec2(123.34, 456.21));
    r += dot(r, r+45.32);
    return fract(r.x * r.y);
}

mat2 rotate(float theta)
{
	float s = sin(theta);
    float c = cos(theta);
    
    return mat2(c, -s, s, c);
}

float star(vec2 uv, float flares)
{
    float d = length(uv);
    float m = 0.05/d;
    
    float rays = max(0., 1.-abs(uv.x * uv.y * 1000.));    
    m += rays * flares;
    
    uv *= rotate(3.1415/4.);
    float rotated_rays = max(0., 1.-abs(uv.x * uv.y * 1000.));
    m += rotated_rays * 0.3 * flares;
    
    m *= smoothstep(1., 0.2, d);
    
    return m;
}

vec3 starLayer(vec2 uv, int quality)
{
	vec2 luv = fract(uv) - 0.5;
    vec2 lid = floor (uv);
    
    vec3 col = vec3(0.);
    
    for(int y = -1*quality; y <= 1*quality; y++)
    {
    	for(int x = -1*quality; x <= 1*quality; x++)
        {
            vec2 offsets = vec2(x,y);
            
        	float n1 = rand(lid + offsets);
            float n2 = fract(n1 * 34.);
            float size = fract(n1 * 345.32);
            
            float star = star(luv - offsets - vec2(n1, n2) + 0.5, smoothstep(0.9, 1., size)*0.6);
            
            float n3 = fract(n1 * 412.124);
            vec3 colour = sin(vec3(0.2, 0.3, 0.9) * n3 * 123.2) * .5 + .5;
            colour *= vec3(0.8, .025, 1.+size);
            
            star *= sin(iTime * 3. + n1 * 6.283)*0.5+1.;
            
            col += star * size * colour * 0.75;
        }
    }
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -0.5 to 0.5)
    vec2 uv = (fragCoord - 0.5 * iResolution.xy)/iResolution.y;
    
    //Parameters for adjusting quality of simulation with performance on GPU.
    float NUM_LAYERS = 5.;
    int QUALITY = 3;
    
    float t = iTime * 0.05;
    //float t = 0.;
    
    uv *= rotate(t);
    
    vec3 col = vec3(0.);
    
    for(float i = 0.; i < 1.; i += 1./NUM_LAYERS)
    {
        float depth = fract(i+t);
        float scale = mix(20., 0.5, depth);
        float fade = depth * smoothstep(1., 0.9, depth);
    	col += starLayer(uv*scale+i*453.2, QUALITY)*fade;
    }
    
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


        #define PI 3.1415
        #define QUALITY 1

    
        float rand(vec2 r)
        {
            r = fract(r * vec2(123.34, 456.21));
            r += dot(r, r+45.32);
            return fract(r.x * r.y);
        }
        
        mat2 rotate(float theta)
        {
            float s = sin(theta);
            float c = cos(theta);
            
            return mat2(c, -s, s, c);
        }
        
        

        float star(vec2 uv, float flares)
        {
            float d = length(uv);
            float m = 0.05/d;
            
            float rays = max(0., 1.-abs(uv.x * uv.y * 1000.));    
            m += rays * flares;
            
            uv *= rotate(3.1415/4.);
            float rotated_rays = max(0., 1.-abs(uv.x * uv.y * 1000.));
            m += rotated_rays * 0.3 * flares;
            
            m *= smoothstep(1., 0.2, d);
            
            return m;
        }

        
        
        vec3 starLayer(vec2 uv, int quality)
        {
            vec2 luv = fract(uv) - 0.5;
            vec2 lid = floor (uv);
            
            vec3 col = vec3(0.);

            for(int y = -1 * QUALITY; y <= QUALITY; y++)
            {
                for(int x = -1 * QUALITY; x <= QUALITY; x++)
                {
                    vec2 offsets = vec2(x,y);
                    
                    float n1 = rand(lid + offsets);
                    float n2 = fract(n1 * 34.);
                    float size = fract(n1 * 345.32);
                    
                    float star = star(luv - offsets - vec2(n1, n2) + 0.5, smoothstep(0.7, 1.2, size)*0.8);
                    
                    float n3 = fract(n1 * 412.124);
                    vec3 colour = sin(vec3(0.2, 0.3, 0.9) * n3 * 123.2) * .5 + .5;
                    colour *= vec3(0.8, .025, 1.+size);
                    
                    star *= sin(iTime * 3. + n1 * 6.283)*0.5+1.;
                    
                    col += star * size * colour * 0.75;
                }
            }
            
            return col;

            //return vec3(.5);
        }




        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
            uv *= 1.;
    
            vec3 col = vec3(0.);
            float t = iTime * 0.2;
                
            
            //Parameters for adjusting quality of simulation with performance on GPU.
            float NUM_LAYERS = 5.;

            
            uv *= rotate(t);
            
            for(float i=0.; i<1.; i+=1./2.)
            {
                float depth = fract(i+t);
                float scale = mix(20., 0.5, depth);
                float fade = depth * smoothstep(1., 0.9, depth);
                col += starLayer(uv*scale+i*453.2, QUALITY)*fade;
            }
            

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}


