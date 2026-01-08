#version 300 es
in vec4 aPosition;
in vec2 aTexCoord;
out vec2 v_texcoord;
uniform mat4 uMVPMatrix;
uniform mat4 uModelViewMatrix;
uniform vec3 uCameraPosition;  
out float v_fogDepth;
void main(void)
{
    gl_Position = uMVPMatrix * aPosition;
    v_texcoord = aTexCoord;    
    vec4 worldPosition = uModelViewMatrix * aPosition;
    v_fogDepth = distance(worldPosition.xyz, uCameraPosition); 
}



