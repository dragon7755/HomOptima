$(document).ready(function() {

  // Home hero input box add on click ========================
  $("#buyInp-box").on("click" , function(){
    $("body").toggleClass("isHero-active");
  });

  $(".mobiLIcon .mobileMenu").on("click" , function(){
    $("body").toggleClass("optimaBox");
  });
  $(".userLogin-icon .userLogin").on("click" , function(){
    $(".drop-U").toggle();
  });

    $('.searchSlider').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow:3,
        slidesToScroll:1,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint:768,
            settings: {
              slidesToShow: 1,
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });
      $('.deviceSlider').slick({
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        asNavFor: '.dailyBasis',
        arrows: false,
      });
      $('.dailyBasis').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        asNavFor: '.deviceSlider',
        arrows: false,
      });
      $('.userComment-slid').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow:3,
        slidesToScroll:1,
        leftArrow:false,
        ringhtArrow:false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });

});


  //scroll top adda and remove css on header ====================================== 
  
  $(window).scroll(function(){
    var sticky = $('.mainHeaer'),
        scroll = $(window).scrollTop(),
        headerHeight = $('.mainHeaer').outerHeight(); 
    if (scroll >= headerHeight) sticky.addClass('addNewOne');
    else sticky.removeClass('addNewOne');
  });