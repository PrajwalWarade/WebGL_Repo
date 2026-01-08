#version 300 es
in vec4 aPosition;
in vec2 aTexCord;
in vec2 aResolution;
out vec4 oColor;
out vec2 oResolution;
uniform mat4 uMVPMatrix;
void main(void)
{
  gl_Position= uMVPMatrix*aPosition;
  oTexCord=aTexCord;
  oResolution=aResolution;
}