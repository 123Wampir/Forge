var viewer;
function launchViewer(/*urn*/) {
  const urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2pmMm9qeHNxaDF4MXZ3ZHM4bGd0dmxwNzV4Z2F6d2QtYnJ1aC9mbG9vcnNfdjIuc3RlcA==';
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), {
      extensions: [
        'Autodesk.DocumentBrowser',
        "MyAwesomeExtension",
        "MeshSelectionExtension",
        "DeviceExtension"]
    });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
launchViewer();