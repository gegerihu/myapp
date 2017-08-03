$(document).ready(function() {
    $("#inputSImg").fileinput({
        uploadUrl: '/uploadImage',
        allowedFileExtensions: ["jpg", "png", "gif", "jpeg"],
        uploadAsync: true,
        dropZoneEnabled: false,

        // uploadAsync: true,

    });
    $("#inputSImg").on("fileuploadsuccess", function(event, data, previewId, index) {
        console.log(data.id);
        console.log(data.index);
        console.log(data.file);
        console.log(data.reader);
        console.log(data.files);
        var obj = data.response;
        alert(JSON.stringify(data.success));
    });

})