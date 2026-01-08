class CurtainShader
{
    constructor()
    {
        this.shaderProgramObject = null;

        this.aPosition = null;
        this.aTexCoord = null;

        // Uniform Locations
        this.uModelMatrix = null;
        this.uViewMatrix = null;
        this.uProjectionMatrix = null;
        this.uCurtainTexture = null;    // texture Sampler
        this.uTime = null;      // Animation Time
        this.uApplyWave = null;
        this.uAlpha = null;     // Transparency
        this.uNumFolds = null;

        this.uLightIntensity;
        this.uLightColor;
    }

    async initialize()
    {
        // Create shader Program
        this.shaderProgramObject = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, "curtain/curtain.vs", gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, "curtain/curtain.fs", gl.FRAGMENT_SHADER))
        ]);
        
        gl.bindAttribLocation(this.shaderProgramObject, 0, "aPosition");
        gl.bindAttribLocation(this.shaderProgramObject, 1, "aTexCoord");

        // Link the program (vertex + fragment)
        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        
        // get uniform locaitons from the linked program
        this.uModelMatrix = gl.getUniformLocation(this.shaderProgramObject, "uModelMatrix");
        this.uViewMatrix = gl.getUniformLocation(this.shaderProgramObject, "uViewMatrix");
        this.uProjectionMatrix = gl.getUniformLocation(this.shaderProgramObject, "uProjectionMatrix");
        this.uCurtainTexture = gl.getUniformLocation(this.shaderProgramObject, "uCurtainTexture");
        this.uTime  = gl.getUniformLocation(this.shaderProgramObject, "uTime");
        this.uApplyWave = gl.getUniformLocation(this.shaderProgramObject, "uApplyWave");
        this.uAlpha = gl.getUniformLocation(this.shaderProgramObject, "uAlpha");
        this.uNumFolds = gl.getUniformLocation(this.shaderProgramObject, "uNumFolds");
        this.uLightIntensity = gl.getUniformLocation(this.shaderProgramObject, "uLightIntensity");
        this.uLightColor = gl.getUniformLocation(this.shaderProgramObject, "uLightColor");
    }

    render(camera, modelMatrix, texture, time, applyWave = true, alpha = 0.7, numFolds, lightIntensity = 0.3, lightColor = [0.75, 0.75, 0.75])
    {
        gl.useProgram(this.shaderProgramObject);

        // set Matrices
        gl.uniformMatrix4fv(this.uModelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(this.uViewMatrix, false, camera.getViewMatrix());
        gl.uniformMatrix4fv(this.uProjectionMatrix, false, perspectiveProjectionMatrix);

        // Set uniforms
        gl.uniform1f(this.uTime, time);
        gl.uniform1i(this.uApplyWave, applyWave ? 1 : 0);
        gl.uniform1f(this.uAlpha, alpha);
        gl.uniform1i(this.uNumFolds, numFolds);
        gl.uniform1f(this.uLightIntensity, lightIntensity);
        gl.uniform3fv(this.uLightColor, lightColor);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.uCurtainTexture, 0);
    }

    unbind()
    {
        gl.useProgram(null);
    }
}
