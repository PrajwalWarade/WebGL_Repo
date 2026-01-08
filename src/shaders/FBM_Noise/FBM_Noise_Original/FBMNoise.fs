#version 300 es
precision highp float;
out vec4 FragColor;
in vec2 oTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
float random(in vec2 _st)
{
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float noise(in vec2 _st)
{
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
#define NUM_OCTAVES 5
float fbm(in vec2 _st)
{
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rotation = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i)
    {
        value += amplitude * noise(_st);
        _st = rotation * _st * 2.0 + shift;
        amplitude *= 0.5;
    }
    return value;
}
void main(void)
{
    vec2 st = oTexCoord * u_resolution.xy / u_resolution.y * 3.0;
    vec3 color = vec3(0.0,0.0,0.0);
    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.00 * u_time);
    q.y = fbm(st + vec2(1.0));
    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);
    float f = fbm(st + r);
    color = mix(color1, color2, clamp((f * f) * 4.0, 0.0, 1.0));
    color = mix(color, color3, clamp(length(q), 0.0, 1.0));
    color = mix(color, color4, clamp(length(r.x), 0.0, 1.0));
    FragColor = vec4((f * f * f + 0.6 * f * f + 0.5 * f) * color, 1.0);
}

