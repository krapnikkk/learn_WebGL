# create-and-operate-with-texture

##
顶点着色器
```
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main(){
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}
```
片元着色器
```
varying vec2 v_TexCoord;
uniform sampler u_Sampler;
void main(){
    gl_FragColor = texure2D(u_Sampler,v_TexCoord);
}
```

## 动态分配position与纹理的st坐标位置
```
let verticesTexCoords = new Float32Array([
    //顶点坐标&纹理坐标
    -0.5,0.5,0.0,1.0, //左上角
    -0.5,-0.5,0.0,0.0,//左下角
    0.5,0.5,1.0,1.0,//右上角
    0.5,-0.5,1.0,0.0//左下角
]);
let vertexTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vertexTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords),gl.STATIC_DRAW);
let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

let a_Position = gl.getAttribLocation(program,"a_Position");
let a_TexCoord = gl.getAttribLocation(program,"a_TexCoord");

gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
gl.enableVertexAttribArray(a_Position);

gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
gl.enableVertexAttribArray(a_TextCoord);


```

## 创建Texture
前略加载Image对象
```
let texture = gl.CreateTexture();
let u_Sampler = getUniformLocation(program,"u_Sampler");//获取取样器

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);//对纹理图像进行y反转

gl.activeTexture(gl.TEXTURE0);//开启0号纹理单元
gl.bindTexture(gl.TEXTURE0,texture);// 绑定纹理对象

gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);//配置纹理参数
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);//配置纹理图像

gl.uniform1i(u_Sampler,0);// 将0号纹理单元传递给着色器中的取样器变量

gl.drawArrays(gl.TRIANGLE,0,4);
```

## 配置纹理参数
gl.texParameter(target,pname,param)[不展示EXT_texture_filter_anisotropic&WebGL2.0]
| panme                 | 描述           | param                         |
| --------------------- | -------------- | ----------------------------- |
| gl.TEXTURE_MAG_FILTER | 纹理放大滤波器 | gl.LINEAR(默认值)、gl.NEAREST |
| gl.TEXTURE_MIN_FILTER | 纹理缩小滤波器 | gl.LINEAR、gl.NEAREST、gl.NEAREST_MIPMAP_NEAREST、gl.LINEAR_MIPMAP_NEAREST、gl.NEAREST_MIPMAP_LINEAR、gl.LINEAR_MIPMAP_LINEAR |
| gl.TEXTURE_WRAP_S | 纹理坐标水平填充s | gl.REPEAT(默认值)、gl.CLAMP_TO_EDGE、gl.MIRRORED_REPEAT |
| gl.TEXTURE_WRAP_T | 纹理坐标水平填充t | gl.REPEAT(默认值)、gl.CLAMP_TO_EDGE、gl.MIRRORED_REPEAT | 


gl.NEAREST : 使用原纹理上距离映射后像素(新像素)中心最近的那个像素的颜色值，作为新像素的值【使用直角距离】
gl.LINEAR:  使用距离新像素中心最近的四个像素的颜色值的加权平均，作为新像素的值(与gl.NEAREST相比，该方法图像距离质量更好，但是会有较大的开销)


gl.REPEAT:  平铺式的重复纹理
gl.MIRRORED_REPEAT: 镜像对称式的重复纹理
gl.CLAMP_TO_EDGE:   使用纹理图像边缘值


## 将纹理图像分配给纹理对象
gl.texImage2D(target,level,internalformat.format,type,image);
target 目标纹理对象 gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP
level 加载的mip级别 第一个级别是0
internalformat 图像的内部格式
format 纹理数据的格式
type 纹理数据的类型
image 包含纹理图像的Image对象
