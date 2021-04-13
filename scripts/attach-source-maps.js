// Source maps are not enabled on Android out of the box
// For more details please see the below:
// - https://github.com/ionic-team/ionic-framework/issues/16455#issuecomment-704520276
// - https://github.com/ionic-team/ionic-framework/issues/16455#issuecomment-751963968

let fs = require('fs');
let path = require('path');

const TARGET_DIR = 'www';

module.exports = function (ctx) {
    if (ctx.argv.includes('--release') || ctx.build.platform !== "android")
        return;

    console.warn('=====================');
    console.warn('WARNING: Sourcemaps have been manually added. Ensure this is disabled in production!');
    console.warn('=====================');

    let files = fs.readdirSync(TARGET_DIR);

    files.forEach(file => {
        let mapFile = path.join(TARGET_DIR, file + '.map');
        let targetFile = path.join(TARGET_DIR, file);
        if (path.extname(file) === '.js' && fs.existsSync(mapFile)
            || path.extname(file) === '.css' && fs.existsSync(mapFile)) {
            let bufMap = fs.readFileSync(mapFile).toString('base64');
            let bufFile = fs.readFileSync(targetFile, "utf8");
            let result = bufFile.replace('sourceMappingURL=' + file + '.map', 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + bufMap);
            fs.writeFileSync(targetFile, result);
            fs.unlinkSync(mapFile);
        }
    });

};