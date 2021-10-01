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


    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);

    let ponitCount = initVertexBuffer(gl, program);
    await initTexture(gl, program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, ponitCount);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

const initVertexBuffer = (gl, program) => {
    let verticesTexCoords = new Float32Array([
        // 顶点坐标&纹理坐标
        -0.5, 0.5, 0.0, 1.0, //左上角
        -0.5, -0.5, 0.0, 0.0,//左下角
        0.5, 0.5, 1.0, 1.0,//右上角
        0.5, -0.5, 1.0, 0.0//右下角
    ]);
    let vertexTexCoordBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    //动态设置source
    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return 4;

}

async function initTexture(gl, program) {
    initContext(gl);
    var type = getSupportedCompressedTextureType(gl);

    console.log(type);
    var url;
    switch (type) {
        case 's3tc':
            url = './assets/example-s3tc.dds';
            // url = './assets/example-s3tc.ktx';
            break;
        case 'etc1':
            url = '../images/land-rover-diffuse.pkm';
            break;
        case 'pvrtc':
            url = '../images/land-rover-diffuse.pvr';
            break;
        case "image":
            url = "./assets/example.jpeg";
            break;
    }
    let u_Sampler = gl.getUniformLocation(program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);
    await loadTexture(url, 1024, 1024);

}




