/**
 * Created by majing on 2016/5/4.
 */

;$(function () {
    'use strict';
    console.log($.device);

    $(document).on("pageInit","#page-index", function(e, id, page) {
        console.log('首页');
        $(page).on('click','.open-donate', function () {
            $.popup('.popup-donate');
        });
        var bannerSwiper = new Swiper('.banner-swiper', {
            width : window.innerWidth,
            autoplay: 5000,
            pagination : '.banner-pagination',
        });

        $('.popup-donate .money .col-20').on('click',function () {
            $('.money .col-20').removeClass('select');
           $(this).closest('.col-20').addClass('select');
        });
        var AjaxInfinite = {
            getData: function (el,url,itemsPerLoad) {
                var _this = this;
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'json',
                    success: function(data){
                        _this.startLoad(
                            el,
                            data,
                            itemsPerLoad
                        );
                    },
                    error: function(xhr, type){
                        console.log('ajax error');
                    }
                })
            },
            startLoad: function (el, data, itemsPerLoad) {
                var _this = this;
                var loading = false;
                var itemsPerLoad = itemsPerLoad;
                var maxItems = data.length;
                if(maxItems <= itemsPerLoad){
                    _this.addItems(el,data,data.length,0);
                    $(el).find('.infinite-scroll-preloader').remove();
                    return;
                }else{
                    _this.addItems(el,data,itemsPerLoad,0);
                    var lastIndex = itemsPerLoad;
                    $(document).on('infinite', function() {
                        if (loading) return;
                        loading = true;
                        setTimeout(function() {
                            loading = false;
                            if (lastIndex > maxItems) {
                                $.detachInfiniteScroll($(el));
                                $(el).find('.infinite-scroll-preloader').remove();
                                return;
                            }else{
                                if(maxItems - lastIndex >= itemsPerLoad){
                                    _this.addItems(el,data,itemsPerLoad,lastIndex);
                                    lastIndex = $(el).find('li').length;
                                    $.refreshScroller();
                                }else{
                                    _this.addItems(el,data,maxItems - lastIndex,lastIndex);
                                    $.detachInfiniteScroll($(el));
                                    $(el).find('.infinite-scroll-preloader').remove();
                                    return;
                                }
                            }
                        }, 1000);
                    });
                }
            },
            addItems: function (el,data,number, lastIndex) {
                var html = '';
                for (var i = lastIndex; i < lastIndex + number; i++) {
                    html += '<li>\
                    <div class="user-container row no-gutter">\
                    <div class="col-20">\
                    <span class="user-img"><img src="'+ data[i].userheader +'" alt=""></span>\
                    </div>\
                    <div class="col-80 user-info">\
                    <h3>'+ data[i].username +'</h3>\
                    <p><i class="fa fa-heart-o"></i>今日行善<i class="num">'+ data[i].daynum +'</i>元 累计行善<i class="num">'+ data[i].days +'</i>天 总计<i class="num">'+ data[i].acount +'</i>元</p>\
                    </div>\
                    </div>\
                    </li>';
                }
                $(el).find('ul').append(html);
            }
        };
        var _HOST = window.location.host;

        AjaxInfinite.getData($('#tab1'),'http://'+_HOST + '/web-app/data.json',6);
    });

    $.init();
})