const fs = require('fs')
const exec = require('child_process').exec;

// Define the folder path
const IA_DOC_FOLDER = ""
const EXCLUDE_FOLDER = ""

const date = new Date().toISOString().substr(0, 10)
const todoRegex = /(- \[ \]).*/g
const newFile = []
const newFileName = `${IA_DOC_FOLDER}/${EXCLUDE_FOLDER}/${date} - Todos.txt`


const parseFile = function (file) {
    const note = fs.readFileSync(file, 'utf8').split('\n')
    const undos = note.filter(t => t.match(todoRegex))
    if (undos.length) {
        const documentName = file.replace(`${IA_DOC_FOLDER}/`, '').replace(/\//g, ' > ').replace('.txt', '')
        newFile.push(`\n## ${documentName}\n`)
    }
    undos.forEach(undo => document.push(undo))

}

const getFiles = function (path, files) {
    fs.readdirSync(path).forEach(function (file) {
        const subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        } else {
            if (!path.includes(`${EXCLUDE_FOLDER}`)) {
                parseFile(`${path}/${file}`)
            }
        }
    });
}




newFile.push(`# ${date} Todos`)
getFiles(IA_DOC_FOLDER, document)

fs.writeFile(newFileName, document.join('\n'), 'utf8', function (err) {
    if (err) return console.log(err);
    console.log('😳 So many to do');
    console.log(newFileName)
});

exec(`open -a iA\\ Writer ${newFileName.replace(' -', '\\ -\\')}`, function (err) {
    if (err) return console.log(err)
})