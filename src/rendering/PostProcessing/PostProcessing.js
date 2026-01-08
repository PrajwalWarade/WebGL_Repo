
class PostProcess {
    constructor() {
        this.shaderProgramObject;
        this.uniforms;

        this.vao_square;
        this.vbo_Square_Position;
        this.vbo_Square_Texcoord;

        this.gfVignetteInnerRadius;
        this.gfVignetteOuterRadius;
        this.fadeInEnabled = true;

        this.alpha = 1.0;
        this.enbaleFMBNoise = false;
    }

    async initialize() {
        this.shaderProgramObject = ShaderManger.createProgram(gl);
        await Promise.all([
            await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'post_proc/post_proc.vs', gl.VERTEX_SHADER)),
            await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'post_proc/post_proc.fs', gl.FRAGMENT_SHADER)),
        ]);
        gl.bindAttribLocation(this.shaderProgramObject, 0, "aPosition");
        gl.bindAttribLocation(this.shaderProgramObject, 1, "aTexcoord");
        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.uniforms = this.getUniforms();

        var squareVertices = new Float32Array([
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
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
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vbo_Square_Texcoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Square_Texcoord);
        gl.bufferData(gl.ARRAY_BUFFER, squareTexcoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

        if (!this.fadeInEnabled) {
            this.gfVignetteInnerRadius = 1.4;
            this.gfVignetteOuterRadius = 2.0;
        } else {
            this.gfVignetteInnerRadius = 0.0;
            this.gfVignetteOuterRadius = 0.4;
        }


    }

    getUniforms() {

        const screenTexture = gl.getUniformLocation(this.shaderProgramObject, "screenTexture");
        const cloudTEX = gl.getUniformLocation(this.shaderProgramObject, "cloudTEX");
        const depthTex = gl.getUniformLocation(this.shaderProgramObject, "depthTex");
        const alpha = gl.getUniformLocation(this.shaderProgramObject, "alpha");
        const resolution = gl.getUniformLocation(this.shaderProgramObject, "resolution");
        const wireframe = gl.getUniformLocation(this.shaderProgramObject, "wireframe");
        const u_vignetteOuterRadius = gl.getUniformLocation(this.shaderProgramObject, "u_vignetteOuterRadius");
        const u_vignetteInnerRadius = gl.getUniformLocation(this.shaderProgramObject, "u_vignetteInnerRadius");

        const bEnableBloom = gl.getUniformLocation(this.shaderProgramObject, "bEnableBloom");
        const u_sceneBloom = gl.getUniformLocation(this.shaderProgramObject, "u_sceneBloom");
        const u_sceneBlur = gl.getUniformLocation(this.shaderProgramObject, "u_sceneBlur");
        const mult_bloom = gl.getUniformLocation(this.shaderProgramObject, "mult_bloom");
        const exposure_bloom = gl.getUniformLocation(this.shaderProgramObject, "exposure_bloom");
        const gamma_bloom = gl.getUniformLocation(this.shaderProgramObject, "gamma_bloom");

        const fbmTexture = gl.getUniformLocation(this.shaderProgramObject, "fbmTexture");
        const enableFMBSampler = gl.getUniformLocation(this.shaderProgramObject, "enableFMB");

        const bEnableGodRays = gl.getUniformLocation(this.shaderProgramObject, "bEnableGodRays");
        const godrays_exposure = gl.getUniformLocation(this.shaderProgramObject, "godrays_exposure");
        const godrays_decay = gl.getUniformLocation(this.shaderProgramObject, "godrays_decay");
        const godrays_density = gl.getUniformLocation(this.shaderProgramObject, "godrays_density");
        const godrays_weight = gl.getUniformLocation(this.shaderProgramObject, "godrays_weight");
        const godrays_ColorMapSampler = gl.getUniformLocation(this.shaderProgramObject, "godrays_ColorMapSampler");
        const godrays_lightPositionOnScreen = [];
        godrays_lightPositionOnScreen[0] = gl.getUniformLocation(this.shaderProgramObject, "godrays_lightPositionOnScreen[0]");
        godrays_lightPositionOnScreen[1] = gl.getUniformLocation(this.shaderProgramObject, "godrays_lightPositionOnScreen[1]");

        return {
            screenTexture,
            cloudTEX,
            depthTex,
            alpha,
            resolution,
            wireframe,
            u_vignetteOuterRadius,
            u_vignetteInnerRadius,
            bEnableBloom,
            u_sceneBloom,
            u_sceneBlur,
            mult_bloom,
            gamma_bloom,
            exposure_bloom,

            bEnableGodRays,
            godrays_exposure,
            godrays_decay,
            godrays_density,
            godrays_lightPositionOnScreen,
            godrays_ColorMapSampler,
            godrays_weight,
            fbmTexture,
            enableFMBSampler
        };
    };

    getTexture() {
        return this.fbo.getTexture();
    }

    startFadeOut() {
        if (!this.fadeInEnabled) {
            if (this.gfVignetteOuterRadius >= 0.0) {
                //if (this.gfVignetteInnerRadius <= 0.4) {
                this.gfVignetteInnerRadius -= 0.01;
                //}
            }

            if (this.gfVignetteOuterRadius >= 0.0) {
                this.gfVignetteOuterRadius -= 0.01;

            }
        }
    }

    startFadeIn() {
        if (this.fadeInEnabled) {

            if (this.gfVignetteOuterRadius < 0.9) {
                this.gfVignetteOuterRadius = this.gfVignetteOuterRadius + (0.01 * 0.45);
            }

            if (this.gfVignetteInnerRadius < 0.7) {
                this.gfVignetteInnerRadius = this.gfVignetteInnerRadius + (0.009 * 0.45);
            }
        }
    }

    draw(sceneFBO, cloudTexture, sceneBloomTexture, sceneBlurTexture, scaneGodRaysPassTexture, fmbNoiseTexture) {

        this.startFadeIn();
        // this.startFadeOut(); 


        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        resize();

        gl.useProgram(this.shaderProgramObject);


        gl.uniform2fv(this.uniforms.resolution, [canvas.width, canvas.height]);

        gl.uniform1f(this.uniforms.alpha, this.alpha);
        gl.uniform1i(this.uniforms.wireframe, 0);

        // Bind reflection texture
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.uniforms.screenTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, sceneFBO.getTexture());

        // Bind reflection texture
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(this.uniforms.cloudTEX, 1);
        gl.bindTexture(gl.TEXTURE_2D, cloudTexture);


        // Bind reflection texture
        gl.activeTexture(gl.TEXTURE2);
        gl.uniform1i(this.uniforms.depthTex, 2);
        gl.bindTexture(gl.TEXTURE_2D, sceneFBO.getDepthTexture());


        if (configs.enable_bloom === true) {
            gl.uniform1i(this.uniforms.bEnableBloom, 1);

            gl.activeTexture(gl.TEXTURE3);
            gl.uniform1i(this.uniforms.u_sceneBloom, 3);
            gl.bindTexture(gl.TEXTURE_2D, sceneBloomTexture);

            gl.activeTexture(gl.TEXTURE4);
            gl.uniform1i(this.uniforms.u_sceneBlur, 4);
            gl.bindTexture(gl.TEXTURE_2D, sceneBlurTexture);

            gl.uniform1f(this.uniforms.mult_bloom, configs.mult_bloom);
            gl.uniform1f(this.uniforms.exposure_bloom, configs.exposure_bloom);
            gl.uniform1f(this.uniforms.gamma_bloom, configs.gamma_bloom);

        } else {

            gl.uniform1i(this.uniforms.bEnableBloom, 0);
        }


        gl.activeTexture(gl.TEXTURE5);
        gl.uniform1i(this.uniforms.fbmTexture, 5);
        gl.bindTexture(gl.TEXTURE_2D, fmbNoiseTexture);
        gl.uniform1i(this.uniforms.enableFMBSampler, this.enbaleFMBNoise);

        if (configs.enable_GodRays === true) {

            gl.uniform1i(this.uniforms.bEnableGodRays, 1);
            gl.uniform1f(this.uniforms.godrays_exposure, configs.godrays_exposure);
            gl.uniform1f(this.uniforms.godrays_decay, configs.godrays_decay);
            gl.uniform1f(this.uniforms.godrays_density, configs.godrays_density);
            gl.uniform1f(this.uniforms.godrays_weight, configs.godrays_weight);

            // gl.uniform2f(this.uniforms.godrays_lightPositionOnScreen[0], 0.5, 0.5);
            gl.uniform2f(this.uniforms.godrays_lightPositionOnScreen[0], godRaysLightPos[0], godRaysLightPos[1]);
            gl.uniform2f(this.uniforms.godrays_lightPositionOnScreen[1], 0.0, 0.0);

            gl.activeTexture(gl.TEXTURE5)
            gl.uniform1i(this.uniforms.godrays_ColorMapSampler, 5);
            gl.bindTexture(gl.TEXTURE_2D, scaneGodRaysPassTexture);

        } else {

            gl.uniform1i(this.uniforms.bEnableGodRays, 0);
        }

        gl.uniform1f(this.uniforms.u_vignetteOuterRadius, this.gfVignetteOuterRadius);
        gl.uniform1f(this.uniforms.u_vignetteInnerRadius, this.gfVignetteInnerRadius);

        gl.bindVertexArray(this.vao_square);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bindVertexArray(null);

        gl.useProgram(null);

    }

    uninitialize() {

    }

}