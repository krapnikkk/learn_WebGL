precision mediump float;
attribute vec2 a_Position;
attribute vec4 a_Color;
attribute float a_Size;
uniform vec2 u_Resolution;

varying vec4 v_Color;
varying float v_Size;

void main() {
  vec2 zeroToOne = a_Position / u_Resolution;

  vec2 zeroToTwo = zeroToOne * 2.0;

  vec2 clipSpace = zeroToTwo - 1.0;
  gl_PointSize = a_Size;
  v_Color = a_Color;
  v_Size = a_Size;
  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}