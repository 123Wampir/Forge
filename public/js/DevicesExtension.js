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

        const div = document.createElement('div');
        this.createContainer(div);
        this.container.appendChild(div);

        this.add = document.createElement("button");
        this.add.classList.add("btn", "btn-success");
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
}

class DeviceExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('DeviceExtension has been loaded');
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
            // var Add = document.createElement("button");
            // Add.innerText = "Добавить"
            // var name = document.createElement("input");
            // var type = document.createElement("input");
            // var IP = document.createElement("input");
            // var MAC = document.createElement("input");
            // var Intefaces = document.createElement("input");
            // var X = document.createElement("input");
            // var Y = document.createElement("input");
            // var Z = document.createElement("input");
            this.panel = new CreateModal(this.viewer, this.viewer.container, 'create', 'Add Device', { localizeTitle: true, addFooter: false });
            console.log(this.panel);
            // this.panel.addProperty('Имя', 'name.outerHTML', "Главное");
            // this.panel.addProperty('Тип', type.outerHTML, "Главное");
            // this.panel.addProperty('IP', IP.outerHTML, "Характеристики");
            // this.panel.addProperty('MAC', MAC.outerHTML, "Характеристики");
            // this.panel.addProperty('Intefaces', Intefaces.outerHTML, "Характеристики");
            // this.panel.addProperty('X', X.outerHTML, "Расположение")
            // this.panel.addProperty('Y', Y.outerHTML, "Расположение")
            // this.panel.addProperty('Z', Z.outerHTML, "Расположение")
            // this.panel.addProperty('Добавить', Add.outerHTML, "Добавить")
            this.panel.setVisible(true);
            this.panel.resizeToContent();
            // console.log(this.panel)
        };
        this._button.setToolTip('DeviceExtension');
        this._button.addClass('DeviceExtensionIcon');
        this._group.addControl(this._button);

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DeviceExtension', DeviceExtension);