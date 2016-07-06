var currentImage;
var $lightbox = $( '#lightbox' );
var $lbImage = $( '.selected' );
var $controls = $( '#controls' );

$( 'body' ).append( $lightbox );

/* When an image object is passed into the function..
    1. Create a div to hold the image and title
        1a. Create a span for the title
    2. Get title from the objects title key
        2a. Append the title and thumbnail to card
        2b. Get the title text and set it to our image-title text.
    3. Append completed card to the page. */
function assembleImage( imageObject ) {
    var $imageCard = $( '<div class="image-card"></div>' );
    var $imageTitle = $( '<span class="image-title"></span>' );
    var $imageLink = $( '<a href="' + imageObject.src + '"</a>' );

    $imageTitle.text( imageObject.title );
    $imageCard.append( $imageLink );
    $imageLink.append( imageObject.thumbnail, $imageTitle );
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
  inClass: 'fade-in-left-lg',
  outClass: 'fade-out-left-lg',
  inDuration: 1000,
  outDuration: 400
});

/* Prevent default link functionality
    1. Fade in our light box on click. */
$( '.image-card a' ).on( "click", function(e) {
  var $clicked = $( this );
  var currentSrc = $clicked.attr( 'href' );

  e.preventDefault();
  $lbImage.attr( 'src', currentSrc );

  $lightbox.fadeIn( 250 );
  console.log('Lightbox Activated');
} );

// Control on click functions

$controls.children( '.fa-chevron-left' ).on( 'click', function() {
  console.log('Previous trigger has fired.');
} );

$controls.children( '.fa-chevron-right' ).on( 'click', function() {
  console.log('Next trigger has fired.');
} );

$controls.children( '.fa-download' ).on( 'click', function()  {
  console.log( 'Download trigger has fired.' );
} );

$controls.children( '.fa-times' ).on( 'click', function() {
  $lightbox.fadeOut( 250 );
  console.log('Lightbox Closed');
} );
