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
    for(i=0; i<data.notes.length; i++) {
     console.log(data.notes[i]._id);
     $('.comment-window').append('<div class="comment-item" data-id="'+data.notes[i]._id+'">'+data.notes[i].body+'<form class="remove-note" action="/delete/'+data.notes[i]._id+'" method="POST"><input type="hidden" name="note"><button class="btn btn-danger note-del-btn" data-btnID="'+data.notes[i]._id+'" type="submit"><i class="fa fa-trash-o" aria-hidden="true"></i></button></form></div>');
     }
  });
});

// $(document).on('click','.note-del-btn', function(){
//   var thisId = $(this).attr('data-btnID');
//   //$('.comment-window').empty();
//
//   //ajax
//   $.ajax({
//     method: 'POST',
//     url:'/delete/' + thisId
//   })
//   .done(function(data){
//     console.log(data);
//     for(i=0; i<data.notes.length; i++) {
//      console.log(data.notes[i]._id);
//      $('.comment-window').append('<div class="comment-item" data-id="'+data.notes[i]._id+'">'+data.notes[i].body+'<form class="remove-note" action="/delete/'+data.notes[i]._id+'" method="POST"><input type="hidden" name="_id"><button class="btn btn-danger note-del-btn" data-btnID="'+data.notes[i]._id+'" type="submit"><i class="fa fa-trash-o" aria-hidden="true"></i></button></form></div>');
//      }
//   });
// });
