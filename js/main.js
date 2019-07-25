$(function () { 
    const $base = $('#jsCustomSelect');
    const $customSelect = $('.selectDefaultBox');
    const $optWrapper = $('.selectContainer');
    
    // synchronize html select elements and custome select elements
    $optWrapper.on('click', '.optionContainer', function(){
        const txtOption = $(this).text().trim().toLowerCase();
        $base.children().filter(function(index, value){
            const txtBase = $(value).text().trim().toLowerCase();
            if (txtBase.indexOf(txtOption) >= 0){
                $base.children().eq(index).prop('selected', true);
                $customSelect.text( $(value).text() );
            }
        }); 
    });

 }) // end of document ready

 
 