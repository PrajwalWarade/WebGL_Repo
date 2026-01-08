class Torus {
    constructor(radius, slices, stacks) {
        // code
        this.model_vertices = [];
        this.model_normals = [];
        this.model_textures = [];


        this.generateTorusData(radius, slices, stacks);

        this.vao_torus = gl.createVertexArray();
        gl.bindVertexArray(this.vao_torus);
        {
            // Vertices
            this.vbo_torus_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_torus_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTorusVertex()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_torus_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_torus_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTorusTexCoord()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_torus_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_torus_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTorusNormals()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    draw(){
        gl.bindVertexArray(this.vao_torus);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.getTorusVertex().length / 3);
        gl.bindVertexArray(null);

    }
    addTorusVertex(x, y, z) {
        this.model_vertices.push(x);
        this.model_vertices.push(y);
        this.model_vertices.push(z);
    }

    addTorusNormal(x, y, z) {
        this.model_normals.push(x);
        this.model_normals.push(y);
        this.model_normals.push(z);
    }

    addTorusTexCoords(a, b) {
        this.model_textures.push(a);
        this.model_textures.push(b);
    }

    getTorusVertex() {
        return this.model_vertices;
    }
    
    getTorusTexCoord() {
        return this.model_textures;
    }

    getTorusNormals() {
        return this.model_normals;
    }

    generateTorusData(radius, slices, stacks) {
        let _R = 10.0;
        let _r = radius;
        let _nR = slices;
        let _nr = stacks;

        let du = 2 * Math.PI / _nR;
        let dv = 2 * Math.PI / _nr;

        for (let i = 0; i < _nR; i++)
        {
            let u = i * du;

            for (let j = 0; j <= _nr; j++)
            {
                let v = (j % _nr) * dv;
                for (let k = 0; k < 2; k++)
                {
                    let uu = u + k * du;
                    // compute vertex
                    let x = (_R + _r * Math.cos(v)) * Math.cos(uu);
                    let y = (_R + _r * Math.cos(v)) * Math.sin(uu);
                    let z = _r * Math.sin(v);

                    // add vertex
                    this.addTorusVertex(x, y, z);

                    // compute normal
                    let nx = Math.cos(v) * Math.cos(uu);
                    let ny = Math.cos(v) * Math.sin(uu);
                    let nz = Math.sin(v);

                    // add normal
                    this.addTorusNormal(nx, ny, nz);

                    // compute texture coords
                    let tx = uu / (2 * Math.PI);
                    let ty = v / (2 * Math.PI);

                    // add tex coords
                    this.addTorusTexCoords(tx, ty);
                }
                // incr angle
                v += dv;
            }
        }
    }
}
