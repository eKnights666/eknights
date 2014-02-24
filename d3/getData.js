var fs = require('fs');
var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var lc = require('lineCounter');
var lnCounter = new lc.LineCounter();


function dirTree(filename) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {
        var info = new Array();
        info.push(path.basename(filename));
        info.push(lnCounter.directorySize(filename));
        info.push(lnCounter.countLinesInFolder(filename));

        var children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
        info.push(children);
        return info;
    } else {
        var file = new Array();
        file.push(path.basename(filename));
        file.push(lnCounter.fileSize(filename));
        file.push(lnCounter.countLinesInFile(filename));
        return file;
    }
}

function getDepth(parent) {
    var depth = 0;
    for (var child in parent) {
        if (typeof parent[child] === 'object') {
            var tmpDepth = getDepth(parent[child]);
            if (tmpDepth > depth) {
                depth = tmpDepth;
            }
        }
    }
    return 1 + depth;
}



//var git = spawn('git', ['clone', 'https://github.com/hasadna/Open-Knesset.git']); // the second arg is the command 

//git.stdout.on('data', function(data) {    // register one or more handlers
//    console.log('stdout: ' + data);
//});
//git.stderr.on('data', function(data) {
//    console.log('stderr: ' + data);
//});
//git.on('exit', function(code) {
//});

//console.log('child process exited with code ' + code);

rimraf.sync(path.join(__dirname, "Open-Knesset/.git"));

var obj = dirTree(__dirname + '/Open-Knesset');
//obj.depth = getDepth(obj);

console.log(getDepth(obj));

//    console.log(JSON.stringify(obj));
var dataFile = "var code_hierarchy_data = " + JSON.stringify(obj) + ";";
fs.writeFile("cir/data.js", dataFile, function(err) {
    if (err)
        console.log(err);
    else
        console.log("The file was saved!\n" + "Go to: " + __dirname + "/cir/index.html");
});