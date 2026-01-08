class Camera {
    constructor(width, height, position = [0.0, 20.0, 5.0]) {
        this.width = width;
        this.height = height;

        this.position = vec3.fromValues(...position);
        this.front = vec3.fromValues(0.0, 0.0, -1.0);
        this.up = vec3.fromValues(0.0, 1.0, 0.0);
        this.right = vec3.create();
        this.worldUp = vec3.clone(this.up);

        this.yaw = Camera.YAW;
        this.pitch = Camera.PITCH;
        this.movementSpeed = Camera.SPEED;
        this.mouseSensitivity = Camera.SENSITIVITY;
        this.zoom = Camera.ZOOM;

        this.lastX = 0.0;
        this.lastY = 0.0;
        this.firstMouse = true;

        // Log enable/disable flag
        this.logEnabled = false;

        this.updateCameraVectors();
    }

    static get YAW() { return 80.0; }
    static get PITCH() { return 0.0; }
    static get SPEED() { return 10.0; }
    static get SENSITIVITY() { return 0.4; }
    static get ZOOM() { return 45.0; }

    getViewMatrix() {
        const center = vec3.create();
        vec3.add(center, this.position, this.front);
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, center, this.up);
        return viewMatrix;
    }

    getEye() {
        return this.position;
    }

    getCenter() {
        const center = vec3.create();
        vec3.add(center, this.position, this.front);
        return center;
    }

    getUp() {
        return this.up;
    }

    updateCameraVectors() {
        const front_ = vec3.fromValues(
            Math.cos(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch)),
            Math.sin(this.degToRad(this.pitch)),
            Math.sin(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch))
        );
        vec3.normalize(this.front, front_);

        vec3.cross(this.right, this.front, this.worldUp);
        vec3.normalize(this.right, this.right);
        
        vec3.cross(this.up, this.right, this.front);
        vec3.normalize(this.up, this.up);
    }

    invertPitch() {
        this.pitch = -this.pitch;
        this.updateCameraVectors();
        // var distance = 2.0 * (this.position[1] - 0.0);
        // this.position[1] -= distance;

    }

    updateInversCameraVectors() {

        // this.front = vec3.create();
        // this.front = vec3.fromValues(
        //     Math.cos(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch)),
        //     Math.sin(degToRad(this.pitch)),
        //     Math.sin(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch)),
        // );
        // vec3.normalize(this.front, this.front);

        const front_ = vec3.fromValues(
            Math.cos(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch)),
            Math.sin(this.degToRad(this.pitch)),
            Math.sin(this.degToRad(this.yaw)) * Math.cos(this.degToRad(this.pitch))
        );
        vec3.normalize(this.front, front_);
        vec3.cross(this.right, this.front, this.worldUp);
        vec3.normalize(this.right, this.right);
        vec3.cross(this.up, this.right, this.front);
        vec3.normalize(this.up, this.up);


        // var distance = 2.0 * (this.position[1] - 0.0);
        // this.position[1] -= distance;
    }

    updateInversCameraVectors_Mirror() {
        this.pitch = -this.pitch;
        this.updateCameraVectors();
        this.position[0] = -this.position[0];
    }

    updateResolution(width, height) {
        this.width = width;
        this.height = height;
    }

    keyboardInputs(keyEvent) {
        // in
        let velocity = this.movementSpeed * 0.1;
        // Adesh: Temp - For manually getting a point
        if (keyEvent.code == 'Backquote') {
            console.log("Position: "+this.position);
            console.log("yaw = "+this.yaw);
            console.log("pitch = "+this.pitch);
        }

        if (keyEvent.code == 'KeyL') {
            if (this.logEnabled == false)
                this.logEnabled = true;
            else
                this.logEnabled = false;
        }

        if (keyEvent.code == 'KeyW') {
            vec3.scaleAndAdd(this.position, this.position, this.front, velocity);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        // left
        if (keyEvent.code == 'KeyA') {
            let tempScale = vec3.create();
            vec3.scale(tempScale, this.right, velocity);
            vec3.sub(this.position, this.position, tempScale);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        // out
        if (keyEvent.code == 'KeyS') {
            let tempScale = vec3.create();
            vec3.scale(tempScale, this.front, velocity);
            vec3.sub(this.position, this.position, tempScale);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        // right
        if (keyEvent.code == 'KeyD') {
            vec3.scaleAndAdd(this.position, this.position, this.right, velocity);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        // up
        if (keyEvent.code == 'KeyV') {
            vec3.scaleAndAdd(this.position, this.position, this.up, velocity);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        // down
        if (keyEvent.code == 'Space') {
            let tempScale = vec3.create();
            vec3.scale(tempScale, this.up, velocity);
            vec3.sub(this.position, this.position, tempScale);
            if (this.logEnabled) {
                console.log("Position: "+this.position);
                console.log("yaw = "+this.yaw);
                console.log("pitch = "+this.pitch);
            }
        }

        if (keyEvent.shiftKey) {
            this.movementSpeed = 6.5;
        }
    }

    // Detects shift key up to decrease the movementSpeed
    inputOnKeyUp(event) {
        if (event.code == 'ShiftLeft') {
            this.movementSpeed = 4.5;
        }
    }
    mouseInputs(event) {
        if (this.firstMouse) {
            this.lastX = event.x;
            this.lastY = event.y;
            this.firstMouse = false;
        }
        let xoffset = event.x - this.lastX;
        let yoffset = this.lastY - event.y;
        this.lastX = event.x;
        this.lastY = event.y;


        let constrainPitch = true;
        xoffset *= this.mouseSensitivity;
        yoffset *= this.mouseSensitivity;

        this.yaw = (this.yaw + xoffset) % 360.0;
        this.pitch += yoffset;

        if (constrainPitch) {
            if (this.pitch > 89.0)
                this.pitch = 89.0;
            if (this.pitch < -89.0)
                this.pitch = -89.0;
        }

        if (this.logEnabled) {
            console.log("Position: "+this.position);
            console.log("yaw = "+this.yaw);
            console.log("pitch = "+this.pitch);
        }
        this.updateCameraVectors();
    }

    // Process mouse scroll
    mouseScroll(event) {
        // console.log(event); 

        this.zoom += (event.deltaY / 100.0);
        console.log(this.zoom)
        if (this.zoom < 1.0)
            this.zoom = 1.0;
        if (this.zoom > 1000.0)
            this.zoom = 1000.0;

        mat4.perspective(
            perspectiveProjectionMatrix,
            degToRad(this.zoom),
            parseFloat(canvas.width) / parseFloat(canvas.height),
            0.1,
            5000.0)
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180.0;
    }
}

// // Source: Wikipedia
// // Example: lerp(0.5, 0.0, 1.0) == 0.5
// var lerp = (t, p1, p2) => (1 - t) * p1 + t * p2;

// var reduce = (t, p1, p2, ...ps) => ps.length > 0
//     ? [lerp(t, p1, p2), ...reduce(t, p2, ...ps)]
//     : [lerp(t, p1, p2)];

// // Example: deCasteljau(0.5, [0.0, 1.0, 2.0, 3.0]) == 1.5
// var deCasteljau = (t, ps) => ps.length > 1
//     ? deCasteljau(t, reduce(t, ...ps))
//     : ps[0];

// function extractColumn(arr, column) {
//     return arr.map(x => x[column])
// }

// function calculateBezierCurve(points, time) {
//     return vec3.fromValues(
//         deCasteljau(time, extractColumn(points, 0)),
//         deCasteljau(time, extractColumn(points, 1)),
//         deCasteljau(time, extractColumn(points, 2))
//     );
// }
