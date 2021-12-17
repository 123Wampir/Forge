class MeshSelectionExtension extends Autodesk.Viewing.Extension {

    /////////////////////////////////////////////////////////
    // Class constructor
    //
    /////////////////////////////////////////////////////////
    constructor(viewer, options) {

        super(viewer, options)

        this.viewer = viewer
    }

    /////////////////////////////////////////////////////////
    // Load callback
    //
    /////////////////////////////////////////////////////////
    load() {

        console.log('Viewing.Extension.MeshSelection loaded')

        this.viewer.addEventListener(
            Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => {

                this.dbIds = this.getAllDbIds()
            })

        this.viewer.toolController.registerTool(this)

        this.viewer.toolController.activateTool(
            'Viewing.Extension.MeshSelection')


        return true
    }
    getNames() {

        return ['Viewing.Extension.MeshSelection']
    }

    activate() {

    }

    deactivate() {

    }
    unload() {

        console.log('Viewing.Extension.MeshSelection unloaded')

        this.viewer.toolController.deactivateTool(
            'Viewing.Extension.MeshSelection')

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

            ray.set(camera.position,
                pointerVector.sub(
                    camera.position).normalize())

        } else {

            pointerVector.set(x, y, -1)

            pointerVector.unproject(camera)

            pointerDir.set(0, 0, -1)

            ray.set(pointerVector,
                pointerDir.transformDirection(
                    camera.matrixWorld))
        }

        return ray
    }

    
    /////////////////////////////////////////////////////////
    // Click handler
    //
    /////////////////////////////////////////////////////////
    handleSingleClick(event) {
        

        const pointer = event.pointers
            ? event.pointers[0]
            : event

        const rayCaster = this.pointerToRaycaster(
            this.viewer.impl.canvas,
            this.viewer.impl.camera,
            pointer)

        const intersectResults = rayCaster.intersectObjects(
            this.viewer.impl.sceneAfter.children, true)
        const hitTest = this.viewer.model.rayIntersect(
            rayCaster, true, this.dbIds)

        const selections = intersectResults.filter((res) =>

            (!hitTest || (hitTest.distance > res.distance))
        )
        if (selections.length != 0) {

            console.log('Custom meshes selected:')
            selections[0].object.userData = selections[0].object.material.color
            selections[0].object.material.color = new THREE.Color("skyblue")
            this.viewer.impl.sceneUpdated(true)

            return true
        }
        else {
            this.viewer.impl.sceneAfter.children.forEach(child => {
                if (Object.keys(child.userData).length != 0)
                    child.material.color = child.userData
            })
            this.viewer.impl.sceneUpdated(true)
            return false
        }
    }

    getAllDbIds() {

        const { instanceTree } = this.viewer.model.getData()

        const { dbIdToIndex } = instanceTree.nodeAccess

        return Object.keys(dbIdToIndex).map((dbId) => {
            return parseInt(dbId)
        })
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MeshSelectionExtension', MeshSelectionExtension);