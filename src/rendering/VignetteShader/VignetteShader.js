
class VignetteShaderProgram {


    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo;
        this.gfVignetteInnerRadius = 0.1;
        this.gfVignetteOuterRadius = 0.8;
        this.bFullScreen = true
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'vignette/vignette_map.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'vignette/vignette_map.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "aPosition");

        //gl.bindAttribLocation(shaderProgramObject, VertexAttributeEnum.VSR_ATTRIBUTE_COLOR, "aColor");
        // gl.bindAttribLocation(shaderProgramObject, VertexAttributeEnum.VSR_ATTRIBUTE_TEXCORD, "aTexcord");
        // gl.bindAttribLocation(shaderProgramObject, VertexAttributeEnum.VSR_ATTRIBUTE_RESOLUTION, "aResolution");


        ShaderManger.linkProgram(gl, this.program);



        // mvpMatrixUniform = gl.getUniformLocation(shaderProgramObject, "uMVPMatrix");
        // resolutionUniform = gl.getUniformLocation(shaderProgramObject, "u_resolution");
        // vignetteInnerRadiusUniform = gl.getUniformLocation(shaderProgramObject, "u_vignetteInnerRadius");
        // vignetteOuterRadiusUniform = gl.getUniformLocation(shaderProgramObject, "u_vignetteOuterRadius");

        this.uniforms = this.getUniformLocations(gl, this.program);

        // traingle postion array declaration

        var rect_Position = new Float32Array([
            3.0, 2.0, 0.0,
            -3.0, 2.0, 0.0,
            -3.0, -2.0, 0.0,
            3.0, -2.0, 0.0
        ]);



        // vao
        vao = gl.createVertexArray()

        gl.bindVertexArray(vao);

        // vbo_position
        vbo_position = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position);

        gl.bufferData(gl.ARRAY_BUFFER, rect_Position, gl.STATIC_DRAW);

        gl.vertexAttribPointer(VertexAttributeEnum.VSR_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(VertexAttributeEnum.VSR_ATTRIBUTE_POSITION);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);


    };

    getUniformLocations = (gl, program) => {


        const uMVPMatrix = gl.getUniformLocation(program, shaderProgramObject, "uMVPMatrix");
        const resolutionUniform = gl.getUniformLocation(program, shaderProgramObject, "u_resolution");
        const vignetteInnerRadiusUniform = gl.getUniformLocation(program, shaderProgramObject, "u_vignetteInnerRadius");
        const vignetteOuterRadiusUniform = gl.getUniformLocation(program, shaderProgramObject, "u_vignetteOuterRadius");

        return {
            uMVPMatrix,
            resolutionUniform,
            vignetteInnerRadiusUniform,
            vignetteOuterRadiusUniform
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
            gl.uniformMatrix4fv(this.uniforms.mvpMatrixUniform, false, modelViewProjectionMatrix);

            gl.uniformMatrix4fv(this.uniforms.u_viewDirectionProjectionInverse, false, viewDirectionProjectionInverseMatrix);

            if (bFullScreen) {
                gl.uniform2f(this.uniforms.resolutionUniform, canvas.width, canvas.height);
                if (this.gfVignetteOuterRadius > 0.0) {
                    this.gfVignetteOuterRadius = this.gfVignetteOuterRadius - 0.001;
                    gl.uniform1f(this.uniforms.vignetteOuterRadiusUniform, this.gfVignetteOuterRadius);
                }

                if (this.gfVignetteInnerRadius > 0.0) {
                    this.gfVignetteInnerRadius = this.gfVignetteInnerRadius - 0.001;
                    gl.uniform1f(this.uniforms.vignetteInnerRadiusUniform, this.gfVignetteInnerRadius);
                }
            }
        }
        gl.bindVertexArray(vao);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        gl.bindVertexArray(null);


        gl.useProgram(null);


    };

    uninitialize() {

    }



};