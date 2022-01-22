const canvas = document.querySelector("#webgl");

let main = async () => {

    let gl = canvas.getContext("webgl");

    let VSHADER_SOURCE = await loadGLSL("./shader/shader.vert");
    let FRAGMENT_SOURCE = await loadGLSL("./shader/shader.frag");

    let instanceExt = gl.getExtension("ANGLE_instanced_arrays");
    //创建着色器对象
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vShader, VSHADER_SOURCE);
    gl.shaderSource(fShader, FRAGMENT_SOURCE);
    gl.compileShader(vShader);
    gl.compileShader(fShader);


    //创建着色器程序对象
    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    initVertexBuffer(gl, instanceExt, program);

    let tick = () => {
        update(gl,instanceExt);
        requestAnimationFrame(tick);
    }

    tick();
}

const initVertexBuffer = (gl, instanceExt, program) => {
    var vaoExt = gl.getExtension("OES_vertex_array_object");
    var vao = vaoExt.createVertexArrayOES();
    vaoExt.bindVertexArrayOES(vao);

    let a_Position = gl.getAttribLocation(program, "a_Position");
    let a_Color = gl.getAttribLocation(program, "a_Color");
    let a_Offset = gl.getAttribLocation(program, "a_Offset");

    let vertices = [
        -0.05, 0.05,
        0.05, -0.05,
        -0.05, -0.05,

        -0.05, 0.05,
        0.05, -0.05,
        0.05, 0.05
    ]
    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 1.0
    ]
    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    let offsets = [];
    let offset = 0.1;
    for (let y = -10; y < 10; y += 2) {
        for (let x = -10; x < 10; x += 2) {
            offsets.push(x / 10.0 + offset);
            offsets.push(y / 10.0 + offset);
        }
    }

    let offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Offset, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Offset);
    instanceExt.vertexAttribDivisorANGLE(a_Offset, 1);


}


const update = (gl,instanceExt) => {
    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    instanceExt.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, 100);

}




