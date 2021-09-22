precision mediump float;
varying vec4 v_Color;

int findMax(float r, float g, float b) {
  if (r > g && r > b) {
    return 0;
  }
  if (g > r && g > b) {
    return 1;
  }
  return 2;
}

void main() {
  float red = v_Color.r;
  float green = v_Color.g;
  float blue = v_Color.b;
  int max = findMax(red, green, blue);
  vec4 finalColor = v_Color;
  if (max == 0) {
    finalColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else if (max == 1) {
    finalColor = vec4(0.0, 1.0, 0.0, 1.0);
  } else if (max == 2) {
    finalColor = vec4(0.0, 0.0, 1.0, 1.0);
  }
  gl_FragColor = finalColor;
}