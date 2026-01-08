class GLTFRenderer {
    constructor() {
        /** @type {GLTFMesh} */
        this.gltfModel = null;
        this.modelAvailble = false;
    }

    async LoadModel(path) {

        if (this.gltfModel == null) {
            this.gltfModel = new GLTFMesh();
            await Promise.all([
                this.gltfModel.init(path)
            ]);

            this.gltfModel.init(path)
        } else {
            this.gltfModel.destroy();
            this.gltfModel = null;
            this.gltfModel = new GLTFMesh();
            await Promise.all([
                this.gltfModel.init(path)
            ]);
        }
        this.modelAvailble = true;

    }

    async UnloadModel() {
        this.modelAvailble = false;
        await Promise.all([
            this.gltfModel.destroy()
        ]);
        this.gltfModel = null;
    }

    RenderModel(camera, modelMatrix) {
        if(this.modelAvailble == true)
            gltfShaderProgram.render(this.gltfModel, camera, modelMatrix); // GLTF
    }
};
