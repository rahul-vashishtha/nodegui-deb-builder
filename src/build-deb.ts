import path = require("path");
import fs = require("fs");
import process = require("child_process");

// Get the foldername
const configFile = path.join(__dirname, "deploy", "config.json");
const appName: string = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' })).appName;
const buildFolder = path.join(__dirname, "deploy", "linux", "build", appName);

function cleanDirectories(): void {
    console.log("Cleaning DEBIAN:");
    console.log(process.execSync('rm -rf ./deb-struct/DEBIAN/*'));

    console.log("Cleaning bin:");
    console.log(process.execSync('rm -rf ./deb-struct/usr/bin/*'));

    console.log("Cleaning lib:");
    console.log(process.execSync('rm -rf ./deb-struct/usr/lib/*'));

    console.log("Cleaning applications:");
    console.log(process.execSync('rm -rf ./deb-struct/usr/share/applications/*'));
}

function copyControlFile(): void {
    console.log("Copying control:");
    console.log(process.execSync('cp ./control ./deb-struct/DEBIAN/control'));
}

function copyBuildFolderToLib(): void {
    const folderPath = path.join(__dirname, "deb-struct", "usr", "lib");

    console.log("Copying Build Folder:");
    console.log(process.execSync('cp -R "' + buildFolder + '" "' + folderPath + '"'));
    console.log(process.execSync('cp -R ./assets "./deb-struct/usr/lib/' + appName + '"'));
    console.log(process.execSync('mv "./deb-struct/usr/lib/' + appName + '" ./deb-struct/usr/lib/' + appName.replace(' ', '').toLowerCase()));
}

function createSymlinkToBin(): void {
    const folderPath = '"' + path.join(__dirname, "deb-struct", "usr", "bin", appName) + '"';
    console.log("Generating Symlink:");
    console.log(process.execSync('ln -s /usr/lib/' + appName.replace(' ', '').toLowerCase() + '/qode ' + folderPath));
}

function copyDesktopFileToApplications(): void {
    console.log("Copying Desktop File:");
    console.log(process.execSync('cp "' + path.join(buildFolder, getFilesFromPath(buildFolder, ".desktop")[0]) + '" ./deb-struct/usr/share/applications/' + appName.replace(' ', '').toLowerCase() + '.desktop'));
}

function createDeb(): void {
    // Create DEBIAN File
    console.log("Generating Debian:");
    console.log(process.execSync("dpkg-deb --build deb-struct"));

    // Rename debian
    console.log(process.execSync("mv deb-struct.deb " + appName.replace(' ', '').toLowerCase() + ".deb"));
}

function getFilesFromPath(path: string, extension: string): string[] {
    let files = fs.readdirSync(path);
    return files.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
}

cleanDirectories();
copyControlFile();
copyBuildFolderToLib();
createSymlinkToBin();
copyDesktopFileToApplications();
createDeb();