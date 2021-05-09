const fontSize = 32.0;
const text = "一二三四五六七八九十";
const color = [0, 0, 0];
const type = 3;//1：单色 2：纹理采样色 3：采样渐变色
let canvas = document.querySelector("#webgl");
let main = async () => {
    let gl = canvas.getContext("webgl");

    let vShader = gl.createShader(gl.VERTEX_SHADER);
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);

    let VSHADER_SOURCE = await loadGLSL("./shader/shader.vert");
    let FRAGMENT_SOURCE = await loadGLSL("./shader/shader.frag");

    gl.shaderSource(vShader, VSHADER_SOURCE);
    gl.shaderSource(fShader, FRAGMENT_SOURCE);

    gl.compileShader(vShader);
    gl.compileShader(fShader);


    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    gl.useProgram(program);
    // console.log(gl.getProgramInfoLog(program));
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertices = new Float32Array(createVertices(canvas.width, canvas.height, fontSize));
    initVertexBuffer(gl, program, vertices);
    initFragMent(gl, program);
    let textImage = createTextTextrue(text, fontSize);

    let btn = document.querySelector("#file");
    let image = new Image;
    btn.addEventListener('change', async (e) => {
        let files = e.currentTarget.files;
        let url = window.URL.createObjectURL(files[0]);
        await loadImage(image, url);
        initTexture(gl, program, "u_Sampler0", image, 0);
        initTexture(gl, program, "u_Sampler1", textImage, 1);
        gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
    })

}

const initVertexBuffer = (gl, program, vertices) => {
    let verticesBuffer = gl.createBuffer();

    let a_Position = gl.getAttribLocation(program, "a_Position");
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    let u_PointSize = gl.getUniformLocation(program, "u_PointSize");
    gl.uniform1f(u_PointSize, fontSize);

    let u_Resolution = gl.getUniformLocation(program, "u_Resolution");
    gl.uniform2fv(u_Resolution, [canvas.width, canvas.height]);
}

const initFragMent = (gl, program) => {
    let u_Len = gl.getUniformLocation(program, "u_Len");
    gl.uniform1f(u_Len, text.length);

    let u_Color = gl.getUniformLocation(program, "u_Color");
    gl.uniform3fv(u_Color, color);

    let u_Type = gl.getUniformLocation(program, "u_Type");
    gl.uniform1i(u_Type, type);
}

let loadImage = (image, url) => {
    return new Promise((resolve) => {
        image.src = url;
        image.onload = () => {
            resolve();
        }
    })
}

let initTexture = (gl, program, sampler, image, i) => {
    let textureBuffer = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(program, sampler);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, i);

}



let createTextTextrue = (text, fontSize) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = fontSize * text.length;
    canvas.height = fontSize;

    ctx.font = `${fontSize}px 微软雅黑`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    text.split("").forEach((word, i) => {
        ctx.fillText(word, i * fontSize + fontSize / 2, fontSize / 2);
    });

    return canvas;
}


let createVertices = (width, height, step) => {
    let vertices = [];
    for (let i = 0; i < height; i += step) {
        for (let j = 0; j < width; j += step) {
            vertices.push(j, i); // (0,i),(j+=step,i) 横向
        }
    }
    return vertices;
}

const isPowerOf2 = (value) => {
    return !(value & (value - 1));
}