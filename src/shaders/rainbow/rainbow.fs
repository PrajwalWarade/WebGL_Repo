#version 300 es

precision highp float;

in vec2 oTexCoord;
in vec4 oColor;
uniform highp vec2 uResolution;
uniform highp sampler2D uTextureSampler;
uniform float uTime;

out vec4 FragColor;

void main() {
    //FragColor = oColor;
    // FragColor = texture(uTextureSampler, oTexCoord);

    // vec4 noise = texture(uTextureSampler, oTexCoord);
    // if (noise.r > 0.7) {
    //     FragColor = oColor;
    // }
    // else {
    //     //FragColor = noise;
    //     vec2 fragCoord = oTexCoord * uResolution;
    //     vec2 uv = fragCoord / uResolution.x;
    //     float result = 0.0;
    //     result *= texture(uTextureSampler, uv * 1.1 + vec2(uTime * -0.005)).r;
    //     result *= texture(uTextureSampler, uv * 0.9 + vec2(uTime * 0.005)).g;
    //     result = pow(result, 12.0);
    //     FragColor = mix(vec4(5.0 * result), oColor, 0.8);
    // }

    // vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy)/uResolution.y;
    // float result = 0.0;
    // result *= texture(uTextureSampler, uv * 1.1 + vec2(uTime * -0.005)).r;
    // result *= texture(uTextureSampler, uv * 0.9 + vec2(uTime * 0.005)).g;
    // result = pow(result, 12.0);
    // //FragColor = mix(vec4(5.0 * result), oColor, 0.8);
    // FragColor = vec4(5.0 * result);

    FragColor = oColor;
}
