$(function() {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red',
        increaseArea: '20%' // optional
    });
    $('#app-examine').submit(function() {
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                console.log(response);
                $("#app-examine").addClass('hide');
                $("#notice").empty().removeClass('hide').text('审批成功!');
                $('#returnTime').empty().text(response.extendTime);
                var n = parseInt(response.state);
                switch (n) {
                    case 0:
                        $('.state span').empty().removeClass().addClass('btn-success btn-sm').text('同意借出');
                        $('#comment').empty().text(response.comment);
                        break;
                    case 1:
                        $('.state span').empty().removeClass().addClass('btn-warning btn-sm').text('不同意');
                        $('#comment').empty().text(response.comment);
                        break;
                    case 2:
                        $('.state span').empty().removeClass().addClass('btn-info btn-sm').text('到期已还');
                        $('#comment').empty().text(response.comment);
                        break;
                    case 3:
                        $('.state span').empty().removeClass().addClass('btn-danger btn-sm').text('过期未还');
                        $('#comment').empty().text(response.comment);
                        break;
                }
            }
        });
        return false;
    });
});
$(function() {
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd DD P H:ii",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 0,
        autoclose: 1,
        minuteStep: 15,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1,
        daysOfWeekDisabled: '0,6',
        startDate: '+1d'
    });
});
$(function() {
    $("#delete").on("click", ".del", function(e) {
        console.log('done');
        var target = $(e.target);
        var id = target.data("id");
        console.log('done');
        $.ajax({
                type: 'DELETE',
                url: '/manage/app-list?id=' + id
            })
            .done(function(result) {
                console.log('done')
                if (result.success === 1) {
                    $('#del-notice').empty().removeClass('hide').text('删除成功!');
                    $('#app-main').remove();
                }
            })
    })
});