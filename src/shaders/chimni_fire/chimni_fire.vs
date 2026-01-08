#version 300 es

in vec3 inPosition;
in vec4 inColor;
in vec2 inTexCoord;
in vec2 inOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec4 outColor;
out vec2 outTexCoord;

void main() {

    // Transform particle center to world space
	// vec3 worldCenter = (uModelMatrix * vec4(inPosition, 1.0f)).xyz;

	// vec3 camRight = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
	// vec3 camUp = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);

	// vec3 billboardPos = worldCenter +
	// 	camRight * inOffset.x +
	// 	camUp * inOffset.y;

	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0f);

	outColor = inColor;
	outTexCoord = inTexCoord;
}
