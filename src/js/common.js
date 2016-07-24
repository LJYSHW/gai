
function initOverview(teamsJson){
	$('#menu-overview').on('click',function(){
		$("#overview").toggle(500);
	});
	//var $segment = $(".js-segment");
	_.each(teamsJson, function(item){
		var selector = ".js-segment-"+item.team.substring(0,1).toUpperCase();
		//console.log(item.icon)
		$(selector).append('<li><span class="flag-wrap"><img src="images/flags/'+item.icon+'" class="flag"></span><a class="text" href="detail.html?TEAM='+item.team.toUpperCase()+'"> '+item.team+'</a></li>')
	});
}

function initSelector($selector,teamsJson){
	var group = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); //下拉选项分组

	groupStr ='<option value="none">Please choose one team</option>' +_.map(group, function(chart){
		return '<optgroup label="'+chart+'"></optgroup>';
	}).join('');

	$selector.html(groupStr);

	_.each(teamsJson, function(item){
		 var c = item.team.substring(0,1).toUpperCase();
		 $selector.find('optgroup[label='+c+']').append('<option value="'+item.team+'" data-icon="'+item.icon+'">'+item.team+'</option>')
	});

}