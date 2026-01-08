
class FBM_Noise_ShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.vao;
        this.vbo_Position;
        this.vbo_Texcoord;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);

        await Promise.all([
            await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'FBM_Noise/FBM_Noise_Modified/FBMNoise_Modified.vs', gl.VERTEX_SHADER)),
            await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'FBM_Noise/FBM_Noise_Modified/FBMNoise_Modified.fs', gl.FRAGMENT_SHADER)),
        ]);

        // await Promise.all([
        //     await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'FBM_Noise/FBM_Noise_Original/FBMNoise.vs', gl.VERTEX_SHADER)),
        //     await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'FBM_Noise/FBM_Noise_Original/FBMNoise.fs', gl.FRAGMENT_SHADER)),
        // ]);

        gl.bindAttribLocation(this.program, 0, "aPosition");
        gl.bindAttribLocation(this.program, 1, "aTexCoord");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        //geometry position array declaration

        var rectanglePosition = new Float32Array
            ([
                3.0, 2.0, 0.0,
                -3.0, 2.0, 0.0,
                -3.0, -2.0, 0.0,
                -3.0, -2.0, 0.0,
                3.0, -2.0, 0.0,
                3.0, 2.0, 0.0
            ])

        var rectangleTexCoord = new Float32Array
            ([
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,

            ])

        //vao

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        //vbo
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, rectanglePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);  //unbind vbo



        //vbo for texture coordinates

        this.vbo_TexCoord = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_TexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, rectangleTexCoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);  //unbind vbo
        //unbind vao
        gl.bindVertexArray(null);
    }

    getUniformLocations = (gl, program) => {


        const resolution_Uniform = gl.getUniformLocation(program, "u_resolution");
        const uMVPMatrix = gl.getUniformLocation(program, "uMVPMatrix");

        const time_Uniform = gl.getUniformLocation(program, "u_time");
        const color1_Uniform = gl.getUniformLocation(program, "color1");  //low impact on output fog color
        const color2_Uniform = gl.getUniformLocation(program, "color2"); // high impact on output fog color

        const color3_Uniform = gl.getUniformLocation(program, "color3"); // high impact on output fog color

        const color4_Uniform = gl.getUniformLocation(program, "color4"); //high impact on output fog color

        return {
            resolution_Uniform,
            time_Uniform,
            color1_Uniform,
            color2_Uniform,
            color3_Uniform,
            color4_Uniform,
            uMVPMatrix
        };
    };

    render = () => {

        gl.useProgram(this.program);
        {


            var modelViewMatrix = mat4.create();
            var modelViewProjectionMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -3.0]);

            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);

            // Get the current time
            var currentTime = ELAPSED_TIME / 1000; // Time in seconds

            // Set the resolution uniform
            gl.uniform2f(this.uniforms.resolution_Uniform, 2560, 1440);

            // Set the time uniform
            gl.uniform1f(this.uniforms.time_Uniform, ELAPSED_TIME);

            gl.uniform3fv(this.uniforms.color1_Uniform, [1.0, 1.0, 1.0]);
            gl.uniform3fv(this.uniforms.color2_Uniform, [1.0, 1.0, 1.0]);
            gl.uniform3fv(this.uniforms.color3_Uniform, [1.0, 1.0, 1.0]);
            gl.uniform3fv(this.uniforms.color4_Uniform, [1.0, 1.0, 1.0]);

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindVertexArray(null);
        }
        gl.useProgram(null);


    };

};

function uninitialize() {

    if (this.program)  //this statement can be shaderProgramObject != null
    {
        gl.useProgram(this.program);

        var shaderObjects = gl.getAttachedShaders(this.program);

        if (shaderObjects && shaderObjects.length > 0) {
            for (let i = 0; i < shaderObjects.length; i++) {
                gl.detachShader(this.program, shaderObjects[i]);
                gl.deleteShader(shaderObjects[i]);
                shaderObjects[i] = null;

            }


        }

        gl.useProgram(null);
        gl.deleteProgram(this.program);
        this.program = null;


    }

    if (this.vbo_TexCoord) {
        gl.deleteBuffer(this.vbo_TexCoord);
        this.vbo_TexCoord = null;
    }

    if (this.vbo) {
        gl.deleteBuffer(this.vbo);
        this.vbo = null;
    }

    if (this.vao) {
        gl.deleteVertexArray(this.vao);
        this.vao = null;
    }






}



