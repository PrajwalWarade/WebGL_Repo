let instanceTextureManger;

class TextureManger {
    constructor() {
        if (instanceTextureManger) {
            throw new Error("You can only create one instanceTextureManger!");
        }
        this.counter = counter;
        instanceTextureManger = this;
    }

    /**
     * @description LoadTexture loads the texture
     * @parameter imageSrc - Image path
     *  this.wallTexture = LoadTexture("assets/image/wall.png"); 
    */
    static LoadTexture(imageSrc) {
        if (imageSrc == null)
            console.error("Empty image Source");

        if (textures.has(imageSrc)) {
            return textures.get(imageSrc);
        }

        let tempTexture = gl.createTexture();
        tempTexture.image = new Image();
        tempTexture.image.src = imageSrc;
        tempTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempTexture.image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            textures.set(imageSrc, tempTexture);
        };

        return tempTexture;
    }
    
    static LoadTextureInverted(imageSrc) {
        if (imageSrc == null)
            console.error("Empty image Source");

        if (textures.has(imageSrc)) {
            return textures.get(imageSrc);
        }

        let tempTexture = gl.createTexture();
        tempTexture.image = new Image();
        tempTexture.image.src = imageSrc;
        tempTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempTexture.image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            textures.set(imageSrc, tempTexture);
        };

        return tempTexture;
    }

    static LoadCubeMap(faceInfos) {

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        faceInfos.forEach((faceInfo) => {
            const { target, url } = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 256;
            const height = 256;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function () {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(target, level, internalFormat, format, type, image);

                // gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        return texture;
    }

    static LoadHighQualityTexture(imageSrc) {
        if (imageSrc == null)
            console.error("Empty image Source");

        if (textures.has(imageSrc)) {
            return textures.get(imageSrc);
        }

        let tempTexture = gl.createTexture();
        tempTexture.image = new Image();
        tempTexture.image.src = imageSrc;
        tempTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempTexture.image);
            gl.generateMipmap(gl.TEXTURE_2D);
            const ext = gl.getExtension("EXT_texture_filter_anisotropic");
            if (ext)
            {
               gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.0);
            }
            gl.bindTexture(gl.TEXTURE_2D, null);

            textures.set(imageSrc, tempTexture);
        };

        return tempTexture;
    }

    static LoadHighQualityTextureAndWrap(imageSrc, sWrap, tWrap) {
        if (imageSrc == null)
            console.error("Empty image Source");

        if (textures.has(imageSrc)) {
            return textures.get(imageSrc);
        }

        let tempTexture = gl.createTexture();
        tempTexture.image = new Image();
        tempTexture.image.src = imageSrc;
        tempTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, sWrap);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tWrap);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempTexture.image);
            gl.generateMipmap(gl.TEXTURE_2D);
            const ext = gl.getExtension("EXT_texture_filter_anisotropic");
            if (ext)
            {
               gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.0);
            }
            gl.bindTexture(gl.TEXTURE_2D, null);

            textures.set(imageSrc, tempTexture);
        };

        return tempTexture;
    }
}

// 2. Setting a variable equal to the the frozen newly instantiated object, by using the built-in `Object.freeze` method.
// This ensures that the newly created instanceTextureManger is not modifiable.
//const textureManger = Object.freeze(new TextureManger());

// 3. Exporting the variable as the `default` value within the file to make it globally accessible.
//export default textureManger;

// Create a Map
const textures = new Map();
