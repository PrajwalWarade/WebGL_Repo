
const TerrainHeightMapType =
{
    TERRAIN_HEIGHT_MAP_TYPE_RAW: 0,
    TERRAIN_HEIGHT_MAP_TYPE_BMP: 1
};

class VertexType {
    constructor() {
        this.position;
        this.texcoord;
        this.normal;
        this.tangent;
        this.binormal;
        this.color;
    }

};

class HeightMapType {
    constructor() {
        this.x;
        this.y;
        this.z;

        this.nx;
        this.ny;
        this.nz;

        this.r;
        this.g;
        this.b;
    }

};

class ModelType {
    constructor() {
        this.x;
        this.y;
        this.z;

        this.tu;
        this.tv;

        this.nx;
        this.ny;
        this.nz;

        this.tx;
        this.ty;
        this.tz;

        this.bx;
        this.by;
        this.bz;

        this.r;
        this.g;
        this.b;
    }

};

class VectorType {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new VectorType(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (len > 0.0000001) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }
};


class TempVertexType {
    constructor() {
        this.x;
        this.y;
        this.z;

        this.tu;
        this.tv;

        this.nx;
        this.ny;
        this.nz;
    }

};

class TerrainConfig {
    constructor() {
        this.heightMapFilename;
        this.colorMapFilename;
        this.Height;
        this.Width;
        this.heightScale;
    }
};

class TerrainGeom {
    constructor() {
        this.vao;
        this.vertexBuffer = 0;
        this.indexBuffer = 0;
        this.vertexCount = 0;
        this.indexCount = 0;

        this.terrainHeight;
        this.terrainWidth;

        this.heightScale;
        this.terrainFilename;
        this.colorMapFilename;
        this.heightMap;
        this.terrainModel;
    }

    /**
     * Initialize Terrain
     * @param {TerrainConfig} terrainConfigs 
     */
    async Initialize(terrainConfigs) {
        if (terrainConfigs) {
            this.terrainHeight = terrainConfigs.Height;
            this.terrainWidth = terrainConfigs.Width;

            this.heightScale = terrainConfigs.heightScale;
            this.terrainFilename = terrainConfigs.heightMapFilename;
            this.colorMapFilename = terrainConfigs.colorMapFilename;
        }
        else {
            console.log("Please Provide The TerrainConfig");
            return;
        }

        // this.terrainHeight = 1025;
        // this.terrainWidth = 1025;

        // this.heightScale = 300.0;
        // this.terrainFilename = "./assets/terrain/Forest/heightmap.r16";
        // this.colorMapFilename = "./assets/terrain/Forest/colormap.bmp";

        await this.LoadRawHeightMap();
        await this.SetTerrainCoordinates();
        await this.CalculateNormals();
        await this.LoadColorMap();
        await this.BuildTerrainModel();

        await this.UnInitializeHeightMap();

        await this.CalculateTerrainVertexData();

        await this.InitializeBuffers();

        await this.UnInitializeTerrainModel();

        return true;
    }

    UnInitialize() {

    }

    Render() {

    }

    GetIndexCount() {

    }

    async InitializeBuffers() {
        var vertices;
        var indices;
        var i;

        this.vertexCount = (this.terrainWidth - 1) * (this.terrainHeight - 1) * 6;

        this.indexCount = this.vertexCount;

        let newArray = new Float32Array(this.vertexCount * 17);

        vertices = Array.from({ length: this.vertexCount }, () => new vec3.fromValues(0.0));
        indices = new Int32Array(this.indexCount);

        let j = 0;

        for (i = 0; i < this.indexCount; i++) {
            newArray[j++] = this.terrainModel[i].x;
            newArray[j++] = this.terrainModel[i].y;
            newArray[j++] = this.terrainModel[i].z;

            newArray[j++] = this.terrainModel[i].tu;
            newArray[j++] = this.terrainModel[i].tv;

            newArray[j++] = this.terrainModel[i].nx;
            newArray[j++] = this.terrainModel[i].ny;
            newArray[j++] = this.terrainModel[i].nz;

            newArray[j++] = this.terrainModel[i].tx;
            newArray[j++] = this.terrainModel[i].ty;
            newArray[j++] = this.terrainModel[i].tz;

            newArray[j++] = this.terrainModel[i].bx;
            newArray[j++] = this.terrainModel[i].by;
            newArray[j++] = this.terrainModel[i].bz;

            newArray[j++] = this.terrainModel[i].r;
            newArray[j++] = this.terrainModel[i].g;
            newArray[j++] = this.terrainModel[i].b;

            indices[i] = i;
        }

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, newArray, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 17 * 4, 0);
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 17 * 4, 3 * 4);
        gl.enableVertexAttribArray(1);

        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 17 * 4, 5 * 4);
        gl.enableVertexAttribArray(2);

        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 17 * 4, 8 * 4);
        gl.enableVertexAttribArray(3);

        gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 17 * 4, 11 * 4);
        gl.enableVertexAttribArray(4);

        gl.vertexAttribPointer(5, 3, gl.FLOAT, false, 17 * 4, 14 * 4);
        gl.enableVertexAttribArray(5);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    }

    UnInitializeBuffers() {

    }

    RenderBuffers() {

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    }

    async CalculateTerrainVertexData() {

        const vertexCount = this.vertexCount;

        // Create accumulators
        const tanSum = Array(vertexCount).fill(0).map(() => new VectorType());
        const binSum = Array(vertexCount).fill(0).map(() => new VectorType());
        const count = Array(vertexCount).fill(0);

        // --- PASS 1: accumulate tangents per triangle ---
        for (let i = 0; i < vertexCount; i += 3) {

            let v1 = this.terrainModel[i];
            let v2 = this.terrainModel[i + 1];
            let v3 = this.terrainModel[i + 2];

            let tangent = new VectorType();
            let binormal = new VectorType();

            this.CalculateTangent(v1, v2, v3, tangent, binormal);

            // accumulate
            tanSum[i].add(tangent);
            tanSum[i + 1].add(tangent);
            tanSum[i + 2].add(tangent);

            binSum[i].add(binormal);
            binSum[i + 1].add(binormal);
            binSum[i + 2].add(binormal);

            count[i]++; count[i + 1]++; count[i + 2]++;
        }

        // --- PASS 2: average, orthonormalize and assign ---
        for (let i = 0; i < vertexCount; i++) {

            let n = new VectorType(
                this.terrainModel[i].nx,
                this.terrainModel[i].ny,
                this.terrainModel[i].nz
            );

            let t = tanSum[i];
            let b = binSum[i];

            // --- Orthonormalize T against N (Gram-Schmidt) ---
            let dotNT = n.dot(t);
            t.x -= n.x * dotNT;
            t.y -= n.y * dotNT;
            t.z -= n.z * dotNT;

            t.normalize();

            // --- Correct binormal to be exactly cross(N, T) ---
            let correctedB = n.cross(t);
            correctedB.normalize();

            // Store final tangent/binormal
            this.terrainModel[i].tx = t.x;
            this.terrainModel[i].ty = t.y;
            this.terrainModel[i].tz = t.z;

            this.terrainModel[i].bx = correctedB.x;
            this.terrainModel[i].by = correctedB.y;
            this.terrainModel[i].bz = correctedB.z;
        }
    }


    CalculateTangent(v1, v2, v3, tangent, binormal) {

        const p1 = new VectorType(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
        const p2 = new VectorType(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);

        const s1 = v2.tu - v1.tu;
        const t1 = v2.tv - v1.tv;

        const s2 = v3.tu - v1.tu;
        const t2 = v3.tv - v1.tv;

        let den = (s1 * t2 - s2 * t1);
        if (Math.abs(den) < 0.000001) den = 1.0;    // avoid divide by zero

        const r = 1.0 / den;

        tangent.x = (t2 * p1.x - t1 * p2.x) * r;
        tangent.y = (t2 * p1.y - t1 * p2.y) * r;
        tangent.z = (t2 * p1.z - t1 * p2.z) * r;
        tangent.normalize();

        binormal.x = (s1 * p2.x - s2 * p1.x) * r;
        binormal.y = (s1 * p2.y - s2 * p1.y) * r;
        binormal.z = (s1 * p2.z - s2 * p1.z) * r;
        binormal.normalize();
    }


    async LoadColorMap() 
    {
        // Load PNG file
        const response = await fetch(this.colorMapFilename);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        
        console.log("Bitmap size:", bitmap.width, bitmap.height);
        console.log("Terrain size:", this.terrainWidth, this.terrainHeight);

        if (bitmap.width !== this.terrainWidth || bitmap.height !== this.terrainHeight) 
        {
            alert("Color map dimensions mismatch");
        }

        // Draw PNG into canvas to extract pixel data
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;


        // Put it into Heightmap
        let k = 0; 

        for (let j = 0; j < this.terrainHeight; j++) 
        {
            for (let i = 0; i < this.terrainWidth; i++) 
            {
                // Reversed Y indexing you because of heightmap
                const index = (this.terrainWidth * j) + i;

                this.heightMap[index].r = pixels[k]     / 255.0;
                this.heightMap[index].g = pixels[k + 1] / 255.0;
                this.heightMap[index].b = pixels[k + 2] / 255.0;

                k += 4;
            }
        }
    }


    async CalculateNormals() {
        // Initialize the normals array
        const normals = Array.from({ length: (this.terrainHeight - 1) * (this.terrainWidth - 1) }, () => new VectorType());

        // First loop to calculate the normals
        for (let j = 0; j < this.terrainHeight - 1; j++) {
            for (let i = 0; i < this.terrainWidth - 1; i++) {
                const index1 = ((j + 1) * this.terrainWidth) + i;
                const index2 = ((j + 1) * this.terrainWidth) + (i + 1);
                const index3 = (j * this.terrainWidth) + i;

                const vertex1 = [this.heightMap[index1].x, this.heightMap[index1].y, this.heightMap[index1].z];
                const vertex2 = [this.heightMap[index2].x, this.heightMap[index2].y, this.heightMap[index2].z];
                const vertex3 = [this.heightMap[index3].x, this.heightMap[index3].y, this.heightMap[index3].z];

                const vector1 = [
                    vertex1[0] - vertex3[0],
                    vertex1[1] - vertex3[1],
                    vertex1[2] - vertex3[2]
                ];

                const vector2 = [
                    vertex3[0] - vertex2[0],
                    vertex3[1] - vertex2[1],
                    vertex3[2] - vertex2[2]
                ];

                const index = (j * (this.terrainWidth - 1)) + i;

                normals[index].x = (vector1[1] * vector2[2]) - (vector1[2] * vector2[1]);
                normals[index].y = (vector1[2] * vector2[0]) - (vector1[0] * vector2[2]);
                normals[index].z = (vector1[0] * vector2[1]) - (vector1[1] * vector2[0]);

                const length = Math.sqrt(
                    (normals[index].x * normals[index].x) +
                    (normals[index].y * normals[index].y) +
                    (normals[index].z * normals[index].z)
                );

                normals[index].x /= length;
                normals[index].y /= length;
                normals[index].z /= length;
            }
        }

        // Second loop to average the normals
        for (let j = 0; j < this.terrainHeight; j++) {
            for (let i = 0; i < this.terrainWidth; i++) {
                const sum = [0.0, 0.0, 0.0];

                if (i > 0 && j > 0) {
                    let index = ((j - 1) * (this.terrainWidth - 1)) + (i - 1);
                    sum[0] += normals[index].x;
                    sum[1] += normals[index].y;
                    sum[2] += normals[index].z;
                }

                if (i < this.terrainWidth - 1 && j > 0) {
                    let index = ((j - 1) * (this.terrainWidth - 1)) + i;
                    sum[0] += normals[index].x;
                    sum[1] += normals[index].y;
                    sum[2] += normals[index].z;
                }

                if (i > 0 && j < this.terrainHeight - 1) {
                    let index = (j * (this.terrainWidth - 1)) + (i - 1);
                    sum[0] += normals[index].x;
                    sum[1] += normals[index].y;
                    sum[2] += normals[index].z;
                }

                if (i < this.terrainWidth - 1 && j < this.terrainHeight - 1) {
                    let index = (j * (this.terrainWidth - 1)) + i;
                    sum[0] += normals[index].x;
                    sum[1] += normals[index].y;
                    sum[2] += normals[index].z;
                }

                const length = Math.sqrt(
                    (sum[0] * sum[0]) +
                    (sum[1] * sum[1]) +
                    (sum[2] * sum[2])
                );

                const index = (j * this.terrainWidth) + i;

                this.heightMap[index].nx = sum[0] / length;
                this.heightMap[index].ny = sum[1] / length;
                this.heightMap[index].nz = sum[2] / length;
            }
        }

    }

    LoadSetupFile(path) {
        this.terrainFilename = path;
    }

    async LoadRawHeightMap() {
        var i, j, index;
        var imageSize;
        var rawImage;

        this.heightMap = Array.from({ length: this.terrainWidth * this.terrainHeight }, () => new HeightMapType());

        imageSize = this.terrainWidth * this.terrainHeight;

        await fetch(this.terrainFilename)
            .then(response => response.arrayBuffer())
            .then((result) => { rawImage = result }/* process result */);

        const uintArray = new Uint16Array(rawImage);

        console.log("Sample heights:",
                        uintArray[0],
                        uintArray[50],
                        uintArray[2000],
                        uintArray[5000]
                    );


        for (j = 0; j < this.terrainHeight; j++) {
            for (i = 0; i < this.terrainWidth; i++) {
                index = (this.terrainWidth * j) + i;

                const flippedIndex = (this.terrainWidth * j) + (this.terrainWidth - 1 - i);

                this.heightMap[index].y = (uintArray[flippedIndex] - 4745.0) * 5.0;
            }
        }

        return true;
    }

    async UnInitializeHeightMap() {
        this.heightMap = null;
    }

    SetTerrainCoordinates() {
        let i, j, index;

        for (j = 0; j < this.terrainHeight; j++) {
            for (i = 0; i < this.terrainWidth; i++) {
                index = (this.terrainWidth * j) + i;

                this.heightMap[index].x = parseFloat(i * 1.0);
                this.heightMap[index].z = -parseFloat(j * 1.0);

                this.heightMap[index].z = this.heightMap[index].z + parseFloat((this.terrainHeight - 1));

                this.heightMap[index].y = this.heightMap[index].y / 1000.0;
            }
        }

        return true;
    }

    async BuildTerrainModel() {
        let i, j, index, index1, index2, index3, index4;

        this.vertexCount = (this.terrainHeight - 1) * (this.terrainWidth - 1) * 6;

        this.terrainModel = Array.from({ length: this.vertexCount }, () => new ModelType());

        index = 0;

        for (j = 0; j < (this.terrainHeight - 1); j++) {
            for (i = 0; i < (this.terrainWidth - 1); i++) {

                index1 = (this.terrainWidth * j) + i;
                index2 = (this.terrainWidth * j) + (i + 1);
                index3 = (this.terrainWidth * (j + 1)) + i;
                index4 = (this.terrainWidth * (j + 1)) + (i + 1);

                this.terrainModel[index].x = this.heightMap[index1].x;
                this.terrainModel[index].y = this.heightMap[index1].y;
                this.terrainModel[index].z = this.heightMap[index1].z;
                this.terrainModel[index].tu = this.heightMap[index1].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index1].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index1].nx;
                this.terrainModel[index].ny = this.heightMap[index1].ny;
                this.terrainModel[index].nz = this.heightMap[index1].nz;
                this.terrainModel[index].r = this.heightMap[index1].r;
                this.terrainModel[index].g = this.heightMap[index1].g;
                this.terrainModel[index].b = this.heightMap[index1].b;
                index++;

                this.terrainModel[index].x = this.heightMap[index2].x;
                this.terrainModel[index].y = this.heightMap[index2].y;
                this.terrainModel[index].z = this.heightMap[index2].z;
                this.terrainModel[index].tu = this.heightMap[index2].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index2].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index2].nx;
                this.terrainModel[index].ny = this.heightMap[index2].ny;
                this.terrainModel[index].nz = this.heightMap[index2].nz;
                this.terrainModel[index].r = this.heightMap[index2].r;
                this.terrainModel[index].g = this.heightMap[index2].g;
                this.terrainModel[index].b = this.heightMap[index2].b;

                index++;

                this.terrainModel[index].x = this.heightMap[index3].x;
                this.terrainModel[index].y = this.heightMap[index3].y;
                this.terrainModel[index].z = this.heightMap[index3].z;
                this.terrainModel[index].tu = this.heightMap[index3].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index3].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index3].nx;
                this.terrainModel[index].ny = this.heightMap[index3].ny;
                this.terrainModel[index].nz = this.heightMap[index3].nz;
                this.terrainModel[index].r = this.heightMap[index3].r;
                this.terrainModel[index].g = this.heightMap[index3].g;
                this.terrainModel[index].b = this.heightMap[index3].b;

                index++;

                this.terrainModel[index].x = this.heightMap[index3].x;
                this.terrainModel[index].y = this.heightMap[index3].y;
                this.terrainModel[index].z = this.heightMap[index3].z;
                this.terrainModel[index].tu = this.heightMap[index3].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index3].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index3].nx;
                this.terrainModel[index].ny = this.heightMap[index3].ny;
                this.terrainModel[index].nz = this.heightMap[index3].nz;
                this.terrainModel[index].r = this.heightMap[index3].r;
                this.terrainModel[index].g = this.heightMap[index3].g;
                this.terrainModel[index].b = this.heightMap[index3].b;

                index++;

                this.terrainModel[index].x = this.heightMap[index2].x;
                this.terrainModel[index].y = this.heightMap[index2].y;
                this.terrainModel[index].z = this.heightMap[index2].z;
                this.terrainModel[index].tu = this.heightMap[index2].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index2].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index2].nx;
                this.terrainModel[index].ny = this.heightMap[index2].ny;
                this.terrainModel[index].nz = this.heightMap[index2].nz;
                this.terrainModel[index].r = this.heightMap[index2].r;
                this.terrainModel[index].g = this.heightMap[index2].g;
                this.terrainModel[index].b = this.heightMap[index2].b;

                index++;

                this.terrainModel[index].x = this.heightMap[index4].x;
                this.terrainModel[index].y = this.heightMap[index4].y;
                this.terrainModel[index].z = this.heightMap[index4].z;
                this.terrainModel[index].tu = this.heightMap[index4].x / (this.terrainWidth - 1);
                this.terrainModel[index].tv = this.heightMap[index4].z / (this.terrainHeight - 1);
                this.terrainModel[index].nx = this.heightMap[index4].nx;
                this.terrainModel[index].ny = this.heightMap[index4].ny;
                this.terrainModel[index].nz = this.heightMap[index4].nz;
                this.terrainModel[index].r = this.heightMap[index4].r;
                this.terrainModel[index].g = this.heightMap[index4].g;
                this.terrainModel[index].b = this.heightMap[index4].b;

                index++;
            }
        }
    }

    async UnInitializeTerrainModel() {
        this.terrainModel = null;
        this.heightMap = null;
    }

};

