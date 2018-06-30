$('document').ready(function () {


let formCount = 0;

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
          let newfield = $('<input>').attr('name', 'newFormField' + formCount).appendTo('.pollItemContainer');
        }
  });


// SEND
$('.btn-primary').on('click', event => {
  event.preventDefault();

  let $valueOfFormFields = $('.formData').serializeArray();

  $.ajax({
    url: '/polls',
    method: 'POST',
    data: $valueOfFormFields,
    success: function (response) {
      console.log('working?')
    }
  });

});


// NAV-BAR CREATE BUTTON
$('.createpoll').on('click', event => {
  event.preventDefault();

        $.ajax({
             url: '/pollsredirect',
             method: 'POST',
             success: function (response) {
               window.location.href = "/polls"
             }
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
       
});