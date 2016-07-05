var currentImage;
var $anchor = $( '#gallery a' );
var $lightbox = $( '<div id="lightbox"></div>' );

$( 'body' ).append( $lightbox );

/* When an image object is passed into the function..
    1. Create a div to hold the image and title
        1a. Create a span for the title
    2. Get title from the objects title key
        2a. Append the title and thumbnail to card
    3. Append completed card to the page. */
function assembleImage( imageObject ) {
    var $imageCard = $( '<div class="image-card"></div>' );
    var $imageTitle = $( '<span class="image-title"></span>' );
    var $imageLink = $( '<a href="' + imageObject.src + '"</a>' );

    $imageTitle.text( imageObject.title );
    $imageCard.append( $imageLink );
    $imageLink.append( imageObject.thumbnail );
    $imageLink.append( $imageTitle );
    $( '#gallery' ).append( $imageCard );
}

/* Loop through our imgDatabase(imgData.js) and
    1. Store reference to current imgDatabase object.
    2. Pass the object to the assembleImage function */
for ( var i = 0; i < imgDatabase.length; i++ ) {
  currentImage = imgDatabase[i];
  assembleImage( currentImage );
}

// Page loading animation
$( '.animsition' ).animsition({
  inClass: 'fade-in-down-lg',
  outClass: 'fade-out-down-lg',
  inDuration: 1000,
  outDuration: 600,
});

$( '.image-card' ).click( function( e ) {
  e.preventDefault();
  console.log( 'Anchor has been clicked.' );
  $lightbox.fadeIn( 'slow' );
} );

$lightbox.click( function() {
  $lightbox.fadeOut( 'slow' );
} );
