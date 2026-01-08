var FlowFiled_Width = 300;
var FlowFiled_Height = 100;

var pns = new perlinNoise();
var particles = [];
var flowFields = [];

var gridSize = 100;
var cols = 0;
var rows = 0;
var depth = 0;

var zoff = 0;

var zstep = 0.0513;
var xstep = 0.0221;
var ystep = 0.0327;

var psNums = 100;
var maxSpeed = 0.01;
var vecMagSize = 0.3;

var r = 0;
var b = 0;
var g = 0;

var particlePos = [];
var cnt = 0;

function setupFlowFiled() {
    // createCanvas(1350, 600);
    pns.init();

    r = Math.random(0, 1.0);
    g = Math.random(0, 1.0);
    b = Math.random(0, 1.0);

    for (var k = 0; k < psNums; k++) {
        particles.push(new particle(maxSpeed, r, g, b));
    }

    // for (var k = 0; k < psNums; k++) {
    //     particlePos.push(particles[k].pos.x);
    //     particlePos.push(particles[k].pos.y);
    // }
    //console.log("particles :" + particles);
    //console.log("particles.pos :" + particles.pos);
    // console.log(particlePos);

    cols = Math.floor(FlowFiled_Width / gridSize);
    rows = Math.floor(FlowFiled_Height / gridSize);
    depth = Math.floor(FlowFiled_Height / gridSize);

    flowFields = new Array(cols * rows * depth).fill(0);
    // console.log(gridSize);
    // console.log(width);
    // console.log(FlowFiled_Height);
    // console.log(cols);
    // console.log(rows);
    // console.log(flowFields);

    // background(255);
}

function draw() {

}

class FlowField {
    constructor() {

        this.vao;
        this.vbo;

        this.texture_pink;
        this.texture_green;
        this.texture_blue;
        this.texture_red;
        this.texture_juganu;
    }

    async init() {
        setupFlowFiled();

        this.texture_pink = TextureManger.LoadTexture("./assets/textures/FlowField/pink.png");
        console.log(this.texture_pink);
        this.texture_green = TextureManger.LoadTexture("./assets/textures/FlowField/green.png");
        this.texture_blue = TextureManger.LoadTexture("./assets/textures/FlowField/blue.png");
        this.texture_red = TextureManger.LoadTexture("./assets/textures/FlowField/red.png");
        this.texture_juganu = TextureManger.LoadTexture("./assets/textures/FlowField/juganu.png");
    }

    render(camera, position) {
        this.update();

        if (flowFields === undefined)
            console.log("flowFields is undefimned");
        for (var k = 0; k < psNums; k++) {
            particles[k].follow(flowFields);
            particles[k].update();
            particles[k].show();
        }

        // particlePos = [];
        // for (var k = 0; k < psNums; k++) {
        //     particlePos.push(particles[k].pos.x);
        //     particlePos.push(particles[k].pos.y);
        // }
        cnt = cnt + 1;

        for (var k = 0; k < psNums; k++) {

            // particlePos.push(particles[k].pos.x);
            // particlePos.push(particles[k].pos.y);

            const viewMatrix = camera.getViewMatrix();
            var modelViewProjectionMatrix = mat4.create();

            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(particles[k].pos.x + position[0], particles[k].pos.y + position[1], particles[k].pos.z + position[2]));
            // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.25, 0.25, 0.25));
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.25, 0.25, 0.25));

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            if (k < psNums / 2) {

                if (k % 2 == 0)
                    textureShaderProgramObject.renderNew(camera, modelMatrix, this.texture_green);
                else
                    textureShaderProgramObject.renderNew(camera, modelMatrix, this.texture_pink);

            }
            else {
                if (k % 2 == 0)
                    textureShaderProgramObject.renderNew(camera, modelMatrix, this.texture_blue);
                else
                    textureShaderProgramObject.renderNew(camera, modelMatrix, this.texture_red);
            }
            gl.disable(gl.BLEND);

        }
    }

    renderJuganu(camera, position) {
        this.update();

        if (flowFields === undefined)
            console.log("flowFields is undefimned");
        for (var k = 0; k < psNums; k++) {
            particles[k].follow(flowFields);
            particles[k].update();
            particles[k].show();
        }

        // particlePos = [];
        // for (var k = 0; k < psNums; k++) {
        //     particlePos.push(particles[k].pos.x);
        //     particlePos.push(particles[k].pos.y);
        // }
        cnt = cnt + 1;

        for (var k = 0; k < psNums; k++) { // TO DO : DONE USING INSTANCING , AVOIDE LOOP

            // particlePos.push(particles[k].pos.x);
            // particlePos.push(particles[k].pos.y);

            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(particles[k].pos.x + position[0], particles[k].pos.y + + position[1], particles[k].pos.z + + position[2]));
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.0, 1.0, 1.0));
            // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.6, 0.6, 0.6));

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);

            textureShaderProgramObject.renderNew(camera, modelMatrix, this.texture_juganu);

            gl.disable(gl.BLEND);

        }
    }

    update() {
        //console.log(flowFields);
        var yoff = 0;
        for (var j = 0; j < rows; j++) {
            var xoff = 0;
            for (var i = 0; i < cols; i++) {
                var index = i + j * cols;
                //var angleNoise = pns.genNoise(xoff, yoff, zoff, 4, 0.5);             
                var angleNoise = noise(xoff, yoff, zoff);
                //angleNoise = (angleNoise - 0.5) * 3 + 0.5                            
                var v = p5.Vector.fromAngle(angleNoise * TWO_PI);
                v.setMag(vecMagSize);
                flowFields[index] = v;

                xoff += xstep;
                if (xoff >= 10000.0) {
                    xoff = 0.0;
                }
            }
            yoff += ystep;
            if (yoff >= 10000.0) {
                yoff = 0.0;
            }
        }
        zoff += zstep;
        if (zoff >= 10000.0) {
            zoff = 0.0;
        }

        // var yoff = 0;
        // for (var j = 0; j < rows; j++) {
        //     var xoff = 0;
        //     for (var i = 0; i < cols; i++) {
        //         var zoff = 0;
        //         for (var k = 0; k < depth; k++) {
        //             // Calculate the index for the 1D array
        //             var index = i + j * cols + k * cols * rows;

        //             // Generate noise
        //             var angleNoise = noise(xoff, yoff, zoff);

        //             // Create a vector from the noise angle
        //             var v = p5.Vector.fromAngle(angleNoise * TWO_PI);
        //             v.setMag(vecMagSize);

        //             // Store the vector in the flow field array
        //             flowFields[index] = v;

        //             // Update the x offset
        //             xoff += xstep;
        //             if (xoff >= 10000.0) {
        //                 xoff = 0.0;
        //             }

        //             // Update the z offset
        //             zoff += zstep;
        //             if (zoff >= 10000.0) {
        //                 zoff = 0.0;
        //             }
        //         }

        //         // Update the y offset
        //         yoff += ystep;
        //         if (yoff >= 10000.0) {
        //             yoff = 0.0;
        //         }
        //     }
        // }

    }

    uninitialize() {

    }
}