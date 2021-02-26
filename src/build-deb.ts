import path = require("path");
import fs = require("fs");
import process = require("child_process");

// Get the foldername
const deployDir = path.join("deploy") // ./deploy relative to where command is executed
const debStructDir = path.join(__dirname, "..", "deb-struct") // ./deb-struct relative to where command is executed

const configFile = path.join(deployDir, "config.json");
const appName: string = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' })).appName;
const appNameSanitized = appName.replace(' ', '').toLowerCase();
const buildFolder = path.join(deployDir, "linux", "build", appName);

function cleanDirectories(): void {
    console.log("Cleaning DEBIAN:");
    console.log(process.execSync('rm -rf ' + debStructDir + '/DEBIAN/*'));

    console.log("Cleaning bin:");
    console.log(process.execSync('rm -rf ' + debStructDir + '/usr/bin/*'));

    console.log("Cleaning lib:");
    console.log(process.execSync('rm -rf ' + debStructDir + '/usr/lib/*'));

    console.log("Cleaning applications:");
    console.log(process.execSync('rm -rf ' + debStructDir + '/usr/share/applications/*'));
}

function copyControlFile(): void {
    console.log("Copying control:");
    console.log(process.execSync('cp ./control ' + debStructDir + '/DEBIAN/control'));
}

function copyBuildFolderToLib(): void {
    const folderPath = path.join(debStructDir, "usr", "lib");

    console.log("Copying Build Folder:");
    console.log(process.execSync('cp -R "' + buildFolder + '" "' + folderPath + '"'));
    console.log(process.execSync('cp -R ./assets "' + path.join(folderPath, appName) + '"'));
    if (appName !== appNameSanitized) {
        console.log(process.execSync('mv "' + path.join(folderPath, appName) + '" "' + path.join(folderPath, appNameSanitized) + '"'));
    }
}

function createSymlinkToBin(): void {
    const folderPath = '"' + path.join(debStructDir, "usr", "bin", appName) + '"';
    console.log("Generating Symlink:");
    console.log(process.execSync('ln -s /usr/lib/' + appNameSanitized + '/qode ' + folderPath));
}

function copyDesktopFileToApplications(): void {
    console.log("Copying Desktop File:");
    console.log(process.execSync('cp "' + path.join(buildFolder, getFilesFromPath(buildFolder, '.desktop')[0]) + '" "' + path.join(debStructDir, 'usr', 'share', 'applications', appName.replace(' ', '').toLowerCase() + '.desktop"')));
}

function createDeb(): void {
    // Create DEBIAN File
    console.log("Generating Debian:");
    console.log(process.execSync('dpkg-deb --build "' + debStructDir + '" "' + appNameSanitized + '.deb"'));
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
