class OBJShaderProgram {
    constructor() {
        // Uniforms
        // Shaders
        this.shaderProgramObject = null;

        this.shaderProgramObjectNew = null;

        // Uniforms
        this.modelMatrixUniform;
        this.viewMatrixUniform;
        this.projectionMatrixUniform;

        this.setViewIdentity = false;
    }

    async initialize() {

        let response = await fetch(`/src/shaders/model/model_obj.vs`);
        let vertexShaderSourceCode = await response.text();

        response = await fetch(`/src/shaders/model/model_obj.fs`);
        let fragmentShaderSourceCode = await response.text();

        this.shaderProgramObject = webglUtils.createProgramInfo(gl, [vertexShaderSourceCode, fragmentShaderSourceCode]);
    }

    Render(model, camera, modelMatrix, showOnlyAbove) {

        let Part_Main = model.getPartMesh();

        gl.useProgram(this.shaderProgramObject.program);

        var modelViewMatrix = mat4.create();
        var u_world = modelMatrix;

        var viewMatrix = camera.getViewMatrix();

        var viewerPosition_ = camera.getCenter();

        if (this.setViewIdentity == true) {
            viewMatrix= mat4.create();;
            viewerPosition_ = vec3.fromValues(0.0, 0.0, -2.0);
        }
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

        //mat4.lookAt(viewMatrix, new Float32Array(eye), [0, 5, 0], [0, 1, 0]);
        //if (camera.getEye() == null)
        //    viewerPosition_ = [-1, 3, 5];

        viewerPosition_ = vec3.fromValues(viewerPosition_[0], viewerPosition_[1], viewerPosition_[2]);

        const sharedUniforms = {
            u_lightDirection: (viewerPosition_),
            u_view: viewMatrix,
            u_projection: perspectiveProjectionMatrix,
            u_viewWorldPosition: modelViewMatrix,
            u_alpha: 1.0
        };
        gl.uniform3fv(gl.getUniformLocation(this.shaderProgramObject.program, "lightPos"), camera.getEye());
        gl.uniform3fv(gl.getUniformLocation(this.shaderProgramObject.program, "viewPos"), camera.getEye());
        webglUtils.setUniforms(this.shaderProgramObject, sharedUniforms);

        if (showOnlyAbove != undefined) {
            gl.uniform1i(gl.getUniformLocation(this.shaderProgramObject.program, "enbaleClipping"), 1);
            if (showOnlyAbove == true) {
                gl.uniform1i(gl.getUniformLocation(this.shaderProgramObject.program, "upSide"), 1);
            }
            else {
                gl.uniform1i(gl.getUniformLocation(this.shaderProgramObject.program, "upSide"), 0);
            }

        }

        for (const { bufferInfo, material } of Part_Main) {
            // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
            webglUtils.setBuffersAndAttributes(gl, this.shaderProgramObject, bufferInfo);
            // calls gl.uniform
            webglUtils.setUniforms(this.shaderProgramObject, {
                u_world,
            }, material);
            // calls gl.drawArrays or gl.drawElements
            webglUtils.drawBufferInfo(gl, bufferInfo);
        }

    }

};
