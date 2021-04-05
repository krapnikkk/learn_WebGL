const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main(){
        gl_Position = a_Position;
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

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);

    let ponitCount = initVertexBuffer(gl, program);

    initTextures(gl, program, ponitCount);

}

const initVertexBuffer = (gl, program) => {
    let verticesTexCoords = new Float32Array([
        // 顶点坐标&纹理坐标
        -0.5, 0.5, -0.3, 1.7, //左上角
        -0.5, -0.5, -0.3, -0.2,//左下角
        0.5, 0.5, 1.7, 1.7,//右上角
        0.5, -0.5, 1.7, -0.2//右下角
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

const initTextures = (gl, program, count) => {
    let u_Sampler = gl.getUniformLocation(program, "u_Sampler");
    let image = new Image();
    image.src = "../resources/sky.jpeg";
    image.onload = () => {
        loadTexture(gl, count, u_Sampler, image);
    }
}

const loadTexture = (gl, count, sampler, image) => {
    let texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行y轴翻转

    gl.activeTexture(gl.TEXTURE0);//开启0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture);// 向target绑定纹理对象

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);//配置纹理参数
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
}