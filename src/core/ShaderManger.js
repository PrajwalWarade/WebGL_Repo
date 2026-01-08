let instance;

class ShaderManger {

    constructor() {
        if (instance) {
            throw new Error("You can only create one instance!");
        }
        this.counter = counter;
        instance = this;
    }

    static loadShader = async (gl, name, type) => {

        try {
            const response = await fetch(`/src/shaders/${name}`);

            const content = await response.text();

            const shader = gl.createShader(type);
            if (shader === null) {
                throw new Error('gl.createShader returned null!');
                return null;
            }

            gl.shaderSource(shader, content);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                throw new Error(`Failed to load shader ${name}`);
            }

            console.log(`/src/shaders/${name} Shader Compilation Successfull!`);
            return shader;

        } catch (e) {
            // Log the stack trace
            console.log(e.stack);
        }
    };


    /**
     * Creates and compiles a shaderProgram Object
     * @param {WebGLRenderingContext} gl 
     * @returns {WebGLProgram} 
     */
    static createProgram(gl) {
        try {
            let program = gl.createProgram();
            if (program === null) {
                throw new Error('gl.createProgram returned null!');
            }
            return program;
        } catch (e) {
            // Log the stack trace
            console.log(e.stack);
        }
    };

    /**
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} WebGLProgram
     */
    static linkProgram(gl, program) {
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
        }
        //gl.useProgram(program);
    };

    /**
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    static destroyProgram(gl, program) {
        try {
            if (program) {

                gl.useProgram(program);
                let shaderObjects = gl.getAttachedShaders(program);
                for (let i = 0; i < shaderObjects.length; i++) {
                    gl.detachShader(program, shaderObjects[i]);
                    gl.deleteShader(shaderObjects[i]);
                    shaderObjects[i] = 0;
                }
                shaderObjects = null;
                gl.useProgram(null);
                gl.deleteProgram(program);
                program = 0;
            }
        } catch (e) {
            // Log the stack trace
            console.log(e.stack);
        }
    }
};

// 2. Setting a variable equal to the the frozen newly instantiated object, by using the built-in `Object.freeze` method.
// This ensures that the newly created instance is not modifiable.
//const shaderManger = Object.freeze(new ShaderManger());

// 3. Exporting the variable as the `default` value within the file to make it globally accessible.
//export default shaderManger;

// Create a Map
const shaderProgramObjects = new Map();
