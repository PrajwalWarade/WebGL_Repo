class Cylinder {

    constructor(_baseRadius, _topRadius, _height, _stack, _sector) {
        this.baseRadius = _baseRadius;
        this.topRadius = _topRadius;
        this.height = _height;
        this.sector = _sector;
        this.stack = _stack;

        this.unitCircleVertices = [];

        this.vertices;
        this.normals;
        this.texCoords;
        this.indices;

        this.verticesSize;
        this.normalsSize;
        this.texCoordsSize;
        this.indicesSize;


        this.GenerateUnitCircleVertices();

        // GenerateVertices();
        this.GenerateVerticesFlat();

        this.vao_cylinder = gl.createVertexArray();
        gl.bindVertexArray(this.vao_cylinder);
        {
            // Vertices
            this.vbo_cylinder_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cylinder_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_cylinder_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cylinder_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_cylinder_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_cylinder_normals);
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

        gl.bindVertexArray(this.vao_cylinder);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
        gl.bindVertexArray(null);
    }
    GetSideNormals() {

        var sectorStep = 2 * Math.PI / this.sector;
        var sectorAngle;

        var zAngle = Math.atan2(this.baseRadius - this.topRadius, height);
        var x0 = Math.cos(zAngle);
        var y0 = 0;
        var z0 = Math.sin(zAngle);

        var sideNormals = [];


        for (let i = 0; i <= this.sector; ++i) {
            sectorAngle = i * sectorStep;
            sideNormals.push(Math.cos(sectorAngle) * x0 - Math.sin(sectorAngle) * y0);
            sideNormals.push(Math.sin(sectorAngle) * x0 + Math.cos(sectorAngle) * y0);
            sideNormals.push(z0);
        }

        return sideNormals;
    }

    GenerateUnitCircleVertices() {
        var sectorStep = 2 * Math.PI / this.sector;
        var sectorAngle;

        for (let i = 0; i <= this.sector; ++i) {

            sectorAngle = i * sectorStep;

            this.unitCircleVertices.push(Math.cos(sectorAngle));
            this.unitCircleVertices.push(Math.sin(sectorAngle));
            this.unitCircleVertices.push(0);

        }
    }

    GenerateVertices() {

        var x, y, z;

        var sideNormals = [];
        sideNormals = this.GetSideNormals();
        ////fprintf(gpFile, "After GetSideNormals");

        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        ////fprintf(gpFile, "After create_vec_float");
        var radius;
        for (let i = 0; i <= this.stack; ++i) {
            z = -(this.height * 0.5) + parseFloat(i) / this.stack * this.height;
            radius = this.baseRadius + parseFloat(i) / this.stack * (this.topRadius - this.baseRadius);
            var t = 1.0 - parseFloat(i) / this.stack;

            for (let j = 0, k = 0; j <= this.sector; ++j, k += 3) {
                x = this.unitCircleVertices[k];
                y = this.unitCircleVertices[k + 1];
                this.AddVertex(x * radius, y * radius, z);
                this.AddNormal(sideNormals[k], sideNormals[k + 1], sideNormals[k + 2]);
                this.AddTexCoord((parseFloat(j) / this.sector, t));
            }
        }

    }

    GenerateVerticesFlat() {
        // tmp vertex definition (x,y,z,s,t)
        let tmpVertices = [];

        let i, j, k; // indices
        var x, y, z, s, t, radius;

        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        for (i = 0; i <= this.stack; ++i) {
            z = -(this.height * 0.5) + parseFloat(i) / this.stack * this.height;                  // vertex position z
            radius = this.baseRadius + parseFloat(i) / this.stack * (this.topRadius - this.baseRadius); // lerp
            t = 1.0 - parseFloat(i) / this.stack;                                       // top-to-bottom

            for (j = 0, k = 0; j <= this.sector; ++j, k += 3) {
                x = this.unitCircleVertices[k];
                y = this.unitCircleVertices[k + 1];
                s = parseFloat(j) / this.sector;

                tmpVertices.push({
                    x: x * radius,
                    y: y * radius,
                    z: z,
                    s: s,
                    t: t
                });
            }
        }

        let v1 = null;
        let v2 = null;
        let v3 = null;
        let v4 = null; // 4 vertex positions v1, v2, v3, v4

        let n = [];  // 1 face normal
        var vi1, vi2;          // indices
        var index = 0;

        for (i = 0; i < this.stack; ++i) {
            vi1 = i * (this.sector + 1); // index of tmpVertices
            vi2 = (i + 1) * (this.sector + 1);

            for (j = 0; j < this.sector; ++j, ++vi1, ++vi2) {
                v1 = tmpVertices[vi1];
                v2 = tmpVertices[vi2];
                v3 = tmpVertices[vi1 + 1];
                v4 = tmpVertices[vi2 + 1];

                n = this.computeFaceNormal(v1.x, v1.y, v1.z, v3.x, v3.y, v3.z, v2.x, v2.y, v2.z); // face normal

                this.AddVertex(v1.x, v1.y, v1.z);
                this.AddVertex(v2.x, v2.y, v2.z);
                this.AddVertex(v3.x, v3.y, v3.z);
                this.AddVertex(v4.x, v4.y, v4.z);


                this.AddTexCoord(v1.s, v1.t);
                this.AddTexCoord(v2.s, v2.t);
                this.AddTexCoord(v3.s, v3.t);
                this.AddTexCoord(v4.s, v4.t);

                // put normal
                for (k = 0; k < 4; ++k) // same normals for all 4 vertices
                {
                    this.AddNormal(n[0], n[1], n[2]);
                }
            }
        }
    }

    computeFaceNormal(x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3) {
        var EPSILON = 0.000001;

        var normal = [3, 0.0];
        var nx, ny, nz;

        var ex1 = x2 - x1;
        var ey1 = y2 - y1;
        var ez1 = z2 - z1;
        var ex2 = x3 - x1;
        var ey2 = y3 - y1;
        var ez2 = z3 - z1;

        nx = ey1 * ez2 - ez1 * ey2;
        ny = ez1 * ex2 - ex1 * ez2;
        nz = ex1 * ey2 - ey1 * ex2;

        var length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (length > EPSILON) {
            var lengthInv = 1.0 / length;
            normal[0] = nx * lengthInv;
            normal[1] = ny * lengthInv;
            normal[2] = nz * lengthInv;
        }

        return normal;
    }


    AddVertex(x, y, z) {
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
    }

    AddTexCoord(s, t) {
        this.texCoords.push(s);
        this.texCoords.push(t);

    }

    AddNormal(x, y, z) {
        this.normals.push(x);
        this.normals.push(y);
        this.normals.push(z);
    }

}