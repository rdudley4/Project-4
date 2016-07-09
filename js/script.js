var currentImage;
var currentSrc;
var $clicked;
var $lightbox = $( '#lightbox' );
var $lbImage = $( '.selected' );
var $controls = $( '#controls' );
var firstImage = imgDatabase[ 0 ].src;
var lastImage = imgDatabase[ imgDatabase.length - 1 ].src;
var prevClicked = false;
var nextClicked = false;

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
    $imageLink.append( imageObject.thumbnail, $imageTitle );
    $imageCard.append( $imageLink );
    $( '#gallery' ).append( $imageCard );
}

/* Loop through our imgDatabase array and..
    1. Detect if previous or next is clicked.
    2. If previous, get src value for previous object. If next, get src value of the next object.
      2a. If we hit previous & we are on first image, set src to the value of the previous index src.
      2b. If we hit next & we are on the last image, set src to the value of the first index src.
    3. Check our currentSrc against the current index src value until we get a match.
    4. Return the value of currentSrc */

function nextImage() {
  for ( i = 0; i < imgDatabase.length; i++ ) {
    if ( prevClicked && currentSrc === imgDatabase[i].src ) {
      if ( currentSrc === firstImage ) {
        currentSrc = lastImage;
        console.log( 'First image detected, going to end of series.' );
        return currentSrc;
      } else {
        currentSrc = imgDatabase[( i - 1 )].src;
        return currentSrc;
      }
    } else if ( nextClicked && currentSrc === imgDatabase[i].src ) {
        if ( currentSrc === lastImage ) {
          currentSrc = firstImage;
          console.log( 'Last image detected, going to start of series.' );
          return currentSrc;
        } else {
          currentSrc = imgDatabase[( i + 1)].src;
          return currentSrc;
        }
    }
  }
}

function updateImage() {
  currentSrc = nextImage();

  $lbImage.fadeOut( function() {
    $lbImage.attr( "src", currentSrc ).fadeIn();
  } );
}

function updateDescription() {
  for ( i = 0; i < imgDatabase.length; i++ ) {
    if ( currentSrc === imgDatabase[i].src ) {
      $( '.description' ).text( imgDatabase[i].caption );
    }
  }
}

// Page loading animation
$( '.animsition' ).animsition({
  inClass: 'fade-in-left-lg',
  outClass: 'fade-out-left-lg',
  inDuration: 1000,
  outDuration: 400
});

$( 'body' ).append( $lightbox );

/* Loop through our imgDatabase(imgData.js) and
    1. Store reference to current imgDatabase object.
    2. Pass the object to the assembleImage function */
for ( var i = 0; i < imgDatabase.length; i++ ) {
  currentImage = imgDatabase[i];
  assembleImage( currentImage );
}

/* Prevent default link functionality
    1. Fade in our light box on click. */
$( '.image-card a' ).on( "click", function( event ) {
  event.preventDefault();
  $clicked = $( this );
  currentSrc = $clicked.attr( 'href' );
  $lbImage.attr( 'src', currentSrc );
  updateDescription();

  $lightbox.fadeIn( 300 );
  console.log('Lightbox Activated');
} );


// Lightbox control functions

// Previous
$controls.children( '#prev' ).on( 'click', function() {
  prevClicked = true;
  nextClicked = false;
  updateImage();
  updateDescription();
  console.log( 'Moving to previous image in series: ' + currentSrc );
} );

// Next
$controls.children( '#next' ).on( 'click', function() {
  prevClicked = false;
  nextClicked = true;
  updateImage();
  updateDescription();
  console.log( 'Moving to next image in series: ' + currentSrc );
} );

// Download
$controls.children( '#download' ).on( 'click', function()  {
  console.log( 'Download trigger has fired.' );
} );

// Close
$controls.children( '#close' ).on( 'click', function() {
  $lightbox.fadeOut( 250 );
  console.log('Lightbox Closed');
} );
