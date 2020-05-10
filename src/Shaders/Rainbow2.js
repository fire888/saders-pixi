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

        vec3 draw_star(vec2 pos, vec3 star_col, float size) { 
            pos.y -=.5;
            
	        float d = length(vec2(pos.x, pos.y)) * 10.0/ size;
	        
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


        float hash(vec2 p) {
            p = fract(p*vec2(123.34, 456.21));
            p += dot(p, p+45.32);
            return fract(p.x*p.y);
        }


        void main () {
            float t =iTime*0.5;
            float ratio = iResolution.x/iResolution.y;   
            //vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x - 1., vTextureCoord.y -.5);    
            vec2 uv = vec2(vTextureCoord.x - .5, vTextureCoord.y -.5);   
            uv *= 1.;
            
            uv.y -= 1./3.;


            vec3 col;
            
            float offsetY = 0.;
            float offsetX = .001;
            
            
            for (int i = 0; i < 20; i++) {
                offsetY += .05;
                offsetX += sin(765.75 * (offsetX)) * 0.1;
                float star_size = (uv.y +.7) * .3;
                vec3 star_color = vec3(abs(sin(iTime)), 0.2, abs(cos(iTime))) * star_luminosity;
                col += draw_star(
                        vec2(uv.x + offsetX -.1, fract((uv.y + offsetY)  + t)), 
                        star_color, star_size
                    );
            }




            //vec3 col = vec3(.5);
    
            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}