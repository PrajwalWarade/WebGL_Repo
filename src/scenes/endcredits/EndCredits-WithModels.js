class EndCredits {
    constructor() {

        this.selectedCredit = 0;
        this.startTime = null;
        this.animationFactor = 0.0;

        this.X = [];
        this.Y = [];

        this.pointLightPositions = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]

        ];

        this.pointLightColors = [
            [1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0]
        ];

    }


    async init() {

        this.background = TextureManger.LoadTexture("./assets/textures/EndCredits/back.jpg");
        this.spotlightTexture = TextureManger.LoadTexture("./assets/textures/EndCredits/spotlight.png");


        // piano
        this.pianoModel = new AssimpModelLoader();
        await this.pianoModel.loadModel("piano");

        // developed By
        this.allNameModel = new AssimpModelLoader();
        await this.allNameModel.loadModel("allModels");

    }

    render(camera, deltaTime/*use for animation*/) {

        commonShaderProgram.setViewIdentity = true;
        // //commonShaderProgram.enableOrthographic = false;

        commonShaderProgram.setPointLightData(this.pointLightPositions, this.pointLightColors);

        if (configs.enable_bloom == true) {
            // bloomShader.CompleteSceneBloom = true;

            // bloomShader.bindBloomScene();
            // {

            //     // TESTING BLOOM
            //     modelMatrix = mat4.create();
            //     mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 0.0, 0.0));
            //     modelShaderProgramObject.Render(objModel, camera, modelMatrix);


            // }
            // bloomShader.unbindBloomScene();

            // bloomShader.bindCompleteScene();
            // {
            //     switch (this.selectedCredit) {
            //         case 3:
            //             this.loadLogo(deltaTime);
            //             break;
            //     }
            // }
            // bloomShader.unbindBloomScene();

            // bloomShader.render();

            // bloomShader.renderFinalQuad();
        }
        else {

            bNightScene = true;
            // this.renderAllCredits(camera, deltaTime);// Robot and Piano
            this.loadallName(deltaTime);
            this.loadPiano(deltaTime);
            bNightScene = false;


            // Spotlight on Piano will be here
            modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-13.0, 3.0, -22.5));
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(20.0, 10.0, 0.0));
            this.loadBackgroundImage(this.spotlightTexture, 0.5);

        }

    }




    update() {
        cameraChangePass = false;

        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }

        // get elapsed time in seconds
        let elapsed = (new Date().getTime() - this.startTime) / 1000;

        // if (elapsed >= 0.0 && elapsed <= 5.0) {
        //     this.selectedCredit = 0;
        //     configs.enable_bloom = false;
        // }
        // else if (elapsed >= 5.0 && elapsed <= 50.0) {
        // this.selectedCredit = 1;
        this.animationFactor = this.animationFactor + 0.043;
        // if (this.allNameModel != null && this.allNameModel.Model != null) {
        //     this.allNameModel.destroy();
        //     this.allNameModel = null;
        //     //console.log("Model deleted successfully.");
        // }         
        // }
        // else if (elapsed >= 45.0 && elapsed <= 53.0) {
        //     this.selectedCredit = 9;
        //     postProc.alpha = 0.0;

        //     // SIR
        //     if (commonShaderProgram.alpha >= 0.0 && elapsed >= 51.0)
        //         commonShaderProgram.alpha = commonShaderProgram.alpha - 0.01;

        //     if (textureShaderProgramObject.alpha >= 0.0 && elapsed >= 51.0)
        //         textureShaderProgramObject.alpha = textureShaderProgramObject.alpha - 0.01;


        // } else if (elapsed >= 53.0 && elapsed <= 60.0) {

        //     // LOGO
        //     if (postProc.alpha <= 1.0) {
        //         postProc.alpha = postProc.alpha + 0.001;
        //         console.log("postProc.alpha : " + postProc.alpha);
        //     }

        //     if (commonShaderProgram.alpha <= 1.0) {
        //         commonShaderProgram.alpha = commonShaderProgram.alpha + 0.01;
        //         //console.log("commonShaderProgram.alpha : " + commonShaderProgram.alpha);
        //     }

        //     configs.enable_bloom = true;
        //     this.selectedCredit = 10;
        // }


        /////////////////////

        if (elapsed <= 50.0) {
            if (commonShaderProgram.alpha <= 1.0) {
                commonShaderProgram.alpha = commonShaderProgram.alpha + 0.01;
                //console.log("commonShaderProgram.alpha :" + commonShaderProgram.alpha);
            }

            if (textureShaderProgramObject.alpha <= 1.0) {
                textureShaderProgramObject.alpha = textureShaderProgramObject.alpha + 0.01;
                //console.log("textureShaderProgramObject.alpha :" + textureShaderProgramObject.alpha);
            }

            // if (postProc.alpha <= 1.0)
            //     postProc.alpha = postProc.alpha + 0.001;

        }
        else if (USE_FPV_CAM === false && ELAPSED_TIME >= START_TIME.SCENE_END - 7.0) {

            if (commonShaderProgram.alpha >= 0.0)
                commonShaderProgram.alpha = commonShaderProgram.alpha - 0.005;

            if (textureShaderProgramObject.alpha >= 0.0)
                textureShaderProgramObject.alpha = textureShaderProgramObject.alpha - 0.001;

            if (commonShaderProgram.alpha >= 0.0) {
                commonShaderProgram.alpha = commonShaderProgram.alpha - 0.001;

            } else {
                configs.enable_bloom = false;
            }

        }
    }

    loadBackgroundImage(textureParameter, alpha) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        textureShaderProgramObject.render(camera, modelMatrix, textureParameter, alpha);
        gl.disable(gl.BLEND);
    }

    loadPiano(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-7.5, -3, -12.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.45, 0.45, 0.45));
        mat4.rotate(modelMatrix, modelMatrix, -45.0, [0.0, 1.0, 0.0]);
        commonShaderProgram.render(this.pianoModel, camera, modelMatrix, deltaTime);
    }

    loadallName(deltaTime) {
        modelMatrix = mat4.create();
        //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1  + this.animationFactor, -10.0));
        // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(3.8 + objX, 0 + this.animationFactor + objY, -13.0 + objZ));
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(3.5, -4.0  + this.animationFactor, -14.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix, 90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.allNameModel, camera, modelMatrix, deltaTime);
    }

    uninitialize() {

    }

};