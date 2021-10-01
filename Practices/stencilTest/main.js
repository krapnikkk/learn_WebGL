const canvas = document.querySelector("#webgl");

let main = async () => {

    let gl = canvas.getContext("webgl", {
        stencil: true
    });

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



    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.STENCIL_BUFFER_BIT);

    gl.enable(gl.STENCIL_TEST);

    initVertexBuffer(gl, program);

}

const initVertexBuffer = (gl, program) => {
    // 用作蒙板的三角形
    let colors = [
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1
    ]
    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    // Always pass test
    gl.stencilFunc(gl.ALWAYS, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.stencilMask(0xff);
    gl.colorMask(0, 0, 0, 0); // No need to display the triangle

    let stencilVertex = [
        -0.2, -0.5, 0,
        0.4, -0.5, 0,
        0.3, 0.6, 0
    ];
    
    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stencilVertex), gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

     // Pass test if stencil value is 1
     gl.stencilFunc(gl.EQUAL, 1, 0xFF);
     gl.stencilMask(0x00);
     gl.colorMask(1, 1, 1, 1);
    // 被裁剪的三角形
    colors = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vertices = [
        -0.5, -0.2, 0,
        0.5, -0.2, 0,
        0, 0.6, 0
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}





