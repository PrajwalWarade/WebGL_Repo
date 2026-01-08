class RainbowShader {
    constructor() {
        this.shaderProgramObject = null;

        this.modelViewMatrixUniform;
        this.projectionMatrixUniform;
        this.timeUniform;
        this.resolutionUniform;
        this.textureSamplerUniform;

        this.numColorBands = 7;
        this.rainbowColorBands = [
            [0.6, 0.0, 0.8, 1.0], // Violet
            [0.3, 0.0, 0.5, 1.0], // Indigo
            [0.0, 0.0, 1.0, 1.0], // Blue
            [0.0, 1.0, 0.0, 1.0], // Green
            [1.0, 1.0, 0.0, 1.0], // Yellow
            [1.0, 0.5, 0.0, 1.0], // Orange
            [1.0, 0.0, 0.0, 1.0], // Red
        ];

        this.positions = [];
        this.colors = [];
        this.texCoords = [];

        this.currentSegment = 0;
        this.segments = 100;
        this.innerRadius = 0.6;
        this.bandwidth = 0.03;

        this.vao = null;
        this.vboPosition = null;
        this.vboColor = null;
        this.vboTexCoord = null;

        this.noiseTexture = null;
    }

    async init() {
        this.shaderProgramObject = ShaderManger.createProgram(gl);


        this.noiseTexture = TextureManger.LoadHighQualityTexture("./assets/textures/rainbow/noise.png");

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'rainbow/rainbow.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'rainbow/rainbow.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_POSITION, "aPosition");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_COLOR, "aColor");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, "aTexCoord");

        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.modelViewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uModelViewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uProjectionMatrix");
        this.resolutionUniform = gl.getUniformLocation(this.shaderProgramObject, "uResolution");
        this.timeUniform = gl.getUniformLocation(this.shaderProgramObject, "uTime");
        this.textureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "uTextureSampler");


        // for (let i = 0; i < this.numColorBands; i++) {
        //     // current band of color kadh
        //     const color1 = this.rainbowColorBands[i];

        //     // next band of color kadh for blending - pan check kar ki last color band tar nahiye na
        //     const color2 = i < this.numColorBands - 1 ? this.rainbowColorBands[i + 1] : this.rainbowColorBands[i];
        //     this.createCurvedQuad(this.innerRadius + i * this.bandwidth, this.bandwidth, this.segments, this.currentSegment, color1, color2);
        // }

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
            // gl.vertexAttrib4f(webGLMacros.PRJ_ATTRIBUTE_COLOR, 1.0, 1.0, 1.0, 1.0);
            // color
            this.vboColor = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_COLOR, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_COLOR);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        {
            this.vboTexCoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        gl.bindVertexArray(null);
    }

    render(camera, modelMatrix) {
        gl.useProgram(this.shaderProgramObject);


        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        // gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        var modelViewMatrix = mat4.create();
        var viewMatrix = camera.getViewMatrix();

        mat4.multiply(modelViewMatrix, modelViewMatrix, viewMatrix);
        mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);

        gl.uniformMatrix4fv(this.modelViewMatrixUniform, false, modelViewMatrix);
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, perspectiveProjectionMatrix);
        gl.uniform2f(this.resolutionUniform, canvas.width, canvas.height);
        gl.uniform1f(this.timeUniform, performance.now() / 1000.0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
        gl.uniform1i(this.textureSamplerUniform, 0);

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.drawArrays(gl.TRIANGLES, 0, this.positions.length / 3);

        gl.bindVertexArray(null);

        // gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        gl.useProgram(null);
    }

    update(deltaTime) {
        this.currentSegment = this.currentSegment + 0.1;
        if (this.currentSegment < this.segments) {
            for (let i = 0; i < this.numColorBands; i++) {
                // current band of color kadh
                const color1 = this.rainbowColorBands[i];

                // next band of color kadh for blending - pan check kar ki last color band tar nahiye na
                const color2 = i < this.numColorBands - 1 ? this.rainbowColorBands[i + 1] : this.rainbowColorBands[i];
                this.createCurvedQuad(this.innerRadius + i * this.bandwidth, this.bandwidth, this.segments, this.currentSegment, color1, color2);
            }
        }
    }

    // createCurvedQuad(radius, width, segments, color1, color2) {

    //     var t1 = [
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         0.0, 0.0,
    //     ];

    //     var t2 = [
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0
    //     ];


    //     const angleInc = Math.PI / segments;
    //     for (let i = 0; i < segments; i++) {
    //         const angle = i * angleInc;
    //         const nextAngle = (i + 1) * angleInc;

    //         // inner vertice calculation
    //         const ix = Math.cos(angle) * radius;
    //         const iy = Math.sin(angle) * radius;
    //         const ix1 = Math.cos(nextAngle) * radius;
    //         const iy1 = Math.sin(nextAngle) * radius;

    //         // outer vertice calculation
    //         const ox = Math.cos(angle) * (radius + width);
    //         const oy = Math.sin(angle) * (radius + width);
    //         const ox1 = Math.cos(nextAngle) * (radius + width);
    //         const oy1 = Math.sin(nextAngle) * (radius + width);

    //         // 2 triangle pasun quad banav
    //         this.positions.push(ix, iy, 0, ix1, iy1, 0, ox, oy, 0);
    //         this.positions.push(ix1, iy1, 0, ox1, oy1, 0, ox, oy, 0);

    //         this.texCoords.push(t1[0], t1[1]);
    //         this.texCoords.push(t1[2], t1[3]);
    //         this.texCoords.push(t1[4], t1[5]);


    //         this.texCoords.push(t2[0], t2[1]);
    //         this.texCoords.push(t2[2], t2[3]);
    //         this.texCoords.push(t2[4], t2[5]);

    //         // color assignment
    //         // last entry color 2 for blending of rainbow bands
    //         this.colors.push(...color1, ...color1, ...color2);
    //         this.colors.push(...color1, ...color2, ...color2);
    //     }
    // }

    createCurvedQuad(radius, width, segments, currentSegment, color1, color2) {

        var t1 = [
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
        ];

        var t2 = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0
        ];


        const angleInc = Math.PI / segments;
        const angle = currentSegment * angleInc;
        const nextAngle = (currentSegment + 1) * angleInc;

        // inner vertice calculation
        const ix = Math.cos(angle) * radius;
        const iy = Math.sin(angle) * radius;
        const ix1 = Math.cos(nextAngle) * radius;
        const iy1 = Math.sin(nextAngle) * radius;

        // outer vertice calculation
        const ox = Math.cos(angle) * (radius + width);
        const oy = Math.sin(angle) * (radius + width);
        const ox1 = Math.cos(nextAngle) * (radius + width);
        const oy1 = Math.sin(nextAngle) * (radius + width);

        // 2 triangle pasun quad banav
        this.positions.push(ix, iy, 0, ix1, iy1, 0, ox, oy, 0);
        this.positions.push(ix1, iy1, 0, ox1, oy1, 0, ox, oy, 0);

        this.texCoords.push(t1[0], t1[1]);
        this.texCoords.push(t1[2], t1[3]);
        this.texCoords.push(t1[4], t1[5]);


        this.texCoords.push(t2[0], t2[1]);
        this.texCoords.push(t2[2], t2[3]);
        this.texCoords.push(t2[4], t2[5]);

        // color assignment
        // last entry color 2 for blending of rainbow bands
        this.colors.push(...color1, ...color1, ...color2);
        this.colors.push(...color1, ...color2, ...color2);
    }

    uninitialize() {

    }

};
