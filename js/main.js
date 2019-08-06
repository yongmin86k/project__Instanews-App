import CustomSelect from './customSelect';

$(function () {

    // initiate CustomSelect javascript library
    CustomSelect({
        selectElementID: '#jsCustomSelect',
        returnValue: true, // returns value to #hiddenInput when an option is selected

        // functions after the option is selected  
        afterSelected: function(){
            loadContents();         
        }
    });


    // refresh the page
    const $refreshPage = $('#refreshPage');
    $refreshPage.on('keyup', function(e){
        if (e.keyCode === 13){
            location.reload();
        }
    });

 }) // end of document ready



/*****************

Lists of functions

******************/


// get Data from NY Times API
function loadContents() { 
    const $section = $('#hiddenInput').val(),
          $page = $('#jsCustomSelect').parents('.menu'),
          $key = 'EQeAuLeMpzQaAkBUPv7Oo4stxW15SdZK',
          $url = `https://api.nytimes.com/svc/topstories/v2/${$section}.json?api-key=${$key}`,
          $article = $('.articles'),
          $articleList = $('.articles').children('ul'),
          $loader = $('.loader'),
          failText = `
                    <li class="failMessage">
                        <i class="fas fa-exclamation-triangle"></i>
                        Oops, something went wrong.<br> Please refresh the page.
                    </li>`;
    let aniTime = 500;
    
    // Prevent calling ajax function twice if the keyword is same
    if ( $articleList.hasClass($section) ) {
        $('.popUp').slideToggle(aniTime).delay(aniTime+300).slideToggle(aniTime);
        return
    }

    $.ajax({
        method: 'get',
        url: $url,
        dataType: 'json'
    }).always(function(){
        // Show the pre-loader during fetching the data
        $loader.fadeIn(aniTime);
        $articleList.prop('class', '');
        $article.addClass('blurred');
    })
    .fail(function(){
        // Hide the pre-loader
        // Show the fail message
        setTimeout(function () {
            $loader.fadeOut(aniTime);
            resizeMenuHeight($page, aniTime);
            $articleList.html('').append(failText);
        }, aniTime * 2);
    })
    .done(function (data) { 
        // Hide the pre-loader
        // Show the articles relevant to the keyword
        setTimeout(function () {
            $loader.fadeOut(aniTime);
            resizeMenuHeight($page, aniTime);
            $article.removeClass('blurred').fadeIn(aniTime);
            $articleList.html('').addClass($section);
            insertArticles(data.results, $articleList);
        }, aniTime * 2);  
    });

    $(window).on('resize', function(){
        resizeMenuHeight($page, aniTime);
    });
}
    
// Display only 12 articles witch have the images.
function insertArticles(data, $articleList) {  
    const isImages = data.filter(function(image){
        return image.multimedia.length !== 0;
    })
    
    $.each(isImages, function(index, value){
        const linkURL = value.url,
            imageURL = $(value.multimedia).last()[0].url,
            title = value.title,
            updatedDate = value.updated_date.slice(0,10),
            abstract = value.abstract;
        const $article = `
                        <li>
                            <article class="articleContainer">
                                <a href="${linkURL}" target="_blank">
                                    <div class="bgImgage" style="background-image: url('${imageURL}')"></div>
                                    <div class="article">
                                        <h2>${title}</h2>
                                        <p class="articleDate">${updatedDate}</p>
                                        <p class="abstract">${abstract}</p>
                                    </div>
                                </a>
                            </article>
                        </li>
                        `

        if ( index < 12){
            $articleList.append($article);
        }
    });
}

// Resize menu section when the width of browser changes
function resizeMenuHeight($page, aniTime) { 
    if ( $(window).width() < 600 ){
        $page.animate({ height: 300 }, aniTime);
    } else {
        $page.animate({ height: 120 }, aniTime);
    }
}