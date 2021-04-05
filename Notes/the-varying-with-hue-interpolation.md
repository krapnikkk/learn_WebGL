# the-varying-with-hue-interpolation [限定存储符与颜色插值]

## glsl中定义varying变量
顶点着色器
```
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main(){
    gl_Position = a_Position;
    v_Color = a_Color; # 通过attribute进行赋值
}
```
片元着色器
```
precision mediump float;
varying vec4 v_Color; # 内插得到的颜色被赋给v_Color
void main(){
    gl_FragColor = v_Color; # 再被赋给gl_FragColor
}
```

## gl.vertexAttribPointer向attribute赋值
前略创建WebGL程序
```
let verticesColors = new Float32Array([
    // 顶点坐标(x,y)和颜色(r,g,b)
    0.0,0.5,1.0,0.0,0.0,
    -0.5,-0.5,0.0,1.0,0.0,
    0.5,0.5,0.0,0.0,1.0
]);
let FSIZE = verticesColors.BYTES_PER_ELEMENT;
let verticesColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,verticesColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);

let a_Position = gl.getAttribLocation(program,"a_Position");
gl.vertexAtttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*5,0);
gl.enableAttribArray(a_Position);

let a_Color = gl.getAttribLocation(program,"a_Color");
gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*5,FSIZE*2);
gl.enableAttribArray(a_Color);

```