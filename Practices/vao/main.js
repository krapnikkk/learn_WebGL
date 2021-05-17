const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    void main(){
        vec3 lightDirection = vec3(-0.35,0.35,0.87);
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal)); // 法向量归一化
        float nDotL = max(dot(normal,lightDirection),0.0); // 光线方向和法向量的点积 如果入射角大于90度，则取0
        vec3 diffuse =  a_Color.rgb * nDotL; // 漫反射光的颜色
        v_Color = vec4(diffuse,a_Color.a);
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`;

const main = async () => {
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
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let vaoExt = gl.getExtension("OES_vertex_array_object");
    let vao = vaoExt.createVertexArrayOES();
    vaoExt.bindVertexArrayOES(vao);

    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
    program.a_Color = gl.getAttribLocation(program, 'a_Color');
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

    let model = initVertexBuffers(gl, program);

    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(10.0, canvas.width / canvas.height, 1.0, 200.0);
    viewProjMatrix.lookAt(10.0, 100.0, 100.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // Start reading the OBJ file
    await readOBJFile('./resources/Sketchfab_2017_01_06_19_08_01.obj', 60, true);

    let currentAngle = 0.0; // Current rotation angle [degree]
    let tick = function () {   // Start drawing
        currentAngle = animate(currentAngle); // Update current rotation angle
        draw(gl, program, currentAngle, viewProjMatrix, model,vaoExt,vao);
        requestAnimationFrame(tick);
    };
    tick();
}


const initVertexBuffers = (gl, program) => {
    let o = new Object();
    o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
    o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
    o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
    o.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

const createEmptyArrayBuffer = (gl, a_attribute, num, type) => {

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);  // Enable the assignment

    return buffer;
}

let ANGLE_STEP = 30;
let last = Date.now();
const animate = (angle) => {
    let now = Date.now();
    let elapsed = now - last;
    last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}

let g_modelMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();
let g_normalMatrix = new Matrix4();
const draw = (gl, program, angle, viewProjMatrix, model,vaoExt,vao) => {
    if (g_objDoc != null && g_objDoc.isMTLComplete()) {
        g_drawingInfo = onReadComplete(gl, model, g_objDoc);
        g_objDoc = null;
        vaoExt.bindVertexArrayOES(null);
    }
    if (!g_drawingInfo) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    g_modelMatrix.setRotate(angle, 0.0, 1.0, 0.0);
    // g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
    // g_modelMatrix.rotate(angle, 0.0, 0.0, 1.0);
    g_modelMatrix.scale(0.05, 0.05, 0.05);

    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    vaoExt.bindVertexArrayOES(vao);

    // Draw
    gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);

    vaoExt.bindVertexArrayOES(null);
}

let g_objDoc = null;      // The information of OBJ file
let g_drawingInfo = null; // The information for drawing 3D model

// Read a file
const readOBJFile = (fileName, scale, reverse) => {
    return new Promise((resolve) => {
        fetch(fileName).then((res) => res.text()).then((text) => {
            onReadOBJFile(text, fileName, scale, reverse);
            resolve();
        }).catch((e) => {
            console.warn(e);
        })
    })
}


// OBJ File has been read
const onReadOBJFile = (fileString, fileName, scale, reverse) => {
    let objDoc = new OBJDoc(fileName);  // Create a OBJDoc object
    let result = objDoc.parse(fileString, scale, reverse); // Parse the file
    if (!result) {
        g_objDoc = null;
        g_drawingInfo = null;
        console.log("OBJ file parsing error.");
        return;
    }
    g_objDoc = objDoc;
}



// OBJ File has been read compreatly
function onReadComplete(gl, model, objDoc) {
    // Acquire the vertex coordinates and colors from OBJ file
    var drawingInfo = objDoc.getDrawingInfo();

    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

    return drawingInfo;
}

class OBJDoc {
    constructor(fileName) {
        this.fileName = fileName;
        this.mtls = new Array(0);      // Initialize the property for MTL
        this.objects = new Array(0);   // Initialize the property for Object
        this.vertices = new Array(0);  // Initialize the property for Vertex
        this.normals = new Array(0);   // Initialize the property for Normal
    }

    parse(fileString, scale, reverse) {
        var lines = fileString.split('\n');  // Break up into lines and store them as array
        lines.push(null); // Append null
        var index = 0;    // Initialize index of line

        var currentObject = null;
        var currentMaterialName = "";

        // Parse line by line
        var line;         // A string in the line to be parsed
        var sp = new StringParser();  // Create StringParser
        while ((line = lines[index++]) != null) {
            sp.init(line);                  // init StringParser
            var command = sp.getWord();     // Get command
            if (command == null) continue;  // check null command

            switch (command) {
                case '#':
                    continue;  // Skip comments
                case 'mtllib':     // Read Material chunk
                    var path = this.parseMtllib(sp, this.fileName);
                    var mtl = new MTLDoc();   // Create MTL instance
                    this.mtls.push(mtl);
                    fetch(path).then(res => res.text()).then((text) => {
                        onReadMTLFile(text, mtl);
                    }).catch(e => {
                        console.warn(e);
                    });
                    continue; // Go to the next line
                case 'o':
                case 'g':   // Read Object name
                    var object = this.parseObjectName(sp);
                    this.objects.push(object);
                    currentObject = object;
                    continue; // Go to the next line
                case 'v':   // Read vertex
                    var vertex = this.parseVertex(sp, scale);
                    this.vertices.push(vertex);
                    continue; // Go to the next line
                case 'vn':   // Read normal
                    var normal = this.parseNormal(sp);
                    this.normals.push(normal);
                    continue; // Go to the next line
                case 'usemtl': // Read Material name
                    currentMaterialName = this.parseUsemtl(sp);
                    continue; // Go to the next line
                case 'f': // Read face
                    var face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
                    currentObject.addFace(face);
                    continue; // Go to the next line
            }
        }

        return true;
    }

    parseMtllib(sp, fileName) {
        // Get directory path
        var i = fileName.lastIndexOf("/");
        var dirPath = "";
        if (i > 0) dirPath = fileName.substr(0, i + 1);

        return dirPath + sp.getWord();   // Get path
    }

    parseObjectName(sp) {
        var name = sp.getWord();
        return (new OBJObject(name));
    }

    parseVertex(sp, scale) {
        var x = sp.getFloat() * scale;
        var y = sp.getFloat() * scale;
        var z = sp.getFloat() * scale;
        return (new Vertex(x, y, z));
    }

    parseNormal(sp) {
        var x = sp.getFloat();
        var y = sp.getFloat();
        var z = sp.getFloat();
        return (new Normal(x, y, z));
    }

    parseUsemtl(sp) {
        return sp.getWord();
    }

    parseFace(sp, materialName, vertices, reverse) {
        var face = new Face(materialName);
        // get indices
        for (; ;) {
            var word = sp.getWord();
            if (word == null) break;
            var subWords = word.split('/');
            if (subWords.length >= 1) {
                var vi = parseInt(subWords[0]) - 1;
                face.vIndices.push(vi);
            }
            if (subWords.length >= 3) {
                var ni = parseInt(subWords[2]) - 1;
                face.nIndices.push(ni);
            } else {
                face.nIndices.push(-1);
            }
        }

        // calc normal
        var v0 = [
            vertices[face.vIndices[0]].x,
            vertices[face.vIndices[0]].y,
            vertices[face.vIndices[0]].z];
        var v1 = [
            vertices[face.vIndices[1]].x,
            vertices[face.vIndices[1]].y,
            vertices[face.vIndices[1]].z];
        var v2 = [
            vertices[face.vIndices[2]].x,
            vertices[face.vIndices[2]].y,
            vertices[face.vIndices[2]].z];

        // 面の法線を計算してnormalに設定
        var normal = calcNormal(v0, v1, v2);
        // 法線が正しく求められたか調べる
        if (normal == null) {
            if (face.vIndices.length >= 4) { // 面が四角形なら別の3点の組み合わせで法線計算
                var v3 = [
                    vertices[face.vIndices[3]].x,
                    vertices[face.vIndices[3]].y,
                    vertices[face.vIndices[3]].z];
                normal = calcNormal(v1, v2, v3);
            }
            if (normal == null) {         // 法線が求められなかったのでY軸方向の法線とする
                normal = [0.0, 1.0, 0.0];
            }
        }
        if (reverse) {
            normal[0] = -normal[0];
            normal[1] = -normal[1];
            normal[2] = -normal[2];
        }
        face.normal = new Normal(normal[0], normal[1], normal[2]);

        // Devide to triangles if face contains over 3 points.
        if (face.vIndices.length > 3) {
            var n = face.vIndices.length - 2;
            var newVIndices = new Array(n * 3);
            var newNIndices = new Array(n * 3);
            for (var i = 0; i < n; i++) {
                newVIndices[i * 3 + 0] = face.vIndices[0];
                newVIndices[i * 3 + 1] = face.vIndices[i + 1];
                newVIndices[i * 3 + 2] = face.vIndices[i + 2];
                newNIndices[i * 3 + 0] = face.nIndices[0];
                newNIndices[i * 3 + 1] = face.nIndices[i + 1];
                newNIndices[i * 3 + 2] = face.nIndices[i + 2];
            }
            face.vIndices = newVIndices;
            face.nIndices = newNIndices;
        }
        face.numIndices = face.vIndices.length;

        return face;
    }

    isMTLComplete() {
        if (this.mtls.length == 0) return true;
        for (var i = 0; i < this.mtls.length; i++) {
            if (!this.mtls[i].complete) return false;
        }
        return true;
    }

    findColor(name) {
        for (var i = 0; i < this.mtls.length; i++) {
            for (var j = 0; j < this.mtls[i].materials.length; j++) {
                if (this.mtls[i].materials[j].name == name) {
                    return (this.mtls[i].materials[j].color)
                }
            }
        }
        return (new Color(0.8, 0.8, 0.8, 1));
    }

    getDrawingInfo() {
        // Create an arrays for vertex coordinates, normals, colors, and indices
        var numIndices = 0;
        for (var i = 0; i < this.objects.length; i++) {
            numIndices += this.objects[i].numIndices;
        }
        var numVertices = numIndices;
        var vertices = new Float32Array(numVertices * 3);
        var normals = new Float32Array(numVertices * 3);
        var colors = new Float32Array(numVertices * 4);
        var indices = new Uint16Array(numIndices);

        // Set vertex, normal and color
        var index_indices = 0;
        for (var i = 0; i < this.objects.length; i++) {
            var object = this.objects[i];
            for (var j = 0; j < object.faces.length; j++) {
                var face = object.faces[j];
                var color = this.findColor(face.materialName);
                var faceNormal = face.normal;
                for (var k = 0; k < face.vIndices.length; k++) {
                    // Set index
                    indices[index_indices] = index_indices;
                    // Copy vertex
                    var vIdx = face.vIndices[k];
                    var vertex = this.vertices[vIdx];
                    vertices[index_indices * 3 + 0] = vertex.x;
                    vertices[index_indices * 3 + 1] = vertex.y;
                    vertices[index_indices * 3 + 2] = vertex.z;
                    // Copy color
                    colors[index_indices * 4 + 0] = color.r;
                    colors[index_indices * 4 + 1] = color.g;
                    colors[index_indices * 4 + 2] = color.b;
                    colors[index_indices * 4 + 3] = color.a;
                    // Copy normal
                    var nIdx = face.nIndices[k];
                    if (nIdx >= 0) {
                        var normal = this.normals[nIdx];
                        normals[index_indices * 3 + 0] = normal.x;
                        normals[index_indices * 3 + 1] = normal.y;
                        normals[index_indices * 3 + 2] = normal.z;
                    } else {
                        normals[index_indices * 3 + 0] = faceNormal.x;
                        normals[index_indices * 3 + 1] = faceNormal.y;
                        normals[index_indices * 3 + 2] = faceNormal.z;
                    }
                    index_indices++;
                }
            }
        }

        return new DrawingInfo(vertices, normals, colors, indices);
    }

}

function onReadMTLFile(fileString, mtl) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null);           // Append null
    var index = 0;              // Initialize index of line

    // Parse line by line
    var line;      // A string in the line to be parsed
    var name = ""; // Material name
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
        sp.init(line);                  // init StringParser
        var command = sp.getWord();     // Get command
        if (command == null) continue;  // check null command

        switch (command) {
            case '#':
                continue;    // Skip comments
            case 'newmtl': // Read Material chunk
                name = mtl.parseNewmtl(sp);    // Get name
                continue; // Go to the next line
            case 'Kd':   // Read normal
                if (name == "") continue; // Go to the next line because of Error
                var material = mtl.parseRGB(sp, name);
                mtl.materials.push(material);
                name = "";
                continue; // Go to the next line
        }
    }
    mtl.complete = true;
}

class MTLDoc {
    constructor() {
        this.complete = false; // MTL is configured correctly
        this.materials = new Array(0);
    }

    parseNewmtl(sp) {
        return sp.getWord();         // Get name
    }

    parseRGB(sp, name) {
        var r = sp.getFloat();
        var g = sp.getFloat();
        var b = sp.getFloat();
        return (new Material(name, r, g, b, 1));
    }


}

class Material {
    constructor(name, r, g, b, a) {
        this.name = name;
        this.color = new Color(r, g, b, a);
    }
}


class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Normal {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Color {
    constructor(r, g, b, a) {

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class OBJObject {
    constructor() {
        this.name = name;
        this.faces = new Array(0);
        this.numIndices = 0;
    }
    addFace(face) {
        this.faces.push(face);
        this.numIndices += face.numIndices;
    }
}

//------------------------------------------------------------------------------
// Face Object
//------------------------------------------------------------------------------

class Face {
    constructor(materialName) {
        this.materialName = materialName;
        if (materialName == null) this.materialName = "";
        this.vIndices = new Array(0);
        this.nIndices = new Array(0);
    }
}

class DrawingInfo {
    constructor(vertices, normals, colors, indices) {
        this.vertices = vertices;
        this.normals = normals;
        this.colors = colors;
        this.indices = indices;
    }
}

class StringParser {
    str = "";
    index = 0;
    constructor(str) {
        this.init(str);
    }

    init(str) {
        this.str = str;
        this.index = 0;
    }

    skipDelimiters() {
        for (var i = this.index, len = this.str.length; i < len; i++) {
            var c = this.str.charAt(i);
            // Skip TAB, Space, '(', ')
            if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
            break;
        }
        this.index = i;
    }

    skipToNextWord() {
        this.skipDelimiters();
        var n = getWordLength(this.str, this.index);
        this.index += (n + 1);
    }

    getWord() {
        this.skipDelimiters();
        var n = getWordLength(this.str, this.index);
        if (n == 0) return null;
        var word = this.str.substr(this.index, n);
        this.index += (n + 1);

        return word;
    }

    getInt() {
        return parseInt(this.getWord());
    }

    getFloat() {
        return parseFloat(this.getWord());
    }


}


// Get the length of word
function getWordLength(str, start) {
    var n = 0;
    for (var i = start, len = str.length; i < len; i++) {
        var c = str.charAt(i);
        if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
            break;
    }
    return i - start;
}

//------------------------------------------------------------------------------
// Common function
//------------------------------------------------------------------------------
function calcNormal(p0, p1, p2) {
    // v0: a vector from p1 to p0, v1; a vector from p1 to p2
    var v0 = new Float32Array(3);
    var v1 = new Float32Array(3);
    for (var i = 0; i < 3; i++) {
        v0[i] = p0[i] - p1[i];
        v1[i] = p2[i] - p1[i];
    }

    // The cross product of v0 and v1
    var c = new Float32Array(3);
    c[0] = v0[1] * v1[2] - v0[2] * v1[1];
    c[1] = v0[2] * v1[0] - v0[0] * v1[2];
    c[2] = v0[0] * v1[1] - v0[1] * v1[0];

    // Normalize the result
    var v = new Vector3(c);
    v.normalize();
    return v.elements;
}