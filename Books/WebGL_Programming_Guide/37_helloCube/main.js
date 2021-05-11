const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`;

function main() {
    let canvas = document.querySelector("#webgl");
    let gl = canvas.getContext("webgl");

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
    gl.useProgram(program);
    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let ponitCount = initVertexBuffers(gl, program);

    let mvpMatrix = new Matrix4();
    let u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");

    mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 300);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,ponitCount,gl.UNSIGNED_BYTE,0);
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
    let verticesColors = new Float32Array([
        //顶点坐标 (xyz) & 颜色（rgb）
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
    ]);

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5
    ])
    let FSIZE = verticesColors.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer(); //创建缓冲区对象
    let indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    //动态设置source
    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//解除绑定

    return indices.length;
}

