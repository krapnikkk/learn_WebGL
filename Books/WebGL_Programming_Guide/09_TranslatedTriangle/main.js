const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    uniform vec4 u_Translation;
    void main(){
        gl_Position = a_Position + u_Translation;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
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


    let u_FragColor = gl.getUniformLocation(program, "u_FragColor");
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    let u_Translation = gl.getUniformLocation(program, "u_Translation");
    let tx = 0.5, ty = 0.5, tz = 0.5;
    gl.uniform4f(u_Translation, tx, ty, tz,0.0);

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);

    let ponitCount = initVertexBuffers(gl, program);

    //绘制
    gl.drawArrays(gl.TRIANGLES, 0, ponitCount);

}

const initVertexBuffers = (gl, program) => {
    let vertices = new Float32Array([
        0.0, 0.5,
        0.5, -0.5,
        -0.5, -0.5,//gl.TRIANGLES

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
