class Pyramid {
    constructor() {
        // OBJECTS
        this.pyramidVertices = new Float32Array([
            // front
            0.0, 1.0, 0.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,

            // right
            0.0, 1.0, 0.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,

            // back
            0.0, 1.0, 0.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,

            // left
            0.0, 1.0, 0.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0
        ]);

        this.pyramidTexcoords = new Float32Array([
            0.5, 1.0, // front-top
            0.0, 0.0, // front-left
            1.0, 0.0, // front-right

            0.5, 1.0, // right-top
            1.0, 0.0, // right-left
            0.0, 0.0, // right-right

            0.5, 1.0, // back-top
            1.0, 0.0, // back-left
            0.0, 0.0, // back-right

            0.5, 1.0, // left-top
            0.0, 0.0, // left-left
            1.0, 0.0, // left-right
        ]);

        this.pyramidNormals = new Float32Array([
            0.0, 0.447214, 0.894427,// front-top
            0.0, 0.447214, 0.894427,// front-left
            0.0, 0.447214, 0.894427,// front-right

            0.894427, 0.447214, 0.0, // right-top
            0.894427, 0.447214, 0.0, // right-left
            0.894427, 0.447214, 0.0, // right-right

            0.0, 0.447214, -0.894427, // back-top
            0.0, 0.447214, -0.894427, // back-left
            0.0, 0.447214, -0.894427, // back-right

            -0.894427, 0.447214, 0.0, // left-top
            -0.894427, 0.447214, 0.0, // left-left
            -0.894427, 0.447214, 0.0 // left-right
        ]);

        // vao_pyramid
        this.vao_pyramid = gl.createVertexArray();
        gl.bindVertexArray(this.vao_pyramid);
        {
            this.vbo_pyramid_position = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_pyramid_position);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.pyramidVertices, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo_pyramid_texcoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_pyramid_texcoord);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.pyramidTexcoords, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo_pyramid_normal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_pyramid_normal);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.pyramidNormals, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    getPyramidVertex() {
        return this.pyramidVertices;
    }

    getPyramidTexCoord() {
        return this.pyramidTexcoords;
    }

    getPyramidNormals() {
        return this.pyramidNormals;
    }

    draw() {
        // code
        gl.bindVertexArray(this.vao_pyramid);
        gl.drawArrays(gl.TRIANGLES, 0, 12);
        gl.bindVertexArray(null);
    }
}
