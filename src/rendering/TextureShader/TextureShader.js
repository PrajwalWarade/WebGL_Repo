
class TextureShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vboPosition;
        this.vboTexcoord;

        this.alpha = 1.0;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'texture/texture.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'texture/texture.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_POSITION, "aPosition");
        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, "aTexCoord");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        var squarePosition = new Float32Array([
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ]);

        var squareTexcoord = new Float32Array([
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ]);



        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // vboPosition
        this.vboPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, squarePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);

        // vboTexcoord
        this.vboTexcoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexcoord);
        gl.bufferData(gl.ARRAY_BUFFER, squareTexcoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);


    }

    getUniformLocations = (gl, program) => {

        const uMVPMatrix = gl.getUniformLocation(program, 'uMVPMatrix');
        const u_texture = gl.getUniformLocation(program, 'uTextureSampler');
        const u_textureOpacity = gl.getUniformLocation(program, 'opacity');
        const bDisbaleOpacity = gl.getUniformLocation(program, 'bDisbaleOpacity');

        return {
            uMVPMatrix,
            u_texture,
            u_textureOpacity,
            bDisbaleOpacity
        };
    };

    render = (camera, modelMatrix, texture_id, opacity) => {

        const viewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

        gl.useProgram(this.program);
        {
            gl.uniform1f(this.uniforms.bDisbaleOpacity, 0.0);
            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);
            if (opacity == undefined) {
                gl.uniform1f(this.uniforms.u_textureOpacity, 1.0);
            }
            else {
                gl.uniform1f(this.uniforms.u_textureOpacity, opacity);
            }

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture_id)
            gl.uniform1i(this.uniforms.u_texture, 0);


            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, null)
        }
        gl.useProgram(null);


    };

    renderNew = (camera, modelMatrix, texture_id) => {

        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);


        gl.useProgram(this.program);
        {
            gl.uniform1f(this.uniforms.u_textureOpacity, 1.0);
            gl.uniform1f(this.uniforms.bDisbaleOpacity, 1.0);

            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture_id)
            gl.uniform1i(this.uniforms.u_texture, 0);

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, null)

            gl.uniform1f(this.uniforms.bDisbaleOpacity, 0.0);
        }
        gl.useProgram(null);


    };

    uninitialize() {

    }

};



