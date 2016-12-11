"use strict";
$(document).ready(function() {

    // Resize searchBox to fill input-area
    function resizeSearchBox() {
        let searchBoxWidth = $('.input-area').innerWidth() - $('.input-area .search-btn').outerWidth() - 40 + 'px'
        $('.input-area .searchBox').width(searchBoxWidth);
    }
    resizeSearchBox();
    $(window).resize(function() {
        resizeSearchBox();
    });
    // Resize searchBox to fill input-area



    function oDict(wordList, lookUpURL) { // dictionary object
      this.wordList = wordList;
      this.lookUpURL = lookUpURL;
    }

    var dictionary = new oDict(); // dictionary global var

    // loadDictionary from json file
    function loadDictionary(dictURL) {
      $.ajax({url: dictURL,
      dataType: "json",
      success: function(result) {
           dictionary.lookUpURL = result.lookUpURL;
           dictionary.wordList = result.wordList;

           // Load Quick Search
           $( ".searchBox" ).autocomplete({
             source: dictionary.wordList,
             select: function( event, ui ) {
                  findWord(ui.item.value, dictionary.lookUpURL);
             }
           });
      }, error: function(xhr) {
          $('.result-area').html('<p class="error bg-grey">Lỗi nạp từ điển. Mã lỗi: '+xhr.status+'</p>');
      }});
    }

    // init dictionary database
    loadDictionary('word-data/math-dict.json');


    // Show found word on screen
    function showWord(word) {

      let html = '<div class="word">';
      html += '<span class="txt-blue">'+word.word+'</span>';
      if (word['us-voice'] != undefined) {html +=  ' <span class="gr">us</span> /'+word['us-voice']+'/'};
      if (word['uk-voice'] != undefined) {html +=  ' <span class="gr">uk</span> /'+word['uk-voice']+'/'};
      html += '</div>';
      let wordClasses = {
        "noun" : "Danh từ",
        "verb" : "Động từ",
        "adjective" : "Tính từ",
        "adverb" : "Trạng từ",
        "pronoun" : "Đại từ",
        "preposition" : "Giới từ",
        "conjunction" : "Liên từ",
        "determiner" : "Định từ",
        "exclamation" : "Thán từ"
      }

      for (var wordClass in wordClasses) {
         if (word.hasOwnProperty(wordClass)) {
            html += '<p class="word-class bg-grey">'+wordClasses[wordClass]+'</p>';
            let definitions = word[wordClass];
            for (var i = 0; i < definitions.length; i++) {

                html += '<p class="meaning left-green">'
                if (definitions[i].hasOwnProperty('more-info')) {
                  html += '(' + definitions[i]['more-info'] + ') ';
                }
                html+= definitions[i]['definition'] +'</p>';

                if (definitions[i].hasOwnProperty('examples')) {
                  var examples = definitions[i]['examples'];
                  for (var j = 0; j < examples.length; j++) {
                    html += '<p class="example">';
                    html += '<span class="lang1">'+examples[j].lang1+'</span><br><span class="lang2">'+examples[j].lang2+'</span>';
                    html += '</p>';
                  }
                }
            }
         }
      }
      $('.result-area').html(html);
    }

    function findWord(word, lookUpURL) {
      let filename = word.replace(/[^a-z]/gi, '').toLowerCase();
      $.ajax({url: lookUpURL+filename+'.json',
      dataType: "json",
      success: function(result) {
          showWord(result);
      }, error: function(xhr) {
          if (xhr.status == 404) {
              $('.result-area').html('<p class="error bg-grey">Không tìm thấy từ mà bạn yêu cầu.</p>');
          } else {
              $('.result-area').html('<p class="error bg-grey">Có lỗi xảy ra. Mã lỗi: '+xhr.status+'</p>');
          }
      }});
    }

    $('.search-btn').on('click', function(){
       console.log($('.searchBox').val());
       findWord($('.searchBox').val(), dictionary.lookUpURL);
    });

    // Keyboard handle
    $(".searchBox").keypress(function(e){
        if (e.which == 13) // Press Enter to search
        {
            findWord($('.searchBox').val(), dictionary.lookUpURL);
        };
    });


});
