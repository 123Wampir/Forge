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

    async getGeometry() {
        const devices = await getDevices();
        if (!viewer.overlays.hasScene('devices')) {
            viewer.overlays.addScene('devices');
        }
        devices.forEach(d => {
            const geom = new THREE.BoxGeometry(300, 300, 50);
            let color = 0xfefefe;
            if (d.type === 'router')
                color = 0xb241d0;
            const material = new THREE.MeshBasicMaterial({
                color: color, side: THREE.DoubleSide,
                reflectivity: 0.0
            });
            const cube = new THREE.Mesh(geom, material);
            cube.position.set(d.position.x, d.position.y, d.position.z);
            cube.deviceInfo = d;
            viewer.overlays.addMesh(cube, 'devices');
        });
        this.createLines(devices);
    }
    createLines(devices) {
        if (!viewer.overlays.hasScene('wires')) {
            viewer.overlays.addScene('wires');
        }
        viewer.impl.sceneAfter.skipDepthTarget = true;
        viewer.impl.sceneAfter.skipIdTarget = true;
        devices.forEach(d => {
            d.connects.forEach(connect => {
                const s = devices.find(d => d._id === connect);
                console.log(d.name, s.name);
                const pts = [new THREE.Vector3(d.position.x, d.position.y, d.position.z), new THREE.Vector3(s.position.x, s.position.y, s.position.z)];
                const geometry = new THREE.Geometry();
                pts.forEach(pt => geometry.vertices.push(pt));
                const material = new THREE.LineDashedMaterial({
                    color: new THREE.Color(0x0000FF), transparent: true
                });
                const line = new THREE.Line(geometry, material);
                viewer.overlays.addMesh(line, 'wires');
            })
        });
    }
    onToolbarCreated() {
        this.getGeometry();
        document.getElementById('hider').onclick = function () {
            viewer.impl.overlayScenes["wires"].scene.children.forEach(child => {
                if (child.material.opacity == 1) {
                    child.material.opacity = 0;
                }
                else child.material.opacity = 1;
                viewer.impl.sceneUpdated(true)
            })
        }
        document.getElementById('createConnection').onclick = function () {
            viewer.impl.overlayScenes["wires"].scene.children.forEach(child => {
                console.log(child)
                let pts = child.geometry.vertices.slice(0);
                let pt = new THREE.Vector3(pts[0].x + pts[1].x, pts[0].y + pts[1].y, pts[0].z + pts[1].z)
                pt = pt.divideScalar(2)
                pts.splice(1, 0, pt)
                console.log(pts)
                let geom = new THREE.Geometry();
                pts.forEach(pt => {
                    geom.vertices.push(pt);
                })
                let ln = new THREE.Line(geom, material2)
                viewer.overlays.removeMesh(child, 'wires');
                viewer.overlays.addMesh(ln, 'wires');
                child = ln
                console.log(ln)
                console.log(child.geometry.vertices)
                viewer.impl.sceneUpdated(true)
            })
        }
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