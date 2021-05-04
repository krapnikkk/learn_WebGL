const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    varying vec2 v_TexCoord;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main(){
        gl_FragColor = texture2D(u_Sampler,v_TexCoord);
    }
`;

const OFFSCREEN_WIDTH = 256, OFFSCREEN_HEIGHT = 256;

const main = async () => {
    let canvas = document.querySelector("#webgl");
    let gl = canvas.getContext("webgl");

    //创建着色器程序对象
    let program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);


    program.a_Position = gl.getAttribLocation(program, "a_Position");
    program.a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
    program.u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");
    program.u_Sampler = gl.getUniformLocation(program, "u_Sampler");

    let cube = initVertexBuffersForCube(gl);
    let plane = initVertexBuffersForPlane(gl);
    let texture = await initTexture(gl, program, "../resources/sky.jpeg");
    let fbo = initFramebufferObject(gl);

    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let viewProjMatrixFBO = new Matrix4();
    viewProjMatrixFBO.setPerspective(30.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
    viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let currentAngle = 0.0;
    let tick = () => {
        currentAngle = animate(currentAngle);
        draw(gl, program, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);
        requestAnimationFrame(tick);
    }
    tick();
}


const initVertexBuffersForCube = (gl) => {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let vertices = new Float32Array([
        //顶点坐标 (xyz)
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
    ]);

    var texCoords = new Float32Array([   // Texture coordinates
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0     // v4-v7-v6-v5 back
    ]);

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ])

    let o = {};
    o.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBuffer(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    o.numIndices = indices.length;

    return o;
}

const initVertexBuffersForPlane = (gl) => {
    let vertices = new Float32Array([
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0    // v0-v1-v2-v3
    ]);

    // Texture coordinates
    let texCoords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);

    // Indices of the vertices
    let indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

    let o = {};

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBuffer(gl, texCoords, 2, gl.FLOAT);
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

const drawSolidCube = (gl, program, vertex, positionX, angle, viewProjMatrix) => {
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, vertex.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, vertex.normalBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex.indexBuffer);

    drawCube(gl, program, vertex, positionX, angle, viewProjMatrix);
}

const drawTexCube = (gl, program, vertex, texture, positionX, angle, viewProjMatrix) => {
    initAttributeVariable(gl, program.a_Position, vertex.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, vertex.normalBuffer);
    initAttributeVariable(gl, program.a_TexCoord, vertex.texCoordBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex.indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    drawCube(gl, program, vertex, positionX, angle, viewProjMatrix);
}

const initAttributeVariable = (gl, attribute, buffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}

const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normallMatrix = new Matrix4();
const drawTexturedCube = (gl, program, vertex, angle, texture, viewProjMatrix) => {
    g_modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    drawTexturedObject(gl, program, vertex, texture);
}

const drawTexturedPlane = (gl, program, vertex, angle, texture, viewProjMatrix) => {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(0, 0, 1);
    g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    drawTexturedObject(gl, program, vertex, texture);
}


const drawTexturedObject = (gl, program, vertex, texture) => {
    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position, vertex.vertexBuffer);    // Vertex coordinates
    initAttributeVariable(gl, program.a_TexCoord, vertex.texCoordBuffer);  // Texture coordinates

    // Bind the texture object to the target
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex.indexBuffer);
    gl.drawElements(gl.TRIANGLES, vertex.numIndices, vertex.indexBuffer.type, 0);
}

const initTexture = (gl, program, url) => {
    return new Promise((resolve) => {
        let texture = gl.createTexture();
        let image = new Image();
        image.onload = () => {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.useProgram(program);
            gl.uniform1i(program.u_Sampler, 0);

            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(texture);
        }
        image.src = url;
    })
}

const initFramebufferObject = (gl) => {
    let framebuffer = gl.createFramebuffer(),
        texture = gl.createTexture(),
        depthBuffer = gl.createRenderbuffer();

    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    framebuffer.texture = texture;

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);


    return framebuffer;
}

const draw = (gl, program, canvas, fbo, plane, cube, angle, texture, viewProjMatrix, viewProjMatrixFBO) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.clearColor(0.2, 0.2, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawTexturedCube(gl, program, cube, angle, texture, viewProjMatrixFBO);   // Draw the cube

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);        // Change the drawing destination to color buffer
    gl.viewport(0, 0, canvas.width, canvas.height);  // Set the size of viewport back to that of <canvas>

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color buffer

    drawTexturedPlane(gl, program, plane, angle, fbo.texture, viewProjMatrix);

}