
class GlassShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo;
        this.vbo_Normal;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'glass_effect/glass_effect.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'glass_effect/glass_effect.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "aPosition");
        gl.bindAttribLocation(this.program, 1, "aNormal");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        var CubePosition = new Float32Array([
            // top
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
            -1.0, -1.0, 1.0
        ]);

        // Cube Normals
        var CubeNormal = new Float32Array([
            // front surface
            0.0, 0.0, 1.0, // top-right of front
            0.0, 0.0, 1.0, // top-left of front
            0.0, 0.0, 1.0, // bottom-left of front
            0.0, 0.0, 1.0, // bottom-right of front

            // right surface
            1.0, 0.0, 0.0, // top-right of right
            1.0, 0.0, 0.0, // top-left of right
            1.0, 0.0, 0.0, // bottom-left of right
            1.0, 0.0, 0.0, // bottom-right of right

            // back surface
            0.0, 0.0, -1.0, // top-right of back
            0.0, 0.0, -1.0, // top-left of back
            0.0, 0.0, -1.0, // bottom-left of back
            0.0, 0.0, -1.0, // bottom-right of back

            // left surface
            -1.0, 0.0, 0.0, // top-right of left
            -1.0, 0.0, 0.0, // top-left of left
            -1.0, 0.0, 0.0, // bottom-left of left
            -1.0, 0.0, 0.0, // bottom-right of left

            // top surface
            0.0, 1.0, 0.0, // top-right of top
            0.0, 1.0, 0.0, // top-left of top
            0.0, 1.0, 0.0, // bottom-left of top
            0.0, 1.0, 0.0, // bottom-right of top

            // bottom surface
            0.0, -1.0, 0.0, // top-right of bottom
            0.0, -1.0, 0.0, // top-left of bottom
            0.0, -1.0, 0.0, // bottom-left of bottom
            0.0, -1.0, 0.0 // bottom-right of bottom
        ]);

        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // VBO
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, CubePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //vbo for cube normal
        this.vbo_Normal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Normal);
        gl.bufferData(gl.ARRAY_BUFFER, CubeNormal, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);  //unbind vbo
        gl.bindVertexArray(null);


    }

    getUniformLocations = (gl, program) => {

        const modelViewMatrixUniform = gl.getUniformLocation(program, "uModelViewMatrix");
        const projectionMatixUnform = gl.getUniformLocation(program, "uProjectionMatrix");
        const normalMatrixUniform = gl.getUniformLocation(program, "uNormalMatrix");
        const lightPositionUniform = gl.getUniformLocation(program, "uLightPos");
        const baseColorUniform = gl.getUniformLocation(program, "BaseColor");
        const depthUniform = gl.getUniformLocation(program, "Depth");
        const mixRatioUniform = gl.getUniformLocation(program, "MixRatio");
        const frameWidthUniform = gl.getUniformLocation(program, "FrameWidth");
        const frameHeightUniform = gl.getUniformLocation(program, "FrameHeight");
        const environmentMapUniform = gl.getUniformLocation(program, "EnvMap");
        const refractionMapUniform = gl.getUniformLocation(program, "RefractionMap");

        return {

            modelViewMatrixUniform,
            projectionMatixUnform,
            normalMatrixUniform,
            lightPositionUniform,
            baseColorUniform,
            depthUniform,
            mixRatioUniform,
            frameWidthUniform,
            frameHeightUniform,
            environmentMapUniform,
            refractionMapUniform

        };
    };

    render = (camera, modelMatrix, envTexture, refraction_texture_id) => {

        gl.useProgram(this.program);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        //transformations
        var modelViewMatrix = mat4.create();
        var normalMatrix = mat3.create();

        mat4.multiply(modelViewMatrix, modelViewMatrix, camera.getViewMatrix());
        mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);

        gl.uniformMatrix4fv(this.uniforms.modelViewMatrixUniform, false, modelViewMatrix);
        gl.uniformMatrix4fv(this.uniforms.projectionMatixUnform, false, perspectiveProjectionMatrix);

        // Calculate the normal matrix (inverse transpose of the upper-left 3x3 of the modelViewMatrix)
        mat3.normalFromMat4(normalMatrix, modelViewMatrix);
        gl.uniformMatrix3fv(this.uniforms.normalMatrixUniform, false, normalMatrix);
        var lightPosition = [0.0, 0.0, 4.0];
        gl.uniform3fv(this.uniforms.lightPositionUniform, new Float32Array(lightPosition));

        var materialBaseColor = [0.4, 0.4, 1.0];
        // Unifrom for fragment shader
        gl.uniform3fv(this.uniforms.baseColorUniform, new Float32Array(materialBaseColor));

        var depthValue = 0.1
        gl.uniform1f(this.uniforms.depthUniform, depthValue);

        var mixRatio = 0.2
        gl.uniform1f(this.uniforms.mixRatioUniform, mixRatio);

        var frameWidth = 2048.0;
        gl.uniform1f(this.uniforms.frameWidthUniform, frameWidth);

        var frameHeight = 2048.0;
        gl.uniform1f(this.uniforms.frameHeightUniform, frameHeight);

        // for envp texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, envTexture);
        gl.uniform1i(this.uniforms.environmentMapUniform, 0); // Use texture unit 0 for EnvMap

        // for refraction texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, refraction_texture_id);
        gl.uniform1i(this.uniforms.refractionMapUniform, 1); // Use texture unit 1 for RefractionMap

        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
        gl.bindVertexArray(null);

        gl.disable(gl.BLEND);

        //step 5: Unuse shader program object
        gl.useProgram(null);


    };

    uninitialize(){

    }
};






