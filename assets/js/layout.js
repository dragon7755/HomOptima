
$(document).ready(function(){   
    $('.sliderCard').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow:1,
      slidesToScroll:1,
      arrows: true,
      });

      // js for agent page groth team section========================
      if (window.innerWidth < 768){
        $('.grothTeam').slick({
          dots: false,
          infinite: false,
          speed: 300,
          slidesToShow:1,
          slidesToScroll:1,
          arrows: true,
          });
      }   
      // js for agent page top rated mobile comment section========================
      if (window.innerWidth < 768){
        $('.feed-s').slick({
          dots: false,
          infinite: false,
          speed: 300,
          slidesToShow:1,
          slidesToScroll:1,
          arrows: true,
          });
      }  
      // $("plan-route-btn").on("click" , function(){
      //   console.log("tak")
      //   $(".plan-route-menu").toggle();
      // });
      
      //Cma dashboard comparable tab slick slider js start============
      $('#com-imgList11').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
        asNavFor: '#body-dataList11',
      }); 
      $('#body-dataList11').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
        asNavFor: '#com-imgList11',
      }); 
      $('#com-imgList12').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
        asNavFor: '#body-dataList12',
      }); 
      $('#body-dataList12').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
        asNavFor: '#com-imgList12',
      }); 
      // feature tab image slider js start=================
      $('#feature-img1').slick({
        dots: true,
        infinite:true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
      });
      $('#feature-img2').slick({
        dots: true,
        infinite:true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
      });
      $('#feature-img3').slick({
        dots: true,
        infinite:true,
        speed: 300,
        slidesToShow:1,
        slidesToScroll:1,
        arrows: false,
      });
      $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
        $('#com-imgList11').slick('setPosition');
        $('#body-dataList11').slick('setPosition');
        $('#com-imgList12').slick('setPosition');
        $('#body-dataList12').slick('setPosition');
        $('#feature-img1').slick('setPosition');
        $('#feature-img2').slick('setPosition');
        $('#feature-img3').slick('setPosition');
      });
});


