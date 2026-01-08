class EndCredits {
    constructor() {

        this.AMCModel;
        this.TextureGroupPresentsModel;
        this.ProjectNameModel;
      
        this.selectedCredit = 0;
        this.textureParameter;

        this.startTime = null;
    }

    async init() {

        this.background = TextureManger.LoadTexture("./assets/textures/EndCredits/back.jpg");       
        
        this.credit1_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit1-conceptAndDirection.png");
        this.credit2_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit2-screenPlayAtharv.png");
        this.credit3_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit3-ourValuedTeam.png");

        this.credit4_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit4-technology.png");

        this.credit5_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit5-References-1.png");
        this.credit6_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit6-References-2.png");
        this.credit7_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit7-ConceptsEffects.png");
    
        this.credit8_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit8-backgroundScore.png");
        this.credit9_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit9-specialThanks.png");
        this.credit10_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit10-ourInspiration.png");
        this.credit11_Texture = TextureManger.LoadTexture("./assets/textures/EndCredits/Credits/cradit11-theEnd.png");
    }

    render(camera, deltaTime/*use for animation*/) {
        modelShaderProgramObject.setViewIdentity = true;

        modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(2.8, 1.5, 0.0));
                this.loadCredits(this.background);

        switch(this.selectedCredit)
        {     
            // Concept And Direction
            case 0:                              
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.1, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.0, 0.4, 0.0));
                this.loadCredits(this.credit1_Texture);
                break;

            // Screen Play And Camera 
            case 1:                              
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.1, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.73, 0.6, 0.0));
                this.loadCredits(this.credit2_Texture);
                break;

            // Our ValuedTeam
            case 2:                              
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.1, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.68, 0.0));
                this.loadCredits(this.credit3_Texture);
                break;
            
            // Technology
            case 3:                              
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.1, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.8, 0.9, 0.0));
                this.loadCredits(this.credit4_Texture);
                break;            

            // reference-1
            case 4: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.7, 0.9, 0.0));
                this.loadCredits(this.credit5_Texture);
                break;

            // reference-2
            case 5: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.4, 1.0, 0.0));
                this.loadCredits(this.credit6_Texture);
                break;

             // Concepts and Effect
            case 6: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.4, 0.75, 0.0));
                this.loadCredits(this.credit7_Texture);
                break;

             // BackGround Score
            case 7: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.4, 0.9, 0.0));
                this.loadCredits(this.credit8_Texture);
                break;

            // Special Thanks
            case 8: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.4, 0.85, 0.0));
                this.loadCredits(this.credit9_Texture);
                break;

            // Our Inspiration    
            case 9: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.35, 0.0));
                this.loadCredits(this.credit10_Texture);
                break;

            // The End
            case 10: 
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
                mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.6, 0.22, 0.0));
                this.loadCredits(this.credit11_Texture);
                break;
        }

        modelShaderProgramObject.setViewIdentity = false;
    }

    update() {
        cameraChangePass = false;
        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }

        // get elapsed time in seconds
        let elapsed = (new Date().getTime() - this.startTime) / 1000;

       /// TEMPRORY FOR SYNCING
        if(elapsed >= 0.0 && elapsed <= 7.0)
            {
                this.selectedCredit = 0;
            }
        else if(elapsed >= 7.0 && elapsed <= 14.0)
            {
                this.selectedCredit = 1;

                if (this.credit1_Texture != null) 
                {
                    gl.deleteTexture(this.credit1_Texture);
                    this.credit1_Texture = null;               
                }
            }
        else if(elapsed >= 14.0 && elapsed <= 21)
            {
                this.selectedCredit = 2;
                if (this.credit2_Texture != null) 
                {
                    gl.deleteTexture(this.credit2_Texture);
                    this.credit2_Texture = null;               
                }
            }
        else if(elapsed >= 21.0 && elapsed <= 28)
            {
                this.selectedCredit = 3;
                if (this.credit3_Texture != null) 
                {
                    gl.deleteTexture(this.credit3_Texture);
                    this.credit3_Texture = null;               
                }
            }
        else if(elapsed >= 28.0 && elapsed <= 35)
            {
                this.selectedCredit = 4;
                if (this.credit4_Texture != null) 
                {
                    gl.deleteTexture(this.credit4_Texture);
                    this.credit4_Texture = null;               
                }
            }
        else if(elapsed >= 35.0 && elapsed <= 42)
            {
                this.selectedCredit = 5;
                if (this.credit5_Texture != null) 
                {
                    gl.deleteTexture(this.credit5_Texture);
                    this.credit5_Texture = null;               
                }
            }
        else if(elapsed >= 42.0 && elapsed <= 49)
            {
                this.selectedCredit = 6;
                if (this.credit6_Texture != null) 
                {
                    gl.deleteTexture(this.credit6_Texture);
                    this.credit6_Texture = null;               
                }
            }
        else if(elapsed >= 49.0 && elapsed <= 56)
            {
                this.selectedCredit = 7;
                if (this.credit7_Texture != null) 
                {
                    gl.deleteTexture(this.credit7_Texture);
                    this.credit7_Texture = null;               
                }
            }
        else if(elapsed >= 56.0 && elapsed <= 63)
            {
                this.selectedCredit = 8;
                if (this.credit8_Texture != null) 
                {
                    gl.deleteTexture(this.credit8_Texture);
                    this.credit8_Texture = null;               
                }
            }
         else if(elapsed >= 63.0 && elapsed <= 70)
            {
                this.selectedCredit = 9;
                if (this.credit9_Texture != null) 
                {
                    gl.deleteTexture(this.credit9_Texture);
                    this.credit9_Texture = null;               
                }
            }
        else if(elapsed >= 70.0 && elapsed <= 79)
            {
                this.selectedCredit = 10;
                if (this.credit10_Texture != null) 
                {
                    gl.deleteTexture(this.credit10_Texture);
                    this.credit10_Texture = null;               
                }
            }
        else if(elapsed >= 79.0 && elapsed <= 83)
            {
                this.selectedCredit = 11;
                if (this.credit11_Texture != null) 
                {
                    gl.deleteTexture(this.credit11_Texture);
                    this.credit11_Texture = null;               
                }
            }
    }

    uninitialize() {

    }


    loadCredits(textureParameter) {
        // console.log(textureParameter);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
            textureShaderProgramObject.render(camera, modelMatrix, textureParameter);
        gl.disable(gl.BLEND);
    }


};
