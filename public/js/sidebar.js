$(document).ready(function () {
  var trigger = $('.hamburger'),

     isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

    function hamburger_cross() {

      if (isClosed == true) {

        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = false;
      } else {
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = true;
      }
    }
  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
  $.get("/manage/new-app-count",function(data,status){
      if(data!==0){
        $('.badge').empty().removeClass('hide').text(data);
      }
    });
  setInterval(function() {
    $.get("/manage/new-app-count",function(data,status){
      if(data!==0){
        $('.badge').empty().removeClass('hide').text(data);
      }
    });
  //your jQuery ajax code
  }, 1000*60*1);
});
