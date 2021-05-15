// 阴影贴图
const SHADOW_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_MvpMatrix;
    void main(){
        gl_Position = u_MvpMatrix * a_Position; // 光源视点下各个坐标的位置
    }
`;

const SHADOW_FSHADER_SOURCE = `
    precision mediump float;
    void main(){
        const vec4 bitShift = vec4(1.0,256.0,256.0*256.0,256.0*256.0*256.0);
        const vec4 bitMask = vec4(1.0/256.0,1.0/256.0,1.0/256.0,0.0);
        vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
        rgbaDepth -= rgbaDepth.gbaa * bitMask;
        gl_FragColor = rgbaDepth;
     }
`;

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_MvpMatrixFromLight;
    varying vec4 v_PositionFromLight;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionFromLight = u_MvpMatrixFromLight * a_Position; // 阴影贴图的的坐标
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_ShadowMap;
    varying vec4 v_PositionFromLight;
    varying vec4 v_Color;
    
    float unpackDepth(const in vec4 rgbaDepth){
        const vec4 bitShift = vec4(1.0,1.0/256.0,1.0/(256.0*256.0),1.0/(256.0*256.0*256.0));
        float depth = dot(rgbaDepth,bitShift);
        return depth;
    }

    void main(){
        // gl_FragCoord是片元的坐标，Z分量是深度值
        // 通过(gl_Position.xyz/gl_Position.w)/2.0+0.5计算出来
        // 齐次坐标中，通过xyz/w取得空间坐标位置
        // (xyz/w)/2 -> 将坐标区间[-1,1]转换为[-0.5,0.5]一个单位区间
        // (xyz/w)/2 + 0.5 -> 将坐标区间归一化到[0,1]

        vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5; //当前点转换为单位空间坐标
        vec4 rgbaDepth = texture2D(u_ShadowMap,shadowCoord.xy); // 同样的坐标，但深度不一样，因为在非光源视点能看到面照射下的阴影，而光源视点不能看到阴影
        float depth = unpackDepth(rgbaDepth); // 从R分量中获取Z值
        float visibility = (shadowCoord.z > depth + 0.0015)?0.7:1.0; // 阴影的坐标shadowCoord是通过使用 偏差值0.005消除马赫带
        // 同一坐标，深度不一致，说明该片元处于阴影下
        gl_FragColor = vec4(v_Color.rgb*visibility,v_Color.a);
    }
`;

const OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
const LIGHT_X = 0; LIGHT_Y = 40, LIGHT_Z = 2;

const main = async () => {
    let canvas = document.querySelector("#webgl");
    let gl = canvas.getContext("webgl");

    //创建着色器程序对象
    let shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, "a_Position");
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, "u_MvpMatrix");


    let program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    program.a_Position = gl.getAttribLocation(program, "a_Position");
    program.a_Color = gl.getAttribLocation(program, "a_Color");
    program.u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");
    program.u_MvpMatrixFromLight = gl.getUniformLocation(program, "u_MvpMatrixFromLight");
    program.u_ShadowMap = gl.getUniformLocation(program, "u_ShadowMap");

    let triangle = initVertexBuffersForTriangle(gl);
    let plane = initVertexBuffersForPlane(gl);
    let fbo = initFramebufferObject(gl);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(45.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let viewProjMatrixFromLight = new Matrix4();
    viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
    viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let currentAngle = 0.0;
    let mvpMatrixFromLight_t = new Matrix4(); // 光源视点下的三角形的模型投影矩阵
    let mvpMatrixFromLight_p = new Matrix4(); // 光源视点下的平面的模型投影矩阵
    let tick = () => {
        currentAngle = animate(currentAngle);

        //切换绘制场景为帧缓冲区
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT); // Set view port for FBO
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   // Clear FBO    

        gl.useProgram(shadowProgram); // 创建阴影贴图
        //
        drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight); // 以光源为视点下的绘制
        mvpMatrixFromLight_t.set(g_mvpMatrix); // Used later
        drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight); // 以光源为视点下的绘制
        mvpMatrixFromLight_p.set(g_mvpMatrix); // Used later

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);               // Change the drawing destination to color buffer
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear color and depth buffer

        gl.useProgram(program); // Set the shader for regular drawing
        gl.uniform1i(program.u_ShadowMap, 0);  // Pass 0 because gl.TEXTURE0 is enabled
        // Draw the triangle and plane ( for regular drawing)
        gl.uniformMatrix4fv(program.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);// 更新光源的投影矩阵的数据
        drawTriangle(gl, program, triangle, currentAngle, viewProjMatrix);//三角形 在原来视点的位置下的绘制
        gl.uniformMatrix4fv(program.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
        drawPlane(gl, program, plane, viewProjMatrix);//平面 在原来视点的位置下的绘制

        window.requestAnimationFrame(tick);
    }
    tick();
}

const initAttributeVariable = (gl, attribute, buffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}

const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normallMatrix = new Matrix4();


const initVertexBuffersForTriangle = (gl) => {
    // Create a triangle
    //       v2
    //      / | 
    //     /  |
    //    /   |
    //  v0----v1

    // Vertex coordinates
    var vertices = new Float32Array([
        -0.8, 3.5, 0.0,
        0.8, 3.5, 0.0,
        0.0, 3.5, 1.8
    ]);
    // Colors
    var colors = new Float32Array([
        1.0, 0.5, 0.0,
        1.0, 0.5, 0.0,
        1.0, 0.0, 0.0
    ]);
    // Indices of the vertices
    var indices = new Uint8Array([0, 1, 2]);

    var o = {};  // Utilize Object object to return multiple buffer objects together

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBuffer(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE);

    o.numIndices = indices.length;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

const initVertexBuffersForPlane = (gl) => {
    let vertices = new Float32Array([
        3.0, -1.7, 2.5, -3.0, -1.7, 2.5, -3.0, -1.7, -2.5, 3.0, -1.7, -2.5    // v0-v1-v2-v3
    ]);


    let colors = new Float32Array([
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0
    ]);


    // Indices of the vertices
    let indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

    let o = {};

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBuffer(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE);

    o.numIndices = indices.length;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

const initArrayBuffer = (gl, data, num, type) => {
    let buffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    buffer.num = num;
    buffer.type = type;
    return buffer;

}

const initElementArrayBuffer = (gl, data, type) => {
    let buffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    buffer.type = type;
    return buffer;
}

const createProgram = (gl, VSHADER_SOURCE, FSHADER_SOURCE) => {
    //创建着色器对象
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vShader, VSHADER_SOURCE);
    gl.shaderSource(fShader, FSHADER_SOURCE);
    gl.compileShader(vShader);
    gl.compileShader(fShader);

    //创建着色器程序对象
    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    return program;
}

let last = Date.now();
const ANGLE_STEP = 30;
const animate = (angle) => {
    let now = Date.now();
    let elapsed = now - last;
    last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    return newAngle % 360;
}

const drawPlane = (gl, program, plane, viewProjMatrix) => {
    g_modelMatrix.setRotate(-45, 0, 1, 1);
    draw(gl, program, plane, viewProjMatrix);
}

const drawTriangle = (gl, program, triangle, angle, viewProjMatrix) => {
    g_modelMatrix.setRotate(angle, 0, 1, 0);
    draw(gl, program, triangle, viewProjMatrix);
}



function draw(gl, program, o, viewProjMatrix) {
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    if (program.a_Color != undefined) // If a_Color is defined to attribute
        initAttributeVariable(gl, program.a_Color, o.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

const initFramebufferObject = (gl) => {

    let framebuffer = gl.createFramebuffer(), // 帧缓冲区对象
        texture = gl.createTexture(),   // 纹理对象【用作颜色关联对象】
        depthBuffer = gl.createRenderbuffer(); // 渲染缓冲区对象【用作深度关联对象替代深度缓存区】

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    framebuffer.texture = texture;

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // 分别将纹理对象和渲染缓冲区对象关联到帧缓冲对象上
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
}
