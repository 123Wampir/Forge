class CreateModal extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, container, id, title, options) {
        console.log(options);
        super(container, id, title, options);
        this.viewer = viewer;
        this.container.style.top = "30%";
        this.container.style.left = "50%";
        this.container.style.width = "400px";
        this.container.style.height = "450px";
        this.container.style.resize = "auto";
        this.container.style.background = 'black';
        this.container.style.padding = '10px';
    }
    initialize() {
        this.initializeMoveHandlers(this.container);
        this.title = this.createTitleBar('Добавить устройство');
        this.title.style.padding = '6px';
        this.container.appendChild(this.title);

        const form = document.createElement('form');
        this.createContainer(form);
        this.container.appendChild(form);

        this.detect = document.createElement("button");
        this.detect.classList.add("btn", "btn-info");
        this.detect.textContent = "Определить место";
        this.container.appendChild(this.detect);

        this.add = document.createElement("button");
        this.add.classList.add("btn", "btn-success");
        this.add.addEventListener('click', async () => {
            const device = {
                name: form.name.value,
                ip: form.ip.value,
                mac: form.mac.value,
                position: {
                    x: form.x.value,
                    y: form.y.value,
                    z: form.z.value
                }
            }
            const responce = await fetch('/api/v1/devices', {
                method: 'POST',
                body: JSON.stringify(device)
            });
        })
        this.add.textContent = "Добавить";
        this.initializeCloseHandler(this.add);
        this.container.appendChild(this.add);

        this.closer = document.createElement("button");
        this.closer.classList.add("btn", "btn-danger");
        this.closer.textContent = "Закрыть";
        this.initializeCloseHandler(this.closer);
        this.container.appendChild(this.closer);
    };
    createContainer(parentDiv) {
        parentDiv.appendChild(this.createInputGroup('Назавние', 'name'));
        parentDiv.appendChild(this.createCombobox('Тип оборудования', 'type', ['router', 'device']));
        parentDiv.appendChild(this.createInputGroup('IP', 'ip'));
        parentDiv.appendChild(this.createInputGroup('MAC', 'mac'));
        parentDiv.appendChild(this.createInputGroup('Кол-во портов', 'ports', 'number'));
        parentDiv.appendChild(this.createInputGroup('Координата X', 'x', 'number'));
        parentDiv.appendChild(this.createInputGroup('Координата Y', 'y', 'number'));
        parentDiv.appendChild(this.createInputGroup('Координата Z', 'z', 'number'));
    }
    createInputGroup(name, id, type = 'text') {
        const input = document.createElement('input');
        const label = document.createElement('label');
        const groupDiv = document.createElement('div');
        label.innerText = name;
        input.type = type;
        input.id = id;
        input.style.color = 'black';
        input.addEventListener('click', (e) => e.target.focus())
        groupDiv.appendChild(label);
        groupDiv.appendChild(input);
        groupDiv.style.display = 'flex';
        groupDiv.style.flexDirection = 'column';
        return groupDiv;
    }
    createCombobox(name, id, items) {
        const select = document.createElement('select');
        const label = document.createElement('label');
        const groupDiv = document.createElement('div');
        label.innerText = name;
        select.id = id;
        select.style.color = 'black';
        // select.addEventListener('click', (e) => {
        //     e.target.click();
        // })
        items.forEach(i => {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            select.appendChild(option);
        })
        groupDiv.appendChild(label);
        groupDiv.appendChild(select);
        groupDiv.style.display = 'flex';
        groupDiv.style.flexDirection = 'column';
        return groupDiv;
    }
    getPosition(x, y, z) {
        const xInput = document.getElementById('x');
        const yInput = document.getElementById('y');
        const zInput = document.getElementById('z');
        xInput.value = Math.floor(x);
        yInput.value = Math.floor(y);
        zInput.value = Math.floor(z);
    }
}

class DeviceExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('DeviceExtension has been loaded');


        this.viewer.toolController.registerTool(this)

        this.viewer.toolController.activateTool(
            'Viewing.Extension.DeviceExtension')
        return true;
    }
    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('DeviceExtension has been unloaded');
        return true;
    }

    getNames() {
        return ['Viewing.Extension.DeviceExtension']
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('DeviceExtensionToolBar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('DeviceExtensionToolBar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('DeviceExtensionButton');
        this._button.onClick = (ev) => {
            this.panel = new CreateModal(this.viewer, this.viewer.container, 'create', 'Add Device', { localizeTitle: true, addFooter: false });
            this.panel.setVisible(true);
            this.panel.resizeToContent();
            this.panel.detect.addEventListener('click', () => {
                this.ChoosePos = true;
            })
        };
        this._button.setToolTip('DeviceExtension');
        this._button.addClass('DeviceExtensionIcon');
        this._group.addControl(this._button);

    }
    handleSingleClick(event) {
        // If left button is clicked and we're currently in the "height drawing" state
        if (this.ChoosePos) {
            let hz = this.viewer.impl.clientToWorld(event.clientX, event.clientY, false);
            if (hz != null) {
                var offset = viewer.model.getData().globalOffset
                let point = hz.intersectPoint
                point.y = point.y - offset.y
                this.panel.getPosition(point.x, point.y, point.z);
                //Создать геометрию роутера
                //Добавить данные в бд
                //Поставить его через метод ниже
                // this.viewer.impl.overlayScenes["devices"].scene.children[0].position.set(point.x, point.y, point.z)
                const isHas = this.viewer.impl.overlayScenes["devices"].scene.children.find(c => c.test === true);
                if (isHas) {
                    isHas.position.set(point.x, point.y, point.z);
                    this.viewer.impl.invalidate(true, true, true);
                } else {
                    const geom = new THREE.BoxGeometry(300, 300, 50);
                    const color = 0xff0000;
                    const material = new THREE.MeshBasicMaterial({
                        color: color, side: THREE.DoubleSide,
                        reflectivity: 0.0
                    });
                    const cube = new THREE.Mesh(geom, material);
                    cube.position.set(point.x, point.y, point.z);
                    cube.test = true;
                    viewer.overlays.addMesh(cube, 'devices');
                }
                this.ChoosePos = false
                return true;
            }
        }
        return false;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DeviceExtension', DeviceExtension);