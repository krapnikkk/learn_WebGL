# create and operate WebGLBuffer cache[创建与操作WebGLBuffer缓存区]


## 创建WebGLBuffer与目标绑定，并写入数据
前略WebGLProgram和顶点着色器和片元着色的创建
```
//获取Attribute变量
let a_Position = gl.getAttribLocation();
//创建TypedArray
let vertices = new Float32Array([
    0.0,1.1,
    2.2,3.3
]);

//创建WebGLBuffer
let vertixBuffer = gl.createBuffer();

// 将WebGLBuffer绑定到一个目标上【这个目标是glsl es定义的，表示缓存区对象的用途】
//一个WebGLBuffer只可以绑定到一个目标上，被移除的WebGLBuffer不可以重新被绑定
gl.bindBuffer(gl.ARRAY_BUFFER,vertixBuffer);


//通过向目标gl.ARRAY_BUFFER写入数据，向WebGLBuffer缓存区对象中写入数据【因为它们已经绑定】
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);


```

## 数据分配与处理WebGLBuffer开启attribute变量
```
// 将缓冲区对象一次性分配给attribute变量
// location: attribute变量的存储位置
// size:     缓冲区每个顶点的分量个数
// type:    使用glsl es指定数据格式
// normalize: 是否将非浮点型数据归一化到[0,1]或[-1,1]区间
// stride:   指定相邻两个顶点间的偏移量
// offset:   指定缓冲区对象中的偏移量
gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);

gl.enableVertexAttribArray(a_Position);

```