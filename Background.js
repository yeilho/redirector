importScripts('jsyaml.min.js');

// Function to fetch and parse the YAML file
async function getMappings() {
  const response = await fetch(chrome.runtime.getURL('mappings.yaml'));
  const yamlText = await response.text();
  const mappings = jsyaml.load(yamlText);
  return mappings.mappings;
}

// Listen for omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
  const mappings = await getMappings();
  let newUrl = mappings[text];

  if (!newUrl) {
    const parts = text.split('/');
    const baseKey = parts[0];
    const identifier = parts[1] || '';  // Use an empty string if there's no second parameter

    const baseUrl = mappings[`${baseKey}/`];

    if (baseUrl) {
      newUrl = `${baseUrl}${identifier}`;
    } else {
      // Handle case where prefix is unknown
      chrome.tabs.update({ url: `https://www.google.com/search?q=${text}` });
      return;
    }
  }

  console.log("address to go to: " + newUrl);
  // Redirect to the new URL if it was found or constructed
  if (newUrl) {
    chrome.tabs.update({ url: newUrl });
  }
});
