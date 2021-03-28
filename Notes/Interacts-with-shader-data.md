# Interacts with shader data

## 创建一个WEBGLProgram程序
假定vertexShader.glsl中数据定义如下：
```
attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}
```
fragmentShader.glsl中数据定义如下：
```
uniform vec4 u_FragColor;
void main(){
    gl_FragColor = u_FragColor;
}
```
创建一个WEBGLProgram程序，并编译绑定好上面的顶点着色器和片元着色器。
```
let canvas = querySelector('#webgl');
let gl = canvas.getContext("webgl);

let vShader = gl.createShader(gl.VERTEX_SHADER);
let fShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(VShader,vShader);
gl.shaderSource(FShader,fShader);

gl.compileShader(vShader);
gl.compileShader(fShader);

let program = gl.createProgram();
gl.attachShader(program,vShader);
gl.attachShader(program,fShader);

gl.linkProgram(program);

gl.useProgram(program);
```

## 获取存储限定符Attribute变量
通过方法gl.getAttribLocation()获取限定储存符attribute变量a_Position和a_PointSize在WEBGLProgram程序的存储位置
```
let a_Position = gl.getAttribLocation(program,"a_Position");
let a_PointSize = gl.getAttribLocation(program,"a_PointSize");
```

## 更新存储限定符Attribute变量的值【一次只能传递一个值】
通过方法gl.vertexAttrib4f根据获取到的存储位置去更新a_Position和a_PointSize的值

```
gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);//参数类型：float 参数个数:3
gl.vertexAttrib1f(a_PointSize,0.0);
```

## 获取存储限定符Uniform变量
```
let u_FragColor = gl.getUniformLocation(program,'u_FragColor');

```

## 更新存储限定符Uniform变量的值【一次只能传递一个值】
```
gl.uniform3f(u_FragColor,1.0,0.0,0.0);

gl.uniformMatrix4fv(location,transpose,array); //更新传递matrix
```

## 将缓存区对象分配给Attribute变量【一次性分配】
```
gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
```