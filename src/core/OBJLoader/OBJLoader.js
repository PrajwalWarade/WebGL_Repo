class OBJMesh {

    constructor(){
        this.obj;
        this.materials
        this.Part_Main;
    }

    getPartMesh(){
        return this.Part_Main;
    }

    async loadMesh(FileName) {

        var text;
        var textObj = FileName.concat('.obj');
        await fetch(textObj)
            .then(response => response.text())
            .then((result) => { text = result }/* process result */)

        this.obj = this.loadOBJ(text);

        const baseHref = new URL(textObj, window.location.href);

        var matTexts;
        await fetch(FileName.concat('.mtl'))
            .then(response => response.text())
            .then((result) => { matTexts = result }/* process result */)

        this.materials = this.parseMTL(matTexts);
        const textures = {
            defaultWhite: this.create1PixelTexture(gl, [255, 255, 255, 255]),
            defaultNormal: this.create1PixelTexture(gl, [127, 127, 255, 0]),
        };

        // load texture for materials
        for (const material of Object.values(this.materials)) {
            Object.entries(material)
                .filter(([key]) => key.endsWith('Map'))
                .forEach(([key, filename]) => {
                    let texture = textures[filename];
                    if (!texture) {
                        const textureHref = new URL(filename, baseHref).href;
                        texture = this.createTexture(gl, textureHref);
                        textures[filename] = texture;
                    }
                    material[key] = texture;
                });
        }

        // hack the materials so we can see the specular map
        Object.values(this.materials).forEach(m => {
            m.shininess = 25;
            m.specular = [3, 2, 1];
        });

        const defaultMaterial = {
            diffuse: [1, 1, 1],
            diffuseMap: textures.defaultWhite,
            normalMap: textures.defaultNormal,
            ambient: [0, 0, 0],
            specular: [1, 1, 1],
            specularMap: textures.defaultWhite,
            shininess: 400,
            opacity: 1,
        };

        this.Part_Main = this.obj.geometries.map(({ material, data }) => {
            // {
            //   position: [...],
            //   texcoord: [...],
            //   normal: [...],
            // }

            if (data.color) {
                if (data.position.length === data.color.length) {
                    data.color = { numComponents: 3, data: data.color };
                }
            } else {
                data.color = { value: [1, 1, 1, 1] };
            }

            if (data.texcoord && data.normal) {
                data.tangent = this.generateTangents_New(data.position, data.texcoord);
            } else {
                data.tangent = { value: [1, 0, 0] };
            }

            if (!data.texcoord) {
                data.texcoord = { value: [0, 0] };
            }

            if (!data.normal) {
                data.normal = { value: [0, 0, 1] };
            }

            const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);

            return {
                material: {
                    ...defaultMaterial,
                    ...this.materials[material],
                },
                bufferInfo,
            };
        });

        function getExtents(positions) {
            const min = positions.slice(0, 3);
            const max = positions.slice(0, 3);
            for (let i = 3; i < positions.length; i += 3) {
                for (let j = 0; j < 3; ++j) {
                    const v = positions[i + j];
                    min[j] = Math.min(v, min[j]);
                    max[j] = Math.max(v, max[j]);
                }
            }
            return { min, max };
        }
        /*
            function getGeometriesExtents(geometries) {
                return geometries.reduce(({ min, max }, { data }) => {
                    const minMax = getExtents(data.position);
                    return {
                        min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
                        max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
                    };
                }, {
                    min: Array(3).fill(Number.POSITIVE_INFINITY),
                    max: Array(3).fill(Number.NEGATIVE_INFINITY),
                });
            }
        */
    }

    loadOBJ(t) {
        const text = t;

        // because indices are base 1 let's just fill in the 0th data
        const objPositions = [[0, 0, 0]];
        const objTexcoords = [[0, 0]];
        const objNormals = [[0, 0, 0]];
        const objColors = [[0, 0, 0]];

        // same order as `f` indices
        const objVertexData = [
            objPositions,
            objTexcoords,
            objNormals,
            objColors,
        ];

        // same order as `f` indices
        let webglVertexData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
            [],   // colors
        ];

        const materialLibs = [];
        const geometries = [];
        let geometry;
        let groups = ['default'];
        let material = 'default';
        let object = 'default';

        const noop = () => { };

        function newGeometry() {
            // If there is an existing geometry and it's
            // not empty then start a new one.
            if (geometry && geometry.data.position.length) {
                geometry = undefined;
            }
        }

        function setGeometry() {
            if (!geometry) {
                const position = [];
                const texcoord = [];
                const normal = [];
                const color = [];
                webglVertexData = [
                    position,
                    texcoord,
                    normal,
                    color,
                ];
                geometry = {
                    object,
                    groups,
                    material,
                    data: {
                        position,
                        texcoord,
                        normal,
                        color,
                    },
                };
                geometries.push(geometry);
            }
        }

        function addVertex(vert) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
                if (!objIndexStr) {
                    return;
                }
                const objIndex = parseInt(objIndexStr);
                const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
                webglVertexData[i].push(...objVertexData[i][index]);
                // if this is the position index (index 0) and we parsed
                // vertex colors then copy the vertex colors to the webgl vertex color data
                if (i === 0 && objColors.length > 1) {
                    geometry.data.color.push(...objColors[index]);
                }
            });
        }

        const keywords = {
            v(parts) {
                // if there are more than 3 values here they are vertex colors
                if (parts.length > 3) {
                    objPositions.push(parts.slice(0, 3).map(parseFloat));
                    objColors.push(parts.slice(3).map(parseFloat));
                } else {
                    objPositions.push(parts.map(parseFloat));
                }
            },
            vn(parts) {
                objNormals.push(parts.map(parseFloat));
            },
            vt(parts) {
                // should check for missing v and extra w?
                objTexcoords.push(parts.map(parseFloat));
            },
            f(parts) {
                setGeometry();
                const numTriangles = parts.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    addVertex(parts[0]);
                    addVertex(parts[tri + 1]);
                    addVertex(parts[tri + 2]);
                }
            },
            s: noop,    // smoothing group
            mtllib(parts, unparsedArgs) {
                // the spec says there can be multiple filenames here
                // but many exist with spaces in a single filename
                materialLibs.push(unparsedArgs);
            },
            usemtl(parts, unparsedArgs) {
                material = unparsedArgs;
                newGeometry();
            },
            g(parts) {
                groups = parts;
                newGeometry();
            },
            o(parts, unparsedArgs) {
                object = unparsedArgs;
                newGeometry();
            },
        };

        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = String(text).split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                // console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            handler(parts, unparsedArgs);
        }

        // remove any arrays that have no entries.
        for (const geometry of geometries) {
            geometry.data = Object.fromEntries(
                Object.entries(geometry.data).filter(([, array]) => array.length > 0));
        }

        return {
            geometries,
            materialLibs,
        };
    }

    parseMapArgs(unparsedArgs) {
        // TODO: handle options
        return unparsedArgs;
    }

    parseMTL(t) {
        const text = t;
        const materials = {};
        let material;

        const keywords = {
            newmtl(parts, unparsedArgs) {
                material = {};
                materials[unparsedArgs] = material;
            },
            /* eslint brace-style:0 */
            Ns(parts) { material.shininess = parseFloat(parts[0]); },
            Ka(parts) { material.ambient = parts.map(parseFloat); },
            Kd(parts) { material.diffuse = parts.map(parseFloat); },
            Ks(parts) { material.specular = parts.map(parseFloat); },
            Ke(parts) { material.emissive = parts.map(parseFloat); },
            map_Kd(parts, unparsedArgs) { material.diffuseMap = unparsedArgs; },
            map_Ns(parts, unparsedArgs) { material.specularMap = unparsedArgs; },
            map_Bump(parts, unparsedArgs) { material.normalMap = unparsedArgs; },
            Ni(parts) { material.opticalDensity = parseFloat(parts[0]); },
            d(parts) { material.opacity = parseFloat(parts[0]); },
            illum(parts) { material.illum = parseInt(parts[0]); },
        };

        const keywordRE = /(\w*)(?: )*(.*)/;
        var i = 0;
        while (text == undefined) {
            i++;
        }
        const lines = String(text).split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                // console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            handler(parts, unparsedArgs);
        }

        return materials;
    }

    generateTangents_New(position, texcoord) {

        const tangents = [];
        let j = 0;
        for (let i = 0; i < position.length; i = i + 3) {

            var pos1 = new Float32Array([position[i], position[i + 1], position[i + 2]]); //vertex
            i = i + 3;
            var pos2 = new Float32Array([position[i], position[i + 1], position[i + 2]]);
            i = i + 3;
            var pos3 = new Float32Array([position[i], position[i + 1], position[i + 2]]);

            var uv1 = new Float32Array([texcoord[j], texcoord[j + 1]]); //texcoords
            j = j + 2;
            var uv2 = new Float32Array([texcoord[j], texcoord[j + 1]]);
            j = j + 2;
            var uv3 = new Float32Array([texcoord[j], texcoord[j + 1]]);
            j = j + 2;

            var edge1 = new Float32Array([pos2[0] - pos1[0], pos2[1] - pos1[1], pos2[2] - pos1[2]]);
            var edge2 = new Float32Array([pos3[0] - pos1[0], pos3[1] - pos1[1], pos3[2] - pos1[2]]);

            var deltaUV1 = new Float32Array([uv2[0] - uv1[0], uv2[1] - uv1[1]]);
            var deltaUV2 = new Float32Array([uv3[0] - uv1[0], uv3[1] - uv1[1]]);

            var f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

            //normalize this inside shader
            tangents.push(f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]));
            tangents.push(f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]));
            tangents.push(f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]));

            tangents.push(f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]));
            tangents.push(f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]));
            tangents.push(f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]));

            tangents.push(f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]));
            tangents.push(f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]));
            tangents.push(f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]));

        }

        return tangents;
    }


    create1PixelTexture(gl, pixel) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(pixel));
        return texture;
    }

    makeIndexIterator(indices) {
        let ndx = 0;
        const fn = () => indices[ndx++];
        fn.reset = () => { ndx = 0; };
        fn.numElements = indices.length;
        return fn;
    }

    makeUnindexedIterator(positions) {
        let ndx = 0;
        const fn = () => ndx++;
        fn.reset = () => { ndx = 0; };
        fn.numElements = positions.length / 3;
        return fn;
    }

    create1PixelTexture(gl, pixel) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(pixel));
        return texture;
    }

    createTexture(gl, url) {
        const texture = this.create1PixelTexture(gl, [128, 192, 255, 255]);

        const image = new Image();
        image.src = url;
        image.addEventListener('load', function () {

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        });
        return texture;
    }

};
