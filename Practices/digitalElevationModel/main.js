const canvas = document.querySelector("#webgl");
const col = 89; //宽
const row = 245; //高

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

    let dem = await loadDem("./dst.dem");
    let vertices = handleDemData(dem);
    let cuboid = createCuboid(vertices);
    let indexCount = initVertexBuffer(gl, program, vertices);
    let { minX, minY, minZ, maxX, maxY, maxZ } = cuboid;
    //包围盒中心
    let cx = (minX + maxX) / 2.0;
    let cy = (minY + maxY) / 2.0;
    let cz = (minZ + maxZ) / 2.0;

    //根据视点高度算出setPerspective()函数的合理角度
    const eyeHeight = 10000;
    let fovy = (maxY - minY) / 2.0 / eyeHeight;
    fovy = 180.0 / Math.PI * Math.atan(fovy) * 2;

    let modelMatrix = new Matrix4();
    modelMatrix.translate(-cx, -cy, -cz);


    let viewMatrix = new Matrix4();
    viewMatrix.lookAt(0, 0, eyeHeight, 0, 0, 0, 0, 1, 0);


    let projMatrix = new Matrix4();
    projMatrix.setPerspective(fovy, canvas.width / canvas.height, 10, 10000);


    let mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);


    let u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES,indexCount,gl.UNSIGNED_SHORT,0);
}

const initVertexBuffer = (gl, program, vertices) => {
    let PSIZE = vertices.BYTES_PER_ELEMENT;
    let indices = new Uint16Array((row - 1) * (col - 1) * 6);

    // v0 - - - v1  
    // |     /  |
    // |    /   |
    // |   /    |
    // | /      |
    // v2 - - - v3
    let indicesIdx = 0;
    for (let i = 0; i < row - 1; i++) {// 高
        for (let j = 0; j < col - 1; j++) { //宽
            indices[indicesIdx * 6] = i * col + j;               //v0
            indices[indicesIdx * 6 + 1] = (i + 1) * col + j;     //v2
            indices[indicesIdx * 6 + 2] = i * col + j + 1;       //v1
            indices[indicesIdx * 6 + 3] = (i + 1) * col + j;     //v2
            indices[indicesIdx * 6 + 4] = (i + 1) * col + j + 1; //v3
            indices[indicesIdx * 6 + 5] = i * col + j + 1;       //v1
            indicesIdx++;
        }
    }

    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, "a_Position");
    let a_Color = gl.getAttribLocation(program, "a_Color");

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, PSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);


    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, PSIZE * 6, PSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

const loadDem = (url) => {
    return new Promise((resolve) => {
        fetch(url).then((res) => res.text()).then((text) => resolve(text));
    })
}

const handleDemData = (text) => {
    let stringLines = text.split("\n");
    let verticesColors = new Float32Array(stringLines.length * 6);
    let i = 0, j = 0;
    stringLines.forEach((line) => {
        if (line) {
            let subline = line.split(",");
            if (subline.length != 6) {
                throw new Error("dem文件格式有误！")
            }
            subline.forEach((item) => {
                verticesColors[i] = parseFloat(item);
                i++;
            })
            j++;
        }
    })
    return verticesColors;
}

const createCuboid = (vertices) => {
    let minX = Number.MAX_VALUE, maxX = Number.MIN_VALUE,
        minY = Number.MAX_VALUE, maxY = Number.MIN_VALUE,
        minZ = Number.MAX_VALUE, maxZ = Number.MIN_VALUE;
    let len = vertices.length / 6;
    for (let i = 0; i < len; i++) {
        let verticeX = vertices[i * 6];
        let verticeY = vertices[i * 6 + 1];
        let verticeZ = vertices[i * 6 + 2];
        minX = Math.min(minX, verticeX);
        maxX = Math.max(maxX, verticeX);
        minY = Math.min(minY, verticeY);
        maxY = Math.max(maxY, verticeY);
        minZ = Math.min(minZ, verticeZ);
        maxZ = Math.max(maxZ, verticeZ);
    }
    return { minX, minY, minZ, maxX, maxY, maxZ };
}
