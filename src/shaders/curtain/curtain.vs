#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform bool uApplyWave;

out vec2 vTexCoord;
out vec3 vWorldPos;
out float vHeightFactor;

void main()
{
    vec3 pos = aPosition;
    
    if (uApplyWave)
    {
        float xNormalized = (aPosition.x + 2.0) / 4.0;  // -2 to +2
        xNormalized = clamp(xNormalized, 0.0, 1.0);

        float foldIntensity = mix(2.5, 0.4, xNormalized);  // 2.5x - 0.4x

        float foldFrequency = mix(15.0, 5.0, xNormalized);

        float amplitude = 0.2;
        float speed = 10.0;
        
        // Smooth horizontal movement
        float mainSway = sin(uTime * speed) * amplitude;
        
        // variation based on X position
        float foldPhase = aPosition.x * foldFrequency;
        float foldSway = sin(uTime * speed * 1.3 + foldPhase) * amplitude * foldIntensity;

        float totalSway = mainSway + foldSway;
        
        // horizontal displacement to ENTIRE curtain
        pos.x += totalSway;
        
        // Z-axis movement
        float depthSway = cos(uTime * speed * 0.8 + foldPhase) * amplitude * foldIntensity;
        pos.z += depthSway;
        
        vHeightFactor = foldIntensity;
    }
    else
    {
        vHeightFactor = 0.0;
    }
    
    vTexCoord = aTexCoord;
    
    vec4 worldPos = uModelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
