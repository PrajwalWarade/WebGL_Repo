class Jyot {
    constructor() {
        this.wobbalShaderProgram;
        this.JyotTexture;
    }
    async init() {
        this.wobbalShaderProgram = new WobbalShaderProgram();
        await this.wobbalShaderProgram.init();

        this.JyotTexture = TextureManger.LoadTexture("assets/textures/Intro/flame.png");
    }

    render(camera, modelMatrix, deltaTime) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        this.wobbalShaderProgram.render(camera, modelMatrix, deltaTime, this.JyotTexture);

        gl.disable(gl.BLEND);
    }

    uninitialize() {

    }

};