$().ready(function(){
	var team = getQueryString('team');
	$(".js-teamName").html('<img src="images/flags/'+team.substring(0,3).toLowerCase()+'.png"> '+team);
	$.get('localdata/teams_flag.json', function (teamsJson) {
		initOverview(teamsJson);
	});

	$.get('localdata/teams.json',function(teamsData){
		initCharts(team,
			_.filter(teamsData, function(item){
				//过滤出该球队的数据
				return item.TEAM === team;
			})
		);
	});


});


function initCharts(team,data){
	if (data.length>5) {
		document.getElementById('chart-2').style.height = data.length*35 +'px';
	}

	//总体统计
	var w =  _.sumBy(_.map(data,'W'),function(v){
			return +v;
		});
	var d =  _.sumBy(_.map(data,'D'),function(v){
		return +v;
	});
	var l =  _.sumBy(_.map(data,'L'),function(v){
		return +v;
	});
	var n = _.sumBy([w,d,l]);



	
	var chart3 = echarts.init(document.getElementById('chart-3'));
	if (document.getElementById('chart-1')) {

		var chart1 = echarts.init(document.getElementById('chart-1'));
		option1.xAxis.data = _.map(data,'EDITION');
		option1.series[0].data = _.map(data,'GS');
		chart1.setOption(option1);
	}

	if (document.getElementById('chart-line')) {
		$('.chart-line-w').width(w/n*100+'%');
		$('.chart-line-w').append(':'+w);
		$('.chart-line-d').width(d/n*100+'%');
		$('.chart-line-d').append(':'+d);
		$('.chart-line-l').width(l/n*100+'%');
		$('.chart-line-l').append(':'+l);
	}

	if (document.getElementById('chart-2')) {
		var chart2 = echarts.init(document.getElementById('chart-2'));
		option2.yAxis.data = _.map(data,'EDITION');
		option2.legend.data = ['W','D','L'];
		option2.series[0].data = _.map(data,'W');
		option2.series[1].data = _.map(data,'D');
		option2.series[2].data = _.map(data,'L');
	}


	chart2.setOption(option2);

	option3.xAxis.data = _.map(data,'EDITION');
	option3.series[0].data = _.map(data,'GS');
	option3.series[1].data = _.map(data,'GA');
	option3.series[2].data = _.map(data,'GAA');
	option3.series[3].data = _.map(data,'GSA');
	chart3.setOption(option3);


	//下拉选项
	var option = _.map(data,'EDITION')
	$("#select-EDITION").append(_.map(option,function(d){
		return '<option value="'+d+'">'+d+'</option>';
	}).join(''));

	var chart4 = echarts.init(document.getElementById('chart-4'));
	//var o = _.find(data,{'EDITION':$(this).val()});
		chart4.setOption(creatOpt4(w,d,l));

	$("#select-EDITION").on('change',function(){
		var o = _.find(data,{'EDITION':$(this).val()});
		chart4.setOption(creatOpt4(o.W,o.D,o.L));
	});

}

function creatOpt4(w,d,l){
	option4.series[0].data = [
		{value:w,name:'W'},
		{value:d,name:'D'},
		{value:l,name:'L'}
	];
	return option4
}


//获取url参数
function getQueryString(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
   var r = window.location.search.substr(1).match(reg);
   if (r!=null) return (r[2]); return null;
}

//百分比
function Percentage(num, total) { 
    return (Math.round(num / total * 100) + "%");// 小数点后两位百分比
   
}

var option1 = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['Goals Scored'],
        textStyle: {color: "#fff"}
    },
    grid: {
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        },
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        },
    },
    series: [
        {
            name:'Goals Scored',
            type:'line',
            stack: 'time',
            data:[]
        }
    ]
};

var option2 = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: [],
        textStyle: {color: "#fff"}
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value',
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        },
    },
    yAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        }
    },
    series: [
        {
            name: 'W',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: 'D',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: 'L',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: []
        }
    ]
};

var option3 = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['GOALS SCORED','GOALS AGAINST','GOALS AGAINST AVERAGE','GOALS SCORED AVERAG'],
        textStyle: {color: "#fff"}
    },
    grid: {
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        },
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            textStyle: {
            	color:'#fff'
            }
        },
    },
    series: [
    	{
            name:'GOALS SCORED',
            type:'line',
            stack: 'time',
            data:[]
        },
        {
            name:'GOALS AGAINST',
            type:'line',
            stack: 'time',
            data:[]
        },
        {
            name:'GOALS AGAINST AVERAGE',
            type:'line',
            stack: 'time',
            data:[]
        },
        {
            name:'GOALS SCORED AVERAG',
            type:'line',
            stack: 'time',
            data:[]
        }
    ]
};

var option4 = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
         textStyle: {color: "#fff"},
        data: ['W','D','L']
    },
    series : [
        {
            name: 'world cup',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
