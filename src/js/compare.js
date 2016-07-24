$().ready(function(){

	//初始化overview
	$.get('localdata/teams_data.json', function (teamsJson) {
		initOverview(teamsJson);
	});

	//初始化下拉选择
	$(".team_choose select").html($("#template-option-teams").html());

});

function initOverview(teamsJson){
	$('#menu-overview').on('click',function(){
		$("#overview").toggle(1000);
	});
	//var $segment = $(".js-segment");
	_.each(teamsJson, function(item){
		var selector = ".js-segment-"+item.TEAM.substring(0,1).toUpperCase();
		//console.log(selector)
		$(selector).append('<li><span class="flag-wrap"><img src="images/flags/'+item.TEAM.substring(0,3).toLowerCase()+'.png" class="flag"></span><a class="text" href="detai.html?"> '+item.TEAM+'</a></li>')
	});
}