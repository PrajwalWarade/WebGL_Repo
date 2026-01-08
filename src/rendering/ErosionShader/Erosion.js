class ErosionShader {
    constructor() {
        this.shaderProgramObject = null;

        this.mvpMatrixUniform;
        this.textureSamplerUniform;
        this.noiseTextureSamplerUniform;
        this.highThresholdUniform;
        this.lowThresholdUniform;

        this.positions = [];
        this.texcoords = [];
        this.lowThreshold = 0.0;
        this.highThreshold = 0.0;
        this.maxNoiseValue = 0.0;
        this.minNoiseValue = 0.0;
        this.noiseImageSize = 64;
        this.noiseImage = null;
        this.permutation = [];

        this.noiseTexture;
        this.texture;

        this.vao = null;
        this.vboPosition = null;
        this.vboTexCoord = null;

        this.angle = 0.0;
    }

    async init(pos, texcord, textureName) {
        this.positions = pos;
        this.texcoords = texcord;
        this.texture = TextureManger.LoadHighQualityTexture(textureName);

        this.shaderProgramObject = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'erosion/erosion.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'erosion/erosion.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_POSITION, "aPosition");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, "aTexCoord");

        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.mvpMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uMVPMatrix");
        this.textureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "uTextureSampler");
        this.noiseTextureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "uNoiseTextureSampler");
        this.highThresholdUniform = gl.getUniformLocation(this.shaderProgramObject, "uHighThreshold");
        this.lowThresholdUniform = gl.getUniformLocation(this.shaderProgramObject, "uLowThreshold");

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        {
            // position
            this.vboPosition = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        {
            // texcoords
            this.vboTexCoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        gl.bindVertexArray(null);

        this.loadGLTexture();

        this.lowThreshold = this.minNoiseValue - 0.5;
        console.log("low threshold = " + this.lowThreshold);
        this.highThreshold = this.maxNoiseValue + 0.5;
        console.log("high threshold = " + this.highThreshold);
    }

    render() {
        gl.useProgram(this.shaderProgramObject);

        var modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -4.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.angle, [1, 1, 0]);

        var modelViewProjectionMatrix = mat4.create();
        mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

        gl.uniformMatrix4fv(this.mvpMatrixUniform, false, modelViewProjectionMatrix);
        gl.uniform1f(this.lowThresholdUniform, this.lowThreshold);
        gl.uniform1f(this.highThresholdUniform, this.highThreshold);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_3D, this.noiseTexture);
        gl.uniform1i(this.noiseTextureSamplerUniform, this.noiseTexture);

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // gl.uniform1i(this.textureSamplerUniform, this.texture);

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // TODO: draw the geometry passed to this class
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

        gl.bindVertexArray(null);

        gl.useProgram(null);
    }

    update(deltaTime) {
        this.angle = this.angle + 0.005;
        if (this.angle >= 360.0) {
            this.angle = this.angle - 360.0;
        }

        this.lowThreshold = this.lowThreshold + 0.002;
        this.highThreshold = this.highThreshold - 0.002;
        if (this.lowThreshold >= (this.highThreshold + 0.5)) {
            this.lowThreshold = this.minNoiseValue;
            this.highThreshold = this.maxNoiseValue;
            console.log("should reset erosion");
        }
    }

    generateRandomNumber() {
        const min = 0.0;
        const max = 1.0;

        var randomNumber = Math.random() * (max - min + 1.0) + min;
        return randomNumber;
    }

    loadGLTexture() {
        this.permutation = this.makePermutation();

        this.makeNoiseImage();

        this.noiseTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_3D, this.noiseTexture);

        gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
        gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, this.noiseImageSize, this.noiseImageSize, this.noiseImageSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.noiseImage);
        gl.bindTexture(gl.TEXTURE_3D, null);
    }

    makeNoiseImage() {
        var octaves = 4;
        var persistence = 0.5;
        var index = 0;
        var noiseValues = [];

        for (let z = 0; z < this.noiseImageSize; ++z) {
            for (let y = 0; y < this.noiseImageSize; ++y) {
                for (let x = 0; x < this.noiseImageSize; ++x) {
                    var nx = (x * 1.0) / this.noiseImageSize;
                    var ny = (y * 1.0) / this.noiseImageSize;
                    var nz = (z * 1.0) / this.noiseImageSize;

                    var val = this.turbulence(nx, ny, nz, octaves, persistence);

                    noiseValues.push(0);
                    noiseValues.push(0);
                    noiseValues.push(0);
                    var uintval = Math.round(val * 255);
                    uintval = Math.max(0, Math.min(255, uintval));
                    noiseValues.push(uintval);

                    if (this.minNoiseValue > val) {
                        this.minNoiseValue = val;
                    }

                    if (this.maxNoiseValue < val) {
                        this.maxNoiseValue = val;
                    }
                }
            }
        }

        this.noiseImage = new Uint8Array(noiseValues);

        console.log("min noise value = " + this.minNoiseValue);
        console.log("max noise value = " + this.maxNoiseValue);

        console.log("noise = ", this.noiseImage);
        console.log("expected size = ", this.noiseImageSize * this.noiseImageSize * this.noiseImageSize * 4);
    }

    makePermutation() {
        const permutation = [];
        for (let i = 0; i < 256; i++) {
            permutation.push(i);
        }

        shuffle(permutation);

        for (let i = 255; i >= 0; i--) {
            permutation.push(permutation[i]);
        }

        console.log("permutations = " + permutation);
        return permutation;
    }

    shuffle(array) {
        for (let e = array.length - 1; e > 0; e--) {
            const index = Math.round(Math.random() * (e - 1));
            const temp = array[e];

            array[e] = array[index];
            array[index] = temp;
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y, z) {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h == 12 || h == 14 ? x : z);
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }

    perlin(x, y, z) {
        const X = Math.trunc(x) & 255;
        const Y = Math.trunc(y) & 255;
        const Z = Math.trunc(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        var p = this.permutation;

        var A = [X] + Y;
        var AA = p[A] + Z;
        var AB = p[A + 1] + Z;
        var B = p[X + 1] + Y;
        var BA = p[B] + Z;
        var BB = p[B + 1] + Z;

        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    }

    turbulence(x, y, z, octaves, persistence) {
        var sum = 0.0;
        var frequency = 1.0;
        var amplitude = 1.0;
        var max = 0.0;

        for (let i = 0; i < octaves; ++i) {
            sum += Math.abs(this.perlin(x * frequency, y * frequency, z * frequency)) * amplitude;
            max += amplitude;
            amplitude *= persistence;
            frequency *= 2.0;
        }

        return sum / max;
    }

    uninitialize() {

    }
};
