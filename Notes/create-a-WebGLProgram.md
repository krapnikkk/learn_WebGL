# 【创建一个WebGL程序】从canvas画布说起

## 图解
![0_workflow](./asset/create-a-WebGLProgram/0-workflow.png)

## 获取一个canvas画布[DOM元素对象]
1. 通过浏览器原生API接口document.querySelector(selectors)获取到canvas画布
2. 通过浏览器原生API接口document.createElement('canvas')创建一个canvas画布 [父级DOM元素对象使用insertBefore将创建出来的canvas画布添加到DOM中]

## 从canvas元素对象获取绘制的上下文[WebGLRenderingContext]
- 使用canvas元素对象接口getContext(contextType, contextAttributes)获取渲染绘制上下文[context]
- contextType(string)【上下文类型】：
   1. "webgl" (或"experimental-webgl") 这将创建一个 WebGLRenderingContext 三维渲染上下文对象。只在实现WebGL 版本1(OpenGL ES 2.0)的浏览器上可用。
   2. "webgl2" (或 "experimental-webgl2") 这将创建一个 WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用。[截止2020/08/30 safari尚未支持]
- contextAttributes(Object||null) 【WebGL上下文属性】：
   1. alpha(boolean): 表明canvas是否包含一个alpha缓冲区。
   2. antialias(boolean): 表明是否开启抗锯齿。
   3. depth(boolean): 表明绘制缓冲区是否包含一个深度至少为16位的缓冲区。
   4. failIfMajorPerformanceCaveat(boolean): 表明在一个系统性能低的环境是否创建该上下文的。
   5. powerPreference(string): 指示浏览器在运行WebGL上下文时使用相应的GPU电源配置。 可能值如下:
     - "default":自动选择，默认值。
     - "high-performance": 高性能模式。
     - "low-power": 节能模式。
   6. premultipliedAlpha(boolean): 表明排版引擎讲假设绘制缓冲区是否包含预混合alpha通道的。
   7. stencil(boolean): 表明绘制缓冲区是否包含一个深度至少为8位的模版缓冲区。

## 创建WebGL程序对象[WebGLProgram]
1. 使用渲染绘制上下文接口createProgram()初始化一个WebGL程序对象
2. 一个WebGL程序由两个编译过后的顶点着色器对象组成[顶点着色器和片段着色器（均由 GLSL 语言所写）]

## 创建着色器程序对象[WebGLShader]
1. 使用渲染绘制上下文接口createShader(type)初始化一个着色器对象
   - type(string)【着色器类型】：
     1. gl.VERTEX_SHADER 【顶点着色器】
     2. gl.FRAGMENT_SHADER【片元着色器】
  
## 向着色器对象中填充着色器程序的GLSL ES源代码
1. 使用渲染绘制上下文接口shaderSource(shader, source)向着色器对象指定GLSL ES源代码
   - shader(WebGLShader)【用于设置程序代码的 WebGLShader 对象】
   - source(string)【包含GLSL ES程序代码的字符串】

## 编译着色器
1. 使用渲染绘制上下文接口compileShader(shader)进行编译。
   - shader(WebGLShader)【片元或顶点着色器】
2. 编译成WebGL程序使用的二进制可执行格式
   
### 检测着色器的状态
   1. 使用渲染绘制上下文接口getShaderParameter(shader,pname)检查着色器的状态
    - shader(WebGLShader)【指定待获取参数的着色器】
    - pname(string)【根据pname的不同，返回不同的值】
       1. gl.DELETE_STATUS:标示着色器是否被删除，返回删除（GL_TRUE）或未删除（GL_FALSE）
       2. gl.COMPILE_STATUS: 标示着色器是否编译成功，返回是（GL_TRUE）或不是（GL_FALSE）
       3. gl.SHADER_TYPE: 标示着色器类型，返回顶点着色器(gl.VERTEX_SHADER)或片段着色器(gl.FRAGMENT_SHADER)
   2. 如果编译失败，getShaderParameter接口会返回false,WebGL系统会将编译的具体内容写入着色器的信息日志
   3. 使用渲染绘制上下文接口getShaderInfoLog(shader)获取着色器的信息日志
    - shader(WebGLShader)【待获取信息日志的着色器】
    
### 删除着色器
    1. 使用渲染绘制上下文接口deleteShader(shader)删除着色器对象
    - shader(WebGLShader)【待删除的着色器对象】
    2. 如果着色器对象还在使用，着色器不会马上被删除，而是等到程序对象不再使用该着色器后，才将其销毁

## 为WebGL程序对象分配着色器对象
1. 使用渲染绘制上下文接口attachShader(program,shader)往WebGL程序对象添加一个片段或者顶点着色器对象。
   -  program(WebGLProgram)【被添加着色器的WebGL程序对象】
   -  shader(WebGLShader)【被添加到WebGL程序对象的着色器对象】
2. 着色器被赋给WebGL程序对象前，并不一定要为其制定代码或进行编译。把空的着色器对象赋给WebGL程序对象也是可以的。
3. 使用渲染绘制上下文接口detachShader(program,shader)取消着色器对象对WebGL程序对象的分配
   -  program(WebGLProgram)【被添加着色器的WebGL程序对象】
   -  shader(WebGLShader)【被添加到WebGL程序对象的着色器对象】

## 将顶点着色器和片元着色器连接
1. 使用渲染绘制上下文接口linkProgram()将顶点着色器和片元着色器连接起来。
2. 程序对象进行着色器连接操作，需要保证以下要求
    - 顶点着色器和片元着色器的varying变量同名同类型，且一一对应
    - 顶点着色器对每个varying变量已经赋值
    - 顶点着色器和片元着色器中的同名uniform变量也是同类型的
    - 着色器中的attribute变量、uniform变量和varying变量的个数没有超过着色器的上限
3. 在着色器连接后，应当检查连接是否成功。
   
   ### 检测着色器连接状态
   1. 使用渲染绘制上下文接口getProgramParameter(program,pname)获取WebGLProgram的信息，用来检查着色器的连接状态
       - program(WebGLProgram)【指定待获取连接状态的WebGL程序对象】
       - pname(string)【根据pname的不同，返回不同的值】
       1. gl.DELETE_STATUS:标示程序是否已经被删除，返回删除（true）或未删除（GL_FALSE）
       2. gl.LINK_STATUS: 标示程序是否连接成功，返回是（GL_TRUE）或不是（GL_FALSE）
       3. gl.VALIDATE_STATIS: 程序是否已经成功连接，返回是（GL_TRUE）或不是（GL_FALSE）
       4. gl.ATTACHED_SHADERS:已被分配给程序的着色器数量
       5. gl.ACTIVE_ATTRIBUTES:顶点着色器中attribute变量的数量
       6. gl.ACTIVE_UNIFORM_ATTRIBUTES:程序中uniform变量的数量
    2. 使用渲染绘制上下文接口getProgramInfoLog(program)获取连接错误信息
       - program(WebGLProgram)【WebGL程序对象】

## 告知WebGL系统所使用的程序对象
1. 使用渲染绘制上下文接口useProgram()告知WebGL系统绘制时使用指定的WebGL程序对象

## 代码实现
```Javascript
    const canvas = document.createElement('canvas');//获取一个canvas画布[DOM元素对象]

    const gl = canvas.getContext('webgl');//从canvas元素对象获取绘制的上下文[context]

    const VSHADER_SOURCE = 
        "attribute vec4 a_Position;\n" +
        "attribute float a_Position;\n" +
        "void main() {\n" +
        " gl_Position = a_Position;\n" +
        " gl_PointSize = a_PointSize;\n" +
        "}\n";

    const FSHADER_SOURCE = 
        "void main(){\n" +
        "   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n"+
        "}\n";

    const loadShader = (gl,type,source)=>{
        let shader = gl.createShader(type);//创建着色器对象

        gl.shaderSource(shader,source);//填充着色器源码

        gl.compileShader(shader);//编译着色器

        let compiled = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
        if(!compiled){
            let error = gl.getShaderInfoLog(shader);
            console.log("Failed to compile shader:"+error);
            return null
        }
        return shader;
    };

    const createProgram = (gl, vshader, fshader)=>{
        let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
        let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        let program = gl.createProgram();//创建WebGL程序对象
        if (!program) {
            return null;
        }

        // 为WebGL程序对象分配着色器对象
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);

        //将顶点着色器和片元着色器连接
        gl.linkProgram(program);

        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }

    const program = createProgram();
    gl.useProgram(program);//告知WebGL系统所使用的程序对象
    
```

---- 

## 参考资料
- [WebGLRenderingContext - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext)
- [WebGL编程指南](https://book.douban.com/subject/25909351/)