const fs = require("fs");
const _ = require("lodash");
const argv = require("yargs").argv;

const { exec } = require("child_process");

const file = argv.file;

const parseResults = data => {
    const deps = [];
    let allCircular = 0;
    data.split("\n").forEach(line => {
        const result = line.split("->");
        if (result.length > 1) {
            allCircular++;
            for (let i = 0; i < result.length - 1; i++) {
                deps.push([result[i].trim(), result[i + 1].trim()]);
            }
        }
    });

    const toString = pair => pair[0] + "->" + pair[1];
    const counts = _.countBy(deps, toString);
    const ordered = _.sortBy(_.uniq(deps.map(toString)), key => counts[key]);
    ordered.forEach(key => {
        console.log(counts[key] + " " + key);
    });

    console.log("Total circular dependencies: ", allCircular);
};

/**
 * Read dependency warnings from build or a static file and then aggregate the information based on links
 */
if (!file) {
    exec("npm run build", (err, stdout, stderr) => {
        if (err) {
            throw err;
        }
        parseResults(stdout);
    });
} else {
    fs.readFile(argv.file, "utf8", function read(err, data) {
        if (err) {
            throw err;
        }
        parseResults(data);
    });
}
