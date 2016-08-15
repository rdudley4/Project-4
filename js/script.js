var currentSrc;
var $lightbox   = $( '#lightbox' );
var $lbImage    = $( '.selected' );
var $controls   = $( '#controls' );
var $mainSearch = $( '#main-search' );
var firstImage  = imgDatabase[ 0 ].src;
var lastImage   = imgDatabase[ imgDatabase.length - 1 ].src;
var lightboxIsActive = false;
var prevClicked = false;
var nextClicked = false;
var itemCounter = 1;

/* When an image object is passed into the function..
    1. Create a div to hold the image and title
        1a. Create a span for the title
    2. Get title from the objects title key
        2a. Append the title and thumbnail to card
        2b. Get the title text and set it to our image-title text.
    3. Append completed card to the page. */

function assembleImage( imageObject ) {
  var $galleryItem = $( '<div class="gallery-item"></div>' );
  var $front       = $( '<div class="front"></div>' );
  var $back        = $( '<div class="back"></div>' );
  var thumbnail    = $( '<img src="' + imageObject.thumbnail + '">' );
  var link         = $( '<a href="' + imageObject.src + '"></a>' );
  var details      = $( '<div class="details"></div>' );
  var $title       = $( '<span class="title"></span>' );
  var $icon        = $( '<i class="fa fa-expand fa-3x" aria-hidden="true"></i>' );
  var $resolution  = $( '<span class="resolution">' + imageObject.resolution + '</span>' );
  var $id          = $( '<span class="image-id">ID - ' + imageObject.id + '</span>' );

  // Populate front and back of card
  $front.append( thumbnail );
  $title.append( imageObject.title );
  details.append( $icon, $title, $resolution, $id );
  link.append( details );
  $back.append( link );
  $galleryItem.addClass( 'item' + itemCounter );
  $galleryItem.append( $front, $back );
  $( '#gallery' ).append( $galleryItem );
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
  $lbImage.velocity( {
    opacity: 0,
  }, 150, function() {
    $lbImage.velocity( {
      opacity: 1
    } ).attr('src', currentSrc);
  }, 150 );
}

function updateDescription() {
  for ( i = 0; i < imgDatabase.length; i++ ) {
    if ( currentSrc === imgDatabase[i].src ) {
      $( '.image-info' ).text( imgDatabase[i].caption );
    }
  }
}

function filterResults(index) {
  var galleryItem = $('.item' + (index + 1));
  var itemSrc = galleryItem.children('.back').children('a').attr('href');

  if ( imgDatabase[index].isMatched ) {
      galleryItem.velocity(
        {
          bottom: 0
        },
        {
          duration: 300,
          display: "inline-block"
        }
      );
  } else {
      galleryItem.velocity(
        {
          bottom: -204
        },
        {
          duration: 300,
          display: "none"
        }
      );
  }
}

function resetFilter() {
  for (var i = 0; i < imgDatabase.length; i++) {
    imgDatabase[i].isMatched = true;
    filterResults(i);
  }
}

$( document ).ready(function() {
  $( 'body' ).velocity( {
    opacity: 1
  }, 400 ).append( $lightbox );

  /*  Loop through our imgDatabase and...
        a. Store a reference to our current object.
        b. Pass object into assembleImage.
        c. Increment itemCounter (used only to generate class names for gallery items.) */

  for ( var i = 0; i < imgDatabase.length; i++ ) {
    var imgData = imgDatabase[i];
    assembleImage( imgData );
    itemCounter++;
  }

  /*  Image Filtering - Main Search on keyup.
        a. Store users input converted to lower case in userInput.
        b. Test if userInput is > 0, so we can be sure the user has entered some text.
        c. Loop through imgDatabase and test the following:
            1. If any of the imgDatabase.title's contain the userInput.
            2. If userInput parsed as an integer matches any of the imgDatabase.id's.
            3. When match is found, set isMatched = true. Else set it to false.
        d. Call filterResults if search field contains input, else call resetFilter. */

  $mainSearch.on( 'keyup', function() {
    var userInput = $mainSearch.val().toLowerCase();
    var results = "The following images match the search query: ";

    if ( userInput.length > 0 ) {
      for ( var i = 0; i < imgDatabase.length; i++ ) {
        if ( imgDatabase[i].title.toLowerCase().indexOf( userInput ) !== -1 || parseInt( userInput ) === imgDatabase[i].id ) {
          results += imgDatabase[i].src + ", ";
          imgDatabase[i].isMatched = true;
        } else {
          imgDatabase[i].isMatched = false;
        }
        filterResults(i);
      }
      console.log(results);
    } else {
      resetFilter();
      console.log('Search filter has been reset.');
    }
  } );

  /*  Start lightbox when user clicks on any of the image 'cards'
        a. Prevent default link event.
        b. Store a reference to the clicked images href attribute, and set this to our lightbox image.
        c. Call updateDescription to update info text.
        d. Set lightboxIsActive = true and fade in the lightbox.
  */
  $( '.back a' ).on( "click", function( event ) {
    event.preventDefault();
    currentSrc = $( this ).attr( 'href' );
    $lbImage.attr( 'src', currentSrc );
    updateDescription();
    lightboxIsActive = true;
    $lightbox.fadeToggle( 300 );
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
    $lightbox.fadeToggle( 250 );
    lightboxIsActive = false;
    console.log('Lightbox Closed');
  } );

  /* Info Help - When user clicks on 'Hotkey Info' [Toggle Effect]
      a. If #controls-help opacity is 1, then we fade the element out by setting the opacity to 0 and sliding it down with margin.
      b. Else we can assume the element is hidden and conversely set the opacity to 1 and slide the element back up.
  */

  $( '#help' ).on( 'click', function()  {
    if ( $('#controls-help').css('margin-top') === '4px' ) {
      $( '#controls-help' ).velocity( {
        marginTop: -55,
      }, 400 );
    } else {
      $( '#controls-help' ).velocity( {
        marginTop: 4,
      }, 400 );
    }
  } );

  /* Keyboard Controls for Lightbox
      a. Store a reference to most recent key press in keyPressed.
      b. Test if lightboxIsActive is true. If so, use switch statement to test for certain key presses.
      c. Have hotkeys trigger the click event on corresponding control.
  */
  $( document ).keyup( function( e ) {
    var keyPressed = e.which;

    if ( lightboxIsActive ) {
      switch ( keyPressed ) {
        case 27: // Escape
          $lightbox.fadeToggle( 250 );
          lightboxIsActive = false;
          console.log( 'Lightbox Closed.' );
          break;
        case 37: // Left Arrow
          $controls.children( '#prev' ).trigger( 'click' );
          break;
        case 39: // Right Arrow
          $controls.children( '#next' ).trigger( 'click' );
          break;
        case 73: // 'i'
          $( '#help' ).trigger( 'click' );
      }
    }
  } );
});
