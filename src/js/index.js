$().ready(function(){
	var worldMap = echarts.init(document.getElementById('world-map'));
	var option = {
	    title: {
	        //text: 'World Map',
	        subtext: 'World Map',
	        //sublink: 'http://esa.un.org/wpp/Excel-Data/population.htm',
	        left: 'center',
	        top: 'top'
	    },
	   /* tooltip: {
	        trigger: 'item',
	        formatter: function (params) {
	            var value = (params.value + '').split('.');
	            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
	                    + '.' + value[1];
	            return params.seriesName + '<br/>' + params.name + ' : ' + value;
	        }
	    },*/
	    toolbox: {
	        show: true,
	        orient: 'vertical',
	        left: 'right',
	        top: 'center',
	        feature: {
	            dataView: {readOnly: false},
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    series: [
	        {
	            //name: 'World Population (2010)',
	            type: 'map',
	            mapType: 'world',
	            roam: true,
	            label:{
	            	normal:{
	            		show:true,
	            		textStyle:{
	            			color:'#31BBB1'
	            		}
	            	}
	            },
	            itemStyle:{
	            	color:'#23F3BD',
	                emphasis:{label:{show:true}}
	            },
	            data:[]
	        }
	    ]
	};

	$.get('assets/echarts/world.json', function (worldJson) {
		//绘制地图
		echarts.registerMap('world', worldJson);


		$.get('localdata/teams_data.json', function (teamsJson) {
			
		   	option.series[0].label.normal.formatter = function(params){
		   		var team = _.find(teamsJson, function(item){
		   			return params.name.toUpperCase() === item.TEAM;
		   		});
		   		//console.log(team);
		   		return !!team? team['name']:' ';
		   	}

			worldMap.setOption(option);
			$.get('localdata/teams_flag.json', function (teamsFlag) {
				//初始化overview
				initOverview(teamsFlag);
				drawTable(teamsJson,teamsFlag);
			});
			
			
		});
	});

	

	
});


function drawTable(teamsJson,teamsFlag){
	//初始化表格

	$("#team-table").DataTable({
		data:teamsJson,
		columns:[
			{title:'NO',data:'NO'},
			{title:'TEAM',data:'TEAM'},
			{title:'MATCHES PLAYED',data:'MATCHES PLAYED'},
			{title:'WINS',data:'WINS'},
			{title:'DRAWS',data:'DRAWS'},
			{title:'LOSSES',data:'LOSSES'}
		],
		columnDefs:[{
					render:function(data){
						var t = _.find(teamsFlag, function(name){
							return name.team.toUpperCase() === data;
						});
						console.log(t);
						return t? '<span class="flag-wrap"><img src="images/flags/'+t.icon+'" class="flag"></span><a href="detail.html?team='+data+'" class="text"> '+data+'</a>':'';
					},
					targets:1
				}]
	});
}





