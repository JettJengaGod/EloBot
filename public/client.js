// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  $.get('/users', function(users) {
    users.forEach(function(user) {
      $('<li></li>').text(user[0] + " " + user[1]).appendTo('ul#users');
    });
  });
  $.get('/tusers', function(tusers) {
    tusers.forEach(function(tuser) {
      $('<li></li>').text(tuser[0] + " " + tuser[1]).appendTo('ol#tusers');
    });
  });
  $('form').submit(function(event) {
    event.preventDefault();
    const fName = $('input#fName').val();
    const lName = $('input#lName').val();
    $.post('/users?' + $.param({fName:fName, lName:lName}), function() {
      $('<li></li>').text(fName + " " + lName).appendTo('ul#users');
      $('input#fName').val('');
      $('input#lName').val('');
      $('input').focus();
    });
  });
});
