
class FogShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo;
        this.vbo_TexCoord;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'fog/fog_shader.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'fog/fog_shader.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "aPosition");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        var cubePosition = new Float32Array
            ([
                // top
                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,

                1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,

                // bottom
                1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,

                1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,

                // front
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,

                1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,

                // back
                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,

                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,

                // right
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,

                1.0, 1.0, -1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,

                // left
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,

                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0
            ])

        var cubeTexCoord = new Float32Array
            ([
                // top
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                // bottom
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                // front
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                // back
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                // right
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                // left
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                0.0, 0.0,
                1.0, 0.0

            ])


        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // VBO
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, cubePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        //vbo for texture coordinates

        this.vbo_TexCoord = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_TexCoord);

        gl.bufferData(gl.ARRAY_BUFFER, cubeTexCoord, gl.STATIC_DRAW);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);  //unbind vbo

        gl.bindVertexArray(null);


    }

    getUniformLocations = (gl, program) => {

        const mvpMatrixUniform = gl.getUniformLocation(shaderProgramObject, "uMVPMatrix");

        const textureSamplerUniform = gl.getUniformLocation(shaderProgramObject, "uTextureSampler");

        const fogColorUniform = gl.getUniformLocation(shaderProgramObject, "uFogColor");

        const fogAmountUniform = gl.getUniformLocation(shaderProgramObject, "uFogAmount");

        const modelViewMatrixUniform = gl.getUniformLocation(shaderProgramObject, "uModelViewMatrix");

        const cameraPositionUniform = gl.getUniformLocation(shaderProgramObject, "uCameraPosition");

        const fogNearUniform = gl.getUniformLocation(shaderProgramObject, "uFogNear");

        const fogFarUniform = gl.getUniformLocation(shaderProgramObject, "uFogFar");

        const fogDensityUniform = gl.getUniformLocation(shaderProgramObject, "uFogDensity");


        return {
            mvpMatrixUniform,
            textureSamplerUniform,
            fogColorUniform,
            fogAmountUniform,
            modelViewMatrixUniform,
            cameraPositionUniform,
            fogNearUniform,
            fogFarUniform,
            fogDensityUniform
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
            // Set rotation angles

            mat4.rotate(rotationMatrix1, mat4.create(), angleC, [1, 0, 0]);
            mat4.rotate(rotationMatrix2, mat4.create(), angleC, [0, 1, 0]);
            mat4.rotate(rotationMatrix3, mat4.create(), angleC, [0, 0, 1]);

            // mat4.translate(translationMatrix, translationMatrix, [0.0, 0.0, -9.0]);

            var cameraPosition = [0.0, 0.0, zTranslate]; // Example camera position; update as per your camera's position

            var centre = [0.0, 0.0, 0.0];

            var upDirection = [0.0, 1.0, 0.0];

            mat4.translate(translationMatrix, translationMatrix, [0.0, 0.0, -2.0]);

            mat4.lookAt(modelViewMatrix, cameraPosition, centre, upDirection);

            mat4.multiply(modelViewMatrix, modelViewMatrix, translationMatrix);



            gl.uniform3fv(cameraPositionUniform, cameraPosition);

            //mat4.copy(modelViewMatrix, translationMatrix);

            // Combine rotations with the modelViewMatrix

            mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix1);
            mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix2);
            mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix3);


            mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

            gl.uniformMatrix4fv(this.uniforms.mvpMatrixUniform, false, modelViewProjectionMatrix);



            // Set fog near and far values

            var fogNear = 1.0; // Adjust this value as needed

            var fogFar = 10.0; // Adjust this value as needed

            gl.uniform1f(this.uniforms.fogNearUniform, fogNear);

            gl.uniform1f(this.uniforms.fogFarUniform, fogFar);

            //set fog density

            var fogDensity = 0.5;

            gl.uniform1f(this.uniforms.fogDensityUniform, fogDensity);



            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, kundali_Texture);

            gl.uniform1i(this.uniforms.textureSamplerUniform, 0);

            gl.uniform4fv(this.uniforms.fogColorUniform, [0.7, 0.7, 0.7, 1.0]);

            gl.uniform1f(this.uniforms.fogAmountUniform, 1.0);

            gl.bindVertexArray(vao);

            gl.drawArrays(gl.TRIANGLES, 0, 36);

            gl.bindVertexArray(null);

            gl.bindTexture(gl.TEXTURE_2D, null);

        }
        gl.useProgram(null);


    };

    uninitialize() {

    }

};



