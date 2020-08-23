# OpenGL ES着色器语言（GLSL ES）

## 节本着色器代码

顶点着色器示例
```
//顶点着色器
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
}

```

片元着色器示例
```
//片元着色器
#ifdef GLSL_ES
precision mediump float;
#endif
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}
```

## GLSL ES概述

GLSL ES编程语言是在OpenGL着色器语言（GLSL）的基础上，删除和简化一部分功能后形成的。GLSL ES的目标平台是消费电子产品或嵌入式设备，如智能手机或游戏主机等，因此简化GLSL ES能够允许硬件厂商对这些设备的硬件进行简化，由此带来的好处是降低了硬件的功耗，以及更重要的，减少了性能开销。

[WebGL](https://www.khronos.org/registry/webgl/specs/latest/1.0/)并不支持GLSL ES1.00的所有特性；实际上，它支持的是1.00版本的一个子集，其中只包括WebGL需要的那些核心特性。

## GLSL ES基础

### 基础

- 程序是大小写敏感。
- 每一个语句都应该以一个英文分号(;)结束。

### 执行次序

着色器程序和C语言接近，它从main()函数开始执行的。着色器程序必须有且仅有一个main()函数，而且该函数不能接受任何参数。

main函数前的void关键字表示这个函数不返回任何值。

### 注释

- 单行注释：//后直到换行处的所有字符为注释
```
int kp = 496;//kp是一个卡布列克数
```
- 双行注释：/*和*/之间的所有字符串为注释
```
/*我今天休息一天
  我明天想休息一天
*/
```

## 数据值和类型（数值和布尔值）

GLSL支持两种数值类型：
- 数值类型：GLSL ES支持整型数（比如0、1、2）和浮点数（比如3.14、29.98、0.23571）。没有小数点（.）的值被认为是整数型，而有小数点的值则被认为是浮点数。
- 布尔值类型：GLSL ES支持布尔值类型，包括true和false两个布尔常量。

## 变量
- 只包括a-z，A-Z，0-9和下划线（_）
- 变量名的首字母不能是数字
- 不能以gl_、webgl_或者_webgl_开头，这些前缀已经被OpenGL ES保留了
- 不能是GLSL ES的关键字和保留字（下表），变量名的一部分可以是它们。
  
### GLSL ES关键字
| | | | | | |
| ------ | ------ | ------ | ------ | ------ | ------ |
| attribute | bool | break | bvec2 | bvec3 | bvec4 |
| const | continue | discard | do | else | false |
| float | for | highp | if | in | inout |
| Int | invariant | ivec2 | ivec3 | ivec4 | lowp |
| mat2 | mat3 | mat4 | medium | out | precision |
| return | sampler2D | samplerCube | struct | true | uniform |
| varying | vec2 | vec3 | vec4 | void | while |

### GLSL ES保留字
| | | | | | | |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| asm | cast | class | default | double | dvec2 | dvec3 |
| dvec4 | enum | extern | external | fixed | flat | fvec2 |
| fvec3 | fvec4 | goto | half | hvec2 | hvec3 | hvec4 |
| inline | input | interface | long | namespace | noinline | output |
| packed | public | sampler1D | sampler1DShadow | sampler2DRect | sampler2DRectShadow |  shadow2DShadow | 
| sampler3D | sampler3DRect | short | sizeof | static | superp | switch |
| template | this | typedef | union | unsigned | using | volatile |

## GLSL ES是强类型语言
GLSL ES要求具体地指明变量的数据类型。
    <类型><变量名>
  
## 基本类型
| 类型 | 描述 |
| -- | -- |
| float | 单精度浮点数类型。该类型的变量表示一个单精度浮点数 |
| int | 整数型。该类型的变量表示一个整数 |
| bool | 布尔值。该类型的变量表示一个布尔值（true或者false）|

### 赋值和类型变换

使用等号（=）可以将赋值给变量。GLSL ES是强类型语言，所以如果等号左侧变量的类型与等号右侧的值（或变量）类型不一致，就会出错。
```
init i = 8;
float f1 = 8;//错误
float f2 = 8.0;
float f3 = 8.0f;//错误
```
要将一个整数数值赋值给浮点型变量，需要将整型数转换成浮点数，这个过程称为类型转换。
```
int i = 8;
float f1 = float(i);
float f2 = float(8);
```
GLSL ES支持以下几种用于类型转换的内置函数。
| 转换 | 函数 | 描述 |
| ---- | ---- | ---- |
| 转换为整数型 | int(float) | 将浮点数的小数部分删去，转换为整型数 |
|  | int(bool) | true被转换为1，false被转换为0 |
| 转换为浮点数 | float(int) | 将整数型转换为浮点数 |
|  | float(bool) | true被转换为1.0，false被转换为0.0 |
| 转换为布尔值 | bool(int) | 0被转换为false，其他非0值被转换为true |
|  | bool(float) | 0.0被转换为false，其他非0值被转换为true | 

### 运算符
| 类型 | GLSL ES数据类型 | 描述 |
| ------ | ------ | ------ |
| - | 取负（比如指定一个负数） | int或float |
| * | 乘法 | int或者float,运算的返回值类型与参与运算的值类型相同 |
| / | 除法 |  | 
| + | 加法 |  |
| - | 减法 |  |
| ++ | 自增（前缀后后缀） | int或者float,运算的返回值类型与参与运算的值类型相同 |
| -- | 自减（前缀后后缀） |  |
| = | 赋值 | int、float或bool |
| += -= *= /= | 算术赋值 | int或float |
| < > <= >= | 比较 |  |
| == != | 比较（是否相等） | int、float或bool |
| ! | 取反 | bool或结果为bool类型的表达式 |
| && | 逻辑与 |  |
| \|\| | 逻辑或 |  |
| ^^ | 逻辑异或 |  |
| condition?expression:expression2 | 三元选择 | condition的类型为bool，expression1和expression2的类型可以是除数组外的任意类型 |  

## 矢量和矩阵
GLSL ES支持矢量和矩阵类型，矢量和矩阵类型的变量都包含多个元素，每个元素都是一个数值（int,float或bool）。矢量将这些元素排列成一列，可以用来表示顶点坐标或者颜色值等，而矩阵则将元素划分成列和行，可以用来表示变换矩阵。

矢量：(1,2,3)

矩阵：
$$
\left[
 \begin{matrix}
   1 & 4 & 7 \\
   2 & 5 & 8 \\
   3 & 6 & 9 
  \end{matrix} 
\right]
$$

### 矢量和矩阵类型
| 类型 | GLSL_ES数据类型 | 描述 |
| ---- | ---- | ---- |
| 矢量 | vec2、vec3、vec4 | 具有2、3、4个浮点数元素的矢量 | 
|  | ivec2、ivec3、ivec4 | 具有2、3、4个整型数元素的矢量 | 
|  | bvec2、bvec3、bvec4 | 具有2、3、4个布尔值元素的矢量 | 
| 矩阵 | mat2、mat3、mat4 | 具有2、3、4个浮点数元素的矩阵（分别具有4，9，16个元素） | 

### 赋值和构造
我们使用等号（=）来对于矢量和矩阵进行赋值操作。赋值运算符左右两边的变量/值的类型必须一致，左右两边的（矢量或者矩阵）元素个数必须相同。