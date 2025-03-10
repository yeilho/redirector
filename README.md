# Chrome Extension: URL Redirection

## Overview

This Chrome extension allows users to define URL mappings. When a user enters a keyword into the Chrome Omnibox, the extension redirects the browser to the corresponding URL defined in the mappings. 

## Features

- **YAML Support**: Load and parse a YAML file (`mappings.yaml`) to get URL mappings.
- **Keyword Redirection**: Enable Google Chrome Omnibox to redirect to specified URLs based on input keywords.
- **Dynamic Loading**: Reload mappings on extension installation and browser startup.
- **Omnibox Command**: Input 'mappings' in the Omnibox to open the options page.
- **Handle URL Construction**: Support URL construction for complex mappings.

## Installation

1. **Download the extension files**: Clone or download the repository to your local machine.
  
2. **Open Chrome Extensions Page**: Go to `chrome://extensions/`.
   
3. **Activate Developer Mode**: Toggle the Developer Mode switch in the top right corner.
   
4. **Load Unpacked Extension**: Click on `Load unpacked` and select the folder containing the extension files.


## Usage

1. **Use the Omnibox**: 
    - **Open the Omnibox**: Click on the address bar or use the keyboard shortcut (usually `Ctrl` + `L` or `Cmd` + `L`).
    - **Enter redirector mode**: Type `go` and press space bar to trigger the extension
    - **Enter a keyword**: Enter your keyword link (e.g., `gm`) or a keyword with a suffix (e.g., `yt/abcde`).
    - **Press Enter**: The browser will navigate to the mapped or constructed URL.

2. **Manage Mappings**: 
    - Type `mappings` into the Omnibox and press enter to open the options page, where you can view the current mappings.
      
