var currentImage;

function assembleImage( image ) {
    var $imageCard = $( '<div class="image-card"></div>' );
    var $imageTitle = $('<span class="image-title"></span>');
    
    $imageTitle.text( image.title );
    $imageCard.append( image.thumbnail );
    $imageCard.append( $imageTitle );
    $( '#gallery' ).append( $imageCard );
}

/* Loop through our imgDatabase(imgData.js) and
    1. Store reference to current imgDatabase object.
    2. Pass the object to the assembleImage function */
for ( var i = 0; i < imgDatabase.length; i++ ) {
  currentImage = imgDatabase[i];
  assembleImage( currentImage );
}
