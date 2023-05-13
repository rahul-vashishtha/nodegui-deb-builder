# nodegui-deb-builder

Debian package builder for nodegui (Based on nodegui-starter and nodegui-mvc-starter)

_Note: (As of now) This deb builder generates debian according to the structure of nodegui-starter and nodegui-mvc-starter._

## Building Source

-   Clone the repository: `git clone https://github.com/rahul-vashishtha/nodegui-deb-builder.git`
-   Install required packages using `npm install`
-   Transpile the source by running `tsc`

## Prequisites before building Debian Package

-   Make sure you have updated `control` file according to your requirements
-   Update the `.desktop` file in `<project-folder>/deploy/linux/<app-name>/` directory with following data.

    ```
    [Desktop Entry]
    Name=Your Application Name
    Exec="/usr/bin/<your app name>"
    Comment=Info about your application.
    Terminal=false
    Icon="/usr/lib/<app name in lowercase without spaces>/<icon name>.png"
    Type=Application
    ```

    The double quotes are used in-case there are spaces in your application name or icon name.

## Building Debian Package

-   Copy the following to the root of your project folder:

    -   `deb-struct` directory
    -   `build-deb.js` file from ./dist folder.
    -   `control` file
    -   `deb-config.json` file (As of now this file has no use, but will be used in future)

-   Make sure you have created package using packaging guide from [NodeGUI Packer](https://github.com/nodegui/packer "Node GUI Packer"). _(This generates all the files required to build the Debian package.)_
-   Run `node build-deb.js`. You'll find your .deb file in the root folder itself.

## Roadmap

-   Use deb-config.js to main config file to create `.desktop` and `control` file.
