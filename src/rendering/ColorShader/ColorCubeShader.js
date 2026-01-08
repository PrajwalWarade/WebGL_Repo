
class ColorCubeShader {

    constructor() {
        this.program = null;
        this.uniforms = null;

        this.vao;
        this.vbo;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'color_shader/color_shader.vs', gl.VERTEX_SHADER));
        await gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'color_shader/color_shader.fs', gl.FRAGMENT_SHADER));

        gl.bindAttribLocation(this.program, 0, "aPosition");

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);

        var cubePosition = new Float32Array([
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, -1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ]);

        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // VBO
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, cubePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    }

    getUniformLocations = (gl, program) => {

        const uMVPMatrix = gl.getUniformLocation(program, 'uMVPMatrix');
        const u_color = gl.getUniformLocation(program, 'u_color');

        return {
            uMVPMatrix,
            u_color,
        };
    };

    bind(camera, modelMatrix, color) {
        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

        gl.useProgram(this.program);
        {
            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);
            gl.uniform3fv(this.uniforms.u_color, new Float32Array(color));
        }
    }


    unbind() {
        gl.useProgram(null);
    }

    render = (camera, modelMatrix, color) => {

        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

        gl.useProgram(this.program);
        {
            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);
            gl.uniform3fv(this.uniforms.u_color, new Float32Array(color));

            gl.bindVertexArray(this.vao);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            gl.bindVertexArray(null);

        }
        gl.useProgram(null);

    };

    uninitialize(){

    }
};



