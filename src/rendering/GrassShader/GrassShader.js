class GrassShader {

    constructor() {
        this.program = null;
        this.uniforms = null;

        this.grassGeom = null;
        this.CloudTexture = null;
        this.timer = 0.0;

        this.grassTexture = 0.0;
    }

    async init() {
        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'grass/grass.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'grass/grass.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "a_Position");
        gl.bindAttribLocation(this.program, 1, "a_Texcoord");
        gl.bindAttribLocation(this.program, 2, "a_Normal");
        gl.bindAttribLocation(this.program, 3, "a_BladeId");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        this.grassGeom = new GrassGeometry(30, 15000);
        
        console.log('Grass shader initialized successfully');
    }

    getUniformLocations(gl, program) {
        return {
            modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
            normalMatrix: gl.getUniformLocation(program, 'normalMatrix'),
            uTime: gl.getUniformLocation(program, 'uTime'),
            uLightDir: gl.getUniformLocation(program, 'uLightDir'),
            uGrassColorBase: gl.getUniformLocation(program, 'uGrassColorBase'),
            uGrassColorTip: gl.getUniformLocation(program, 'uGrassColorTip')
        };
    }

    render = (camera, modelMatrix) => {
        this.timer = this.timer + 0.25;
        const viewMatrix = camera.getViewMatrix();
        
        const modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);

        gl.useProgram(this.program);

        gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, perspectiveProjectionMatrix);
        gl.uniformMatrix4fv(this.uniforms.normalMatrix, false, normalMatrix);
        gl.uniform1f(this.uniforms.uTime, this.timer);
        gl.uniform3f(this.uniforms.uLightDir, 0.5, 1.0, 0.3);
        gl.uniform3f(this.uniforms.uGrassColorBase, 0.15, 0.4, 0.15);
        gl.uniform3f(this.uniforms.uGrassColorTip, 0.3, 0.7, 0.2);

        this.grassGeom.draw();

        // Cleanup
        gl.useProgram(null);
        gl.disable(gl.BLEND);
    }

    setGrassDensity(count) {
        if (this.grassGeom) {
            this.grassGeom.dispose();
        }
        this.grassGeom = new GrassGeometry(30, count);
    }

    setGrassArea(size) {
        if (this.grassGeom) {
            this.grassGeom.dispose();
        }
        this.grassGeom = new GrassGeometry(size, 8000);
    }

    setGrassColors(baseR, baseG, baseB, tipR, tipG, tipB) {
        this.customBaseColor = [baseR, baseG, baseB];
        this.customTipColor = [tipR, tipG, tipB];
    }

    uninitialize() {
        if (this.grassGeom) {
            this.grassGeom.dispose();
        }
        if (this.program) {
            gl.deleteProgram(this.program);
        }
    }
}