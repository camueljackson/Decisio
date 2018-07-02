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
    newfield = $('<input>').attr('name', 'newFormField' + formCount).attr('id', 'pollOptionID' + fieldID).addClass('form-control').appendTo('.pollItemContainer');

    let newfield = $('<input>').attr('name', 'newFormField' + formCount).attr('id', 'pollOptionID' + fieldID).addClass('form-control').appendTo('.pollItemContainer');

    // let newFormField = $('.form-control').val().length
    // if (newFormField === 0) {
    //   $('<div>').addClass('emptyField').text(emptyFieldMessage).appendTo('.pollItemContainer');
    // }
  }
});


// COMPLETE FORM
$('#formSubmit').on('click', event => {
  event.preventDefault();
  let $valueOfFormFields = $('.formData').serializeArray();
  let $valueOfEmailFields = $('#example_emailBS').val();
  let temp = JSON.parse($valueOfEmailFields)

  let output = {
    'form': $valueOfFormFields,
    'emails': temp
  }
  $.ajax({
    url: '/polls',
    method: 'POST',
    data: output,
    success: function (response) {

      let redirect = `localhost:8080/polls/${response}`

      $('.form')

      window.location.href = `${response}`
    }
  });
});


// VOTE SUBMISSION BUTTON
$('.vote').on('click', event => {
  event.preventDefault();

  // let voteItems = $('#sortable').text();
  let pollName = $('.poll_name_vote').text();
  let voteInfo = {};
  let options = [];
  voteInfo['name'] = pollName;

  $('ul > li').each(function() {
     options.push($(".entry", this) .text());
    });
  voteInfo['options'] = options;

  $.ajax({
    url: '/vote',
    method: 'POST',
    data: voteInfo,
    success: function (response) {
      // $('.vote').hide();
        }
  });
});

// DISPLAY POLLS ON EMAIL ENTRY
// $('.index_email').on('click', event => {
//   event.preventDefault();
//   let output = {};
//   output['email'] = $('.index_email_text').val();

//   $.ajax({
//     url: '/index',
//     method: 'POST',
//     data: output,
//     success: function (response) {
//     }
//   });
// });


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

(function( $ ){

  $.fn.multiple_emails = function(options) {

    // Default options
    var defaults = {
      checkDupEmail: true,
      theme: "Bootstrap",
      position: "top"
    };

    // Merge send options with defaults
    var settings = $.extend( {}, defaults, options );

    var deleteIconHTML = "";
    if (settings.theme.toLowerCase() == "Bootstrap".toLowerCase())
    {
      deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><span class="glyphicon glyphicon-remove"></span></a>';
    }
    else if (settings.theme.toLowerCase() == "SemanticUI".toLowerCase() || settings.theme.toLowerCase() == "Semantic-UI".toLowerCase() || settings.theme.toLowerCase() == "Semantic UI".toLowerCase()) {
      deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><i class="remove icon"></i></a>';
    }
    else if (settings.theme.toLowerCase() == "Basic".toLowerCase()) {
      //Default which you should use if you don't use Bootstrap, SemanticUI, or other CSS frameworks
      deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><i class="basicdeleteicon">Remove</i></a>';
    }

    return this.each(function() {
      //$orig refers to the input HTML node
      var $orig = $(this);
      var $list = $('<ul class="multiple_emails-ul" />'); // create html elements - list of email addresses as unordered list

      if ($(this).val() != '' && IsJsonString($(this).val())) {
        $.each(jQuery.parseJSON($(this).val()), function( index, val ) {
          $list.append($('<li class="multiple_emails-email"><span class="email_name" data-email="' + val.toLowerCase() + '">' + val + '</span></li>')
            .prepend($(deleteIconHTML)
             .click(function(e) { $(this).parent().remove(); refresh_emails(); e.preventDefault(); })
             )
            );
        });
      }

      var $input = $('<input type="text" class="multiple_emails-input text-left" />').on('keyup', function(e) { // input
        $(this).removeClass('multiple_emails-error');
        var input_length = $(this).val().length;

        var keynum;
        if(window.event){ // IE
          keynum = e.keyCode;
        }
        else if(e.which){ // Netscape/Firefox/Opera
          keynum = e.which;
        }

        //if(event.which == 8 && input_length == 0) { $list.find('li').last().remove(); } //Removes last item on backspace with no input

        // Supported key press is tab, enter, space or comma, there is no support for semi-colon since the keyCode differs in various browsers
        if(keynum == 9 || keynum == 32 || keynum == 188) {
          display_email($(this), settings.checkDupEmail);
        }
        else if (keynum == 13) {
          display_email($(this), settings.checkDupEmail);
          //Prevents enter key default
          //This is to prevent the form from submitting with  the submit button
          //when you press enter in the email textbox
          e.preventDefault();
        }

      }).on('blur', function(event){
        if ($(this).val() != '') { display_email($(this), settings.checkDupEmail); }
      });

      var $container = $('<div class="multiple_emails-container" />').click(function() { $input.focus(); } ); // container div

      // insert elements into DOM
      if (settings.position.toLowerCase() === "top")
        $container.append($list).append($input).insertAfter($(this));
      else
        $container.append($input).append($list).insertBefore($(this));

      /*
      t is the text input device.
      Value of the input could be a long line of copy-pasted emails, not just a single email.
      As such, the string is tokenized, with each token validated individually.

      If the dupEmailCheck variable is set to true, scans for duplicate emails, and invalidates input if found.
      Otherwise allows emails to have duplicated values if false.
      */
      function display_email(t, dupEmailCheck) {

        //Remove space, comma and semi-colon from beginning and end of string
        //Does not remove inside the string as the email will need to be tokenized using space, comma and semi-colon
        var arr = t.val().trim().replace(/^,|,$/g , '').replace(/^;|;$/g , '');
        //Remove the double quote
        arr = arr.replace(/"/g,"");
        //Split the string into an array, with the space, comma, and semi-colon as the separator
        arr = arr.split(/[\s,;]+/);

        var errorEmails = new Array(); //New array to contain the errors

        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

        for (var i = 0; i < arr.length; i++) {
          //Check if the email is already added, only if dupEmailCheck is set to true
          if ( dupEmailCheck === true && $orig.val().indexOf(arr[i]) != -1 ) {
            if (arr[i] && arr[i].length > 0) {
              new function () {
                var existingElement = $list.find('.email_name[data-email=' + arr[i].toLowerCase().replace('.', '\\.').replace('@', '\\@') + ']');
                existingElement.css('font-weight', 'bold');
                setTimeout(function() { existingElement.css('font-weight', ''); }, 1500);
              }(); // Use a IIFE function to create a new scope so existingElement won't be overriden
            }
          }
          else if (pattern.test(arr[i]) == true) {
            $list.append($('<li class="multiple_emails-email"><span class="email_name" data-email="' + arr[i].toLowerCase() + '">' + arr[i] + '</span></li>')
              .prepend($(deleteIconHTML)
               .click(function(e) { $(this).parent().remove(); refresh_emails(); e.preventDefault(); })
               )
              );
          }
          else
            errorEmails.push(arr[i]);
        }
        // If erroneous emails found, or if duplicate email found
        if(errorEmails.length > 0)
          t.val(errorEmails.join("; ")).addClass('multiple_emails-error');
        else
          t.val("");
        refresh_emails ();
      }

      function refresh_emails () {
        var emails = new Array();
        var container = $orig.siblings('.multiple_emails-container');
        container.find('.multiple_emails-email span.email_name').each(function() { emails.push($(this).html()); });
        $orig.val(JSON.stringify(emails)).trigger('change');
      }

      function IsJsonString(str) {
        try { JSON.parse(str); }
        catch (e) { return false; }
        return true;
      }

      return $(this).hide();

    });

};

})(jQuery);




    //Plug-in function for the bootstrap version of the multiple email
    $(function() {
      //To render the input device to multiple email input using BootStrap icon
      $('#example_emailBS').multiple_emails({position: "bottom"});
      //OR $('#example_emailBS').multiple_emails("Bootstrap");

      //Shows the value of the input device, which is in JSON format
      $('#current_emailsBS').text($('#example_emailBS').val());
//      $('#example_emailBS').change( function(){
//        $('#current_emailsBS').text($(this).val());

});


});