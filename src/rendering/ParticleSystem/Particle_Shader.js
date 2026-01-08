

class ParticleShader {

    constructor() {
        this.program_update = null;
        this.program_render = null;

        this.uniforms_update = null;
        this.uniforms_render = null;



        this.vao;
        this.vbo;

        this.num_particles = 500;
        this.particle_birth_rate = 0.5;
        this.min_age = 1.01;
        this.max_age = 10.5;
        // this.max_age = 1.15;
        this.min_theta = Math.PI / 2.0 - 0.4;
        this.max_theta = Math.PI / 2.0 + 0.4;
        this.min_speed = 0.1;
        this.max_speed = 1.0;
        this.gravity = [0.0, -1.5];


        // this.num_particles = 500;
        // this.particle_birth_rate = 0.1;
        // this.min_age = 1.01;
        // this.max_age = 1.0;
        // // this.max_age = 1.15;
        // this.min_theta = Math.PI / 2.0 - 0.4;
        // this.max_theta = Math.PI / 2.0 + 0.4;
        // this.min_speed = 0.1;
        // this.max_speed = 1.1;
        // this.gravity = [0.0, -6.8];

        this.state;

        this.angle = 0.0;

        this.rainbow;
        this.vaos;
        this.buffers;
    }

    async init() {

        this.rainbow = TextureManger.LoadTexture("assets/textures/Rainbow/rainbow.png");

        // -------------------------------------------------
        this.program_update = ShaderManger.createProgram(gl);

        await Promise.all([
            await gl.attachShader(this.program_update, await ShaderManger.loadShader(gl, 'RainBowParticle/particle-update.vs', gl.VERTEX_SHADER)),
            await gl.attachShader(this.program_update, await ShaderManger.loadShader(gl, 'RainBowParticle/pass_through.fs', gl.FRAGMENT_SHADER)),
        ]);

        gl.bindAttribLocation(this.program_update, 0, "i_Position");
        gl.bindAttribLocation(this.program_update, 1, "i_Age");
        gl.bindAttribLocation(this.program_update, 2, "i_Life");
        gl.bindAttribLocation(this.program_update, 3, "i_Velocity");

        // gl.bindAttribLocation(this.program_update, 0, "i_Position");
        // gl.bindAttribLocation(this.program_update, 1, "i_Age");
        // gl.bindAttribLocation(this.program_update, 2, "i_Life");
        // gl.bindAttribLocation(this.program_update, 3, "i_Velocity");
        var varyings = [
            "v_Position",
            "v_Age",
            "v_Life",
            "v_Velocity",
        ];
        gl.transformFeedbackVaryings(this.program_update, varyings, gl.INTERLEAVED_ATTRIBS);

        ShaderManger.linkProgram(gl, this.program_update);

        //this.uniforms_update = this.getUniformLocationsUpdate(gl, this.program_update);

        // -------------------------------------------------

        this.program_render = ShaderManger.createProgram(gl);
        await Promise.all([
            await gl.attachShader(this.program_render, await ShaderManger.loadShader(gl, 'RainBowParticle/particle_render.vs', gl.VERTEX_SHADER)),
            await gl.attachShader(this.program_render, await ShaderManger.loadShader(gl, 'RainBowParticle/particle_render.fs', gl.FRAGMENT_SHADER)),
        ]);
        gl.bindAttribLocation(this.program_render, 0, "i_Position");
        gl.bindAttribLocation(this.program_render, 1, "i_Age");
        gl.bindAttribLocation(this.program_render, 2, "i_Life");

        ShaderManger.linkProgram(gl, this.program_render);

        //this.uniforms_render = this.getUniformLocationsRender(gl, this.program_render);

        // -------------------------------------------------
        var update_attrib_locations = {
            i_Position: {
                location: gl.getAttribLocation(this.program_update, "i_Position"),
                num_components: 2,
                type: gl.FLOAT
            },
            i_Age: {
                location: gl.getAttribLocation(this.program_update, "i_Age"),
                num_components: 1,
                type: gl.FLOAT
            },
            i_Life: {
                location: gl.getAttribLocation(this.program_update, "i_Life"),
                num_components: 1,
                type: gl.FLOAT
            },
            i_Velocity: {
                location: gl.getAttribLocation(this.program_update, "i_Velocity"),
                num_components: 2,
                type: gl.FLOAT
            }
        };
        var render_attrib_locations = {
            i_Position: {
                location: gl.getAttribLocation(this.program_render, "i_Position"),
                num_components: 2,
                type: gl.FLOAT
            },
            i_Age: {
                location: gl.getAttribLocation(this.program_render, "i_Age"),
                num_components: 1,
                type: gl.FLOAT
            },
            i_Life: {
                location: gl.getAttribLocation(this.program_render, "i_Life"),
                num_components: 1,
                type: gl.FLOAT
            }
        };
        this.vaos = [
            gl.createVertexArray(),
            gl.createVertexArray(),
            gl.createVertexArray(),
            gl.createVertexArray()
        ];
        this.buffers = [
            gl.createBuffer(),
            gl.createBuffer(),
        ];
        var vao_desc = [
            {
                vao: this.vaos[0],
                buffers: [{
                    buffer_object: this.buffers[0],
                    stride: 4 * 6,
                    attribs: update_attrib_locations
                }]
            },
            {
                vao: this.vaos[1],
                buffers: [{
                    buffer_object: this.buffers[1],
                    stride: 4 * 6,
                    attribs: update_attrib_locations
                }]
            },
            {
                vao: this.vaos[2],
                buffers: [{
                    buffer_object: this.buffers[0],
                    stride: 4 * 6,
                    attribs: render_attrib_locations
                }],
            },
            {
                vao: this.vaos[3],
                buffers: [{
                    buffer_object: this.buffers[1],
                    stride: 4 * 6,
                    attribs: render_attrib_locations
                }],
            },
        ];
        var initial_data =
            new Float32Array(this.initialParticleData(configs.num_particles, this.min_age, this.max_age));
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
        for (var i = 0; i < vao_desc.length; i++) {
            this.setupParticleBufferVAO(gl, vao_desc[i].buffers, vao_desc[i].vao);
        }

        var rg_noise_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rg_noise_texture);
        gl.texImage2D(gl.TEXTURE_2D,
            0,
            gl.RG8,
            1920, 1080,
            0,
            gl.RG,
            gl.UNSIGNED_BYTE,
            this.randomRGData(1920, 1080));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);



        this.state = {
            particle_sys_buffers: this.buffers,
            particle_sys_vaos: this.vaos,
            read: 0,
            write: 1,
            particle_update_program: this.program_update,
            particle_render_program: this.program_render,
            num_particles: initial_data.length / 6,
            old_timestamp: 0.0,
            rg_noise: rg_noise_texture,
            total_time: 0.0,
            born_particles: 0,
            birth_rate: this.particle_birth_rate,
            gravity: this.gravity,
            origin: [0.0, 0.5],
            min_theta: this.min_theta,
            max_theta: this.max_theta,
            min_speed: this.min_speed,
            max_speed: this.max_speed
        };

    }

    getUniformLocationsRender = (gl, program) => {

        const i_Position = gl.getUniformLocation(program, 'i_Position');
        const i_Age = gl.getUniformLocation(program, 'i_Age');
        const i_Life = gl.getUniformLocation(program, 'i_Life');
        const i_Velocity = gl.getUniformLocation(program, 'i_Velocity');

        return {
            i_Position,
            i_Age,
            i_Life,
            i_Velocity,
        };
    };

    getUniformLocationsUpdate = (gl, program) => {

        const i_Position = gl.getUniformLocation(program, 'i_Position');
        const i_Age = gl.getUniformLocation(program, 'i_Age');
        const i_Life = gl.getUniformLocation(program, 'i_Life');

        return {
            i_Position,
            i_Age,
            i_Life,
        };
    };

    bind(camera, modelMatrix, color) {
        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

        gl.useProgram(this.program);
        {
            gl.uniformMatrix4fv(this.uniforms.uMVPMatrix, false, modelViewProjectionMatrix);
            gl.uniform3fv(this.uniforms.u_color, new Float32Array(color));
        }
    }


    unbind() {
        gl.useProgram(null);
    }

    render = (camera, modelMatrix, color) => {

        // var radius = 5.0;
        // var x = (radius + 1.0) * Math.cos(degToRad(this.angle));
        // var y = radius * Math.sin(degToRad(this.angle));
        // if (this.angle < 180.0)
        //     this.angle = this.angle + 3.0;
        // else
        //     this.angle = 0.0;

        // Set Origin For Emitter
        // var x = 2.0 * (e.pageX - this.offsetLeft) / this.width - 1.0;
        // var y = -(2.0 * (e.pageY - this.offsetTop) / this.height - 1.0);
        // state.origin = [x, y];

        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);


        var num_part = this.state.born_particles;
        var time_delta = 0.0;
        if (this.state.old_timestamp != 0) {
            time_delta = new Date().getTime() - this.state.old_timestamp;
            if (time_delta > 500.0) {
                time_delta = 0.0;
            }
        }
        if (this.state.born_particles < configs.num_particles) {
            this.state.born_particles = Math.min(configs.num_particles,
                Math.floor(this.state.born_particles + this.state.birth_rate * time_delta));
        }
        this.state.old_timestamp = new Date().getTime();


        gl.useProgram(this.program_update);
        {

            // gl.uniform2f(
            //     gl.getUniformLocation(this.program_update, "u_Origin"),
            //     x,
            //     y);

            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_TimeDelta"),
                time_delta / 1000.0);
            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_TotalTime"),
                this.state.total_time);
            gl.uniform2f(
                gl.getUniformLocation(this.program_update, "u_Gravity"),
                this.state.gravity[0], this.state.gravity[1]);
            // gl.uniform2f(
            //     gl.getUniformLocation(this.program_update, "u_Origin"),
            //     this.state.origin[0],
            //     this.state.origin[1]);
            gl.uniform2f(
                gl.getUniformLocation(this.program_update, "u_Origin"),
                0.0,
                0.0);
            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_MinTheta"),
                this.state.min_theta);
            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_MaxTheta"),
                this.state.max_theta);
            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_MinSpeed"),
                this.state.min_speed);
            gl.uniform1f(
                gl.getUniformLocation(this.program_update, "u_MaxSpeed"),
                this.state.max_speed);


            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.state.rg_noise);
            gl.uniform1i(
                gl.getUniformLocation(this.program_update, "u_RgNoise"),
                0);
            gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read]);
            gl.bindBufferBase(
                gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.state.particle_sys_buffers[this.state.write]);
            gl.enable(gl.RASTERIZER_DISCARD);

            gl.beginTransformFeedback(gl.POINTS);
            gl.drawArrays(gl.POINTS, 0, num_part);
            gl.endTransformFeedback();
            gl.disable(gl.RASTERIZER_DISCARD);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
            gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read + 2]);
        }
        gl.useProgram(null);


        gl.useProgram(this.program_render);
        //     {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program_render, "uMVPMatrix"), false, modelViewProjectionMatrix);

        gl.drawArrays(gl.POINTS, 0, num_part);
        var tmp = this.state.read;
        this.state.read = this.state.write;
        this.state.write = tmp;
        //     }
        gl.useProgram(null);

        //     gl.bindVertexArray(null);
        // }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    renderWave = (camera, modelMatrix, color) => {
        this.max_age = 1.5;

        var radius = 5.0;
        var x = (radius + 1.0) * Math.cos(degToRad(this.angle));
        var y = radius * Math.sin(degToRad(this.angle));
        if (this.angle < 180.0)
            this.angle = this.angle + 3.0;
        else
            this.angle = 0.0;

        // Set Origin For Emitter
        // var x = 2.0 * (e.pageX - this.offsetLeft) / this.width - 1.0;
        // var y = -(2.0 * (e.pageY - this.offsetTop) / this.height - 1.0);
        // state.origin = [x, y];

        const viewMatrix = camera.getViewMatrix();
        var modelViewProjectionMatrix = mat4.create();

        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, perspectiveProjectionMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
        mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);


        var num_part = this.state.born_particles;
        var time_delta = 0.0;
        if (this.state.old_timestamp != 0) {
            time_delta = new Date().getTime() - this.state.old_timestamp;
            if (time_delta > 500.0) {
                time_delta = 0.0;
            }
        }
        if (this.state.born_particles < configs.num_particles) {
            this.state.born_particles = Math.min(configs.num_particles,
                Math.floor(this.state.born_particles + this.state.birth_rate * time_delta));
        }
        this.state.old_timestamp = new Date().getTime();


        gl.useProgram(this.program_update);
        this.state.total_time += time_delta;

        // for (var angle = 0; angle < 180; angle = angle + 30) 
        {
            // var x = (radius + 1.0) * Math.cos(degToRad(angle));
            // var y = radius * Math.sin(degToRad(angle));

            gl.useProgram(this.program_update);
            {

                // gl.uniform2f(
                //     gl.getUniformLocation(this.program_update, "u_Origin"),
                //     x,
                //     y);

                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_TimeDelta"),
                    time_delta / 1000.0);
                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_TotalTime"),
                    this.state.total_time);
                gl.uniform2f(
                    gl.getUniformLocation(this.program_update, "u_Gravity"),
                    this.state.gravity[0], this.state.gravity[1]);
                // gl.uniform2f(
                //     gl.getUniformLocation(this.program_update, "u_Origin"),
                //     this.state.origin[0],
                //     this.state.origin[1]);
                gl.uniform2f(
                    gl.getUniformLocation(this.program_update, "u_Origin"),
                    x,
                    y);
                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_MinTheta"),
                    this.state.min_theta);
                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_MaxTheta"),
                    this.state.max_theta);
                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_MinSpeed"),
                    this.state.min_speed);
                gl.uniform1f(
                    gl.getUniformLocation(this.program_update, "u_MaxSpeed"),
                    this.state.max_speed);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.state.rg_noise);
                gl.uniform1i(
                    gl.getUniformLocation(this.program_update, "u_RgNoise"),
                    0);
                gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read]);
                gl.bindBufferBase(
                    gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.state.particle_sys_buffers[this.state.write]);
                gl.enable(gl.RASTERIZER_DISCARD);

                gl.beginTransformFeedback(gl.POINTS);
                gl.drawArrays(gl.POINTS, 0, num_part);
                gl.endTransformFeedback();

                gl.disable(gl.RASTERIZER_DISCARD);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
                gl.bindVertexArray(this.state.particle_sys_vaos[this.state.read + 2]);
            }
            gl.useProgram(null);


            gl.useProgram(this.program_render);
            {
                gl.uniformMatrix4fv(gl.getUniformLocation(this.program_render, "uMVPMatrix"), false, modelViewProjectionMatrix);

                gl.drawArrays(gl.POINTS, 0, num_part);
                var tmp = this.state.read;
                this.state.read = this.state.write;
                this.state.write = tmp;

                gl.bindVertexArray(null);
            }
            gl.useProgram(null);

            this.max_age = 10.5;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }


    };



    setupParticleBufferVAO(gl, buffers, vao) {
        gl.bindVertexArray(vao);
        for (var i = 0; i < buffers.length; i++) {
            var buffer = buffers[i];
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer_object);
            var offset = 0;
            for (var attrib_name in buffer.attribs) {
                if (buffer.attribs.hasOwnProperty(attrib_name)) {
                    var attrib_desc = buffer.attribs[attrib_name];
                    gl.enableVertexAttribArray(attrib_desc.location);
                    gl.vertexAttribPointer(
                        attrib_desc.location,
                        attrib_desc.num_components,
                        attrib_desc.type,
                        false,
                        buffer.stride,
                        offset);
                    var type_size = 4; /* we're only dealing with types of 4 byte size in this demo, unhardcode if necessary */
                    offset += attrib_desc.num_components * type_size;
                    if (attrib_desc.hasOwnProperty("divisor")) {
                        gl.vertexAttribDivisor(attrib_desc.location, attrib_desc.divisor);
                    }
                }
            }
        }
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }


    randomRGData(size_x, size_y) {
        var d = [];
        for (var i = 0; i < size_x * size_y; ++i) {
            d.push(Math.random() * 255.0);
            d.push(Math.random() * 255.0);
        }
        return new Uint8Array(d);
    }

    initialParticleData(num_parts, min_age, max_age) {
        var data = [];
        for (var i = 0; i < num_parts; ++i) {
            data.push(0.0);
            data.push(0.0);
            var life = min_age + Math.random() * (max_age - min_age);
            data.push(life + 1);
            data.push(life);
            data.push(0.0);
            data.push(0.0);
        }
        return data;
    }

    uninitialize() {
        if (this.vaos[0]) {
            gl.deleteVertexArray(this.vaos[0]);
            this.vaos[0] = null;
        }

        if (this.vaos[1]) {
            gl.deleteVertexArray(this.vaos[1]);
            this.vaos[1] = null;
        }

        if (this.vaos[2]) {
            gl.deleteVertexArray(this.vaos[2]);
            this.vaos[2] = null;
        }

        if (this.vaos[3]) {
            gl.deleteVertexArray(this.vaos[3]);
            this.vaos[3] = null;
        }

        ///
        if (this.buffers[0]) {
            gl.deleteBuffer(this.buffers[0]);
            this.buffers[0] = null;
        }

        if (this.buffers[1]) {
            gl.deleteBuffer(this.buffers[1]);
            this.buffers[1] = null;
        }

        ShaderManger.destroyProgram(gl, this.program_render);
        ShaderManger.destroyProgram(gl, this.program_update);
    }
    
    uninitialize(){

    }
};



