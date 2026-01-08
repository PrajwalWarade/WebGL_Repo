class Square {
    constructor(squareNormalSides) {
        // OBJECTS
        this.squareVertices = new Float32Array([
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ]);

        this.squareTexcoords = new Float32Array([
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
        ]);

        this.squareNormals = [

            // top
            new Float32Array([
                0.0, 1.0, 0.0,  // top-right of top
                0.0, 1.0, 0.0, // top-left of top
                0.0, 1.0, 0.0, // bottom-left of top
                0.0, 1.0, 0.0,  // bottom-right of top
            ]),
            // bottom
            new Float32Array([

                0.0, -1.0, 0.0,  // top-right of bottom
                0.0, -1.0, 0.0,  // top-left of bottom
                0.0, -1.0, 0.0,  // bottom-left of bottom
                0.0, -1.0, 0.0,   // bottom-right of bottom

            ]),
            // Front
            new Float32Array([

                // front surface
                0.0, 0.0, 1.0,  // top-right of front
                0.0, 0.0, 1.0, // top-left of front
                0.0, 0.0, 1.0, // bottom-left of front
                0.0, 0.0, 1.0,  // bottom-right of front

            ]),
            // back
            new Float32Array([


                // back surface
                0.0, 0.0, -1.0,  // top-right of back
                0.0, 0.0, -1.0, // top-left of back
                0.0, 0.0, -1.0, // bottom-left of back
                0.0, 0.0, -1.0,  // bottom-right of back

            ]),
            // right
            new Float32Array([
                // right surface
                -1.0, 0.0, 0.0,  // top-right of right
                -1.0, 0.0, 0.0,  // top-left of right
                -1.0, 0.0, 0.0,  // bottom-left of right
                -1.0, 0.0, 0.0,  // bottom-right of right

            ]),
            // left
            new Float32Array([
                // left surface
                -1.0, 0.0, 0.0, // top-right of left
                -1.0, 0.0, 0.0, // top-left of left
                -1.0, 0.0, 0.0, // bottom-left of left
                -1.0, 0.0, 0.0 // bottom-right of left
            ]),
        ];

        // vao_square
        this.vao_square = gl.createVertexArray();
        gl.bindVertexArray(this.vao_square);
        {
            this.vbo_square_position = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_square_position);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.squareVertices, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);


            this.vbo_square_texcoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_square_texcoord);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.squareTexcoords, gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.vbo_square_normal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_square_normal);
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.squareNormals[squareNormalSides], gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    getSquareVertex() {
        return this.squareVertices;
    }

    getSquareTexCoord() {
        return this.squareTexcoords;
    }

    getSquareNormals() {
        return this.squareNormals;
    }

    draw() {
        // code
        gl.bindVertexArray(this.vao_square);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bindVertexArray(null);
    }
}
