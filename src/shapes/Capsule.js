class Capsule {

    constructor(_radius, _height, _slice, _stack) {

        this.radius = _radius;
        this.height = _height;
        this.slice = _slice;
        this.stack = _stack;

        this.vertices = [];
        this.texCoords = [];
        this.normals = [];

        this.hemiSphereFront = new Hemisphere();
        this.hemiSphereBack = new Hemisphere();

        this.cylinder = new Cylinder(this.radius + 0.15, this.radius + 0.15, this.height - 0.9, this.slice, this.stack);
        this.hemiSphereFront.initializeForCapsule(this.radius, this.slice, this.stack, true, this.height / 3.296);
        this.hemiSphereBack.initializeForCapsule(this.radius, this.slice, this.stack, false, this.height / 3.296);

        this.GenereateCapsule();

        this.vao_capsule = gl.createVertexArray();
        gl.bindVertexArray(this.vao_capsule);
        {
            // Vertices
            this.vbo_capsule_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_capsule_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_capsule_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_capsule_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_capsule_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_capsule_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
    }

    draw() {
        gl.bindVertexArray(this.vao_capsule);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (this.vertices.length / 3));
        gl.bindVertexArray(null);
    }

    GenereateCapsule() {

        // MIDDLE - Cylinder
        if (this.cylinder != null) {
            for (let i = 0; i < this.cylinder.vertices.length; i++)
                this.vertices.push(this.cylinder.vertices[i]);

            for (let i = 0; i < this.cylinder.texCoords.length; i++)
                this.texCoords.push(this.cylinder.texCoords[i]);

            for (let i = 0; i < this.cylinder.normals.length; i++)
                this.normals.push(this.cylinder.normals[i]);
        }
        // BACK
        if (this.hemiSphereBack != null) {
            for (let i = 0; i < this.hemiSphereBack.getHemisphereVertex().length / 2; i++)
                this.vertices.push(this.hemiSphereBack.model_vertices[i]);

            for (let i = 0; i < this.hemiSphereBack.getHemisphereTexCoord().length / 2; i++)
                this.texCoords.push(this.hemiSphereBack.model_textures[i]);

            for (let i = 0; i < this.hemiSphereBack.getHemisphereNormals().length / 2; i++)
                this.normals.push(this.hemiSphereBack.model_normals[i]);
        }

        // FRONT
        if (this.hemiSphereFront != null) {
            for (let i = 0; i < this.hemiSphereFront.getHemisphereVertex().length / 2; i++)
                this.vertices.push(this.hemiSphereFront.model_vertices[i]);

            for (let i = 0; i < this.hemiSphereFront.getHemisphereTexCoord().length / 2; i++)
                this.texCoords.push(this.hemiSphereFront.model_textures[i]);

            for (let i = 0; i < this.hemiSphereFront.getHemisphereNormals().length / 2; i++)
                this.normals.push(this.hemiSphereFront.model_normals[i]);
        }
    }



}