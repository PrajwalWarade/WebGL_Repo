class FireflyParticle
{
    constructor()
    {
        this.position = vec3.create();
        this.color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
        this.age = 0.0;
        this.lifespan = 15.0;
        this.size = 2.0;
        this.blinkPhase = 0.0;
        
        this.bezierStart = vec3.create();
        this.bezierControl1 = vec3.create();
        this.bezierControl2 = vec3.create();
        this.bezierEnd = vec3.create();
        this.bezierTime = 0.0;
        this.segmentDuration = 4.0;
        this.speed = 1.0;
    }
}

class FireflySystem
{
    constructor()
    {
        this.NUM_PARTICLES = 400;
        this.PARTICLE_LIFESPAN = 8.0;
        
        this.SPAWN_BOX_WIDTH  = 200.0;
        this.SPAWN_BOX_HEIGHT = 200.0;
        this.SPAWN_BOX_DEPTH  = 200.0;
        this.SPAWN_CENTER = vec3.fromValues(213.81040954589844, 100.038238525390625, -172.7102508544922);
        
        this.BEZIER_SEGMENT_DURATION = 5.0;
        this.CURVE_AMPLITUDE = 4.0;
        this.BASE_SPEED = 0.18;
        this.SPEED_VARIATION = 0.15;
      
        this.particles = [];
        this.sphereMesh = null;
        this.vao = null;
        this.vboPosition = null;
        this.vboNormal = null;
        this.vboTexCoord = null;
        this.shader = null;
        this.particleTime = 0.0;

        this.currentSceneConfig = null;
    }
    
    async initialize()
    {
        // Initialize shader
        this.shader = new FireflyShader();
        const shaderSuccess = await this.shader.initialize();
        
        if (!shaderSuccess)
        {
            console.error("Failed to initialize firefly shader");
            return;
        }
        
        // Create sphere manually
        this.sphereMesh = this.createSphereMesh(1.0, 10, 10);
        
        // Create VAO/VBO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        
        // Position buffer
        this.vboPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sphereMesh.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // Location 0
        gl.enableVertexAttribArray(0);
        
        // Normal buffer
        this.vboNormal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboNormal);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sphereMesh.normals), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);  // Location 1
        gl.enableVertexAttribArray(1);
        
        // TexCoord buffer
        this.vboTexCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sphereMesh.texcoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);  // Location 2
        gl.enableVertexAttribArray(2);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        
        // Initialize particles
        for (let i = 0; i < this.NUM_PARTICLES; i++)
        {
            const particle = new FireflyParticle();
            this.resetParticle(particle);
            particle.age = Math.random() * this.PARTICLE_LIFESPAN;
            this.particles.push(particle);
        }
        
        console.log("FireflySystem initialized with " + this.NUM_PARTICLES + " particles");
    }
    
    // Manual sphere generation
    createSphereMesh(radius, slices, stacks) {
        const vertices = [];
        const normals = [];
        const texcoords = [];
        let vertexCount = 0;
        
        const PI = Math.PI;
        const drho = PI / stacks;
        const dtheta = 2.0 * PI / slices;
        
        for (let i = 0; i < stacks; i++) {
            const rho = i * drho;
            const srho = Math.sin(rho);
            const crho = Math.cos(rho);
            const srhodrho = Math.sin(rho + drho);
            const crhodrho = Math.cos(rho + drho);
            
            for (let j = 0; j < slices; j++)
            {
                const theta = (j === slices) ? 0.0 : j * dtheta;
                const stheta = -Math.sin(theta);
                const ctheta = Math.cos(theta);
                
                // First triangle
                let x = stheta * srho;
                let y = ctheta * srho;
                let z = crho;
                texcoords.push(j / slices, i / stacks);
                normals.push(x, y, z);
                vertices.push(x * radius, y * radius, z * radius);
                
                x = stheta * srhodrho;
                y = ctheta * srhodrho;
                z = crhodrho;
                texcoords.push(j / slices, (i + 1) / stacks);
                normals.push(x, y, z);
                vertices.push(x * radius, y * radius, z * radius);
                
                const theta2 = ((j + 1) === slices) ? 0.0 : (j + 1) * dtheta;
                const stheta2 = -Math.sin(theta2);
                const ctheta2 = Math.cos(theta2);
                
                x = stheta2 * srho;
                y = ctheta2 * srho;
                z = crho;
                texcoords.push((j + 1) / slices, i / stacks);
                normals.push(x, y, z);
                vertices.push(x * radius, y * radius, z * radius);
                
                // Second triangle
                texcoords.push(j / slices, (i + 1) / stacks);
                normals.push(stheta * srhodrho, ctheta * srhodrho, crhodrho);
                vertices.push(stheta * srhodrho * radius, ctheta * srhodrho * radius, crhodrho * radius);
                
                x = stheta2 * srhodrho;
                y = ctheta2 * srhodrho;
                z = crhodrho;
                texcoords.push((j + 1) / slices, (i + 1) / stacks);
                normals.push(x, y, z);
                vertices.push(x * radius, y * radius, z * radius);
                
                x = stheta2 * srho;
                y = ctheta2 * srho;
                z = crho;
                texcoords.push((j + 1) / slices, i / stacks);
                normals.push(x, y, z);
                vertices.push(x * radius, y * radius, z * radius);
                
                vertexCount += 6;
            }
        }
        
        return {
            vertices: vertices,
            normals: normals,
            texcoords: texcoords,
            vertexCount: vertexCount
        };
    }
    
    randomRange(min, max)
    {
        return min + Math.random() * (max - min);
    }

    randomPointInBox(center)
    {
        return vec3.fromValues(
            center[0] + this.randomRange(-this.SPAWN_BOX_WIDTH / 2.0, this.SPAWN_BOX_WIDTH / 2.0),
            center[1] + this.randomRange(-this.SPAWN_BOX_HEIGHT / 2.0, this.SPAWN_BOX_HEIGHT / 2.0),
            center[2] + this.randomRange(-this.SPAWN_BOX_DEPTH / 2.0, this.SPAWN_BOX_DEPTH / 2.0)
        );
    }

    clampToBox(pos, center)
    {
        const halfWidth = this.SPAWN_BOX_WIDTH / 2.0;
        const halfHeight = this.SPAWN_BOX_HEIGHT / 2.0;
        const halfDepth = this.SPAWN_BOX_DEPTH / 2.0;
        
        pos[0] = Math.max(center[0] - halfWidth, Math.min(center[0] + halfWidth, pos[0]));
        pos[1] = Math.max(center[1] - halfHeight, Math.min(center[1] + halfHeight, pos[1]));
        pos[2] = Math.max(center[2] - halfDepth, Math.min(center[2] + halfDepth, pos[2]));
    }
    
    generateNewBezierCurve(particle)
    {
        vec3.copy(particle.bezierStart, particle.position);
        
        const endPoint = this.randomPointInBox(this.SPAWN_CENTER);
        vec3.copy(particle.bezierEnd, endPoint);
        
        const offsetX = this.randomRange(-this.CURVE_AMPLITUDE, this.CURVE_AMPLITUDE);
        const offsetY = this.randomRange(-this.CURVE_AMPLITUDE, this.CURVE_AMPLITUDE);
        const offsetZ = this.randomRange(-this.CURVE_AMPLITUDE, this.CURVE_AMPLITUDE);
        
        vec3.set(particle.bezierControl1,
            particle.bezierStart[0] + offsetX,
            particle.bezierStart[1] + offsetY,
            particle.bezierStart[2] + offsetZ
        );
        
        vec3.set(particle.bezierControl2,
            particle.bezierEnd[0] - offsetX,
            particle.bezierEnd[1] - offsetY,
            particle.bezierEnd[2] - offsetZ
        );
        
        particle.bezierTime = 0.0;
        particle.segmentDuration = this.BEZIER_SEGMENT_DURATION + this.randomRange(-1.0, 1.5);
        particle.speed = this.BASE_SPEED + this.randomRange(-this.SPEED_VARIATION, this.SPEED_VARIATION);
    }
    
    cubicBezier(p0, p1, p2, p3, t, out)
    {
        const oneMinusT = 1.0 - t;
        const oneMinusT2 = oneMinusT * oneMinusT;
        const oneMinusT3 = oneMinusT2 * oneMinusT;
        const t2 = t * t;
        const t3 = t2 * t;
        
        out[0] = oneMinusT3 * p0[0] + 3.0 * oneMinusT2 * t * p1[0] + 3.0 * oneMinusT * t2 * p2[0] + t3 * p3[0];
        out[1] = oneMinusT3 * p0[1] + 3.0 * oneMinusT2 * t * p1[1] + 3.0 * oneMinusT * t2 * p2[1] + t3 * p3[1];
        out[2] = oneMinusT3 * p0[2] + 3.0 * oneMinusT2 * t * p1[2] + 3.0 * oneMinusT * t2 * p2[2] + t3 * p3[2];
    }
    
    resetParticle(particle)
    {
        const spawnPos = this.randomPointInBox(this.SPAWN_CENTER);
        vec3.copy(particle.position, spawnPos);

        const colorVariation = Math.random();
        if (colorVariation < 0.35)
        {
            vec4.set(particle.color, 0.85, 1.0, 0.25, 1.0);
        }
        else if(colorVariation < 0.65)
        {
            vec4.set(particle.color, 1.0, 0.95, 0.35, 1.0);
        }
        else
        {
            vec4.set(particle.color, 0.65, 1.0, 0.15, 1.0);
        }

        particle.age = 0.0;
        particle.lifespan = this.PARTICLE_LIFESPAN + this.randomRange(-3.0, 3.0);

        particle.baseSize = this.randomRange(0.15, 0.3);
        particle.size = particle.baseSize;

        particle.blinkPhase = Math.random() * Math.PI * 2.0;

        this.generateNewBezierCurve(particle);
    }
    
    updateConfiguration(numParticles, spawnCenter, width, height, depth)
    {
        // Check if configuration has changed
        const configChanged = this.NUM_PARTICLES !== numParticles || !vec3.equals(this.SPAWN_CENTER, spawnCenter) || this.SPAWN_BOX_WIDTH !== width || this.SPAWN_BOX_HEIGHT !== height || this.SPAWN_BOX_DEPTH !== depth;
        
        if (configChanged)
        {
            this.NUM_PARTICLES = numParticles;
            this.SPAWN_CENTER = vec3.clone(spawnCenter);
            this.SPAWN_BOX_WIDTH = width;
            this.SPAWN_BOX_HEIGHT = height;
            this.SPAWN_BOX_DEPTH = depth;
            
            // Resize particle array
            if (this.particles.length < numParticles)
            {
                // Add more particles
                for (let i = this.particles.length; i < numParticles; i++)
                {
                    const particle = new FireflyParticle();
                    this.resetParticle(particle);
                    particle.age = Math.random() * this.PARTICLE_LIFESPAN;
                    this.particles.push(particle);
                }
            }
            else if (this.particles.length > numParticles)
            {

            }
            
            // Reset all existing particles to new spawn area
            for (let i = 0; i < Math.min(this.particles.length, numParticles); i++)
            {
                this.resetParticle(this.particles[i]);
            }
        }
    }

    update(deltaTime)
    {
        this.particleTime += deltaTime;
        
        const numActiveParticles = Math.min(this.NUM_PARTICLES, this.particles.length);
        
        for (let i = 0; i < numActiveParticles; i++)
        {
            const p = this.particles[i];
            
            p.age += deltaTime;
            
            if (p.age >= p.lifespan)
            {
                this.resetParticle(p);
                continue;
            }
            
            p.bezierTime += (deltaTime * p.speed) / p.segmentDuration;
            
            if (p.bezierTime >= 1.0)
            {
                this.generateNewBezierCurve(p);
            }
            
            const t = Math.min(p.bezierTime, 1.0);
            this.cubicBezier(p.bezierStart, p.bezierControl1, p.bezierControl2, p.bezierEnd, t, p.position);
            
            this.clampToBox(p.position, this.SPAWN_CENTER);
            
            if (!p.baseSize) {
                p.baseSize = p.size;
            }

            // Breathing effect
            const breathe = Math.sin(this.particleTime * 1.5 + p.blinkPhase) * 0.5 + 0.5;
            p.size = p.baseSize * (0.85 + breathe * 0.3);
            
            // Fade in/out
            const normalizedAge = p.age / p.lifespan;
            if(normalizedAge < 0.15)
            {
                p.color[3] = normalizedAge / 0.15;
            }
            else if(normalizedAge > 0.85)
            {
                p.color[3] = 1.0 - ((normalizedAge - 0.85) / 0.15);
            }
            else
            {
                p.color[3] = 1.0;
            }
        }
    }

    render(camera, viewMatrix, projectionMatrix)
    {
        if (!this.shader || !this.shader.shaderProgramObject)
        {
            return;
        }
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.depthMask(false);
        gl.disable(gl.CULL_FACE);
        
        this.shader.use();
        gl.bindVertexArray(this.vao);
        
        const cameraPos = camera.getEye();
        const lightPos = vec3.clone(cameraPos);
        
        gl.uniformMatrix4fv(this.shader.viewMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(this.shader.projectionMatrixUniform, false, projectionMatrix);
        gl.uniform3fv(this.shader.lightPosUniform, lightPos);
        gl.uniform3fv(this.shader.viewPosUniform, cameraPos);
        
        // Only render active particles
        const numActiveParticles = Math.min(this.NUM_PARTICLES, this.particles.length);
        
        for (let i = 0; i < numActiveParticles; i++)
        {
            const p = this.particles[i];
            
            if (p.age >= p.lifespan) 
            {   
                continue;
            }
            
            const modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, p.position);
            mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(p.size, p.size, p.size));
            
            gl.uniformMatrix4fv(this.shader.modelMatrixUniform, false, modelMatrix);
            gl.uniform4fv(this.shader.colorUniform, p.color);
            
            gl.drawArrays(gl.TRIANGLES, 0, this.sphereMesh.vertexCount);
        }
        
        gl.bindVertexArray(null);
        this.shader.unuse();
        
        gl.depthMask(true);
        gl.disable(gl.BLEND);
        gl.enable(gl.CULL_FACE);
    }
   
    uninitialize()
    {
        if (this.vao)
        {
            gl.deleteVertexArray(this.vao);
            this.vao = null;
        }
        if(this.vboPosition)
        {
            gl.deleteBuffer(this.vboPosition);
            this.vboPosition = null;
        }
        if(this.vboNormal)
        {
            gl.deleteBuffer(this.vboNormal);
            this.vboNormal = null;
        }
        if(this.vboTexCoord)
        {
            gl.deleteBuffer(this.vboTexCoord);
            this.vboTexCoord = null;
        }
        if(this.shader)
        {
            this.shader.uninitialize();
            this.shader = null;
        }
        this.particles = [];
    }
}
