#version 300 es
precision mediump float;

in float v_Age;
in float v_Life;

out vec4 o_FragColor;

/* From http://iquilezles.org/www/articles/palettes/palettes.htm */
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(6.28318f * (c * t + d));
}

vec3 interpolateRainbowColor(float delta, vec3 rainbowColors[7]) {

    delta = clamp(delta, 0.0f, 1.0f);

    float position = delta * 6.0f; // 0.0 to 6.0 range
    int index1 = int(floor(position));
    int index2 = int(ceil(position));

    index2 = index2 % 7;

    float factor = position - float(index1);

    vec3 color = mix(rainbowColors[index1], rainbowColors[index2], factor);

    return color;
}

void main() {
    float dist = length(gl_PointCoord - vec2(0.5f, 0.5f));
    // Create a smooth edge for the point
    if(!(dist < 0.5f)) {
        discard;
    }

    vec3 rainbowColors[7];
    rainbowColors[0] = vec3(1.0f, 0.0f, 0.0f); // Red
    rainbowColors[1] = vec3(1.0f, 0.5f, 0.0f); // Orange
    rainbowColors[2] = vec3(1.0f, 1.0f, 0.0f); // Yellow
    rainbowColors[3] = vec3(0.0f, 1.0f, 0.0f); // Green
    rainbowColors[4] = vec3(0.0f, 0.0f, 1.0f); // Blue
    rainbowColors[5] = vec3(0.29f, 0.0f, 0.51f); // Indigo
    rainbowColors[6] = vec3(0.56f, 0.0f, 1.0f); // Violet

    float t = v_Age / v_Life;
    o_FragColor = vec4(palette(t, vec3(0.5f, 0.5f, 0.5f), vec3(0.5f, 0.5f, 0.5f), vec3(1.0f, 1.0f, 1.0f), vec3(0.00f, 0.33f, 0.67f)), 1.0f - t);
    // o_FragColor = vec4(palette(t, vec3(0.5f, 0.5f, 0.5f), vec3(0.5f, 0.5f, 0.5f), vec3(1.0f, 0.7f, 0.4f), vec3(0.0f, 0.15f, 0.20f)), 1.0f - t);
    o_FragColor = vec4(interpolateRainbowColor(t, rainbowColors), 1.0f);
}
