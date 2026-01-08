class BSplineCamera {
    constructor() {
        this.position = vec3.create();
        this.front = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.create();
        this.worldUp = vec3.clone(this.up);

        this.viewMatrix = mat4.create();

        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;

        this.bSplinePoints = [];
        this.catmullRomPoints = [];
        this.yawPoints = [];
        this.pitchPoints = [];
        this.rollPoints = [];


        // To draw helper line
        this.vao_line = gl.createVertexArray();
        gl.bindVertexArray(this.vao_line);
        {
            // Vertices
            this.vbo_line = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
            {
                gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);

    }

    // Displays a trailing line tracing the bezier curve
    displayCurve(camera, modelMatrix) {
        if (this.bSplinePoints === undefined)
            return;

        colorCubeShader.bind(camera, modelMatrix, [1.0, 0.0, 1.0]);
        {
            gl.bindVertexArray(this.vao_line);

            let tempVertices = [];
            const degree = 2;
            const knotVector = this.createKnotVectorNew(this.bSplinePoints.length, degree);

            for (let i = 0; i <= 1.0; i += 0.005) {

                // Degree of the B-spline
                let point = this.bSplineCurve(i, this.bSplinePoints, degree, knotVector);

                tempVertices.push(point[0]);
                tempVertices.push(point[1]);
                tempVertices.push(point[2]);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tempVertices), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.drawArrays(gl.LINE_STRIP, 0, tempVertices.length / 3);
            gl.bindVertexArray(null);

            colorCubeShader.bind(camera, modelMatrix, [0.0, 1.0, 1.0]);
            // Main points
            gl.bindVertexArray(this.vao_line);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([].concat(...this.bSplinePoints)), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.drawArrays(gl.POINTS, 0, [].concat(...this.bSplinePoints).length / 3);
            gl.bindVertexArray(null);



            colorCubeShader.bind(camera, modelMatrix, [1.0, 0.0, 0.0]);
            // Main points
            gl.bindVertexArray(this.vao_line);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_line);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bSplinePoints[vectorIndex]), gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.drawArrays(gl.POINTS, 0, 1);
            gl.bindVertexArray(null);



        }
        colorCubeShader.unbind();

    }

    // displayControlPoints() {

    //     for (var i = 0; i < bezierPointsGlobal.length; i++) {
    //         modelMatrix = mat4.create();
    //         mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(bezierPointsGlobal[i][0], bezierPointsGlobal[i][1], bezierPointsGlobal[i][2]));
    //         mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.5, 0.5, 0.5));
    //         colorCubeShader.render(camera, modelMatrix, vec3.fromValues(1.0, 1.0, 1.0));
    //     }
    // }

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
        return this.front;
    }

    getUp() {
        return this.up;
    }
    updateCameraVectors() {
        let front_ = vec3.create();
        front_[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
        front_[1] = Math.sin(this.pitch);
        front_[2] = Math.sin(this.yaw) * Math.cos(this.pitch);
        vec3.normalize(this.front, front_);

        vec3.cross(this.right, this.front, this.worldUp);
        vec3.normalize(this.right, this.right);

        vec3.cross(this.up, this.right, this.front);
        vec3.normalize(this.up, this.up);

        let rotationMatrix = mat4.create();
        mat4.identity(rotationMatrix);
        mat4.rotate(rotationMatrix, rotationMatrix, this.roll, this.front);
        vec3.transformMat4(this.up, this.up, rotationMatrix);

        // this.getViewMatrix();
        // vec3.add(this.front, this.position, front);

        // this.viewMatrix = mat4.create();
        // mat4.lookAt(this.viewMatrix, this.position, this.front, up);
    }


    invertPitch() {

        this.pitch = -this.pitch;
        this.updateCameraVectors();

    }


    moveToPoint(point, yaw, pitch, roll) {
        vec3.copy(this.position, point);
        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
        this.updateCameraVectors();
    }

    setBSplinePoints(points, yawPoints, pitchPoints, rollPoints) {
        this.bSplinePoints = points;
        this.yawPoints = yawPoints;
        this.pitchPoints = pitchPoints;
        this.rollPoints = rollPoints;
    }

    setCatmullRomPoints(points, yawPoints, pitchPoints) {
        this.catmullRomPoints = points;
        this.yawPoints = yawPoints;
        this.pitchPoints = pitchPoints;
    }

    calculateBSplinePoint(t) {
        let degree = 3; // Cubic B-spline
        let n = this.bSplinePoints.length - 1;
        let k = degree + 1;
        let u = t * (n + 1 - degree) + degree; // Normalize t to knot vector

        // console.log(this.bSplinePoints);
        let point = vec3.create();
        for (let i = 0; i <= n; i++) {
            let b = this.basisFunction(i, degree, u);
            let cp = this.bSplinePoints[i];
            vec3.scaleAndAdd(point, point, cp, b);
        }
        return point;

    }

    // Utility function to create a knot vector
    createKnotVectorNew(n, degree) {
        const m = n + degree + 1;
        const knotVector = new Array(m);

        for (let i = 0; i <= degree; i++) {
            knotVector[i] = 0;
        }
        for (let i = degree + 1; i < n; i++) {
            knotVector[i] = (i - degree) / (n - degree);
        }
        for (let i = n; i < m; i++) {
            knotVector[i] = 1;
        }
        return knotVector;
    }

    // Calculate the basis function
    basisFunctionNew(i, k, t, knots) {
        if (k === 0) {
            return knots[i] <= t && t < knots[i + 1] ? 1.0 : 0.0;
        } else {
            const denom1 = knots[i + k] - knots[i];
            const denom2 = knots[i + k + 1] - knots[i + 1];
            const term1 = denom1 !== 0 ? (t - knots[i]) / denom1 * this.basisFunctionNew(i, k - 1, t, knots) : 0;
            const term2 = denom2 !== 0 ? (knots[i + k + 1] - t) / denom2 * this.basisFunctionNew(i + 1, k - 1, t, knots) : 0;
            return term1 + term2;
        }
    }

    // Calculate the B-spline curve point
    bSplineCurve(t, controlPoints, degree, knotVector) {
        const nPoints = controlPoints.length;
        const pointDim = controlPoints[0].length;
        const result = new Array(pointDim).fill(0);

        for (let i = 0; i < nPoints; i++) {
            const coef = this.basisFunctionNew(i, degree, t, knotVector);
            for (let j = 0; j < pointDim; j++) {
                result[j] += coef * controlPoints[i][j];
            }
        }
        return result;
    }


    basisFunction(i, k, t) {
        if (k === 0) {
            return (i <= t && t < i + 1) ? 1.0 : 0.0;
        }
        let denominator1 = (i + k - t);
        let denominator2 = (t - i);

        let term1 = denominator1 !== 0 ? ((t - i) / denominator1) * this.basisFunction(i, k - 1, t) : 0;
        let term2 = denominator2 !== 0 ? ((i + k + 1 - t) / denominator2) * this.basisFunction(i + 1, k - 1, t) : 0;

        return term1 + term2;
    }

    interpolateLinear(t, points) {
        let n = points.length - 1;
        let segmentLength = 1 / n;
        let segmentIndex = Math.floor(t / segmentLength);
        let segmentT = (t - segmentIndex * segmentLength) / segmentLength;

        let p0 = points[segmentIndex];
        let p1 = points[Math.min(segmentIndex + 1, n)];

        return (1 - segmentT) * p0 + segmentT * p1;
    }

    getPointOnBspline(t) {
        const degree = 2;
        const knotVector = this.createKnotVectorNew(this.bSplinePoints.length, degree);

        // Degree of the B-spline
        let point = this.bSplineCurve(t, this.bSplinePoints, degree, knotVector);

        // let yaw = this.deCasteljau(t, this.yawPoints) * (Math.PI / 180);
        // let pitch = this.deCasteljau(t, this.pitchPoints) * (Math.PI / 180);
        // let roll = this.deCasteljau(t, this.rollPoints) * (Math.PI / 180);
        let yaw = this.interpolateLinear(t - 0.01, this.yawPoints) * (Math.PI / 180); // Convert to radians
        let pitch = this.interpolateLinear(t - 0.01, this.pitchPoints) * (Math.PI / 180); // Convert to radians
        let roll = this.interpolateLinear(t - 0.01, this.rollPoints) * (Math.PI / 180); // Convert to radians

        return {
            point,
            yaw,
            pitch,
            roll
        };
    }

    bsplineBasis(i, k, t, knots) {
        if (k === 1) {
            return (t >= knots[i] && t < knots[i + 1]) ? 1 : 0;
        }

        let coeff1 = (t - knots[i]) / (knots[i + k - 1] - knots[i]);
        let coeff2 = (knots[i + k] - t) / (knots[i + k] - knots[i + 1]);

        if (isNaN(coeff1)) coeff1 = 0;
        if (isNaN(coeff2)) coeff2 = 0;

        return coeff1 * this.bsplineBasis(i, k - 1, t, knots) + coeff2 * this.bsplineBasis(i + 1, k - 1, t, knots);
    }

    bsplineInterpolate(t, points, degree) {
        let n = points.length - 1;
        let knots = [];

        // Uniform Knot Vector
        for (let i = 0; i <= n + degree + 1; i++) {
            knots.push(i);
        }

        let result = 0;
        for (let i = 0; i <= n; i++) {
            result += this.bsplineBasis(i, degree + 1, t, knots) * points[i];
        }

        return result;
    }


    moveAlongBSpline(t) {
        let point;
        if (this.bSplinePoints.length == 1)
        {
            point = this.bSplinePoints[0]; // fixed position

            let angle = (performance.now() * 0.0002) % (2 * Math.PI);
            this.moveToPoint(point, angle, 0.0, 0.0);
        }
        else
        {
            const degree = 2;
            const knotVector = this.createKnotVectorNew(this.bSplinePoints.length, degree);

            point = this.bSplineCurve(t, this.bSplinePoints, degree, knotVector);

            // let yaw = this.interpolateLinear(t, this.yawPoints) * (Math.PI / 180); // Convert to radians
            // let pitch = this.interpolateLinear(t, this.pitchPoints) * (Math.PI / 180); // Convert to radians
            // let roll = this.interpolateLinear(t, this.rollPoints) * (Math.PI / 180); // Convert to radians

            // let degree2 = 4; // Cubic B-spline

            // let yaw = this.bsplineInterpolate(t, this.yawPointsgetPointOnBspline, degree2) * (Math.PI / 180); // Convert to radians
            // let pitch = this.bsplineInterpolate(t, this.pitchPoints, degree2) * (Math.PI / 180); // Convert to radians
            // let roll = this.bsplineInterpolate(t, this.rollPoints, degree2) * (Math.PI / 180); // Convert to radians

            let yaw = this.deCasteljau(t, this.yawPoints) * (Math.PI / 180);
            let pitch = this.deCasteljau(t, this.pitchPoints) * (Math.PI / 180);
            let roll = this.deCasteljau(t, this.rollPoints) * (Math.PI / 180);
            this.moveToPoint(point, yaw, pitch, roll);
        }
    }


    moveToControlPoint(index) {

        this.moveToPoint(bezierPointsGlobal[index], yawGlobal[index] * (Math.PI / 180), pitchGlobal[index] * (Math.PI / 180), rollGlobal[index] * (Math.PI / 180));
    };

    getPointOnBSPlinePoint(index) {

        return bezierPointsGlobal[index];
    };


    getYawAtIndex(index) {
        return yawGlobal[index] * (Math.PI / 180);
    }


    static setGlobalCamera() {
        console.log("setGlobalCamera");
        globalBSplineCamera = this;
    }

    // Source: Wikipedia
    // Example: lerp(0.5, 0.0, 1.0) == 0.5
    lerp = (t, p1, p2) => (1 - t) * p1 + t * p2;

    // Example: reduce(0.5, ...[0.0, 1.0, 2.0, 3.0]) == [0.5, 1.5, 2.5]
    reduce = (t, p1, p2, ...ps) => ps.length > 0
        ? [this.lerp(t, p1, p2), ...this.reduce(t, p2, ...ps)]
        : [this.lerp(t, p1, p2)];

    // Example: deCasteljau(0.5, [0.0, 1.0, 2.0, 3.0]) == 1.5
    deCasteljau = (t, ps) => ps.length > 1
        ? this.deCasteljau(t, this.reduce(t, ...ps))
        : ps[0];
}
