// const { glMatrix } = require("../utlis/gl-matrix");

// const { glMatrix } = require("../utlis/gl-matrix");

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
        // gl_FragCoord是片元的坐标，Z分量是深度值
        // 将阴影贴图片元的深度值写入R分量中【只有被照射到的片元的每个点与光源的位置，没有照射到的信息不会被记录下来】
        // 在光源视点下看到的只有一个面，阴影不会被看到
        gl_FragColor = vec4(gl_FragCoord.z,0.0,0.0,0.0); // 主要作用用作存储物体在光源坐标下的深度z值
     }
`;

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_MvpMatrixFromLight;
    varying vec4 v_PositionFromLight;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionFromLight = u_MvpMatrixFromLight * a_Position; // 光源视点时的模型视图投影矩阵
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(0.2,0.2,0.2,1.0);        //片元最终颜色为阴影的颜色
    }
`;

const OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
const LIGHT_X = 0; LIGHT_Y = 7, LIGHT_Z = 2;

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
    // let fbo = initFramebufferObject(gl);


    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // 光源下的视点
    let viewProjMatrixFromLight = glMatrix.mat4.create();
    glMatrix.mat4.perspective(viewProjMatrixFromLight, 70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
    glMatrix.mat4.lookAt(viewProjMatrixFromLight, [LIGHT_X, LIGHT_Y, LIGHT_Z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    // viewProjMatrixFromLight.perspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
    // viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // 正常视点
    let viewProjMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(viewProjMatrix, 45.0, canvas.width / canvas.height, 1.0, 100.0);
    glMatrix.mat4.lookAt(viewProjMatrix, [0.0, 7.0, 9.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    // viewProjMatrix.perspective(45.0, canvas.width / canvas.height, 1.0, 100.0);
    // viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let currentAngle = 0.0;
    let mvpMatrixFromLight_t = glMatrix.mat4.create(); // 光源视点下的三角形的模型投影矩阵
    let mvpMatrixFromLight_p = glMatrix.mat4.create(); // 光源视点下的平面的模型投影矩阵
    let tick = () => {
        currentAngle = animate(currentAngle);

        //切换绘制场景为帧缓冲区
        // gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT); // Set view port for FBO
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   // Clear FBO    

        // gl.useProgram(shadowProgram); // 创建阴影贴图

        // //先画一个以光源为视点的平面和三角形->只能看到一个平面
        // drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight); // 以光源为视点下的绘制
        // mvpMatrixFromLight_t.set(g_mvpMatrix); // Used later
        // drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight); // 以光源为视点下的绘制
        // mvpMatrixFromLight_p.set(g_mvpMatrix); // Used later

        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);               // Change the drawing destination to color buffer
        // gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear color and depth buffer

        gl.useProgram(program); // Set the shader for regular drawing
        gl.uniform1i(program.u_ShadowMap, 0);  // Pass 0 because gl.TEXTURE0 is enabled
        // 正常视点下的绘制，绘制三角形和平面
        gl.uniformMatrix4fv(program.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t);// 光源下的模型视图投影矩阵，用来对比同视点的深度
        drawTriangle(gl, program, triangle, currentAngle, viewProjMatrix);//三角形 在原来视点的位置下的绘制
        gl.uniformMatrix4fv(program.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p);
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

const g_modelMatrix = glMatrix.mat4.create();
const g_mvpMatrix = glMatrix.mat4.create();
const g_normallMatrix = glMatrix.mat4.create();


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
    let axis = glMatrix.vec3.create(0, 1, 1);
    glMatrix.mat4.fromRotation(viewProjMatrix,-45,axis);
    // g_modelMatrix.rotate(viewProjMatrix,-45, 0, 1, 1);
    draw(gl, program, plane, viewProjMatrix);
}

const drawTriangle = (gl, program, triangle, angle, viewProjMatrix) => {
    let axis = glMatrix.vec3.create(0, 1, 0);
    glMatrix.mat4.fromRotation(viewProjMatrix,angle,axis);
    // g_modelMatrix.setRotate(angle, 0, 1, 0);
    draw(gl, program, triangle, viewProjMatrix);
}



function draw(gl, program, o, viewProjMatrix) {
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    if (program.a_Color != undefined) // If a_Color is defined to attribute
        initAttributeVariable(gl, program.a_Color, o.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    // g_mvpMatrix.set(viewProjMatrix);
    // g_mvpMatrix.multiply(g_modelMatrix);
    glMatrix.mat4.multiply(g_mvpMatrix,viewProjMatrix,g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix);

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
