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
    var $pagination = $('#pagination');
    var defaultOpts = {
        totalPages: 20,
        visiblePages: 7,
        href: false,
        startPage: 1,
        pageVariable: 'page',
    };
    $pagination.twbsPagination(defaultOpts);
    $.ajax({
            type: "GET",
            url: "/pagenumber", 
            data: {},
            dataType:'json', 
        success: function (data) {
            var totalPages = Math.ceil(data.total/6);
            var currentPage = $pagination.twbsPagination('getCurrentPage');
            $pagination.twbsPagination('destroy');
            $pagination.twbsPagination($.extend({}, defaultOpts, {
                startPage: currentPage,
                totalPages: totalPages,
                onPageClick: function (event, page) {
                    $.ajax({
                    type: "GET",
                    url: "/news/page/"+page, 
                    data: {},
                    success : function(data) {
                        $('.post-list').html(data);
                        }
                    });
                }
            }));
        }
    });
});
