// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
$(function() {
  $.get('/users', function(tusers) {
    tusers.forEach(function(tuser) {
      $('<li></li>').text(tuser[0] + " " + tuser[1]).appendTo('ol#tusers');
    });

  });

});
