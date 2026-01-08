let instanceTerriansShader;

class TerrainShader {
    constructor() {
        if (instanceTerriansShader) {
            return instanceTerriansShader;
        }
        instanceTerriansShader = this;

        this.program;

        this.modelMatrixUniform;
        this.viewMatrixUniform;
        this.projectionMatrixUniform;

        this.diffuseColoUniform;
        this.lightDirectionUniform;
        this.paddingUniform;

        this.shaderTextureUniform;
        this.normalTextureUniform;

        this.diffuseTexture;
        this.normalTexture;

        this.enbaleClipping;
        this.upSide;

        this.bNightScene;
        this.uCameraviewPos;

        this.bEnbaleFogUniform;
        this.fogFalloffUniform;
        this.fogColorUniform;
        this.gDispFactorUniform;

        this.uAlphaUniform;
        this.alpha = 1.0;

        // this.bEnbaleExpFog;
        // this.uFogColorExp;
        // this.uFogDensityExp;
        // this.uFogNearExp;
        // this.uFogFarExp;

        this.bDone = false;

        this.bGodRaysPass = 0;
    }

    async initialize() {
        // CREATE AND LINK SHADER
        this.program = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'terrain/terrain.vs.glsl', gl.VERTEX_SHADER)),
            gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'terrain/terrain.fs.glsl', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.program, 0, "position");
        gl.bindAttribLocation(this.program, 1, "texCoord");
        gl.bindAttribLocation(this.program, 2, "normal");
        gl.bindAttribLocation(this.program, 3, "tangent");
        gl.bindAttribLocation(this.program, 4, "binormal");
        gl.bindAttribLocation(this.program, 5, "color");

        ShaderManger.linkProgram(gl, this.program);

        // GET UNIFORM LOCATIONS
        // POST LINK - GET UNIFORM LOCATION
        this.modelMatrixUniform = gl.getUniformLocation(this.program, "uModelMatrix");
        this.viewMatrixUniform = gl.getUniformLocation(this.program, "uViewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.program, "uProjectionMatrix");

        this.diffuseColoUniform = gl.getUniformLocation(this.program, "diffuseColor");
        this.lightDirectionUniform = gl.getUniformLocation(this.program, "lightDirection");
        this.paddingUniform = gl.getUniformLocation(this.program, "padding");

        this.shaderTextureUniform = gl.getUniformLocation(this.program, "shaderTexture");
        this.normalTextureUniform = gl.getUniformLocation(this.program, "normalTexture");

        this.enbaleClipping = gl.getUniformLocation(this.program, "enbaleClipping");
        this.upSide = gl.getUniformLocation(this.program, "upSide");

        this.bNightScene = gl.getUniformLocation(this.program, "bNightScene");
        this.uCameraviewPos = gl.getUniformLocation(this.program, "uCameraviewPos");

        this.bGodRaysPassUniform = gl.getUniformLocation(this.program, "bGodRaysPass");

        this.bEnbaleFogUniform = gl.getUniformLocation(this.program, "bEnbaleFog");
        this.fogFalloffUniform = gl.getUniformLocation(this.program, "fogFalloff");
        this.fogColorUniform = gl.getUniformLocation(this.program, "fogColor");
        this.gDispFactorUniform = gl.getUniformLocation(this.program, "gDispFactor");
        this.uAlphaUniform = gl.getUniformLocation(this.program, "uAlpha");

        this.diffuseTexture = TextureManger.LoadHighQualityTexture("./assets/terrain/Forest/dirt01d.jpeg");

        this.normalTexture = TextureManger.LoadHighQualityTexture("./assets/terrain/Village/NormalMap.png");

        // this.bEnbaleExpFog = gl.getUniformLocation(this.program, 'bEnbaleExpFog');
        // this.uFogColorExp = gl.getUniformLocation(this.program, 'uFogColorExp');
        // this.uFogDensityExp = gl.getUniformLocation(this.program, 'uFogDensityExp');
        // this.uFogNearExp = gl.getUniformLocation(this.program, 'uFogNearExp');
        // this.uFogFarExp = gl.getUniformLocation(this.program, 'uFogFarExp');

    }

    bind(camera, modelMatrix, delatTime, showOnlyAbove) {
        // gl.enable(gl.CULL_FACE);

        this.update(delatTime);

        // USE SHADER PROGRAM OBJECT
        gl.useProgram(this.program);

        if (showOnlyAbove != undefined) {
            gl.uniform1i(this.enbaleClipping, 1);
            if (showOnlyAbove == true) {
                gl.uniform1i(this.upSide, 1);
            }
            else {
                gl.uniform1i(this.upSide, 0);
            }

        }
        gl.uniform1f(this.uAlphaUniform, this.alpha);


        gl.uniformMatrix4fv(this.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(this.viewMatrixUniform, false, camera.getViewMatrix());
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, perspectiveProjectionMatrix);

        gl.uniform3fv(this.diffuseColoUniform, vec3.fromValues(1.0, 1.0, 1.0));
        gl.uniform3fv(this.lightDirectionUniform, vec3.fromValues(0.0, 0.0, -1.0));
        gl.uniform1f(this.paddingUniform, this.materialShineeness);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.diffuseTexture);
        gl.uniform1i(this.shaderTextureUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.normalTexture);
        gl.uniform1i(this.normalTextureUniform, 1);

        gl.uniform1i(this.bGodRaysPassUniform, this.bGodRaysPass);

        gl.uniform1i(this.bEnbaleFogUniform, configs.enable_fog);
        gl.uniform1f(this.fogFalloffUniform, configs.fog_fogFalloff);
        gl.uniform3fv(this.fogColorUniform, new Float32Array([configs.fog_fogColor[0] / 255.0, configs.fog_fogColor[1] / 255.0, configs.fog_fogColor[2] / 255.0]));
        gl.uniform1f(this.gDispFactorUniform, configs.fog_dispFactor);

        gl.uniform3fv(this.uCameraviewPos, camera.getCenter());

        // // EXP FOG
        // var fogNear = 50.0; // Adjust this value as needed
        // var fogFar = 100.0; // Adjust this value as needed
        // var fogDensity = 0.3;
        // gl.uniform1i(this.bEnbaleExpFog, 1);
        // gl.uniform1f(this.uFogNearExp, fogNear);
        // gl.uniform1f(this.uFogFarExp, fogFar);
        // gl.uniform1f(this.uFogDensityExp, fogDensity);
        // gl.uniform4fv(this.uFogColorExp, new Float32Array([0.7, 0.7, 0.7, 1.0]));

        if (this.bDone === false) {
            console.log(configs.enable_fog);
            console.log(configs.fog_fogFalloff);
            console.log(configs.fog_fogColor);
            console.log(configs.fog_dispFactor);
            this.bDone = true
        }

        if (bNightScene === true)
            this.setPointLights(camera);

    }

    setPointLights(camera) {
        gl.uniform1i(this.bNightScene, 1);

        if (enablePointLightsControl === true) {
            for (var i = 0; i < bezierPointsGlobal.length; i++) {

                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Position"), new Float32Array(bezierPointsGlobal[i]));
                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Color"), new Float32Array([1.0, 1.0, 1.0]));

                var constant = PointLightData.constant;
                var linear = PointLightData.linear;
                var quadratic = PointLightData.quadratic;


                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Linear"), linear);
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Quadratic"), quadratic);

                var maxBrightness = Math.max(Math.max(1.0, 1.0), 1.0);
                var radius = (-linear + Math.sqrt(linear * linear - 4 * quadratic * (constant - (256.0 / 5.0) * maxBrightness))) / (2.0 * quadratic);
                radius = PointLightData.radius;
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Radius"), radius * 5.0);

            }
        }
        else {
            for (var i = 0; i < pointLightPositions.length; i++) {

                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Position"), new Float32Array(pointLightPositions[i]));
                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Color"), pointLightColors[i]);

                var constant = PointLightData.constant;
                var linear = PointLightData.linear;
                var quadratic = PointLightData.quadratic;


                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Linear"), linear);
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Quadratic"), quadratic);

                var maxBrightness = Math.max(Math.max(pointLightColors[i][0], pointLightColors[i][1]), pointLightColors[i][2]);
                var radius = (-linear + Math.sqrt(linear * linear - 4 * quadratic * (constant - (256.0 / 5.0) * maxBrightness))) / (2.0 * quadratic);
                radius = PointLightData.radius;
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Radius"), radius * 5.0);

            }
        }
    }

    renderPointLights(camera, modelMatrix) {
        if (enablePointLightsControl === true) {
            for (var i = 0; i < bezierPointsGlobal.length; i++) {
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(bezierPointsGlobal[i][0], bezierPointsGlobal[i][1], bezierPointsGlobal[i][2]));
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.5, 0.5, 0.5));

                colorCubeShader.render(camera, modelMatrix, vec3.fromValues(1.0, 1.0, 1.0));
            }
        }
        else {
            for (var i = 0; i < pointLightPositions.length; i++) {
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(pointLightPositions[i][0], pointLightPositions[i][1], pointLightPositions[i][2]));
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.5, 0.5, 0.5));

                colorCubeShader.render(camera, modelMatrix, pointLightColors[i]);
            }
        }

    }

    unbind() {
        // gl.disable(gl.CULL_FACE);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniform1i(this.shaderTextureUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniform1i(this.normalTextureUniform, 1);

        gl.useProgram(null);

        if (enablePointLightsControl === true && bNightScene === true)
            this.renderPointLights(camera, modelMatrix);
    }

    update(delatTime) {

    }

    async uninitialize() {
        ShaderManger.destroyProgram(gl, this.program);
    }

};
