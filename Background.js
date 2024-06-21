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

  // If no exact match, check for known prefixes like "j/"
  if (!newUrl) {
    if (text.startsWith("j/")) {
      const baseUrl = mappings["j/"];
      const identifier = text.slice(2); // Get the identifier part after "j/"
      newUrl = `${baseUrl}${identifier}`;
    }
    else {
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

