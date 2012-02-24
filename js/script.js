/**
 * CinemaDeNolan
 * Author: Martin Richard - martius@martiusweb.net
 */

(function($) {

// New namespace
$.msw = {};

/**
 * Parallax
 */
$.msw.Parallax = function(elt, args) {
/*
  this.velocity = args.velocity;
//*/
  this.position = elt.css("right");
  this.element = elt;
};
/*
var transitionPropertyPrefix = Modernizr.prefixed("transition");
//*/
$.msw.Parallax.prototype.commit = function(newPos) {
  /*
  var duration = Math.round(1000 * (Math.abs(this.position - newPos)) / this.velocity);
  this.element.css(transitionPropertyPrefix + "Duration", duration + 'ms');
  //*/
  this.element.css('right', newPos + 'px');
  this.position = newPos;
};

/**
 * Timeline
 */
$.msw.Timeline = function(eltId, args) {
  var self = this;
  this.elt = $(eltId);
  this.list = $(this.elt.children(args.listSelector)[0]);
  this.items = $.map(this.list.children(), function(e) { return $(e); });
  
  if(typeof(args.itemWidth) !== "function") {
    this.itemWidth = function() { return args.itemWidth; };
  }
  else
    this.itemWidth = args.itemWidth;

  this.parallax = new $.msw.Parallax(this.list, args);

  this.position = 0;

  // Set timeline styles and size
  this.list.addClass("parallax_moving");
  this.setWidth();

  if(args["autoResize"]) {
    $(window).resize(function() {
      self.setWidth();
    });
  }
};

$.msw.Timeline.prototype.setWidth = function() {
  this.list.css("width", (this.items.length * this.itemWidth()) + "px");
  for(var i = 0; i < this.items.length; ++i) {
    this.items[i].css("width", this.itemWidth() + "px");
  }
};

$.msw.Timeline.prototype.moveTo = function(pos) {
  if(pos < 0 || this.items.length <= pos) // position is out of bounds
    return;
  this.parallax.commit(pos * this.itemWidth());
  this.position = pos;
};

$.msw.Timeline.prototype.next = function() {
  this.moveTo(this.position+1);
};

$.msw.Timeline.prototype.previous = function() {
  this.moveTo(this.position-1);
};

/**
 * Bootstrap
 */
var Nolan = function() {
  // Determine the page according to body id
  this.id = document.body.id;

  // Initialize the page
  if(typeof(this[this.id]) === "function")
    this[this.id]();
};

Nolan.prototype.home = function() {
  // Make functions detection and stuff like that
  // - transitions : required
};

Nolan.prototype.bio = function() {
  var self = this;
  this.indexOf = {};
  /* elements subjects to the parallax effect must be contained in a block of
   * 100% width with hidden overflow. */

  this.timeline = new $.msw.Timeline("#timeline", {
    listSelector: "ol",
    itemWidth: 350,
/*    velocity: 200, // px/s */
  });

  // Position scene elements
  var width = parseInt($("#scene").innerWidth());
  this.scene = new $.msw.Timeline("#scene", {
    listSelector: "div",
    itemWidth: function() { return parseInt($("#scene").innerWidth()); },
    autoResize: true,
/*    velocity: 800, */
  });

  // Enable previous/next buttons
  $(".prev").each(function() {
    $(this).click(function() {
      self.timeline.previous();
      self.scene.previous();
    });
  });
  $(".next").each(function() {
    $(this).click(function() {
      self.timeline.next();
      self.scene.next();
    });
  });

  // direct links in timeline
  var directAccess = $("#timeline a");
  for(var i = 0; i < directAccess.length; ++i) {
    var link = directAccess[i].href.slice(directAccess[i].href.indexOf('#'));
    this.indexOf[link] = i;
    $(directAccess[i]).click(function(e) {
      var index = self.indexOf[this.href.slice(this.href.indexOf('#'))];
      self.timeline.moveTo(index);
      self.scene.moveTo(index);
      e.stopImmediatePropagation();
    });
  }

  // Position to element if defined in url
  if(location.hash && this.indexOf[location.hash]) {
    var index = this.indexOf[location.hash];
    self.timeline.moveTo(index);
    self.scene.moveTo(index);
  }
};

$.msw.Nolan = Nolan;

})(jQuery);

jQuery(document).ready(function() {
  var n = new jQuery.msw.Nolan();
});
