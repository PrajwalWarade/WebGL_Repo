class FireflyShader
{
    constructor()
    {
        this.shaderProgramObject = null;
        
        // Uniforms
        this.modelMatrixUniform = null;
        this.viewMatrixUniform = null;
        this.projectionMatrixUniform = null;
        this.colorUniform = null;
        this.lightPosUniform = null;
        this.viewPosUniform = null;
    }
    
    async initialize()
    {
        try
        {
            const vertexShaderObject = await ShaderManger.loadShader(gl, "firefly/firefly.vs", gl.VERTEX_SHADER);
            const fragmentShaderObject = await ShaderManger.loadShader(gl, "firefly/firefly.fs", gl.FRAGMENT_SHADER);
            
            if (!vertexShaderObject || !fragmentShaderObject)
            {
                console.error("Failed to load firefly shaders");
                return false;
            }
            
            this.shaderProgramObject = ShaderManger.createProgram(gl);
            
            gl.attachShader(this.shaderProgramObject, vertexShaderObject);
            gl.attachShader(this.shaderProgramObject, fragmentShaderObject);
            
            gl.bindAttribLocation(this.shaderProgramObject, 0, "aPosition");   // Location 0
            gl.bindAttribLocation(this.shaderProgramObject, 1, "aNormal");     // Location 1
            gl.bindAttribLocation(this.shaderProgramObject, 2, "aTexCoord");   // Location 2
            
            ShaderManger.linkProgram(gl, this.shaderProgramObject);
            
            if (!gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS))
            {
                console.error("Firefly shader linking failed:", gl.getProgramInfoLog(this.shaderProgramObject));
                return false;
            }
            
            // Get uniform locations
            this.modelMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uModelMatrix");
            this.viewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uViewMatrix");
            this.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uProjectionMatrix");
            this.colorUniform = gl.getUniformLocation(this.shaderProgramObject, "uColor");
            this.lightPosUniform = gl.getUniformLocation(this.shaderProgramObject, "uLightPos");
            this.viewPosUniform = gl.getUniformLocation(this.shaderProgramObject, "uViewPos");
            
            console.log("FireflyShader initialized successfully");
            return true;
            
        }
        catch (error)
        {
            console.error("FireflyShader initialization error:", error);
            return false;
        }
    }
    
    use()
    {
        gl.useProgram(this.shaderProgramObject);
    }
    
    unuse()
    {
        gl.useProgram(null);
    }
    
    uninitialize()
    {
        if (this.shaderProgramObject)
        {
            ShaderManger.destroyProgram(gl, this.shaderProgramObject);
            this.shaderProgramObject = null;
        }
    }
}
