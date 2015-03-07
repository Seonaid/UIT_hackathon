$(function(){
	$('.connect').on('click', function(){
		var title = $(this).data('name');

		addConnect(title);
	});
});

function addConnect(title)
{

	alert(title + " from function");
}