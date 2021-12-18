class ModelSummaryPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, device) {
        super(container, id, title);
        this.viewer = viewer;
        // this.addProperty('Title', title);
        this.addProperty('Тип устройства', device.type);
        this.addProperty('IP', device.ip);
        this.addProperty('MAC', device.mac);
        this.addProperty('Кол-во портов', device.ports);
        // this.closer.addEventListener('click', () => this.closeModal());
    }
    // closeModal() {
    //     this.uninitialize();
    // }
}

class MeshSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options)
        this.viewer = viewer
        this.onclick = function (event) {
        }
    }
    load() {
        console.log('Viewing.Extension.MeshSelection loaded')
        this.viewer.addEventListener(
            Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => {

                this.dbIds = this.getAllDbIds()
                this.controls = new THREE.TransformControls(viewer.impl.camera, viewer.impl.canvas, "translate");
                if (!viewer.overlays.hasScene('controls')) {
                    viewer.overlays.addScene('controls');
                }
                this.viewer.impl.overlayScenes["controls"].scene.add(this.controls)
                this.isDragging = false;

            })
        this.viewer.toolController.registerTool(this)
        this.viewer.toolController.activateTool('Viewing.Extension.MeshSelection')
        return true
    }
    getNames() {
        return ['Viewing.Extension.MeshSelection']
    }
    activate() { }
    deactivate() { }
    unload() {
        console.log('Viewing.Extension.MeshSelection unloaded')
        this.viewer.toolController.deactivateTool('Viewing.Extension.MeshSelection')
        this.viewer.toolController.unregisterTool(this)
        return true
    }
    pointerToRaycaster(domElement, camera, pointer) {
        const pointerVector = new THREE.Vector3()
        const pointerDir = new THREE.Vector3()
        const ray = new THREE.Raycaster()

        const rect = domElement.getBoundingClientRect()

        const x = ((pointer.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((pointer.clientY - rect.top) / rect.height) * 2 + 1

        if (camera.isPerspective) {
            pointerVector.set(x, y, 0.5)
            pointerVector.unproject(camera)
            ray.set(camera.position, pointerVector.sub(camera.position).normalize())
        } else {
            pointerVector.set(x, y, -1)
            pointerVector.unproject(camera)
            pointerDir.set(0, 0, -1)
            ray.set(pointerVector, pointerDir.transformDirection(camera.matrixWorld))
        }
        return ray
    }

    handleSingleClick(event) {
        const pointer = event.pointers ? event.pointers[0] : event
        const rayCaster = this.pointerToRaycaster(this.viewer.impl.canvas, this.viewer.impl.camera, pointer)
        const intersectResults = rayCaster.intersectObjects(this.viewer.impl.overlayScenes["devices"].scene.children, true)
        const hitTest = this.viewer.model.rayIntersect(rayCaster, true, this.dbIds)

        const selections = intersectResults.filter(res => !hitTest || (hitTest.distance > res.distance))
        if (selections.length != 0) {
            console.log('Custom meshes selected:')
            if (Object.keys(selections[0].object.userData).length == 0)
                selections[0].object.userData = selections[0].object.material.color
            selections[0].object.material.color = new THREE.Color("skyblue")
            this.controls.attach(selections[0].object);
            if (this.panel && selections[0].object.deviceInfo._id !== this.panel.container.id) {
                this.hideModal()
                this.showModal(selections[0].object.deviceInfo, event.x, event.y);
            } else if (!this.panel) {
                this.showModal(selections[0].object.deviceInfo, event.x, event.y);
            }
            this.viewer.impl.sceneUpdated(true)
            return true
        }
        else {
            this.viewer.impl.overlayScenes["devices"].scene.children.forEach(child => {
                if (Object.keys(child.userData).length != 0) {
                    child.material.color = child.userData;
                    this.hideModal(child.deviceInfo);
                }
            })
            this.controls.detach()
            this.viewer.impl.sceneUpdated(true)
            return false
        }
    }
    showModal(deviceInfo, x, y) {
        this.panel = new ModelSummaryPanel(
            this.viewer,
            this.viewer.container,
            deviceInfo._id,
            deviceInfo.name,
            deviceInfo);
        this.panel.setVisible(true);
        this.panel.resizeToContent();
        this.panel.container.style.top = `${y}px`;
        this.panel.container.style.left = `${x}px`;
    }
    hideModal() {
        if (this.panel)
            this.panel.uninitialize();
        delete this.panel;
    }
    handleDoubleClick(event) {
        this.isDragging = !this.isDragging
        if (this.selected == true && this.isDragging == true) {
            this.controls.onPointerDown(event)
        }
        console.log(this.isDragging)
        if (this.isDragging == false) {
            if (this.controls.onPointerUp(event)) {
                console.log(this.controls.position)
                //this.controls.detach()
                this.viewer.impl.sceneUpdated(true)
            }
            console.log(this.controls)
            //this.controls.children[0].position=this.controls.position
        }
    }
    handleMouseMove = function (event) {
        if (this.isDragging && this.selected) {
            if (this.controls.onPointerMove(event)) {
                //console.log(this.controls.isDragging())
                //let point = this.viewer.impl.clientToWorld(event.clientX, event.clientY, false).point
                //this.controls.position.set(point.x, point.y, point.z)
                this.controls.setMode('translate')
                this.viewer.impl.sceneUpdated(true)
                return true;
            }

            return false;
        }

        /*if (this.controls.onPointerHover(event)) {
            console.log("HOVER")
            return true;
        }*/

        //return _transRotControl.onPointerHover(event);
        return false;
    };


    getAllDbIds() {
        const { instanceTree } = this.viewer.model.getData()
        const { dbIdToIndex } = instanceTree.nodeAccess
        return Object.keys(dbIdToIndex).map((dbId) => {
            return parseInt(dbId)
        })
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MeshSelectionExtension', MeshSelectionExtension);