"use strict";

var site_title = "";
var page_title = "";
var menu_links = [];
var resizeEvent = new Event('resize');


function loadPage(link){
  if ($(window).width() > 980){var delay = 600;}
  else {var delay = 0}

  $(".roundy-panel-dynamic .roundy-container").clearQueue();
  $(".roundy-panel-dynamic .roundy-container").removeClass("active");

  $(".roundy-panel-dynamic .roundy-container").stop().delay(delay).queue(function() {

    $.ajax({
      url: link,
      dataType : "html",
      beforeSend: function(){
          $(".roundy-panel-dynamic .roundy-loader").addClass("roundy-active");

      },
      success: function (data) {
          $(".roundy-panel-dynamic .roundy-container .roundy-container-content").empty();
          roundySetColor('var(--theme-default)');
          $(".roundy-panel-dynamic .roundy-container .roundy-container-content").html(data);
      },
      complete: function(){
          $(".roundy-panel-dynamic .roundy-loader").removeClass("roundy-active");
          $(window).scrollTop(0);
          Activate_content();
      },
      error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = '<b>Error 404</b>  Requested page not found.';
        } else if (jqXHR.status == 500) {
            msg = '<b>Error 500</b> Internal Server Error.';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }

        roundySetColor('var(--theme-default)');
        $(".roundy-panel-dynamic .roundy-container .roundy-container-content").html(msg);
      }
    });
  });
}

function setPosition(item, angle, fulldiameter){
  var itemDistance = 0.33 * fulldiameter;
  var px = Math.cos(angle)*itemDistance + fulldiameter/2;
  var py = Math.sin(angle)*itemDistance + fulldiameter/2;
  item.css("top", py+"%");
  item.css("left", px+"%");
  item.css("opacity", 1);
}

function Regulation(count){
  var num = 0;
  $(".roundy-menu .roundy-menu-item").each(function(){
    var item = $(this);
    var angle = 360*Math.PI/180/count*num;
    var fulldiameter = $(".roundy-menu").width(); //width(height) of menu circle

    setPosition(item, angle, 100);

    menu_links[num] = item.attr('href');
    num++;
  });
}

function Rotate(item, angle){
  var angledeg = 'rotate(' + angle + 'deg)';
  item.css({
    "-webkit-transform": angledeg,
    "-moz-transform": angledeg,
    "-o-transform": angledeg,
    "-ms-transform": angledeg,
    "transform": angledeg
  });
}

function MakeMenu(itemsCount){
  Regulation(itemsCount);
  Rotate($("#roundy-menu-pie .roundy-menu-pie-quarter"), Math.floor(180 - 360/itemsCount));
}

function Activate_content() {
  $(".roundy-panel-dynamic .roundy-container").stop().delay(0).queue(function(){ $(this).addClass("active") });
  $("title").text(page_title + " | " + site_title);
}

function GotoLink(hashlink, countMenuItems){
  for (var i = 0; i < menu_links.length; i++){
    if (hashlink === menu_links[i]) {
      $(".roundy-menu .roundy-menu-item").eq(i).addClass("active");
      Rotate($("#roundy-menu-pie"), (360 / countMenuItems / 2)+(360 / countMenuItems * i));
      break;
    } else {
      Rotate($("#roundy-menu-pie"), (360 / countMenuItems / 2)+(360));
    }
  }
  loadPage(hashlink);
  window.location.hash = hashlink;
}

let root = document.documentElement;

function roundySetColor(color){
  root.style.setProperty('--theme-hl', color);
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function roundyMenuToggle() {
  $('#roundy-menu-toggle').toggleClass('roundy-active');
  $('#roundy-panel-fixed').toggleClass('roundy-menu-opened');
}

function roundyMenuClose() {
  $('#roundy-menu-toggle').removeClass('roundy-active');
  $('#roundy-panel-fixed').removeClass('roundy-menu-opened');
}

$(window).on("load", function(){

  var countMenuItems = $(".roundy-menu .roundy-menu-items > .roundy-menu-item").length;

  $("a[href^='./']").on("click", function(e){
    if(!$(this).hasClass("roundy-external")){
    var anchor = $(this);
    var locate =  $.attr(this, 'href');
    window.location.hash = locate;
    }
  });

  $(".roundy-menu").on("click", ".roundy-menu-item", function(){

    if($(this).hasClass("roundy-external")){
        return true;
    }

    roundyMenuClose();

    if(!$(this).hasClass("active")){
      if(!$(this).hasClass("roundy-bigpage")){
          $(".roundy-body").removeClass("roundy-bigpage");
          Rotate($("#roundy-menu-pie"), (360 / countMenuItems / 2)+(360 / countMenuItems * $(this).index()));
      } else {
          $(".roundy-body").addClass("roundy-bigpage");
      }

      page_title = $(this).text();
      $(".roundy-menu .active").removeClass("active");
      $(this).addClass("active");
      loadPage($(this).attr("href"));
      return false;
    }
    else{
    	return false;
    }
  });

  $(".roundy-panel-dynamic .roundy-container").on("click", "a[href^='./']", function(){
      var currentLinkHref = $(this).attr('href');
      $(".roundy-menu .active").removeClass("active");

      if(!$(this).hasClass("roundy-bigpage")){
          $(".roundy-body").removeClass("roundy-bigpage");
        } else {
          $(".roundy-body").addClass("roundy-bigpage");
        }

      for (var i = 0; i < menu_links.length; i++){
        if (currentLinkHref === menu_links[i]) {
          $(".roundy-menu .roundy-menu-item").eq(i).addClass("active");
          Rotate($("#roundy-menu-pie"), (360 / countMenuItems / 2)+(360 / countMenuItems * i));
          break;
        }
      }

      loadPage($(this).attr('href'));

      var anchor = $(this);
      var locate =  $.attr(this, 'href');
      window.location.hash = locate;


      return false;
  });

  MakeMenu(countMenuItems);

  var hashlink = window.location.hash;
  hashlink = hashlink.substr(1);
  if (hashlink == ''){
    hashlink = $(".roundy-menu .roundy-menu-item:first").attr('href');
  }

  GotoLink(hashlink, countMenuItems);

  if (!site_title){
  	site_title = $("title").text();
  }

  var typedOptions = {
    strings: ["Template for your great resume.",
              "For copywriters, developers, designers, and any other creative persons.",
              "Made with <i class='far fa-heart'></i>."],
    typeSpeed: 50,
    loop: true,
    //shuffle: true,
    smartBackspace: true,
    backDelay: 5000
  }

  var typed = new Typed(".roundy-menu-subtitle span", typedOptions);

  $('#roundy-menu-toggle').on('click', function(){
    roundyMenuToggle();
  });

  $('#roundy-controls-toggle').on('click', function(){
    $('#roundy-controls').toggleClass('active');
  });

  $('#roundy-dark-toggle').on('click', function(){
    $('body').toggleClass('roundy-mode-dark');
    $(this).toggleClass('active');
  });

  $('#roundy-bigpage-toggle').on('click', function(){
    $('.roundy-body').toggleClass('roundy-bigpage');
    window.dispatchEvent(resizeEvent);
  });

  $('#roundy-bg-image-toggle').on('click', function(){
    $('#roundy-bg-image').toggleClass('roundy-hidden');
    $(this).toggleClass('active');
  });

  $('#roundy-bg-video-toggle').on('click', function(){
    $('#roundy-bg-video').toggleClass('roundy-hidden');
    $(this).toggleClass('active');
  });
});

$(window).on("hashchange", function(){
  var countMenuItems = $(".roundy-menu .roundy-menu-items > .roundy-menu-item").length;
  var hashlink = window.location.hash;
  hashlink = hashlink.substr(1);
  if (hashlink == ''){
    hashlink = $(".roundy-menu .roundy-menu-item:first").attr('href');
  }

  GotoLink(hashlink, countMenuItems);
});
