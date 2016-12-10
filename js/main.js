"use strict";

$(document).ready(function() {


    resizeSearchBox();

    function resizeSearchBox() {
        let searchBoxWidth = $('.input-area').innerWidth() - $('.input-area .searchOptions').outerWidth() - $('.input-area .search-btn').outerWidth() - 52 + 'px'
        $('.input-area .searchBox').width(searchBoxWidth);
    }

    $(window).resize(function() {
        resizeSearchBox();
    });

});
