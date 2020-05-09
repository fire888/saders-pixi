/* VORONOI

https://www.shadertoy.com/view/WsXBz2

vec2 hash( vec2 x )  // replace this by something better
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
} ////////////////
float rand(ivec2 co){
 return fract(sin(dot(vec2(co.x,co.y), vec2(12.9898,78.233))) * 43758.5453);
} ////////////////
float voronoi( vec2 x )
{
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
} //////
vec3 voronoiTexture( vec2 x )
{
    float rati=iMouse.x/20.;
    vec2 per=x*rati;
    ivec2 p = ivec2(floor( per ).x,floor( per ).y);
    vec2  f = fract( per );

    ivec2 minxy;
    float res = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        ivec2 b = ivec2( i, j );
        vec2  r = vec2( b )- f  + rand(  p+b  );
        float d = dot( r, r );
        if(d<=res){
            res=d;
            minxy= p+b;
        }
        else if(d==res){
            //return (texture(iChannel0,minxy/rati).rgb+texture(iChannel0,vec2(b)/rati).rgb)/2.0;
            return vec3(1.,0.,0.);
       }
    }
    return texture(iChannel0,vec2(minxy)/rati).rgb;
}//////////////////////////////
float smoothVoronoi( in vec2 x )
{
    ivec2 p = ivec2(floor( x ).x,floor( x ).y);
    vec2  f = fract( x );
    float falloff =64.0;
    falloff*=iMouse.y/iResolution.y;
    float res = 0.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        ivec2 b = ivec2( i, j );
        vec2  r = vec2( b ) - f + rand(  p+b  );
        float d = length( r );

        res += exp( -falloff*d );
    }
    return -(1.0/falloff)*log( res );
}
// -----------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = fragCoord.xy / iResolution.xy;

	vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);
	
	float f = 0.0;
    // left: noise	
	if( p.x<0.6 )
	{
        //show the cellular effect
        fragColor = vec4( voronoiTexture(uv), 1.0 );
        
        //show the voronoiNosie
		//f = smoothVoronoi( iMouse.x/50.*uv );
       // fragColor = vec4( f, f, f, 1.0 );
	}
    // right: fractal noise (4 octaves)
    else	
	{
		uv *= 8.0;
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
		f  = 0.5000*voronoi( uv ); uv = m*uv;
		f += 0.2500*voronoi( uv ); uv = m*uv;
		f += 0.1250*voronoi( uv ); uv = m*uv;
		f += 0.0625*voronoi( uv ); uv = m*uv;
	    f *= smoothstep( 0.0, 0.005, abs(p.x-0.6) );	
		fragColor = vec4( f, f, f, 1.0 );
	}

	//f = 0.5 + 0.5*f;
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
}