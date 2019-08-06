export default function CustomSelect(options) {

let openOptions = false;

// Create a custom selectbox from the html element ID 
const $customSelect = $(options.selectElementID);

const defaultText = 'Sections...';
const dafaultSelectBox = options.returnValue === true ? 
    `
    <div class="selectDefaultBox" tabindex="0">${defaultText}</div>
    <div class="selectContainer animated"></div>
    <input id="hiddenInput" type="hidden">` : 
    `
    <div class="selectDefaultBox" tabindex="0">${defaultText}</div>
    <div class="selectContainer animated"></div>`;
$customSelect.after(dafaultSelectBox);


// Callbacks
customizeSelect($customSelect);


    // Create custom options
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
        placeCustomSelect($container, $ele);
    }

    // Place the option container at the same position with the custom select box
    function placeCustomSelect($ele, $base) { 
        const $parentEle = $ele.parent(); 
        const $object = $ele.prev();

        let topPosition = getTopPos($object);
        let bottomPosition = getBottomPos($parentEle, $object);

        rePositionSelect($ele, $parentEle, topPosition, bottomPosition);
        clickSelect($ele, $object);
        resizeWindow($ele, $parentEle, $object, topPosition, bottomPosition);
        syncCustomOptions($ele, $base, $object);
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
    function rePositionSelect($ele, $parentEle, topPosition, bottomPosition){
        if ($(window).width() < 600 && $parentEle.parent().height() > 300 ){
            // If mobile, place the container at the same bottom with the custom select box
            $ele.css({
                'top': 'initial',
                'bottom': bottomPosition
            });
        } else {
            // If desktop, place the container at the same top with the custom select box
            $ele.css({
                'top': topPosition,
                'bottom': 'initial'
            });
        }
    }

    // Toggle the option container
    function clickSelect($ele, $object){
        
        //  toggle the option container when it's clicked
        $(window).on('click', function(e){
            if (openOptions === false && e.target ===  $object[0] ) {
                showOptions($ele);
            } else {
                hideOptions($ele);
            }
        });

        $(window).on('keyup', function(e){
            // show the option container when it's focused
            if ( e.target === $object[0] ){
                showOptions($ele);
            } else if( 
            // hide the option container when key of 'enter' or 'esc' is pressed
            // or hide the option container is focused out
                (e.keyCode === 13 && $(e.target).hasClass('optionContainer')) ||
                (e.keyCode === 27 && $(e.target).hasClass('optionContainer')) ||
                (openOptions === true && !$(e.target).hasClass('optionContainer')) 
                ) { 
                hideOptions($ele);
            } 
        });
    }

    // Show the options when it's clicked or focused in
    function showOptions($ele){
        openOptions = true;
        $ele.removeClass('bounceOut').addClass('bounceIn faster show');
        $ele.children().prop('tabindex', 0);

    }

    // Hide the options when its outside is clicked or it's focused out
    function hideOptions($ele){
        openOptions = false;
        $ele.removeClass('bounceIn').addClass('bounceOut');
        $ele.children().prop('tabindex', -1);
    }


    // Re-locate the option container when the window size changes
    function resizeWindow($ele, $parentEle, $object, topPosition, bottomPosition) { 
        $(window).on('click resize', function(){
            topPosition = getTopPos($object);
            bottomPosition = getBottomPos($parentEle, $object);
            rePositionSelect($ele, $parentEle, topPosition, bottomPosition);
        });
    }

    // synchronize html select elements and custome select elements
    function syncCustomOptions($ele, $base, $object){
        $ele.on('click keyup', '.optionContainer', function(e){
            if (e.type === 'click' || (e.type ==='keyup' && e.keyCode === 13)){

                const txtOption = $(this).text().trim().toLowerCase();

                $base.children().filter(function(index, value){
                    const txtBase = $(value).val();
                    
                        if (txtBase.indexOf(txtOption) >= 0){
                            $base.children().eq(index).prop('selected', true);
                            $object.text( $(value).text() );

                            if (options.returnValue === true){
                                $('#hiddenInput').val(txtBase);
                            }
                        }
                    }); 

                // call the custom functions
                options.afterSelected();
            }
        } );
    }

}