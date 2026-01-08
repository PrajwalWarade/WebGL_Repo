#version 300 es
precision mediump float;

in vec2 i_Position;
// in vec2 i_Position;
in float i_Age;
in float i_Life;

out float v_Age;
out float v_Life;

uniform mat4 uMVPMatrix;

void main() {
    v_Age = i_Age;
    v_Life = i_Life;
    gl_PointSize = (1.0f + 6.0f * (1.0f - i_Age / i_Life) * 1.0f) ;
    gl_Position = uMVPMatrix * vec4(i_Position, 0.0f, 1.0f);
}
