
const getPreviousAndNextKeyFrame = (keyFrames, animationTime) => {
    let next = keyFrames[0];
    let previous = keyFrames[0];
    for (let i = 1; i < keyFrames.length; i++) {
        next = keyFrames[i];
        if (next.time > animationTime)
            break;
        previous = keyFrames[i];
    }
    return { previous, next };
};
const getTransform = (keyFrames, duration) => {
    if (keyFrames.length === 1) {
        switch (keyFrames[0].type) {
            case 'translation':
            case 'scale':
                return keyFrames[0].transform;
            case 'rotation':
                return keyFrames[0].transform;
        }
    }
    const animationTime = duration / 1000.0 % keyFrames[keyFrames.length - 1].time;
    const frames = getPreviousAndNextKeyFrame(keyFrames, animationTime);
    const progression = (animationTime - frames.previous.time) / (frames.next.time - frames.previous.time);
    switch (frames.previous.type) {
        case 'translation':
        case 'scale': {
            const result = vec3.create();
            vec3.lerp(result, frames.previous.transform, frames.next.transform, progression);
            return result;
        }
        case 'rotation': {
            const result = quat.create();
            quat.slerp(result, frames.previous.transform, frames.next.transform, progression);
            return result;
        }
    }
};
const get = (c, elapsed) => {
    const t = c && c.translation.length > 0 ? getTransform(c.translation, elapsed) : vec3.create();
    const r = c && c.rotation.length > 0 ? getTransform(c.rotation, elapsed) : quat.create();
    const s = c && c.scale.length > 0 ? getTransform(c.scale, elapsed) : vec3.fromValues(1, 1, 1);
    return { t, r, s };
};
const applyTransform = (model, appliedTransforms, transforms, matrix, skin, nodeIndex, inverse) => {
    const node = model.nodes[nodeIndex];
    const transformIndex = skin.joints.indexOf(node.id);
    if (transforms[node.id] !== undefined) {
        mat4.multiply(matrix, matrix, transforms[node.id]);
    }
    if (inverse) {
        const ibt = skin.inverseBindTransforms[transformIndex];
        if (ibt) {
            appliedTransforms[transformIndex] = mat4.create();
            mat4.multiply(appliedTransforms[transformIndex], matrix, ibt);
        }
    }
    else {
        appliedTransforms[transformIndex] = matrix;
    }
    node.children.forEach(childNode => {
        applyTransform(model, appliedTransforms, transforms, mat4.clone(matrix), skin, childNode, inverse);
    });
};
/**
 * Blends two animations and returns their transform matrices
 * @param model GLTF Model
 * @param activeAnimations Currently running animations
 * @param blendTime Length of animation blend in milliseconds
 */
const getAnimationTransforms = (model, activeAnimations, blendTime = 0) => {
    const transforms = {};
    Object.keys(activeAnimations).forEach(track => {
        activeAnimations[track].forEach(rootAnimation => {
            const blend = -((rootAnimation.elapsed - blendTime) / blendTime);
            Object.keys(model.animations[rootAnimation.key]).forEach(c => {
                const transform = get(model.animations[rootAnimation.key][c], rootAnimation.elapsed);
                activeAnimations[track].forEach(ac => {
                    if (rootAnimation.key == ac.key || blend <= 0)
                        return;
                    const cTransform = get(model.animations[ac.key][c], ac.elapsed);
                    vec3.lerp(transform.t, transform.t, cTransform.t, blend);
                    quat.slerp(transform.r, transform.r, cTransform.r, blend);
                    vec3.lerp(transform.s, transform.s, cTransform.s, blend);
                });
                const localTransform = mat4.create();
                const rotTransform = mat4.create();
                mat4.fromQuat(rotTransform, transform.r);
                mat4.translate(localTransform, localTransform, transform.t);
                mat4.multiply(localTransform, localTransform, rotTransform);
                mat4.scale(localTransform, localTransform, transform.s);
                transforms[c] = localTransform;
            });
        });
    });
    return transforms;
};
/**
 * Applies transforms to skin
 * @param model GLTF Model
 * @param transforms Raw transforms
 * @param blendTime Use inverse bind transform
 */
const applyToSkin = (model, transforms, inverse = true) => {
    const appliedTransforms = [];
    model.skins.forEach(skin => {
        const root = model.rootNode;
        applyTransform(model, appliedTransforms, transforms, mat4.create(), skin, root, inverse);
    });
    return appliedTransforms;
};
