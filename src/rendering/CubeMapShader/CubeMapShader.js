
class CubeMapShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo;

        this.alpha = 0.0;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'cube_map/cube_map.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'cube_map/cube_map.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "aPosition");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        var cubePosition = new Float32Array([
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, -1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ]);

        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // VBO
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, cubePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);


    }

    getUniformLocations = (gl, program) => {

        const uMVPMatrix = gl.getUniformLocation(program, 'uMVPMatrix');
        const u_viewDirectionProjectionInverse = gl.getUniformLocation(program, 'u_viewDirectionProjectionInverse');
        const u_texture = gl.getUniformLocation(program, 'u_texture');
        const modelMatrix = gl.getUniformLocation(program, 'modelMatrix');
        const uAlpha = gl.getUniformLocation(program, 'uAlpha');

        return {
            uMVPMatrix,
            u_viewDirectionProjectionInverse,
            u_texture,
            modelMatrix,
            uAlpha
        };
    };

    render = (camera, modelMatrix, texture_id) => {

        const viewMatrix = camera.getViewMatrix();
        var viewDirectionProjectionMatrix = mat4.create();
        var viewDirectionProjectionInverseMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

        mat4.multiply(viewDirectionProjectionMatrix, perspectiveProjectionMatrix, viewMatrix);
        mat4.invert(viewDirectionProjectionInverseMatrix, viewDirectionProjectionMatrix);


        gl.useProgram(this.program);
        {
            gl.uniform1f(this.uniforms.uAlpha, this.alpha);
            gl.uniformMatrix4fv(this.uniforms.modelMatrix, false, modelMatrix);

            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);
            gl.uniformMatrix4fv(this.uniforms.u_viewDirectionProjectionInverse, false, viewDirectionProjectionInverseMatrix);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture_id)
            gl.uniform1i(this.uniforms.u_texture, 0);

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            gl.bindVertexArray(null);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
        }
        gl.useProgram(null);


    };

    uninitialize(){

    }
};



