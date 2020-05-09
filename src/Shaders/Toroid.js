export const Shader = {
    uniforms: {
        'iTime': Math.random()* 10,
        'iResolution': [window.innerWidth, window.innerHeight],
    },
    fragmentShader: `
        #define S(a, b, t) smoothstep(a, b, t);

        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float iTime;
        uniform vec2 iResolution;


        void main () {            
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x, vTextureCoord.y) - .5;

            vec3 col = vec3(0.);

            vec3 ro = vec3(0., 8, -8.);
            vec3 lookAt = vec3(0.);
            float zoom = 1.;

            vec3 f = normalize(lookAt - ro),
                 r = normalize(cross(vec3(0., 1., 0.), f)),
                 u = cross(f, r),
                 rd = normalize( uv.x*r.x + uv.y*u + 1.8*f);
            col -= 0.7*rd.y; 

            float dS, dO;
            vec3 p;

            for (int i=0; i<50; i++) {
                p = ro + rd * dO;
                dS = (length(vec2(length(p.xz) - 1., p.y) -0.01));
                if (dS < 0.5) break; 
                dO += dS;
            }

            if (dS<.5) {
                float x = atan(p.x, p.z);
                float y = atan(length(p.xz)-1., p.y);
                float bands = sin(y * 10. + (20.*x+iTime*5.));

                float ripples = sin((x*10.-(y*30. + iTime*5.))) * 3. + .5;

                float b1 = smoothstep(-.2, .2, bands);
                float b2 = smoothstep(-.2, .2, bands-.5);

                float m = b1 * (1.-b2);

                col += max(ripples, m);
            }

            //if (gv.x>.48 || gv.y>.48) col = vec3(1., 0., 0.);

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}

// float d = DistLine(uv, vec2(0.5), vec2(0.7));
// float m = S(.05, .01, d);