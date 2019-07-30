import CustomSelect from "./customSelect";

CustomSelect();

$(function () {
    const $base = $('#jsCustomSelect');
    const $customSelect = $('.selectDefaultBox');
    const $optWrapper = $('.selectContainer');
    
    $optWrapper.on('click', '.optionContainer', function(){
        // synchronize html select elements and custome select elements
        const txtOption = $(this).text().trim().toLowerCase();
        $base.children().filter(function(index, value){
            const txtBase = $(value).val();
            if (txtBase.indexOf(txtOption) >= 0){
                $base.children().eq(index).prop('selected', true);
                $customSelect.text( $(value).text() );

                loadContents(txtBase, $('#jsCustomSelect').parents('.menu'));
            }
        }); 
    });

 }) // end of document ready

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
        $articleList.html('');
        $loader.fadeIn(aniTime);
        $articleList.prop('class', '');
        $('.page').addClass('blur');
    })
    .fail(function(){
        // Hide the pre-loader
        // Show the fail message
        setTimeout(function () {
            $('.page').removeClass('blur');
            $loader.fadeOut(aniTime);

            resizeMenuHeight($page, aniTime);

            $articleList.append(failText);
            $article.fadeIn(aniTime);
        }, aniTime * 2);
    })
    .done(function (data) { 
        // Hide the pre-loader
        // Show the articles relevant to the keyword
        setTimeout(function () {
            $('.page').removeClass('blur');
            $loader.fadeOut(aniTime);
            
            resizeMenuHeight($page, aniTime);

            $article.fadeIn(aniTime);
            $articleList.addClass(section);
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
        const linkURL = value.url;
        const imageURL = $(value.multimedia).last()[0].url;
        const abstract = value.abstract;
        const $article = `
                        <li>
                            <div class="articleContainer" style="background-image: url('${imageURL}')">
                                <a href="${linkURL}">
                                    <div class="abstract">${abstract}</div>
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