
class GLTFShaderProgram {

    constructor() {
        this.program = null;
        this.uniforms = null;
        this.blendTime = 300;
    }

    async init() {

        this.program = ShaderManger.createProgram(gl);
        gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'model/model_gltf.vs', gl.VERTEX_SHADER));
        gl.attachShader(this.program, await ShaderManger.loadShader(gl, 'model/model_gltf.fs', gl.FRAGMENT_SHADER));

        ShaderManger.linkProgram(gl, this.program);

        this.uniforms = this.getUniformLocations(gl, this.program);
    }

    getUniformLocations = (gl, program) => {

        const pMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        const vMatrix = gl.getUniformLocation(program, 'uViewMatrix');
        const mMatrix = gl.getUniformLocation(program, 'uModelMatrix');
        const cameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
        const isAnimated = gl.getUniformLocation(program, 'uIsAnimated');
        const hasBaseColorTexture = gl.getUniformLocation(program, 'uHasBaseColorTexture');
        const baseColorTexture = gl.getUniformLocation(program, 'uBaseColorTexture');
        const hasMetallicRoughnessTexture = gl.getUniformLocation(program, 'uHasMetallicRoughnessTexture');
        const metallicRoughnessTexture = gl.getUniformLocation(program, 'uMetallicRoughnessTexture');
        const hasEmissiveTexture = gl.getUniformLocation(program, 'uHasEmissiveTexture');
        const emissiveTexture = gl.getUniformLocation(program, 'uEmissiveTexture');
        const baseColorFactor = gl.getUniformLocation(program, 'uBaseColorFactor');
        const metallicFactor = gl.getUniformLocation(program, 'uMetallicFactor');
        const roughnessFactor = gl.getUniformLocation(program, 'uRoughnessFactor');
        const emissiveFactor = gl.getUniformLocation(program, 'uEmissiveFactor');
        const normalTexture = gl.getUniformLocation(program, 'uNormalTexture');
        const hasNormalTexture = gl.getUniformLocation(program, 'uHasNormalTexture');
        const occlusionTexture = gl.getUniformLocation(program, 'uOcclusionTexture');
        const hasOcclusionTexture = gl.getUniformLocation(program, 'uHasOcclusionTexture');
        const brdfLut = gl.getUniformLocation(program, 'uBrdfLut');
        const environmentDiffuse = gl.getUniformLocation(program, 'uEnvironmentDiffuse');
        const environmentSpecular = gl.getUniformLocation(program, 'uEnvironmentSpecular');
        const jointTransform = [];
        for (let i = 0; i < 25; i++) {
            jointTransform[i] = gl.getUniformLocation(program, `uJointTransform[${i}]`);
        }
        const position = gl.getAttribLocation(program, 'vPosition');
        const normal = gl.getAttribLocation(program, 'vNormal');
        const tangent = gl.getAttribLocation(program, 'vTangent');
        const texCoord = gl.getAttribLocation(program, 'vTexCoord');
        const joints = gl.getAttribLocation(program, 'vJoints');
        const weights = gl.getAttribLocation(program, 'vWeights');

        return {
            pMatrix,
            vMatrix,
            mMatrix,
            cameraPosition,
            hasBaseColorTexture,
            baseColorTexture,
            hasMetallicRoughnessTexture,
            metallicRoughnessTexture,
            hasEmissiveTexture,
            normalTexture,
            hasNormalTexture,
            occlusionTexture,
            hasOcclusionTexture,
            emissiveTexture,
            baseColorFactor,
            metallicFactor,
            roughnessFactor,
            emissiveFactor,
            isAnimated,
            jointTransform,
            brdfLut,
            environmentDiffuse,
            environmentSpecular,
            position,
            normal,
            tangent,
            texCoord,
            joints,
            weights,
        };
    };

    render = (gltfModel, camera, modelMatrix) => {

        let models = gltfModel.models;

        const viewMatrix = camera.getViewMatrix();
        const cameraPosition = camera.getEye();

        gl.useProgram(this.program);

        gl.uniform3f(this.uniforms.cameraPosition, cameraPosition[0], cameraPosition[1], cameraPosition[2]);
        gl.uniformMatrix4fv(this.uniforms.pMatrix, false, perspectiveProjectionMatrix);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, false, viewMatrix);
        models.forEach(model => {

            const animation = gltfModel.gltfAnimation.getActiveAnimations('default', model.name);
            if (animation) {
                const animationTransforms = getAnimationTransforms(model, animation, this.blendTime);
                applyToSkin(model, animationTransforms).forEach((x, i) => {
                    gl.uniformMatrix4fv(this.uniforms.jointTransform[i], false, x);
                });
                gl.uniform1i(this.uniforms.isAnimated, 1);
            }
            else {
                gl.uniform1i(this.uniforms.isAnimated, 0);
            }

            // gl.uniform1i(this.uniforms.isAnimated, 0);
    
            // this.renderModel(gl, model, model.rootNode, modelMatrix, this.uniforms);
            this.renderModel(gl, model, model.rootNode, model.nodes[model.rootNode].localBindTransform, this.uniforms);
        });
        gltfModel.gltfAnimation.advanceAnimation(performance.now() - gltfModel.lastFrame);
        gltfModel.lastFrame = performance.now();

    };


    bindBuffer = (gl, position, buffer) => {
        if (buffer === null)
            return;
        gl.enableVertexAttribArray(position);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        gl.vertexAttribPointer(position, buffer.size, buffer.type, false, 0, 0);
        return buffer;
    };

    applyTexture = (gl, texture, textureTarget, textureUniform, enabledUniform) => {
        if (texture) {
            gl.activeTexture(gl.TEXTURE0 + textureTarget);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(textureUniform, textureTarget);
        }
        if (enabledUniform !== undefined)
            gl.uniform1i(enabledUniform, texture ? 1 : 0);
    };

    renderModel = (gl, model, node, transform, uniforms) => {
        if (model.nodes[node].mesh !== undefined) {
            const mesh = model.meshes[model.nodes[node].mesh];
            const material = model.materials[mesh.material];
            if (material) {
                this.applyTexture(gl, material.baseColorTexture, 0, uniforms.baseColorTexture, uniforms.hasBaseColorTexture);
                this.applyTexture(gl, material.metallicRoughnessTexture, 1, uniforms.metallicRoughnessTexture, uniforms.hasMetallicRoughnessTexture);
                this.applyTexture(gl, material.emissiveTexture, 2, uniforms.emissiveTexture, uniforms.hasEmissiveTexture);
                this.applyTexture(gl, material.normalTexture, 3, uniforms.normalTexture, uniforms.hasNormalTexture);
                this.applyTexture(gl, material.occlusionTexture, 4, uniforms.occlusionTexture, uniforms.hasOcclusionTexture);
                gl.uniform4f(uniforms.baseColorFactor, material.baseColorFactor[0], material.baseColorFactor[1], material.baseColorFactor[2], material.baseColorFactor[3]);
                gl.uniform1f(uniforms.metallicFactor, material.metallicFactor);
                gl.uniform1f(uniforms.roughnessFactor, material.roughnessFactor);
                gl.uniform3f(uniforms.emissiveFactor, material.emissiveFactor[0], material.emissiveFactor[1], material.emissiveFactor[2]);
            }
            this.bindBuffer(gl, uniforms.position, mesh.positions);
            this.bindBuffer(gl, uniforms.normal, mesh.normals);
            this.bindBuffer(gl, uniforms.tangent, mesh.tangents);
            this.bindBuffer(gl, uniforms.texCoord, mesh.texCoord);
            this.bindBuffer(gl, uniforms.joints, mesh.joints);
            this.bindBuffer(gl, uniforms.weights, mesh.weights);
            gl.uniformMatrix4fv(uniforms.mMatrix, false, transform);
            if (mesh.indices) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
                gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
            }
            else {
                gl.drawArrays(gl.TRIANGLES, 0, mesh.elementCount);
            }
        }
        model.nodes[node].children.forEach(c => {
            this.renderModel(gl, model, c, transform, uniforms);
        });
    };

};
