
class BloomShader {

    constructor(gl) {

        this.phongProgramInfo = null;
        this.textureProgramInfo = null;
        this.brightnessProgramInfo = null;
        this.hBlurProgramInfo = null;
        this.vBlurProgramInfo = null;
        this.blendProgramInfo = null;

        this.vao_square;
        this.vbo_Square_Position;
        this.vbo_Square_Texcoord;

        this.brightFBO;
        this.hBlurFBO;
        this.blurFBO;

        this.sceneFBO;
        this.sceneBloomFBO;

        // this.threshold = 0.5;
        // this.spread = 4;
        // this.mult = 1;
        // this.exposure = 1;
        // this.gamma = 2.2;
        // this.showTextures = false;
        this.weights = [0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216];

        this.CompleteSceneBloom = false;
        /* If You Want to Bloom Complete Scene make abover variable true and bind your scene under bindCompleteScene */
        /* If you want bloom only some part then  make abover variable false and bind your scene under bindCompleteScene & bind your to be bloomed scene under bindBloomScene()*/
    }

    async init() {


        this.phongProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.phongProgramInfo, await ShaderManger.loadShader(gl, 'bloom/phong.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.phongProgramInfo, await ShaderManger.loadShader(gl, 'bloom/phong.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.phongProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.phongProgramInfo);

        this.textureProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.textureProgramInfo, await ShaderManger.loadShader(gl, 'bloom/basic.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.textureProgramInfo, await ShaderManger.loadShader(gl, 'bloom/texture.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.textureProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.textureProgramInfo);

        this.brightnessProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.brightnessProgramInfo, await ShaderManger.loadShader(gl, 'bloom/basic.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.brightnessProgramInfo, await ShaderManger.loadShader(gl, 'bloom/bright.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.brightnessProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.brightnessProgramInfo);

        this.hBlurProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.hBlurProgramInfo, await ShaderManger.loadShader(gl, 'bloom/basic.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.hBlurProgramInfo, await ShaderManger.loadShader(gl, 'bloom/hBlur.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.hBlurProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.hBlurProgramInfo);

        this.vBlurProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.vBlurProgramInfo, await ShaderManger.loadShader(gl, 'bloom/basic.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.vBlurProgramInfo, await ShaderManger.loadShader(gl, 'bloom/vBlur.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.vBlurProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.vBlurProgramInfo);

        this.blendProgramInfo = ShaderManger.createProgram(gl);
        await gl.attachShader(this.blendProgramInfo, await ShaderManger.loadShader(gl, 'bloom/basic.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.blendProgramInfo, await ShaderManger.loadShader(gl, 'bloom/blend.fs', gl.FRAGMENT_SHADER));
        gl.bindAttribLocation(this.blendProgramInfo, 0, "aPosition");
        ShaderManger.linkProgram(gl, this.blendProgramInfo);

        var squareVertices = new Float32Array([
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


        // VERTEX ARRAY OBJECT
        this.vao_square = gl.createVertexArray();
        gl.bindVertexArray(this.vao_square);

        this.vbo_Square_Position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Square_Position);
        gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vbo_Square_Texcoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Square_Texcoord);
        gl.bufferData(gl.ARRAY_BUFFER, squareTexcoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

        this.brightFBO = new Framebuffer();
        this.brightFBO.create(2560, 1440);

        this.hBlurFBO = new Framebuffer();
        this.hBlurFBO.create(2560, 1440);

        this.blurFBO = new Framebuffer();
        this.blurFBO.create(2560, 1440);

        this.sceneFBO = new Framebuffer();
        this.sceneFBO.create(2560, 1440);

        this.sceneBloomFBO = new Framebuffer();
        this.sceneBloomFBO.create(2560, 1440);

    }

    bindCompleteScene() {
        // draw scene to sceneTexture
        this.sceneFBO.bind();

        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        gl.clearColor(0.01, 0.01, 0.01, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    unbindCompleteScene() {
        this.sceneFBO.unbind();
    }

    bindBloomScene() {

        // draw scene to sceneTexture
        this.sceneBloomFBO.bind();

        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        gl.clearColor(0.01, 0.01, 0.01, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    unbindBloomScene() {
        this.sceneBloomFBO.unbind();
    }


    drawScene(time, cameraMain) {
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // const fov = 30 * Math.PI / 180;
        // const aspect = canvas_original_width / canvas_original_height;
        // const zNear = 0.5;
        // const zFar = 10;
        // const projection = m4.perspective(fov, aspect, zNear, zFar);
        // const eye = [1, 4, -6];
        // const target = [0, 0, 0];
        // const up = [0, 1, 0];

        // const camera = m4.lookAt(eye, target, up);
        // const view = m4.inverse(camera);
        // const viewProjection = m4.multiply(projection, view);
        // const world = m4.rotationY(time);

        // const uniforms = {
        //     u_lightWorldPos: [1, 8, -10],
        //     u_lightColor: [1, 0.8, 0.8, 1],
        //     u_ambient: [0, 0, 0, 1],
        //     u_specular: [1, 1, 1, 1],
        //     u_shininess: 50,
        //     u_specularFactor: 1,
        //     u_diffuse: this.tex,
        // };
        // uniforms.u_viewInverse = camera;
        // uniforms.u_world = world;
        // uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
        // uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

        // gl.useProgram(this.phongProgramInfo);

        // gl.uniformMatrix4fv(gl.getUniformLocation(this.phongProgramInfo, "u_worldViewProjection"), false, uniforms.u_worldViewProjection);
        // gl.uniformMatrix4fv(gl.getUniformLocation(this.phongProgramInfo, "u_world"), false, uniforms.u_world);
        // gl.uniformMatrix4fv(gl.getUniformLocation(this.phongProgramInfo, "u_viewInverse"), false, uniforms.u_viewInverse);
        // gl.uniformMatrix4fv(gl.getUniformLocation(this.phongProgramInfo, "u_worldInverseTranspose"), false, uniforms.u_worldInverseTranspose);

        // gl.uniform3fv(gl.getUniformLocation(this.phongProgramInfo, "u_lightWorldPos"), uniforms.u_lightWorldPos);

        // gl.uniform4fv(gl.getUniformLocation(this.phongProgramInfo, "u_lightColor"), uniforms.u_lightColor);
        // gl.uniform4fv(gl.getUniformLocation(this.phongProgramInfo, "u_ambient"), uniforms.u_ambient);

        // gl.uniform4fv(gl.getUniformLocation(this.phongProgramInfo, "u_specular"), uniforms.u_specular);
        // gl.uniform1f(gl.getUniformLocation(this.phongProgramInfo, "u_shininess"), uniforms.u_shininess);
        // gl.uniform1f(gl.getUniformLocation(this.phongProgramInfo, "u_specularFactor"), uniforms.u_specularFactor);

        // gl.activeTexture(gl.TEXTURE0); //
        // gl.bindTexture(gl.TEXTURE_2D, this.tex);

        // gl.bindVertexArray(this.vao_cube);

        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        // gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        // gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        // gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        // gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        // gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

        // gl.bindVertexArray(null);
        resize();

        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 0.0, -3.0));
        modelShaderProgramObject.Render(objModel, cameraMain, modelMatrix);
    }

    render() {

        gl.disable(gl.DEPTH_TEST);

        // extract brightness from scene texture
        this.brightFBO.bind();
        {
            gl.useProgram(this.brightnessProgramInfo);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.brightnessProgramInfo, "matrix"), false, mat4.create());

            gl.activeTexture(gl.TEXTURE0); //
            if (this.CompleteSceneBloom == true)
                gl.bindTexture(gl.TEXTURE_2D, this.sceneFBO.getTexture());
            else
                gl.bindTexture(gl.TEXTURE_2D, this.sceneBloomFBO.getTexture());

            gl.uniform1i(gl.getUniformLocation(this.brightnessProgramInfo, "tex"), 0); //

            gl.uniform1f(gl.getUniformLocation(this.brightnessProgramInfo, "threshold"), configs.threshold_bloom); //

            gl.bindVertexArray(this.vao_square);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);
        }
        this.brightFBO.unbind();

        // blur brightness texture horizontally
        this.hBlurFBO.bind();
        {
            gl.useProgram(this.hBlurProgramInfo);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.hBlurProgramInfo, "matrix"), false, mat4.create());

            gl.activeTexture(gl.TEXTURE0); //
            gl.bindTexture(gl.TEXTURE_2D, this.brightFBO.getTexture());
            gl.uniform1i(gl.getUniformLocation(this.hBlurProgramInfo, "tex"), 0); //

            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "spread"), configs.spread_bloom); //

            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "weight[0]"), 0.227027); //
            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "weight[1]"), 0.1945946); //
            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "weight[2]"), 0.1216216); //
            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "weight[3]"), 0.054054); //
            gl.uniform1f(gl.getUniformLocation(this.hBlurProgramInfo, "weight[4]"), 0.016216); //

            gl.bindVertexArray(this.vao_square);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);
        }
        this.hBlurFBO.unbind();

        // blur horizonally blurred texture vertically
        this.blurFBO.bind();
        {
            gl.useProgram(this.vBlurProgramInfo);


            gl.uniformMatrix4fv(gl.getUniformLocation(this.vBlurProgramInfo, "matrix"), false, mat4.create());

            gl.activeTexture(gl.TEXTURE0); //
            gl.bindTexture(gl.TEXTURE_2D, this.hBlurFBO.getTexture());
            // gl.bindTexture(gl.TEXTURE_2D, this.hBlurFBI.attachments[0]);
            gl.uniform1i(gl.getUniformLocation(this.vBlurProgramInfo, "tex"), 0); //

            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "spread"), configs.spread_bloom); //

            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "weight[0]"), 0.227027); //
            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "weight[1]"), 0.1945946); //
            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "weight[2]"), 0.1216216); //
            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "weight[3]"), 0.054054); //
            gl.uniform1f(gl.getUniformLocation(this.vBlurProgramInfo, "weight[4]"), 0.016216); //

            gl.bindVertexArray(this.vao_square);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);

        }
        this.blurFBO.unbind();

        gl.enable(gl.DEPTH_TEST);
    }

    getBloomTexture() {
        this.sceneBloomFBO.getTexture();
    }

    getCompleteSceneTExture() {

    }

    getBlurTexture() {
        return this.blurFBO.getTexture();
    }

    renderFinalQuad() {
        // Draw blur texture added to scene texture
        {
            gl.useProgram(this.blendProgramInfo);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.blendProgramInfo, "matrix"), false, mat4.create());

            gl.activeTexture(gl.TEXTURE0); //
            if (this.CompleteSceneBloom == true)
                gl.bindTexture(gl.TEXTURE_2D, this.sceneFBO.getTexture());

            else
                gl.bindTexture(gl.TEXTURE_2D, this.sceneBloomFBO.getTexture());


            gl.uniform1i(gl.getUniformLocation(this.blendProgramInfo, "tex1"), 0); //

            gl.activeTexture(gl.TEXTURE1); //
            gl.bindTexture(gl.TEXTURE_2D, this.blurFBO.getTexture());
            gl.uniform1i(gl.getUniformLocation(this.blendProgramInfo, "u_sceneBlur"), 1); //

            gl.activeTexture(gl.TEXTURE2); //
            gl.bindTexture(gl.TEXTURE_2D, this.sceneFBO.getTexture());
            gl.uniform1i(gl.getUniformLocation(this.blendProgramInfo, "u_sceneWithoutBloom"), 2); //

            gl.uniform1i(gl.getUniformLocation(this.blendProgramInfo, "CompleteSceneBloom"), this.CompleteSceneBloom); //

            gl.uniform1f(gl.getUniformLocation(this.blendProgramInfo, "mult"), configs.mult_bloom); //
            gl.uniform1f(gl.getUniformLocation(this.blendProgramInfo, "exposure"), configs.exposure_bloom); //
            gl.uniform1f(gl.getUniformLocation(this.blendProgramInfo, "gamma"), configs.gamma_bloom); //

            gl.bindVertexArray(this.vao_square);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);
        }
    }

    uninitialize() {

    }
};

