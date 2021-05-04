const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_ModelMatrix;
    uniform vec4 u_Eye; // 视点
    varying vec4 v_Color;
    varying float v_Dist;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
        // v_Dist = distance(u_ModelMatrix*a_Position,u_Eye);// 视点距离物体的距离
        v_Dist = gl_Position.w;//w分量的值就是顶点的视图坐标的Z分量乘以-1
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec3 u_FogColor;
    uniform vec2 u_FogDist;
    varying float v_Dist;
    varying vec4 v_Color;
    void main(){
        float fogFactor = clamp((u_FogDist.y-v_Dist)/(u_FogDist.y,u_FogDist.x),0.0,1.0);
        // mix(a,b,c)=>a*(1-c)+b*c
        // u_FogColor*(1-fogFactor)+v_Color * fogFactor
        vec3 color = mix(u_FogColor,vec3(v_Color),fogFactor);
        gl_FragColor = vec4(color,v_Color.a);
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

    let fogColor = new Float32Array([0.137, 0.231, 0.423]);//rgb
    // 雾化的起点与终点与视点间的距离[起点距离,终点距离]
    let fogDist = new Float32Array([55, 80]);
    let eye = new Float32Array([25, 65, 35,1.0]);

    let u_FogColor = gl.getUniformLocation(program, "u_FogColor");
    let u_FogDist = gl.getUniformLocation(program, "u_FogDist");
    let u_Eye = gl.getUniformLocation(program, "u_Eye");
    gl.uniform3fv(u_FogColor, fogColor);
    gl.uniform2fv(u_FogDist, fogDist);
    gl.uniform4fv(u_Eye, eye);

    //绘制背景色
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);

    let ponitCount = initVertexBuffers(gl, program);

    let modelMatrix = new Matrix4();
    modelMatrix.setScale(10, 10, 10);
    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 1000);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    // mvpMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
    // mvpMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));

    let u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    let u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  

    document.onkeydown = (e) => {
        switch (e.keyCode) {
            case 38: // Up arrow key -> Increase the maximum distance of fog
                fogDist[1] += 1;
                break;
            case 40: // Down arrow key -> Decrease the maximum distance of fog
                if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
                break;
            default: return;
        }
        gl.uniform2fv(u_FogDist, fogDist);   // Pass the distance of fog
        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Draw
        gl.drawElements(gl.TRIANGLES, ponitCount, gl.UNSIGNED_BYTE, 0)
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, ponitCount, gl.UNSIGNED_BYTE, 0)
}

const initVertexBuffers = (gl, program) => {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ]);

    let colors = new Float32Array([   // Colors
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);


    initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, "a_Position");
    initArrayBuffer(gl, program, colors, 3, gl.FLOAT, "a_Color");

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

const initArrayBuffer = (gl, program, data, num, type, attribute) => {
    let buffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // 把 WebGLBuffer 对象绑定到指定目标上。
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); // 向缓冲区对象写入对象

    //动态设置source
    let a_Attribute = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_Attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);//解除绑定
}

const checkFace = (gl, n, x, y, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix) => {
    var pixels = new Uint8Array(4); // Array for storing the pixel value
    gl.uniform1i(u_PickedFace, 0);  // Draw by writing surface number into alpha value
    draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
    // Read the pixel value of the clicked position. pixels[3] is the surface number
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    return pixels[3];
}

let last = Date.now();
const animate = (angle) => {
    let now = Date.now();   // Calculate the elapsed time
    let elapsed = now - last;
    last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}