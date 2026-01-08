// Global Matrices
var perspectiveProjectionMatrix;
var orthographicProjectionMatrix;
var modelMatrix;
var viewMatrix;

// Object
var objX = 0.0, objY = 0.0, objZ = 0.0;
var objIncrement = 1.0;
var yAngle_Rotate = 0.0;

// Scale
var scaleX = 0.0, scaleY = 0.0, scaleZ = 0.0;
var scaleIncrement = 0.1;

// Rotation
var rotationX = 0.0, rotationY = 0.0, rotationZ = 0.0;
var rotationIncrement = 0.01;

var bEnbaleLight = true;
var bEnbaleShadow = true;
var gLightPosition = true;
var gLightColor = true;

/* WEBGL RELATED GLOBAL VARIABLES */
const webGLMacros =
{
    PRJ_ATTRIBUTE_POSITION: 0,
    PRJ_ATTRIBUTE_COLOR: 1,
    PRJ_ATTRIBUTE_NORMAL: 2,
    PRJ_ATTRIBUTE_TEXTURE0: 3,
    PRJ_ATTRIBUTE_ELEMENT: 4,
};

// Function to convert degrees to Radian
function degToRad(degrees) {
    return degrees * Math.PI / 180.0;
}

