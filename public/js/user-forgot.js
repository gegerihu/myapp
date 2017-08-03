$(function() {
    $("input").focus(function(){
        $(".alert").hide();
      });
    $('#email-reset').submit(function() {
        console.log('dadadasdasdsdadasdasdasdasdasda');
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                console.log(response);
                if (response.success) {
                    $("#email-notice").empty().show().removeClass('hide alert-danger').addClass('alert-success').text(response.success);
                    $('#email-mian').hide();
                } else {
                    $("#email-notice").empty().show().removeClass('hide').addClass('alert-danger').text(response.danger);
                }
            }
        });
        return false;
    });
});