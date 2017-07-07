$(function() {
    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
      var input = $(this),
          numFiles = input.get(0).files ? input.get(0).files.length : 1,
          label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
    });
    // We can watch for our custom `fileselect` event like this
    $(document).ready( function() {
        $(':file').on('fileselect', function(event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if( input.length ) {
                input.val(log);
            } else {
                if( log ) alert(log);
            }
        });
    });

  });
$(function() {
      $('#uploadForm').submit(function() {
      var img_src_file = $("#smallimage").val();
      var fileTypes = new Array("jpg","png","gif","avi",);  //定义可支持的文件类型数组
      var fileTypeFlag = "0";
      var newFileName = img_src_file.split('.');
          newFileName = newFileName[newFileName.length-1];
      for(var i=0;i<fileTypes.length;i++){
      　　if(fileTypes[i] == newFileName){
      　　　　fileTypeFlag = "1";
      　　}
      }
        if(fileTypeFlag == "0"&&$('#smallimage').get(0).files.length>0){
        　　alert("请上传正确格式图片！");
        　　return false;
        }
      if ($('#smallimage').get(0).files.length == 0){
          console.log( 'no image !!');
          alert('请选择图片 !!');
          return false;
          }
      $("#status").empty().text("上传中...");
      $(this).ajaxSubmit({

      error: function(xhr) {
      status('Error: ' + xhr.status);
      },
      success: function(response) {
      $("#status").empty().attr('class','btn btn-success').text("上传成功").attr('disabled',true);
      console.log(response)
      $("#image").empty().append('<img src="/upload/smallimages/' + response + '" />');
      $("#inputImg").empty().val('/upload/smallimages/' + response);
      }
      });
      return false;
      });

});