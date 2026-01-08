"use strict";

/** @type {WebGLRenderingContext} */
var gl = null;

///////////////////// GLOBAL VARIABLES : WINDOWING RELATED 
var canvas = null;

var bFullScreen = false;
var canvas_original_width;
var canvas_original_height;

///////////////////// GLOBAL VARIABLES : GLOBAL SHADER PROGRAMS 
var colorCubeShader;
var bloomShader;
let commonShaderProgram; // GLTF, FBX, OBJ
let globalBSplineCamera;
let cubeMapShaderProgram;
var modelShaderProgramObject = null; // ONLY OBJ
var postProc = null; // ONLY OBJ
// /** @type {GLTFShaderProgram} */
// var gltfShaderProgram = null;
var flowField;
var textureShaderProgramObject;
var grassShaderProgramObject;
//var glassShaderProgramObject;
var particleShader = null;
var fbmNoiseShaderProgram;

var chimniFire

/////////////////////// GLOBAL VARIABLES : SECENE RELATED 
/** @type {MainScene} */
let mainScene = null;
// let gltfTempRenderer = null;
var sceneFBO = null;
var godRaysColorMapFBO = null;
var fmbNoiseFBO = null;

configs.EnablePostProcessing = false;

///////////////////// GLOBAL VARIABLES : TEMP MODELS 
/** @type {OBJMesh} */
var objModel = null;
var objModelNew = null;
// /** @type {GLTFMesh} */
// var gltfModel = null;


///////////////////// GLOBAL VARIABLES : CAMERA RELATED 
let camera = null;
var POINT_POINTER = 0;
var MAX_POINTS = 10;

var isAutoCamera;

// Define your control points
var bezierPointsGlobal = [
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
];

// YAW GLOBAL
var yawGlobal = [
    0.0,
    0.0,
    0.0,

];

// PITCH GLOBAL
var pitchGlobal = [
    0.0,
    0.0,
    0.0,
];

var rollGlobal = [
    0.0,
    0.0,
    0.0,
];


// FOV GLOBAL
var fovGlobal = [
    0,
    0,
    0,
];

var vectorIndex = bezierPointsGlobal.length - 1;
var skyDome;

///////////////////// GLOBAL VARIABLES : TIME RELATED 
var currentFrameTime = 0.0;
var lastFrameTime;
var ELAPSED_TIME;
var startTime;

var fps_time_start = 0.0;
var fps_current_time = 0.0;
var counter = 0;
var FPS = 0.0;

// GLOBAL SETTING
let USE_FPV_CAM = false;
var isAutoCamera = false;
var bNightScene = false;
var bEveningScene = true;
var enablePointLightsControl = false;
var enableBezierCameraControl = false;
var globalAnimationDelta;
var cameraChangePass = false;

///////////////////// GLOBAL FUNCTIONS 
var requestAnimationFrame = window.requestAnimationFrame || // SwapBuffer / glxSwapBuffer / 
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;


///////////////////// ENTRY FUNCTIONS 
async function main() {

    // CODE

    canvas = document.getElementById("TextureGroup");
    if (!canvas)
        console.error("Obtaining Canvas Failed\n");
    else
        console.log("Obtaining canvas succeeded\n");

    // Backup canvas dimensions
    canvas_original_width = canvas.width;
    canvas_original_height = canvas.height;

    // initialize
    await initialize();

    // if (enableBezierCameraControl) {
    //     objX = bezierPointsGlobal[bezierPointsGlobal.length - 1][0];
    //     objY = bezierPointsGlobal[bezierPointsGlobal.length - 1][1];
    //     objZ = bezierPointsGlobal[bezierPointsGlobal.length - 1][2];
    //     scaleX = yawGlobal[yawGlobal.length - 1];
    //     scaleY = pitchGlobal[pitchGlobal.length - 1];
    //     scaleZ = fovGlobal[fovGlobal.length - 1];
    // }

    // resize
    resize();

    // display
    display();

    window.addEventListener("resize", resize, false);

    // EVENT HANDLING
    // Adding keyboard and mouse event handlers
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);

    window.addEventListener("keyup", keyUp, false);
    // Adding this event only to the canvas
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("wheel", wheelMove, false);

}

async function initialize() {

    // CODE

    // INITIALIZE OPENGL //////////////////////////////////////////////////
    gl = canvas.getContext("webgl2");
    if (!gl)
        console.error("Obtaining webgl2 context Failed\n");
    else
        console.log("Obtaining webgl2 context succeeded\n");

    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    orthographicProjectionMatrix = mat4.create();
    perspectiveProjectionMatrix = mat4.create();

    ///// INITIALIZE GLOBAL SHADER PROGRAMS //////////////////////////////////////
    modelShaderProgramObject = new OBJShaderProgram();
    commonShaderProgram = new CommonShaderProgram();
    cubeMapShaderProgram = new CubeMapShaderProgram();
    colorCubeShader = new ColorCubeShader();
    bloomShader = new BloomShader(gl)
    skyDome = new SkyDome();
    postProc = new PostProcess();
    //flowField = new FlowField();
    textureShaderProgramObject = new TextureShaderProgram();
    grassShaderProgramObject = new GrassShader();
    //glassShaderProgramObject = new GlassShaderProgram();
    particleShader = new ParticleShader();
    // fbmNoiseShaderProgram = new FBM_Noise_ShaderProgram();

    chimniFire = new ChimniFire();

    // gltfTempRenderer = new GLTFRenderer();
    // gltfShaderProgram = new GLTFShaderProgram();
    await Promise.all([
        commonShaderProgram.init(),
        colorCubeShader.init(),
        bloomShader.init(),
        cubeMapShaderProgram.init(),
        modelShaderProgramObject.initialize(),
        skyDome.initialize(),
        postProc.initialize(),
        //flowField.init(),
        textureShaderProgramObject.init(),
        particleShader.init(),
        grassShaderProgramObject.init(),
        // glassShaderProgramObject.init(),
        // fbmNoiseShaderProgram.init(),
        // gltfShaderProgram.init(),
        // gltfShaderProgram.init();

        chimniFire.initialize(gl)
    ]);

    // INITIALIZE GLOBAL MODELS ///////////////////////////////////////////
    objModel = new OBJMesh();
    // objModelNew = new OBJMesh();
    // gltfModel = new GLTFMesh();


    /// INTIALIZE ALL SCENES //////////////////////////////////////////////
    mainScene = new MainScene();
    sceneFBO = new Framebuffer();
    godRaysColorMapFBO = new Framebuffer();
    await Promise.all([
        mainScene.init(),
        sceneFBO.create(2560, 1440),
        godRaysColorMapFBO.create(2560, 1440),
    ]);

    // fmbNoiseFBO = new Framebuffer();
    // fmbNoiseFBO.create(2560, 1440),

    //     fbmNoiseShaderProgram = new FBM_Noise_ShaderProgram();
    // await fbmNoiseShaderProgram.init();

    // INITIALIZE CAMERA RELATED //////////////////////////////////////////
    vectorIndex = bezierPointsGlobal.length - 1;
    camera = new Camera(canvas.width, canvas.height, [40.0, 50.0, -200.0]);

    // INITIALIZE TIME RELATED ////////////////////////////////////////////
    fps_time_start = new Date().getTime();

    audioElement.play();
    startTime = new Date().getTime();
}

function resize() {

    // CODE
    if (bFullScreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else {
        canvas.width = canvas_original_width;
        canvas.height = canvas_original_height;
    }

    if (canvas.height == 0)
        canvas.height = 1;

    gl.viewport(0, 0, canvas.width, canvas.height);

    camera.updateResolution(canvas.width, canvas.height);

    // this is also updated in camera.js
    mat4.perspective(
        perspectiveProjectionMatrix,
        45.0,
        parseFloat(canvas.width) / parseFloat(canvas.height),
        1.0,
        5000.0)


    // Set orthographic projection matrix
    if (canvas.width <= canvas.height) {
        mat4.ortho(
            orthographicProjectionMatrix,
            -25.0,
            25.0,
            -25.0 * (parseFloat(canvas.height) / parseFloat(canvas.width)),
            25.0 * (parseFloat(canvas.height) / parseFloat(canvas.width)),
            -25.0,
            25.0
        ); 	// left, right , bottom, top, near, far
    }
    else {
        mat4.ortho(
            orthographicProjectionMatrix,
            -25.0 * (parseFloat(canvas.width) / parseFloat(canvas.height)),
            25.0 * (parseFloat(canvas.width) / parseFloat(canvas.height)),
            -25.0,
            25.0,
            -25.0,
            25.0
        );
    }
}


function display() {

    let deltaTime = update();
    // code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (enablePointLightsControl === true || enableBezierCameraControl) {
        bezierPointsGlobal[vectorIndex][0] = objX;
        bezierPointsGlobal[vectorIndex][1] = objY;
        bezierPointsGlobal[vectorIndex][2] = objZ;
        yawGlobal[vectorIndex] = scaleX;
        pitchGlobal[vectorIndex] = scaleY;
        rollGlobal[vectorIndex] = scaleZ;
    }


    if (USE_FPV_CAM === true) {

        //console.log("USE_FPV_CAM = TRUE\n");
        mainScene.update(deltaTime);
        mainScene.render(camera, deltaTime);

        if (configs.EnablePostProcessing === true) {

            // fmbNoiseFBO.bind();
            // fbmNoiseShaderProgram.render();
            // fmbNoiseFBO.unbind();

            skyDome.draw(camera);

            if (configs.enable_GodRays === true) {
                godRaysColorMapFBO.bind();
                displayGodRaysPass(camera, deltaTime);
                godRaysColorMapFBO.unbind();
            }

        }

    }
    else {
        //console.log("USE_FPV_CAM = FALSE\n");
        mainScene.update(deltaTime);

        if (cameraChangePass === false)
            mainScene.render(globalBSplineCamera, deltaTime);


        if (configs.EnablePostProcessing === true) {

            // fmbNoiseFBO.bind();
            // fbmNoiseShaderProgram.render();
            // fmbNoiseFBO.unbind();

            skyDome.draw(globalBSplineCamera);

            if (configs.enable_GodRays === true) {
                godRaysColorMapFBO.bind();
                if (cameraChangePass === false)
                    displayGodRaysPass(globalBSplineCamera, deltaTime);
                godRaysColorMapFBO.unbind();
            }
        }
    }

    if (configs.EnablePostProcessing === true) {
        postProc.draw(sceneFBO, skyDome.getTexture(), bloomShader.getBloomTexture(), bloomShader.getBlurTexture(), godRaysColorMapFBO.getTexture());
    }
    // //postProc.draw(sceneFBO, water.reflecttion_fbo.getTexture());

    // Double Buffering emulation
    requestAnimationFrame(display, canvas);
}

function update() {

    // CALCULATE DELATA TIME
    currentFrameTime = new Date().getTime();
    var deltaTime = (currentFrameTime - lastFrameTime) / 1000.0; // USE deltaTime FOR DEVICE INDEPENDENT ANIMATION 
    lastFrameTime = new Date().getTime();

    // CACULATE FPS
    fps_current_time = (new Date().getTime() - fps_time_start);
    counter = counter + 1;
    if (fps_current_time > 1000.0) {
        FPS = counter;

        let printString = `FPS : ${FPS}`
        document.getElementById("fps").innerHTML = printString;

        counter = 0;
        fps_time_start = new Date().getTime();
    }

    ELAPSED_TIME = (new Date().getTime() - startTime) / 1000.0; // USE ELAPSED_TIME FOR SCENE TRANSITIONS

    let printTimeString = `ELAPSED_TIME : ${ELAPSED_TIME}`
    document.getElementById("time").innerHTML = printTimeString;

    // Dissolve Effect Update ==============================================

    if (84.0 <= ELAPSED_TIME && ELAPSED_TIME <= 84.2) {
        women_bEnableDissolvePass = true;
        woman_bDraw = true;
        women_bDissolveDirection = false;
    }

    if (women_fDissolveProgress < 0.4) {
        women_bEnableDissolvePass = false;
    }

    if (women_bEnableDissolvePass) {
        if (women_bDissolveDirection === true) {
            if (women_fDissolveProgress < 1.0)
                women_fDissolveProgress += 0.001;
        }
        else {
            if (women_fDissolveProgress > 0.4)
                women_fDissolveProgress -= 0.002;
        }
        // console.log("robot_uProgress : " + women_fDissolveProgress);
    }
    // ======================================================================
    // ======================================================================

    if (51.0 <= ELAPSED_TIME && ELAPSED_TIME <= 55.0) {
        if (bprojectNameAlpha) {
            projectNameAlpha += 0.006;

            if (projectNameAlpha >= 1.0)
                bprojectNameAlpha = false;
        }
    }

    if (59.0 <= ELAPSED_TIME && ELAPSED_TIME <= 65.0) {
        if (false === bprojectNameAlpha) {
            projectNameAlpha -= 0.01;
        }
    }

    chimniFire.update();

    return deltaTime;
}

function toggleFullScreen() {

    // Code
    var fullScreen_Element = document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        null;

    if (fullScreen_Element == null) // If Not full Screen
    {
        if (canvas.requestFullscreen)
            canvas.requestFullscreen();
        else if (canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();

        bFullScreen = true;
    }
    else {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozExitFullScreen)
            document.mozExitFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();

        bFullScreen = false;
    }
}

////////////////////////////////////////// Event Handlers
// Keyboard handler
function keyDown(event) {
    // Code
    switch (event.keyCode) {
        case 70:
            toggleFullScreen();
            break;
        case 27:
            uninitialize();
            window.close();
            break;
        case 76:
            break;
    }

    switch (event.key) {
        case 'ArrowLeft':
            scaleX -= scaleIncrement;
            break;
        case 'ArrowRight':
            scaleX += scaleIncrement;
            break;
        case 'ArrowUp':
            scaleY += scaleIncrement;
            break;
        case 'ArrowDown':
            scaleY -= scaleIncrement;
            break;
        case '+':
            scaleZ += scaleIncrement;
            break;
        case '-':
            scaleZ -= scaleIncrement;
            break;
        case '8':
            objY += objIncrement;
            break;
        case '5':
            objY -= objIncrement;
            break;
        case '4':
            objX -= objIncrement;
            break;
        case '6':
            objX += objIncrement;
            break;
        case '7':
            objZ -= objIncrement;
            break;
        case '1':
            objZ += objIncrement;
            break;
        case 'C':
            isAutoCamera = false;
            break;
        case 'c':
            isAutoCamera = true;
            break;
        case 'x':
        case 'X':
            // POINT_POINTER = (POINT_POINTER + 1) % MAX_POINTS;
            if (USE_FPV_CAM === true)
                USE_FPV_CAM = false;
            else
                USE_FPV_CAM = true;
            break;
        case 'M':
        case 'm':
            objIncrement = objIncrement + 0.1;
            break;

        case 'N':
        case 'n':
            objIncrement = objIncrement - 0.1;
            break;

        case 'p':
        case 'P':
            //console.log(bezierPointsGlobal);
            if (enableBezierCameraControl && USE_FPV_CAM) {

                bezierPointsGlobal.push([camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]]);
                yawGlobal.push(camera.yaw);
                pitchGlobal.push(camera.pitch);
                rollGlobal.push(0.0);
                vectorIndex = bezierPointsGlobal.length - 1;
            }
            else if (enableBezierCameraControl || enablePointLightsControl) {
                bezierPointsGlobal.push([objX, objY, objZ]);
                yawGlobal.push(scaleX);
                pitchGlobal.push(scaleY);
                rollGlobal.push(scaleZ);
                vectorIndex = bezierPointsGlobal.length - 1;
            }

            console.log('[' + objX + ',' + objY + ',' + objZ + '],' + yAngle_Rotate + ']');

            break;

        case 'G':
        case 'g':
            if (enableBezierCameraControl || enablePointLightsControl) {
                if (bezierPointsGlobal.length > vectorIndex + 1) {
                    vectorIndex++;
                    objX = bezierPointsGlobal[vectorIndex][0];
                    objY = bezierPointsGlobal[vectorIndex][1];
                    objZ = bezierPointsGlobal[vectorIndex][2];
                    scaleX = yawGlobal[vectorIndex];
                    scaleY = pitchGlobal[vectorIndex];
                    scaleZ = rollGlobal[vectorIndex];
                }
            }
            break;
        case 'B':
        case 'b':
            if (enableBezierCameraControl || enablePointLightsControl) {
                if (vectorIndex > 0) {
                    vectorIndex--;
                    objX = bezierPointsGlobal[vectorIndex][0];
                    objY = bezierPointsGlobal[vectorIndex][1];
                    objZ = bezierPointsGlobal[vectorIndex][2];
                    scaleX = yawGlobal[vectorIndex];
                    scaleY = pitchGlobal[vectorIndex];
                    scaleZ = rollGlobal[vectorIndex];
                }
            }
            break;
        case 'q':
        case 'Q':
            if (enableBezierCameraControl === true || enablePointLightsControl === true) {
                // Required  for camera
                console.log("const bezierPointsGlobal = [ ");
                for (var i = 0; i < bezierPointsGlobal.length; i++) {
                    console.log("[ " + bezierPointsGlobal[i][0] + ", " + bezierPointsGlobal[i][1] + "," + bezierPointsGlobal[i][2] + " ],");
                }
                console.log("};\n");

                console.log("\n\n// YAW GLOBAL\n");
                console.log("var yawGlobal = [\n");
                for (let i = 0; i < yawGlobal.length; i++) {
                    console.log(yawGlobal[i] + ",");
                }
                console.log("];\n");

                console.log("\n\n// PITCH GLOBAL\n");
                console.log("var pitchGlobal = [\n");
                for (let i = 0; i < pitchGlobal.length; i++) {
                    console.log(pitchGlobal[i] + ",");
                }
                console.log("];\n");

                console.log("\n\n// FOV GLOBAL\n");
                console.log("var rollGlobal = [\n");
                for (let i = 0; i < rollGlobal.length; i++) {
                    console.log(rollGlobal[i] + ",");
                }
                console.log("];\n");

                console.log("bezierPointsGlobal.length = " + bezierPointsGlobal.length);
                console.log("yawGlobal.length = " + yawGlobal.length);
                console.log("pitchGlobal.length = " + pitchGlobal.length);
                console.log("rollGlobal.length = " + rollGlobal.length);
            }
            break;
        case 'R':
        case 'r':
            // console.log([camera.yaw, camera.pitch]);
            yAngle_Rotate = yAngle_Rotate + 1.0;
            if (yAngle_Rotate >= 360.0) {
                yAngle_Rotate = 0.0;
            }
            break;

        // Dissolve Effect ==============================
        // case 'T':
        // case 't':
        //     robot_bEnableDissolvePass = !robot_bEnableDissolvePass;
        //     console.log("robot_bEnableDissolvePass : " + robot_bEnableDissolvePass);
        //     break;

        // case 'Y':
        //     robot_dissolveProgressDirection = true;
        //     break;
        // case 'y':
        //     robot_dissolveProgressDirection = false;
        //     break;
        // ==============================================
    }

    // Passing key input to camera
    camera.keyboardInputs(event);
}

// Detects ShiftKey up to decrease camera speed
function keyUp(event) {
    camera.inputOnKeyUp(event);
}

// Passing mouse input to camera
function mouseMove(event) {
    camera.mouseInputs(event);
}

// Passing mouse input to camera
function wheelMove(event) {
    camera.mouseScroll(event);
}

// Mouse handler
function mouseDown() {
}

////////////////////////////////////////// Uninitialize
function uninitialize() {
    // code
    // gltfModel.destroy();

    if (mainScene) {
        mainScene.uninitialize();
        mainScene = null;
    }


}