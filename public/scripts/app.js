$('document').ready(function () {


let formCount = 2;
let fieldID = 2;

// NEW FORM ELEMENT
$('.fa-plus-square').on('click', event => {
  event.preventDefault();
  $('.emptyField').remove();

    let form1text = $('.choice1').val().length;
    let form2text = $('.choice2').val().length;
    let emptyFieldMessage = 'Please enter text';

        if (form1text === 0 || form2text === 0) {
          $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.pollItemContainer');

        } else {
          formCount++;
          fieldID++;
          let newfield = $('<input>').attr('name', 'newFormField' + formCount).attr('id', 'pollOptionID' + fieldID).appendTo('.pollItemContainer');
          console.log(newfield);
        }
  });


// COMPLETE FORM
$('#formSubmit').on('click', event => {
  event.preventDefault();
  let $valueOfFormFields = $('.formData').serializeArray();
  $.ajax({
    url: '/polls',
    method: 'POST',
    data: $valueOfFormFields,
    success: function (response) {
      console.log('working!')
    }
  });
});



$('.vote').on('click', event => {
  event.preventDefault();

  let voteItems = $('#sortable').children('li');

  for (let i = 0; i<voteItems.length; i++) {
      console.log(voteItems[i])

      //voteItems[i] logs
    }
  $.ajax({
    url: '/polls/show',
    method: 'POST',
    data:   ''     ,
    success: function (response) {
      console.log('working!')
    }
  });
});


// NAV-BAR CREATE BUTTON
$('.createpoll').on('click', event => {
  event.preventDefault();


        $.ajax({
             url: '/polls',
             method: 'POST',
             success: function (response) {}
         });
});

// VOTE SUBMISSION BUTTON
$('.votebutton').on('click', event => {
  event.preventDefault();

  //voting scores

        $.ajax({
             url: '/polls/:id',
             method: 'POST',
             data: scores,
             success: function (response) {}
         });
});

// DELETE BUTTON
$('.deletebutton').on('click', event => {
  event.preventDefault();

  //pollID

  $.ajax({
       url: '/polls/:id',
       method: 'DELETE',
       data: pollID,
       success: function (response) {}
   });
});

$('.registerbutton').on('click', event => {
  event.preventDefault();



  $.ajax({
       url: '/users',
       method: 'POST',
       success: function (response) {}
   });
});


});