/**
 * Created by rokoroku on 2016-08-23.
 */

"use strict";

const fs = require("fs");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const dependencies = require("../package.json").mavenDependencies;

function clearPath(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        clearPath(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  } else {
    fs.mkdirSync(path);
  }
}

async function getDependencies(dependencies) {
  for (const key in dependencies) {
    const repository = dependencies[key];
    const filename = path.basename(key + ".jar");

    await exec(`curl ${repository} -o ./jar/${filename} -L`);
  }
}

clearPath("./jar");
getDependencies(dependencies);
