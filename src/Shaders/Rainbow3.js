export const Shader = { fragmentShader: `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float iTime;
uniform vec2 iResolution;


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


float multiVoronoi(vec2 pos, float time) {
    float f = 0.0;	
    pos *= 8.;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

    f  = 0.5000*voronoi( vec2(pos.x + sin(iTime*2.), pos.y + cos(iTime* 2.))); 
    pos = m * pos + vec2(sin(iTime * 1.8), cos(iTime * 1.7));
    f += 0.2500*voronoi( pos ); 
    pos = m*pos;
    f += 0.1250*voronoi( pos ); 

    return f;
}



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



void main () {
    float t =iTime*0.5;
    float ratio = iResolution.x/iResolution.y;   
    vec2 uv = vec2(ratio * vTextureCoord.x -.5, vTextureCoord.y  -.5);      

    uv.y -= 1./3.;


    vec3 col;
    
    float tFade= min( max(sin(t*3. + .1), sin(t*3. - .1)) + 1., 1.);   
    float offsetY = 0.;
    float offsetX = .08;
    float addToX = .3;
    
    for (int i = 0; i < 20; i++) {
        offsetY += .05;
        addToX += .6434;
        offsetX += sin(fract((offsetX + addToX) * 123.45) * 234.45) * .07;
        float star_size = max((uv.y +.7) * 1.7 * tFade, 0.);
        vec3 star_color = vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity;
        col += draw_star(
                vec2(uv.x + offsetX, fract((uv.y + offsetY) + t)), 
                star_color, star_size
            );
    }

    col *= smoothstep(.08, 0.04, uv.y); 
    col *= smoothstep(.65, .6, uv.x) * smoothstep(-.37, -.3, uv.x); 



    col *= multiVoronoi(uv, t);


    gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
}`,
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
}