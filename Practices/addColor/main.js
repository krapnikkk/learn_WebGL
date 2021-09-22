const canvas = document.querySelector("#webgl");

let main = async () => {

    let gl = canvas.getContext("webgl");

    let VSHADER_SOURCE = await loadGLSL("./shader/shader.vert");
    let FRAGMENT_SOURCE = await loadGLSL("./shader/shader.frag");
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


    initVertexBuffer(gl, program);

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);



    let tick = () => {
        update(gl);
        requestAnimationFrame(tick);
    }

    tick();
}

const initVertexBuffer = (gl, program) => {
    let a_Position = gl.getAttribLocation(program, "a_Position");
    let a_Color = gl.getAttribLocation(program, "a_Color");

    let vertices = [
        -0.5, -0.2, 0,
        0.5, -0.2, 0,
        0, 0.6, 0
    ]
    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);



    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    let colors = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
    ]
    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);


}


const update = (gl) => {
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}




