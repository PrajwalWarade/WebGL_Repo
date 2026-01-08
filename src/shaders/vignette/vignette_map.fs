 #version 300 es
 precision highp float;
 uniform vec2 u_resolution;
 uniform float u_vignetteOuterRadius;
 uniform float u_vignetteInnerRadius;
 out vec4 FragColor;
 void main(void)
 {
        vec4 color = vec4(1.0); 
        vec2 relativePosition; 
        relativePosition.x = (gl_FragCoord.x / u_resolution.x);
        relativePosition.x = relativePosition.x - 0.5; 
        relativePosition.y = (gl_FragCoord.y / u_resolution.y);
        relativePosition.y = relativePosition.y -  0.5; 
        float len = length(relativePosition);
        float vignette = smoothstep(u_vignetteOuterRadius, u_vignetteInnerRadius, len);
        vec3 tempVignetteColor;
        tempVignetteColor= mix(color.rgb, color.rgb * vignette, 1.0);
        vec4 vignetteColor;
        vignetteColor = vec4(tempVignetteColor, color.a);
        FragColor = vignetteColor;
 }