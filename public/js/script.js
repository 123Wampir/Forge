const deviceListElem = document.querySelector('.device-list');
createList(deviceListElem);

async function getDevices() {
	try {
		const res = await fetch('/api/v1/devices');
		return await res.json();
	} catch (error) {
		return;
	}
}

async function selectDevice(e) {
	const elem = e.target;
	const id = elem.id;
	let res;
	try {
		res = await (await fetch(`/api/v1/devices/${id}`)).json();
	} catch (error) {
		return;
	}
	const { x, y, z } = res[0].position;
	console.log(x, y, z);
	const target = new THREE.Vector3(x, y, z);
	const camera = new THREE.Vector3(x - 500, y - 500, z + 5000);
	console.log(target, camera);
	viewer.navigation.setView(camera, target);
	viewer.impl.sceneUpdated(true);
}
/**
 * 
 * @param {Element} listElem
 */
async function createList(listElem) {
	const devices = await getDevices();
	const div_r = document.createElement('div');
	div_r.innerHTML = "<h3>Routers:</h3>";
	const div_d = document.createElement('div');
	div_d.innerHTML = "<h3>Devices:</h3>";
	div_r.classList.add('list-group');
	div_d.classList.add('list-group');
	devices.forEach(d => {
		const a = document.createElement('a');
		a.textContent = d.name;
		a.classList.add('list-group-item', 'list-group-item-action');
		a.addEventListener('click', selectDevice)
		a.id = d._id;

		if (d.type == 'router') div_r.appendChild(a)
		else div_d.appendChild(a);
	});
	listElem.appendChild(div_d);
	listElem.appendChild(div_r);
}
