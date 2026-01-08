class ErosionExample {
    constructor() {
        this.position = [
            1.0,  1.0,  1.0, // top-right of front
            -1.0,  1.0,  1.0, // top-left of front
            -1.0, -1.0,  1.0, // bottom-left of front
            1.0, -1.0,  1.0, // bottom-right of front
           
            // right face
            1.0,  1.0, -1.0, // top-right of right
            1.0,  1.0,  1.0, // top-left of right
            1.0, -1.0,  1.0, // bottom-left of right
            1.0, -1.0, -1.0, // bottom-right of right
           
            // back face
            1.0,  1.0, -1.0, // top-right of back
            -1.0,  1.0, -1.0, // top-left of back
            -1.0, -1.0, -1.0, // bottom-left of back
            1.0, -1.0, -1.0, // bottom-right of back
           
            // left face
            -1.0,  1.0,  1.0, // top-right of left
            -1.0,  1.0, -1.0, // top-left of left
            -1.0, -1.0, -1.0, // bottom-left of left
            -1.0, -1.0,  1.0, // bottom-right of left
           
            // top face
            1.0,  1.0, -1.0, // top-right of top
            -1.0,  1.0, -1.0, // top-left of top
            -1.0,  1.0,  1.0, // bottom-left of top
            1.0,  1.0,  1.0, // bottom-right of top
           
            // bottom face
            1.0, -1.0,  1.0, // top-right of bottom
            -1.0, -1.0,  1.0, // top-left of bottom
            -1.0, -1.0, -1.0, // bottom-left of bottom
            1.0, -1.0, -1.0, // bottom-right of bottom
        ];

        this.texcoord = [
            // ront
        1.0, 1.0, 1.0, // top-right o ront
        0.0, 1.0, 1.0, // top-let o ront
        0.0, 0.0, 1.0, // bottom-let o ront
        1.0, 0.0, 1.0, // bottom-right o ront
    
        // right
        1.0, 1.0, 0.0, // top-right o right
        0.0, 1.0, 1.0, // top-let o right
        0.0, 0.0, 1.0, // bottom-let o right
        1.0, 0.0, 0.0, // bottom-right o right
    
        // back
        1.0, 1.0, 0.0, // top-right o back
        0.0, 1.0, 0.0, // top-let o back
        0.0, 0.0, 0.0, // bottom-let o back
        1.0, 0.0, 0.0, // bottom-right o back
    
        // let
        1.0, 1.0, 1.0, // top-right o let
        0.0, 1.0, 0.0, // top-let o let
        0.0, 0.0, 0.0, // bottom-let o let
        1.0, 0.0, 1.0, // bottom-right o let
    
        // top
        1.0, 1.0, 0.0, // top-right o top
        0.0, 1.0, 0.0, // top-let o top
        0.0, 0.0, 1.0, // bottom-let o top
        1.0, 0.0, 1.0, // bottom-right o top
    
        // bottom
        1.0, 1.0, 1.0, // top-right o bottom
        0.0, 1.0, 1.0, // top-let o bottom
        0.0, 0.0, 0.0, // bottom-let o bottom
        1.0, 0.0, 0.0, // bottom-right o bottom
    ];
        
        this.erosionShader = null;
    }

    async init() {
        this.erosionShader = new ErosionShader();

        await this.erosionShader.init(this.position, this.texcoord, "assets/textures/Fire/fire.png");
    }

    render() {
        this.erosionShader.render();
    }

    update(deltaTime) {
        this.erosionShader.update(deltaTime);
    }
};