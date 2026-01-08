class ChimniFire {
	constructor() {

		console.log("Initializing Fire Effect...");

		// Define Constants 
		this.FIRE_ATTRIBUTE_POSITION = 0;
		this.FIRE_ATTRIBUTE_COLOR = 1;
		this.FIRE_ATTRIBUTE_TEXCOORD = 2;
		this.FIRE_ATTRIBUTE_OFFSET = 3;

		this.fireEmitPositionSpread = { x: 150, y: 2, z: 0.1 };
		this.fireEmitRate = 1600;
		this.fireSize = 60.0;
		this.fireSizeVariance = 10.0;
		this.fireEmitAngleVariance = 0.42;
		this.fireSpeed = 200.0;
		this.fireSpeedVariance = 80.0;
		this.fireDeathSpeed = 0.0025;
		this.fireTriangleness = 0.00001;
		this.fireTextureHue = 10.0;
		this.fireTextureHueVariance = 1.0;
		this.fireTextureColorize = true;
		this.wind = false;
		this.omnidirectionalWind = false;

		this.windStrength = 20.0;
		this.windTurbulance = 0.0003;
		this.sparks = true;
		this.sparkEmitRate = 6.0;
		this.sparkSize = 10.0;
		this.sparkSizeVariance = 20.0;
		this.sparkSpeed = 400.0;
		this.sparkSpeedVariance = 80.0;
		this.sparkDeathSpeed = 0.0085;

		this.fireParticles = [];
		this.sparkParticles = [];

		this.texture = null;
		this.image = null;

		this.enableFire = false;

		this.emitCenter = { x: 0, y: 0, z: 0 };

		this.particleDiscrepancy = 0;
		this.lastParticleTime = this.time();

		this.sparkParticleDiscrepancy = 0;

		this.vao = null;
		this.vboPosition = null;
		this.vboColor = null;
		this.vboTexCoord = null;
		this.vboOffset = null;

		this.mUniform = null;
		this.vUniform = null;
		this.pUniform = null;
		this.textureSamplerUniform = null;

		this.shaderProgramObject = null;

		noise.seed(Math.random());

		// this.quadOffsets = [
		// 	-0.5, -0.5,
		// 	0.5, -0.5,
		// 	-0.5, 0.5,
		// 	-0.5, 0.5,
		// 	0.5, -0.5,
		// 	0.5, 0.5
		// ];
	}

	async initialize(gl) {

		console.log("MST: Initializing Fire Shaders and Buffers...");

		this.shaderProgramObject = ShaderManger.createProgram(gl);
		await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'chimni_fire/chimni_fire.vs', gl.VERTEX_SHADER));
		await gl.attachShader(this.shaderProgramObject, await ShaderManger.loadShader(gl, 'chimni_fire/chimni_fire.fs', gl.FRAGMENT_SHADER));

		console.log("MST: Binding Fire Shader Attributes...");

		gl.bindAttribLocation(this.shaderProgramObject, this.FIRE_ATTRIBUTE_POSITION, "inPosition");

		gl.bindAttribLocation(this.shaderProgramObject, this.FIRE_ATTRIBUTE_COLOR, "inColor");

		gl.bindAttribLocation(this.shaderProgramObject, this.FIRE_ATTRIBUTE_TEXCOORD, "inTexCoord");

		// gl.bindAttribLocation(this.shaderProgramObject, this.FIRE_ATTRIBUTE_OFFSET, "inOffset");

		ShaderManger.linkProgram(gl, this.shaderProgramObject);

		if (!gl.getProgramParameter(this.shaderProgramObject, gl.LINK_STATUS)) {
			var error = gl.getProgramInfoLog(this.shaderProgramObject);
			if (0 < error.length) {
				throw new Error(error);
			}
		}

		this.mUniform = gl.getUniformLocation(this.shaderProgramObject, "uModelMatrix");
		this.vUniform = gl.getUniformLocation(this.shaderProgramObject, "uViewMatrix");
		this.pUniform = gl.getUniformLocation(this.shaderProgramObject, "uProjectionMatrix");
		this.textureSamplerUniform = gl.getUniformLocation(this.shaderProgramObject, "uTextureSampler");


		this.vao = gl.createVertexArray();
		this.vboPosition = gl.createBuffer();
		this.vboColor = gl.createBuffer();
		this.vboTexCoord = gl.createBuffer();
		// this.vboOffset = gl.createBuffer();

		this.createFireParticles();
		this.createSparkParticles();
		this.loadTexture(gl, 'assets/textures/ChimniFire/chimni_fire_gradient.png');

		console.log("MST: Fire Effect Initialized");

		gl.bindVertexArray(this.vao);

		// only enable + set pointers here
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_POSITION);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_COLOR, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_COLOR);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_TEXCOORD);

		// gl.bindBuffer(gl.ARRAY_BUFFER, this.vboOffset);
		// gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_OFFSET, 2, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_OFFSET);

		gl.bindVertexArray(null);
	}

	createFireParticles() {

		var size = randomSpread(this.fireSize, this.fireSize * (this.fireSizeVariance / 100.0));
		var speed = randomSpread(this.fireSpeed, this.fireSpeed * (this.fireSpeedVariance / 100.0));

		var hue = randomSpread(this.fireTextureHue, this.fireTextureHueVariance);
		var color = HSVtoRGB(convertHue(hue), 1.0, 0.5);
		color.a = 0.5;

		var particle = {

			position: random3DVec(this.emitCenter, this.fireEmitPositionSpread),
			velocity: scaleVec3D(randomUnitVec3D(Math.PI / 2, this.fireEmitAngleVariance), speed),
			size: {
				width: size,
				height: size
			},
			color: color,
		};

		this.fireParticles.push(particle);
		// console.log("Created fire particle: ");
		// console.log(this.fireParticles);
	}

	createSparkParticles() {

		var size = randomSpread(this.sparkSize, this.sparkSize * (this.sparkSizeVariance / 100.0));
		var speed = randomSpread(this.sparkSpeed, this.sparkSpeed * (this.sparkSpeedVariance / 100.0));
		var origin = clone3DVec(this.emitCenter);

		var particle = {

			position: random3DVec(this.emitCenter, this.fireEmitPositionSpread),
			velocity: scaleVec3D(randomUnitVec3D(Math.PI / 2, this.fireEmitAngleVariance * 2.0), speed),
			size: {
				width: size,
				height: size
			},
			origin: origin,
			color: { r: 1.0, g: 0.8, b: 0.3, a: 1.0 }
		};
		this.sparkParticles.push(particle);
	}

	handleTextureLoaded(gl, image, textureName) {
		console.log("MST: Texture Loaded Successfully: " + textureName);

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	loadTexture(gl, textureName) {
		this.texture = gl.createTexture();
		this.image = new Image();
		this.image.src = textureName;
		this.image.onload = () => {
			this.handleTextureLoaded(gl, this.image, textureName);
		};
		console.log("MST: Texture Loading Started: " + textureName);
	}

	async loadShader(gl, url, shaderType) {

		const shaderSource = await fetch(url).then((response) => {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error('Failed to load shader: ' + url);
			}
		});

		const shader = gl.createShader(shaderType);
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw new Error(url + ": " + 'Could not compile WebGL shader. \n\n' + info);
		}

		return shader;
	}

	update() {
		if (this.enableFire)
			this.logic();
	}


	time() {
		var d = new Date();
		var n = d.getTime();
		return n;
	}

	// calculate new positions for all the particles
	logic() {

		// console.log("MST: ChimniFire: Logic() called");

		var currentParticleTime = this.time();
		var timeDifference = currentParticleTime - this.lastParticleTime;

		// we don't want to generate a ton of particles if the browser was minimized or something
		if (timeDifference > 100)
			timeDifference = 100;

		// update fire particles

		this.particleDiscrepancy += this.fireEmitRate * (timeDifference) / 1000.0;
		// console.log("particleDiscrepancy: " + particleDiscrepancy);
		while (this.particleDiscrepancy > 0) {
			// createFireParticles({ x: canvas.width / 2, y: canvas.height / 2 + 200, z: canvas.width / 2 });
			this.createFireParticles({ x: 0, y: 0, z: 0 });
			this.particleDiscrepancy -= 1.0;
		}

		// console.log("num fire particles: " + fireParticles.length);

		var particleAverage = { x: 0, y: 0, z: 0 };
		var numParts = this.fireParticles.length;
		for (var i = 0; i < numParts; i++) {
			particleAverage.x += this.fireParticles[i].position.x / numParts;
			particleAverage.y += this.fireParticles[i].position.y / numParts;
			particleAverage.z += this.fireParticles[i].position.z / numParts;
		}


		for (var i = 0; i < this.fireParticles.length; i++) {
			var x = this.fireParticles[i].position.x;
			var y = this.fireParticles[i].position.y;
			var z = this.fireParticles[i].position.z;

			// move the particle
			this.fireParticles[i].position = addVec3Ds(this.fireParticles[i].position, scaleVec3D(this.fireParticles[i].velocity, timeDifference / 1000.0));

			this.fireParticles[i].color.a -= this.fireDeathSpeed + Math.abs(particleAverage.x - this.fireParticles[i].position.x) * this.fireTriangleness;//;Math.abs((this.fireParticles[i].position.x-canvas.width/2)*this.fireTriangleness);

			if (this.fireParticles[i].position.y <= -this.fireParticles[i].size.height * 2 || this.fireParticles[i].color.a <= 0) {
				markForDeletion(this.fireParticles, i);
				// console.log("marking fire particle for deletion");
			}
		}
		this.fireParticles = deleteMarked(this.fireParticles);
		// console.log("num fire particles after deletion: " + fireParticles.length);

		// update spark particles
		this.sparkParticleDiscrepancy += this.sparkEmitRate * (timeDifference) / 1000.0;
		while (this.sparkParticleDiscrepancy > 0) {
			// createSparkParticles({ x: canvas.width / 2, y: canvas.height / 2 + 200 });
			this.createSparkParticles({ x: 0, y: 0, z: 0 });
			this.sparkParticleDiscrepancy -= 1.0;
		}

		for (var i = 0; i < this.sparkParticles.length; i++) {

			var x = this.sparkParticles[i].position.x;
			var y = this.sparkParticles[i].position.y;
			var z = this.sparkParticles[i].position.z;
			this.sparkParticles[i].velocity = addVec3Ds(this.sparkParticles[i].velocity, scaleVec3D(unitVec3D((noise.simplex3(x / 500, y / 500, this.lastParticleTime * 0.0003) + 1.0) * Math.PI * 0.5), 20.0));
			this.sparkParticles[i].position = addVec3Ds(this.sparkParticles[i].position, scaleVec3D(this.sparkParticles[i].velocity, timeDifference / 1000.0));

			this.sparkParticles[i].color.a -= this.sparkDeathSpeed;

			if (this.sparkParticles[i].position.y <= -this.sparkParticles[i].size.height * 2 || this.sparkParticles[i].color.a <= 0) {
				markForDeletion(this.sparkParticles, i);
			}
		}
		this.sparkParticles = deleteMarked(this.sparkParticles);

		// document.getElementById("numParticles").innerHTML = "# particles: " + (fireParticles.length + sparkParticles.length);

		this.lastParticleTime = currentParticleTime;

		// console.log("MST: ChimniFire: Logic() call ended");
	}


	concat_inplace(index, arr1, arr2) {
		for (var i = 0; i < arr2.length; i++) {
			arr1[index] = arr2[i];
			index += 1;
		}
		return index;
	}


	drawFireQuads(gl, rects, textureIndex) {
		var index = 0;
		var colorIndex = 0;
		var texIndex = 0;
		var rectArray = [];
		var colorArray = [];
		var textureCoordinates = [];


		for (var i = 0; i < rects.length; i++) {
			var x1 = rects[i].position.x - rects[i].size.width / 2;
			var x2 = rects[i].position.x + rects[i].size.width / 2;
			var y1 = rects[i].position.y - rects[i].size.height / 2;
			var y2 = rects[i].position.y + rects[i].size.height / 2;
			var z = rects[i].position.z;
			index = this.concat_inplace(index, rectArray, [
				x1, y1, z,
				x2, y1, z,
				x1, y2, z,
				x1, y2, z,
				x2, y1, z,
				x2, y2, z]);
			texIndex = this.concat_inplace(texIndex, textureCoordinates, [
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0
			]);
			for (var ii = 0; ii < 6; ii++) {
				colorIndex = this.concat_inplace(colorIndex, colorArray, [
					rects[i].color.r,
					rects[i].color.g,
					rects[i].color.b,
					rects[i].color.a
				]);
			}
		}

		// console.log(rectArray);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTexCoord);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_TEXCOORD);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPosition);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_POSITION);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectArray), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
		gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_COLOR, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_COLOR);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// gl.bindBuffer(gl.ARRAY_BUFFER, this.vboOffset);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.quadOffsets), gl.STATIC_DRAW);
		// gl.vertexAttribPointer(this.FIRE_ATTRIBUTE_OFFSET, 2, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(this.FIRE_ATTRIBUTE_OFFSET);
		// gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.drawArrays(gl.TRIANGLES, 0, rects.length * 6);
	}

	renderFire(camera) {

		// Enable Blend for transparency
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);     // Good for fire
		gl.depthMask(false);                    // prevents depth writing
		gl.enable(gl.BLEND);

		// console.log("MST: Rendering Chimni");
		this.enableFire = true;

		var localModelMatrix = mat4.create();
		var viewMatrix = camera.getViewMatrix();

		var translateMatrix = mat4.create();
		var scaleMatrix = mat4.create();

		mat4.translate(translateMatrix, translateMatrix, [256, 9, -303]);
		mat4.scale(scaleMatrix, scaleMatrix, [0.008, 0.008, 0.008]);

		mat4.multiply(localModelMatrix, localModelMatrix, translateMatrix); // Computes out = a * b
		mat4.multiply(localModelMatrix, localModelMatrix, scaleMatrix); // Computes out = a * b

		gl.useProgram(this.shaderProgramObject);

		gl.uniformMatrix4fv(this.mUniform, false, localModelMatrix);
		gl.uniformMatrix4fv(this.vUniform, false, viewMatrix);
		gl.uniformMatrix4fv(this.pUniform, false, perspectiveProjectionMatrix);
		gl.uniform1i(this.textureSamplerUniform, 0);

		// draw fire particles
		if (this.fireParticles)
			this.drawFireQuads(gl, this.fireParticles, 0);

		// draw spark particles
		// if (this.sparkParticles)
		// 	this.drawFireQuads(gl, this.sparkParticles, 0);

		gl.useProgram(null);

		// Disable Blend after finishing
		gl.disable(gl.BLEND);

		gl.depthMask(true);                    // prevents depth writing
	}

	uninitialize() {
		if (this.vboPosition) {
			gl.deleteBuffer(this.vboPosition);
			this.vboPosition = null;
		}

		if (this.vboColor) {
			gl.deleteBuffer(this.vboColor);
			this.vboColor = null;
		}

		if (this.vboTexCoord) {
			gl.deleteBuffer(this.vboTexCoord);
			this.vboTexCoord = null;
		}

		if (this.vao) {
			gl.deleteVertexArray(this.vao);
			this.vao = null;
		}

		if (this.shaderProgramObject) {
			gl.deleteProgram(this.shaderProgramObject);
			this.shaderProgramObject = null;
		}
	}

}