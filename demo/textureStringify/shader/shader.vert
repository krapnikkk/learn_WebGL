precision mediump float;
uniform vec2 u_Resolution;
uniform float u_PointSize;
attribute vec2 a_Position;
varying vec2 v_Position;
void main() {
  // 把像素坐标转换到一个宽高总量为1的空间 （0,0）=>(1,0)
  vec2 zeroToOne = a_Position / u_Resolution;

  //空间坐标变成两倍【因为空间宽高维度的总和是2】
  vec2 zeroToTwo = zeroToOne * 2.0;

  // 转换为由-1到1的形式【宽高总量维度相交总和是2】
  vec2 clipSpace = zeroToTwo - 1.0;

  v_Position = zeroToOne; // 图像在1:1的空间的位置

  gl_PointSize = u_PointSize;

  //坐标原点转换
  gl_Position = vec4(clipSpace*vec2(1,-1), 0.0, 1.0);
}