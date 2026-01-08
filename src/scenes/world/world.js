/**@type {TerrainGeom} */
let terrain;



/**@type {TerrainShader} */
let terrainShader;

/**@type {Water} */
let water;

// /**@type {WaterDisp} */
// let waterDisp;


let projectName;
let bprojectNameAlpha = true;
let projectNameAlpha = 0.0;

let assimpModel;
let dongarTree_model;

let palm_tree_model;
let lotus_model;
let mango_tree;
let tree;
let chapha_tree;
let stones;
let bush;
let grass;
let bird;

let MainHouse;
let House_One;
let House_Two;
let House_Three;
let House_Four;
let House_Five;
let House_Six;
let Old_hut;

let canvas_model;

let Kitchen;

let wooden_bridge;
let bedroomModel;
let atticModel;

let OutsideEveningManSitting;

let LivingRoom_PianoSceneCoupleModel;

let LivingRoom_DrinkingScene_ManModels;
let LivingRoom_DrinkingScene_WomenModels;

let SpotlightScene;

let KitchenWomen;

let CoupleOnBridge;
let ManReflectionOnFBO;

let woman_bDraw = false;
let women_bEnableDissolvePass = false;
let women_bDissolveDirection = true;
let women_fDissolveProgress = 1.0;
// let uEnableDissolvePass;
// let uProgress;
// let uEdge;
// let uEdgeColor;
// let uFrequency;
// let uAmplitude;

let Outside_EveningScene_CoupleModel;

let ManSittingUnderGulmohar;

let orangeTree_model;
let gulmohorTree_model;
let panKanis_model;

let cubeMaptextureNight;

var godRaysLightPos = [1.0, 1.0, 1.0];  // Default position

var sunsetTransitionStartTime = null;
var sunsetTransitionDuration = 0.0;
var originalSunsetValues = {
    skydomeColorTop: [255.0, 160.0, 100.0],
    skydomeColorBottom: [135.0, 155.0, 180.0],
    sun_color: [237, 79, 45],
    sun_position_y: 120,
    sun_size: 30,
    godrays_exposure: 0.4,
    godrays_density: 2.5,
    godrays_weight: 0.19,
    sun_disk_size: 50,
    sun_intensity: 0.2,
    sun_color_refl: [255.0, 187.0, 102.0]
};

var fireflySystem = null;

// Curtain related variables
var curtainShader = null;
var bedroomCurtain = null;
var curtainTexture = null;
var bCurtainWaveEnabled = false;

var sphere = null;

var pointLightPositions = [
    //////// Shraddha : Extra background lights for all night scenes enhancements
    [400.0, -5.0, -215.0],
    [58.04353332519531,74.20511627197266,-200.6295166015625],   // bedroom stone

    //--------------------------------------------------------------------------- 

    [167.6739501953125,9.198250770568848,-156.51222229003906],      // attic chessboard


    ///////////////////////////////////////
    //hall madhe fire chya photo frame bajula khidaki chi baju
    [242.73953247070312, 26.774316787719727, -296.2162780761719],

    //tv chya shejari kopryamadhe lamp
    [287.19866943359375, 21.04500961303711, -296.75579833984375],

    //teapoy hall madhe
    [259.9622497558594, 12.146950721740723, -277.7567138671875],

    //hall chya 2 khidkhi madhe
    [264.18963623046875, 27.517995834350586, -203.68380737304688],

    //bedroom lamp
    [154.6581573486328, 61.77721405029297, -281.18939208984375],

    //bedroom back to bed
    [150.04637145996094, 80.3243408203125, -297.0606384277344],

    //kitech lamp
    [83.02297973632812, 24.78784942626953, -349.5443420410156],

    [84.45598602294922, 25.32478904724121, -312.0076904296875],

    // Spotlight Scene
    [0.07312431931495667, 15.854562759399414, 1.7843104600906372],

    [0.07312431931495667, 15.854562759399414, 81.7843104600906372],

    [0.07312431931495667, 15.854562759399414, 146.7843104600906372],

    [0.07312431931495667, 15.854562759399414, 161.7843104600906372],

];

var pointLightColors = [
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 0.0],

    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],


    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],
    [0.9, 0.9, 0.9],

    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
];

var LivingRoom_PianoSceneCoupleModel_Position = [
    [400.0, -5.0, -210.0],
];

var LivingRoom_DrinkingScene_ManModels_Position = [
    [400.0, -5.0, -210.0],
];

var LivingRoom_DrinkingScene_WomenModels_Position = [
    [400.0, -5.0, -210.0],
];

var KitchenWomen_Position = [
    [50.0, 6, -360.0],
];

var Outside_EveningScene_CoupleModel_Position = [
    [400.0, -5.0, -202.0],
];

var OutsideEveningManSitting_Position = [
    [400.0, -5.0, -202.0],
];

var CoupleOnBridge_postion = [[-117.0, 12.0, -300.0]];

var ManReflectionInFBO_position = [[-117.0, 12.0, -300.0]];

var projectName_Position = [
    [190.0, 8.0, -299.0],
];

var bush_position = [
    [20.0, 5.0, -80.0],
    [-10.0, 7.0, -300.0],
    [50.0, 5.0, -120.0],
    [45.0, 4.0, -140.0],
    [37.0, 4.3, -200.0],
    [16.0, 6.0, -130.0],
    [-20.0, 7.0, -250.0],
    [7.0, 6.0, -100.0],
    [25.0, 6.0, -220.0],
    [0.0, 6.0, -200.0],
    [0.5, 6.0, -240.0],
    [1.0, 6.0, -320.0],
    //near to lake 
    [-30.0, 9.0, -180.0],
    [-40.0, 9.0, -160.0],
    [-50.0, 9.0, -140.0],
    [-60.0, 11.0, -150.0],

];

var grass_Position = [
    //NEAR TO HOME
    [60.0, 5.0, -220.0],
    [80.0, 4.0, -240.0],
    [40.0, 6.0, -280.0],
    [80.0, 4.0, -200.0],
    [30.0, 5.0, -220.0],
    [20.0, 6.0, -240.0],

    [120.0, 4.0, -235.0],
    [90.0, 4.0, -280.0],
    [80.0, 6.0, -380.0],
    [140.0, 4.0, -260.0],
    [60.0, 5.0, -320.0],
    [40.0, 6.0, -340.0],
];

var mango_tree_position = [
    //left to main house
    [45.0, 4.0, -450.0],
];

var tree_position = [
    //left to main house
    [-20.0, 0.0, -510.0],
    //[-40.0, 0.0, -500.0],
];

var orange_tree_position = [

    // //right to main house
    [150.0, 4.0, -120.0],

    //backside to main house
    [280.0, 4.0, 20.0],

    //backside to house
    [140.0, 4.0, 40.0],

    //near to lake
    [-85.0, 6.0, -15.0],


];

var gulmohor_tree_position = [

    //backside to house
    [280.0, 4.0, -80.0],


];

var dongarTree_position = [
    //near to lake
    [-470.0, 25.0, 350.0],
    [-470.0, 35.0, 300.0],
    [-450.0, 45.0, 250.0],
    [-460.0, 40.0, 200.0],
    [-430.0, 40.0, 150.0],
    [-470.0, 20.0, 100.0],
    [-450.0, 10.0, 50.0],
    [-460.0, 20.0, 0.0],
    [-430.0, 28.0, -50.0],
    [-470.0, 35.0, -100.0],
    // [-450.0, 25.0, -150.0],
    // [-460.0, 25.0, -200.0],
    // [-430.0, 28.0, -250.0],
    // [-470.0, 40.0, -300.0],
    // [-450.0, 45.0, -350.0],
    [-460.0, 25.0, -400.0],
    [-430.0, 10.0, -450.0],
    [-430.0, 8.0, -500.0],

];

var ManSittingUnderGulmohar_position = [
    //backside to house
    [277.9, 4.0, -79.0],
];

var chapha_tree_position = [[180.0, 3.5, -350.0],];
var stones_position = [[180.0, 4.7, -350.0],];

var palm_tree_position = [
    //left side of lake
    [-320.0, 3.0, -10.0],
    [-280.0, 3.0, 20.0],
    [-240.0, 3.0, -10.0],
    [-200.0, 3.0, 0.0],
    [-160.0, 3.0, -10.0],
    [-130.0, 3.0, -25.0],

    //right side of lake
    [-330.0, 3.2, -450.0],
    [-280.0, 3.2, -450.0],
    [-230.0, 3.2, -450.0],
    [-180.0, 3.2, -430.0],
    [-130.0, 3.2, -420.0],

    [-100.0, 3.5, -360.0],
    [-80.0, 2.0, -380.0],
    [-80.0, 3.6, -340.0],

];

var wooden_bridge_postion = [[-117.0, 12.0, -300.0]];

var panKanis_position = [
    [-117.0, 2.0, -300.0],
    [-110.0, 2.0, -315.0],
    [-104.3, 2.0, -295.0],
    [-130.0, 2.0, -380.0],
    [-150.0, 2.0, -380.0],
    [-80.39875030517578, 2.0, -290.81256103515625],
    [-78.13761138916016, 2.0, -284.2535400390625],
    [-117.9995346069336, 2.0, -311.81939697265625],
    [-97.30524444580078, 2.0, -270.3424377441406],
  

    [-125.60983276367188, 2.0, -360.8039855957031], // addinng near bridge (right side)
    [-122.60983276367188, 2.0, -358.8039855957031], // addinng near bridge (right side)
    [-124.60983276367188, 2.0, -357.8039855957031], // addinng near bridge (right side)
    [-105.0, 2.7, -255.0], // addinng near bridge

    [-107.0, 2.7, -254.0], // addinng near bridge
    [-110.0, 2.7, -253.0], // addinng near bridge

    [-218.47653198242188,2.0,-159.7133331298828],
    [-214.03912353515625,2.0,-244.21575927734375],
    [-273.0267333984375,2.0,-235.4292449951172],
    [-267.55865478515625,2.0,-278.56402587890625],
    [-125.65747833251953,2.0,-181.2725830078125],
    [-119.74015808105469,2.0,-155.3750457763672],
    [-128.29983520507812,2.0,-143.72157287597656],
    [-117.69686126708984,2.0,-140.88479614257812],
    [-132.28509521484375,2.0,-126.0886001586914],
    [-152.19327545166016,2.0,-109.43045806884766],
    [-192.3256072998047,2.0,-110.25617980957031],
    [-160.08079528808594,2.0,-120.23169708251953],
    [-188.3448028564453,2.0,-81.04975128173828],
    [-196.36260986328125,2.0,-90.311744689941406],
];

var canvas_position = [
    [400.0, -5.0, -210.0],
];


var MainHouse_position = [
    //[120.0, 17.5, -200.0],            // Shraddha
    //[275.0, -4.0, -210.0],            // Prajwal : <-- You can change the height of the Main house from here. at current it is '8.0'
    [400.0, -5.0, -210.0],
];

var Kitchen_Position = [
    [50.0, 6, -360.0],
];

/////////////////////////////////////////
var House_One_Position = [
    //[-30.0, 9.5, 0.0],
    [-140.0, 6.5, 80.0],
];

var House_Five_Position = [
    //[0.0, 26.0, -110.0],
    [0.0, 40.0, 70.0],
];

var House_Six_Position = [
    //[0.0, 26.0, -110.0],
    [240.0, 17.0, 150.0],
];

var Old_hut_Position = [
    //[0.0, 26.0, -110.0],
    //[0.0, 5.0, -500.0], // old hut position
    [0.0, 10.0, -500.0], // new house position
];

var bedroom_position = [
    //[250.0, 8.0, -330.0],
    [82.0, 37.0, -300.0],
];

var nightTree_position = [
    [200.0, 8.0, -350.0],
];

var Lotus_Postion = [

    [-340.0, 2.7, -70.0],
    [-300.0, 2.7, -40.0],
    [-230.0, 2.7, -40.0],
    [-209.49551391601562, 2.7, -389.22491455078125],
    [-120.0, 2.7, -250.0], // addinng near bridge
    [-177.37051391601562,2.7,-144.0240020751953],
];

var atticModel_position = [
    [150.0, -30.0, -130.0],
];

var SpotlightScene_Position = [
    [0.0, 10.0, 0.0],
];

// Jugnu 
var maxParticles = 100;
var particlePositions = new Float32Array(maxParticles * 3);
var particleVelocities = [];

async function initializeWorld() {

    water = new Water();
    water.initialize();

    // point light 
    for (var i = 0; i < pointLightPositions.length; i++) {
        pointLightColors[i] = [1.0, 1.0, 1.0];
    }
    // var i = 0;
    // for (i = 0; i < pointLightPositions_yellowColor.length; i++) {
    // pointLightPositions[i] = pointLightPositions_yellowColor[i];
    // }

    // for (var j = i; j < pointLightPositions_blueColor.length; j++) {
    // pointLightColors[j] = [158.0/255.0, 212.0/255.0, 255.0/255.0];
    // }

    // waterDisp = new WaterDisp();
    // await waterDisp.initialize();

    // Initialize firefly system
    fireflySystem = new FireflySystem();
    await fireflySystem.initialize();

    // Initialize curtain
    curtainShader = new CurtainShader();
    await curtainShader.initialize();

    bedroomCurtain = new Curtain(20.0, 50.0, 6);  // width, height, pleats
    bedroomCurtain.initialize();

    // Load curtain texture
    curtainTexture = TextureManger.LoadTexture("./assets/textures/curtain/curtain.png");
    bedroomCurtain.setTexture(curtainTexture);

    terrain = new TerrainGeom();

    terrainShader = new TerrainShader();
    terrainShader.initialize();

    let config = new TerrainConfig();
    config.Height = 1024;
    config.Width = 1024;
    config.heightMapFilename = "./assets/terrain/Village/HeightMap.r16";
    config.colorMapFilename = "./assets/terrain/Village/Colormap.png";
    config.heightScale = 50.0;

    let skymapFacesInfo = [
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: "./assets/textures/Night_CubeMap/px.png",
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: "./assets/textures/Night_CubeMap/nx.png",
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: "./assets/textures/Night_CubeMap/py.png",
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: "./assets/textures/Night_CubeMap/ny.png",
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: "./assets/textures/Night_CubeMap/pz.png",
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: "./assets/textures/Night_CubeMap/nz.png",
        },
    ];

    projectName = new AssimpModelLoader();

    assimpModel = new AssimpModelLoader();
    palm_tree_model = new AssimpModelLoader();
    mango_tree = new AssimpModelLoader();
    tree = new AssimpModelLoader();
    orangeTree_model = new AssimpModelLoader();
    gulmohorTree_model = new AssimpModelLoader();
    panKanis_model = new AssimpModelLoader();
    chapha_tree = new AssimpModelLoader();
    stones = new AssimpModelLoader();
    dongarTree_model = new AssimpModelLoader();


    base = new AssimpModelLoader();
    bush = new AssimpModelLoader();
    grass = new AssimpModelLoader();

    MainHouse = new AssimpModelLoader();
    Kitchen = new AssimpModelLoader();
    canvas_model = new AssimpModelLoader();

    LivingRoom_PianoSceneCoupleModel = new AssimpModelLoader();
    LivingRoom_DrinkingScene_ManModels = new AssimpModelLoader();
    LivingRoom_DrinkingScene_WomenModels = new AssimpModelLoader();

    KitchenWomen = new AssimpModelLoader();

    Outside_EveningScene_CoupleModel = new AssimpModelLoader();

    OutsideEveningManSitting = new AssimpModelLoader();

    ManSittingUnderGulmohar = new AssimpModelLoader();

    SpotlightScene = new AssimpModelLoader();

    CoupleOnBridge = new AssimpModelLoader();

    ManReflectionOnFBO = new AssimpModelLoader();

    House_One = new AssimpModelLoader();
    House_Five = new AssimpModelLoader();
    House_Six = new AssimpModelLoader();
    Old_hut = new AssimpModelLoader();

    wooden_bridge = new AssimpModelLoader();
    bedroom = new AssimpModelLoader();
    nightTree = new AssimpModelLoader();
    atticModel = new AssimpModelLoader();

    bird = new AssimpModelLoader();
    lotus_model = new AssimpModelLoader();

    var yRotateAngle = 0.0;
    var palm_tree_Transform_matrix = [];
    for (var i = 0; i < palm_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(palm_tree_position[i][0], palm_tree_position[i][1], palm_tree_position[i][2]));
        palm_tree_Transform_matrix.push(transformMatrix);
    }

    var mango_tree_Transform_matrix = [];
    for (var i = 0; i < mango_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(mango_tree_position[i][0], mango_tree_position[i][1], mango_tree_position[i][2]));
        mango_tree_Transform_matrix.push(transformMatrix);
    }

    var tree_Transform_matrix = [];
    for (var i = 0; i < chapha_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(tree_position[i][0], tree_position[i][1], tree_position[i][2]));
        tree_Transform_matrix.push(transformMatrix);
    }

    var orange_tree_Transform_matrix = [];
    for (var i = 0; i < orange_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(orange_tree_position[i][0], orange_tree_position[i][1], orange_tree_position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(8.25, 8.25, 8.25));
        mat4.rotateX(transformMatrix, transformMatrix, (270.0 * Math.PI) / 180.0);
        orange_tree_Transform_matrix.push(transformMatrix);
    }

    var gulmohor_tree_Transform_matrix = [];
    for (var i = 0; i < gulmohor_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(gulmohor_tree_position[i][0], gulmohor_tree_position[i][1], gulmohor_tree_position[i][2]));
        gulmohor_tree_Transform_matrix.push(transformMatrix);
    }

    var panKanis_Transform_matrix = [];
    for (var i = 0; i < panKanis_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(panKanis_position[i][0], panKanis_position[i][1], panKanis_position[i][2]));
        panKanis_Transform_matrix.push(transformMatrix);
    }

    var dongarTree_Transform_matrix = [];
    for (var i = 0; i < dongarTree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(dongarTree_position[i][0], dongarTree_position[i][1], dongarTree_position[i][2]));
        dongarTree_Transform_matrix.push(transformMatrix);
    }

    var chapha_tree_Transform_matrix = [];
    for (var i = 0; i < chapha_tree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(chapha_tree_position[i][0], chapha_tree_position[i][1], chapha_tree_position[i][2]));
        chapha_tree_Transform_matrix.push(transformMatrix);
    }

    var stones_Transform_matrix = [];
    for (var i = 0; i < stones_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(stones_position[i][0], stones_position[i][1], stones_position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(2.25, 2.0, 2.25));

        mat4.rotateX(transformMatrix, transformMatrix, (90.0 * Math.PI) / 180.0);

        stones_Transform_matrix.push(transformMatrix);
    }

    var projectN_Transform_matrix = [];
    for (var i = 0; i < projectName_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(projectName_Position[i][0], projectName_Position[i][1], projectName_Position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(10.05, 10.05, 10.05));
        mat4.rotateZ(transformMatrix, transformMatrix, (-90.0 * Math.PI) / 180.0);
        mat4.rotateY(transformMatrix, transformMatrix, (90.0 * Math.PI) / 180.0);
        projectN_Transform_matrix.push(transformMatrix);
    }

    var bush_Transform_matrix = [];
    for (var i = 0; i < bush_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(bush_position[i][0], bush_position[i][1], bush_position[i][2]));
        bush_Transform_matrix.push(transformMatrix);
    }

    var grass_Transform_matrix = [];
    for (var i = 0; i < grass_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(grass_Position[i][0], grass_Position[i][1], grass_Position[i][2]));
        mat4.rotateX(transformMatrix, transformMatrix, (0.0 * Math.PI) / 180.0);
        grass_Transform_matrix.push(transformMatrix);
    }

    var canvas_Transform_matrix = [];
    for (var i = 0; i < MainHouse_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(canvas_position[i][0], canvas_position[i][1], canvas_position[i][2]));
        canvas_Transform_matrix.push(transformMatrix);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // Main House
    /////////////////////////////////////////////////////////////////////////////////////////////
    var MainHouse_Transform_matrix = [];
    for (var i = 0; i < MainHouse_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(MainHouse_position[i][0], MainHouse_position[i][1], MainHouse_position[i][2]));
        MainHouse_Transform_matrix.push(transformMatrix);
    }

    var Kitchen_Transform_matrix = [];
    for (var i = 0; i < Kitchen_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(Kitchen_Position[i][0], Kitchen_Position[i][1], Kitchen_Position[i][2]));
        Kitchen_Transform_matrix.push(transformMatrix);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Characters_Couples
    /////////////////////////////////////////////////////////////////////////////////////////////
    var LivingRoom_PianoSceneCoupleModel_Transform_matrix = [];
    for (var i = 0; i < LivingRoom_PianoSceneCoupleModel_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(LivingRoom_PianoSceneCoupleModel_Position[i][0], LivingRoom_PianoSceneCoupleModel_Position[i][1], LivingRoom_PianoSceneCoupleModel_Position[i][2]));
        LivingRoom_PianoSceneCoupleModel_Transform_matrix.push(transformMatrix);
    }

    var LivingRoom_DrinkingScene_ManModels_Transform_matrix = [];
    for (var i = 0; i < LivingRoom_DrinkingScene_ManModels_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(LivingRoom_DrinkingScene_ManModels_Position[i][0], LivingRoom_DrinkingScene_ManModels_Position[i][1], LivingRoom_DrinkingScene_ManModels_Position[i][2]));
        LivingRoom_DrinkingScene_ManModels_Transform_matrix.push(transformMatrix);
    }

    var LivingRoom_DrinkingScene_WomenModels_Transform_matrix = [];
    for (var i = 0; i < LivingRoom_DrinkingScene_WomenModels_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(LivingRoom_DrinkingScene_WomenModels_Position[i][0], LivingRoom_DrinkingScene_WomenModels_Position[i][1], LivingRoom_DrinkingScene_WomenModels_Position[i][2]));
        LivingRoom_DrinkingScene_WomenModels_Transform_matrix.push(transformMatrix);
    }

    var KitchenWomen_Transform_matrix = [];
    for (var i = 0; i < KitchenWomen_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(KitchenWomen_Position[i][0], KitchenWomen_Position[i][1], KitchenWomen_Position[i][2]));
        KitchenWomen_Transform_matrix.push(transformMatrix);
    }

    var Outside_EveningScene_CoupleModel_Transform_matrix = [];
    for (var i = 0; i < Outside_EveningScene_CoupleModel_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(Outside_EveningScene_CoupleModel_Position[i][0], Outside_EveningScene_CoupleModel_Position[i][1], Outside_EveningScene_CoupleModel_Position[i][2]));
        Outside_EveningScene_CoupleModel_Transform_matrix.push(transformMatrix);
    }

    var OutsideEveningManSitting_Transform_matrix = [];
    for (var i = 0; i < OutsideEveningManSitting_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(OutsideEveningManSitting_Position[i][0], OutsideEveningManSitting_Position[i][1], OutsideEveningManSitting_Position[i][2]));
        OutsideEveningManSitting_Transform_matrix.push(transformMatrix);
    }

    var ManSittingUnderGulmohar_Transform_matrix = [];
    for (var i = 0; i < ManSittingUnderGulmohar_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(ManSittingUnderGulmohar_position[i][0], ManSittingUnderGulmohar_position[i][1], ManSittingUnderGulmohar_position[i][2]));
        // mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(9.25, 9.25, 9.25));
        // mat4.rotateX(transformMatrix, transformMatrix, (270.0 * Math.PI) / 180.0);
        ManSittingUnderGulmohar_Transform_matrix.push(transformMatrix);
    }

    var CoupleOnBridge_Transform_matrix = [];
    for (var i = 0; i < CoupleOnBridge_postion.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(CoupleOnBridge_postion[i][0], CoupleOnBridge_postion[i][1], CoupleOnBridge_postion[i][2]));
        CoupleOnBridge_Transform_matrix.push(transformMatrix);
    }

    var ManReflectionInFBO_Transform_matrix = [];
    for (var i = 0; i < ManReflectionInFBO_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(ManReflectionInFBO_position[i][0], ManReflectionInFBO_position[i][1], ManReflectionInFBO_position[i][2]));
        ManReflectionInFBO_Transform_matrix.push(transformMatrix);
    }


    // 1
    var House_One_Transform_matrix = [];
    var zRotateAngle = 0.0;
    for (var i = 0; i < House_One_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(House_One_Position[i][0], House_One_Position[i][1], House_One_Position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(2.0, 2.0, 2.0));
        mat4.rotateY(transformMatrix, transformMatrix, (90.0 * Math.PI) / 180.0);
        House_One_Transform_matrix.push(transformMatrix);

    }

    var SpotlightScene_Transform_matrix = [];
    for (var i = 0; i < SpotlightScene_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(SpotlightScene_Position[i][0], SpotlightScene_Position[i][1], SpotlightScene_Position[i][2]));
        SpotlightScene_Transform_matrix.push(transformMatrix);
    }

    // 5
    var House_Five_Transform_matrix = [];
    zRotateAngle = 0.0;
    for (var i = 0; i < House_Five_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(House_Five_Position[i][0], House_Five_Position[i][1], House_Five_Position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(2.0, 2.0, 2.0));
        mat4.rotateY(transformMatrix, transformMatrix, (90.0 * Math.PI) / 180.0);
        House_Five_Transform_matrix.push(transformMatrix);
    }

    // 6
    var House_Six_Transform_matrix = [];
    zRotateAngle = 0.0;
    for (var i = 0; i < House_Six_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(House_Six_Position[i][0], House_Six_Position[i][1], House_Six_Position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(0.02, 0.02, 0.02));
        mat4.rotateY(transformMatrix, transformMatrix, (90.0 * Math.PI) / 180.0);
        House_Six_Transform_matrix.push(transformMatrix);
    }

    // 7
    var Old_hut_Transform_matrix = [];
    zRotateAngle = 0.0;
    for (var i = 0; i < Old_hut_Position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(Old_hut_Position[i][0], Old_hut_Position[i][1], Old_hut_Position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(0.01, 0.01, 0.01));
        mat4.rotateX(transformMatrix, transformMatrix, (270.0 * Math.PI) / 180.0);
        Old_hut_Transform_matrix.push(transformMatrix);
    }

    var wooden_bridge_Transform_matrix = [];
    for (var i = 0; i < wooden_bridge_postion.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(wooden_bridge_postion[i][0], wooden_bridge_postion[i][1], wooden_bridge_postion[i][2]));
        // mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(palm_tree_position[i][0]+objX, palm_tree_position[i][1]+objY, palm_tree_position[i][2]+objZ));
        // mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(6.25, 6.25, 6.25));
        // mat4.rotateX(transformMatrix, transformMatrix, (270.0 * Math.PI) / 180.0);
        //yRotateAngle = yRotateAngle + 45.0;
        // if (yRotateAngle >= 360.0)
        // {
        //     yRotateAngle = 0.0;
        // }
        wooden_bridge_Transform_matrix.push(transformMatrix);
    }

    var bedroom_Transform_matrix = [];
    for (var i = 0; i < bedroom_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(bedroom_position[i][0], bedroom_position[i][1], bedroom_position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(18.0, 18.0, 18.0));
        bedroom_Transform_matrix.push(transformMatrix);
    }

    var nightTree_Transform_matrix = [];
    for (var i = 0; i < nightTree_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(nightTree_position[i][0], nightTree_position[i][1], nightTree_position[i][2]));
        nightTree_Transform_matrix.push(transformMatrix);
    }

    var atticModel_Transform_matrix = [];
    for (var i = 0; i < atticModel_position.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(atticModel_position[i][0], atticModel_position[i][1], atticModel_position[i][2]));
        mat4.scale(transformMatrix, transformMatrix, vec3.fromValues(18.0, 18.0, 18.0));
        atticModel_Transform_matrix.push(transformMatrix);
    }

    var lotus_Transform_matrix = [];

    for (var i = 0; i < Lotus_Postion.length; i++) {
        var transformMatrix = mat4.create();
        mat4.translate(transformMatrix, transformMatrix, vec3.fromValues(Lotus_Postion[i][0], Lotus_Postion[i][1], Lotus_Postion[i][2]));
        lotus_Transform_matrix.push(transformMatrix);
    }

    await Promise.all([
        terrain.Initialize(config),

        palm_tree_model.loadModel("palm_tree", palm_tree_Transform_matrix),
        mango_tree.loadModel("mango_tree", mango_tree_Transform_matrix),
        tree.loadModel("tree", tree_Transform_matrix),
        orangeTree_model.loadModel("orange_tree", orange_tree_Transform_matrix),
        gulmohorTree_model.loadModel("gulmohor_tree", gulmohor_tree_Transform_matrix),
        panKanis_model.loadModel("panKanis", panKanis_Transform_matrix),
        dongarTree_model.loadModel("dongar_tree", dongarTree_Transform_matrix),

        chapha_tree.loadModel("chapha_tree", chapha_tree_Transform_matrix),
        stones.loadModel("stones", stones_Transform_matrix),

        projectName.loadModel("projectName", projectN_Transform_matrix),

        base.loadModel("base"),
        bird.loadModel("animated_WhiteBird"),
        bush.loadModel("bush", bush_Transform_matrix),
        grass.loadModel("grass", grass_Transform_matrix),
        canvas_model.loadModel("canvas", canvas_Transform_matrix),

        MainHouse.loadModel("MainHouse", MainHouse_Transform_matrix),
        Kitchen.loadModel("Kitchen", Kitchen_Transform_matrix),

        LivingRoom_PianoSceneCoupleModel.loadModel("LivingRoom_PianoSceneCoupleModel", LivingRoom_PianoSceneCoupleModel_Transform_matrix),

        LivingRoom_DrinkingScene_ManModels.loadModel("LivingRoom_DrinkingScene_ManModels", LivingRoom_DrinkingScene_ManModels_Transform_matrix),
        LivingRoom_DrinkingScene_WomenModels.loadModel("LivingRoom_DrinkingScene_WomenModels", LivingRoom_DrinkingScene_WomenModels_Transform_matrix),

        KitchenWomen.loadModel("KitchenScene_WomenModel", KitchenWomen_Transform_matrix),

        Outside_EveningScene_CoupleModel.loadModel("Outside_EveningScene_CoupleModel", Outside_EveningScene_CoupleModel_Transform_matrix),

        OutsideEveningManSitting.loadModel("OutsideEvening_ManSittingModel", OutsideEveningManSitting_Transform_matrix),

        ManSittingUnderGulmohar.loadModel("ManSittingUnderGulmohar", ManSittingUnderGulmohar_Transform_matrix),

        CoupleOnBridge.loadModel("BridgeScene_CoupleModel", CoupleOnBridge_Transform_matrix),

        ManReflectionOnFBO.loadModel("ManReflectionOnFBO", ManReflectionInFBO_Transform_matrix),

        SpotlightScene.loadModel("SpotlightScene", SpotlightScene_Transform_matrix),

        // House_One.loadModel("House_One", House_One_Transform_matrix),
        // House_Five.loadModel("House_Five", House_Five_Transform_matrix),
        House_Six.loadModel("House_Six", House_Six_Transform_matrix),
        Old_hut.loadModel("Old_hut", Old_hut_Transform_matrix),

        wooden_bridge.loadModel("wooden_bridge", wooden_bridge_Transform_matrix),
        bedroom.loadModel("bedroom", bedroom_Transform_matrix),
        nightTree.loadModel("nightTree", nightTree_Transform_matrix),
        atticModel.loadModel("Attic", atticModel_Transform_matrix),
        lotus_model.loadModel("Lotus", lotus_Transform_matrix),

        cubeMaptextureNight = TextureManger.LoadCubeMap(skymapFacesInfo),
    ]);

    sphere = new Mesh();
    makeSphere(sphere, 2.0, 30, 30);

    // Jugnu
    for (var i = 0; i < maxParticles * 3; i += 3) {
        particlePositions[i] = Math.random() * 2 + 1; // Random x coordinate between -1 and 1
        particlePositions[i + 1] = -1.0;               // Fixed Y position at 1.0
        particlePositions[i + 2] = Math.random() * 2 + 1; // Random z coordinate between -1 and 1
    }
    //initialize ParticleVelocities
    for (var i = 0; i < maxParticles * 3; i++) {
        particleVelocities[i] = Math.random() * 2; // Random velocity between -1 and 1
    }

}

var reflectionPass = false;

function displayWorld(camera, deltaTime) {

    commonShaderProgram.setPointLightData(pointLightPositions, pointLightColors);

    if (bNightScene === true) {
        if (bReflectionEnable) {
            water.bindReflectionFBO(camera);
            {
                reflectionPass = true;
                if (bNightScene === true) {


                }

            }
            water.unbindReflectionFBO(camera);
        }
    }
    else {
        // else will render reflection when day scene
        if (bReflectionEnable) {
            water.bindReflectionFBO(camera);
            {
                reflectionPass = true;

                // Render terrain
                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
                terrainShader.bind(camera, modelMatrix, deltaTime, true);
                if (terrain)
                    terrain.RenderBuffers();
                terrainShader.unbind();

                // Render models for reflection
                displayModelsOnDayFBOScene(camera, deltaTime);
            }
            water.unbindReflectionFBO(camera);
            reflectionPass = false;
        }
    }

    if (bRefractionEnable) {
        water.bindRefractionFBO();
        {
            var bTemp; // TEMP FOR STORE ENABLE FOG VAL
            bTemp = configs.enable_fog;
            configs.enable_fog = false;

            if (bNightScene == true) {
                // Night Scene    
            }
            else {
                // Day Scene

                modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
                terrainShader.bind(camera, modelMatrix, deltaTime, true);
                if (terrain)
                    terrain.RenderBuffers();
                terrainShader.unbind();

            }
            configs.enable_fog = bTemp;
        }
        water.unbindRefractionFBO();
    }

    if (configs.EnablePostProcessing === true) {
        sceneFBO.bind();
    }

    // **SUNSET TRANSITION**
    if (bSunsetEnable && sunsetTransitionStartTime !== null) {
        let elapsedSunset = (new Date().getTime() - sunsetTransitionStartTime) / 1000.0;
        updateSunsetTransition(elapsedSunset, sunsetTransitionDuration);
    }

    // Previous Sunset Restoration 
    if (bRestoreSunset) {
        restoreSunsetDefaults();
        bRestoreSunset = false;  // Reset flag immediately
    }

    // Jugnu only for night scene
    if (bFireflyEnable && bNightScene === true) {
        let spawnCenter, boxWidth, boxHeight, boxDepth, numParticles;

        if (bNightLivingRoom) {
            spawnCenter = vec3.fromValues(246.51368713378906, 23.229198455810547, -155.09759521484375);
            boxWidth = 150.0;
            boxHeight = 100.0;
            boxDepth = 80.0;
            numParticles = 250;
        }
        else if (bKitchenScene) {
            spawnCenter = vec3.fromValues(1.557986259460449, 21.305757522583008, -332.0133972167969);
            boxWidth = 100.0;
            boxHeight = 100.0;
            boxDepth = 100.0;
            numParticles = 200;
        }
        else if (bAtticScene) {
            spawnCenter = vec3.fromValues(148.55010986328125, 2.229407787322998, 40.520423889160156);
            boxWidth = 150.0;
            boxHeight = 150.0;
            boxDepth = 150.0;
            numParticles = 300;
        }
        else if (bBedroomScene) {
            spawnCenter = vec3.fromValues(71.92499542236328, 75.88397979736328, -146.78663635253906);
            boxWidth = 150.0;
            boxHeight = 150.0;
            boxDepth = 150.0;
            numParticles = 300;
        }

        // Update configuration
        fireflySystem.updateConfiguration(numParticles, spawnCenter, boxWidth, boxHeight, boxDepth);

        // Update and render
        fireflySystem.update(deltaTime);
        fireflySystem.render(camera, camera.getViewMatrix(), perspectiveProjectionMatrix);
    }


    // WATER QUAD
    // camera.invertPitch();
    // modelMatrix = mat4.create();
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-250.0, 2.0, -215.0));
    // water.Render(camera, camera.getViewMatrix());
    //waterDisp.Render(camera.getViewMatrix());

    if (bNightScene == true) {
        // Night Scene

        if (bNightLivingRoom === true) {
            loadLivingRoomMemoriesScene(camera, deltaTime);
        } else if (bKitchenScene === true) {
            loadKitchenScene(camera, deltaTime);
        } else if (bBedroomScene === true) {
            loadBedroomScene(camera, deltaTime);
        } else if (bAtticScene === true) {
            loadAtticScene(camera, deltaTime);
        } else if (bSpotlightScene === true) {
            modelMatrix = mat4.create();
            commonShaderProgram.render(SpotlightScene, camera, modelMatrix, deltaTime);
        } else {
            // // TERRAIN
            // modelMatrix = mat4.create();
            // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
            // terrainShader.bind(camera, modelMatrix, deltaTime, true);
            // if (terrain)
            //     terrain.RenderBuffers();
            // terrainShader.unbind();


        }



    }
    else {
        // TERRAIN
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
        terrainShader.bind(camera, modelMatrix, deltaTime, true);
        if (terrain)
            terrain.RenderBuffers();
        terrainShader.unbind();

    }

    // modelMatrix = mat4.create();
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    // modelShaderProgramObject.Render(objModel, camera, modelMatrix);

    // MODELS
    modelMatrix = mat4.create();
    displayModels(camera, deltaTime);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    commonShaderProgram.render(assimpModel, camera, modelMatrix, deltaTime);

    if (bNightScene === true) {

    }
    else {
        // WATER QUAD (render AFTER restoring camera in day scene)
        modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-250.0, 2.0, -215.0));
        water.Render(camera, camera.getViewMatrix());
    }

    if (configs.bDisplayglobalBSplineCamera && globalBSplineCamera) {
        modelMatrix = mat4.create();
        globalBSplineCamera.displayCurve(camera, modelMatrix)
    }

    if (configs.EnablePostProcessing === true) {
        sceneFBO.unbind();
    }

    if (configs.EnablePostProcessing === false) {
        // CUBE MAP
        if (bNightScene === false) {
            // modelMatrix = mat4.create();
            // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 3.0, 0.0));
            // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1000.0, 1000.0, 1000.0));
            // cubeMapShaderProgram.render(camera, modelMatrix, cubeMaptextureDay);
        }
        else {
            modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 3.0 + 240.0 + 107 + objY, 0.0));
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1000.0, 1000.0, 1000.0));
            mat4.rotateY(modelMatrix, modelMatrix, degToRad(138.0));
            cubeMapShaderProgram.render(camera, modelMatrix, cubeMaptextureNight);
        }
    }
    //displayTestModels(camera, deltaTime);
    // camera.invertPitch();

    // if (configs.EnablePostProcessing === true && configs.enable_bloom === true) {
    //     bloomShader.bindBloomScene();
    //     {
    //         if (bNightScene === true) {
    //             modelMatrix = mat4.create();
    //             flowField.renderJuganu(camera, vec3.fromValues(179.39999999999986, 0.0, 97.29999999999997));

    //         }

    //         // TESTING BLOOM
    //         modelMatrix = mat4.create();
    //         mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(objX, objY, objZ));
    //         modelShaderProgramObject.Render(objModel, camera, modelMatrix);
    //     }
    //     bloomShader.unbindBloomScene();

    //     bloomShader.bindCompleteScene();
    //     {
    //         if (bNightScene === true) {
    //             modelMatrix = mat4.create();
    //             flowField.renderJuganu(camera, vec3.fromValues(179.39999999999986, 0.0, 97.29999999999997));

    //         }

    //         // TESTING BLOOM
    //         modelMatrix = mat4.create();
    //         mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(objX, objY, objZ));
    //         modelShaderProgramObject.Render(objModel, camera, modelMatrix);
    //     }
    //     bloomShader.unbindBloomScene();

    //     bloomShader.render();

    // bloomShader.renderFinalQuad();
    // }
}

function displayTestModels(camera, deltaTime) {

    // MODEL
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    mat4.rotateX(modelMatrix, modelMatrix, rotationX);
    mat4.rotateY(modelMatrix, modelMatrix, rotationY);
    mat4.rotateZ(modelMatrix, modelMatrix, rotationZ);
    modelShaderProgramObject.Render(objModel, camera, modelMatrix, true);

    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    commonShaderProgram.render(assimpModel, camera, modelMatrix, deltaTime);

}

// USE FOR MODEL PLACEMENT
function displayModels(camera, deltaTime, isUp) {

    if (bNightScene === false) {
        displayModelsOnDAYTerrain(camera, deltaTime);
        modelMatrix = mat4.create();
        // if (flowField)
        //     flowField.render(camera, vec3.fromValues(538.3999999999999, 0.0, -681.6999999999987));

    }
    else {
        displayModelsOnNIGHTTerrain(camera, deltaTime, isUp);

        modelMatrix = mat4.create();
        // if (flowField)
        //      flowField.renderJuganu(camera, vec3.fromValues(179.39999999999986 + 196.79999999999987, 0.0 + -8.200000000000003, 97.29999999999997 + 176.299999999999));
    }



}

var bird_animated_position = -340.0;

function displayModelsOnDAYTerrain(camera, deltaTime) {


    // modelMatrix = mat4.create();
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(501.8000000000017 + objX, 5 + objY, 1449.49999999999 + objZ));
    // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(65 + scaleZ, 65 + scaleZ, 65 + scaleZ));
    // colorCubeShader.bind(camera, modelMatrix, vec3.fromValues(1.0, 1.0, 1.0));
    // sphere.draw();
    // colorCubeShader.unbind();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    // modelMatrix = mat4.create();
    // commonShaderProgram.render(palm_tree_model, camera, modelMatrix, deltaTime);


    // //// Dynamic Model Loading Example //////////////////
    // if (bird_animated_position < 360.0)
    //     bird_animated_position = bird_animated_position + (0.12);
    // else
    //     bird_animated_position = 0.0;

    // modelMatrix = mat4.create();
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-320.0, 200.0, -360.0));
    // mat4.rotateY(modelMatrix, modelMatrix, ((309) * Math.PI) / 180.0);
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 0.0, bird_animated_position));
    // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(3.0, 3.0, 3.0));

    // bird.updateModelWithConstraint(0, 0.05);
    // commonShaderProgram.render(bird, camera, modelMatrix, deltaTime);

    // modelMatrix = mat4.create();
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-300.0, 190.0, -350.0));
    // mat4.rotateY(modelMatrix, modelMatrix, ((309) * Math.PI) / 180.0);
    // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, 0.0, bird_animated_position));
    // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(2.9, 2.9, 2.9));

    // bird.updateModelWithConstraint(0, 0.05);
    // commonShaderProgram.render(bird, camera, modelMatrix, deltaTime);

    // ///////////////////////////////////////////////////////
    modelMatrix = mat4.create();
    commonShaderProgram.render(palm_tree_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(mango_tree, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(tree, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(orangeTree_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(gulmohorTree_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(panKanis_model, camera, modelMatrix, deltaTime);
 
    modelMatrix = mat4.create();
    commonShaderProgram.render(dongarTree_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(chapha_tree, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(stones, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(canvas_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(MainHouse, camera, modelMatrix, deltaTime);

    // 6
    modelMatrix = mat4.create();
    commonShaderProgram.render(House_Six, camera, modelMatrix, deltaTime);

    // 7
    modelMatrix = mat4.create();
    commonShaderProgram.render(Old_hut, camera, modelMatrix, deltaTime);


    if (bEveningCoupleSitting === true) {

        if (bProjectTitle == true) {
            modelMatrix = mat4.create();

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            commonShaderProgram.alpha = projectNameAlpha;
            commonShaderProgram.render(projectName, camera, modelMatrix, deltaTime);
            commonShaderProgram.alpha = 1.0;

            gl.disable(gl.BLEND);
        }

        if (bManSingleSitting == true) {
            modelMatrix = mat4.create();
            commonShaderProgram.render(OutsideEveningManSitting, camera, modelMatrix, deltaTime);
        }
        else {
            modelMatrix = mat4.create();
            commonShaderProgram.render(Outside_EveningScene_CoupleModel, camera, modelMatrix, deltaTime);
        }
    }

    if (bCoupleOnBridgeScene === true) {
        modelMatrix = mat4.create();
        commonShaderProgram.render(CoupleOnBridge, camera, modelMatrix, deltaTime);
    }

    if (bManSittingUnderGulmohar === true) {
        modelMatrix = mat4.create();
        commonShaderProgram.render(ManSittingUnderGulmohar, camera, modelMatrix, deltaTime);
    }

    modelMatrix = mat4.create();
    commonShaderProgram.render(lotus_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(grass, camera, modelMatrix, deltaTime);

    // 
    modelMatrix = mat4.create();
    commonShaderProgram.render(wooden_bridge, camera, modelMatrix, deltaTime);



    // modelMatrix = mat4.create();
    // commonShaderProgram.render(Couple_Woman, camera, modelMatrix, deltaTime, undefined, undefined, woman_bEnableDissolvePass, woman_uProgress);

    // // 1
    // modelMatrix = mat4.create();
    // commonShaderProgram.render(House_One, camera, modelMatrix, deltaTime);

    // // 5
    // modelMatrix = mat4.create();
    // commonShaderProgram.render(House_Five, camera, modelMatrix, deltaTime);

    var bSplineData;

    modelMatrix = mat4.create();

    
        if (commonShaderProgram.isGodRaysPass === false) {

            modelMatrix = mat4.create();
            commonShaderProgram.render(bush, camera, modelMatrix, deltaTime);

            // modelMatrix = mat4.create();
            // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(688.6499999999971, 0.30000000000000326, -602.6999999999987))
            // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.0, 0.5, 1.0));
            // grassShaderProgramObject.render(camera, modelMatrix);

            // if(bGrassRendering === true) {
            // modelMatrix = mat4.create();
            // // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(510.29999999999166, 0.30000000000000326, -379.3999999999969))
            // //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(161.0103759765625,5.606058120727539,-275.36199951171875))
            // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(180.0, 4.7, -350.0));
            // grassShaderProgramObject.render(camera, modelMatrix);
            // }

            gl.disable(gl.BLEND);
        }
    

}

function displayModelsOnDayFBOScene(camera, deltaTime) {

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    modelMatrix = mat4.create();
    commonShaderProgram.render(palm_tree_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(tree, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(panKanis_model, camera, modelMatrix, deltaTime);

    modelMatrix = mat4.create();
    commonShaderProgram.render(dongarTree_model, camera, modelMatrix, deltaTime);


    if (bEveningCoupleSitting === true) {

        if (bProjectTitle == true) {
            modelMatrix = mat4.create();

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            commonShaderProgram.alpha = projectNameAlpha;
            commonShaderProgram.render(projectName, camera, modelMatrix, deltaTime);
            commonShaderProgram.alpha = 1.0;

            gl.disable(gl.BLEND);

            modelMatrix = mat4.create();
            commonShaderProgram.render(OutsideEveningManSitting, camera, modelMatrix, deltaTime);
        }
        else {
            modelMatrix = mat4.create();
            commonShaderProgram.render(Outside_EveningScene_CoupleModel, camera, modelMatrix, deltaTime);
        }
    }

    if (bCoupleOnBridgeScene === true) {
        modelMatrix = mat4.create();
        commonShaderProgram.render(ManReflectionOnFBO, camera, modelMatrix, deltaTime);
    }

    modelMatrix = mat4.create();
    commonShaderProgram.render(lotus_model, camera, modelMatrix, deltaTime);

 
    modelMatrix = mat4.create();
    commonShaderProgram.render(wooden_bridge, camera, modelMatrix, deltaTime);

}

function displayModelsOnNIGHTTerrain(camera, deltaTime, isUp) {

    // HIDING FBO IN NIGHT SCENE
    // if (reflectionPass === false) {
    //     modelMatrix = mat4.create();
    //     mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(496.80000000000143, 19.69999999999999, 519.6000000000016));
    //     mat4.rotateY(modelMatrix, modelMatrix, (0.0 * Math.PI) / 180.0);
    //     commonShaderProgram.render(base, camera, modelMatrix, deltaTime, isUp);
    // }

}

var godRaysLightPos;

function calculateLightScreenSpace(lightPosition, modelMatrix, viewMatrix, projectionMatrix) {

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    const modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    const depthRange = gl.getParameter(gl.DEPTH_RANGE);

    const lightPosVec = vec4.fromValues(lightPosition[0], lightPosition[1], lightPosition[2], 1.0);
    const transformedLightPos = vec4.create();
    vec4.transformMat4(transformedLightPos, lightPosVec, modelViewProjectionMatrix);

    const rhw = 1 / transformedLightPos[3];
    const ndcX = transformedLightPos[0] * rhw;
    const ndcY = transformedLightPos[1] * rhw;
    const ndcZ = transformedLightPos[2] * rhw;

    const x = (ndcX * 0.5 + 0.5);
    const y = (ndcY * 0.5 + 0.5);
    const z = ndcZ * (depthRange[1] - depthRange[0]) + depthRange[0];

    return [x, y, z];
}


function displayGodRaysPass(camera, deltaTime) {

    // Draw Sphere with White Color at Light Position
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Draw Models Which we need to Scatter in black

    const sunPosition = vec3.fromValues(
        configs.sun_position_x,
        configs.sun_position_y,
        configs.sun_position_z
    );

    // gl.disable(gl.DEPTH_TEST);
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, sunPosition);
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(configs.sun_size, configs.sun_size, configs.sun_size));
    colorCubeShader.bind(camera, modelMatrix, vec3.fromValues(configs.sun_color[0] / 255.0, configs.sun_color[1] / 255.0, configs.sun_color[2] / 255.0));
    sphere.draw();
    colorCubeShader.unbind();
    // gl.enable(gl.DEPTH_TEST);

    modelMatrix = mat4.create();
    godRaysLightPos = calculateLightScreenSpace(new Float32Array([-1644, 137, -203]), modelMatrix, camera.getViewMatrix(), perspectiveProjectionMatrix);


    commonShaderProgram.isGodRaysPass = true;

    // TERRAIN
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    terrainShader.bGodRaysPass = 1;
    terrainShader.bind(camera, modelMatrix, deltaTime);
    if (terrain)
        terrain.RenderBuffers();
    terrainShader.unbind();
    terrainShader.bGodRaysPass = 0;

    displayModelsOnDAYTerrain(camera, 0.0);

    gl.disable(gl.BLEND);

    // WATER QUAD
    water.bGodRaysPass = 1;
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-512.0, 5.0, -512.0));
    water.Render(camera, camera.getViewMatrix());
    water.bGodRaysPass = 0;

    commonShaderProgram.isGodRaysPass = false;
}

// function to handle sunset transitions
function updateSunsetTransition(elapsed, totalDuration) {
    if (!bSunsetEnable)
        return;

    // Transition progress 0.0 to 1.0
    let transitionProgress = Math.min(elapsed / totalDuration, 1.0);

    // Starting sunset colors (current values)
    const startTopColor = [255.0, 160.0, 100.0];
    const startBottomColor = [135.0, 155.0, 180.0];
    const startSunColor = [237, 79, 45];
    const startSunPosY = 160;
    const startSunSize = 30;
    const startGodraysExposure = 0.4;
    const startGodraysDensity = 2.5;
    const startGodraysWeight = 0.19;

    // Sun reflection parameters - starting
    const startSunDiskSize = 50;
    const startSunIntensity = 0.5;
    const startSunColorRefl = [255.0, 187.0, 102.0];

    // Ending deep sunset/evening colors
    const endTopColor = [180.0, 80.0, 40.0];       // Darker orange-red
    const endBottomColor = [80.0, 90.0, 120.0];    // Darker blue
    const endSunColor = [200, 50, 20];              // Deeper red-orange
    const endSunPosY = 20;                          // Sun lower in sky
    const endSunSize = 50;                          // Larger sun
    const endGodraysExposure = 0.25;             // Dimmer god rays
    const endGodraysDensity = 1.8;                 // Less dense rays
    const endGodraysWeight = 0.12;                 // Reduced weight

    // Sun reflection
    const endSunDiskSize = 70;                     // Larger disk reflection
    const endSunIntensity = 0.7;                   // More intense reflection
    const endSunColorRefl = [255.0, 120.0, 50.0];  // Warmer orange-red

    // Interpolate sky colors
    configs.skydomeColorTop[0] = startTopColor[0] + (endTopColor[0] - startTopColor[0]) * transitionProgress;
    configs.skydomeColorTop[1] = startTopColor[1] + (endTopColor[1] - startTopColor[1]) * transitionProgress;
    configs.skydomeColorTop[2] = startTopColor[2] + (endTopColor[2] - startTopColor[2]) * transitionProgress;

    configs.skydomeColorBottom[0] = startBottomColor[0] + (endBottomColor[0] - startBottomColor[0]) * transitionProgress;
    configs.skydomeColorBottom[1] = startBottomColor[1] + (endBottomColor[1] - startBottomColor[1]) * transitionProgress;
    configs.skydomeColorBottom[2] = startBottomColor[2] + (endBottomColor[2] - startBottomColor[2]) * transitionProgress;

    // Interpolate sun parameters
    configs.sun_color[0] = startSunColor[0] + (endSunColor[0] - startSunColor[0]) * transitionProgress;
    configs.sun_color[1] = startSunColor[1] + (endSunColor[1] - startSunColor[1]) * transitionProgress;
    configs.sun_color[2] = startSunColor[2] + (endSunColor[2] - startSunColor[2]) * transitionProgress;

    configs.sun_position_y = startSunPosY + (endSunPosY - startSunPosY) * transitionProgress;
    configs.sun_size = startSunSize + (endSunSize - startSunSize) * transitionProgress;

    // Interpolate god rays
    configs.godrays_exposure = startGodraysExposure + (endGodraysExposure - startGodraysExposure) * transitionProgress;
    configs.godrays_density = startGodraysDensity + (endGodraysDensity - startGodraysDensity) * transitionProgress;
    configs.godrays_weight = startGodraysWeight + (endGodraysWeight - startGodraysWeight) * transitionProgress;

    // Interpolate sun reflection parameters for water
    configs.sun_disk_size = startSunDiskSize + (endSunDiskSize - startSunDiskSize) * transitionProgress;
    configs.sun_intensity = startSunIntensity + (endSunIntensity - startSunIntensity) * transitionProgress;
    configs.sun_color_refl[0] = startSunColorRefl[0] + (endSunColorRefl[0] - startSunColorRefl[0]) * transitionProgress;
    configs.sun_color_refl[1] = startSunColorRefl[1] + (endSunColorRefl[1] - startSunColorRefl[1]) * transitionProgress;
    configs.sun_color_refl[2] = startSunColorRefl[2] + (endSunColorRefl[2] - startSunColorRefl[2]) * transitionProgress;
}

// **Function to restore original sunset values**
function restoreSunsetDefaults() {
    // Restore sky colors
    configs.skydomeColorTop[0] = originalSunsetValues.skydomeColorTop[0];
    configs.skydomeColorTop[1] = originalSunsetValues.skydomeColorTop[1];
    configs.skydomeColorTop[2] = originalSunsetValues.skydomeColorTop[2];

    configs.skydomeColorBottom[0] = originalSunsetValues.skydomeColorBottom[0];
    configs.skydomeColorBottom[1] = originalSunsetValues.skydomeColorBottom[1];
    configs.skydomeColorBottom[2] = originalSunsetValues.skydomeColorBottom[2];

    // Restore sun parameters
    configs.sun_color[0] = originalSunsetValues.sun_color[0];
    configs.sun_color[1] = originalSunsetValues.sun_color[1];
    configs.sun_color[2] = originalSunsetValues.sun_color[2];

    configs.sun_position_y = originalSunsetValues.sun_position_y;
    configs.sun_size = originalSunsetValues.sun_size;

    // Restore god rays
    configs.godrays_exposure = originalSunsetValues.godrays_exposure;
    configs.godrays_density = originalSunsetValues.godrays_density;
    configs.godrays_weight = originalSunsetValues.godrays_weight;

    // Restore sun reflection parameters
    configs.sun_disk_size = originalSunsetValues.sun_disk_size;
    configs.sun_intensity = originalSunsetValues.sun_intensity;
    configs.sun_color_refl[0] = originalSunsetValues.sun_color_refl[0];
    configs.sun_color_refl[1] = originalSunsetValues.sun_color_refl[1];
    configs.sun_color_refl[2] = originalSunsetValues.sun_color_refl[2];
}

function uninitializeWorld() {
    // dispose(terrain1);
    terrain1 = null;

}

function loadLivingRoomMemoriesScene(camera, deltaTime) {
    modelMatrix = mat4.create();
    commonShaderProgram.render(MainHouse, camera, modelMatrix, deltaTime);

    chimniFire.renderFire(camera);

    if (bHusbandmodel === true) {
        modelMatrix = mat4.create();
        commonShaderProgram.render(LivingRoom_DrinkingScene_ManModels, camera, modelMatrix, deltaTime);

        modelMatrix = mat4.create();
        if (woman_bDraw === true)
            commonShaderProgram.render(LivingRoom_DrinkingScene_WomenModels, camera, modelMatrix, deltaTime, undefined, undefined, women_bEnableDissolvePass, women_fDissolveProgress);
    }

    if (bPianoCoupleModel === true) {
        modelMatrix = mat4.create();
        commonShaderProgram.render(LivingRoom_PianoSceneCoupleModel, camera, modelMatrix, deltaTime);
    }
}

function loadKitchenScene(camera, deltaTime) {
    modelMatrix = mat4.create();
    commonShaderProgram.render(Kitchen, camera, modelMatrix, deltaTime);
    modelMatrix = mat4.create();
    commonShaderProgram.render(KitchenWomen, camera, modelMatrix, deltaTime);
}

function loadBedroomScene(camera, deltaTime) {
    modelMatrix = mat4.create();
    commonShaderProgram.render(bedroom, camera, modelMatrix, deltaTime);

    // modelMatrix = mat4.create();
    // commonShaderProgram.render(nightTree, camera, modelMatrix, deltaTime);

    // Enable curtain wave effect
    if (!bCurtainWaveEnabled) {
        bCurtainWaveEnabled = true;
        bedroomCurtain.enableWave(true);
    }

    // Render curtain at bedroom window position
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(82.48434448242188, 79.65372009277344, -243.70651245117));
    mat4.rotateZ(modelMatrix, modelMatrix, degToRad(180.0));
    mat4.rotateY(modelMatrix, modelMatrix, degToRad(180.0));
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(1.2, 1.5, 1.0));
    bedroomCurtain.render(camera, curtainShader);
}

function loadAtticScene(camera, deltaTime) {
    modelMatrix = mat4.create();
    commonShaderProgram.render(atticModel, camera, modelMatrix, deltaTime);
}

