const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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

let g_last = Date.now(),
ANGLE_STEP = 45.0;
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

    let modelMatrix = new Matrix4();
    let u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");

    let projMatrix = new Matrix4();
    let u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");

    let viewMatrix = new Matrix4();
    let u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");

    modelMatrix.setTranslate(0.75, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 300);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, ponitCount);

    modelMatrix.setTranslate(-0.75, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, ponitCount);
}


const initVertexBuffers = (gl, program) => {
    let vertices = new Float32Array([
        //顶点坐标 (xyz) & 颜色（rgb）
        0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
         0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 
    
         0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
         0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 
    
         0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
         0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 
    ]);
    let FSIZE = vertices.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer(); //创建缓冲区对象

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    //动态设置source
    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//解除绑定

    return 9;
}

