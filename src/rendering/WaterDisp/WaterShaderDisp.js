class WaterShaderDisp {

    constructor() {
        this.shaderProgramObject = null;

        this.view;
        this.projection;
        this.model;

        this.waterHeight;

        this.time;

        this.clouds;
        this.cameraPos;

        this.enable = [];
        this.amplitude = [];
        this.wavelength = [];
        this.direction = [];
        this.speed = [];


    }

    async initialize() {
        this.shaderProgramObject = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'water_displacement/water.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'water_displacement/water.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.shaderProgramObject, 0, "position");

        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.view = gl.getUniformLocation(this.shaderProgramObject, "view");
        this.projection = gl.getUniformLocation(this.shaderProgramObject, "projection");
        this.model = gl.getUniformLocation(this.shaderProgramObject, "model");

        this.waterHeight = gl.getUniformLocation(this.shaderProgramObject, "waterHeight");
        this.time = gl.getUniformLocation(this.shaderProgramObject, "time");

        this.clouds = gl.getUniformLocation(this.shaderProgramObject, "clouds");
        this.cameraPos = gl.getUniformLocation(this.shaderProgramObject, "cameraPos");

        this.enable[0] = gl.getUniformLocation(this.shaderProgramObject, "enable[0]");
        this.enable[1] = gl.getUniformLocation(this.shaderProgramObject, "enable[1]");
        this.enable[2] = gl.getUniformLocation(this.shaderProgramObject, "enable[2]");
        this.enable[3] = gl.getUniformLocation(this.shaderProgramObject, "enable[3]");
        this.enable[4] = gl.getUniformLocation(this.shaderProgramObject, "enable[4]");
        this.enable[5] = gl.getUniformLocation(this.shaderProgramObject, "enable[5]");
        this.enable[6] = gl.getUniformLocation(this.shaderProgramObject, "enable[6]");
        this.enable[7] = gl.getUniformLocation(this.shaderProgramObject, "enable[7]");

        this.amplitude[0] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[0]");
        this.amplitude[1] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[1]");
        this.amplitude[2] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[2]");
        this.amplitude[3] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[3]");
        this.amplitude[4] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[4]");
        this.amplitude[5] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[5]");
        this.amplitude[6] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[6]");
        this.amplitude[7] = gl.getUniformLocation(this.shaderProgramObject, "amplitude[7]");

        this.wavelength[0] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[0]");
        this.wavelength[1] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[1]");
        this.wavelength[2] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[2]");
        this.wavelength[3] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[3]");
        this.wavelength[4] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[4]");
        this.wavelength[5] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[5]");
        this.wavelength[6] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[6]");
        this.wavelength[7] = gl.getUniformLocation(this.shaderProgramObject, "wavelength[7]");

        this.direction[0] = gl.getUniformLocation(this.shaderProgramObject, "direction[0]");
        this.direction[1] = gl.getUniformLocation(this.shaderProgramObject, "direction[1]");
        this.direction[2] = gl.getUniformLocation(this.shaderProgramObject, "direction[2]");
        this.direction[3] = gl.getUniformLocation(this.shaderProgramObject, "direction[3]");
        this.direction[4] = gl.getUniformLocation(this.shaderProgramObject, "direction[4]");
        this.direction[5] = gl.getUniformLocation(this.shaderProgramObject, "direction[5]");
        this.direction[6] = gl.getUniformLocation(this.shaderProgramObject, "direction[6]");
        this.direction[7] = gl.getUniformLocation(this.shaderProgramObject, "direction[7]");

        this.speed[0] = gl.getUniformLocation(this.shaderProgramObject, "speed[0]");
        this.speed[1] = gl.getUniformLocation(this.shaderProgramObject, "speed[1]");
        this.speed[2] = gl.getUniformLocation(this.shaderProgramObject, "speed[2]");
        this.speed[3] = gl.getUniformLocation(this.shaderProgramObject, "speed[3]");
        this.speed[4] = gl.getUniformLocation(this.shaderProgramObject, "speed[4]");
        this.speed[5] = gl.getUniformLocation(this.shaderProgramObject, "speed[5]");
        this.speed[6] = gl.getUniformLocation(this.shaderProgramObject, "speed[6]");
        this.speed[7] = gl.getUniformLocation(this.shaderProgramObject, "speed[7]");
        console.log("Water Disp Comnpleted");
    }

    getshaderProgramObject() {
        return this.shaderProgramObject;
    }

    uninitialize() {

    }

}