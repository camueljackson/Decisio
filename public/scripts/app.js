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

// NAV-BAR REGISTER BUTTON
$('.registerbutton').on('click', event => {
  event.preventDefault();



  $.ajax({
       url: '/polls/:id',
       method: 'POST',
       success: function (response) {}
   });
});

// REGISTRATION PAGE REGISTER BUTTON
$('#registerbutton_submit').on('click', event => {
  event.preventDefault();

  let username = $("#registerUserName").val();
  let email = $("#registerEmail").val();
  let password = $("#registerPassword").val();

  let newUser = {
   "username": username,
   "email": email,
   "password": password
  };
  console.log(newUser);

  $.ajax({
       url: '/registration',
       method: 'POST',
       data: newUser,
       success: function (response) {
        window.location.href = "/polls"
       }
   });
});

// NAV-BAR LOGGIN BUTTON
$('.loginbutton').on('click', event => {
  event.preventDefault();



  $.ajax({
       url: '/polls/:id',
       method: 'POST',
       success: function (response) {}
   });
});

// LOGIN PAGE LOGIN BUTTON
$('#loginbutton_submit').on('click', event => {
  event.preventDefault();

  let email = $("#loginEmail").val();
  let password = $("#loginPassword").val();

  let loginUser = {
   "email": email,
   "password": password
  };

  $.ajax({
       url: '/login',
       method: 'POST',
       data: loginUser,
       success: function (response) {}
   });
});

// NAV-BAR LOGOUT
$('.logoutbutton').on('click', event => {
  event.preventDefault();


  $.ajax({
       url: '/logout',
       method: 'POST',
       success: function (response) {}
   });
});



});