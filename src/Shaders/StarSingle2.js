/*

https://www.shadertoy.com/view/4tVGzV



float star_luminosity = 5.0;
vec2 FragCoord;

vec3 draw_star(vec2 pos, vec3 star_col) {
	pos -= FragCoord.xy / iResolution.x; 
	float d = length(pos) * 50.0;
	vec3 col, spectrum = star_col;
	col = spectrum / (d * d * d);
	
	// produce spikes
	d = length(pos * vec2(10., .2)) * 50.0;
	col += spectrum / (d * d * d);
	d = length(pos * vec2(.2, 10.)) * 50.0;
	col += spectrum / (d * d * d);

	return col;
}

// --- main -----------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec3 col;
	FragCoord=fragCoord;
    
    vec3 star_color = vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity;
	col = draw_star(vec2(.5,.3), star_color);
	
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


        float star_luminosity = 5.0;

        vec3 draw_star(vec2 pos, vec3 star_col) {
            // pos -= FragCoord.xy / iResolution.x; 
            
	        float d = length(pos) * 50.0;
	        vec3 col, spectrum = star_col;
	        col = spectrum / (d * d * d);
	
	        // produce spikes
	        d = length(pos * vec2(10., .2)) * 50.0;
	        col += spectrum / (d * d * d);
	        d = length(pos * vec2(.2, 10.)) * 50.0;
	        col += spectrum / (d * d * d);

	        return col;
        }



        void main () {            
            float ratio = iResolution.x/iResolution.y;   
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x -.5 * ratio, vTextureCoord.y -.5);        
            uv *= 1.;


            vec3 col;
            //FragCoord=fragCoord;
            
            vec3 star_color = vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity;
            col = draw_star(uv, star_color);





            //vec3 col = vec3(.5);
    
            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}