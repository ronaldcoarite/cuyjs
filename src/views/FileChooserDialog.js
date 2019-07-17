FileChooserDialog = {
    showSelectFile: function (type) {
        return new Promise(function (resolve, reject) {
            var domoInput = document.getElementById("files");
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
                    resolve({
                        fileName: domoInput.files[0].name,
                        data: contents,
                        size: domoInput.files[0].size,
                        lastModified: domoInput.files[0].lastModified
                    });
                    //                    cbSelected(doc.documentElement);
                };
                reader.onerror = function (error) {
                    reject(error);
                },
                    //                reader.readAsBinaryString(domoInput.files[0],"UTF-8");
                    reader.readAsDataURL(domoInput.files[0]);
            };

        });
    }
};