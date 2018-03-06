var main = {


    
}

$(document).ready(function(){
    // $(window).scroll(function () {
    //     if ($(this).scrollTop() >= 40) {
    //         $('.back-top').fadeIn();
    //         $('.header').addClass('scroll');
    //     } else {
    //         $('.back-top').fadeOut();
    //         $('.header').removeClass('scroll');
    //     }
    // });

    // $('.back-top').click(function () {
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 500);

    //     return false;
    // });
    $('.section1 .tabs .tab-item').on('click', function(){
        $(this).addClass('selected').siblings().removeClass('selected');
    });

    $('.menu li a').click(function (e) {
        e.preventDefault();
        $(this).addClass('selected').siblings().removeClass('selected');
        target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top
        },1000)
    });

    $('.mobil-menu').on('click', function(){
        $('.menu').slideToggle();
    });
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        }
    });
       
});
