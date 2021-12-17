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

/**
 * 
 * @param {Element} listElem
 */
async function createList(listElem) {
	const devices = await getDevices();
	const ul = document.createElement('ul');
	ul.classList.add('list-group');
	devices.forEach(d => {
		const li = document.createElement('li');
		li.textContent = d.name;
		li.classList.add('list-group-item');
		li.tagName = d._id;
		ul.appendChild(li);
	});
	listElem.appendChild(ul);
}