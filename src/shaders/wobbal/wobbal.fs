#version 300 es

precision highp float;
const float C_PI    = 3.1415;
const float C_2PI   = 2.0 * C_PI;
const float C_2PI_I = 1.0 / (2.0 * C_PI);
const float C_PI_2  = C_PI / 2.0;

in vec3 a_position_out;
in vec2 a_texcoord_out;

uniform sampler2D u_textureSampler;
uniform float u_StartRad;
uniform vec2  u_Freq;
uniform vec2  u_Amplitude;
uniform float u_alpha;
uniform vec4 u_fogColor;
uniform float u_maxDistance;
uniform float u_minDistance;
uniform int u_isFog;

out vec4 FragColor;

void main(void)
{
    vec2  perturb;
    float rad;
    vec4  color;

    rad = (a_texcoord_out.s + a_texcoord_out.t - 1.0 + u_StartRad) * u_Freq.x;

    rad = rad * C_2PI_I;
    rad = fract(rad);
    rad = rad * C_2PI;

    if (rad >  C_PI) rad = rad - C_2PI;
    if (rad < -C_PI) rad = rad + C_2PI;

    if (rad >  C_PI_2) rad =  C_PI - rad;
    if (rad < -C_PI_2) rad = -C_PI - rad;

    perturb.x  = (rad - (rad * rad * rad / 6.0)) * u_Amplitude.x;

    rad = (a_texcoord_out.s - a_texcoord_out.t + u_StartRad) * u_Freq.y;

    rad = rad * C_2PI_I;
    rad = fract(rad);
    rad = rad * C_2PI;

    if (rad >  C_PI) rad = rad - C_2PI;
    if (rad < -C_PI) rad = rad + C_2PI;

    if (rad >  C_PI_2) rad =  C_PI - rad;
    if (rad < -C_PI_2) rad = -C_PI - rad;

    perturb.y  = (rad - (rad * rad * rad / 6.0)) * u_Amplitude.y;
    color = texture(u_textureSampler, perturb + a_texcoord_out.st);

    FragColor = vec4(color.rgb, color.a) * u_alpha;
}

