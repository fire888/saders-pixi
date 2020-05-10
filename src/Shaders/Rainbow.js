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

        mat2 rotation(float angle) {
            float cosinus = cos(angle);
            float sinus = sin(angle);
            return mat2(cosinus, -sinus, sinus, cosinus);
        }


        float light(vec2 gv, float flare) {
            //dessiner une etoile
      
            //placer etoile au milieu
            float dist = length(gv);
              
            //dessiner un cercle avec ses tailles
            float cercle = .05/dist;
            
            
            // rendre le cercle en etoile (ligne verticale et horizontale de etoile)
            //le max afin deviter davoir 0 et avoir un rayonnement
            float rayon = max(0., 1.-abs(gv.y*gv.x*1000.));
                
            cercle += rayon * flare;
            
            gv *= rotation(PI/4.);
            
            rayon = max(0., 1.-abs(gv.x*gv.y*1000.));
            cercle += rayon*.3*flare;
            cercle *= smoothstep(1., .2, dist);
              
            return cercle;
        }


        float hash(vec2 p) {
            p = fract(p*vec2(123.34, 456.21));
            p += dot(p, p+45.32);
            return fract(p.x*p.y);
        }



        void main () {        
            float t = iTime*.08;
            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
            uv *= 1.;
    
            vec3 col = vec3(0);

            float size = mix(1., 0., 1.-uv.y);
            
            for (float i=0.; i<1.; i+=1./2.) { 
                
                vec3 col2 = vec3(0);
                float scale = 30.;//mix(10., .2, fract(i));
                vec2 gv = fract(uv*scale)-.5;
                vec2 id = floor(uv*scale);
                float e;
                
                
                for(int y=-1; y<=1; y++)
                for(int x=-1;x<=1;x++) {
                      
                    vec2 offs = vec2(x, y);
                    offs.y + t;
                    float n = hash(id+offs);
                    // float size = fract(n*345.32) * (uv.y / 2.5);
                      
                    vec3 color = sin(vec3(.2, .3, .9)*fract(n*2345.2)*123.2)*.5+.5;
                    color = color*vec3(1,.25,1.+size)+vec3(.2, .2, .1)*2.;
                      
                    float e = light(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.85, 1., size));
                    col2+= e*size*color;   
                }
                col += col2;
           }

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}