import CustomSelect from './customSelect';

CustomSelect();

$(function () {
    const $base = $('#jsCustomSelect');
    const $customSelect = $('.selectDefaultBox');
    const $optWrapper = $('.selectContainer');
    
    // functions when a custom option is selected
    $optWrapper.on('click keyup', '.optionContainer', function(e){
        if (e.type === 'click' || (e.type ==='keyup' && e.keyCode === 13)){
            syncSelect($(this), $base, $customSelect);
        }
    } );

 }) // end of document ready

 // synchronize html select elements and custome select elements
function syncSelect(selectedSection, $base, $customSelect){

    const txtOption = selectedSection.text().trim().toLowerCase();

    $base.children().filter(function(index, value){
        const txtBase = $(value).val();
            if (txtBase.indexOf(txtOption) >= 0){
                $base.children().eq(index).prop('selected', true);
                $customSelect.text( $(value).text() );

                loadContents(txtBase, $('#jsCustomSelect').parents('.menu'));
            }
        }); 
}


// get Data from NY Times API
function loadContents(section, $page) { 
    const $key = 'EQeAuLeMpzQaAkBUPv7Oo4stxW15SdZK';
    const $url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${$key}`;
    const $article = $('.articles');
    const $articleList = $('.articles').children('ul');
    const $loader = $('.loader');
    const failText = `
                    <li class="failMessage">
                        <i class="fas fa-exclamation-triangle"></i>
                        Oops, something went wrong.<br> Please refresh the page.
                    </li>`;
    let aniTime = 500;
    
    // Prevent calling ajax function twice if the keyword is same
    if ( $articleList.hasClass(section) ) {
        console.error('Choosed the same section');
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
            $articleList.html('').addClass(section);
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
                            <div class="articleContainer">
                                <a href="${linkURL}" target="_blank">
                                    <div class="bgImgage" style="background-image: url('${imageURL}')"></div>
                                    <div class="article">
                                        <h3>${title}</h3>
                                        <p class="articleDate">${updatedDate}</p>
                                        <p class="abstract">${abstract}</p>
                                    </div>
                                </a>
                            </div>
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