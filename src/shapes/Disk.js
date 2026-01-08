"use strict";
class Disk {
    constructor(innerRadius, outerRadius, slices, loops) {
        // code
        this.model_vertices = [];
        this.model_normals = [];
        this.model_textures = [];
        this.generateDiskData(innerRadius, outerRadius, slices, loops);

        this.vao_disk = gl.createVertexArray();
        gl.bindVertexArray(this.vao_disk);
        {
            // Vertices
            this.vbo_disk_vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_disk_vertices);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getDiskVertex()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Texcoords
            this.vbo_disk_texcoords = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_disk_texcoords);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getDiskTexCoord()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Normals
            this.vbo_disk_normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_disk_normals);
            {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getDiskNormals()), gl.STATIC_DRAW);
                gl.vertexAttribPointer(WebGLMacros.PRJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(WebGLMacros.PRJ_ATTRIBUTE_NORMAL);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);

    }

    draw(){
        gl.bindVertexArray(this.vao_disk);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.getDiskVertex().length / 3);
        gl.bindVertexArray(null);

    }

    addDiskVertex(x, y, z) {
        this.model_vertices.push(x);
        this.model_vertices.push(y);
        this.model_vertices.push(z);
    }

    addDiskNormal(x, y, z) {
        this.model_normals.push(x);
        this.model_normals.push(y);
        this.model_normals.push(z);
    }

    addDiskTexCoords(a, b) {
        this.model_textures.push(a);
        this.model_textures.push(b);
    }

    getDiskVertex() {
        return this.model_vertices;
    }

    getDiskTexCoord() {
        return this.model_textures;
    }

    getDiskNormals() {
        return this.model_normals;
    }

    generateDiskData(innerRadius, outerRadius, slices, loops) {
        const CACHE_SIZE = 240;
        let i, j;
        let sinCache = new Array(CACHE_SIZE);
        let cosCache = new Array(CACHE_SIZE);
        let angle;
        let sintemp;
        let costemp;
        let deltaRadius;
        let radiusLow, radiusHigh;
        let texLow = 0.0, texHigh = 0.0;
        let angleOffset;
        let slices2;
        let finish;
        let startAngle = 0.0;
        let sweepAngle = 360.0;

        if (slices >= CACHE_SIZE)
            slices = CACHE_SIZE - 1;
        if (slices < 2 || loops < 1 || outerRadius <= 0.0 || innerRadius < 0.0 ||
            innerRadius > outerRadius) {
            return;
        }

        if (sweepAngle < -360.0)
            sweepAngle = 360.0;
        if (sweepAngle > 360.0)
            sweepAngle = 360.0;
        if (sweepAngle < 0) {
            startAngle += sweepAngle;
            sweepAngle = -sweepAngle;
        }

        if (sweepAngle == 360.0) {
            slices2 = slices;
        }
        else {
            slices2 = slices + 1;
        }

        /* Compute length (needed for normal calculations) */
        deltaRadius = outerRadius - innerRadius;

        /* Cache is the vertex locations cache */

        angleOffset = startAngle / 180.0 * Math.PI;
        for (i = 0; i <= slices; i++) {
            angle = angleOffset + ((Math.PI * sweepAngle) / 180.0) * i / slices;
            sinCache[i] = Math.sin(angle);
            cosCache[i] = Math.cos(angle);
        }

        if (sweepAngle == 360.0) {
            sinCache[slices] = sinCache[0];
            cosCache[slices] = cosCache[0];
        }

        // Vertices and TexCoord Start
        if (innerRadius == 0.0) {
            finish = loops - 1;
            /* Triangle strip for inner polygons */

            this.addDiskTexCoords(0.5, 0.5);

            this.addDiskVertex(0.0, 0.0, 0.0);

            radiusLow = outerRadius -
                deltaRadius * ((loops - 1) / loops);

            texLow = radiusLow / outerRadius / 2;

            for (i = slices; i >= 0; i--) {
                this.addDiskTexCoords(texLow * sinCache[i] + 0.5,
                    texLow * cosCache[i] + 0.5);

                    this.addDiskVertex(radiusLow * sinCache[i],
                    radiusLow * cosCache[i], 0.0);

                    this.addDiskNormal(0.0, 0.0, 1.0);

            }
        }
        else {
            finish = loops;
        }

        for (j = 0; j < finish; j++) {
            radiusLow = outerRadius - deltaRadius * (j / loops);
            radiusHigh = outerRadius - deltaRadius * ((j + 1) / loops);

            texLow = radiusLow / outerRadius / 2;
            texHigh = radiusHigh / outerRadius / 2;

            for (i = 0; i <= slices; i++) {
                this.addDiskTexCoords(texLow * sinCache[i] + 0.5,
                    texLow * cosCache[i] + 0.5);

                this.addDiskVertex(radiusLow * sinCache[i],
                    radiusLow * cosCache[i], 0.0);

                this.addDiskNormal(0.0, 0.0, 1.0);

                this.addDiskTexCoords(texHigh * sinCache[i] + 0.5,
                    texHigh * cosCache[i] + 0.5);

                this.addDiskVertex(radiusHigh * sinCache[i],
                    radiusHigh * cosCache[i], 0.0);

                this.addDiskNormal(0.0, 0.0, 1.0);
            }
        }
    }
}
