# Yandex translator browser extension

Adds the ability to translate pages using the Yandex Translator service.
To use the capabilities of the translator service, an API key is required, which is installed through the add-on
settings panel. Authorization is described on
[this page](https://cloud.yandex.com/en/docs/translate/api-ref/authentication) in the documentation,
the creation of API keys is described in
[this article](https://cloud.yandex.com/en/docs/iam/operations/api-key/create).

## Installation

The extension files for firefox and chromium are available on the releases page.
The building of add-on is described in the corresponding section.

Before installing in firefox, you need to enable the ability to install extensions without digital signatures.
What is done by going to the address about:config and setting the value of property xpinstall.signatures.required
equal to false. After opening about:addons - add-ons control panel, drag and drop the file extension.firefox.xpi
to the page area.

Before installing in chromium or chrome, you need to unpack the archive extension.chromium.zip.
After launching the browser, go to the add-ons page and enable developer mode.
Then click the button to install the unpacked extension and select the folder of the unpacked archive
extension.chromium.zip.

## Build

To build, you will need to download the repository, which can be done with this command
`git clone https://github.com/ArundhatiApte/yandex-translator-browser-extension.git path/to/cloned-repo`.
Node.js, npm, npx and python3 are also required. Go to the repository directory, install all dependencies with
command: `npm install`. The script for building extension - buildExtension.py is located in building/ folder.
The script accepts 3 parameters:

* configuration (test|production - test|prod)
* will minify source code (yes|no - 0|1)
* browser (firefox|chromium)

For example, the build of extension configured to use a real Yandex translator service with code minification
for the firefox browser is performed by the command: `python3 buildExtension.py prod 1 firefox`. This script must be
executed from building/ directory. After executing the script, a file extension.firefox.xpi will appear in the
building/result/ folder if the target browser was firefox, if chromium - extension.chromium.zip.
