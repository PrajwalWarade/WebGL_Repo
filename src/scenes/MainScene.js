
let selectedScene = sceneMacros.SCENE_MAIN_SCENE;
let START_E2E_DEMO = true;

class MainScene {
    constructor() {

        this.scene1 = null;
        this.sceneEndCredits = null;
    }

    async init() {

        //initScenesUiList();
        if (START_E2E_DEMO) {

            this.scene1 = new Scene1();
            this.sceneEndCredits = new EndCredits();

            await Promise.all([
                this.scene1.init(),
                this.sceneEndCredits.init(),

                initializeWorld(),
            ]);
            selectedScene = sceneMacros.SCENE_MAIN_SCENE;
        }
        else {
            switch (selectedScene) {

                case sceneMacros.SCENE_MAIN_SCENE:
                    this.scene1 = new Scene1();
                    await this.scene1.init();
                    await initializeWorld();

                    this.sceneEndCredits = new EndCredits();
                    await this.sceneEndCredits.init();

                    break;

                case sceneMacros.SCENE_ENDCREDITS:
                    this.sceneEndCredits = new EndCredits();
                    await this.sceneEndCredits.init();
                    break;
            }
        }

    }

    render(camera, deltaTime) {

        switch (selectedScene) {

            case sceneMacros.SCENE_MAIN_SCENE:
                if (bNightScene === true) {
                    configs.water_reflectivity = 0.95;
                    configs.water_shininess = 10.0;
                    configs.water_waveStrength = 0.001;

                    configs.EnablePostProcessing = false;
                }
                else {
                    // configs.water_reflectivity = 0.1;
                    // configs.water_shininess = 1.0;
                    // configs.water_waveStrength = 0.1;

                    configs.EnablePostProcessing = true;
                }

                this.scene1.render(camera, deltaTime);
                displayWorld(camera, deltaTime);
                break;

            case sceneMacros.SCENE_ENDCREDITS:
                configs.EnablePostProcessing = false;
                this.sceneEndCredits.render(camera, deltaTime);
                break;

            default:
                break;
        }

    }

    update(deltaTime) {
        switch (selectedScene) {

            case sceneMacros.SCENE_MAIN_SCENE:
                this.scene1.update(deltaTime);
                break;

            case sceneMacros.SCENE_ENDCREDITS:
                this.sceneEndCredits.update(deltaTime);
                break;

            default:
                break;
        }
    }

    uninitialize() {
        if (this.scene1)
            this.scene1.uninitialize();

        if (this.sceneEndCredits)
            this.sceneEndCredits.uninitialize();

        uninitializeWorld();
    }

};
