attribute vec2 a_Position;
attribute vec3 a_Color;
attribute vec2 a_Offset;

varying vec3 v_Color;

void main() {
  gl_Position = vec4(a_Position + a_Offset,0.0,1.0);
  v_Color = a_Color;
}