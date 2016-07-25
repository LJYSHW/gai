//全局数据
var teamData = [],
	matchesdata = [];
var chartPie = null;

var pieOption =  {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {color: "#fff"},
        data: ['DRAW','TEAM1 WIN','TEAM2 WIN']
    },
    series : [
        {
            name: '胜率',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'NO DATA'}
            ],
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

$().ready(function(){

	$.get('localdata/teams_flag.json', function (teamsJson) {
		teamData = teamsJson;
		//初始化overview
		initOverview(teamsJson);
		//初始化下拉选择
		initSelector($(".team_choose select"),teamsJson);
	});

	$.get('localdata/matchesdata.json',function(data){
		matchesdata = data;
		if ($(".team_choose select").filter(function(d){return $(this).val() == 'none'}).length == 0) {
			refreshTable();
		}
	});

	//选择不重复
	$(".team_choose select").on('change',function(d){
		var $this =  $(this);
		var val = $this.val();

		if (val != 'none' && $(".team_choose select").filter(function(d){return $(this).val() == val}).length >1) {
			//console.log(false);
			alert('You cannot choose the same team')
			$this.val('none');
			setTeamBox($this.closest('.team-box'),false,'Please choose another team');
		}else if(val != 'none'){
			var team = _.find(teamData, function(t){
				return t.team === val;
			});
			setTeamBox($this.closest('.team-box'),team.icon,team.team);
		}else{
			setTeamBox($this.closest('.team-box'),false,'选择球队');
		}

		//两边都有选中的时候
		if ($(".team_choose select").filter(function(d){return $(this).val() == 'none'}).length == 0) {
			if (matchesdata.length) {
				refreshTable();
			}else{
				alert('LOADING');
			}
		}
	});
	//初始化表格
	$('#datatable').DataTable({
		data:[],
		dom:'<T>',
		processing:false,
		columns:[
			{title:'EDITION',data:'EDITION'},
			{title:'DATE',data:'DATE'},
			{title:'TEAM1 GOALS',data:'T1G'},
			{title:'TEAM2 GOALS',data:'T2G'}
		]
	});

	chartPie = echarts.init(document.getElementById('chart-pie'));
	chartPie.setOption(pieOption);
});


function setTeamBox($teambox,img,name){
	if (img) {
		$teambox.find('.team-flag').show();
		$teambox.find('.team-flag').attr('src','images/flags/'+img);
	}else{
		$teambox.find('.team-flag').hide();
	}

	$teambox.find('.team-name').text(name);
	
}

function resetPie(arr){
	var p = g1 = g2 = 0;
	_.each(arr, function(it){
		if (it.T1G == it.T2G) {p++;}
		else if (it.T1G > it.T2G) {g1++;}
		else{g2++;}
	});
	//var sun = p+g1+g2;
	pieOption.series[0].data = [
		{value:p,name:'DRAW'},
		{value:g1,name:'TEAM1 WIN'},
		{value:g2,name:'TEAM2 WIN'}
	];

	chartPie.setOption(pieOption);
}

function refreshTable(){
	var teamName1 = $(".zd select").val().toUpperCase();
	var teamName2 = $(".kd select").val().toUpperCase();
	var dt = $('#datatable').DataTable();
	dt.clear();
	var arr = _.filter(matchesdata,function(item){
		isok = false;
		if ((item.TEAM1 == teamName1 && item.TEAM2 == teamName2)) {
			isok = true;
		}
		if ((item.TEAM1 == teamName2 && item.TEAM2 == teamName1)) {
			isok = true;
			var tg = item.T1G;
			item.T1G =  item.T2G;
			item.T2G = tg;
		}
		return isok;
	});

	
	if (!arr.length) {
		alert('There is not matches data between the two teams.');
	}else{
		resetPie(arr); //重绘饼图
		dt.rows.add(arr).draw();//重绘表格
	}
}
