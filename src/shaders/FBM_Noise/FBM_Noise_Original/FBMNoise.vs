#version 300 es
in vec4 aPosition;
in vec2 aTexCoord;
out vec2 oTexCoord;
void main(void)
{
gl_Position=aPosition;
oTexCoord = aTexCoord;
}

