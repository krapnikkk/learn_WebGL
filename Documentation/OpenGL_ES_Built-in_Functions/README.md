# OpenGL ES内置变量（OpenGL_ES_Built-in_Functions）



## 角度函数

### 角度值转弧度值
#### 描述：将角度值转化为弧度值，即$n*degree/180$

| 语法                        |
| --------------------------- |
| float radians(float degree) |
| vec2 radians(vec2 degree)   |
| vec3 radians(vec3 degree)   |
| vec4 radians(vec4 degree)   |

### 弧度值转角度值
#### 描述：将弧度值转化为角度值，即$180*radian/n$

| 语法                        |
| --------------------------- |
| float degrees(float radian) |
| vec2 degrees(vec2 radian)   |
| vec3 degrees(vec3 radian)   |
| vec4 degrees(vec4 radian)   |



## 三角函数

### 标准三角正弦函数
#### 描述：标准三角正弦函数，angle是弧度值，返回值在[-1,1]区间
| 语法                   |
| ---------------------- |
| float sin(float angle) |
| vec2 sin(vec2 angle)   |
| vec3 sin(vec3 angle)   |
| vec4 sin(vec4 angle)   |

### 标准三角余弦函数
#### 描述：标准三角余弦函数，angle是弧度值，返回值在[-1,1]区间

| 语法                   |
| ---------------------- |
| float cos(float angle) |
| vec2 cos(vec2 angle)   |
| vec3 cos(vec3 angle)   |
| vec4 cos(vec4 angle)   |

### 标准三角正切函数
#### 描述：标准三角正切函数，angle是弧度值

| 语法                   |
| ---------------------- |
| float tan(float angle) |
| vec2 tan(vec2 angle)   |
| vec3 tan(vec3 angle)   |
| vec4 tan(vec4 angle)   |

### 反正弦函数
#### 描述：反正弦函数，返回角度（弧度值）的正弦值为y,vec x。返回值在[-n/2，n/2]区间内，如果x<-1或者x>+1则返回为定义的值。
| 语法                |
| ------------------- |
| float asin(float x) |
| vec2 asin(vec2 x)   |
| vec3 asin(vec3 x)   |
| vec4 asin(vec4 x)   |

### 反余弦函数
#### 描述：反余弦函数，返回角度（弧度值）的余弦值为x。返回值在[-n/2，n/2]区间内，如果x<-1或者x>+1则返回为定义的值。
| 语法                |
| ------------------- |
| float acos(float x) |
| vec2 acos(vec2 x)   |
| vec3 acos(vec3 x)   |
| vec4 acos(vec4 x)   |

### 反正切函数
#### 描述：反正切函数，返回角度（弧度值）的正切值为y/x。x和y的符号决定了角度在哪个象限，返回角度在[-n，n]区间中，如果x和y都是0，则返回为定义的值。对于矢量而言，这是一个逐分量的运算。
| 语法                         |
| ---------------------------- |
| float atan(float y, float x) |
| vec2 atan(vec2 y,vec2 x)     |
| vec3 atan(vec3 y,vec3 x)     |
| vec4 atan(vec4 y,vec4 x)     |
| float atan(float y_over_x)   |
| vec2 atan(vec2 y_over_x)     |
| vec3 atan(vec3 y_over_x)     |
| vec4 atan(vec4 y_over_x)     |

## 指数函数
### x的y次幂
#### 返回x的y次幂,即$x^y$。如果x<0，即返回未定义值。如果x=0而y<0，则返回未定义值。对矢量而言，这是一个逐分量的运算。
| 语法                        |
| --------------------------- |
| float pow(float x, float y) |
| vec2 pow(vec2 x,vec2 y)     |
| vec3 pow(vec3 x,vec3 y)     |
| vec4 pow(vec4 x,vec4 y)     |

### 自然指数幂
#### 返回x的自然指数幂，即$e^x$
| 语法               |
| ------------------ |
| float exp(float x) |
| vec2 exp(vec2 x)   |
| vec3 exp(vec3 x)   |
| vec4 exp(vec4 x)   |

### 自然对数
#### 返回x的自然指对数，即返回y使得$x=e^y$。如果x<0，则返回未定义值。
| 语法               |
| ------------------ |
| float log(float x) |
| vec2 log(vec2 x)   |
| vec3 log(vec3 x)   |
| vec4 log(vec4 x)   |

### 2的x次幂
#### 返回2的x次幂，即$2^x$。
| 语法                |
| ------------------- |
| float exp2(float x) |
| vec2 exp2(vec2 x)   |
| vec3 exp2(vec3 x)   |
| vec4 exp2(vec4 x)   |

### 2的对数值
#### 返回以2为底的对数值，即返回y使得$x=2^y$。如果$x\le0$，则返回未定义值。
| 语法                |
| ------------------- |
| float log2(float x) |
| vec2 log2(vec2 x)   |
| vec3 log2(vec3 x)   |
| vec4 log2(vec4 x)   |

### x的开方
#### 返回$\sqrt{x}$，如果x<0，则返回未定义值
| 语法                |
| ------------------- |
| float sqrt(float x) |
| vec2 sqrt(vec2 x)   |
| vec3 sqrt(vec3 x)   |
| vec4 sqrt(vec4 x)   |

### x的开方的倒数
#### 返回$1/\sqrt{x}$，如果x<0，则返回未定义值
| 语法                       |
| -------------------------- |
| float inversesqrt(float x) |
| vec2 inversesqrt(vec2 x)   |
| vec3 inversesqrt(vec3 x)   |
| vec4 inversesqrt(vec4 x)   |

## 通用函数
### 绝对值
#### 返回x的无符号绝对值，即如果$x\ge0$，则返回x，否则返回-x。
| 语法               |
| ------------------ |
| float abs(float x) |
| vec2 abs(vec2 x)   |
| vec3 abs(vec3 x)   |
| vec4 abs(vec4 x)   |

### 符号函数
#### 如果x>0返回1.0，如果x=0返回0.0，否则返回-1.0。
| 语法                |
| ------------------- |
| float sign(float x) |
| vec2 sign(vec2 x)   |
| vec3 sign(vec3 x)   |
| vec4 sign(vec4 x)   |

### 向下取整
#### 返回小于等于x且最接近x的整数。
| 语法                 |
| -------------------- |
| float floor(float x) |
| vec2 floor(vec2 x)   |
| vec3 floor(vec3 x)   |
| vec4 floor(vec4 x)   |

### 向上取整
#### 返回大于等于x且最接近x的整数。
| 语法                |
| ------------------- |
| float ceil(float x) |
| vec2 ceil(vec2 x)   |
| vec3 ceil(vec3 x)   |
| vec4 ceil(vec4 x)   |

### frac函数
#### 返回x的小数部分，即返回x-floor(x)。
| 语法                 |
| -------------------- |
| float fract(float x) |
| vec2 fract(vec2 x)   |
| vec3 fract(vec3 x)   |
| vec4 fract(vec4 x)   |

### 模函数
#### 模数（模），返回x除以y的余数，即(x-y*floor(x/y))。给定两个正整数x和y，mod(x,y)可以求得x除以y的余数。注意，对于矢量而言，这是一个逐分量的运算。
| 语法                       |
| -------------------------- |
| float mod(float x,float y) |
| vec2 mod(vec2 x,vec2 y)    |
| vec3 mod(vec3 x,vec3 y)    |
| vec4 mod(vec4 x,vec4 y)    |
| vec2 mod(vec2 x,float y)   |
| vec3 mod(vec3 x,float y)   |
| vec4 mod(vec4 x,float y)   |

### min函数
#### 返回最小值，即如果y<x则返回y，否则返回x。注意，对于矢量而言，这是一个逐分量的运算。
| 语法                       |
| -------------------------- |
| float min(float x,float y) |
| vec2 min(vec2 x,vec2 y)    |
| vec3 min(vec3 x,vec3 y)    |
| vec4 min(vec4 x,vec4 y)    |
| vec2 min(vec2 x,float y)   |
| vec3 min(vec3 x,float y)   |
| vec4 min(vec4 x,float y)   |

### max函数
#### 返回最大值，即如果y>x则返回y，否则返回x。注意，对于矢量而言，这是一个逐分量的运算。
| 语法                       |
| -------------------------- |
| float max(float x,float y) |
| vec2 max(vec2 x,vec2 y)    |
| vec3 max(vec3 x,vec3 y)    |
| vec4 max(vec4 x,vec4 y)    |
| vec2 max(vec2 x,float y)   |
| vec3 max(vec3 x,float y)   |
| vec4 max(vec4 x,float y)   |

### clamp函数
#### 将x限制在minVal和maxVal之间，即返回min(max(x,minVal),maxVal)。如果minVal>maxVal，则返回未定义值。
| 语法                                           |
| ---------------------------------------------- |
| float clamp(float x,float minVal,float maxVal) |
| vec2 clamp(vec2 x,vec2 minVal,vec2 maxVal)     |
| vec3 clamp(vec3 x,vec3 minVal,vec3 maxVal)     |
| vec4 clamp(vec4 x,vec4 minVal,vec4 maxVal)     |
| vec2 clamp(vec2 x,float minVal,float maxVal)   |
| vec3 clamp(vec3 x,float minVal,float maxVal)   |
| vec4 clamp(vec4 x,float minVal,float maxVal)   |

### 线性混合
#### 返回x和y的线性混合，即$x*(1-a)+y*a$
| 语法                             |
| -------------------------------- |
| float mix(float x,float y)       |
| vec2 mix(vec2 x,float y,float a) |
| vec3 mix(vec3 x,float y,float a) |
| vec4 mix(vec4 x,float y,float a) |
| vec2 mix(vec2 x,vec2 y,vec2 a)   |
| vec3 mix(vec3 x,vec3 y,vec3 a)   |
| vec4 mix(vec4 x,vec4 y,vec4 a)   |

### 阶梯函数
#### 根据两个数值生成阶梯函数，即，如果x<edge即返回0.0，否则返回1.0。
| 语法                           |
| ------------------------------ |
| float step(float edge,float x) |
| vec2 step(vec2 edge,vec2 x)    |
| vec3 step(vec3 edge,vec3 x)    |
| vec4 step(vec4 edge,vec4 x)    |
| vec2 step(float edge,vec2 x)   |
| vec3 step(float edge,vec3 x)   |
| vec4 step(float edge,vec4 x)   |

### smoothstep
#### 经过Hermite插值的阶梯函数。如果$x\le0$即返回0.0，如果$x\ge0$则返回1.0，否则按照如下方法插值出一个值并返回。如果$edge0\ge edge1$则返回未定义值
```
genType t;
t =clamp((x-edge0)/(edge1-edge0),0,1);
return t*t*(t-2*t);
```
| 语法                                              |
| ------------------------------------------------- |
| float smoothstep(float edge0,float edge1,float x) |
| vec2 smoothstep(vec2 edge0,vec2 edge1,vec2 x)     |
| vec3 smoothstep(vec3 edge0,vec3 edge1,vec3 x)     |
| vec4 smoothstep(vec4 edge0,vec4 edge1,vec4 x)     |

## 几何函数
### 长度
#### 返回矢量x的长度
| 语法                  |
| --------------------- |
| float length(float x) |
| vec2 length(vec2 x)   |
| vec3 length(vec3 x)   |
| vec4 length(vec4 x)   |

### 距离
#### 返回p0到p1之间的距离，即length(p0-p1)。
| 语法                              |
| --------------------------------- |
| float distance(float p0,float p1) |
| vec2 distance(vec2 p0,vec2 p1)    |
| vec3 distance(vec3 p0,vec3 p1)    |
| vec4 distance(vec4 p0,vec4 p1)    |

### 点积
#### 返回x和y的点积，对于vec3而言，就是x[0]*y[0]+x[1]*y[1]+x[2]*y[2]。
| 语法                       |
| -------------------------- |
| float dot(float x,float y) |
| vec2 dot(vec2 x,vec2 y)    |
| vec3 dot(vec3 x,vec3 y)    |
| vec4 dot(vec4 x,vec4 y)    |

### 叉乘
#### 返回x和y的叉乘，对于vec3而言，就是
```
result[0]=x[1]*y[2]-y[1]*x[2]
result[1]=x[2]*y[0]-y[2]*x[0]
result[2]=x[0]*y[1]-y[0]*x[1]
```
| 语法                      |
| ------------------------- |
| vec3 cross(vec3 x,vec3 y) |

### 归一化
#### 对x进行归一化，保持矢量方向不变但长度为1，即x/length(x)。
| 语法                     |
| ------------------------ |
| float normalize(float x) |
| vec2 normalize(vec2 x)   |
| vec3 normalize(vec3 x)   |
| vec4 normalize(vec4 x)   |

### 法向量反向
#### 法向量反向（如果需要）操作，根据入射矢量N和参考矢量Nref来调整法向量。如果dot(Nref,I)<0则返回N，否则返回-N。
| 语法                                          |
| --------------------------------------------- |
| float faceforward(float N,float I,float Nref) |
| vec2 faceforward(vec2 N,vec2 I,vec2 Nref)     |
| vec3 faceforward(vec3 N,vec3 I,vec3 Nref)     |
| vec4 faceforward(vec4 N,vec4 I,vec4 Nref)     |

### 反射矢量
#### 计算反射矢量。入射矢量为I，表面法向量为N，返回I-2*dot(N,I)*N。注意，N必须已经被归一化。
| 语法                           |
| ------------------------------ |
| float reflect(float I,float N) |
| vec2 reflect(vec2 I,vec2 N)    |
| vec3 reflect(vec3 I,vec3 N)    |
| vec4 reflect(vec4 I,vec4 N)    |

### 折射函数
#### 根据入射光和介质特性计算折射现象。入射光方向为I，表面法向量为N，介质的折射率为eta，返回被折射后的光线方向。注意，入射光矢量I和表面法向量N必须已经被归一化。
```
k=1.0-eta*eta*(1.0-dot(N,I)*dot(N,I))
if(k<0.0){
    return genType(0.0);
}else{
    return eta*I-(eta*dot(N,I))+sqrt(k)*N
}
```
| 语法                                     |
| ---------------------------------------- |
| float refract(float I,float N,float eta) |
| vec2 refract(vec2 I,vec2 N,float eta)    |
| vec3 refract(vec3 I,vec3 N,float eta)    |
| vec4 refract(vec4 I,vec4 N,float eta)    |

## 矩阵函数
### 逐元素相乘
#### 将矩阵x和矩阵y逐元素相乘，也就是result=matrixCompMatrix(x,y)，则result[i][j]=x[i][j]*y[i][j]。
| 语法                               |
| ---------------------------------- |
| mat2 matrixCompMult(mat2 x,mat2 y) |
| mat3 matrixCompMult(mat3 x,mat3 y) |
| mat4 matrixCompMult(mat4 x,mat4 y) |


## 矢量函数
### lessThan函数
#### 逐分量比较x<y是否成立
| 语法                            |
| ------------------------------- |
| bvec2 lessThan(vec2 x,vec2 y)   |
| bvec3 lessThan(vec3 x,vec3 y)   |
| bvec4 lessThan(vec4 x,vec4 y)   |
| bvec2 lessThan(ivec2 x,ivec2 y) |
| bvec3 lessThan(ivec3 x,ivec3 y) |
| bvec4 lessThan(ivec4 x,ivec4 y) |

### lessThanEqual函数
#### 逐分量比较$x\le y$是否成立
| 语法                                 |
| ------------------------------------ |
| bvec2 lessThanEqual(vec2 x,vec2 y)   |
| bvec3 lessThanEqual(vec3 x,vec3 y)   |
| bvec4 lessThanEqual(vec4 x,vec4 y)   |
| bvec2 lessThanEqual(ivec2 x,ivec2 y) |
| bvec3 lessThanEqual(ivec3 x,ivec3 y) |
| bvec4 lessThanEqual(ivec4 x,ivec4 y) |

### greaterThan函数
#### 逐分量比较x<y是否成立
| 语法                               |
| ---------------------------------- |
| bvec2 greaterThan(vec2 x,vec2 y)   |
| bvec3 greaterThan(vec3 x,vec3 y)   |
| bvec4 greaterThan(vec4 x,vec4 y)   |
| bvec2 greaterThan(ivec2 x,ivec2 y) |
| bvec3 greaterThan(ivec3 x,ivec3 y) |
| bvec4 greaterThan(ivec4 x,ivec4 y) |

### greaterThanEqual函数
#### 逐分量比较$x\ge y$是否成立
| 语法                                    |
| --------------------------------------- |
| bvec2 greaterThanEqual(vec2 x,vec2 y)   |
| bvec3 greaterThanEqual(vec3 x,vec3 y)   |
| bvec4 greaterThanEqual(vec4 x,vec4 y)   |
| bvec2 greaterThanEqual(ivec2 x,ivec2 y) |
| bvec3 greaterThanEqual(ivec3 x,ivec3 y) |
| bvec4 greaterThanEqual(ivec4 x,ivec4 y) |

### equal函数
#### 逐分量比较$x==y$是否成立
| 语法                         |
| ---------------------------- |
| bvec2 equal(vec2 x,vec2 y)   |
| bvec3 equal(vec3 x,vec3 y)   |
| bvec4 equal(vec4 x,vec4 y)   |
| bvec2 equal(ivec2 x,ivec2 y) |
| bvec3 equal(ivec3 x,ivec3 y) |
| bvec4 equal(ivec4 x,ivec4 y) |

### notEqual函数
#### 逐分量比较$x!=y$是否成立
| 语法                            |
| ------------------------------- |
| bvec2 notEqual(vec2 x,vec2 y)   |
| bvec3 notEqual(vec3 x,vec3 y)   |
| bvec4 notEqual(vec4 x,vec4 y)   |
| bvec2 notEqual(ivec2 x,ivec2 y) |
| bvec3 notEqual(ivec3 x,ivec3 y) |
| bvec4 notEqual(ivec4 x,ivec4 y) |

### any函数
#### 矢量的任意分量为true，则返回true。
| 语法              |
| ----------------- |
| bool any(bvec2 x) |
| bool any(bvec3 x) |
| bool any(bvec4 x) |

### all函数
#### 矢量的所有分量为true，则返回true。
| 语法              |
| ----------------- |
| bool all(bvec2 x) |
| bool all(bvec3 x) |
| bool all(bvec4 x) |

### not函数
#### 矢量逐分量的逻辑补运算。
| 语法               |
| ------------------ |
| bvec2 not(bvec2 x) |
| bvec3 not(bvec3 x) |
| bvec4 not(bvec4 x) |

## 纹理查询函数
### texture2D函数
#### 使用纹理坐标coord，从当前绑定到sampler的二维纹理中读取相应的纹素。对于投影版本（带有proj的），纹理坐标将从coord的最后一个分量中解析出来，而vec4类型的coord的第3个分量将被忽略。参数bias只可在片元着色器中使用，它表示在sampler是MIPMAP纹理时，加在当前lod上的值。
| 语法                                                          |
| ------------------------------------------------------------- |
| vec4 texture2D(sampler2D sampler,vec2 coord)                  |
| vec4 texture2D(sampler2D sampler,vec2 coord,float bias)       |
| vec4 texture2DProj(sampler2D sampler,vec3 coord)              |
| vec4 texture2DProj(sampler2D sampler,vec3 coord,float bias)   |
| vec4 texture2DProj(sampler2D sampler,vec4 coord)              |
| vec4 texture2DProj(sampler2D sampler,vec4 coord,float bias)   |
| vec4 texture2DLod(sampler2D sampler,vec2 coord,float lod)     |
| vec4 texture2DProjLod(sampler2D sampler,vec3 coord,float lod) |
| vec4 texture2DProjLod(sampler2D sampler,vec4 coord,float lod) |

### textureCube函数
#### 使用纹理坐标coord，从绑定到sampler的立方体纹理中读取响应纹素。coord的方向可用来指定立方体纹理的表面。
| 语法                                                          |
| ------------------------------------------------------------- |
| vec4 textureCube(samplerCube sampler,vec3 coord)                  |
| vec4 textureCube(samplerCube sampler,vec3 coord,float bias)       |
| vec4 textureCubeLod(samplerCube sampler,vec3 coord,float lod)              |
