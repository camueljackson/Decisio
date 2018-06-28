$('document').ready(function () {

  let formCount = 0;

// NEW FORM ELEMENT
$('.fa-plus-square').on('click', event => {        // ADD NEW FORM BUTTON

  event.preventDefault();

  if (!$('.newFormText')) { // check for not extra field.  If there is NO NEW FIELD, go into 2nd ifs


    let form1text = $('.choiceA').val().length;
    let form2text = $('.choiceB').val().length;
    let emptyFieldMessage = 'Please enter text';

        if (form1text === 0 || form2text === 0) { // if no extra field, check that first 2 are filled. If not, error message
          $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.choiceForm');

        } else { // if no new box, first 2 field full, add new field

          $('<input>').addClass(`newFormText`).addClass(formCount).appendTo('.choiceForm');
        }

// If there IS A NEW FIELD, check value
    } else if ($('.newFormText') === 0) {
      $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.choiceForm');
    } else {
      $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.choiceForm');
    }

  });


   // ----------------------------

//     $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.choiceForm');
//   } else {        // if there is a 3rd form but it is no

//   }


//   } else {
//     let emptyFieldMessage;
//     $('.emptyField').remove();

//     let form1text = $('.choiceA').val().length;
//     let form2text = $('.choiceB').val().length;

//     emptyFieldMessage = 'Please enter text';

//     if (form1text === 0 || form2text === 0) {
//       $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.choiceForm');
//     } else {
//       console.log('working??')
//       formCount++;
//       $('<input>').addClass(`newFormText`).addClass(formCount).appendTo('.choiceForm');
//       }
//   }
// });


//COMPLETING FORM
        // $('.btn-primary').on('click', event => {

        //  event.preventDefault();

        //  let data = {
        //     title: $('.formTitle'),
        //     description: $('formDescription'),
        //     choiceA: $('choiceA'),
        //     choiceB: $('choiceB'),
        //  };


        //  for (let i = 0; i < formCount; i++) {
        //     data[i] = $(`.newFormText[i]`);
        //  };


        //  $.ajax({
        //       url: '/polls',
        //       method: 'GET',
        //       data: data,
        //       success: function (response) {
        //         console.log('it worked');
        //       }
        //     });
        //   });


  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;


});