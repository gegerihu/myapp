$(function() {
    $('#list').DataTable({ "iDisplayLength": 25 });
    console.log('done');
    $("#list").on("click", ".contentdel", function(e) {
        console.log('done');
        var target = $(e.target);
        var id = target.data("id");
        var tr = $('.item-id-' + id);
        console.log('done');
        $.ajax({
                type: 'DELETE',
                url: '/manage/content/list?id=' + id
            })
            .done(function(result) {
                console.log('done')
                if (result.success === 1 && tr) {
                    tr.remove()
                }
            })
    })
})