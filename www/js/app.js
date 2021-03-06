var $text = $('.poster blockquote p, .source');

// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  return a;
}

function convert_to_slug(text){
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function process_text(){
    $text.each(function(){
        var raw_text = $(this).html();
        
        $(this).html(smarten(raw_text));
    });
}

function save_image(){
    $('canvas').remove();
    process_text();

    html2canvas($('.poster'), {
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var quote = $('blockquote').text().split(' ', 5);
        var filename = convert_to_slug(quote.join(' '));

        var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
      }
    });
}

$('#save').on('click', save_image);

$('#news').on('click', function(){
    $(this).toggleClass('btn-primary btn-default');
    $('#music').toggleClass('btn-primary btn-default');
    $('.poster').toggleClass('music');
});

$('#music').on('click', function(){
    $(this).toggleClass('btn-primary btn-default');
    $('#news').toggleClass('btn-primary btn-default');
    $('.poster').toggleClass('music');
});

$('#quote').on('click', function(){
    $(this).find('button').toggleClass('btn-primary btn-default');
    $('.poster').toggleClass('quote');
});

$('#fontsize').on('change', function(){
    var font_size = $(this).val().toString() + 'px';
    $('.poster').css('font-size', font_size);
});

$('#show').on('keyup', function(){
    var input_text = $(this).val();
    $('.source').find('em, span').remove();
    $('.source')
        .text($.trim($('.source').text()))
        .append('<span>,</span> <em>' + input_text + '</em>');
});

// This event is interfering with the medium editor in some browsers
// $('.poster').on('blur', function(){
//     process_text();
// });


var editable = document.querySelectorAll('.poster blockquote, .source');
var editor = new MediumEditor(editable, {
    buttons: ['italic']
});