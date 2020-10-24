let fs = require('fs');
let strip = require('strip-comments');
let path = require('path');
let arrayClass = require('./file_order');
let arrayCode = new Array();

for(let file of arrayClass){
    //let file = 'D:\\web\\cuyjs\\src\\page\\Page.js';
    console.log("FILE: ",file);
    let bufferFile = fs.readFileSync(`${__dirname.replace('build','')}${path.sep}${file}`, 'utf8');
    // console.log(bufferFile.toString());
    let result = bufferFile.toString()
    // let result = bufferFile.toString()
    //                .replace(/ +(?= )/g,'')
    //                .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
    //                .replace(/\r?\n|\r/g, " ");
    arrayCode.push(`// Class: ${file}`);
    arrayCode.push(result);
    // console.log(result.code);
}
let fileCompresed = arrayCode.join('\n');
fs.writeFileSync(`${__dirname.replace('build','dist')}/cuyjs.min.js`, fileCompresed);
fs.writeFileSync(`D:\\proyectos\\domo_server\\source\\IotServer\\src\\main\\webapp\\lib\\cuyjs.min.js`, fileCompresed);
fs.writeFileSync(`D:\\proyectos\\domo_server\\source\\DomolinWebSite\\src\\main\\webapp\\lib\\cuyjs.min.js`, fileCompresed);
fs.writeFileSync(`D:\\proyectos\\domo_server\\source\\IotSecurity\\src\\main\\webapp\\lib\\cuyjs.min.js`, fileCompresed);
