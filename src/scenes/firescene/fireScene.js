class FireScene {
    constructor() {
        this.fire = new Fire();
    }

    async init() {
        await this.fire.initialize();
    }

    render() {
        this.fire.render();
    }

    update(deltaTime) {

    }

    uninitialize() {

    }

};