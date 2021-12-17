class ModelSummaryPanel extends Autodesk.Viewing.UI.PropertyPanel {
	constructor(viewer, container, id, title, options, ip, mac, device_type, connect_type) {
		super(container, id, title, options);
		this.viewer = viewer;
		/*this.addProperty('Title', title);
		this.addProperty('type', device_type, "properties");
		this.addProperty('IP', ip, "properties");
		this.addProperty('MAC', mac, "properties");
		this.addProperty('type', connect_type, "connect");*/
	}
}

class PanelExtension extends Autodesk.Viewing.Extension {
	constructor(viewer, options) {
		super(viewer, options);
	}

	load() {
		console.log('PanelExtension has been loaded');
		/*this.panel = new ModelSummaryPanel(this.viewer, this.viewer.container, '33', 'modelSudsd--mmaryPanel', {}, '1', '22', 'router', 'game console');
		this.panel.setVisible(true);
		this.panel.resizeToContent();*/
		return true;
	}

	unload() {
		console.log('PanelExtension has been unloaded');
		return true;
	}
}
Autodesk.Viewing.theExtensionManager.registerExtension('PanelExtension', PanelExtension);