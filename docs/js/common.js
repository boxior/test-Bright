
$(function() { //стандартная функция JQuery при полной загрузки страницы
    var item = $('.slider__item'),
        items = $('.slider__items'),
        circle = $('.slider__circle'),
        right = $('.slider__button-right'),
        left = $('.slider__button-left'),
        countItem = 3, //количество слайдеров на странице
        timeAnime = 1000, //назначаем время анимаций в мс, должно быть равно переменной SASS $animate-time
        timePercent = timeAnime * 0.8, //80% для старта появления слайда
        click = 0; // определяем по какой кнопке был клик, чтобы при быстром нажатии на левую и правую кнопку прокрутки небыло одновременных анимаций
    // анимация при hover
    (function mouseEnterLeave() { 
        circle.mouseenter(function() {
        if(click > 0) return false; //если работает анимация,- hover не сработает
            $(this).find('img').css({bottom: '0'})
                                .animate({bottom: '-2px'}, 100);
        });
        circle.mouseleave(function() {
            if(click > 0) return false;
            $(this).find('img').css({bottom: '-10px'});
                                
        });
    }());
    //слайдер улетает
    function sliderOut(eq, leftPos, animateClass) {  
        item = $('.slider__item'), //чтобы перезаписывался порядок слайдов
        items = $('.slider__items');        
        item.eq(eq).addClass(animateClass);
        item.eq(eq).animate({'left': leftPos, opacity: '0'}, timeAnime)
                .fadeOut()
                .queue(function() {
                    $(this).removeClass(animateClass);
                    if(click == 2) {
                        $(this).appendTo(items);
                    }
                    $(this).dequeue();
                });
    }
    //слайдр прилетает
    function sliderIn(eq1, eq2, eq3, eq1Class, eq1Anim, eq2Class, eq2Anim, animClass, 
                    eq3LeftAfterAnim, eq2LeftAfterAnim, eq1LeftAfterAnim) { 
        item.eq(eq1).addClass(eq1Class);
        item.eq(eq2).addClass(eq2Class);
        item.eq(eq3).css({display: 'inline-block'})
                    .addClass(animClass);
                    if(click == 1) {
                        item.eq(eq3).prependTo(items);
                    }

        var C = true; // чтобы функция setInterval сработала только один раз 
        function calcPosIn() {
            if(click == 1) {
                if( item.eq(item.length-1).offset().left >= item.eq(0).offset().left - 146 && C == true ) { 
                    item.eq(eq1).addClass(eq1Anim); 
                    item.eq(eq2).addClass(eq2Anim); 
                    C = false;
                }
            }
            if(click == 2) {
                if( item.eq(3).offset().left <= item.eq(2).offset().left + 146 && C == true ) { 
                    item.eq(1).addClass('animate2L'); 
                    item.eq(2).addClass('animate3L'); 
                    C = false;
                }            
            }
        }
        setInterval(calcPosIn);

        item.eq(eq3).animate({opacity: '1'}, timeAnime).queue(function() {
                    click = 0;
                    $(this).css({left: eq3LeftAfterAnim});
                    $(this).removeClass(animClass);
                    item.eq(eq1).removeClass(eq1Class + ' ' + eq1Anim).css({left: eq1LeftAfterAnim});
                    item.eq(eq2).removeClass(eq2Class + ' ' + eq2Anim).css({left: eq2LeftAfterAnim});
                    $(this).dequeue();
                });
    }
    //клик по правой кнопке
    right.on('click',function() { 
        if(click != 0) { return false; }
        click = 1;

        sliderOut(2, '100%','animateOutR'); // функция улетания сайдера

        setTimeout(sliderIn, timePercent, 0, 1, item.length-1, 'leftR', 'animate2R', 'centerR',
                                        'animate3R', 'animateInR', 'calc(50% - 186px - 73px)',
                                        'calc(50% + 186px - 73px)', 'calc(50% - 73px)'); // функция прилетания слайдера
    });
    //клик по левой кнопке
    left.on('click', function() { 
        if(click != 0) { return false; }
        click = 2;

        sliderOut(0, '-186px', 'animateOutL'); // параметры eq(), leftPos, animateClass

        setTimeout(sliderIn, timePercent, 1, 2, 3, 'centerL', 'animate2L', 'rightL',
                                        'animate3L', 'animateInL', 'calc(50% + 186px - 73px)',
                                        'calc(50% - 73px)', 'calc(50% - 186px - 73px)'); // функция прилетания слайдера
    });

});