//click the note buttons
$(document).on('click','#noteBtn', function(){
  $('.comment-window').empty();
  //grab the id of the button
  var thisId = $(this).attr('data-id');
  console.log(thisId);
  console.log('url: /saved/' + thisId);

  //ajax
  $.ajax({
    method: 'GET',
    url:'/saved/' + thisId
  })
  .done(function(data){
    console.log(data);
    // for(i=0; i<data.length; i++) {
    //   console.log(data.note._id);
    // }
  });
});
