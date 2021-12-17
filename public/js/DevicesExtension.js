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
            var Add=document.createElement("button");
            Add.innerText="Добавить"
            var name=document.createElement("input");
            var type=document.createElement("input");
            var IP=document.createElement("input");
            var MAC=document.createElement("input");
            var Intefaces=document.createElement("input");
            var X=document.createElement("input");
            var Y=document.createElement("input");
            var Z=document.createElement("input");
            this.panel = new ModelSummaryPanel(this.viewer, this.viewer.container, '33', 'Add Device', {}, '1', '22', 'router', 'game console');
            this.panel.addProperty('Имя', name.outerHTML, "Главное");
            this.panel.addProperty('Тип', type.outerHTML, "Главное");
            this.panel.addProperty('IP', IP.outerHTML, "Характеристики");
            this.panel.addProperty('MAC', MAC.outerHTML, "Характеристики");
            this.panel.addProperty('Intefaces', Intefaces.outerHTML, "Характеристики");
            this.panel.addProperty('X',X.outerHTML,"Расположение")
            this.panel.addProperty('Y',Y.outerHTML,"Расположение")
            this.panel.addProperty('Z',Z.outerHTML,"Расположение")
            this.panel.addProperty('Добавить',Add.outerHTML,"Добавить")
            this.panel.setVisible(true);
            this.panel.resizeToContent();
            console.log(this.panel)
        };
        this._button.setToolTip('DeviceExtension');
        this._button.addClass('DeviceExtensionIcon');
        this._group.addControl(this._button);

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DeviceExtension', DeviceExtension);