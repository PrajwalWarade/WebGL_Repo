const PointLightData = {
    constant: 1.0,
    linear: 0.01,
    quadratic: 0.001,
    radius: 30.0,

};

const Fog = {
    dispFactor: 20.0,
    fogFalloff: 1.5,
    fogColor: vec3.fromValues(1.0, 1.0, 1.0),
    bEnbaleFog: true,
};

class CommonShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        // this.blendTime = 300;
        this.time = 0.0;

        this.radius = 5.78;
        this.pointLightPositions;
        this.pointLightColors;

        this.isGodRaysPass = false;
        this.setViewIdentity = false;
        this.enableOrthographic = false;

        this.alpha = 1.0;
    }

    setPointLightData(pointLightPositions, pointLightColors) {
        this.pointLightPositions = pointLightPositions;
        this.pointLightColors = pointLightColors;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'model/model_fbx.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'model/model_fbx.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "vPosition");
        gl.bindAttribLocation(this.program, 1, "vNormal");
        gl.bindAttribLocation(this.program, 2, "vTexCoord");
        gl.bindAttribLocation(this.program, 3, "vTangent");
        gl.bindAttribLocation(this.program, 4, "biTangent");
        gl.bindAttribLocation(this.program, 5, "vJoints");
        gl.bindAttribLocation(this.program, 6, "vWeights");

        ShaderManger.linkProgram(gl, this.program);


        this.uniforms = this.getUniformLocations(gl, this.program);

        // const gui = new GUI.GUI();

        // gui.add(PointLightData, 'constant', 0, 10);
        // gui.add(PointLightData, 'linear', 0.0, 10);
        // gui.add(PointLightData, 'quadratic', 0, 10);
        // gui.add(PointLightData, 'radius', 0, 50);


    }

    getUniformLocations = (gl, program) => {

        const pMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        const vMatrix = gl.getUniformLocation(program, 'uViewMatrix');
        const mMatrix = gl.getUniformLocation(program, 'uModelMatrix');
        const uIsAnimated = gl.getUniformLocation(program, 'uIsAnimated');

        const uBaseColorTexture = gl.getUniformLocation(program, 'uBaseColorTexture');
        const uHasBaseColorTexture = gl.getUniformLocation(program, 'uHasBaseColorTexture');
        const uBaseColorFactor = gl.getUniformLocation(program, 'uBaseColorFactor');
        const uNormalTexture = gl.getUniformLocation(program, 'uNormalTexture');
        const uHasNormalTexture = gl.getUniformLocation(program, 'uHasNormalTexture');

        const uMetallicRoughnessTexture = gl.getUniformLocation(program, 'uMetallicRoughnessTexture');
        const uHasMetallicRoughnessTexture = gl.getUniformLocation(program, 'uHasMetallicRoughnessTexture');
        const uMetallicFactor = gl.getUniformLocation(program, 'uMetallicFactor');
        const uRoughnessFactor = gl.getUniformLocation(program, 'uRoughnessFactor');
        const uEmissiveTexture = gl.getUniformLocation(program, 'uEmissiveTexture');
        const uHasEmissiveTexture = gl.getUniformLocation(program, 'uHasEmissiveTexture');
        const uEmissiveFactor = gl.getUniformLocation(program, 'uEmissiveFactor');
        const uOcclusionTexture = gl.getUniformLocation(program, 'uOcclusionTexture');
        const uHasOcclusionTexture = gl.getUniformLocation(program, 'uHasOcclusionTexture');
        const uBrdfLut = gl.getUniformLocation(program, 'uBrdfLut');
        const uEnvironmentDiffuse = gl.getUniformLocation(program, 'uEnvironmentDiffuse');
        const uEnvironmentSpecular = gl.getUniformLocation(program, 'uEnvironmentSpecular');
        const uCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
        const uCameraviewPos = gl.getUniformLocation(program, 'uCameraviewPos');

        const uDirectionalLightDirection = gl.getUniformLocation(program, 'uDirectionalLightDirection');
        const uDirectionalLightColor = gl.getUniformLocation(program, 'uDirectionalLightColor');
        const uDirectionalLightIntensity = gl.getUniformLocation(program, 'uDirectionalLightIntensity');

        const uAmbaintFactor = gl.getUniformLocation(program, 'uAmbaintFactor');
        const bInstanced = gl.getUniformLocation(program, 'bInstanced');

        const enbaleClipping = gl.getUniformLocation(program, 'enbaleClipping');
        const upSide = gl.getUniformLocation(program, 'upSide');
        const bNightScene = gl.getUniformLocation(program, 'bNightScene');

        const bEnabelGodRaysPass = gl.getUniformLocation(program, 'bEnabelGodRaysPass');
        const uAlpha = gl.getUniformLocation(program, 'uAlpha');

        const jointTransform = [];
        for (let i = 0; i < 100; i++) {
            jointTransform[i] = gl.getUniformLocation(program, `uJointTransform[${i}]`);
        }

        // const bEnbaleExpFog = gl.getUniformLocation(program, 'bEnbaleExpFog');
        // const uFogColorExp = gl.getUniformLocation(program, 'uFogColorExp');
        // const uFogDensityExp = gl.getUniformLocation(program, 'uFogDensityExp');
        // const uFogNearExp = gl.getUniformLocation(program, 'uFogNearExp');
        // const uFogFarExp = gl.getUniformLocation(program, 'uFogFarExp');

        // Dissolve effect uniforms ===================================================
        const bEnableDissolvePass = gl.getUniformLocation(program, 'bEnableDissolvePass');
        const uProgress = gl.getUniformLocation(program, 'uProgress');
        const uEdge = gl.getUniformLocation(program, 'uEdge');
        const uEdgeColor = gl.getUniformLocation(program, 'uEdgeColor');
        const uFrequency = gl.getUniformLocation(program, 'uFrequency');
        const uAmplitude = gl.getUniformLocation(program, 'uAmplitude');
        // ============================================================================

        return {
            pMatrix,
            vMatrix,
            mMatrix,
            jointTransform,
            uIsAnimated,
            uBaseColorTexture,
            uHasBaseColorTexture,
            uBaseColorFactor,
            uNormalTexture,
            uHasNormalTexture,
            uMetallicRoughnessTexture,
            uHasMetallicRoughnessTexture,
            uMetallicFactor,
            uRoughnessFactor,
            uEmissiveTexture,
            uHasEmissiveTexture,
            uEmissiveFactor,
            uOcclusionTexture,
            uHasOcclusionTexture,
            uBrdfLut,
            uEnvironmentDiffuse,
            uEnvironmentSpecular,
            uCameraPosition,
            uCameraviewPos,
            uDirectionalLightDirection,
            uDirectionalLightColor,
            uDirectionalLightIntensity,
            uAmbaintFactor,
            bInstanced,
            enbaleClipping,
            upSide,
            bNightScene,
            bEnabelGodRaysPass,
            uAlpha,

            // bEnbaleExpFog,
            // uFogColorExp,
            // uFogDensityExp,
            // uFogNearExp,
            // uFogFarExp

            // Dissolve effect uniforms ===================================================
            bEnableDissolvePass,
            uProgress,
            uEdge,
            uEdgeColor,
            uFrequency,
            uAmplitude,
            // ============================================================================
        
        
        };
    };

    render = (model, camera, modelMatrix, deltaTime, showOnlyAbove, textureid, dissolveEnabled = false, dissolveProgress = 0.0) => {

        var viewMatrix;
        if (this.setViewIdentity == true) {
            viewMatrix = mat4.create();
        } else {
            viewMatrix = camera.getViewMatrix();
        }
        gl.useProgram(this.program);

        if (this.enableOrthographic == false) {
            gl.uniformMatrix4fv(this.uniforms.pMatrix, false, perspectiveProjectionMatrix);
        }
        else {
            gl.uniformMatrix4fv(this.uniforms.pMatrix, false, orthographicProjectionMatrix);
        }

        gl.uniformMatrix4fv(this.uniforms.vMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, false, modelMatrix);

        gl.uniform1i(this.uniforms.uIsAnimated, 0);
        if (this.isGodRaysPass == true) {

            gl.uniform1i(this.uniforms.bEnabelGodRaysPass, 1);
        } else {

            gl.uniform1i(this.uniforms.bEnabelGodRaysPass, 0);
        }
        if (showOnlyAbove != undefined) {
            gl.uniform1i(this.uniforms.enbaleClipping, 1);
            if (showOnlyAbove == true) {
                gl.uniform1i(this.uniforms.upSide, 1);
            }
            else {
                gl.uniform1i(this.uniforms.upSide, 0);
            }
        }
        else
            gl.uniform1i(this.uniforms.enbaleClipping, 0);

        // model.updateModel(0, 0.0);
        // model.updateModel(0, deltaTime);
        var boneMat = model.getFinalBoneMatrices(0);
        for (var i = 0; i < boneMat.length; i++) {
            gl.uniformMatrix4fv(this.uniforms.jointTransform[i], false, boneMat[i])

            gl.uniform1i(this.uniforms.uIsAnimated, 1);
        }

        if (bNightScene === true)
            this.setPointLights();
        else
            gl.uniform1i(this.uniforms.bNightScene, 0);

        gl.uniform3fv(this.uniforms.uDirectionalLightDirection, vec3.fromValues(0.0, 0.0, -10.0));
        gl.uniform3fv(this.uniforms.uDirectionalLightColor, vec3.fromValues(1.0, 1.0, 1.0));
        gl.uniform1f(this.uniforms.uDirectionalLightIntensity, 1.0);
        gl.uniform1f(this.uniforms.uAmbaintFactor, 0.75);
        gl.uniform1f(this.uniforms.uAlpha, this.alpha);

        // // EXP FOG
        // var fogNear = 1.0; // Adjust this value as needed
        // var fogFar = 10.0; // Adjust this value as needed
        // var fogDensity = 0.5;

        // gl.uniform1i(this.bEnbaleExpFog, 1);
        // gl.uniform1f(this.uFogNearExp, fogNear);
        // gl.uniform1f(this.uFogFarExp, fogFar);
        // gl.uniform1f(this.uFogDensityExp, fogDensity);
        // gl.uniform4fv(this.uFogColorExp,new Float32Array([0.7, 0.7, 0.7, 1.0]));
        
        // Dissolve effect uniforms ===================================================
        if (dissolveEnabled != undefined) {
            if (dissolveEnabled === true) {
                gl.uniform1i(this.uniforms.bEnableDissolvePass, 1);
                gl.uniform1f(this.uniforms.uProgress, dissolveProgress);
                gl.uniform1f(this.uniforms.uEdge, 0.15);
                gl.uniform3fv(this.uniforms.uEdgeColor, vec3.fromValues(0.8, 0.4, 0.1));
                gl.uniform1f(this.uniforms.uFrequency, 0.5);
                gl.uniform1f(this.uniforms.uAmplitude, 0.8);
            }
            else {
                gl.uniform1i(this.uniforms.bEnableDissolvePass, 0);
            }
        }
        // ============================================================================


        gl.uniform3fv(this.uniforms.uCameraPosition, vec3.fromValues(0.0, 10.0, 10.0));
        gl.uniform3fv(this.uniforms.uCameraviewPos, camera.getCenter());

        model.render(this.uniforms, textureid);

        gl.useProgram(null);



    };


    setRadius(r) {
        this.radius = r;
    }

    setPointLights(pointLightPositions) {
        gl.uniform1i(this.uniforms.bNightScene, 1);

        if (enablePointLightsControl === true) {
            for (var i = 0; i < bezierPointsGlobal.length; i++) {

                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Position"), new Float32Array(bezierPointsGlobal[i]));
                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Color"), new Float32Array([1.0, 1.0, 1.0]));

                // var constant = 1.0 - 0.5 + scaleX;
                // var linear = 0.7 + 0.59 - 1.3;
                // var quadratic = 1.8 - 1.8 + scaleZ;

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
            for (var i = 0; i < this.pointLightPositions.length; i++) {

                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Position"), new Float32Array(this.pointLightPositions[i]));
                gl.uniform3fv(gl.getUniformLocation(this.program, "lights[" + i + "].Color"), this.pointLightColors[i]);

                // var constant = 1.0 - 0.5 + scaleX;
                // var linear = 0.7 + 0.59 - 1.3;
                // var quadratic = 1.8 - 1.8 + scaleZ;

                var constant = PointLightData.constant;
                var linear = PointLightData.linear;
                var quadratic = PointLightData.quadratic;


                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Linear"), linear);
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Quadratic"), quadratic);

                var maxBrightness = Math.max(Math.max(this.pointLightColors[i][0], this.pointLightColors[i][1]), this.pointLightColors[i][2]);
                var radius = (-linear + Math.sqrt(linear * linear - 4 * quadratic * (constant - (256.0 / 5.0) * maxBrightness))) / (2.0 * quadratic);
                radius = this.radius;
                radius = PointLightData.radius;
                gl.uniform1f(gl.getUniformLocation(this.program, "lights[" + i + "].Radius"), radius * 5.0);

            }
        }
    }

    renderPointLights(camera, modelMatrix, pointLightPositions) {
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

                colorCubeShader.render(camera, modelMatrix, this.pointLightColors[i]);
            }
        }

    }

    uninitialize(){

    }
};
