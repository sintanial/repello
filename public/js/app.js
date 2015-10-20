/**
 * Created by lena on 19.01.15.
 */
$(document).ready(function () {

  var lastDroppableOut = null;

  $(".chip").draggable({
    create: function () {
      $(this).data('position', $(this).position())
    },
    containment: ".playing_field",
    cursor: 'move',
    start: function () {
      $(this).stop(true, true)
    },
    stop: function () {
      if (lastDroppableOut != null) {
        snapToMiddle($(this), lastDroppableOut)
      }
    }
  });


  $('.field_item').droppable({
    drop: function (event, ui) {
      snapToMiddle(ui.draggable, $(this));
    },
    over: function () {
      lastDroppableOut = null;
    },
    out: function (event, ui) {
      lastDroppableOut = $(this);
    }
  });

});


function snapToMiddle(dragger, target) {

  var dragParent = dragger.parent();
  var topMove = target.position().top - dragParent.position().top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
  var leftMove = target.position().left - dragParent.position().left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
  dragger.animate({top: topMove, left: leftMove}, 600,  'easeOutBack', function () {
    target.append(dragger)
    dragger.css({
      top: 0,
      left: 0
    })
  });
}
