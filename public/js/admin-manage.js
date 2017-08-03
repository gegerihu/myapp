$(function() {
    moment.locale('zh-cn');
    // console.log(weekOfMonth)
    var labels = [];
    var dayOfWeek = moment().day();
    (dayOfWeek == 0) ? dayOfWeek = 7: dayOfWeek;
    var monday = moment().subtract(dayOfWeek - 1, 'days');
    var userData = [],
        appData = [],
        documentData = [],
        stateData=[],
        contentData=[];
    for (var i = 15; i >= 0; i--) {
        $.ajax({
            url: "/manage/user/user-week-count/" + i,
            data: {},
            type: "GET",
            async: false,
            dataType: 'json',
            success: function(data) {
                userData.push(data)
            }
        });
        $.ajax({
            url: "/manage/user/application-week-count/" + i,
            data: {},
            type: "GET",
            async: false,
            dataType: 'json',
            success: function(data) {
                appData.push(data)
            }
        });
        $.ajax({
            url: "/manage/user/content-week-count/" + i,
            data: {},
            type: "GET",
            async: false,
            dataType: 'json',
            success: function(data) {
                documentData.push(data)
            }
        });

        var weekOfYear = moment().format('W');
        var days = i * 7;
        if (i == 0) {
            labels.push(moment().format('MMMDo') + '本周')
            // console.log(moment().subtract(days, 'days').format('M月D'));
        } else {
            var days = i * 7;
            labels.push(moment(monday).subtract(days, 'days').format('MMMDo-') + '第' + (weekOfYear - i) + '周');
            // console.log(moment(monday).subtract(days, 'days').format('MMMD'));
        }
    }
    $.ajax({
            url: "/manage/user/content-category-count",
            data: {},
            type: "GET",
            async: false,
            dataType: 'json',
            success: function(data) {
                contentData = data,
                console.log(data);
            }
        });
    $.ajax({
            url: "/manage/user/app-state-count",
            data: {},
            type: "GET",
            async: false,
            dataType: 'json',
            success: function(data) {
                stateData = data,
                console.log(data);
            }
        });
    console.log(labels);
    console.log(userData);
    console.log(appData);
    var barChartData = {
        labels: labels,
        datasets: [{
            label: '文档',
            backgroundColor: '#337ab7',
            borderColor: '#337ab7',
            borderWidth: 1,
            data: documentData,
        }, {
            label: '申请',
            backgroundColor: '#5cb85c',
            borderColor: '#5cb85c',
            borderWidth: 1,
            data: appData,
        }, {
            label: '用户',
            backgroundColor: '#f0ad4e',
            borderColor: '#f0ad4e',
            borderWidth: 1,
            data: userData
        }]

    };
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    var configDoc = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: contentData,
                backgroundColor: [
                '#36a2eb',
                '#ff6384',
                '#ffcd56',
                '#4bc0c0',
                '#f0ad4g',
                ]
            }],
            labels: [
                "新闻动态",
                "教学活动",
                "规章制度",
                "学生作品",
                "下载文档",
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '文档分类'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
 // when 0
                    //     同意借出
                    // when 1
                    //      不同意
                    // when 2
                    //      到期已还
                    // when 3
                    //      过期未还
                    // when 4
                    //      申请当中
    var configApp = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: stateData,
                backgroundColor: [
                '#5cb85c',
                '#ff6384',
                '#5bc0de',
                '#d9534f',
                '#286090',
                ]
            }],
            labels: [
                "同意借出",
                "不同意",
                "到期已还",
                "过期未还",
                "申请当中",
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '申请表状况'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    var ctx = document.getElementById("myChartDoc");
    var myDoughnut = new Chart(ctx, configDoc);
    var ctx = document.getElementById("myChartApp");
    var myDoughnut = new Chart(ctx, configApp);
});