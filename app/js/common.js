(function DOM() { // сразу при начале загрузки страницы задаем некоторые стили
    var item = $('.slider__item');
    var countItem = 3;

    item.each(function(i, el) {
            if(i >= 0 && i < countItem) {
                $(el).css({display: 'inline-block'});
            } else {
                $(el).css({display: 'none'});
            }
        });

    var boy1 = item.find('img[src="img/boy-1.png"]').parents('.slider__item'),
        boy2 = item.find('img[src="img/boy-2.png"]').parents('.slider__item');
    boy2.find('.slider__circle').css({border: '2px solid rgba(255, 255, 255, .7)'});
    boy2.css({width: '140px', height: '140px'});
    boy2.find('img[src="img/boy-2.png"]').css({height: '168px'});
    boy2.find('.slider__hidden').css({top: '-42px'});
}());

$(function() {
    var item = $('.slider__item'),
        items = $('.slider__items'),
        circle = $('.slider__circle'),
        right = $('.slider__button-right'),
        left = $('.slider__button-left');

    (function moseOverLeave() { // анимация про hover
        circle.mouseenter(function() {
        if(click > 0) return false; //если работает анимация hover не сработает
            $(this).find('img').css({bottom: '0'})
                                .animate({bottom: '-2px'}, 100);
        });
        circle.mouseleave(function() {
            if(click > 0) return false;
            $(this).find('img').css({bottom: '-10px'});
                                
        });
    }());

    var countItem = 3; //количество слайдеров на странице, для универсала не сделал
    
    var timeAnime = 1000, //назначаем время анимаций в мс, должно быть равно переменной $animate-time
        timePercent = timeAnime * 0.8; //80% для старта появления слайда

    var click = 0; // определяем по какой кнопке был клик, чтобы при быстром нажатии на левую и правую кнопку прокрутки небыло одновременных анимаций
    var rightClick = function(time, time80) { //клик по правой кнопке
        $(this).unbind('click'); //длаем заглушку на повторное нажатие
        time = timeAnime; 
        time80 = timePercent;
        if(click == 2) return false;
        click = 1;

        item = $('.slider__item'), //чтобы перезаписывался порядок слайдов
        items = $('.slider__items');

        item.eq(2).addClass('animateOutR');
        item.eq(2).animate({'left': '100%', opacity: '0'}, time)
                .fadeOut()
                .queue(function() {
                    $(this).removeClass('animateOutR');
                    $(this).dequeue();
                });


        function fadeInItem() {
            item.first().addClass('leftR');
            item.eq(1).addClass('centerR');
            item.last().prependTo(items)
                        .css({display: 'inline-block'})
                        .addClass('animateInR');

            var C = true; // чтобы функция setInterval сработала только один раз 
            function calcPosIn() {
                if( item.last().offset().left >= item.first().offset().left - 146 && C == true ) { 
                    item.first().addClass('animate2R'); 
                    item.eq(1).addClass('animate3R'); 
                    C = false;
                }
            }
            setInterval(calcPosIn);

            item.last().animate({opacity: '1'}, time, 
                (function() {
                    right.bind('click', rightClick);
                })).queue(function() {
                        click = 0;
                        $(this).css({left: 'calc(50% - 186px - 73px)'});
                        $(this).removeClass('animateInR');
                        item.first().removeClass('leftR animate2R').css({left: 'calc(50% - 73px)'});
                        item.eq(1).removeClass('centerR animate3R').css({left: 'calc(50% + 186px - 73px)'});
                        $(this).dequeue();
                    });
        }
        setTimeout(fadeInItem, time80);
    }
        right.bind('click', rightClick);

    var leftClick = function(time, time80) { //клик по левой кнопке
        if(click == 1) return false;
        click = 2;
        time = timeAnime; 
        time80 = timePercent;

        $(this).unbind('click'); //длаем заглушку на повторное нажатие

        item = $('.slider__item'), //чтобы перезаписывался порядок слайдов
        items = $('.slider__items');

        item.first().addClass('animateOutL');
        item.first().animate({left: '-186px', opacity: '0'}, time)
                  .fadeOut()
                  .queue(function() {
                    $(this).removeClass('animateOutL');
                    $(this).appendTo(items);
                    $(this).dequeue();
                  });

        function fadeInItem() {
            // item.eq(2).addClass('rightL');
            // item.eq(1).addClass('centerL');
            item.eq(3).css({display: 'inline-block'})
                .addClass('animateInL');

            var C = true; // чтобы функция setInterval сработала только один раз 
            function calcPosIn() {
                if( item.eq(3).offset().left <= item.eq(2).offset().left + 146 && C == true ) { 
                    item.eq(1).addClass('animate2L'); 
                    item.eq(2).addClass('animate3L'); 
                    C = false;
                }
            }
            setInterval(calcPosIn);

            item.eq(3).animate({opacity: '1'}, time, 
                (function() {
                    left.bind('click', leftClick);
                })).queue(function() {
                        click = 0;
                        $(this).css({left: 'calc(50% + 186px - 73px)'});
                        $(this).removeClass('animateInL');
                        item.eq(2).removeClass('rightL animate3L').css({left: 'calc(50% - 73px)'});
                        item.eq(1).removeClass('centerL animate2L').css({left: 'calc(50% - 186px - 73px)'});
                        $(this).dequeue();
                    });
        }
        setTimeout(fadeInItem, time80);
    }
    left.bind('click', leftClick);
        
});