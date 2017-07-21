$(function(){
  $(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd DD P H:ii",
    language:'zh-CN',
    weekStart: 1,
    todayBtn:  0,
    autoclose: 1,
    minuteStep:15,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    daysOfWeekDisabled: '0,6',
    startDate:'+1d'
      });
});
$(function(){

      $('#application').submit(function(){

        $(this).ajaxSubmit({
          error: function(xhr) {
          status('Error: ' + xhr.status);
          },
          success: function(response) {
          console.log(response);
            $("#notice").empty().text(response);
          }
         });
        return false;
      });
 });
