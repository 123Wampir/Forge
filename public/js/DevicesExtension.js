class NewDevice extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options, ip, mac, device_type, connect_type) {
        super(container, id, title, options);
        this.viewer = viewer;

    }
    load() {

        return true;
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
            this.ChoosePos = false;
            /*this.panel = new NewDevice(this.viewer, this.viewer.container, '33', 'Add Device', {}, '1', '22', 'router', 'game console');
            var Add = document.createElement("button");
            console.log(Add)
            Add.innerText = "Добавить"
            var name = document.createElement("input");
            var type = document.createElement("input");
            var IP = document.createElement("input");
            var MAC = document.createElement("input");
            var Intefaces = document.createElement("input");
            var X = document.createElement("input");
            var Y = document.createElement("input");
            var Z = document.createElement("input");
            var btnPos = document.createElement("button");
            btnPos.innerText = "#";
            this.panel.addProperty('Имя', name.outerHTML, "Главное");
            this.panel.addProperty('Тип', type.outerHTML, "Главное");
            this.panel.addProperty('IP', IP.outerHTML, "Характеристики");
            this.panel.addProperty('MAC', MAC.outerHTML, "Характеристики");
            this.panel.addProperty('Intefaces', Intefaces.outerHTML, "Характеристики");
            this.panel.addProperty('X', X.outerHTML, "Расположение")
            this.panel.addProperty('Y', Y.outerHTML, "Расположение")
            this.panel.addProperty('Z', Z.outerHTML, "Расположение")
            this.panel.addProperty('Расположение', btnPos.outerHTML, "Расположение")
            this.panel.addProperty('Добавить', Add.outerHTML, "Добавить")
            console.log(this.panel)
            btnPos.addEventListener("click", () => {
                console.log("WTF")
                ChoosePos = true
            })
            this.panel.setVisible(true);
            this.panel.resizeToContent();
            console.log(this.panel)*/
        };
        this._button.setToolTip('DeviceExtension');
        this._button.addClass('DeviceExtensionIcon');
        this._group.addControl(this._button);

    }
    handleSingleClick(event) {
        // If left button is clicked and we're currently in the "height drawing" state
        if (true) {
            let hz = this.viewer.impl.clientToWorld(event.clientX, event.clientY, false);
            if (hz != null) {
                var offset = viewer.model.getData().globalOffset
                let point = hz.intersectPoint
                point.y = point.y - offset.y
                this.panel.X.innerText = point.x;
                this.panel.Y.innerText = point.y;
                this.panel.Z.innerText = point.z;
                console.log(this.panel.X.innerText)
                console.log(this.panel.Y.innerText)
                console.log(this.panel.Z.innerText)
                //Создать геометрию роутера
                //Добавить данные в бд
                //Поставить его через метод ниже
                this.viewer.impl.overlayScenes["devices"].scene.children[0].position.set(point.x, point.y, point.z)
                this.viewer.impl.invalidate(true, true, true);
                this.ChoosePos = false
                return true;
            }
        }
        return false;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DeviceExtension', DeviceExtension);