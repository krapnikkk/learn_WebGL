class Particle {
    constructor(options) {
        this.options = options;
        this.count = this.options.count || 0;
        this.plist = [];
        for (let i = 0; i < this.count; i++) {
            this.plist.push(this.create(i));
        }
    }

    create(index) {
        let json = Object.assign({}, this.options);
        json.vx *= this.random();
        json.vy *= this.random();
        json.ax *= this.random();
        json.ay *= this.random();
        json.life *= Math.random();
        json.createTime = Date.now();
        json.lastTime = json.createTime;
        json.index = index;
        return json;
    }

    random() {
        return 2.0 * (Math.random() - 0.5);
    }

    update(cb) {
        let now = Date.now();
        let step = 0;
        this.plist.forEach((p, i) => {
            step = now - p.lastTime;
            p.lastTime = now;
            if (p.lastTime - p.createTime > p.life) {
                this.plist[i] = this.create(i)
            } else {
                this.updateAttrib(p, "x", step);
                this.updateAttrib(p, "y", step);
                this.updateAttrib(p, "size", step);
                if (p.size < 0) {
                    p.size = 0;
                }
            }
            if (cb) {
                cb(p, i);
            }

        })
    }

    updateAttrib(target, attr, step) {
        target['v' + attr] += (target['a' + attr] * step) / 1000;
        target[attr] += (target['v' + attr] * step) / 1000;
    }
}

const createPlistArray = (list) => {
    let position = [];
    list.forEach((item) => {
        position = position.concat(createPoint(item));
    })
    return position;
}

const createPoint = (p) => {
    let { x, y, size } = p;
    return [x, y, 0, 0, 0, size];//坐标 颜色 大小
}

const updatePlistArray = (p, i) => {
    let particle = createPoint(p);
    particle.forEach((item, j) => {
        particleBuffer[i * 6 + j] = item;
    })
}

const canvas = document.querySelector("#webgl");
let particle = new Particle({
    count: 1000,
    x: canvas.width/2,
    y: canvas.height/2,
    ax:320,
    ay:320,
    vx: 10,
    vy: 10,
    size: 5,
    vsize: -5,
    asize:0,
    life: 1000
});
let particleArray = createPlistArray(particle.plist);
let particleBuffer = new Float32Array(particleArray);

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

    initVertexBuffer(gl, program,particleBuffer);

    //绘制背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);


    canvas.onmousedown = (e) => {
        click(e, gl);
    }


    let tick = () => {
        update(gl);
        requestAnimationFrame(tick);
    }

    tick();
}

const initVertexBuffer = (gl, program, vertices) => {
    let PSIZE = vertices.BYTES_PER_ELEMENT;
    let verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, "a_Position");
    let a_Size = gl.getAttribLocation(program, "a_Size");
    let a_Color = gl.getAttribLocation(program, "a_Color");

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, PSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, PSIZE * 6, PSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, PSIZE * 6, PSIZE * 5);
    gl.enableVertexAttribArray(a_Size);

    let u_Resolution = gl.getUniformLocation(program, "u_Resolution");
    gl.uniform2fv(u_Resolution, [canvas.width, canvas.height]);

}
const click = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    particle.options.x = x;
    particle.options.y = y;
}

const update = (gl) => {
    if (particle.options.x > canvas.width) {
        particle.options.x = canvas.width;
    }
    if (particle.options.x < 0) {
        particle.options.x = 0;
    }
    if (particle.options.y > canvas.height) {
        particle.options.y = canvas.height;
    }
    if (particle.options.y < 0) {
        particle.options.y = 0;
    }


    particle.update(updatePlistArray);
    gl.bufferData(gl.ARRAY_BUFFER, particleBuffer, gl.STATIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, particle.plist.length);
}




