class RainbowExample {
    constructor() {
        this.rainbowShader = null;
    };

    async init() {
        this.rainbowShader = new RainbowShader();

        await this.rainbowShader.init();
    }

    render(camera, deltaTime) {
        this.rainbowShader.render();
    }

    update(deltaTime) {
        this.rainbowShader.update(deltaTime);
    }
};