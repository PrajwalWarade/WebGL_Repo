class MaterialInfo {
    constructor() {
        this.diffuse_color;
        this.base_color;
        this.metallic_factor;
        this.roughness_factor;
        this.shinniness_factor;
        this.emissive_factor;
        this.opacity_factor;
        this.refrative_factor;

        this.diffuse_texture;
        this.normal_texture;
    }
}

class Model {
    constructor() {
        this.meshArray = [];
        this.boneInfoMap = [];
        this.boneCounter = 0;
        this.animator = [];
    }
}

class MeshAssimp {
    constructor(vao, eb, count, materialInfo, vbo_position, vbo_normals, vbo_texcoords, vbo_tangents, vbo_bitangents, vbo_bone, vbo_weight) {
        this.vao = vao;
        this.vbo_position = vbo_position;
        this.vbo_normals = vbo_normals;
        this.vbo_texcoords = vbo_texcoords;
        this.vbo_tangents = vbo_tangents;
        this.vbo_bitangents = vbo_bitangents;
        this.vbo_bone = vbo_bone;
        this.vbo_weight = vbo_weight;
        this.eb = eb;
        this.count = count;
        this.materialInfo = materialInfo;
    }
}


class AssimpNodeData {
    constructor() {
        this.name = "";
        this.transformation = 0;
        this.children = [];
    }
}

class BoneInfo {
    constructor(id, offset) {
        this.id = id;
        this.offsetMatrix = offset;
    }
}
class AnimatorAssimp {
    constructor(duration, ticksPerSecond, boneInfoMap, rootNode) {
        this.currentTime = 0.0;
        this.finalBoneMatrices = [];
        for (var i = 0; i < 100; i++) {
            this.finalBoneMatrices.push(mat4.create());
        }
        this.duration = duration;
        this.ticksPerSecond = ticksPerSecond;
        this.bones = [];
        this.boneInfoMap = boneInfoMap;
        this.rootNode = rootNode;
    }
}

class KeyPosition {
    constructor(translate, timeStamp) {
        this.translate = vec3.create();
        vec3.set(this.translate, translate[0], translate[1], translate[2]);
        this.timeStamp = timeStamp;
    }
}
class KeyRotation {
    constructor(rotate, timeStamp) {
        this.rotate = quat.create();
        quat.set(this.rotate, rotate[1], rotate[2], rotate[3], rotate[0]);
        quat.normalize(this.rotate, this.rotate);
        this.timeStamp = timeStamp;
    }
}
class KeyScale {
    constructor(scale, timeStamp) {
        this.scale = vec3.create();
        vec3.set(this.scale, scale[0], scale[1], scale[2]);
        this.timeStamp = timeStamp;
    }
}
class Bone {
    constructor(id, name, localTransform) {
        this.id = id;
        this.name = name;
        this.transform = localTransform;
        this.positionkeys = [];
        this.rotationkeys = [];
        this.scalingkeys = [];
    }
}

class AssimpModelLoader {
    constructor() {
        this.Textures = {};
        this.Model;

        this.transformBuffer = null;
        this.instanceCount = 0;
    }

    loadModel = (modelName, transformMatrix) => {
        var tempmodel = ModelsMap.find(o => o.name === modelName)
        if (tempmodel === undefined || tempmodel.json === undefined) {
            console.log("Upadte Model in src/scenes/ModelsMap.js" + modelName)
            return;
        }
        this.Model = new Model();
        this.loadMesh(this.Model, tempmodel.json, tempmodel.directory);
        this.loadAnimation(this.Model, tempmodel.json);

        if (transformMatrix) {
            var Data = [];
            for (var i = 0; i < transformMatrix.length; i++) {
                let mat = transformMatrix[i];
                Data.push(...mat);
                // for (var j = 0; j < mat.length; j++) {
                //     Data.push(mat[j]);
                // }

                this.instanceCount = this.instanceCount + 1;
            }

            this.transformBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data), gl.DYNAMIC_DRAW);

            gl.vertexAttribPointer(7, 4, gl.FLOAT, false, 64, 0);
            gl.vertexAttribPointer(8, 4, gl.FLOAT, false, 64, 16);
            gl.vertexAttribPointer(9, 4, gl.FLOAT, false, 64, 32);
            gl.vertexAttribPointer(10, 4, gl.FLOAT, false, 64, 48);

            gl.vertexAttribDivisor(7, 1);
            gl.vertexAttribDivisor(8, 1);
            gl.vertexAttribDivisor(9, 1);
            gl.vertexAttribDivisor(10, 1);

            gl.enableVertexAttribArray(7);
            gl.enableVertexAttribArray(8);
            gl.enableVertexAttribArray(9);
            gl.enableVertexAttribArray(10);

        }

        transformMatrix = null;

    }

    updateInstanceTransforMatrix(transformMatrix) {
        if (transformMatrix) {
            var Data = [];
            for (var i = 0; i < transformMatrix.length; i++) {
                let mat = transformMatrix[i];

                for (var j = 0; j < mat.length; j++) {
                    Data.push(mat[j]);
                }

                this.instanceCount = this.instanceCount + 1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Data), gl.DYNAMIC_DRAW);

            gl.vertexAttribPointer(7, 4, gl.FLOAT, false, 64, 0);
            gl.vertexAttribPointer(8, 4, gl.FLOAT, false, 64, 16);
            gl.vertexAttribPointer(9, 4, gl.FLOAT, false, 64, 32);
            gl.vertexAttribPointer(10, 4, gl.FLOAT, false, 64, 48);

            gl.vertexAttribDivisor(7, 1);
            gl.vertexAttribDivisor(8, 1);
            gl.vertexAttribDivisor(9, 1);
            gl.vertexAttribDivisor(10, 1);

            gl.enableVertexAttribArray(7);
            gl.enableVertexAttribArray(8);
            gl.enableVertexAttribArray(9);
            gl.enableVertexAttribArray(10);

        }
    }

    loadMesh = (modelObj, json, directory) => {
        this.processNode(modelObj, directory, json, json.rootnode)
    }

    loadMaterials = (material, directory) => {
        var texturesArray = []
        var materialInfo = new MaterialInfo();
        for (var i = 0; i < material.length; i++) {
            if (material[i].key != undefined && material[i].key === "$tex.file" && material[i].semantic === 1) {
                var texFile = directory + '/' + material[i].value
                // console.log(texFile);
                if (this.Textures[texFile] === undefined) {
                    this.Textures[texFile] = TextureManger.LoadTexture(texFile);
                }
                texturesArray.push(this.Textures[texFile])
                materialInfo.diffuse_texture = this.Textures[texFile];
            }
            else if (material[i].key != undefined && material[i].key === "$tex.file" && material[i].semantic === 6) {
                var texFile = directory + '/' + material[i].value
                if (this.Textures[texFile] == undefined) {
                    this.Textures[texFile] = TextureManger.LoadTexture(texFile);
                }
                texturesArray.push(this.Textures[texFile])
                materialInfo.normal_texture = this.Textures[texFile];
            } else if (material[i].key != undefined && material[i].key === "$clr.diffuse") {
                var value = vec4.fromValues(material[i].value[0], material[i].value[1], material[i].value[2], material[i].value[3]);
                if (value[0] < 0.1 && value[1] < 0.1 && value[2] < 0.1)
                    value = vec4.fromValues(0.5, 0.5, 0.5, 1.0);
                materialInfo.diffuse_color = value;
            }
            else if (material[i].key != undefined && material[i].key === "$clr.base") {
                var value = vec4.fromValues(material[i].value[0], material[i].value[1], material[i].value[2], material[i].value[3]);
                materialInfo.base_color = value;
            }
            else if (material[i].key != undefined && material[i].key === "$mat.metallicFactor") {
                var value = parseFloat(material[i].value);
                materialInfo.metallic_factor = value;
            }
            else if (material[i].key != undefined && material[i].key === "$mat.roughnessFactor") {
                var value = parseFloat(material[i].value);
                materialInfo.roughness_factor = value;
            }
            else if (material[i].key != undefined && material[i].key === "$mat.shininess") {
                var value = parseFloat(material[i].value);
                materialInfo.shinniness_factor = value;
            }
            else if (material[i].key != undefined && material[i].key === "$clr.emissive") {
                var value = vec3.fromValues(material[i].value[0], material[i].value[1], material[i].value[2]);
                materialInfo.emissive_factor = value;
            }
            else if (material[i].key != undefined && material[i].key === "$mat.opacity") {
                var value = parseFloat(material[i].value);
                materialInfo.opacity_factor = value;
            }
            else if (material[i].key != undefined && material[i].key === "$mat.refracti") {
                var value = parseFloat(material[i].value);
                materialInfo.refrative_factor = value;
            }

        }
        return materialInfo
    }

    processMesh = (model, path, data, mesh) => {
        var vertices = new Float32Array(mesh.vertices)
        var normals = new Float32Array(mesh.normals)
        var tangents = new Float32Array(mesh.tangents)
        var bitangents = new Float32Array(mesh.bitangents)
        var normals = new Float32Array(mesh.normals)
        var texcoords;
        if (mesh.texturecoords) {
            texcoords = new Float32Array(mesh.texturecoords[0]);
        }
        var boneIdsArr = new Int32Array(mesh.vertices.length / 3 * 4)
        for (var j = 0; j < boneIdsArr.length; j++) {
            boneIdsArr[j] = -1
        }
        var weightArr = new Float32Array(mesh.vertices.length / 3 * 4)

        var faceArray = new Uint16Array(mesh.faces.length * 3)
        for (var j = 0; j < mesh.faces.length; j++) {
            faceArray[j * 3 + 0] = mesh.faces[j][0]
            faceArray[j * 3 + 1] = mesh.faces[j][1]
            faceArray[j * 3 + 2] = mesh.faces[j][2]
        }

        for (var boneIndex = 0; mesh.bones != undefined && boneIndex < mesh.bones.length; boneIndex++) {
            var boneID = -1
            var boneName = mesh.bones[boneIndex].name
            if (model.boneInfoMap[boneName] == undefined) {
                var offset = mat4.create()
                mat4.transpose(offset, mesh.bones[boneIndex].offsetmatrix)
                var newBoneInfo = new BoneInfo(model.boneCounter, offset)
                model.boneInfoMap[boneName] = newBoneInfo
                boneID = model.boneCounter
                model.boneCounter++
            } else {
                boneID = model.boneInfoMap[boneName].id
            }
            var weights = mesh.bones[boneIndex].weights
            for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
                var vertexId = weights[weightIndex][0]
                var weight = weights[weightIndex][1]
                for (var k = 0; k < 4; ++k) {
                    if (boneIdsArr[vertexId * 4 + k] < 0) {
                        weightArr[vertexId * 4 + k] = weight;
                        boneIdsArr[vertexId * 4 + k] = boneID;
                        break;
                    }
                }
            }
        }
        var vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        var vbo_position = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)

        var vbo_normals = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_normals)
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0)

        var vbo_texcoords = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texcoords)
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 0, 0)

        var vbo_tangents = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_tangents)
        gl.bufferData(gl.ARRAY_BUFFER, tangents, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 3, gl.FLOAT, gl.FALSE, 0, 0)


        var vbo_bitangents = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_bitangents)
        gl.bufferData(gl.ARRAY_BUFFER, bitangents, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(4)
        gl.vertexAttribPointer(4, 3, gl.FLOAT, gl.FALSE, 0, 0)

        var vbo_bone = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_bone)
        gl.bufferData(gl.ARRAY_BUFFER, boneIdsArr, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(5)
        gl.vertexAttribIPointer(5, 4, gl.INT, 0, 0)

        var vbo_weight = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo_weight)
        gl.bufferData(gl.ARRAY_BUFFER, weightArr, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(6)
        gl.vertexAttribPointer(6, 4, gl.FLOAT, gl.FALSE, 0, 0)

        var EBO = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceArray, gl.STATIC_DRAW)

        var materials = this.loadMaterials(data.materials[mesh.materialindex].properties, path)

        return new MeshAssimp(vao, EBO, faceArray.length, materials, vbo_position, vbo_normals, vbo_texcoords, vbo_tangents, vbo_bitangents, vbo_bone, vbo_weight);
    }

    processNode = (model, path, data, node) => {

        for (var i = 0; node.meshes != undefined && i < node.meshes.length; i++) {
            var mesh = data.meshes[node.meshes[i]];
            model.meshArray.push(this.processMesh(model, path, data, mesh));
        }

        for (var i = 0; node.children != undefined && i < node.children.length; i++) {
            this.processNode(model, path, data, node.children[i])
        }
    }


    readHeirarchyData(dest, src) {
        dest.name = src.name
        var transformMat = mat4.create()
        mat4.transpose(transformMat, src.transformation)
        dest.transformation = transformMat
        for (var i = 0; src.children != undefined && i < src.children.length; i++) {
            var newData = new AssimpNodeData()
            this.readHeirarchyData(newData, src.children[i])
            dest.children.push(newData)
        }
    }

    loadAnimation = (modelObj, json) => {
        for (var i = 0; json.animations != undefined && i < json.animations.length; i++) {
            var animation = json.animations[i]
            var globalTransform = mat4.create()
            mat4.transpose(globalTransform, json.rootnode.transformation)
            mat4.invert(globalTransform, globalTransform)
            var rootNode = new AssimpNodeData()
            this.readHeirarchyData(rootNode, json.rootnode);

            var animator = new AnimatorAssimp(animation.duration, animation.tickspersecond, modelObj.boneInfoMap, rootNode)
            for (var j = 0; animation.channels != undefined && j < animation.channels.length; j++) {
                var channel = animation.channels[j]
                var boneName = channel.name

                if (modelObj.boneInfoMap[boneName] == undefined) {
                    var off = mat4.create()
                    var boneInfo = new BoneInfo(modelObj.boneCounter, off)
                    modelObj.boneInfoMap[boneName] = boneInfo
                    modelObj.boneCounter++
                }
                var bone = new Bone(modelObj.boneInfoMap[channel.name].id, channel.name, mat4.create())
                for (var positionIndex = 0; channel.positionkeys != undefined && positionIndex < channel.positionkeys.length; ++positionIndex) {
                    var key = new KeyPosition(channel.positionkeys[positionIndex][1], channel.positionkeys[positionIndex][0])
                    bone.positionkeys.push(key)
                }

                for (var rotationIndex = 0; channel.rotationkeys != undefined && rotationIndex < channel.rotationkeys.length; ++rotationIndex) {
                    var key = new KeyRotation(channel.rotationkeys[rotationIndex][1], channel.rotationkeys[rotationIndex][0])
                    bone.rotationkeys.push(key)
                }

                for (var scalingIndex = 0; channel.scalingkeys != undefined && scalingIndex < channel.scalingkeys.length; ++scalingIndex) {
                    var key = new KeyScale(channel.scalingkeys[scalingIndex][1], channel.scalingkeys[scalingIndex][0])
                    bone.scalingkeys.push(key)
                }
                animator.bones.push(bone)
            }
            modelObj.animator.push(animator)
        }
    }

    getScaleFactor = (lastTimeStamp, nextTimeStamp, animationTime) => {
        var scaleFactor = 0.0
        var midWayLength = animationTime - lastTimeStamp
        var framesDiff = nextTimeStamp - lastTimeStamp
        scaleFactor = midWayLength / framesDiff
        return scaleFactor
    }

    calculateBoneTransform = (animator, node, parentTransform) => {
        if (animator === undefined) {
            return
        }

        var nodeName = node.name
        var nodeTransform = node.transformation

        var bone = animator.bones.find(o => o.name === nodeName)

        if (bone != undefined) {
            var translationMat = mat4.create()
            var rotationMat = mat4.create()
            var scalingMat = mat4.create()
            var p0Index = -1;
            var p1Index = -1;

            if (bone.positionkeys.length === 1) {
                mat4.translate(translationMat, translationMat, bone.positionkeys[0].translate);
            } else {
                for (p0Index = 0; p0Index < bone.positionkeys.length - 1; ++p0Index) {
                    if (animator.currentTime < bone.positionkeys[p0Index + 1].timeStamp) {
                        break;
                    }
                }
                if (p0Index === bone.positionkeys.length - 1) {
                    mat4.translate(translationMat, translationMat, bone.positionkeys[p0Index].translate)
                } else {
                    p1Index = p0Index + 1
                    var t = vec3.create()
                    vec3.lerp(t, bone.positionkeys[p0Index].translate, bone.positionkeys[p1Index].translate, this.getScaleFactor(bone.positionkeys[p0Index].timeStamp, bone.positionkeys[p1Index].timeStamp, animator.currentTime))
                    mat4.translate(translationMat, translationMat, t)
                }
            }

            if (bone.rotationkeys.length === 1) {
                mat4.fromQuat(rotationMat, bone.rotationkeys[0].rotate)
            } else {
                for (p0Index = 0; p0Index < bone.rotationkeys.length - 1; ++p0Index) {
                    if (animator.currentTime < bone.rotationkeys[p0Index + 1].timeStamp) {
                        break;
                    }
                }
                if (p0Index == bone.rotationkeys.length - 1) {
                    mat4.fromQuat(rotationMat, bone.rotationkeys[p0Index].rotate)
                } else {
                    p1Index = p0Index + 1
                    var r = quat.create()
                    quat.slerp(r, bone.rotationkeys[p0Index].rotate, bone.rotationkeys[p1Index].rotate, this.getScaleFactor(bone.rotationkeys[p0Index].timeStamp, bone.rotationkeys[p1Index].timeStamp, animator.currentTime))
                    mat4.fromQuat(rotationMat, bone.rotationkeys[p0Index].rotate)
                    mat4.fromQuat(rotationMat, r)
                }
            }

            if (bone.scalingkeys.length === 1) {
                mat4.scale(scalingMat, scalingMat, bone.scalingkeys[0].scale)
            } else {
                for (p0Index = 0; p0Index < bone.scalingkeys.length - 1; ++p0Index) {
                    if (animator.currentTime < bone.scalingkeys[p0Index + 1].timeStamp) {
                        break
                    }
                }
                if (p0Index == bone.scalingkeys.length - 1) {
                    mat4.scale(scalingMat, scalingMat, bone.scalingkeys[p0Index].scale)
                } else {
                    p1Index = p0Index + 1
                    var s = vec3.create()
                    vec3.lerp(s, bone.scalingkeys[p0Index].scale, bone.scalingkeys[p1Index].scale, this.getScaleFactor(bone.scalingkeys[p0Index].timeStamp, bone.scalingkeys[p1Index].timeStamp, animator.currentTime))
                    mat4.scale(scalingMat, scalingMat, s)
                }
            }
            var tempMat = mat4.create()
            mat4.multiply(tempMat, translationMat, rotationMat)
            mat4.multiply(tempMat, tempMat, scalingMat)
            bone.localTransform = tempMat
            nodeTransform = bone.localTransform
        }

        var globalTransformation = mat4.create()
        mat4.multiply(globalTransformation, parentTransform, nodeTransform)

        var boneInfoMap = animator.boneInfoMap
        if (boneInfoMap[nodeName] != undefined) {
            var index = boneInfoMap[nodeName].id
            var offset = boneInfoMap[nodeName].offsetMatrix
            if (index < animator.finalBoneMatrices.length)
                mat4.multiply(animator.finalBoneMatrices[index], globalTransformation, offset)
        }

        for (var i = 0; i < node.children.length; i++) {
            this.calculateBoneTransform(animator, node.children[i], globalTransformation)
        }
    }

    getFinalBoneMatrices = (i) => {
        if (this.Model === undefined) {
            return []
        }
        if (this.Model.animator != undefined && this.Model.animator.length > i) {
            return this.Model.animator[i].finalBoneMatrices
        } else {
            return []
        }
    }

    updateModel = (i, delta) => {
        if (this.Model === undefined) {
            return
        }
        if (this.Model.animator != undefined && this.Model.animator.length > i) {
            this.Model.animator[i].deltaTime = delta
            this.Model.animator[i].currentTime += this.Model.animator[i].ticksPerSecond * delta
            this.Model.animator[i].currentTime = this.Model.animator[i].currentTime % this.Model.animator[i].duration
            this.calculateBoneTransform(this.Model.animator[i], this.Model.animator[i].rootNode, mat4.create())
            // console.log(this.Model.animator[i].currentTime)
        }
    }

    updateModelWithConstraint = (i, delta, startTime, endTime) => {
        if (this.Model === undefined) {
            return
        }
        if (this.Model.animator != undefined && this.Model.animator.length > i) {
            this.Model.animator[i].deltaTime = delta
            this.Model.animator[i].currentTime += this.Model.animator[i].ticksPerSecond * delta
            this.Model.animator[i].currentTime = this.Model.animator[i].currentTime % this.Model.animator[i].duration
            this.calculateBoneTransform(this.Model.animator[i], this.Model.animator[i].rootNode, mat4.create())
            // console.log(this.Model.animator[i].currentTime)
            if (this.Model.animator[i].currentTime >= endTime)
                this.Model.animator[i].currentTime = startTime;
        }
    }

    setAnimationStartTime(i, startTime) {
        if (this.Model === undefined) {
            return
        }
        if (this.Model.animator != undefined && this.Model.animator.length > i) {
            this.Model.animator[i].currentTime = startTime;
        }
    }

    render = (uniforms, textureid) => {
        if (this.Model === undefined) {
            return
        }

        for (var i = 0; this.Model.meshArray != undefined && i < this.Model.meshArray.length; i++) {

            if (this.Model.meshArray[i].materialInfo.diffuse_texture !== undefined) {

                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.Model.meshArray[i].materialInfo.diffuse_texture)
                gl.uniform1i(uniforms.uBaseColorTexture, 0);

                gl.uniform1i(uniforms.uHasBaseColorTexture, 1);
            }
            else
                gl.uniform1i(uniforms.uHasBaseColorTexture, 0);

            if (this.Model.meshArray[i].materialInfo.normal_texture !== undefined) {
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, this.Model.meshArray[i].materialInfo.normal_texture)
                gl.uniform1i(uniforms.uNormalTexture, 1);

                gl.uniform1i(uniforms.uHasNormalTexture, 1);
            }
            else
                gl.uniform1i(uniforms.uHasNormalTexture, 0);


            if (textureid != undefined) {

                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, textureid)
                gl.uniform1i(uniforms.uBaseColorTexture, 0);

                gl.uniform1i(uniforms.uHasBaseColorTexture, 1);
            }

            // gl.uniform1i(uniforms.uHasMetallicRoughnessTexture, 0);
            // gl.uniform1i(uniforms.uHasEmissiveTexture, 0);
            // gl.uniform1i(uniforms.uHasOcclusionTexture, 0);
            gl.uniform4fv(uniforms.uBaseColorFactor, new Float32Array(this.Model.meshArray[i].materialInfo.diffuse_color));
            // gl.uniform3fv(uniforms.uEmissiveFactor, this.Model.meshArray[i].materialInfo.emissive_factor);

            // gl.uniform1f(uniforms.uMetallicFactor, this.Model.meshArray[i].materialInfo.metallic_factor);
            // gl.uniform1f(uniforms.uRoughnessFactor, this.Model.meshArray[i].materialInfo.roughness_factor);

            if (this.transformBuffer) {

                gl.uniform1i(uniforms.bInstanced, 1);

                gl.bindVertexArray(this.Model.meshArray[i].vao)

                gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

                gl.vertexAttribPointer(7, 4, gl.FLOAT, false, 64, 0);
                gl.vertexAttribPointer(8, 4, gl.FLOAT, false, 64, 16);
                gl.vertexAttribPointer(9, 4, gl.FLOAT, false, 64, 32);
                gl.vertexAttribPointer(10, 4, gl.FLOAT, false, 64, 48);

                gl.vertexAttribDivisor(7, 1);
                gl.vertexAttribDivisor(8, 1);
                gl.vertexAttribDivisor(9, 1);
                gl.vertexAttribDivisor(10, 1);

                gl.enableVertexAttribArray(7);
                gl.enableVertexAttribArray(8);
                gl.enableVertexAttribArray(9);
                gl.enableVertexAttribArray(10);

                gl.drawElementsInstanced(gl.TRIANGLES, this.Model.meshArray[i].count, gl.UNSIGNED_SHORT, 0, this.instanceCount);
                gl.bindVertexArray(null)
            }
            else {

                gl.uniform1i(uniforms.bInstanced, 0);

                gl.bindVertexArray(this.Model.meshArray[i].vao)
                gl.drawElements(gl.TRIANGLES, this.Model.meshArray[i].count, gl.UNSIGNED_SHORT, 0)
                gl.bindVertexArray(null)
            }
        }

    }

    destroy() {
        if (this.transformBuffer) {
            gl.deleteBuffer(this.transformBuffer);
            this.transformBuffer = null;
        }

        this.Model.meshArray.forEach(m => {
            // console.log(m);
            if (m.vao) {
                gl.deleteVertexArray(m.vao);
                m.vao = null;
            }

            if (m.vbo_position) {
                gl.deleteBuffer(m.vbo_position);
                m.vbo_position = null;
            }

            if (m.eb) {
                gl.deleteBuffer(m.eb);
                m.eb = null;
            }
            if (m.vbo_normals) {
                gl.deleteBuffer(m.vbo_normals);
                m.vbo_normals = null;
            }
            if (m.vbo_texcoords) {
                gl.deleteBuffer(m.vbo_texcoords);
                m.vbo_texcoords = null;
            }
            if (m.vbo_tangents) {
                gl.deleteBuffer(m.vbo_tangents);
                m.vbo_tangents = null;
            }
            if (m.vbo_bitangents) {
                gl.deleteBuffer(m.vbo_bitangents);
                m.vbo_bitangents = null;
            }
            if (m.vbo_bone) {
                gl.deleteBuffer(m.vbo_bone);
                m.vbo_bone = null;
            }
            if (m.vbo_weight) {
                gl.deleteBuffer(m.vbo_weight);
                m.vbo_weight = null;
            }

            if (m.materialInfo.diffuse_texture) {
                gl.deleteTexture(m.materialInfo.diffuse_texture);
                m.materialInfo.diffuse_texture = null;
            }

            if (m.materialInfo.normal_texture) {
                gl.deleteTexture(m.materialInfo.normal_texture);
                m.materialInfo.normal_texture = null;
            }


        });

        if (this.Textures) {

            this.Textures = null;
        }

        if (this.Model) {

            this.Model = null;
            this.Model = undefined;
        }

    }
}
