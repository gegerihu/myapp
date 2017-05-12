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