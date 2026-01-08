#version 300 es
precision highp float;

in vec2 vTexCoord;
in vec3 vWorldPos;
in float vHeightFactor;

uniform sampler2D uCurtainTexture;
uniform float uAlpha;
uniform int uNumFolds;
uniform float uLightIntensity;  // 0.0 = night, 1.0 = day
uniform vec3 uLightColor;       // Light color

out vec4 FragColor;

void main()
{
    vec4 texColor = texture(uCurtainTexture, vTexCoord);
    
    float foldPattern = fract(vTexCoord.x * float(uNumFolds));
    
    // Fold shading
    float shadingCurve = sin(foldPattern * 3.14159 * 2.0);  // -1 to 1
    
    // Base fold shading
    float foldShading = mix(0.6, 1.0, (shadingCurve + 1.0) * 0.5);
    
    // lighting intensity
    float ambient = mix(0.2, 0.6, uLightIntensity);  // Ambient light
    float diffuse = mix(0.3, 0.8, uLightIntensity);  // Diffuse contribution
    
    float shading = ambient + foldShading * diffuse;
    
    //  light color
    vec3 shadedColor = texColor.rgb * shading * uLightColor;
    
    FragColor = vec4(shadedColor, texColor.a * uAlpha);
}
