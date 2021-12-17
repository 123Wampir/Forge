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

        //куб у телевизора
        var geom = new THREE.BoxGeometry(300, 300, 50);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000, side: THREE.DoubleSide,
            reflectivity: 0.0
        });
        var cube1 = new THREE.Mesh(geom, material);
        cube1.position.set(8500, 3000, -100);

        //куб в комнате сверху
        var geom = new THREE.BoxGeometry(300, 300, 50);
        material = new THREE.MeshBasicMaterial({
            color: 0xfff000, side: THREE.DoubleSide,
            reflectivity: 0.0
        });
        var cube2 = new THREE.Mesh(geom, material);
        cube2.position.set(-1000, 3500, 0);

        //линия телевизор-комната сверху
        let pts = []
        pts.push(cube1.position)
        pts.push(cube2.position)
        //pts.push(new THREE.Vector3(8500, 3000, 1000))
        viewer.impl.sceneAfter.skipDepthTarget = true;
        viewer.impl.sceneAfter.skipIdTarget = true;
        let geometry = new THREE.Geometry();
        pts.forEach(pt => {
            geometry.vertices.push(pt);
        })
        let material2 = new THREE.LineDashedMaterial({
            color: new THREE.Color(0x0000FF),transparent:true
        });
        let line = new THREE.Line(geometry, material2);
        viewer.impl.sceneUpdated(true)

        if (!viewer.overlays.hasScene('devices')) {
            viewer.overlays.addScene('devices');
        }
        if (!viewer.overlays.hasScene('wires')) {
            viewer.overlays.addScene('wires');
        }
        console.log(cube1, cube2, line);
        viewer.overlays.addMesh(cube1, 'devices');
        viewer.overlays.addMesh(cube2, 'devices');
        viewer.overlays.addMesh(line, 'wires');


        document.getElementById('hider').onclick = function() {
            viewer.impl.overlayScenes["wires"].scene.children.forEach(child=>{
                if(child.material.opacity==1)
                {
                    child.material.opacity=0;
                }
                else child.material.opacity=1;
                viewer.impl.sceneUpdated(true)
            })
        }

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