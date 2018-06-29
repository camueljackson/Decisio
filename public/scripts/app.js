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


// $('.registerbutton').on('click', event => {
//   event.preventDefault();

//   let username = $("usernametext").val();
//   let email = $("emailtext").val();
//   let password = $("passwordtext").val();

//   let newUser = {
//    "username": username,
//    "email": email,
//    "password": password
//   };

//         $.ajax({
//              url: '/registration',
//              method: 'POST',
//              data: newUser,
//              success: function (response) {}
//          });
// });

// $('.loginbutton').on('click', event => {
//   event.preventDefault();

//   let email = $("emailtext").val();
//   let password = $("passwordtext").val();

//   let loginUser = {
//    "email": email,
//    "password": password
//   };

//         $.ajax({
//              url: '/login',
//              method: 'POST',
//              data: loginUser,
//              success: function (response) {}
//          });
// });

// $('.logoutbutton').on('click', event => {
//   event.preventDefault();


//         $.ajax({
//              url: '/logout',
//              method: 'POST',
//              success: function (response) {}
//          });
// });

  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;


});