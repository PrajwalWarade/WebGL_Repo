

var terrainMesh, waterMesh;

var width = 1024, height = 10244;
var waterHeight = 22.0;
// var startTime = new Date();

var lightAngle = Math.PI / 6.;
var lightDirection = [Math.sin(lightAngle), 0.0, Math.cos(lightAngle)];
var cloudTexture;
var positionBuffer;
var indexBuffer;


class WaterDisp {
    constructor() {
        this.waterDispShader = null;
        this.moveFactor;
        this.vao_waterQuad
        this.index;
    }

    async initialize() {

        // initWaterMesh();

        // SHADERS
        this.waterDispShader = new WaterShaderDisp();
        await this.waterDispShader.initialize();

        // TEXTURES
        cloudTexture = TextureManger.LoadHighQualityTexture("assets/textures/Water/clouds.png");

        var position = new Float32Array(width * height * 2);
        var i = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                position[i++] = x;
                position[i++] = y;
            }
        }

        this.index = new Uint32Array((width + 1) * (height - 1) * 2);
        i = 0;
        for (var y = 0; y < height - 1; y++) {
            this.index[i++] = y * width;
            for (var x = 0; x < width; x++) {
                this.index[i++] = y * width + x;
                this.index[i++] = (y + 1) * width + x;
            }
            this.index[i++] = (y + 1) * width + width - 1;
        }

        // VAO-VBO Related Code
        this.vao_waterQuad = gl.createVertexArray();
        gl.bindVertexArray(this.vao_waterQuad);

        // VBO For Position
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 2, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // VBO For Position
        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.index, gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindVertexArray(null);
    }

    Render(viewMatrix) {

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.BACK);
        // gl.frontFace(gl.CCW);

        gl.useProgram(this.waterDispShader.shaderProgramObject);

        gl.uniformMatrix4fv(this.waterDispShader.model, false, modelMatrix);
        gl.uniformMatrix4fv(this.waterDispShader.view, false, viewMatrix);
        gl.uniformMatrix4fv(this.waterDispShader.projection, false, perspectiveProjectionMatrix);

        gl.uniform3fv(this.waterDispShader.cameraPos, camera.getEye());

        gl.uniform1i(this.waterDispShader.enable[0], 1);
        gl.uniform1i(this.waterDispShader.enable[1], 1);
        gl.uniform1i(this.waterDispShader.enable[2], 1);
        gl.uniform1i(this.waterDispShader.enable[3], 1);
        gl.uniform1i(this.waterDispShader.enable[4], 1);
        gl.uniform1i(this.waterDispShader.enable[5], 1);
        gl.uniform1i(this.waterDispShader.enable[6], 1);
        gl.uniform1i(this.waterDispShader.enable[7], 1);

        gl.uniform1f(this.waterDispShader.amplitude[0], 0.5);
        gl.uniform1f(this.waterDispShader.amplitude[1], 0.4);
        gl.uniform1f(this.waterDispShader.amplitude[2], 0.2);
        gl.uniform1f(this.waterDispShader.amplitude[3], 0.1);
        gl.uniform1f(this.waterDispShader.amplitude[4], 0.5);
        gl.uniform1f(this.waterDispShader.amplitude[5], 0.4);
        gl.uniform1f(this.waterDispShader.amplitude[6], 0.2);
        gl.uniform1f(this.waterDispShader.amplitude[7], 0.1);

        gl.uniform1f(this.waterDispShader.wavelength[0], 20.0);
        gl.uniform1f(this.waterDispShader.wavelength[1], 15.0);
        gl.uniform1f(this.waterDispShader.wavelength[2], 12.0);
        gl.uniform1f(this.waterDispShader.wavelength[3], 10.0);
        gl.uniform1f(this.waterDispShader.wavelength[4], 1.0);
        gl.uniform1f(this.waterDispShader.wavelength[5], 1.5);
        gl.uniform1f(this.waterDispShader.wavelength[6], 1.2);
        gl.uniform1f(this.waterDispShader.wavelength[7], 0.8);

        gl.uniform1f(this.waterDispShader.direction[0], 45.0);
        gl.uniform1f(this.waterDispShader.direction[1], 120.0);
        gl.uniform1f(this.waterDispShader.direction[2], 170.0);
        gl.uniform1f(this.waterDispShader.direction[3], 65.0);
        gl.uniform1f(this.waterDispShader.direction[4], 45.0);
        gl.uniform1f(this.waterDispShader.direction[5], 120.0);
        gl.uniform1f(this.waterDispShader.direction[6], 170.0);
        gl.uniform1f(this.waterDispShader.direction[7], 65.0);

        gl.uniform1f(this.waterDispShader.speed[0], 0.4);
        gl.uniform1f(this.waterDispShader.speed[1], 0.8);
        gl.uniform1f(this.waterDispShader.speed[2], 0.8);
        gl.uniform1f(this.waterDispShader.speed[3], 1.0);
        gl.uniform1f(this.waterDispShader.speed[4], 0.4);
        gl.uniform1f(this.waterDispShader.speed[5], 0.8);
        gl.uniform1f(this.waterDispShader.speed[6], 0.8);
        gl.uniform1f(this.waterDispShader.speed[7], 1.0);

        var time = (new Date() - startTime) / 1000.0;
        this.moveFactor += 0.0001;
        gl.uniform1f(this.waterDispShader.time, time);
        gl.uniform1f(this.waterDispShader.waterHeight, 0.0);

        // Bind reflection texture
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.waterDispShader.clouds, 0);
        gl.bindTexture(gl.TEXTURE_2D, cloudTexture);


        // DRAW
        gl.bindVertexArray(this.vao_waterQuad);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // gl.drawElements(gl.LINE_STRIP, this.index.length, gl.UNSIGNED_INT, 0);
        gl.drawElements(gl.TRIANGLE_STRIP, this.index.length, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);


        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);

        // gl.disable(gl.BLEND);
        // let view = cameraNew.matrix();
        // var pos = cameraNew.position();

        // var time = (new Date() - startTime) / 1000.0;
        // if (waterVisible) {
        //     waterMesh.setUniform("view", view);
        //     waterMesh.setUniform("cameraPos", pos);
        //     waterMesh.setUniform("time", time);
        //     waterMesh.prepare();
        //     waterMesh.draw();
        // }
    }

    uninitialize() {

    }

};
