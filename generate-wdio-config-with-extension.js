#! /usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const base64 = require('base-64');
const path = require('path');

const extensionFullPath = process.argv[2];
const webDriverIOConfigPath = process.argv[3];
const extensionName = path.basename(extensionFullPath);
const extensionDirectory = path.dirname(extensionFullPath);

if(fs.existsSync(`${extensionDirectory}/${extensionName}.crx`)) {
    fs.unlinkSync(`${extensionDirectory}/${extensionName}.crx`);
}
if(fs.existsSync(`${extensionDirectory}/${extensionName}.pem`)) {
    fs.unlinkSync(`${extensionDirectory}/${extensionName}.pem`);
}

exec(`crxmake --pack-extension="${extensionFullPath} --extension-output="${extensionDirectory}/${extensionName}.crx"`, (error, stdout, stderr) => {
    exec(`openssl base64 -in ${extensionDirectory}/${extensionName}.crx`, (err, stdout, stderr) => {
        const base64CrxFile = stdout.split('\n').map(s => s.trim()).join('');
        const wdioConfig = require(webDriverIOConfigPath);

        wdioConfig['capabilities'] = Object.assign({}, wdioConfig.capabilities, {
            chromeOptions: {
                extensions: [
                    base64CrxFile
                ]
            }
        });

        fs.writeFileSync(`${extensionDirectory}/wdio-with-extension.conf.json`, JSON.stringify(wdioConfig));
    })
});