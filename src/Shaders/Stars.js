/*

https://www.shadertoy.com/view/tdlfW4


#define PI 3.1415

mat2 rotation(float angle){
    
   float cosinus = cos(angle);
   float sinus =sin(angle);
    return mat2(cosinus, -sinus, sinus, cosinus);
    
}

float etoile(vec2 gv, float flare) {

    //dessiner une etoile
      
      //placer etoile au milieu
      float dist = length(gv);
      
      //dessiner un cercle avec ses tailles
      float cercle = .05/dist;
    
    
      // rendre le cercle en etoile (ligne verticale et horizontale de etoile)
        //le max afin deviter davoir 0 et avoir un rayonnement
        float rayon =max(0., 1.-abs(gv.y*gv.x*1000.));
        
        //ajouter un rayonement
        cercle += rayon*flare;
    
        //ajouter les autres rayons 
        gv *= rotation(PI/4.);
    
        rayon = max(0., 1.-abs(gv.x*gv.y*1000.));
        cercle += rayon*.3*flare;
        cercle *= smoothstep(1., .2, dist);
      
    return cercle;
}

//fonction de hashage
float hash(vec2 p) {
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy)/iResolution.y;
    
    //clic et changement de la direction des etoiles
	vec2 clic = (iMouse.xy-iResolution.xy*.5)/iResolution.y;

    //zoomer
     uv *= 1.;
    
    vec3 col = vec3(0);
    float t = iTime*.02;
        
    //definition de l'orientation des etoile
    uv *= rotation(t);
    
    //changement de direction
    uv += clic*4.;
    
    //les couches d'etoiles
    for(float i=0.; i<1.; i+=1./2.){ 
        
        vec3 col2 = vec3(0);
        float scale = mix(20., .2, fract(i+t));
        vec2 gv = fract(uv*scale-clic)-.5;
        vec2 id = floor(uv*scale-clic);
        float e;
        
       for(int y=-1;y<=1;y++) {
          for(int x=-1;x<=1;x++) {
              
              //offs afin de ne pas avoir chaque etoile dans un box
              vec2 offs = vec2(x, y);
              float n = hash(id+offs);
              float taille = fract(n*345.32);
              
              //à fin davoir plusieurs couleurs on applique cette combinaison de fonction
              vec3 couleur = sin(vec3(.2, .3, .9)*fract(n*2345.2)*123.2)*.5+.5;
              couleur = couleur*vec3(1,.25,1.+taille)+vec3(.2, .2, .1)*2.;
              
              //construction de etoile et son affichage 
              float e = etoile(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.85, 1., taille));
              col2+= e*taille*couleur;
          }
           
        }
        col += col2;
   }
    
        
       
    
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

        mat2 rotation(float angle) {
            float cosinus = cos(angle);
            float sinus =sin(angle);
            return mat2(cosinus, -sinus, sinus, cosinus);
        }


        float etoile(vec2 gv, float flare) {
            //dessiner une etoile
      
            //placer etoile au milieu
            float dist = length(gv);
              
            //dessiner un cercle avec ses tailles
            float cercle = .05/dist;
            
            
            // rendre le cercle en etoile (ligne verticale et horizontale de etoile)
            //le max afin deviter davoir 0 et avoir un rayonnement
            float rayon =max(0., 1.-abs(gv.y*gv.x*1000.));
                
            //ajouter un rayonement
            cercle += rayon*flare;
            
            //ajouter les autres rayons 
            gv *= rotation(PI/4.);
            
            rayon = max(0., 1.-abs(gv.x*gv.y*1000.));
            cercle += rayon*.3*flare;
            cercle *= smoothstep(1., .2, dist);
              
            return cercle;
        }


        //fonction de hashage
        float hash(vec2 p) {
            p = fract(p*vec2(123.34, 456.21));
            p += dot(p, p+45.32);
            return fract(p.x*p.y);
        }



        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
            uv *= 1.;
    
            vec3 col = vec3(0);
            float t = iTime*.02;
                
            uv *= rotation(t);
            
            
            for (float i=0.; i<1.; i+=1./2.) { 
                
                vec3 col2 = vec3(0);
                float scale = mix(20., .2, fract(i+t));
                vec2 gv = fract(uv*scale)-.5;
                vec2 id = floor(uv*scale);
                float e;
                
                for(int y=-1; y<=1; y++)
                for(int x=-1;x<=1;x++) {
                      
                    //offs afin de ne pas avoir chaque etoile dans un box
                    vec2 offs = vec2(x, y);
                    float n = hash(id+offs);
                    float taille = fract(n*345.32);
                      
                    //à fin davoir plusieurs couleurs on applique cette combinaison de fonction
                    vec3 couleur = sin(vec3(.2, .3, .9)*fract(n*2345.2)*123.2)*.5+.5;
                    couleur = couleur*vec3(1,.25,1.+taille)+vec3(.2, .2, .1)*2.;
                      
                    //construction de etoile et son affichage 
                    float e = etoile(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.85, 1., taille));
                    col2+= e*taille*couleur;   
                }
                col += col2;
           }

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}