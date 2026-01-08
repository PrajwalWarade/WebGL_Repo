class EndCredits {
    constructor() {

        this.lantern;

        this.selectedCredit = 0;
        this.startTime = null;


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
        this.developedByModel = new AssimpModelLoader();
        await this.developedByModel.loadModel("developedBy");

        // background Score
        this.backgroundScoreModel = new AssimpModelLoader();
        await this.backgroundScoreModel.loadModel("backgroundScore");

        // technology
        this.technologyModel = new AssimpModelLoader();
        await this.technologyModel.loadModel("technology");

        // special Thanks
        this.specialThanksModel = new AssimpModelLoader();
        await this.specialThanksModel.loadModel("SpecialThanks");

        // Our Insperation
        this.OurInspirationModel = new AssimpModelLoader();
        await this.OurInspirationModel.loadModel("OurInspiration");

        // The End
        this.theEndModel = new AssimpModelLoader();
        await this.theEndModel.loadModel("theEnd");
    }

    render(camera, deltaTime/*use for animation*/) {

        commonShaderProgram.setViewIdentity = true;
        // //commonShaderProgram.enableOrthographic = false;

        commonShaderProgram.setPointLightData(this.pointLightPositions, this.pointLightColors);

        if (configs.enable_bloom == true) {
            bloomShader.CompleteSceneBloom = true;

            bloomShader.bindBloomScene();
            {

                // TESTING BLOOM
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 0.0, 0.0));
                modelShaderProgramObject.Render(objModel, camera, modelMatrix);


            }
            bloomShader.unbindBloomScene();

            bloomShader.bindCompleteScene();
            {
                switch (this.selectedCredit) {
                    case 3:
                        this.loadLogo(deltaTime);
                        break;
                }
            }
            bloomShader.unbindBloomScene();

            bloomShader.render();

            bloomShader.renderFinalQuad();
        }
        else {

            bNightScene = true;
                this.renderAllCredits(camera, deltaTime);
            bNightScene = false;

            // Robot and Piano
            this.loadPiano(deltaTime);
            modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-5.0, 0.0, -10.5));
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(10.5, 7.1, 0.0));

            // Spotlight on Piano will be here
            this.loadBackgroundImage(this.spotlightTexture, textureShaderProgramObject.alpha);

        }

    }


    renderAllCredits(camera, deltaTime) {
        switch (this.selectedCredit) {            
            
            case 0:
                // developed By
                this.loadDevelopedBy(deltaTime);
                break;

            case 1:
                // background Score
                this.loadBackgroundScore(deltaTime);
                break;

            case 2:
                // technology
                this.loadTechnology(deltaTime);
                break;

            case 3:
                // special Thanks
                this.loadSpecialThanks(deltaTime);
                break;
          
            case 4:
                // Our Insperation
                this.loadOurInsperation(deltaTime);
                break;

            case 5:
                // The End
                this.loadTheEnd(deltaTime);
                break;
        }
        
    }

    update() {
        cameraChangePass = false;

        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }

        // get elapsed time in seconds
        let elapsed = (new Date().getTime() - this.startTime) / 1000;

        if (elapsed >= 0.0 && elapsed <= 5.0) {
            this.selectedCredit = 0;
            configs.enable_bloom = false;
        }
        else if (elapsed >= 5.0 && elapsed <= 10.0) {
            this.selectedCredit = 1;
            if (this.developedByModel != null && this.developedByModel.Model != null) {
                this.developedByModel.destroy();
                this.developedByModel = null;
                //console.log("Model deleted successfully.");
            }         
        }
        else if (elapsed >= 10.0 && elapsed <= 15.0) {
            this.selectedCredit = 2;
        }
        else if (elapsed >= 15.0 && elapsed <= 20.0) {
            this.selectedCredit = 3;
        }
        else if (elapsed >= 20.0 && elapsed <= 25.0) {
            this.selectedCredit = 4;
        }
        else if (elapsed >= 25.0 && elapsed <= 30.0) {
            this.selectedCredit = 5;
        }
        else if (elapsed >= 30.0 && elapsed <= 35.0) {
            this.selectedCredit = 6;
        }
        else if (elapsed >= 35.0 && elapsed <= 40.0) {
            this.selectedCredit = 7;
        }
        else if (elapsed >= 40.0 && elapsed <= 45.0) {
            this.selectedCredit = 8;
        }
        else if (elapsed >= 45.0 && elapsed <= 53.0) {
            this.selectedCredit = 9;
            postProc.alpha = 0.0;

            // SIR
            if (commonShaderProgram.alpha >= 0.0 && elapsed >= 51.0)
                commonShaderProgram.alpha = commonShaderProgram.alpha - 0.01;

            if (textureShaderProgramObject.alpha >= 0.0 && elapsed >= 51.0)
                textureShaderProgramObject.alpha = textureShaderProgramObject.alpha - 0.01;


        } else if (elapsed >= 53.0 && elapsed <= 60.0) {

            // LOGO
            if (postProc.alpha <= 1.0) {
                postProc.alpha = postProc.alpha + 0.001;
                console.log("postProc.alpha : " + postProc.alpha);
            }

            if (commonShaderProgram.alpha <= 1.0) {
                commonShaderProgram.alpha = commonShaderProgram.alpha + 0.01;
                //console.log("commonShaderProgram.alpha : " + commonShaderProgram.alpha);
            }

            configs.enable_bloom = true;
            this.selectedCredit = 10;
        }


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
        //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(objX, objY, -10.0 + objZ));
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-50,-30,-130));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.15, 0.15, 0.15));
        commonShaderProgram.render(this.pianoModel, camera, modelMatrix, deltaTime);
    }

    loadDevelopedBy(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix,90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.developedByModel, camera, modelMatrix, deltaTime);
    }

    loadBackgroundScore(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix,90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.backgroundScoreModel, camera, modelMatrix, deltaTime);
    }

    loadTechnology(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix,90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.technologyModel, camera, modelMatrix, deltaTime);
    }

    loadSpecialThanks(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix,90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.specialThanksModel, camera, modelMatrix, deltaTime);
    }

    loadOurInsperation(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        commonShaderProgram.render(this.OurInspirationModel, camera, modelMatrix, deltaTime);
    }

    loadTheEnd(deltaTime) {
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(4.5, -1, -10.0));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.75, 0.75));
        mat4.rotate(modelMatrix, modelMatrix,90.0 * Math.PI / 180.0, [1.0, 0.0, 0.0]);
        commonShaderProgram.render(this.theEndModel, camera, modelMatrix, deltaTime);
    }


    uninitialize() {

    }

};