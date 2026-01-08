class Cone {

    constructor(_radius, _height, _stack, _sector) {
        this.radius = _radius;
        this.height = _height;
        this.stack = _stack;
        this.sector = _sector;

        // this.cylinder = null;
        this.cylinder = new Cylinder(0.0, this.radius, this.height, this.stack, this.sector);

        this.vao_cone = gl.createVertexArray();
        gl.bindVertexArray(this.vao_cone);
        {
            // Vertices
            this.vbo_cone_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cone_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getConeVertex()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_cone_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cone_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getConeTexCoord()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_cone_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cone_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getConeNormals()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    draw() {
        gl.bindVertexArray(this.vao_cone);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.getNumberOfConeVertices() / 3);
        gl.bindVertexArray(null);
    }

    getConeVertex() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.vertices);
    }

    getConeTexCoord() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.texCoords);
    }

    getConeNormals() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.normals);
    }

    getNumberOfConeVertices() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.vertices.length);
    }

    getNumberOfConeTexcoords() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.texCoords.length);
    }

    getNumberOfConeNormals() {
        if (this.cylinder == null) {
            return (0);
        }
        return (this.cylinder.normals.length);
    }


}

