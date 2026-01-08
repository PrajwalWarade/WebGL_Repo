#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_position;
in vec3 worldPosition;

uniform mat4 u_viewDirectionProjectionInverse;
uniform samplerCube u_texture;
uniform float uAlpha;

out vec4 FragColor;

void main(void) {

    if(worldPosition.y <= 0.0f) {
        discard;
    }

    vec4 t = u_viewDirectionProjectionInverse * v_position;
    FragColor = texture(u_texture, normalize(t.xyz / t.w)) * uAlpha;
    FragColor = texture(u_texture, normalize(v_normal))  * uAlpha;
}
