precision highp float;

varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_surfaceToView;
varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_frag_pos;

uniform vec3 diffuse;
uniform sampler2D diffuseMap;
uniform vec3 ambient;
uniform vec3 emissive;
uniform vec3 specular;
uniform sampler2D specularMap;
uniform float shininess;
uniform sampler2D normalMap;
uniform float opacity;
uniform vec3 u_lightDirection;
uniform vec3 u_ambientLight;
uniform float u_alpha;

uniform int enbaleClipping;
uniform int upSide;

uniform vec3 lightPos;
uniform vec3 viewPos;

void main() {

  if(enbaleClipping == 1) {
    if(v_frag_pos.y <= 0.0 && upSide == 1) {
      discard;
    } else if(v_frag_pos.y >= 0.0 && upSide == 0) {
      discard;
    }
  }

  vec3 normal = normalize(v_normal) * (float(gl_FrontFacing) * 2.0 - 1.0);
  vec3 tangent = normalize(v_tangent) * (float(gl_FrontFacing) * 2.0 - 1.0);
  vec3 bitangent = normalize(cross(normal, tangent));

  mat3 tbn = mat3(tangent, bitangent, normal);
  normal = texture2D(normalMap, v_texcoord).rgb * 2. - 1.;
  normal = normalize(tbn * normal);

  vec4 color = texture2D(diffuseMap, v_texcoord);
  vec4 ambaintColor = 0.1 * color;

  vec3 TangentLightPos = tbn * lightPos;
  vec3 TangentViewPos = tbn * viewPos;
  vec3 TangentFragPos = tbn * v_frag_pos;

  vec3 lightDir = normalize(TangentLightPos - TangentFragPos);
  float diff = max(dot(lightDir, normal), 0.0);
  vec3 diffuseColor = diff * vec3(color);

    // specular
  vec3 viewDir = normalize(TangentViewPos - TangentFragPos);
  vec3 reflectDir = reflect(-lightDir, normal);
  vec3 halfwayDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);

  vec3 specularColor = vec3(0.2) * spec;
  gl_FragColor = vec4(vec3(ambaintColor) + diffuseColor + specularColor, 1.0);

}