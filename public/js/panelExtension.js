class ModelSummaryPanel extends Autodesk.Viewing.UI.PropertyPanel {
	constructor(viewer, container, id, title, options) {
		super(container, id, title, options);
		this.viewer = viewer;
		// this.addProperty('val', 'filteredProps[prop][val]', 'prop');
		// this.addProperty('sadadas', 'sada', 'prop');
	}
}

class PanelExtension extends Autodesk.Viewing.Extension {
	constructor(viewer, options) {
		super(viewer, options);
	}

	load() {
		console.log('PanelExtension has been loaded');
		this.panel = new ModelSummaryPanel(this.viewer, this.viewer.container, '33', 'modelSudsd--mmaryPanel', {});
		this.panel.setVisible(true);
		return true;
	}

	unload() {
		console.log('PanelExtension has been unloaded');
		return true;
	}
}
Autodesk.Viewing.theExtensionManager.registerExtension('PanelExtension', PanelExtension);