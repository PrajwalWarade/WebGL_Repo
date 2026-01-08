class WaterQuadShader {

    constructor() {
        this.shaderProgramObject = null;

        this.modelMatrixUniform;
        this.viewMatrixUniform;
        this.projectionMatrixUniform;

        this.u_cameraPosition;
        this.u_lightPosition;

        this.u_reflectionTextureSampler;
        this.u_refractionTextureSampler;
        this.u_waterDUDVMapTextureSampler;
        this.u_waterNormalMapTextureSampler;
        this.u_moveFactorOffset;
        this.u_lightColor;
        this.u_lightColor;
        this.u_maxDistance;
        this.u_minDistance;
        this.u_alpha;
        this.u_minDistance;

        this.waveStrength;
        this.shininess;
        this.reflectivity;
        this.tiling;

        this.enable = [];
        this.amplitude = [];
        this.wavelength = [];
        this.direction = [];
        this.speed = [];

        this.bEnbaleFogUniform;
        this.fogFalloffUniform;
        this.fogColorUniform;
        this.gDispFactorUniform;

        this.initialize();
    }

    async initialize() {
        this.shaderProgramObject = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'water/water_quad.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'water/water_quad.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.shaderProgramObject, 0, "a_position");

        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.modelMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_modelMatrix");
        this.viewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_viewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "u_projectionMatrix");

        this.u_cameraPosition = gl.getUniformLocation(this.shaderProgramObject, "u_cameraPosition");
        this.u_lightPosition = gl.getUniformLocation(this.shaderProgramObject, "u_lightPosition");

        this.u_reflectionTextureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_reflectionTextureSampler");
        this.u_refractionTextureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_refractionTextureSampler");
        this.u_waterDUDVMapTextureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_waterDUDVMapTextureSampler");
        this.u_waterNormalMapTextureSampler = gl.getUniformLocation(this.shaderProgramObject, "u_waterNormalMapTextureSampler");
        this.u_moveFactorOffset = gl.getUniformLocation(this.shaderProgramObject, "u_moveFactorOffset");
        this.u_lightColor = gl.getUniformLocation(this.shaderProgramObject, "u_lightColor");
        this.u_maxDistance = gl.getUniformLocation(this.shaderProgramObject, "u_maxDistance");
        this.u_minDistance = gl.getUniformLocation(this.shaderProgramObject, "u_minDistance");
        this.u_alpha = gl.getUniformLocation(this.shaderProgramObject, "u_alpha");
        this.u_minDistance = gl.getUniformLocation(this.shaderProgramObject, "u_minDistance");

        this.waveStrength = gl.getUniformLocation(this.shaderProgramObject, "waveStrength");
        this.shininess = gl.getUniformLocation(this.shaderProgramObject, "shininess");
        this.reflectivity = gl.getUniformLocation(this.shaderProgramObject, "reflectivity");
        this.tiling = gl.getUniformLocation(this.shaderProgramObject, "tiling");
        
        this.u_sunDiskSize = gl.getUniformLocation(this.shaderProgramObject, "u_sunDiskSize");
        this.u_sunIntensity = gl.getUniformLocation(this.shaderProgramObject, "u_sunIntensity");
        this.u_sunColor = gl.getUniformLocation(this.shaderProgramObject, "u_sunColor");
        
        this.enable[0] = gl.getUniformLocation(this.shaderProgramObject, "enable[0]");
        this.enable[1] = gl.getUniformLocation(this.shaderProgramObject, "enable[1]");
        this.enable[2] = gl.getUniformLocation(this.shaderProgramObject, "enable[2]");
        this.enable[3] = gl.getUniformLocation(this.shaderProgramObject, "enable[3]");
        
        this.amplitude[0] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[0]");
        this.amplitude[1] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[1]");
        this.amplitude[2] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[2]");
        this.amplitude[3] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[3]");
        
        this.wavelength[0] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[0]");
        this.wavelength[1] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[1]");
        this.wavelength[2] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[2]");
        this.wavelength[3] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[3]");
        

        this.direction[0] = gl.getUniformLocation(this.shaderProgramObject, "direction[0]");
        this.direction[1] = gl.getUniformLocation(this.shaderProgramObject, "direction[1]");
        this.direction[2] = gl.getUniformLocation(this.shaderProgramObject, "direction[2]");
        this.direction[3] = gl.getUniformLocation(this.shaderProgramObject, "direction[3]");
        

        this.speed[0] = gl.getUniformLocation(this.shaderProgramObject, "speed[0]");
        this.speed[1] = gl.getUniformLocation(this.shaderProgramObject, "speed[1]");
        this.speed[2] = gl.getUniformLocation(this.shaderProgramObject, "speed[2]");
        this.speed[3] = gl.getUniformLocation(this.shaderProgramObject, "speed[3]");

        this.speed[3] = gl.getUniformLocation(this.shaderProgramObject, "speed[3]");

        
        this.bEnbaleFogUniform = gl.getUniformLocation(this.shaderProgramObject, "bEnbaleFog");
        this.fogFalloffUniform = gl.getUniformLocation(this.shaderProgramObject, "fogFalloff");
        this.fogColorUniform = gl.getUniformLocation(this.shaderProgramObject, "fogColor");
        this.gDispFactorUniform = gl.getUniformLocation(this.shaderProgramObject, "gDispFactor");
        this.bGodRaysPass = gl.getUniformLocation(this.shaderProgramObject, "bGodRaysPass");
        
    }

    getshaderProgramObject() {
        return this.shaderProgramObject;
    }

}