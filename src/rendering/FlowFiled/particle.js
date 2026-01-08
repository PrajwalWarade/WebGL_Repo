
// var FlowFiled_ = 1000;
var FlowFiled_Width = 300;
var FlowFiled_Height = 100;
var FlowFiled_Depth = 100;


function limitVec3(out, vec, max) {
	let len = vec3.length(vec);
	if (len > max) {
		vec3.scale(out, vec, max / len);
	} else {
		vec3.copy(out, vec);
	}
}
function particle(maxSpeed, r, g, b) {
	this.maxSpeed = maxSpeed;
	// this.r = r + random(-20, 20);
	// this.g = g + random(-20, 20);
	// this.b = b + random(-20, 20);

	this.r = r + Math.random();
	this.g = g + Math.random();
	this.b = b + Math.random();

	this.pos = createVector(Math.random() * (FlowFiled_Width), Math.random() * (FlowFiled_Height), Math.random() * (FlowFiled_Depth));
	this.vel = createVector(0.0, 0.0, 0.0);
	this.acc = createVector(0.0, 0.0, 0.0);

	this.prevPos = this.pos.copy();
	// console.log(this.pos);
	// this.prevPos = [...this.pos];
	// this.prevPos = th


	// this.maxSpeed = maxSpeed;
	// this.r = r + Math.random(-20, 20);
	// this.g = g + Math.random(-20, 20);
	// this.b = b + Math.random(-20, 20);

	// this.pos = vec3.fromValues(Math.random() * 800, Math.random() * 800, Math.random() * 800);

	// this.vel = vec3.fromValues(0.0, 0.0, 0.0);
	// this.acc = vec3.fromValues(0.0, 0.0, 0.0);

	// console.log(FlowFiled_Height);

	// this.prevPos = this.pos.copy();       
	// this.prevPos = [...this.pos];

	this.applyForce = function (fv) {
		// if (fv === undefined)
		// 	console.log("fv undefined");
		this.acc.add(fv);
		// console.log("this.acc :" + this.acc);
		// this.acc[0] = this.acc[0] + fv;
		// this.acc[1] = this.acc[1] + fv;
		// if(!this.acc)
		// 	this.acc = vec3.create();
		// vec3.add(this.acc, this.acc, vec3.fromValues(fv, fv, fv))
		// console.log(fv);
	}

	this.update = function () {
		// vec3.add(this.target, this.position, front);
		// vec3.add(this.vel, this.vel, this.acc);
		// vec3.add(this.pos, this.pos, this.acc);
		// limitVec3(this.vel, this.vel, this.maxSpeed);
		// vec3.mult(this.acc, this.acc, 0.0);

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.limit(this.maxSpeed);
		this.acc.mult(0);

		// this.vel[0] = this.vel[0] + this.acc[0];
		// this.vel[1] = this.vel[1] + this.acc[1];

		// this.pos[0] = this.pos[0] + this.vel[0];
		// this.pos[1] = this.pos[1] + this.vel[1];


		// this.vel.limit(this.maxSpeed);
		// this.acc.mult(0);
		// this.acc[0] = this.acc[0] + 0;
		// this.acc[1]= this.acc[1] + 0;
	}

	this.show = function () {
		this.edges();
		this.updatePrevPos();
	}

	this.edges = function (pos) {
		if (this.pos.x > FlowFiled_Width) {
			this.pos.x = 0;
		}
		if (this.pos.x < 0) {
			this.pos.x = FlowFiled_Width;
		}
		if (this.pos.y > FlowFiled_Height) {
			this.pos.y = 0;
		}
		if (this.pos.y < 0) {
			this.pos.y = FlowFiled_Height;
		}

		if (this.pos.z > FlowFiled_Depth) {
			this.pos.z = 0;
		}
		if (this.pos.z < 0) {
			this.pos.z = FlowFiled_Depth;
		}
	}

	this.follow = function (fields) {
		if (fields === undefined)
			console.log("fields is undefimned");

		// console.log("fields size :" + fields.length);

		var x = Math.floor(this.pos.x / gridSize);
		var y = Math.floor(this.pos.y / gridSize);
		var z = Math.floor(this.pos.z / gridSize);
		// var z = Math.floor(this.pos[2] / gridSize);
		var index = x + y * cols;
		// var index = (x * cols * depth) + (y * depth) + z;
		// console.log("follow :" + index);

		// console.log(Math.floor(this.pos[0] / gridSize));
		this.applyForce(fields[index]);
	}

	this.updatePrevPos = function () {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
		this.prevPos.z = this.pos.z;
	}
}