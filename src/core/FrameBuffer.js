
class Framebuffer {

    constructor() {
        this.fbo = null;
        this.rbo = null;
        this.fbo_texture = null;
        this.depthTex = null;

        this.W;
        this.H;
        this.nColorAttachments;
        this.colorAttachments;
    }


    createF(textureWidth, textureHeight) {
        var maxRenderbufferSize;
        maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

        if ((maxRenderbufferSize < textureWidth) || (maxRenderbufferSize < textureHeight)) {
            console.log("Failed To Create FBO. Not Enough Renderbuffer Size.\n");
            return (false);
        }

        this.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureWidth, textureHeight);

        this.fbo_texture = gl.createTexture();
        //        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this.fbo_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, textureWidth, textureHeight, 0, gl.RGBA, gl.FLOAT, null);
        //        gl.generateMipmap(gl.TEXTURE_2D);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fbo_texture, 0);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);

        var result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (result != gl.FRAMEBUFFER_COMPLETE) {
            console.log("Failed To Create FBO. Framebuffer Initialization Is Incomplete.\n");
            return (false);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return (true);
    }

    create(textureWidth, textureHeight) {
        this.W = textureWidth;
        this.H = textureHeight;
        var maxRenderbufferSize;
        maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

        if ((maxRenderbufferSize < textureWidth) || (maxRenderbufferSize < textureHeight)) {
            console.log("Failed To Create FBO. Not Enough Renderbuffer Size.\n");
            return (false);
        }

        this.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureWidth, textureHeight);

        this.fbo_texture = gl.createTexture();
        //        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this.fbo_texture);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        //        gl.generateMipmap(gl.TEXTURE_2D);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fbo_texture, 0);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);

        // this.depthTex = this.createDepthTextureAttachment();
        this.depthTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.depthTex);

        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Allocate storage for the texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, textureWidth, textureHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

        // Attach the depth texture to the framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTex, 0);


        var result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (result != gl.FRAMEBUFFER_COMPLETE) {
            console.log("Failed To Create FBO. Framebuffer Initialization Is Incomplete.\n");
            return (false);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return (true);
    }


    getFBO() {
        return (this.fbo);
    }

    getRBO() {
        return (this.rbo);
    }

    getTexture() {
        return (this.fbo_texture);
    }

    getDepthTexture() {
        return this.depthTex;
    }

    resize(fovy, fboWidth, fboHeight, near, far) {
        // code
        gl.viewport(0, 0, fboWidth, fboHeight);

        // this is also updated in camera.js
        var perspectiveProjectionMatrixFBO = mat4.create();

        mat4.perspective(
            perspectiveProjectionMatrixFBO,
            fovy,
            parseFloat(fboWidth) / parseFloat(fboHeight),
            near,
            far);

        return (perspectiveProjectionMatrixFBO);
    }

    uninitialize() {
        if (this.fbo_texture) {
            gl.deleteTexture(this.fbo_texture);
        }

        if (this.rbo) {
            gl.deleteRenderbuffer(this.rbo);
            this.rbo = null;
        }

        if (this.fbo) {
            gl.deleteFramebuffer(this.fbo);
            this.fbo = null;
        }

    }
    
    bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        gl.viewport(0, 0, this.W, this.H);

        // this is also updated in camera.js
        mat4.perspective(
            perspectiveProjectionMatrix,
            45.0,
            parseFloat(this.W) / parseFloat(this.H),
            1.0,
            5000.0);

        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        resize();

        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

}
