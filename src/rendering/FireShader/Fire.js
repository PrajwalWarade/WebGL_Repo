// Reference: https://codesandbox.io/p/sandbox/webgl-fire-lb78iq?file=%2Findex.html
class Fire {
    constructor() {
        this.shaderProgramObject = null;

        this.sliceSpacing = 0.0;
        this.points = [];
        this.texcoords = [];
        this.indexes = [];
        this.positionCorners;
        this.texcoordCorners;
        this.cornerNeighbors;
        this.incomingEdges;
        this.viewVector = vec3.create();


        this.modelMatrixUniform;
        this.viewMatrixUniform;
        this.projectionMatrixUniform;
        this.timeUniform;
        this.fireProfileUniform;
        this.nzwUniform;

        this.fireTexture = null;
        this.nzwTexture = null;

        this.vao = null;
        this.vboPosition = null;
        this.vboTexCoord = null;
        this.vboElements = null;
    }

    async initialize() {

        this.sliceSpacing = 0.05;

        this.positionCorners = [
            vec3.fromValues(-1.0, -2.0, -1.0),
            vec3.fromValues(1.0, -2.0, -1.0),
            vec3.fromValues(-1.0, 2.0, -1.0),
            vec3.fromValues(1.0, 2.0, -1.0),
            vec3.fromValues(-1.0, -2.0, 1.0),
            vec3.fromValues(1.0, -2.0, 1.0),
            vec3.fromValues(-1.0, 2.0, 1.0),
            vec3.fromValues(1.0, 2.0, 1.0)
        ];

        this.texcoordCorners = [
            vec3.fromValues(0.0, 0.0, 0.0),
            vec3.fromValues(1.0, 0.0, 0.0),
            vec3.fromValues(0.0, 1.0, 0.0),
            vec3.fromValues(1.0, 1.0, 0.0),
            vec3.fromValues(0.0, 0.0, 1.0),
            vec3.fromValues(1.0, 0.0, 1.0),
            vec3.fromValues(0.0, 1.0, 1.0),
            vec3.fromValues(1.0, 1.0, 1.0),
        ];

        this.cornerNeighbors = [
            [1, 2, 4],
            [0, 5, 3],
            [0, 3, 6],
            [1, 7, 2],
            [0, 6, 5],
            [1, 4, 7],
            [2, 7, 4],
            [3, 5, 6]
        ];

        this.incomingEdges = [
            [-1, 2, 4, -1, 1, -1, -1, -1],
            [5, -1, -1, 0, -1, 3, -1, -1],
            [3, -1, -1, 6, -1, -1, 0, -1],
            [-1, 7, 1, -1, -1, -1, -1, 2],
            [6, -1, -1, -1, -1, 0, 5, -1],
            [-1, 4, -1, -1, 7, -1, -1, 1],
            [-1, -1, 7, -1, 2, -1, -1, 4],
            [-1, -1, -1, 5, -1, 6, 3, -1]
        ];


        this.viewVector = vec3.create();

        this.slice();

        this.shaderProgramObject = ShaderManger.createProgram(gl);

        await Promise.all([
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'fire/fire.vs', gl.VERTEX_SHADER)),
            gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'fire/fire.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_POSITION, "aPosition");
        gl.bindAttribLocation(this.shaderProgramObject, webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, "aTexCoord");

        ShaderManger.linkProgram(gl, this.shaderProgramObject);

        this.modelMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uModelMatrix");
        this.viewMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uViewMatrix");
        this.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgramObject, "uProjectionMatrix");
        this.timeUniform = gl.getUniformLocation(this.shaderProgramObject, "uTime");
        this.fireProfileUniform = gl.getUniformLocation(this.shaderProgramObject, "uFireProfile");
        this.nzwUniform = gl.getUniformLocation(this.shaderProgramObject, "nzw");

        this.fireTexture = TextureManger.LoadHighQualityTextureAndWrap("assets/textures/Fire/fire.png", gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
        this.nzwTexture = TextureManger.LoadHighQualityTextureAndWrap("assets/textures/Fire/nzw.png", gl.REPEAT, gl.REPEAT);


        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        {
            // position 
            this.vboPosition = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_POSITION);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }


        {
            // texcoords
            this.vboTexCoord = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(webGLMacros.PRJ_ATTRIBUTE_TEXTURE0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        {
            // elements
            this.vboElements = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboElements);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }

        gl.bindVertexArray(null);

        console.log("after init: points = " + this.points);
        console.log("after init: texcoords = " + this.texcoords);
        console.log("after init: indexes = " + this.indexes);
    }


    equals(a, b) {
        var a0 = a[0],
            a1 = a[1],
            a2 = a[2],
            a3 = a[3];
        var b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3];
        return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
    }

    render() {

        gl.useProgram(this.shaderProgramObject);

        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.enable(gl.BLEND);

        var modelViewMatrix = mat4.create();
        var modelMatrix = mat4.create();
        var viewMatrix = camera.getViewMatrix();

        mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -4.0]);
        mat4.multiply(modelViewMatrix, modelViewMatrix, viewMatrix);
        mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);

        gl.uniformMatrix4fv(this.modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(this.viewMatrixUniform, false, camera.getViewMatrix());
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, perspectiveProjectionMatrix);

        gl.uniform1f(this.timeUniform, ELAPSED_TIME);

        const viewVector = vec3.create();
        vec3.normalize(viewVector, camera.getEye());
        if (!vec3.equals(viewVector, this.viewVector)) {
            console.log("generating new points after slicing.");
            this.viewVector = viewVector;
            this.slice();

            gl.bindVertexArray(this.vao);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboElements);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            gl.bindVertexArray(null);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.nzwTexture);
        gl.uniform1i(this.nzwUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.fireTexture);
        gl.uniform1i(this.fireProfileUniform, 1);

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboElements);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.DYNAMIC_DRAW);
        gl.drawElements(gl.TRIANGLES, this.indexes.length, gl.UNSIGNED_SHORT, 0);
        //gl.drawArrays(gl.TRIANGLES, 0, this.points.length / 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

        gl.disable(gl.BLEND);

        gl.useProgram(null);
    }

    update(timeDelta) {
    }

    getShaderProgramObject() {
        return this.shaderProgramObject;
    }

    mydot(vec, vec2) {
        return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
    };

    myscale(vec, val, dest) {
        if (!dest || vec === dest) {
            vec[0] *= val;
            vec[1] *= val;
            vec[2] *= val;
            return vec;
        }

        dest[0] = vec[0] * val;
        dest[1] = vec[1] * val;
        dest[2] = vec[2] * val;
        return dest;
    };

    mysubtract(vec, vec2, dest) {
        if (!dest || vec === dest) {
            vec[0] -= vec2[0];
            vec[1] -= vec2[1];
            vec[2] -= vec2[2];
            return vec;
        }

        dest[0] = vec[0] - vec2[0];
        dest[1] = vec[1] - vec2[1];
        dest[2] = vec[2] - vec2[2];
        return dest;
    };

    myadd(vec, vec2, dest) {
        if (!dest || vec === dest) {
            vec[0] += vec2[0];
            vec[1] += vec2[1];
            vec[2] += vec2[2];
            return vec;
        }

        dest[0] = vec[0] + vec2[0];
        dest[1] = vec[1] + vec2[1];
        dest[2] = vec[2] + vec2[2];
        return dest;
    };

    slice() {
        console.log("slice() called.");

        this.points = [];
        this.texcoords = [];
        this.indexes = [];

        var cornerDistance = [];
        cornerDistance[0] = this.mydot(this.positionCorners[0], this.viewVector);
        var maxCorner = 0;
        var minDistance = cornerDistance[0];
        var maxDistance = cornerDistance[0];
        for (var i = 1; i < 8; ++i) {
            cornerDistance[i] = this.mydot(this.positionCorners[i], this.viewVector);
            if (cornerDistance[i] > maxDistance) {
                maxCorner = i;
                maxDistance = cornerDistance[i];
            }
            if (cornerDistance[i] < minDistance) {
                minDistance = cornerDistance[i];
            }
        }

        console.log("Corner Distance = " + cornerDistance);

        // Aligning slices
        var sliceDistance =
            Math.floor(maxDistance / this.sliceSpacing) * this.sliceSpacing;

        var activeEdges = [];
        var firstEdge = 0;
        var nextEdge = 0;
        var expirations = new PriorityQueue();

        var createEdge = function (startIndex, endIndex) {
            if (nextEdge >= 12) return undefined;
            var activeEdge = {
                expired: false,
                startIndex: startIndex,
                endIndex: endIndex
            };
            var range = cornerDistance[startIndex] - cornerDistance[endIndex];
            if (range != 0.0) {
                var irange = 1.0 / range;

                activeEdge.deltaPos = this.myscale(
                    this.mysubtract(
                        this.positionCorners[endIndex],
                        this.positionCorners[startIndex],
                        vec3.create()
                    ),
                    irange
                );

                activeEdge.deltaTex = this.myscale(
                    this.mysubtract(
                        this.texcoordCorners[endIndex],
                        this.texcoordCorners[startIndex],
                        vec3.create()
                    ),
                    irange
                );

                var step = cornerDistance[startIndex] - sliceDistance;

                activeEdge.pos = this.myadd(
                    this.myscale(activeEdge.deltaPos, step, vec3.create()),
                    this.positionCorners[startIndex]
                );

                activeEdge.tex = this.myadd(
                    this.myscale(activeEdge.deltaTex, step, vec3.create()),
                    this.texcoordCorners[startIndex]
                );

                this.myscale(activeEdge.deltaPos, this.sliceSpacing);
                this.myscale(activeEdge.deltaTex, this.sliceSpacing);
            }

            expirations.push(activeEdge, cornerDistance[endIndex]);
            activeEdge.cur = nextEdge;
            activeEdges[nextEdge++] = activeEdge;
            return activeEdge;
        };

        for (i = 0; i < 3; ++i) {
            var activeEdge = createEdge.call(
                this,
                maxCorner,
                this.cornerNeighbors[maxCorner][i]
            );
            activeEdge.prev = (i + 2) % 3;
            activeEdge.next = (i + 1) % 3;
        }

        var nextIndex = 0;
        while (sliceDistance > minDistance) {
            while (expirations.top().priority >= sliceDistance) {
                var edge = expirations.pop().object;
                if (edge.expired) {
                    continue;
                }
                if (
                    edge.endIndex != activeEdges[edge.prev].endIndex &&
                    edge.endIndex != activeEdges[edge.next].endIndex
                ) {
                    // split this edge.
                    edge.expired = true;

                    // create two new edges.
                    var activeEdge1 = createEdge.call(
                        this,
                        edge.endIndex,
                        this.incomingEdges[edge.endIndex][edge.startIndex]
                    );
                    activeEdge1.prev = edge.prev;
                    activeEdges[edge.prev].next = nextEdge - 1;
                    activeEdge1.next = nextEdge;

                    var activeEdge2 = createEdge.call(
                        this,
                        edge.endIndex,
                        this.incomingEdges[edge.endIndex][activeEdge1.endIndex]
                    );
                    activeEdge2.prev = nextEdge - 2;
                    activeEdge2.next = edge.next;
                    activeEdges[activeEdge2.next].prev = nextEdge - 1;
                    firstEdge = nextEdge - 1;
                } else {
                    // merge edge.
                    var prev;
                    var next;
                    if (edge.endIndex == activeEdges[edge.prev].endIndex) {
                        prev = activeEdges[edge.prev];
                        next = edge;
                    } else {
                        prev = edge;
                        next = activeEdges[edge.next];
                    }
                    prev.expired = true;
                    next.expired = true;

                    // make new edge
                    var activeEdge = createEdge.call(
                        this,
                        edge.endIndex,
                        this.incomingEdges[edge.endIndex][prev.startIndex]
                    );
                    activeEdge.prev = prev.prev;
                    activeEdges[activeEdge.prev].next = nextEdge - 1;
                    activeEdge.next = next.next;
                    activeEdges[activeEdge.next].prev = nextEdge - 1;
                    firstEdge = nextEdge - 1;
                }
            }

            var cur = firstEdge;
            var count = 0;
            do {
                ++count;
                var activeEdge = activeEdges[cur];
                this.points.push(activeEdge.pos[0]);
                this.points.push(activeEdge.pos[1]);
                this.points.push(activeEdge.pos[2]);
                this.texcoords.push(activeEdge.tex[0]);
                this.texcoords.push(activeEdge.tex[1]);
                this.texcoords.push(activeEdge.tex[2]);
                this.myadd(activeEdge.pos, activeEdge.deltaPos);
                this.myadd(activeEdge.tex, activeEdge.deltaTex);
                cur = activeEdge.next;
            } while (cur != firstEdge);
            for (i = 2; i < count; ++i) {
                this.indexes.push(nextIndex);
                this.indexes.push(nextIndex + i - 1);
                this.indexes.push(nextIndex + i);
            }
            nextIndex += count;
            sliceDistance -= this.sliceSpacing;
        }

        console.log("CPoints = " + this.points);
        console.log("CTexCoords = " + this.texcoords);
        console.log("CIndexes = " + this.indexes);
    };


    uninitialize() {

    }
};