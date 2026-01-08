
class Water {
    constructor() {
        this.reflectionFramebuffer = null;
        this.refractionFramebuffer = null;

        this.fbo_reflection = null;
        this.rbo_reflection = null;
        this.fbo_texture_reflection = null;

        this.vao_waterQuad = null;
        this.vbo_waterQuad_position = null;

        this.texture_waterDUDVMap = null;
        this.texture_waterNormalMap = null;

        this.moveFactor = 0.1;

        this.waterQuadShader = null;
        this.shaderProgramObjectTexturedQuad = null;

        // this.WATER_QUAD_SIZE = 10.0;
        this.WATER_QUAD_SIZE = 210.0;

        this.REFLECTION_FBO_WIDTH = 2560.0;
        this.REFLECTION_FBO_HEIGHT = 1440.0;

        this.refraction_fbo;
        this.reflecttion_fbo;

        this.WATER_WAVE_SPEED = 1.0;

        this.planeVAO;
        this.planeVBO;
        this.planeEBO;
        this.vertexCount;
        this.res = 2;

        this.bGodRaysPass = 0;

        this.originalCameraPosition;

        this.alpha = 1.0;
    }

    initialize() {
        // this.initializeReflectionFBO();
        // this.initializeRefractionFBO();


        this.refraction_fbo = new Framebuffer();
        this.refraction_fbo.create(2560.0, 1440.0);


        this.reflecttion_fbo = new Framebuffer();
        this.reflecttion_fbo.create(2560.0, 1440.0);

        // SHADERS
        this.waterQuadShader = new WaterQuadShader();

        // TEXTURES
        this.texture_waterNormalMap = TextureManger.LoadHighQualityTexture("assets/textures/Water/waterNormalMap.png");
        this.texture_waterDUDVMap = TextureManger.LoadHighQualityTexture("assets/textures/Water/waterDUDV.png");

        // GEOMETRY - QUAD
        const waterQuadPositions = new Float32Array([
            -this.WATER_QUAD_SIZE, -this.WATER_QUAD_SIZE,
            -this.WATER_QUAD_SIZE, this.WATER_QUAD_SIZE,
            this.WATER_QUAD_SIZE, -this.WATER_QUAD_SIZE,

            this.WATER_QUAD_SIZE, -this.WATER_QUAD_SIZE,
            -this.WATER_QUAD_SIZE, this.WATER_QUAD_SIZE,
            this.WATER_QUAD_SIZE, this.WATER_QUAD_SIZE
        ]);

        // VAO-VBO Related Code
        this.vao_waterQuad = gl.createVertexArray();
        gl.bindVertexArray(this.vao_waterQuad);

        // VBO For Position
        this.vbo_waterQuad_position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_waterQuad_position);
        gl.bufferData(gl.ARRAY_BUFFER, waterQuadPositions, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 2, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);


        // 
        this.res = 2;
        this.initializePlaneVAO(this.res, this.WATER_QUAD_SIZE);

    }

    initializePlaneVAO(res, width) {
        const nPoints = res * res;
        const size = nPoints * 3 + nPoints * 3 + nPoints * 2;
        const vertices = new Float32Array(size);

        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                // add position
                let x = j * width / (res - 1) - width / 2.0;
                let y = 0.0;
                let z = -i * width / (res - 1) + width / 2.0;

                vertices[(i + j * res) * 8] = x;
                vertices[(i + j * res) * 8 + 1] = y;
                vertices[(i + j * res) * 8 + 2] = z;

                // add normal
                vertices[(i + j * res) * 8 + 3] = 0.0;
                vertices[(i + j * res) * 8 + 4] = 1.0;
                vertices[(i + j * res) * 8 + 5] = 0.0;

                // add texcoords
                vertices[(i + j * res) * 8 + 6] = j / (res - 1);
                vertices[(i + j * res) * 8 + 7] = (res - i - 1) / (res - 1);
            }
        }
        // console.log(vertices);
        const nTris = (res - 1) * (res - 1) * 2;
        const trisIndices = new Uint16Array(nTris * 3);

        let index = 0;
        for (let i = 0; i < res - 1; i++) {
            for (let j = 0; j < res - 1; j++) {
                const topLeft = i * res + j;
                const topRight = topLeft + 1;
                const bottomLeft = (i + 1) * res + j;
                const bottomRight = bottomLeft + 1;

                trisIndices[index++] = topLeft;
                trisIndices[index++] = bottomLeft;
                trisIndices[index++] = topRight;

                trisIndices[index++] = topRight;
                trisIndices[index++] = bottomLeft;
                trisIndices[index++] = bottomRight;
            }
        }
        console.log("trisIndices : " + trisIndices);

        this.planeVAO = gl.createVertexArray();
        gl.bindVertexArray(this.planeVAO);

        this.planeVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.planeEBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.planeEBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, trisIndices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(2);

        gl.bindVertexArray(null);
        this.vertexCount = nTris * 3;
        // return {
        //     vao: planeVAO,
        //     vbo: planeVBO,
        //     ebo: planeEBO,
        //     vertexCount: nTris * 3
        // };
    }


    bindReflectionFBO(camera) {

        this.reflecttion_fbo.bind();

        // this.originalCameraPosition = vec3.create();
        // this.originalCameraPosition = camera.position;

        // camera.invertPitch();
        // camera.position[1] -= 2 * Math.abs(camera.position[1] - 0.0);

        // var distance = 2.0 * (camera.position[1] - 0.0);
        // camera.position[1] = camera.position[1] - distance;

        // console.log("before invert :" + camera.position);
        // console.log("after invert :" + camera.position);

        // Store original pitch and Y position
        this.savedPitch = camera.pitch;
        this.savedPositionY = camera.position[1];
        
        // Flip camera for reflection
        const waterHeight = 2.0;
        const distance = 2.0 * (camera.position[1] - waterHeight);
        
        camera.invertPitch();
        camera.position[1] = camera.position[1] - distance;

    }

    unbindReflectionFBO(camera) {

        // camera.invertPitch();
        // camera.position[1] += 2 * Math.abs(camera.position[1] - 0.0);

        // camera.position = this.originalCameraPosition;

        // if (USE_FPV_CAM === false) {
        //     globalBSplineCamera.moveAlongBSpline(globalAnimationDelta);
        // }

        // var distance = 2.0 * (camera.position[1] - 0.0);
        // camera.position[1] = camera.position[1] + distance;

        // console.log("before revert :" + camera.position);
        // camera.position[1] += 2 * Math.abs(camera.position[1] - 0.0);

        // Restore original values
        camera.pitch = this.savedPitch;
        camera.position[1] = this.savedPositionY;
        camera.updateCameraVectors();

        // console.log("after revert :" + camera.position);
        this.reflecttion_fbo.unbind();
    }

    bindRefractionFBO() {
        this.refraction_fbo.bind();
    }

    unbindRefractionFBO() {
        this.refraction_fbo.unbind();
    }

    Render(camera, viewMatrix) {
        var lightColor;
        var lightPosition;
        if (bNightScene) {
            // lightColor = new Float32Array([configs.water_light_Color[0] / 255, configs.water_light_Color[1] / 255, configs.water_light_Color[2] / 255]);
            lightColor = new Float32Array([15.0 / 255.0, 15.0 / 255.0, 130.0 / 255.0]);
            lightPosition = new Float32Array([0.0, 0.0, 0.0]);

        } else {
            lightColor = new Float32Array([configs.water_light_Color[0] / 255, configs.water_light_Color[1] / 255, configs.water_light_Color[2] / 255]);
            // lightPosition = new Float32Array([250.0, 261.0, 1000.0]);
            lightPosition = new Float32Array([configs.sun_position_x, configs.sun_position_y, configs.sun_position_z]);
        }

        // const lightColor = new Float32Array([1.0, 1.0, 1.0]);
        let pos;

        pos = camera.getCenter();

        // const lightPosition = new Float32Array([pos[0] + 687.500, pos[1], pos[2] + -17.6]);

        gl.useProgram(this.waterQuadShader.shaderProgramObject);

        gl.uniform1f(this.waterQuadShader.u_alpha, this.alpha);

        gl.uniform1i(this.waterQuadShader.bGodRaysPass, this.bGodRaysPass);

        gl.uniformMatrix4fv(this.waterQuadShader.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(this.waterQuadShader.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(this.waterQuadShader.projectionMatrixUniform, false, perspectiveProjectionMatrix);

        gl.uniform3fv(this.waterQuadShader.u_cameraPosition, camera.getEye());
        gl.uniform3fv(this.waterQuadShader.u_lightPosition, lightPosition);

        gl.uniform1f(this.waterQuadShader.tiling, configs.water_tiling);

        gl.uniform1i(this.waterQuadShader.enable[0], 1);
        gl.uniform1i(this.waterQuadShader.enable[1], 1);
        gl.uniform1i(this.waterQuadShader.enable[2], 1);
        gl.uniform1i(this.waterQuadShader.enable[3], 1);

        gl.uniform1f(this.waterQuadShader.amplitude[0], 0.5);
        gl.uniform1f(this.waterQuadShader.amplitude[1], 0.4);
        gl.uniform1f(this.waterQuadShader.amplitude[2], 0.2);
        gl.uniform1f(this.waterQuadShader.amplitude[3], 0.1);

        gl.uniform1f(this.waterQuadShader.direction[0], 45.0);
        gl.uniform1f(this.waterQuadShader.direction[1], 120.0);
        gl.uniform1f(this.waterQuadShader.direction[2], 170.0);
        gl.uniform1f(this.waterQuadShader.direction[3], 65.0);

        gl.uniform1f(this.waterQuadShader.speed[0], 0.4);
        gl.uniform1f(this.waterQuadShader.speed[1], 0.8);
        gl.uniform1f(this.waterQuadShader.speed[2], 0.8);
        gl.uniform1f(this.waterQuadShader.speed[3], 1.0);

        gl.uniform3fv(this.waterQuadShader.u_lightColor, lightColor);

        this.moveFactor += 0.001;
        gl.uniform1f(this.waterQuadShader.u_moveFactorOffset, this.moveFactor);

        gl.uniform1f(this.waterQuadShader.waveStrength, configs.water_waveStrength);
        gl.uniform1f(this.waterQuadShader.shininess, configs.water_shininess);
        gl.uniform1f(this.waterQuadShader.reflectivity, configs.water_reflectivity);
        // gl.uniform1f(this.waterQuadShader.reflectivity, 0.5);
        // gl.uniform1f(this.waterQuadShader.reflectivity, reflectivityValue);
       
        // Set sun disk reflection parameters
        if(bReflectionEnable === true)
        {
            if (bNightScene === false)
            {
                // For evening sun effect
                gl.uniform1f(this.waterQuadShader.u_sunDiskSize, configs.sun_disk_size);      // Large disk
                gl.uniform1f(this.waterQuadShader.u_sunIntensity, configs.sun_intensity);     // Very bright
                gl.uniform3fv(this.waterQuadShader.u_sunColor, vec3.fromValues(configs.sun_color_refl[0] / 255.0, configs.sun_color_refl[1] / 255.0, configs.sun_color_refl[2] / 255.0));         
            }
            else
            {
                // No sun reflection
                gl.uniform1f(this.waterQuadShader.u_sunDiskSize, 50.0);     // Very small (invisible)
                gl.uniform1f(this.waterQuadShader.u_sunIntensity, 0.0);     // No brightness
                gl.uniform3fv(this.waterQuadShader.u_sunColor, new Float32Array([0.0, 0.0, 0.0]));
            }
        }

        gl.uniform2f(this.waterQuadShader.resolutionUniform, 2560.0, 1440.0);

        // Fog
        gl.uniform1i(this.waterQuadShader.bEnbaleFogUniform, configs.enable_fog);
        gl.uniform1f(this.waterQuadShader.fogFalloffUniform, 5.5);
        // gl.uniform1f(this.waterQuadShader.fogFalloffUniform, configs.fog_fogFalloff);
        gl.uniform3fv(this.waterQuadShader.fogColorUniform, new Float32Array([configs.fog_fogColor[0] / 255.0, configs.fog_fogColor[1] / 255.0, configs.fog_fogColor[2] / 255.0]));
        gl.uniform1f(this.waterQuadShader.gDispFactorUniform, configs.fog_dispFactor);

        // Bind reflection texture
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.waterQuadShader.u_reflectionTextureSampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, this.reflecttion_fbo.getTexture());
        // gl.bindTexture(gl.TEXTURE_2D, this.fbo_texture_reflection);

        // Bind refraction texture
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(this.waterQuadShader.u_refractionTextureSampler, 1);
        gl.bindTexture(gl.TEXTURE_2D, this.refraction_fbo.getTexture());
        // gl.bindTexture(gl.TEXTURE_2D, this.fbo_texture_refraction);

        // Bind Water DUDVMap texture
        gl.activeTexture(gl.TEXTURE2);
        gl.uniform1i(this.waterQuadShader.u_waterDUDVMapTextureSampler, 2);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_waterDUDVMap);

        // Bind Water NormalMap texture
        gl.activeTexture(gl.TEXTURE3);
        gl.uniform1i(this.waterQuadShader.u_waterNormalMapTextureSampler, 3);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_waterNormalMap);

        // DRAW
        gl.bindVertexArray(this.vao_waterQuad);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);

        // gl.bindVertexArray(this.planeVAO);
        // gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);
        // // gl.drawElements(gl.TRIANGLES, (this.res - 1) * (this.res - 1) * 2 * 3, gl.UNSIGNED_INT, 0);
        // gl.bindVertexArray(null);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
    }

    uninitialize() {

    }

};
