#version 300 es
precision mediump float;
precision mediump int;

const float pi = 3.14159;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform float waterHeight;
uniform float time;

uniform int enable[8];
uniform float amplitude[8];
uniform float wavelength[8];
uniform float direction[8];
uniform float speed[8];

in vec3 position;

out vec3 vPos;
out float oheight;

float wave(int i) {
  float frequency = 2.0*pi/wavelength[i];
  float phase = speed[i] * frequency;
  float d = direction[i] * pi/180.0;
  vec2 dir = vec2(cos(d), sin(d));
  float theta = dot(dir, vec2(position));
  return amplitude[i] * sin(theta * frequency + time * phase);
}

float bigWaveHeight() {
  float height = 0.0;
  for (int i = 0; i < 4; i++) {
    if (enable[i] == 1)
      height += wave(i);
  }
  return height;
}

void main(void) {
  float height = waterHeight + bigWaveHeight();

  vPos = vec3(vec2(position), height);
  oheight = height;
  // gl_Position = projection * view * model * vec4(vec2(position) , 0.0 , 1.0);
  // gl_Position = projection * view * model * vec4(vec2(position) , height , 1.0);
  gl_Position = projection * view * model * vec4(position[0], height, position[1], 1.0);
  //gl_Position = projection * view * model * vec4(position[0], position[1], height, 1.0);
}
