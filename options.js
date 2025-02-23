document.addEventListener('DOMContentLoaded', () => {
  const mappingsContainer = document.getElementById('mappings-container');
  const addMappingBtn = document.getElementById('add-mapping');
  const saveMappingsBtn = document.getElementById('save-mappings');

  // Load current mappings and populate the UI
  function loadMappings() {
    chrome.runtime.sendMessage({ type: 'getMappings' }, (response) => {
      if (response) {
        mappingsContainer.innerHTML = ''; // Clear existing elements
        Object.keys(response).forEach(key => {
          createMappingElement(key, response[key]);
        });
      }
    });
  }

  // Function to create a mapping input element
  function createMappingElement(key, value) {
    const mappingDiv = document.createElement('div');
    mappingDiv.className = 'mapping';

    const keyInput = document.createElement('input');
    keyInput.className = 'key-input';
    keyInput.placeholder = 'Key';
    keyInput.value = key;

    const valueInput = document.createElement('textarea');
    valueInput.className = 'value-input';
    valueInput.placeholder = 'URL';
    valueInput.value = value;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
      mappingDiv.remove();
    };

    mappingDiv.appendChild(keyInput);
    mappingDiv.appendChild(valueInput);
    mappingDiv.appendChild(removeButton);

    mappingsContainer.appendChild(mappingDiv);
  }

  // Add new mapping
  addMappingBtn.addEventListener('click', () => {
    createMappingElement('', '');
  });

  // Save mappings to chrome.storage.local
  saveMappingsBtn.addEventListener('click', () => {
    const newMappings = {};
    const keyInputs = mappingsContainer.getElementsByClassName('key-input');
    const valueInputs = mappingsContainer.getElementsByClassName('value-input');

    for (let i = 0; i < keyInputs.length; i++) {
      const key = keyInputs[i].value.trim();
      const value = valueInputs[i].value.trim();
      if (key && value) {
        newMappings[key] = value;
      }
    }

    chrome.runtime.sendMessage({ type: 'updateMappings', mappings: newMappings }, (response) => {
      if (response && response.status === 'ok') {
        alert('Mappings saved successfully!');
      } else {
        alert('Failed to save mappings. Try again.');
      }
    });
  });

  // Load mappings when the options page is opened
  loadMappings();
});
