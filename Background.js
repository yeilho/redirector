importScripts('jsyaml.min.js');

let mappings = {};

// Function to fetch and parse the YAML file
async function getMappings() {
  try {
    const response = await fetch(chrome.runtime.getURL('mappings.yaml'));
    const yamlText = await response.text();
    const parsedYaml = jsyaml.load(yamlText);
    console.log('Parsed YAML:', parsedYaml);
    return parsedYaml.mappings;
  } catch (error) {
    console.error('Error fetching or parsing mappings:', error);
    return {};
  }
}

// Initialize mappings upon extension installation
chrome.runtime.onInstalled.addListener(() => {
  getMappings().then((loadedMappings) => {
    mappings = loadedMappings;
    console.log('Mappings loaded on install:', mappings);
  }).catch(err => {
    console.error('Error during mapping load on install:', err);
  });
});

// Initialize mappings when the extension starts
getMappings().then((loadedMappings) => {
  mappings = loadedMappings;
  console.log('Mappings loaded on start:', mappings);
}).catch(err => {
  console.error('Error during mapping load on start:', err);
});

// Listen for omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
  if (text === 'options') {
    chrome.runtime.openOptionsPage();
    return;
  }

  if (!mappings || Object.keys(mappings).length === 0) {
    mappings = await getMappings();
    console.log('Mappings loaded in omnibox listener:', mappings);
  }
  
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
    sendResponse(mappings);
  } else if (msg.type === 'updateMappings') {
    mappings = msg.mappings;
    sendResponse({ status: 'ok' });
  }
});
