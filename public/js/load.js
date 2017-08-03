$(function() {
    $('.navbar-nav').find('li').each(function() {
        var a = $(this).find('a:first')[0];
        if ($(a).attr('href') === location.pathname) {
            $(this).addClass('baractive');
        } else {
            $(this).removeClass('baractive');
        }
    });
});
$(function() {
    if (location.pathname === '/about/setting') {
        $('#first').addClass('baractive');
    };
    $('ol li:first-child').addClass('active');
    $('.carousel-inner .item:first-child').addClass('active');
});
$(function() {
    $('.edui-upload-video').attr('preload', 'auto').attr('width', '100%');
    $('audio').attr('preload', 'auto').attr('width', '100%');
    $('video').attr('preload', 'auto').attr('width', '100%');
});
$(function() {
    $("input").focus(function(){
        $(".wrong-info").hide();
        $(".alert").hide();
      });
    $('#student-signupform').submit(function() {
        console.log('提交注册');
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                if (response.userName) {
                    $("#userName").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.userName);
                }
                if (response.email) {
                    $("#email").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.email);
                }
                if (response.phone) {
                    $("#phone").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.phone);
                }
                if (response.notConfirm) {
                    $("#notConfirm").show().empty().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.notConfirm);
                }
                if (response.password) {
                    $("#password").show().empty().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.password);
                }
                if (response.success){
                    $("#student-signup-notice").empty().show().removeClass().addClass('alert alert-success').text(response.success);
                    $('#student-signupform-main').hide();
                }
                console.log(response)
            }
        });
        return false;
    });
});
$(function() {
    $('#lecturer-signupform').submit(function() {
        console.log('提交注册');
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                if (response.userName) {
                    $("#userName-lecturer").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.userName);
                }
                if (response.email) {
                    $("#email-lecturer").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.email);
                }
                if (response.phone) {
                    $("#phone-lecturer").empty().show().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.phone);
                }
                if (response.notConfirm) {
                    $("#notConfirm-lecturer").show().empty().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.notConfirm);
                }
                if (response.password) {
                    $("#password-lecturer").show().empty().removeClass('hide').append('<span class = "glyphicon glyphicon-remove"></span>'+response.password);
                }
                if (response.success){
                    $("#lecturer-signup-notice").empty().show().removeClass().addClass('alert alert-success').append('<span class = "glyphicon glyphicon-ok"></span>'+response.success);
                    $('#lecturer-signupform-main').hide();
                }
                console.log(response)
            }
        });
        return false;
    });
});
$(function() {
    $(document).on("click", "#switch", function() {
        $('#login-modal').modal('hide');
        $('#signup-modal').modal('show');
    });
})

$(function() {
    $('#loginform').submit(function() {
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                console.log(response);
                if (response.success) {
                    // console.log('34242424');
                    $('#loginform').empty().show().removeClass().addClass('alert alert-success').append('<span class = "glyphicon glyphicon-ok"></span>'+response.success);
                    window.location.reload();
                } else {
                    $("#login-notice").empty().show().removeClass('hide').addClass('alert-danger').append('<span class = "glyphicon glyphicon-remove"></span>'+response.danger);
                }
            }
        });
        return false;
    });
});
