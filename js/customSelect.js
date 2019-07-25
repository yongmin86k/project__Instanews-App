let openOptions = false;

$(function(){
    // Create a custom selectbox from #jsCustomSelect
    const $customSelect = $('#jsCustomSelect');
    const defaultText = 'Sections...';
    const dafaultSelectBox = `
        <div class="selectDefaultBox">${defaultText}</div>
        <div class="selectContainer animated"></div>`;
    $customSelect.after(dafaultSelectBox);
    
    customizeSelect($customSelect);
});

// Create custom options from #jsCustomSelect
function customizeSelect(element){
    const $ele = element;
    const $container = $ele.next().next();
    $ele.children().each( function (index, value) { 
        const $optionText = $(value).text();
        const $optionHtml = `<div class="optionContainer">
                                <p class="optionText">${$optionText}</p>
                            </div>`;
        $container.append($optionHtml);
    });

    placeCustomSelect($container);
}

// Place the option container at the same position with the custom select box
function placeCustomSelect($ele) { 
    const $parentEle = $ele.parent();
    const  $object = $ele.prev();
    let topPosition = getTopPos($object);
    let bottomPosition = getBottomPos($parentEle, $object);
    
    rePositionSelect($ele, topPosition, bottomPosition);
    resizeWindow($ele, $parentEle, $object, topPosition, bottomPosition);
    clickSelect($ele, $object);
 }

// Calculate the top position of the custom select box
function getTopPos($object) { 
    return $object.position().top
}

// Calculate the bottom position of the custom select box
function getBottomPos($base, $object){
    return $base.outerHeight() - ($object.position().top + $object.outerHeight())
}

// Reposition the option container
function rePositionSelect($ele, topPosition, bottomPosition){
    if ($(window).width() < 600 ){
        // If mobile, place the container at the same bottom with the custom select box
        $ele.css('bottom', bottomPosition);
    } else {
        // If desktop, place the container at the same top with the custom select box
        $ele.css('top', topPosition);
    }
}

// Toggle the option container
 function clickSelect($ele, $object){
    $(window).on('click', function(e){
        if (openOptions === false && e.target ===  $object[0]) {
            openOptions = true;
            $ele.removeClass('bounceOut');
            $ele.addClass('bounceIn faster show');
        } else {
            openOptions = false;
            $ele.removeClass('bounceIn');
            $ele.addClass('bounceOut');
        }
    });
 }

// Re-locate the option container when the window size changes
 function resizeWindow($ele, $parentEle, $object, topPosition, bottomPosition) { 
    $(window).on('resize', function(){
        topPosition = getTopPos($object);
        bottomPosition = getBottomPos($parentEle, $object);

        rePositionSelect($ele, topPosition, bottomPosition);
    });
}