const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_modelMatrix;
    void main(){
        gl_Position = u_modelMatrix * a_Position;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }
`;

let g_last = Date.now(),
    ANGLE_STEP = 45.0,
    g_currentAngle = 0.0,
    g_requestID;

function main() {
    let canvas = document.querySelector("#webgl");
    
    canvas.addEventListener('webglcontextlost', contextLost, false);
    canvas.addEventListener('webglcontextrestored', (ev) => { start(canvas); }, false);
    start(canvas); 
}

const contextLost = (e)=>{
    console.warn(e);
    cancelAnimationFrame(g_requestID);
    e.preventDefault();
}

const start = (canvas) => {
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


    let u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    let ponitCount = initVertexBuffers(gl, program);

    let modelMatrix = new Matrix4();
    let u_modelMatrix = gl.getUniformLocation(program, "u_modelMatrix");

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    let tick = () => {
        g_currentAngle = animate(g_currentAngle); 
        draw(gl, ponitCount, g_currentAngle, modelMatrix, u_modelMatrix);
        g_requestID = requestAnimationFrame(tick);
    }
    tick();
}

const initVertexBuffers = (gl, program) => {
    let vertices = new Float32Array([
        0.0, 0.3,
        0.3, -0.3,
        -0.3, -0.3,//gl.TRIANGLES

    ]);
    let vertexBuffer = gl.createBuffer(); //创建缓冲区对象

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    //动态设置source
    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return vertices.length / 2;
}

const draw = (gl, count, angle, modelMatrix, u_modelMatrix) => {
    modelMatrix.setRotate(angle, 0, 0, 1);

    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, count);

}

const animate = (angle) => {
    let now = new Date();
    let elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    return newAngle %= 360;
}

