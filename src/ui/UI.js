let logData = '';
const audioButton = document.getElementById("audioBtn");
let bPlayAudio = false;

const themeLogo = document.getElementById('themeLogo');
const themeSwitch = document.getElementById('themeSwitch');

// Theme switch functionality
themeSwitch.addEventListener('change', function () {

    document.body.classList.toggle('dark-theme', this.checked);

    if (themeSwitch.checked) {
        themeLogo.src = "assets/textures/logo/logoLight.png";
    } else {
        themeLogo.src = "assets/textures/logo/logoDark.bmp";
    }
});

if (themeSwitch.checked) {
    themeLogo.src = "assets/textures/logo/logoLight.png";
} else {
    themeLogo.src = "assets/textures/logo/logoDark.bmp";
}

audioButton.addEventListener("click", () => {
    audioElement.muted = !audioElement.muted;

    if (audioElement.muted) {
        console.log("Audio muted");
    } else {
        console.log("Audio unmuted");
    }
});

async function Save() {

    // Check if the File System Access API is supported
    if ('showSaveFilePicker' in window) {
        try {
            const options = {
                suggestedName: 'log.txt',
                types: [{
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt'],
                    },
                }],
            };
            // create a new handle
            const newHandle = await window.showSaveFilePicker();

            // create a FileSystemWritableFileStream to write to
            const writableStream = await newHandle.createWritable();

            writableStream.write(logData);
            writableStream.close();
        } catch (error) {
            console.error('Error saving log:', error);
        }
    } else {
        alert('The File System Access API is not supported in this browser.');
    }
}

var configs = {
    message: 'Project Configs',

    // Clear Color

    // Water Config
    water_waveStrength: 0.03,
    water_shininess: 20.0,
    water_reflectivity: 0.6,
    water_tiling: 0.5,
    water_light_Color: [135, 135, 135],

    // Point Light Config
    point_light_enable: false,
    point_light_constant: 1.0,
    point_light_linear: 0.01,
    point_light_quadratic: 0.001,
    point_light_radius: 30.0,

    // FOG
    enable_fog: false,
    fog_dispFactor: 0.01,
    fog_fogFalloff: 4.0,
    fog_fogColor: [1.0 * 230.0, 1.0 * 230.0, 1.0 * 230.0],

    // Post Processing
    EnablePostProcessing: false,

    // Sky Dome
    // sky_dome_skyColorTop: [0.76 * 255.0, 0.76 * 255.0, 0.87 * 255.0],
    // sky_dome_skyColorBottom: [0.26 * 255.0, 0.47 * 255.0, 0.83 * 255.0],
    sky_dome_skyColorTop: [0, 3, 16, 255],
    sky_dome_skyColorBottom: [0, 78, 159, 255],

    sky_dome_lightDirection_0: 0.26 * 255.0,
    sky_dome_lightDirection_1: 0.47 * 255.0,
    sky_dome_lightDirection_2: 0.83 * 255.0,

    // Bloom Config
    enable_bloom: false,
    threshold_bloom: 0.1,
    spread_bloom: 7.0,
    mult_bloom: 1,
    exposure_bloom: 0.9,
    gamma_bloom: 1.8,

    // Godrays
    enable_GodRays: true,
    // godrays_exposure: 2.0,      // Increase brightness
    // godrays_decay: 0.96,        // Slower decay = longer rays
    // godrays_density: 8.0,       // More samples
    // godrays_weight: 0.1,        // Stronger contribution

    godrays_exposure: 0.4,
    godrays_decay: 0.98,
    godrays_density: 2.5,           // Shraddha: Version 1 = 0.0
    godrays_weight: 0.19,

    // NEW: Sun/Light Source Config
    sun_position_x: -1550,
    // sun_position_y: 120,
    sun_position_y: 160,
    sun_position_z: -200,
    sun_size: 30,
    sun_color: [237,79,45],  // Orange
    skydomeColorBottom:[135.0, 155.0, 180.0],
    skydomeColorTop:[255.0, 160.0, 100.0],

    // Sun reflection Variables 
    sun_disk_size: 50,
    sun_intensity: 0.2,
    sun_color_refl:[255.0, 187.0, 102.0],

    bDisplayglobalBSplineCamera: false,

    bEnableParticle: true,
    num_particles: 5000,
    particle_birth_rate: 0.5,
    min_ageParticle: 1.01,
    max_ageParticle: 1.15,
    min_thetaParticle: Math.PI / 2.0 - 0.4,
    max_thetaParticle: Math.PI / 2.0 + 0.4,
    min_speedParticle: 0.5,
    max_speedParticle: 1.0,
    x_gravityParticle: 0.0,
    y_gravityParticle: -0.8,

};
var gui = new dat.gui.GUI();

gui.remember(configs);

gui.add(configs, 'message');

// water
var folder1 = gui.addFolder('Water');
folder1.add(configs, 'water_waveStrength');
folder1.add(configs, 'water_shininess');
folder1.add(configs, 'water_reflectivity');
folder1.add(configs, 'water_tiling');
folder1.addColor(configs, 'water_light_Color');

// point lights
var folder2 = gui.addFolder('Point Lights');
folder2.add(configs, 'point_light_enable');
folder2.add(configs, 'point_light_constant');
folder2.add(configs, 'point_light_linear');
folder2.add(configs, 'point_light_quadratic');
folder2.add(configs, 'point_light_radius');

// fog
var folder3 = gui.addFolder('Fog');
folder3.add(configs, 'enable_fog');
folder3.add(configs, 'fog_dispFactor');
folder3.add(configs, 'fog_fogFalloff');
folder3.addColor(configs, 'fog_fogColor');

gui.add(configs, 'EnablePostProcessing');
gui.add(configs, 'bDisplayglobalBSplineCamera');

// Sky Dome
var folfer4 = gui.addFolder('Sky Dome');
folfer4.addColor(configs, 'sky_dome_skyColorTop');
folfer4.addColor(configs, 'sky_dome_skyColorBottom');

var folder4_nested_folder = folfer4.addFolder('LightDirection');
folder4_nested_folder.add(configs, 'sky_dome_lightDirection_0');
folder4_nested_folder.add(configs, 'sky_dome_lightDirection_1');
folder4_nested_folder.add(configs, 'sky_dome_lightDirection_2');

// bloom
var folfer4 = gui.addFolder('Bloom');
folfer4.add(configs, 'enable_bloom');
folfer4.add(configs, 'threshold_bloom');
folfer4.add(configs, 'spread_bloom');
folfer4.add(configs, 'mult_bloom');
folfer4.add(configs, 'exposure_bloom');
folfer4.add(configs, 'gamma_bloom');

// God Rays folder
var folderGodRays = gui.addFolder('GodRays');
folderGodRays.add(configs, 'enable_GodRays');
folderGodRays.add(configs, 'godrays_exposure', 0, 5).step(0.1);
folderGodRays.add(configs, 'godrays_decay', 0.9, 1.0).step(0.001);
folderGodRays.add(configs, 'godrays_density', 0, 20).step(0.1);
folderGodRays.add(configs, 'godrays_weight', 0, 0.5).step(0.01);

// NEW: Sun Config folder
var folderSun = gui.addFolder('Sun/Light Source');
folderSun.add(configs, 'sun_position_x', -5000, 10000).step(1);
folderSun.add(configs, 'sun_position_y', -5000, 10000).step(1);
folderSun.add(configs, 'sun_position_z', -5000, 10000).step(1);
folderSun.add(configs, 'sun_size', 0, 100).step(1);
// folderSun.addColor(configs, 'sun_color');
// folderSun.addColor(configs, 'skydomeColorTop');
// folderSun.addColor(configs, 'skydomeColorBottom');

folderSun.add(configs, 'sun_disk_size', -20, 50).step(1);
folderSun.add(configs, 'sun_intensity', -5, 5).step(0.1);
folderSun.addColor(configs, 'sun_color_refl');

var folfer4 = gui.addFolder('Particle');
folfer4.add(configs, 'bEnableParticle');
folfer4.add(configs, 'num_particles');
folfer4.add(configs, 'min_ageParticle');
folfer4.add(configs, 'max_ageParticle');
folfer4.add(configs, 'particle_birth_rate');
folfer4.add(configs, 'min_ageParticle');
folfer4.add(configs, 'min_thetaParticle');
folfer4.add(configs, 'max_thetaParticle');
folfer4.add(configs, 'min_speedParticle');
folfer4.add(configs, 'x_gravityParticle');
folfer4.add(configs, 'y_gravityParticle');
