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


        float DistLine(vec2 p, vec2 a, vec2 b) {
            vec2 pa = p-a;
            vec2 ba = b-a;
            float t = clamp(dot(pa, ba)/dot(ba, ba), 0., 1.);
            return length(pa - ba*t);
        }


        float N21(in vec2 p) {
              p = fract(p*vec2(233.34, 851.73));
              p += dot(p, p+23.45);
              return fract(p.x*p.y);
        }


        vec2 N22(vec2 p) {
            float n = N21(p);
            return vec2(n, N21(p+n));
        }


        vec2 GetPos(vec2 id, vec2 offs) {
            vec2 n = N22(id+offs)*iTime;
            return offs+sin(n)*.4;
        }


        float Line(vec2 p, vec2 a, vec2 b) {
            float d = DistLine(p, a, b);
            float m = S(.03, .01, d);
            m *= S(1.4, 0.1, length(a-b));
            return m;
        } 


        void main () {            
            vec2 uv = vec2(iResolution.x/iResolution.y * vTextureCoord.x, vTextureCoord.y);
            uv = uv * 10.;

            float m = 0.;

            vec2 gv = fract(uv)-.5; 

            vec2 id = floor(uv); 

            vec2 a0 = vec2(0.);
            vec2 a1 = vec2(0.);
            vec2 a2 = vec2(0.);
            vec2 a3 = vec2(0.);
            vec2 a4 = vec2(0.);
            vec2 a5 = vec2(0.);
            vec2 a6 = vec2(0.);
            vec2 a7 = vec2(0.);
            vec2 a8 = vec2(0.);

            int i = 0;
            vec2 j = vec2(0.);

            float t = iTime * 10.;

            for(float y=-1.; y<=1.; y++) {
                for(float x=-1.; x<=1.; x++) {
                    if (i==0) { 
                        a0 = GetPos(id, vec2(x, y));
                        j = (a0-gv)*25.;
                    } 

                    if (i==1) { 
                        a1 = GetPos(id, vec2(x, y));
                        j = (a1-gv)*25.;
                    }
                    if (i==2) { 
                        a2 = GetPos(id, vec2(x, y));
                        j = (a2-gv)*25.;
                    }
                    if (i==3) { 
                        a3 = GetPos(id, vec2(x, y));
                        j = (a3-gv)*25.;
                    }
                    if (i==4) { 
                        a4 = GetPos(id, vec2(x, y));
                        j = (a4-gv)*25.;
                    }
                    if (i==5) { 
                        a5 = GetPos(id, vec2(x, y));
                        j = (a5-gv)*25.;
                    }
                    if (i==6) { 
                        a6 = GetPos(id, vec2(x, y));
                        j = (a6-gv)*25.;
                    }
                    if (i==7) { 
                        a7 = GetPos(id, vec2(x, y));
                        j = (a7-gv)*25.;
                    }
                    if (i==8) { 
                        a8 = GetPos(id, vec2(x, y));
                        j = (a8-gv)*25.;
                    }

                    m += 1./dot(j, j) * (sin(t) + 1.);
                    i++;
                }
            }

            m += Line(gv, a4, a0);
            m += Line(gv, a4, a1);
            m += Line(gv, a4, a2);
            m += Line(gv, a4, a3);
            m += Line(gv, a4, a4);
            m += Line(gv, a4, a5);
            m += Line(gv, a4, a6);
            m += Line(gv, a4, a7);
            m += Line(gv, a4, a8);

            m += Line(gv, a1, a3);
            m += Line(gv, a1, a5);
            m += Line(gv, a7, a3);
            m += Line(gv, a7, a5);


            vec3 col = vec3(m);


            //if (gv.x>.48 || gv.y>.48) col = vec3(1., 0., 0.);

            gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(col, 1.);
        }`
}

// float d = DistLine(uv, vec2(0.5), vec2(0.7));
// float m = S(.05, .01, d);