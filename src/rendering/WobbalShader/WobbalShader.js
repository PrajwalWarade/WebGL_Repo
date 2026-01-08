
class WobbalShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo_position;
        this.vbo_texcoord;
        this.wobbalRadius = 0.0;
    }

    async init() {

        console.log("in Wobbal shader program");

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'wobbal/wobbal.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'wobbal/wobbal.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_POSITION, "a_position");
        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, "a_texcoord");


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
        this.vbo_position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_position);

        gl.bufferData(gl.ARRAY_BUFFER, squarePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);

        // vboTexcoord
        this.vbo_texcoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_texcoord);
        gl.bufferData(gl.ARRAY_BUFFER, squareTexcoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);


    }

    getUniformLocations = (gl, program) => {
        const modelMatrixUniform = gl.getUniformLocation(program, "u_modelMatrix");

        const viewMatrixUniform = gl.getUniformLocation(program, "u_viewMatrix");
        const projectionMatrixUniform = gl.getUniformLocation(program, "u_projectionMatrix");
        const textureSamplerUniform = gl.getUniformLocation(program, "u_textureSampler");
        const startRadUniform = gl.getUniformLocation(program, "u_StartRad");
        const freqUniform = gl.getUniformLocation(program, "u_Freq");
        const amplitudeUniform = gl.getUniformLocation(program, "u_Amplitude");
        const alphaUniform = gl.getUniformLocation(program, "u_alpha");

        return {
            textureSamplerUniform,
            modelMatrixUniform,
            viewMatrixUniform,
            projectionMatrixUniform,
            startRadUniform,
            freqUniform,
            amplitudeUniform,
            alphaUniform,
        };
    };

    render = (camera, modelMatrix, deltaTime, texture_id) => {

        let frequency = [0.600000, 1.640000];
        let amplitude = [0.040000, 0.060000 - 0.100000];
        let angle = Math.PI * this.wobbalRadius * Math.random() / 180;
        this.wobbalRadius = this.wobbalRadius + 0.05;

        gl.useProgram(this.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_id);
        gl.uniform1i(this.uniforms.textureSamplerUniform, 0);

        gl.uniformMatrix4fv(this.uniforms.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(this.uniforms.viewMatrixUniform, false, camera.getViewMatrix());
        gl.uniformMatrix4fv(this.uniforms.projectionMatrixUniform, false, perspectiveProjectionMatrix);
        gl.uniform1f(this.uniforms.startRadUniform, angle);
        gl.uniform2fv(this.uniforms.freqUniform, frequency);
        gl.uniform2fv(this.uniforms.amplitudeUniform, amplitude);
        gl.uniform1f(this.uniforms.alphaUniform, 0.75);

        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bindVertexArray(null);

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, null)

        gl.useProgram(null);
    };

    uninitialize() {

    }

};



