class FileChooser{
    static async showSelectFile(types) {
        return await new Promise(function (resolve, reject) {
            var domoInput = document.createElement("input");
            domoInput.setAttribute("type", "file");
            domoInput.style.visibility = "hidden";
            domoInput.accept = types;

            document.body.appendChild(domoInput);
            domoInput.click();
            domoInput.onchange = function () {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    //                    var parser = new DOMParser();
                    var contents = evt.target.result;
                    // El contenido se encuentra en Base64
                    // application/octet-stream;base64,UEsDBBQAAAgIAEe8.....
                    let posBase = contents.indexOf(',');
                    contents = posBase === -1 ? contents : contents.substr(posBase + 1);
                    //                    var doc = parser.parseFromString(contents, "application/xml");
                    domoInput.remove(); 
                    let fileNameSelected = domoInput.files[0].name;
                    resolve({
                        fileName: fileNameSelected,
                        fileExt: fileNameSelected.substring(fileNameSelected.lastIndexOf('.')+1),
                        dataInBase64: contents,
                        size: domoInput.files[0].size,
                        lastModified: domoInput.files[0].lastModified
                    });
                    //                    cbSelected(doc.documentElement);
                };
                reader.onerror = function (error) {
                    domoInput.remove();
                    reject(error);
                },
                    //                reader.readAsBinaryString(domoInput.files[0],"UTF-8");
                reader.readAsDataURL(domoInput.files[0]);
            };
        });
    }

    static async showSaveFile(fileName,urlFile){
        console.log("Descargando archivo",urlFile);
        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        a.href = urlFile;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(urlFile);
        a.remove();
    }
};