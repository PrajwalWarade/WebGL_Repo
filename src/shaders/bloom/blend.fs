#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D tex1;
uniform sampler2D u_sceneBlur;
uniform sampler2D u_sceneWithoutBloom;
uniform float mult;
uniform float exposure;
uniform float gamma;
uniform int CompleteSceneBloom;

out vec4 fragColor;

void main() {
  vec3 color1 = texture(tex1, v_texcoord).rgb;
  vec3 color2 = texture(u_sceneBlur, v_texcoord).rgb;
  vec3 color = color1 + color2 * mult;

  // tone mapping
  vec3 result = vec3(1.0f) - exp(-color * exposure);

  // also gamma correct while we're at it       
  result = pow(result, vec3(1.0f / gamma));
    // fragColor = vec4(result, 1.0f);
  if(CompleteSceneBloom == 0)
    fragColor = mix(vec4(result, 1.0f), texture(u_sceneWithoutBloom, v_texcoord), 0.4f);
  else
    fragColor = vec4(result, 1.0f);
}
