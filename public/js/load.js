$(function(){
        $('.navbar-nav').find('li').each(function(){
            var a=$(this).find('a:first')[0];
            if ($(a).attr('href')===location.pathname){
                $(this).addClass('baractive');
            }else{
            $(this).removeClass('baractive');
                }
            });
        });
$(function(){
        if (location.pathname ==='/about/setting') {
            $('#first').addClass('baractive');
        };
    });
$(function(){
    $('.edui-upload-video').attr('preload','auto');
});
$(function(){
      $('#signupform').submit(function(){
        console.log('提交注册');
        $(this).ajaxSubmit({
          error: function(xhr) {
          status('Error: ' + xhr.status);
          },
          success: function(response) {
            if (response!= '注册成功!') {
                $("#signup-notice").empty().removeClass('hide').text(response);
            }else{
                $('#signupform').empty().text(response);
            }
          console.log(response)
            }
        });
        return false;
      });
 });
$(function(){
    $(document).on("click","#switch",function(){
    $('#login-modal').modal('hide');
    $('#signup-modal').modal('show');
    });
})

$(function(){
      $('#loginform').submit(function(){

        $(this).ajaxSubmit({
          error: function(xhr) {
          status('Error: ' + xhr.status);
          },
          success: function(response) {
          $("#login-notice").empty().removeClass('hide').text(response);
          console.log(response)
            }
        });
        return false;
      });
 });