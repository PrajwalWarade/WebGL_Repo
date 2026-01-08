let instanceThreeLightsShader;

class ThreeLightsShader {
    constructor() {
        if (instanceThreeLightsShader) {
            return instanceThreeLightsShader;
        }
        instanceThreeLightsShader = this;

        this.program;

        this.modelMatrixUniform;
        this.viewMatrixUniform;
        this.projectionMatrixUniform;


        this.laUniform = [];			    // light Ambiant
        this.ldUniform = [];			    // light Diffuse
        this.lsUniform = [];			    // light Spec
        this.lighPositionUniform = [];    // light Position

        this.kaUniform; // material amb
        this.kdUniform; // mat diff
        this.ksUniform; // mat specular
        this.materialShininessUniform;

        this.lightingEnabledUniform;

        this.lightAmbiant_One = [0.0, 0.0, 0.0];
        this.lightDiffuse_One = [1.0, 0.0, 0.0];
        this.lightSpecular_One = [1.0, 0.0, 0.0];
        this.lightPosition_One = [-2.0, 0.0, 0.0, 1.0]

        this.lightAmbiant_Two = [0.0, 0.0, 0.0];
        this.lightDiffuse_Two = [0.0, 0.0, 1.0];
        this.lightSpecular_Two = [0.0, 0.0, 1.0];
        this.lightPosition_Two = [0.0, 0.0, 1.0, 1.0];

        this.lightAmbiant_Three = [0.0, 0.0, 0.0];
        this.lightDiffuse_Three = [0.0, 1.0, 0.0];
        this.lightSpecular_Three = [0.0, 1.0, 0.0];
        this.lightPosition_Three = [-2.0, 0.0, 0.0, 1.0]

        this.materialAmbiant = [0.0, 0.0, 0.0];
        this.meterialDeffuse = [1.0, 1.0, 1.0];
        this.materialSpecular = [1.0, 1.0, 1.0];
        this.materialShineeness = 120.0;

        this.bLight = true;
        this.sphere = null;
        this.lightAngle = 0.0;
    }

    async initialize() {
        // CREATE AND LINK SHADER
        this.program = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'ThreeRotatingLights/three_lights.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'ThreeRotatingLights/three_lights.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_POSITION, "a_position");
        gl.bindAttribLocation(this.program, webGLMacros.PRJ_ATTRIBUTE_NORMAL, "a_normal");

        ShaderManger.linkProgram(gl, this.program);

        // GET UNIFORM LOCATIONS
        // POST LINK - GET UNIFORM LOCATION
        this.modelMatrixUniform = gl.getUniformLocation(this.program, "u_modelMatrix");
        this.viewMatrixUniform = gl.getUniformLocation(this.program, "u_viewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.program, "u_projectionMatrix");

        this.laUniform[0] = gl.getUniformLocation(this.program, "u_la[0]");
        this.ldUniform[0] = gl.getUniformLocation(this.program, "u_ld[0]");
        this.lsUniform[0] = gl.getUniformLocation(this.program, "u_ls[0]");
        this.lighPositionUniform[0] = gl.getUniformLocation(this.program, "u_lightPosition[0]");

        this.laUniform[1] = gl.getUniformLocation(this.program, "u_la[1]");
        this.ldUniform[1] = gl.getUniformLocation(this.program, "u_ld[1]");
        this.lsUniform[1] = gl.getUniformLocation(this.program, "u_ls[1]");
        this.lighPositionUniform[1] = gl.getUniformLocation(this.program, "u_lightPosition[1]");

        this.laUniform[2] = gl.getUniformLocation(this.program, "u_la[2]");
        this.ldUniform[2] = gl.getUniformLocation(this.program, "u_ld[2]");
        this.lsUniform[2] = gl.getUniformLocation(this.program, "u_ls[2]");
        this.lighPositionUniform[2] = gl.getUniformLocation(this.program, "u_lightPosition[2]");

        this.kaUniform = gl.getUniformLocation(this.program, "u_ka");
        this.kdUniform = gl.getUniformLocation(this.program, "u_kd");
        this.ksUniform = gl.getUniformLocation(this.program, "u_ks");
        this.materialShininessUniform = gl.getUniformLocation(this.program, "u_materialShininnes");


        this.lightingEnabledUniform = gl.getUniformLocation(this.program, "u_lightingEnabled");
    }

    bind(camera, modelMatrix, delatTime) {

        this.update(delatTime);

        // USE SHADER PROGRAM OBJECT
        gl.useProgram(this.program);

        gl.uniformMatrix4fv(this.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(this.viewMatrixUniform, false, camera.getViewMatrix());
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, perspectiveProjectionMatrix);


        if (this.bLight == true) {

            var angle = degToRad(this.lightAngle);
            var x = 5.0 * Math.cos(angle);
            var y = 5.0 * Math.sin(angle);
            this.lightPosition_One[1] = x;
            this.lightPosition_One[2] = y - 6.0;

            // Set Light One Position  rotating One Light - Y Rotation
            angle = degToRad(this.lightAngle);
            x = 5.0 * Math.cos(angle);
            y = 5.0 * Math.sin(angle);
            this.lightPosition_Two[0] = x;
            this.lightPosition_Two[2] = y - 6.0;

            // Set Light Two Position rotating Two Light Z Rotation
            angle = degToRad(this.lightAngle);
            x = 5.0 * Math.cos(angle);
            y = 5.0 * Math.sin(angle);
            this.lightPosition_Three[0] = x;
            this.lightPosition_Three[1] = y;
            this.lightPosition_Three[2] = -6.0;

            gl.uniform1i(this.lightingEnabledUniform, 1);

            gl.uniform3fv(this.laUniform[0], this.lightAmbiant_One);
            gl.uniform3fv(this.ldUniform[0], this.lightDiffuse_One);
            gl.uniform3fv(this.lsUniform[0], this.lightSpecular_One);
            gl.uniform4fv(this.lighPositionUniform[0], this.lightPosition_One);

            gl.uniform3fv(this.laUniform[1], this.lightAmbiant_Two);
            gl.uniform3fv(this.ldUniform[1], this.lightDiffuse_Two);
            gl.uniform3fv(this.lsUniform[1], this.lightSpecular_Two);
            gl.uniform4fv(this.lighPositionUniform[1], this.lightPosition_Two);

            gl.uniform3fv(this.laUniform[2], this.lightAmbiant_Three);
            gl.uniform3fv(this.ldUniform[2], this.lightDiffuse_Three);
            gl.uniform3fv(this.lsUniform[2], this.lightSpecular_Three);
            gl.uniform4fv(this.lighPositionUniform[2], this.lightPosition_Three);

            gl.uniform3fv(this.kaUniform, this.materialAmbiant);
            gl.uniform3fv(this.kdUniform, this.meterialDeffuse);
            gl.uniform3fv(this.ksUniform, this.materialSpecular);
            gl.uniform1f(this.materialShininessUniform, this.materialShineeness);
        }
        else {
            gl.uniform1i(this.lightingEnabledUniform, 0);
        }
    }

    unbind() {
        gl.useProgram(null);
    }

    update(delatTime) {
        this.lightAngle = (this.lightAngle + 1.0) ;
        if (this.lightAngle > 360.0)
            this.lightAngle = 0.0;
    }

    async uninitialize() {
        ShaderManger.destroyProgram(gl, this.program);
    }

};

// let threeLightsShaderInstance = new ThreeLightsShader();
// threeLightsShaderInstance.initialize();
// let threeLightsShaderInstance = Object.freeze(new ThreeLightsShader());

// export default threeLightsShaderInstance;
