const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
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

    //动态设置source
    let a_Position = gl.getAttribLocation(program, "a_Position");
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    let a_PointSize = gl.getAttribLocation(program, "a_PointSize");
    gl.vertexAttrib1f(a_PointSize, 10.0);

    let u_FragColor = gl.getUniformLocation(program, "u_FragColor");


    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制一个点
    // gl.drawArrays(gl.POINTS, 0, 1);

    canvas.onmousedown = (e) => {
        click(e, gl, canvas, a_Position,u_FragColor);
    }
}

let g_points = [], g_colors = [];
const click = (e, gl, canvas, a_Position,u_FragColor) => {
    let x = e.clientX;
    let y = e.clientY;
    let rect = e.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    if (x >= 0 && y >= 0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0 && y < 0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    g_points.push({ x, y });
    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = g_points.length;
    for (let i = 0; i < len; i ++) {
        let point = g_points[i];
        gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0);
        let color = g_colors[i];
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
