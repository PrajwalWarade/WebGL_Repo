class Curtain
{
    constructor(width = 2.0, height = 3.0, numFolds = 5, heightSegments = 50)
    {
        this.width = width;
        this.height = height;
        this.numFolds = numFolds;
        this.heightSegments = heightSegments;
        this.depthSegment = 3;

        this.vao = null;
        this.vboPosition = null;
        this.vboTexCoord = null;
        this.vboIndices = null;
        this.indexCount = 0;
        this.texture = null;
        this.startTime = 0;
        this.waveEnabled = false;
    }

    initialize()
    {
        // Generate curtain geometry
        const vertices = [];
        const texCoords = [];
        const indices = [];

        const foldWidth = this.width / this.numFolds;
        const foldDepth = foldWidth * 0.5;

        const pointsPerFold = 8;

        // Verticle folds
        for(let fold = 0; fold < this.numFolds; fold++)
        {
            for(let y=0; y<=this.heightSegments; y++)
            {
                const yNormalized = y / this.heightSegments;
                const posY = (1.0 - yNormalized) * this.height - this.height / 2;  // Top to bottom
                
                const foldStartX = fold * foldWidth - this.width / 2;

                for(let i = 0; i < pointsPerFold; i++)
                {
                    const t = i / (pointsPerFold - 1);  // 0 to 1
                    
                    // X position across the fold
                    const posX = foldStartX + t * foldWidth;
                    
                    // Z position - smooth wave pattern 
                    const posZ = Math.cos(t * Math.PI * 2) * foldDepth * 0.5;
                    
                    vertices.push(posX, posY, posZ);
                    
                    // Texture coordinates
                    const uCoord = (fold + t) / this.numFolds;
                    texCoords.push(uCoord, yNormalized);
                }
            }
        }
        // Generate indices
        for (let fold = 0; fold < this.numFolds; fold++)
        {
            const baseIndex = fold * (this.heightSegments + 1) * pointsPerFold;

            for (let y = 0; y < this.heightSegments; y++)
            {
                for (let x = 0; x < pointsPerFold - 1; x++)
                {
                    const topLeft = baseIndex + y * pointsPerFold + x;
                    const topRight = topLeft + 1;
                    const bottomLeft = topLeft + pointsPerFold;
                    const bottomRight = bottomLeft + 1;

                    indices.push(topLeft, bottomLeft, topRight);
                    indices.push(topRight, bottomLeft, bottomRight);
                }
            }
        }

        this.indexCount = indices.length;

        // create VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // VBO for Position
        this.vboPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // VBO TexCoord
        this.vboTexCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        // Index Buffer
        this.vboIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);   // unbind VAO
    }

    setTexture(texture)
    {
        this.texture = texture;
    }

    // Enables/disables waving
    enableWave(enable)
    {
        if(enable && this.startTime === 0)
        {
            this.startTime = performance.now() / 1000.0;
        }
        this.waveEnabled = enable;
    }

    render(camera, CurtainShader)
    {
        if(!this.texture)
            return;

        const currentTime = this.waveEnabled ? (performance.now() / 1000.0 - this.startTime) : 0.0;

        gl.bindVertexArray(this.vao);

        // Enable blending 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.CULL_FACE);   // to see both side curtain 

        CurtainShader.render(camera, modelMatrix, this.texture, currentTime, this.waveEnabled, 0.6, 6);    // change alpha
        gl.useProgram(CurtainShader.shaderProgramObject);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

        CurtainShader.unbind();

        gl.enable(gl.CULL_FACE);
        gl.disable(gl.BLEND);
        gl.bindVertexArray(null);
    }

    uninitialize()
    {
        if (this.vboIndices)
        {
            gl.deleteBuffer(this.vboIndices);
            this.vboIndices = null;
        }
        if (this.vboTexCoord)
        {
            gl.deleteBuffer(this.vboTexCoord);
            this.vboTexCoord = null;
        }
        if (this.vboPosition)
        {
            gl.deleteBuffer(this.vboPosition);
            this.vboPosition = null;
        }
        if (this.vao)
        {
            gl.deleteVertexArray(this.vao);
            this.vao = null;
        }
    }
}

