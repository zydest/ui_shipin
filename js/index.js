/**
 * @author yue on 17/7/6.
 * @fileOverview
 */

$(document).ready(function () {
    var $container = $('.shelf-list').infiniteScroll({
        path: '/cards/page/{{#}}',
        append: '.shelf-item',
        status: '.scroller-status',
        checkLastPage : '.pagination__next'
    });

})