# OpenGL ES内置变量（GLES_ES_Built-in_Variables）
- [OpenGL ES内置变量（GLES_ES_Built-in_Variables）](#opengl-es内置变量gles_es_built-in_variables)
  - [GLSL的内置变量](#glsl的内置变量)
  - [顶点着色器的内置变量](#顶点着色器的内置变量)
    - [gl_PointSize](#gl_pointsize)
    - [gl_Position](#gl_position)
    - [gl_VertexID](#gl_vertexid)
  - [片元着色器的内置变量](#片元着色器的内置变量)
    - [gl_PointCoord](#gl_pointcoord)
    - [gl_FragCoord](#gl_fragcoord)
    - [gl_FragColor](#gl_fragcolor)
    - [gl_FragDepth](#gl_fragdepth)
    - [gl_FrontFacing](#gl_frontfacing)
    - [gl_InstanceID](#gl_instanceid)
  - [参考](#参考)
## GLSL的内置变量

着色器都是最简化的，如果需要当前着色器以外地方的数据的话，我们必须要将数据传进来。我们可以使用attriburte、uniform和sampler来完成这一任务了。

除此之外，OpenGLSL ES在不同的着色器里面还定义了另外几个以**gl_**为前缀的变量，它们能提供给我们更多的方式来读取/写入数据。



## 顶点着色器的内置变量

### gl_PointSize

| 类型  | 变量名       | 描述         | 版本限制 |
| ----- | ------------ | :----------- | -------- |
| float | gl_PointSize | 表示点的尺寸 | 1.0~3.0  |

用于写入以以像素表示的点精灵尺寸，在渲染点精灵时使用。

如果没有设置gl_PointSize，它的值在后续的管道阶段中是未定义的。



### gl_Position

| 类型 | 变量名      | 描述           | 默认值  |
| ---- | ----------- | -------------- | ------- |
| vec4 | gl_Position | 表示顶点的位置 | 1.0~3.0 |

变量gl_Position用于设置齐次顶点位置。它可以在顶点着色器执行期间的任何时候设置。

这个值用于图元装配、裁剪、剔除和其他固定功能操作（如果存在的话），这些操作将会在发生顶点处理后对图元进行操作。如果顶点着色器没有设置gl_Position，则在顶点处理阶段之后其值未定义。



### gl_VertexID

| 类型 | 变量名      | 描述                 | 默认值 |
| ---- | ----------- | -------------------- | ------ |
| int  | gl_VertexID | 表示被处理顶点的索引 | 3.0    |

变量gl_VertexID是一个顶点片元着色器内置变量，表示当前被处理的顶点的索引。

对于GL_ARRAY_BUFFER它是当前顶点在数组中的索引；对于GL_ELEMENT_ARRAY_BUFFER，它是从element buffer中获取的索引值。

## 片元着色器的内置变量

### gl_PointCoord

| 类型 | 变量名        | 描述           | 默认值 |
| ---- | ------------- | :------------- | ------ |
| vec4 | gl_PointCoord | 表示片元的坐标 | 1.0    |

片元着色器中的一个只读变量，可以在渲染点精灵时使用。

它保存点精灵的纹理坐标(s,t)，这个坐标在点光栅化期间自动生成，处于[0,1]区间内，顶点在左上角。



### gl_FragCoord

| 类型 | 变量名       | 描述                               | 默认值 |
| ---- | ------------ | :--------------------------------- | ------ |
| vec4 | gl_FragCoord | 表示片元的窗口空间坐标（单位像素） | 1.0    |

片元着色器中的一个只读变量，包含片元的窗口相对坐标(x, y, z, 1/w)值。

如果是多次采样，则此值可以是像素内任何位置的值，也可以是片元采样之一的值。

此值是固定功能的结果，该功能会在顶点处理后生成片元以对图元进行插值。

如果没有着色器包含对gl_FragDepth的任何写操作，则z分量是将用于片元深度的深度值。

gl_FragCoord的x和y分量是片元的窗口空间(Window-space)坐标，其原点为窗口的左下角。



### gl_FragColor

| 类型 | 变量名       | 描述         | 默认值 |
| ---- | ------------ | :----------- | ------ |
| vec2 | gl_FragColor | 指定片元颜色 | 1.0    |

变量gl_FragColor是一个片元着色器内置变量，对这个内置变量赋值后，相应的像素就会以这个颜色值显示。该变量是vec4类型的，包括四个浮点分量，分别代表RGBA值。



### gl_FragDepth

| 类型  | 变量名       | 描述           | 默认值 |
| ----- | ------------ | :------------- | ------ |
| float | gl_FragDepth | 表示片元的深度 | 3.0    |

仅在片元着色器中可用，gl_FragDepth是一个只写输出变量，用于设置当前片段的深度值。

如果深度缓冲被启用，并且没有着色器写入gl_FragDepth，则将使用固定的depth变量名（此值包含在gl_FragCoord的z组件中），否则，将使用写入gl_FragDepth的值。

如果着色器静态分配给gl_FragDepth，则对于采用该路径的着色器的执行，可能未定义片段深度的值。也就是说，如果链接的片元着色器静态地对gl_FragDepth进行写入操作，则它将始终对其进行写入操作。



### gl_FrontFacing

| 类型 | 变量名         | 描述                 | 默认值  |
| ---- | -------------- | :------------------- | ------- |
| bool | gl_FrontFacing | 表示片元当前面的朝向 | 1.0~3.0 |

片元着色器中的一个只读变量，如果当前片元属于正面图元的一部分，则其值为true，否则为false。

通过检查三角形面积的正负符号来确定一个三角形是否面向前方，包括gl_FrontFace控制的这个符号的可能反转。

计算该面积的一种方法是：
$$
a=\frac{1}{2}\sum\nolimits_{i=0}^{n-1}{x^{i}_w}{y^{i+1}_w}-{x^{i+1}_w}{y^{i}_w}
$$


其中$x^{i}_w$和$y^{i}_w$是n顶点多边形的第i个顶点的x和y窗口坐标。

OpenGL能够根据顶点的环绕顺序来决定一个面是正向还是背向面。如果我们不启用GL_FACE_CULL来使用面剔除，那么gl_FrontFacing将会告诉我们当前片段是属于正向面的一部分还是背向面的一部分。



### gl_InstanceID

| 类型 | 变量名        | 描述                     | 默认值 |
| ---- | ------------- | :----------------------- | ------ |
| int  | gl_InstanceID | 表示当前被渲染片元的索引 | 3.0    |

gl_InstanceID是一个顶点语言输入变量，用于保存实例化绘图调用中图元的实例编号。

它表示当前被渲染片元在一个实例绘制命令(如gldrawarraysinstinstance)中当前片元的索引。

如果当前片元不是源自一个实例绘制命令，gl_InstanceID的值为零。



## 参考

- [1] [learnopengl.cn advanced GLSL](https://learnopengl-cn.github.io/04%20Advanced%20OpenGL/08%20Advanced%20GLSL/#glsl)
- [2] [OpenGL-Refpages](https://www.khronos.org/registry/OpenGL-Refpages/es3.0/)
- [3] [《OpenGL ES 3.0 Programming Guide》](https://book.douban.com/subject/26414014/)

