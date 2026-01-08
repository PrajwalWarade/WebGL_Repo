#version 300 es
precision mediump float;
precision mediump int;

const float pi = 3.14159;

uniform vec3 lightDirection;
uniform vec3 cameraPos;
uniform float time;

uniform int enable[8];
uniform float amplitude[8];
uniform float wavelength[8];
uniform float direction[8];
uniform float speed[8];

uniform sampler2D clouds;

in vec3 vPos;
in float oheight;

out vec4 FragColor;

vec3 waveNormal() {
  float dx = 0.0;
  float dy = 0.0;
  for (int i = 0; i < 8; i++) {
    if (enable[i] == 1) {
      float frequency = 2.0*pi/wavelength[i];
      float phase = speed[i] * frequency;
      float d = direction[i] * pi/180.0;
      vec2 dir = vec2(cos(d), sin(d));
      float theta = dot(dir, vPos.xy);
      float angle = theta * frequency + time * phase;

      dx += amplitude[i] * dir.y * frequency * cos(angle);
      dy += amplitude[i] * dir.x * frequency * cos(angle);
    }
  }
  vec3 n = vec3(-dx, -dy, 1.0);
  return normalize(n);
}

void main(void) {
  vec3 normal = waveNormal();
  vec3 eye = normalize(cameraPos - vPos);

  vec3 reflection = reflect(eye, normal);
  vec2 texPoint = reflection.xy / reflection.z;
  vec2 texCoord = texPoint * 0.5 + 0.5;
  vec3 skyColor = texture(clouds, texCoord).rgb;

  float cosi = dot(eye, normal);
  float sini = 1.0 - cosi;
  float R = 0.1 + 0.7 * sini;

  //FragColor = normalize(vec4(oheight, oheight, 1.0, 1.0));
  FragColor = vec4(skyColor, R);
}
