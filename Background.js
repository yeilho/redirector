importScripts('jsyaml.min.js');

// Function to fetch and parse the YAML file
async function getMappingsFromYAML() {
  try {
    const response = await fetch(chrome.runtime.getURL('mappings.yaml'));
    const yamlText = await response.text();
    const parsedYaml = jsyaml.load(yamlText);
    return parsedYaml.mappings || {};
  } catch (error) {
    console.error('Error fetching or parsing mappings:', error);
    return {};
  }
}

// Initialize mappings upon extension installation
chrome.runtime.onInstalled.addListener(() => {
  getMappingsFromYAML().then((loadedMappings) => {
    // Store initial mappings in local storage
    chrome.storage.local.set({ mappings: loadedMappings }, () => {
      console.log('Mappings loaded and saved on install.');
    });
  }).catch(err => {
    console.error('Error during mapping load on install:', err);
  });
});

// Load mappings from storage on extension start
let mappings = {};
chrome.storage.local.get('mappings', (data) => {
  mappings = data.mappings || {};
  console.log('Mappings loaded on start:', mappings);
});

// Listen for omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
  if (text === 'mappings') {
    chrome.runtime.openOptionsPage();
    return;
  }
  
  // Reload mappings from storage in case of changes
  mappings = (await chrome.storage.local.get('mappings')).mappings || {};
  console.log('Mappings loaded in omnibox listener:', mappings);

  let newUrl = mappings[text];

  if (!newUrl) {
    const parts = text.split('/');
    const baseKey = parts[0];
    const identifier = parts[1] || '';  // Use an empty string if there's no second parameter

    const baseUrl = mappings[`${baseKey}/`];
    console.log(`Base URL for ${baseKey}/:`, baseUrl);

    if (baseUrl) {
      newUrl = `${baseUrl}${identifier}`;
    } else {
      // Handle case where prefix is unknown
      chrome.tabs.update({ url: `https://www.google.com/search?q=${text}` });
      return;
    }
  }

  // Redirect to the new URL if it was found or constructed
  if (newUrl) {
    chrome.tabs.update({ url: newUrl });
  }
});

// Handle messages for getting and updating mappings
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getMappings') {
    chrome.storage.local.get('mappings', (data) => {
      sendResponse(data.mappings || {});
    });
    return true;  // keep the messaging channel open
  } else if (msg.type === 'updateMappings') {
    chrome.storage.local.set({ mappings: msg.mappings }, () => {
      console.log('Mappings updated and saved.');
      sendResponse({ status: 'ok' });
    });
    return true;
  }
});
