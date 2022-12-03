class FileChooser{
    static async readFileInBase64(file){
        return await new Promise(function (resolve, reject) {
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
                let fileNameSelected = file.name;
                resolve({
                    fileName: fileNameSelected,
                    fileExt: fileNameSelected.substring(fileNameSelected.lastIndexOf('.')+1),
                    dataInBase64: contents,
                    size: file.size,
                    lastModified: file.lastModified
                });
                //                    cbSelected(doc.documentElement);
            };
            reader.onerror = function (error) {
                reject(error);
            },
                //                reader.readAsBinaryString(domoInput.files[0],"UTF-8");
            reader.readAsDataURL(file);
        });
    }

    static async showSelectFile(types) {
        /*
        private String fileName;
        private String fileExt;
        private Integer size;
        private String dataInBase64;
        private long lastModified;*/
        return await new Promise((resolve) => {
            var domoInput = document.createElement("input");
            domoInput.setAttribute('type', "file");
            domoInput.style.visibility = "hidden";
            domoInput.setAttribute('accept', types);

            document.body.appendChild(domoInput);
            domoInput.click();
            domoInput.onchange = function () {
                let file = domoInput.files[0];
                domoInput.remove();
                resolve(file);
            };
        });
    }

    static async showSaveFile(fileName, content){
        let blobData = new Blob([content], {type: "text/plain"});
        let url = window.URL.createObjectURL(blobData);

        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
};