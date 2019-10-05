// $(document).on('click','.items', function(){
// 	var categoryName = $(this).data('id');
// 	$('.modal-title').text(categoryName);
// 	var itemL = <%= item_list %>
// 	for(var key in itemL){
// 		if(key==categoryName){
// 			$('.modal-body .card-title').text(itemL[key][0].item_name);
// 		}
// 	}
// });