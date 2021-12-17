class PanelExtension extends Autodesk.Viewing.Extension {
	constructor(viewer, options) {
		super(viewer, options);
	}

	load() {
		console.log('PanelExtension has been loaded');
		ShowDocker();
		return true;
	}

	unload() {
		console.log('PanelExtension has been unloaded');
		return true;
	}
}


function ShowDocker() {
	var tag = document.createElement('testdiv');
	var text = document.createTextNode("Here goes your html");
	tag.appendChild(text);
	var docpanel = new SimplePanel(this.viewer.container, 'AllPropertiesPanels', 'AllProperties', tag, 50, 80);
	docpanel.setVisible(true);
}
Autodesk.Viewing.theExtensionManager.registerExtension('PanelExtension', PanelExtension);

SimplePanel = function (parentContainer, id, title, content, x, y) {
	this.content = content;
	Autodesk.Viewing.UI.DockingPanel.call(this, parentContainer, id, '');
	// Auto-fit to the content and don't allow resize.  Position at the coordinates 
	//given.
	this.container.style.height = "auto";
	this.container.style.width = "auto";
	this.container.style.resize = "auto";
	this.container.style.left = x + "%";
	this.container.style.top = y + "%";
};

SimplePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
SimplePanel.prototype.constructor = SimplePanel;
SimplePanel.prototype.initialize = function () {
	// Override DockingPanel initialize() to:
	// - create a standard title bar
	// - click anywhere on the panel to move
	// - create a close element at the bottom right
	//
	this.title = this.createTitleBar(this.titleLabel || this.container.id);
	this.container.appendChild(this.title);
	this.closer = this.createCloseButton();
	this.container.appendChild(this.title);
	this.title.appendChild(this.closer);
	this.container.appendChild(this.content);

	this.initializeMoveHandlers(this.title);
	this.initializeCloseHandler(this.closer);
};