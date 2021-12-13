class MyAwesomeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('MyAwesomeExtensions has been loaded');
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
        console.log('MyAwesomeExtensions has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');



        var geom = new THREE.SphereGeometry(1, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var sphereMesh = new THREE.Mesh(geom, material);
        sphereMesh.position.set(1, 2, 3);
        if (!viewer.overlays.hasScene('custom-scene')) {
            viewer.overlays.addScene('custom-scene');
        }
        viewer.overlays.addMesh(sphereMesh, 'custom-scene');


        this._button.onClick = (ev) => {
            const selection = this.viewer.getSelection();
            this.viewer.clearSelection();

            var instanceTree = viewer.model.getData().instanceTree;
            var rootId = this.rootId = instanceTree.getRootId();
            var dbIds = getAlldbIds(rootId, instanceTree)
            dbIds.forEach(id => {
                this.viewer.getProperties(id, (props) => {
                    console.log(props.name)
                    let Name = props.name
                    Name += "";
                    if (Name.search("Bed") != -1) {
                        this.viewer.setThemingColor(id, new THREE.Vector4(1, 1, 0, 0.5))
                        this.viewer.getProperties(id, console.log, console.error)
                        console.log("bruh")

                    }
                }, console.error)
            })
            // Anything selected?
            if (selection.length > 0) {
                let isolated = [];
                // Iterate through the list of selected dbIds
                selection.forEach((dbId) => {
                    // Get properties of each dbId
                    this.viewer.getProperties(dbId, (props) => {
                        // Output properties to console
                        console.log(props);
                        console.log(this.viewer);

                        // Ask if want to isolate
                        // if (confirm(`Isolate ${props.name} (${props.externalId})?`)) 
                        {
                            this.viewer.setThemingColor(dbId, new THREE.Vector3(1, 0, 0))
                            isolated.push(dbId);
                            this.viewer.isolate(isolated);
                        }
                    });
                });
            } else {
                // If nothing selected, restore
                this.viewer.isolate(0);
            }
        };
        this._button.setToolTip('My Awesome Extension');
        this._button.addClass('myAwesomeExtensionIcon');
        this._group.addControl(this._button);
    }
}



function getAlldbIds(rootId, instanceTree) {
    var alldbId = [];
    if (!rootId) {
        return alldbId;
    }
    var queue = [];
    queue.push(rootId);
    while (queue.length > 0) {
        var node = queue.shift();
        alldbId.push(node);
        instanceTree.enumNodeChildren(node, function (childrenIds) {
            queue.push(childrenIds);
        });
    }
    console.log(alldbId);
    return alldbId;
}



Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);