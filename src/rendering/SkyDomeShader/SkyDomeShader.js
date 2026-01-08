class colorPreset {
    constructor(cloudColorBottom, skyColorTop, skyColorBottom, lightColor, fogColor) {
        this.cloudColorBottom;
        this.skyColorTop;
        this.skyColorBottom;
        this.lightColor;
        this.fogColor;

    }
};

// let defaultColorPreset = new colorPreset(
//     vec3.fromValues(65., 70., 80.) * (1.5 / 255.),
//     vec3.fromValues(0.5, 0.7, 0.8) * 1.05,
//     vec3.fromValues(0.9, 0.9, 0.95),
//     vec3.fromValues(255, 255, 230) * 255.0,
//     vec3.fromValues(1.0, 1.0, 1.0)
// );

let sunsetColorPreset;
let sunsetColorPreset1;


class SkyDome {
    constructor() {
        this.shaderProgramObject;

        this.fbo;

        this.uniforms;

        this.vao_square;
        this.vbo_Square_Position;
        this.vbo_Square_Texcoord;

        this.highSunPreset = this.GalaxyPreset();
        console.log(this.highSunPreset)
        this.presetSunset = this.SunsetPreset();
        this.lightDir = new Float32Array([0.0, 0.0, 0.0]);
        this.eveningSunset = this.eveningSunset();


        this.skyColorTop;
        this.skyColorBottom;
        this.lightColor;
        this.fogColor;


    }

    async initialize() {
        this.shaderProgramObject = ShaderManger.createProgram(gl);
        await Promise.all([
            await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'sky_dome/sky_dome.vs', gl.VERTEX_SHADER)),
            await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'sky_dome/sky_dome.fs', gl.FRAGMENT_SHADER)),
        ]);
        gl.bindAttribLocation(this.shaderProgramObject, 0, "aPosition");
        // gl.bindAttribLocation(this.shaderProgramObject, 1, "aTexcoord");
        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.uniforms = this.getUniforms();

        var squareVertices = new Float32Array([
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ]);

        var squareTexcoord = new Float32Array([
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ]);


        // VERTEX ARRAY OBJECT
        this.vao_square = gl.createVertexArray();
        gl.bindVertexArray(this.vao_square);

        this.vbo_Square_Position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Square_Position);
        gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // this.vbo_Square_Texcoord = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_Square_Texcoord);
        // gl.bufferData(gl.ARRAY_BUFFER, squareTexcoord, gl.STATIC_DRAW);
        // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(1);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

        this.fbo = new Framebuffer();
        this.fbo.create(2560, 1440);

        this.update()

        // console.log(this.skyColorTop)
        // console.log(this.skyColorBottom)
    }

    getUniforms() {

        const resolution = gl.getUniformLocation(this.shaderProgramObject, "resolution");
        const inv_proj = gl.getUniformLocation(this.shaderProgramObject, "inv_proj");
        const inv_view = gl.getUniformLocation(this.shaderProgramObject, "inv_view");
        const lightDirection = gl.getUniformLocation(this.shaderProgramObject, "lightDirection");
        const skyColorTop = gl.getUniformLocation(this.shaderProgramObject, "skyColorTop");
        const skyColorBottom = gl.getUniformLocation(this.shaderProgramObject, "skyColorBottom");

        return {
            resolution,
            inv_proj,
            inv_view,
            lightDirection,
            skyColorTop,
            skyColorBottom
        };
    };

    getTexture() {
        return this.fbo.getTexture();
    }

    draw(camera) {

        this.fbo.bind();
        {
            gl.useProgram(this.shaderProgramObject);

            gl.uniformMatrix4fv(this.uniforms.inv_proj, false, perspectiveProjectionMatrix);
            gl.uniformMatrix4fv(this.uniforms.inv_view, false, camera.getViewMatrix());

            gl.uniform2fv(this.uniforms.resolution, [2560, 1440]);
            // console.log(this.defaultColorPreset.skyColorTop);

            if (bNightScene) {
                gl.uniform3fv(this.uniforms.skyColorBottom, new Float32Array(this.highSunPreset.skyColorTop));
                gl.uniform3fv(this.uniforms.skyColorTop, new Float32Array(this.highSunPreset.skyColorBottom));
                gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, -1.0, 0.0]));

            }
            else if(bEveningScene)
            {
                // Read colors DIRECTLY from configs at runtime
                const topColor = vec3.fromValues(
                    configs.skydomeColorTop[0] / 255.0, 
                    configs.skydomeColorTop[1] / 255.0, 
                    configs.skydomeColorTop[2] / 255.0
                );
                const bottomColor = vec3.fromValues(
                    configs.skydomeColorBottom[0] / 255.0, 
                    configs.skydomeColorBottom[1] / 255.0, 
                    configs.skydomeColorBottom[2] / 255.0
                );
                
                gl.uniform3fv(this.uniforms.skyColorBottom, topColor);
                gl.uniform3fv(this.uniforms.skyColorTop, bottomColor);


                if(configs.enable_GodRays === true)
                {
                    gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, -1.0, 1.0]));
                }
                else
                {
                    gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, 0.0, 1.0]));
                }
            }
            else {

                // if (configs.enable_GodRays === true) {

                //     gl.uniform3fv(this.uniforms.skyColorBottom, new Float32Array(this.presetSunset.skyColorTop));
                //     gl.uniform3fv(this.uniforms.skyColorTop, new Float32Array(this.presetSunset.skyColorBottom));
                //     gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, -1.0, 1.0]));
                // } else {

                //     gl.uniform3fv(this.uniforms.skyColorBottom, new Float32Array(this.presetSunset.skyColorTop));
                //     gl.uniform3fv(this.uniforms.skyColorTop, new Float32Array(this.presetSunset.skyColorBottom));
                //     gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, 0.0, 1.0]));
                // }

                gl.uniform3fv(this.uniforms.skyColorBottom, new Float32Array(this.presetSunset.skyColorTop));
                gl.uniform3fv(this.uniforms.skyColorTop, new Float32Array(this.presetSunset.skyColorBottom));
                gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, 0.0, 1.0]));

            }
            // gl.uniform3fv(this.uniforms.lightDirection, lightPosition - camera.getCenter());

            gl.bindVertexArray(this.vao_square);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindVertexArray(null);

            gl.useProgram(null);
        }
        this.fbo.unbind();
    }

    drawScene(camera) {
        // this.update()

        gl.useProgram(this.shaderProgramObject);

        gl.uniformMatrix4fv(this.uniforms.inv_proj, false, perspectiveProjectionMatrix);
        gl.uniformMatrix4fv(this.uniforms.inv_view, false, camera.getViewMatrix());

        gl.uniform2fv(this.uniforms.resolution, [canvas.width, canvas.height]);
        // console.log(this.defaultColorPreset.skyColorTop);
        gl.uniform3fv(this.uniforms.skyColorBottom, new Float32Array(this.highSunPreset.skyColorTop));
        gl.uniform3fv(this.uniforms.skyColorTop, new Float32Array(this.highSunPreset.skyColorBottom));

        // gl.uniform3fv(this.uniforms.lightDirection, lightPosition - camera.getCenter());
        gl.uniform3fv(this.uniforms.lightDirection, new Float32Array([0.0, 0.1, 1.0]));

        gl.bindVertexArray(this.vao_square);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bindVertexArray(null);

        gl.useProgram(null);

    }

    update() {
        // console.log(this.skyColorTop)
        // console.log(this.skyColorBottom)
        this.mixSkyColorPreset(this.sigmoid(this.lightDir[1]), this.highSunPreset, this.presetSunset);
    }

    sigmoid(v) {
        return 1 / (1.0 + Math.exp(8.0 - v * 40.0));
    }

    // Assuming gl-matrix-min.js is already imported
    mixSkyColorPreset(v, p1, p2) {
        var a = Math.min(Math.max(v, 0.0), 1.0);
        var b = 1.0 - a;

        var temp1 = vec3.create();
        var temp2 = vec3.create();

        // Interpolate skyColorTop
        vec3.scale(temp1, p1.skyColorTop, a);
        vec3.scale(temp2, p2.skyColorTop, b);
        this.skyColorTop = vec3.add(vec3.create(), temp1, temp2);

        // Interpolate skyColorBottom
        vec3.scale(temp1, p1.skyColorBottom, a);
        vec3.scale(temp2, p2.skyColorBottom, b);
        this.skyColorBottom = vec3.add(vec3.create(), temp1, temp2);

        // Interpolate lightColor
        vec3.scale(temp1, p1.lightColor, a);
        vec3.scale(temp2, p2.lightColor, b);
        this.lightColor = vec3.add(vec3.create(), temp1, temp2);

        // Interpolate fogColor
        vec3.scale(temp1, p1.fogColor, a);
        vec3.scale(temp2, p2.fogColor, b);
        this.fogColor = vec3.add(vec3.create(), temp1, temp2);
    }



    GalaxyPreset() {
        var preset = new colorPreset();

        preset.cloudColorBottom = vec3.fromValues(0.0 / 255.0, 0.0 / 255.0, 109.0 / 255.0);
        preset.skyColorTop = vec3.fromValues(100.8 / 255.0, 100.0 / 255.0, 100.0 / 255.0);
        // preset.skyColorTop = vec3.fromValues(0 / 255.0, 20, 63 / 255.0, 255 / 255.0);
        preset.skyColorBottom = vec3.fromValues(0.0 / 255.0, 0.0 / 255.0, 109.0 / 255.0);

        preset.lightColor = vec3.fromValues(255.0 / 255.0, 171.0 / 255.0, 125.0 / 255.0);
        preset.fogColor = vec3.fromValues(85.0 / 255.0, 97.0 / 255.0, 120.0 / 255.0);

        return preset;
    }

    SunsetPreset() {
        var preset = new colorPreset();

        preset.cloudColorBottom = vec3.fromValues(89.0 / 255.0, 96.0 / 255.0, 109.0 / 255.0);
        preset.skyColorTop = vec3.fromValues(177.0 / 255.0, 174.0 / 255.0, 119.0 / 255.0);
        preset.skyColorBottom = vec3.fromValues(0.5, 0.5, 0.5);
        // preset.skyColorBottom = vec3.fromValues(234.0 / 255.0, 125.0 / 255.0, 125.0 / 255.0);

        // preset.skyColorTop = vec3.fromValues(0.26, 0.47, 0.83);
        // preset.skyColorBottom = vec3.fromValues(0.76, 0.76, 0.87);

        preset.skyColorTop = vec3.fromValues(0.76, 0.76, 0.87); //  TERRAIn ONE : DAYS SCENE
        preset.skyColorBottom = vec3.fromValues(0.26, 0.47, 0.83); //  TERRAIn ONE : DAYS SCENE

        preset.lightColor = vec3.fromValues(255.0 / 255.0, 171.0 / 255.0, 125.0 / 255.0);
        preset.fogColor = vec3.fromValues(85.0 / 255.0, 97.0 / 255.0, 120.0 / 255.0);


        return preset;
    }
    
    eveningSunset()
    {
        var preset = new colorPreset();

        preset.cloudColorBottom = vec3.fromValues(89.0 / 255.0, 96.0 / 255.0, 109.0 / 255.0);

        // SUNSET/DUSK COLORS (SWAPPED - if gradient is inverted)
        preset.skyColorTop = vec3.fromValues(255.0 / 255.0, 160.0 / 255.0, 100.0 / 255.0);     // Warm orange (will show at horizon)
        preset.skyColorBottom = vec3.fromValues(135.0 / 255.0, 155.0 / 255.0, 180.0 / 255.0);  // Blue-gray (will show at top)

        preset.lightColor = vec3.fromValues(255.0 / 255.0, 171.0 / 255.0, 125.0 / 255.0);
        preset.fogColor = vec3.fromValues(85.0 / 255.0, 97.0 / 255.0, 120.0 / 255.0);

        return preset;
    }

    uninitialize() {

    }


}