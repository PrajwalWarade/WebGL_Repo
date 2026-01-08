class Cube {
    constructor() {
        // OBJECTS
        this.cubeVertices = new Float32Array([
            // front
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            // bottom
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            // front
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            // back
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            // right
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            // left
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
        ]);

        this.cubeTexcoords = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);

        this.cubeNormals = new Float32Array([
            // top surface
            0.0, 1.0, 0.0,  // top-right of top
            0.0, 1.0, 0.0, // top-left of top
            0.0, 1.0, 0.0, // bottom-left of top
            0.0, 1.0, 0.0,  // bottom-right of top

            // bottom surface
            0.0, -1.0, 0.0,  // top-right of bottom
            0.0, -1.0, 0.0,  // top-left of bottom
            0.0, -1.0, 0.0,  // bottom-left of bottom
            0.0, -1.0, 0.0,   // bottom-right of bottom

            // front surface
            0.0, 0.0, 1.0,  // top-right of front
            0.0, 0.0, 1.0, // top-left of front
            0.0, 0.0, 1.0, // bottom-left of front
            0.0, 0.0, 1.0,  // bottom-right of front

            // back surface
            0.0, 0.0, -1.0,  // top-right of back
            0.0, 0.0, -1.0, // top-left of back
            0.0, 0.0, -1.0, // bottom-left of back
            0.0, 0.0, -1.0,  // bottom-right of back


            // right surface
            1.0, 0.0, 0.0,  // top-right of right
            1.0, 0.0, 0.0,  // top-left of right
            1.0, 0.0, 0.0,  // bottom-left of right
            1.0, 0.0, 0.0,  // bottom-right of right
            // left surface
            -1.0, 0.0, 0.0, // top-right of left
            -1.0, 0.0, 0.0, // top-left of left
            -1.0, 0.0, 0.0, // bottom-left of left
            -1.0, 0.0, 0.0 // bottom-right of left
        ]);

        // vao_cube
        this.vao_cube = gl.createVertexArray();
        gl.bindVertexArray(this.vao_cube);
        {
            this.vbo_cube_position = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube_position);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.cubeVertices, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);


            this.vbo_cube_texcoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube_texcoord);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.cubeTexcoords, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo_cube_normal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cube_normal);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.cubeNormals, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    getCubeVertex() {
        return this.cubeVertices;
    }

    getCubeTexCoord() {
        return this.cubeTexcoords;
    }

    getCubeNormals() {
        return this.cubeNormals;
    }

    draw() {
        // code
        gl.bindVertexArray(this.vao_cube);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
        gl.bindVertexArray(null);
    }
}
