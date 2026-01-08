const track = 'track';

class GLTFMesh {

    constructor(name) {
        this.models;
        this.modelName = name;
        this.lastFrame = 0;
        this.gltfAnimation;
    }

    async init(name) {
        this.gltfAnimation = new GLTFAnimation();
        this.modelName = name;
        this.models = await Promise.all(this.modelName.split(',').map(m => loadModel(gl, name)));
        this.listAnimations(this.models);
    }

    async listAnimations(models) {
        models.forEach(model => {
            if (Object.keys(model.animations).length === 0)
                return;
            this.gltfAnimation.pushAnimation(track, 'default', model.name, Object.keys(model.animations)[0]);

            const ui = document.getElementById('ui');

            Object.keys(model.animations).forEach(a => {
                const btn = document.createElement('button');
                btn.innerText = a;
                btn.addEventListener('click', () => this.gltfAnimation.pushAnimation(track, 'default', model.name, a));
                ui.appendChild(btn);
            });
        });
    };

    async destroy() {
        if (this.models) {
            this.models.forEach(model => {
                if (Object.keys(model.animations).length === 0)
                    return;

                const ui = document.getElementById('ui');

                Object.keys(model.animations).forEach(a => {
                    ui.removeChild(ui.lastElementChild);
                });
            });

            dispose(gl, this.models[0]);
            this.models = null;

        }
    }

};
