let values= [];
$(function() {
    $.get('/fancy_users', function (tusers) {
        tusers.forEach(function(tuser) {
            values.push(tuser);
        });
        let pagingRows = 6;

        let paginationOptions = {
            innerWindow: 1,
            left: 0,
            right: 0
        };
        let options = {
            valueNames: [ 'name', 'rating' ],
            item: '\n' +
                '      <tr>\n' +
                // '        <td class="minify rank">000001</td>\n' +
                '        <td class="name">Alpha Bravo Charlie</td>\n' +
                '        <td class="minify textright rating">26.00</td>\n' +
                '      </tr>',
            page: pagingRows
        };

        let tableList = new List('tableID', options, values);

        $('.jTablePageNext').on('click', function(){
            let list = $('.pagination').find('li');
            $.each(list, function(position, element){
                if($(element).is('.active')){
                    $(list[position+1]).trigger('click');
                }
            })
        });
        $('.jTablePagePrev').on('click', function(){
            let list = $('.pagination').find('li');
            $.each(list, function(position, element){
                if($(element).is('.active')){
                    $(list[position-1]).trigger('click');
                }
            })
        })
    });


});

