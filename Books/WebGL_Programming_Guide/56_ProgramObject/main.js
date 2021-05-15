const SOLID_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    void main(){
        vec3 lightDirection = vec3(0.0,0.0,1.0);
        vec4 color = vec4(0.0,1.0,1.0,1.0); // 物体表面颜色
        vec3 lightColor = vec3(1.0,1.0,1.0);// 白光 可直接省略
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix*a_Normal)); // 法线
        float nDotL = max(0.0,dot(normal,lightDirection));
        vec3 diffuse = lightColor * color.rgb * nDotL; // 漫反射
        v_Color = vec4(diffuse,color.a);
    }
`;

const SOLID_FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`;

const TEXTURE_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying float v_NdotL;
    varying vec2 v_TexCoord;
    void main(){
        vec3 lightDirection = vec3(0.0,0.0,1.0);
        vec4 color = vec4(0.0,1.0,1.0,1.0); // 物体表面颜色
        
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix*a_Normal)); // 法线
        v_NdotL= max(0.0,dot(normal,lightDirection));
        v_TexCoord = a_TexCoord;
    }
`;

const TEXTURE_FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    varying float v_NdotL;
    void main(){
        vec4 color = texture2D(u_Sampler,v_TexCoord);
        vec3 lightColor = vec3(1.0,1.0,1.0);// 白光
        vec3 diffuse = lightColor * color.rgb * v_NdotL; // 漫反射
        gl_FragColor = vec4(diffuse,color.a);
    }
`;

const main = async () => {
    let canvas = document.querySelector("#webgl");
    let gl = canvas.getContext("webgl");

    //创建着色器程序对象
    let soildProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
    let texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    let cube = initVertexBuffers(gl, soildProgram);
    let texture = await initTexture(gl, texProgram,"../resources/sky.jpeg");

    soildProgram.a_Position = gl.getAttribLocation(soildProgram, "a_Position");
    soildProgram.a_Normal = gl.getAttribLocation(soildProgram, "a_Normal");
    soildProgram.u_MvpMatrix = gl.getUniformLocation(soildProgram, "u_MvpMatrix");
    soildProgram.u_NormalMatrix = gl.getUniformLocation(soildProgram, "u_NormalMatrix");

    texProgram.a_Position = gl.getAttribLocation(texProgram, "a_Position");
    texProgram.a_Normal = gl.getAttribLocation(texProgram, "a_Normal");
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, "a_TexCoord");
    texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, "u_MvpMatrix");
    texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, "u_NormalMatrix");
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, "u_Sampler");


    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let currentAngle = 0.0;
    let tick = () => {
        currentAngle = animate(currentAngle);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawSolidCube(gl, soildProgram, cube, -2.0, currentAngle, viewProjMatrix);
        drawTexCube(gl, texProgram, cube, texture, 2.0, currentAngle, viewProjMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}


const initVertexBuffers = (gl, program) => {
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

    var normals = new Float32Array([   // Normal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,     // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0      // v4-v7-v6-v5 back
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
    o.normalBuffer = initArrayBuffer(gl, normals, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBuffer(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBuffer(gl, indices, gl.UNSIGNED_BYTE);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    o.numIndices = indices.length;

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
    gl.useProgram(program);
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
const drawCube = (gl, program, vertex, positionX, angle, viewProjMatrix) => {
    g_modelMatrix.setTranslate(positionX, 0.0, 0.0);
    g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);//x轴
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);//y轴

    g_normallMatrix.setInverseOf(g_modelMatrix);// 模型矩阵的逆矩阵
    g_normallMatrix.transpose();//转置
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normallMatrix.elements);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

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