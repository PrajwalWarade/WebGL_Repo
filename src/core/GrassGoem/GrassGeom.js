class GrassGeometry {
    constructor(size = 30, count = 10000) {
        this.size = size;
        this.count = count;
        this.vao = null;
        this.indexCount = 0;
        
        this.BLADE_WIDTH = 0.08;
        this.BLADE_SEGMENTS = 4;
        
        this.init();
    }

    init() {
        const grassData = this.generateGrassGeometry();
        
        // Create VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassData.positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassData.uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassData.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        const bladeIdBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bladeIdBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassData.bladeIds), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(grassData.indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);

        this.indexCount = grassData.indices.length;
        
        console.log(`Grass geometry created: ${this.count} blades, ${this.indexCount} indices`);
    }

    generateGrassGeometry() {
        const positions = [];
        const uvs = [];
        const normals = [];
        const bladeIds = [];
        const indices = [];

        for (let i = 0; i < this.count; i++) {
            const surfaceMin = -this.size / 2;
            const surfaceMax = this.size / 2;
            
            const x = surfaceMin + Math.random() * this.size;
            const z = surfaceMin + Math.random() * this.size;
            
            const height = 0.5 + Math.random() * 0.6;
            const width = this.BLADE_WIDTH * (0.8 + Math.random() * 0.4);
            const rotation = Math.random() * Math.PI * 2;
            
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            
            const vOffset = positions.length / 3;
            
            for (let seg = 0; seg <= this.BLADE_SEGMENTS; seg++) {
                const t = seg / this.BLADE_SEGMENTS;
                const y = height * t;
                
                const curve = Math.sin(t * Math.PI) * 0.1;
                const currentWidth = width * (1.0 - t * 0.7); // Taper towards tip
                
                const leftX = x + (-currentWidth / 2) * cos - curve * sin;
                const leftZ = z + (-currentWidth / 2) * sin + curve * cos;
                positions.push(leftX, y, leftZ);
                uvs.push(0, t);
                bladeIds.push(i);
                
                const rightX = x + (currentWidth / 2) * cos - curve * sin;
                const rightZ = z + (currentWidth / 2) * sin + curve * cos;
                positions.push(rightX, y, rightZ);
                uvs.push(1, t);
                bladeIds.push(i);
                
                const nx = sin;
                const ny = 0.3;
                const nz = -cos;
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                normals.push(nx/len, ny/len, nz/len);
                normals.push(nx/len, ny/len, nz/len);
            }
            
            for (let seg = 0; seg < this.BLADE_SEGMENTS; seg++) {
                const base = vOffset + seg * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 2, base + 1, base + 3);
            }
        }

        return { positions, uvs, normals, bladeIds, indices };
    }

    draw() {
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);
    }

    dispose() {
        if (this.vao) {
            gl.deleteVertexArray(this.vao);
            this.vao = null;
        }
    }
}
