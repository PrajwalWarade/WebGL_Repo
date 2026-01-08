class Hemisphere {
    constructor() {
        // code
        this.model_vertices = [];
        this.model_normals = [];
        this.model_textures = [];
        this.vao_hemisphere = null;
        this.vbo_hemisphere_normals = null;
        this.vbo_hemisphere_texcoords = null;
        this.vbo_hemisphere_vertices = null;
    }

    initializeForCapsule(radius, slices, stacks, _isFront, heightOfCylinder) {
        this.generateHemisphereData(radius, slices, stacks, _isFront, heightOfCylinder);

        this.vao_hemisphere = gl.createVertexArray();
        gl.bindVertexArray(this.vao_hemisphere);
        {
            // Vertices
            this.vbo_hemisphere_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereVertex()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_hemisphere_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereTexCoord()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_hemisphere_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereNormals()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    initialize(radius, slices, stacks) {
        this.generateHemisphereData(radius, slices, stacks, true, 0);

        this.vao_hemisphere = gl.createVertexArray();
        gl.bindVertexArray(this.vao_hemisphere);
        {
            // Vertices
            this.vbo_hemisphere_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereVertex()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_hemisphere_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereTexCoord()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_hemisphere_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_hemisphere_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getHemisphereNormals()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    draw() {
        gl.bindVertexArray(this.vao_hemisphere);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (this.getHemisphereVertex().length / 3) / 2);
        gl.bindVertexArray(null);
    }

    addHemisphereVertex(x, y, z) {
        this.model_vertices.push(x);
        this.model_vertices.push(y);
        this.model_vertices.push(z);
    }

    addHemisphereNormal(x, y, z) {
        this.model_normals.push(x);
        this.model_normals.push(y);
        this.model_normals.push(z);
    }

    addHemisphereTexCoords(a, b) {
        this.model_textures.push(a);
        this.model_textures.push(b);
    }

    getHemisphereVertex() {
        return this.model_vertices;
    }

    getHemisphereTexCoord() {
        return this.model_textures;
    }

    getHemisphereNormals() {
        return this.model_normals;
    }

    generateHemisphereData(radius, slices, stacks, _isFront, heightOfCylinder) {
        const CACHE_SIZE = 240;
        radius = radius * 1.159;
        let i, j;
        let sinCache1a = new Array(CACHE_SIZE);
        let cosCache1a = new Array(CACHE_SIZE);
        let sinCache2a = new Array(CACHE_SIZE);
        let cosCache2a = new Array(CACHE_SIZE);
        let sinCache1b = new Array(CACHE_SIZE);
        let cosCache1b = new Array(CACHE_SIZE);
        let sinCache2b = new Array(CACHE_SIZE);
        let cosCache2b = new Array(CACHE_SIZE);
        let angle = 0.0;
        let zLow, zHigh;
        let sintemp1 = 0.0, sintemp2 = 0.0, sintemp3 = 0.0, sintemp4 = 0.0;
        let costemp3 = 0.0, costemp4 = 0.0;
        let start, finish;

        if (slices >= CACHE_SIZE)
            slices = CACHE_SIZE - 1;
        if (stacks >= CACHE_SIZE)
            stacks = CACHE_SIZE - 1;
        if (slices < 2 || stacks < 1 || radius < 0.0) {
            console.error("Error, please check hemisphere slices/stacks/radius");
            return;
        }

        for (i = 0; i < slices; i++) {
            angle = 2 * Math.PI * i / slices;
            sinCache1a[i] = Math.sin(angle);
            cosCache1a[i] = Math.cos(angle);
            sinCache2a[i] = sinCache1a[i];
            cosCache2a[i] = cosCache1a[i];
        }

        for (j = 0; j <= stacks; j++) {
            angle = Math.PI * j / stacks;
            sinCache2b[j] = Math.sin(angle);
            cosCache2b[j] = Math.cos(angle);
            sinCache1b[j] = radius * Math.sin(angle);
            cosCache1b[j] = radius * Math.cos(angle);
        }
        /* Make sure it comes to a point */
        sinCache1b[0] = 0;
        sinCache1b[stacks] = 0;

        sinCache1a[slices] = sinCache1a[0];
        cosCache1a[slices] = cosCache1a[0];
        sinCache2a[slices] = sinCache2a[0];
        cosCache2a[slices] = cosCache2a[0];

        start = 0;

        finish = stacks;
        for (j = start; j < finish; j++) {
            zLow = cosCache1b[j];
            zHigh = cosCache1b[j + 1];
            sintemp1 = sinCache1b[j];
            sintemp2 = sinCache1b[j + 1];

            sintemp3 = sinCache2b[j + 1];
            costemp3 = cosCache2b[j + 1];
            sintemp4 = sinCache2b[j];
            costemp4 = cosCache2b[j];

            for (i = 0; i <= slices; i++) {
                this.addHemisphereNormal(sinCache2a[i] * sintemp3, cosCache2a[i] * sintemp3, costemp3);
                this.addHemisphereTexCoords(1 - i / slices, 1 - (j + 1) / stacks);
                if (_isFront == true)
                    this.addHemisphereVertex(sintemp2 * sinCache1a[i], sintemp2 * cosCache1a[i], (zHigh + heightOfCylinder));
                else
                    this.addHemisphereVertex(sintemp2 * sinCache1a[i], sintemp2 * cosCache1a[i], -(zHigh + heightOfCylinder));

                this.addHemisphereNormal(sinCache2a[i] * sintemp4, cosCache2a[i] * sintemp4, costemp4);
                this.addHemisphereTexCoords(1 - i / slices, 1 - j / stacks);
                if (_isFront == true)
                    this.addHemisphereVertex(sintemp1 * sinCache1a[i], sintemp1 * cosCache1a[i], (zLow + (heightOfCylinder)));
                else
                    this.addHemisphereVertex(sintemp1 * sinCache1a[i], sintemp1 * cosCache1a[i], -(zLow + heightOfCylinder));
            }
        }
    }
}
