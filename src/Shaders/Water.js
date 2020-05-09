// https://www.shadertoy.com/results?query=&sort=newest&from=24&num=12

/* SINUSOID
https://www.shadertoy.com/view/3dsBzl
float plot (vec2 st, float pct){
  return  smoothstep( pct-0.1, pct, st.y) - smoothstep( pct, pct+0.1, st.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord / iResolution.y);
    
    float fn = 0.5 + 0.5* sin(iTime) * sin(8.0*iTime)* sin(uv.x*55.0);
    float col = plot(uv, fn );
    fragColor = vec4( 0.0, 1.0 - col, 0.0 , 1.0 );
}
*/



/* CIRCLE

https://www.shadertoy.com/view/WdsBzB

#define pi 3.14159

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy) / iResolution.y+0.5;
    float a = atan(uv.x - 0.5, -uv.y + 0.5);
    
    float d = distance((uv),vec2(0.5));
    d = d + 0.12 * cos(a*10.0+iTime*1.5) * cos(a*5.0-iTime*1.5) * pow(a/(2.0*pi),2.0);    
    
    vec3 col = vec3(smoothstep(d,d+0.005,0.3) - smoothstep(d,d+0.005,0.28));

    fragColor = vec4(col,1.0);
}*/



export const Shader = {
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
    fragmentShader: `
        #define pi 3.14159

        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float iTime;
        uniform vec2 iResolution;



        // VORONOI ///////////////////

        float rand(ivec2 co){
            return fract(sin(dot(vec2(co.x,co.y), vec2(12.9898,78.233))) * 43758.5453);
        }

        float voronoi( vec2 x ) {
            ivec2 p = ivec2(floor( x ).x,floor( x ).y);
            vec2  f = fract( x );

            int minx;
            int miny;
            float res = 8.0;
            for( int j=-1; j<=1; j++ )
            for( int i=-1; i<=1; i++ )
            {
                ivec2 b = ivec2( i, j );
                vec2  r = vec2( b )- f  + rand(  p+b  );
                float d = dot( r, r );

                res = min( res, d );
            }
            return sqrt( res );
        }

        float VoronoiCust (vec2 st) {
            vec2 pV = st * 10.;
            float f = 0.0;	
            mat2 m = mat2( 1.6,  1.2, -1.2,  2.6 );
            f = 0.5000*voronoi( vec2(pV.x + sin(iTime), pV.y + cos(iTime))); pV = m*pV;
            f += .200*voronoi( vec2(pV.x + sin(iTime * 0.2), pV.y + cos(iTime * 1.2)) ); pV = m*pV;
            f += .2250*voronoi(  vec2(pV.x + sin(iTime * 0.8), pV.y + cos(iTime * 0.7))  ); pV = m*pV;
            f += 0.0625*voronoi( pV ); pV = m*pV;
            return f;
        }





        // PLOTS ///////////////////////

        float plotY (vec2 st, float pct, float w, float sm) {
            return smoothstep(pct-sm, pct, st.y+w) - smoothstep(pct, pct+sm, st.y-w);
        }

        float plotX (vec2 st, float pct, float  w, float sm) {
            return smoothstep(pct-sm, pct, st.x+w) - smoothstep(pct, pct+sm, st.x-w); 
        }
        
        float Plots (vec2 st) {
            float w = 0.001;
            float sm = 0.07;
            
            float fn1 = 0.2 *  sin(iTime* 0.8) * sin(iTime) * sin(st.x*30.);
            float lY = plotY(st, fn1, w, sm);
            float fn2 = 0.2 * sin(iTime* 0.8) * sin(iTime) * sin(st.y*30.);
            float lX = plotX(st, fn2, w, sm);
            return max(lX, lY);
        }



        // CIRCLE

        float Circle(vec2 st) {
            float a = atan(st.x, st.y);
            float d = distance((st),vec2(0.));
            d = d + 0.8 * cos(a*10.0+iTime) * cos(a*5.0-iTime) * pow(a/(2.0*pi),2.0);
            return smoothstep(d, d+0.01, 0.35) - smoothstep(d, d+0.01, 0.21);
        }


        // HASH
        float Hash21 (vec2 p) {
            p = fract(p * vec2(234.45, 435.245));
            p += dot(p, p + 34.34);
            return fract(p.x * p.y);
        }



        void main () {
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);

            vec2 p = uv;

            float c = 0.;
            
            float plots = Plots(p);
            c += plots;

            float cir = Circle(uv);
            c = max(c, cir);

            float vor = VoronoiCust(uv);
            c = c * vor;            
            
            vec3 col = vec3(c * .1, c, c * 2.); //* Hash21(p * sin(iTime));

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}


/*

*/
/*
        float rand(ivec2 co){
            return fract(sin(dot(vec2(co.x,co.y), vec2(12.9898,78.233))) * 43758.5453);
        }

        float voronoi( vec2 x ) {
            ivec2 p = ivec2(floor( x ).x,floor( x ).y);
            vec2  f = fract( x );

            int minx;
            int miny;
            float res = 8.0;
            for( int j=-1; j<=1; j++ )
            for( int i=-1; i<=1; i++ )
            {
                ivec2 b = ivec2( i, j );
                vec2  r = vec2( b )- f  + rand(  p+b  );
                float d = dot( r, r );

                res = min( res, d );
            }
            return sqrt( res );
        }

        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);

            vec3 col = vec3(0.1);
                
            float f = 0.0;	
            uv *= 8.0;
            mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
            f  = 0.5000*voronoi( vec2(uv.x + sin(iTime), uv.y + cos(iTime))); uv = m*uv;
            f += 0.2500*voronoi( vec2(uv.x + sin(iTime * 0.8), uv.y + cos(iTime * 0.7)) ); uv = m*uv;
            f += 0.1250*voronoi( uv ); uv = m*uv;
            //f += 0.0625*voronoi( uv ); uv = m*uv;
            col = col + f;

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
*/
