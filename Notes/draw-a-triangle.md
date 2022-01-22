# 【创建一个WebGL程序】绘制点线面

## 创建一个WebGL程序
省略[创建WebGL程序且初始化的着色器的过程](create-a-WebGLProgram.md)

## 顶点着色器
一段顶点着色器的GLSL ES代码
```
const VSHADER_SOURCE = 
    "attribute vec4 a_Position;\n" +
    "void main() {\n" +
    "   gl_Position =  a_Position;\n" +
    "}\n";
```
顶点着色器的内置变量
| 类型和变量名 | 描述 | 赋值情况 |
| --- | --- | --- |
| vec4 gl_Position | 表示顶点位置 | 必须赋值 |
| float gl_PointSize | 表示点的尺寸（像素数） | 默认值:1.0 |

## 片元着色器
一段片元着色器的GLSL ES代码
```
const FSHADER_SOURCE = 
    "attribute vec a_Fragment;\n" +
    "void main() {\n" +
    "   gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n" +
    "}\n";
```
片元着色器的内置变量
| 类型和变量名 | 描述 | 赋值情况 |
| --- | --- | --- |
| vec4 gl_FragColor | 指定片元颜色（RGBA格式） | 必须赋值 |

## 设置canvas画布的背景颜色
使用渲染绘制上下文接口clearColor(red, green, blue, alpha)设置背景色;
- red:一个 GLclampf 类型的值，指定清除缓冲时的红色值。默认值：0。
- green:一个 GLclampf 类型的值，指定清除缓冲时的绿色值。默认值：0。
- blue:一个 GLclampf 类型的值，指定清除缓冲时的蓝色值。默认值：0。
- alpha:一个 GLclampf 类型的值，指定清除缓冲时的不透明度。默认值：0。

## 清空canvas画布
1. 使用渲染绘制上下文接口clear(mask)清空缓存。
- mask:一个用于指定需要清除的缓冲区的 GLbitfield 。可能的值有：
   1. gl.COLOR_BUFFER_BIT   //颜色缓冲区
   2. gl.DEPTH_BUFFER_BIT   //深度缓冲区
   3. gl.STENCIL_BUFFER_BIT  //模板缓冲区
2. 使用预设值来清空缓冲。预设值可以使用 clearColor() 、clearDepth() 或 clearStencil() 设置。裁剪、抖动处理和缓冲写入遮罩会影响 clear() 方法。
   
## 绘制一个点
1. 使用渲染绘制上下文接口drawArray(mode, first, count)从向量数组中绘制图元
   - mode(GLenum)【指定绘制图元的方式】
     1. gl.POINTS: 绘制一系列点。    
     2. gl.LINE_STRIP: 绘制一个线条。即，绘制一系列线段，上一点连接下一点。
     3. gl.LINE_LOOP: 绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
     4. gl.LINES: 绘制一系列单独线段。每两个点作为端点，线段之间不连接。
     5. gl.TRIANGLE_STRIP：绘制一个三角带。
     6. gl.TRIANGLE_FAN：绘制一个三角扇。
     7. gl.TRIANGLES: 绘制一系列三角形。每三个点作为顶点。 