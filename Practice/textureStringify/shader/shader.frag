precision mediump float;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform vec2 u_Resolution;
uniform vec3 u_Color;
uniform float u_Len; // 纹理宽度
uniform int u_Type;
varying vec2 v_Position;
void main() {
  vec4 color = texture2D(u_Sampler0, v_Position); // 图片采样点颜色【单位空间】 

  // 将片元坐标转换至st坐标 t方向与y轴方向相反
  vec2 px_texCoord = vec2(gl_FragCoord.x, u_Resolution.y - gl_FragCoord.y) / u_Resolution;


  vec4 px_color = texture2D(u_Sampler0, px_texCoord);//图片像素映射点颜色

  float s = 1.0 / u_Len; // 一个字在文字纹理的宽度【st坐标宽高为1】
  float gray = (color.r + color.g + color.b) / 3.0; // 计算color的灰度
  float p = floor((1.0 - gray) / s) * s; // * u_Len / u_Len 取得文字在纹理中的位置


  vec4 text_color =
      texture2D(u_Sampler1, vec2((gl_PointCoord.x / u_Len) + p, gl_PointCoord.y));

  float alpha = text_color.a;

  if (u_Type == 1) {
    text_color = (vec4(1.0) - text_color) * vec4(u_Color.rgb, 1.0);
    text_color.a = alpha;
  }

  if (u_Type == 2) {
    text_color = vec4(color.rgb, alpha);
  }

  if (u_Type == 3) {
    text_color = vec4(px_color.rgb, alpha);
  }

  gl_FragColor = text_color;
}