precision mediump float;
uniform vec2 u_Resolution;
varying float v_Size;
varying vec3 v_color;


void main(){
    vec2 st = gl_PointCoord.xy/vec2(1.0);
    vec2 st1 = gl_PointCoord.xy/u_Resolution;
    float r = v_Size/80.0;
    float pct = distance(st,vec2(0.5));
    if(pct>0.5){
        discard;
    }
    vec3 mask = vec3(pct);
    gl_FragColor = vec4(
        vec3(gl_PointCoord.x)-2.0*mask+vec3(st1.y,st1.x,0.0),
        1.0-2.0*pct);
}