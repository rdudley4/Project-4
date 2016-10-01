var currentSrc,
    videoId,
    videoTitle,
    currentVideo,
    player,
    controlBarExtended = true,
    videoCount = 0,
    $lightbox = $('#lightbox'),
    $lbImage = $('.selected'),
    $controls = $('#controls'),
    $mainSearch = $('#main-search'),
    $toggle = $('#toggle'),
    $songBar = $('#song-container'),
    lightboxIsActive = false,
    prevClicked = false,
    nextClicked = false,
    animLength = 350,
    recentlyPlayed = [];

// Load our YouTube Videos to the page when the IFrame API is ready.

function onYouTubeIframeAPIReady() {
    for (var i = 0; i < imgDatabase.length; i++) {
        if (imgDatabase[i].type === 'yt') {
            player = new YT.Player('item' + imgDatabase[i].id, {
                videoId: imgDatabase[i].videoID,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            videoCount++;
        }
    }

    //bind events
    var pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", function() {
        currentVideo.pauseVideo();
    });

    var playButton = document.getElementById("play");
    playButton.addEventListener("click", function() {
        currentVideo.playVideo();
    });

    var playButton = document.getElementById("replay");
    playButton.addEventListener("click", function() {
        currentVideo.seekTo(0);
    });
}

function updatePlayerReference(e) {
    currentVideo = e.target;
    videoTitle = currentVideo.getVideoData().title;
    videoId = currentVideo.getVideoData().video_id;
}

function onPlayerReady(event) {
    // Grab video title from YT and set this to the corresponding object title in imgData.js this is so we don't have to set it manually, and we can still search based off video title.
    updatePlayerReference(event);

    for (var i = 0; i < imgDatabase.length; i++) {
        if (imgDatabase[i].videoID === videoId) {
            imgDatabase[i].caption = videoTitle;
        }
    }
}

function onPlayerStateChange(event) {
    var showPauseButton = [{
            e: $('#play'),
            p: {
                opacity: 0
            },
            o: {
                duration: 100,
                visibility: 'hidden'
            }
        }, {
            e: $('#pause'),
            p: {
                opacity: 1
            },
            o: {
                duration: 100,
                visibility: 'visible'
            }
        }],
        showPlayButton = [{
            e: $('#pause'),
            p: {
                opacity: 0
            },
            o: {
                duration: 100,
                visibility: 'hidden'
            }
        }, {
            e: $('#play'),
            p: {
                opacity: 1
            },
            o: {
                duration: 100,
                visibility: 'visible'
            }
        }];

    if (event.data == YT.PlayerState.PLAYING) {
        updatePlayerReference(event);

        $('#currentThumbnail').attr("src", 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg');
        $('#currentSong').text(videoTitle);
        $.Velocity.RunSequence(showPauseButton);

        recentlyPlayed.unshift(currentVideo);
        if (recentlyPlayed.length > 2) {
            recentlyPlayed.pop();
        }
    } else if (currentVideo != null) {
        if (currentVideo.getPlayerState() === 2 || currentVideo.getPlayerState() === 0) {
            $.Velocity.RunSequence(showPlayButton);
        }
    }

    if (recentlyPlayed.length === 2) {
        if (recentlyPlayed[0].getPlayerState() === 1 && recentlyPlayed[1].getPlayerState() === 1 && recentlyPlayed[0].getVideoData().video_id != recentlyPlayed[1].getVideoData().video_id) {
            recentlyPlayed[1].pauseVideo();
        }
    }
}

// Minimize Currently Playing Bar
$toggle.on("click", function() {
    var showContolBar = [{
            e: $songBar,
            p: {
                height: 48,
                bottom: 0
            },
            o: {
                duration: animLength
            }
        }, {
            e: $songBar.children('span'),
            p: {
                opacity: 1
            },
            o: {
                duration: animLength,
                display: 'block',
                sequenceQueue: false
            }
        }, {
            e: $('#replay'),
            p: {
                opacity: 1
            },
            o: {
                duration: animLength - 100,
                display: 'block',
                sequenceQueue: false
            }
        }, {
            e: $toggle,
            p: {
                rotateZ: 270,
                scaleX: 1,
                scaleY: 1,
                top: 0
            },
            o: {
                duration: animLength - 100,
                sequenceQueue: false
            }
        }],
        hideControlBar = [{
            e: $songBar,
            p: {
                height: 0,
                bottom: -3
            },
            o: {
                duration: animLength
            }
        }, {
            e: $songBar.children('span'),
            p: {
                opacity: 0
            },
            o: {
                duration: animLength,
                display: 'none',
                sequenceQueue: false
            }
        }, {
            e: $('#replay'),
            p: {
                opacity: 0
            },
            o: {
                duration: animLength - 100,
                display: 'none',
                sequenceQueue: false
            }
        }, {
            e: $toggle,
            p: {
                rotateZ: 90,
                scaleX: 2,
                scaleY: 2,
                top: -40
            },
            o: {
                duration: 100,
                sequenceQueue: false
            }
        }];

    if (controlBarExtended) {
        $.Velocity.RunSequence(hideControlBar);
        $('#toggle').addClass('showbar');
        controlBarExtended = false;
    } else {
        $.Velocity.RunSequence(showContolBar);
        $('#toggle').removeClass('showbar');
        controlBarExtended = true;
    }
});

/* When an image object is passed into the function..
    1. Create a div to hold the image and title
        1a. Create a span for the title
    2. Get title from the objects title key
        2a. Append the title and thumbnail to card
        2b. Get the title text and set it to our image-title text.
    3. Append completed card to the page. */

function assembleImage(imageObject) {
    var $galleryItem = $('<div class="gallery-item"></div>');

    if (imageObject.type === 'img') {
        var $top = $('<div class="layer-top"></div>'),
            $bottom = $('<div class="layer-bottom"></div>'),
            $thumbnail = $('<img src="' + imageObject.thumbnail + '">'),
            $link = $('<a href="' + imageObject.src + '"></a>'),
            $details = $('<div class="details"></div>'),
            $title = $('<span class="title"></span>'),
            $icon = $('<i class="fa fa-expand fa-3x" aria-hidden="true"></i>'),
            $resolution = $('<span class="resolution">' + imageObject.resolution + '</span>'),
            $id = $('<span class="image-id">ID - ' + imageObject.id + '</span>');

        // Populate front and back of card
        $top.append($thumbnail);
        $title.append(imageObject.caption);
        $details.append($icon, $title, $resolution, $id);
        $link.append($details);
        $bottom.append($link);
        $galleryItem.append($top, $bottom);
    } else if (imageObject.type === 'yt') {
        console.log('Video stuff fired.');
    }
    $galleryItem.attr('id', 'item' + imageObject.id);
    $('#gallery').append($galleryItem);
}

/* Loop through our imgDatabase array and..
    1. Detect if previous or next is clicked.
    2. If previous, get src value for previous object. If next, get src value of the next object.
      2a. If we hit previous & we are on first image, set src to the value of the previous index src.
      2b. If we hit next & we are on the last image, set src to the value of the first index src.
    3. Check our currentSrc against the current index src value until we get a match.
    4. Return the value of currentSrc */

// TODO: Fix the logic here to work with YT Videos.
function nextImage() {
    for (i = 0; i < imgDatabase.length; i++) {
        var firstImage = imgDatabase[0].src,
            lastImage = imgDatabase[imgDatabase.length - (videoCount + 1)].src;
        if (prevClicked && currentSrc === imgDatabase[i].src) {
            if (currentSrc === firstImage) {
                currentSrc = lastImage;
                console.log('First image detected, going to end of series.');
                return currentSrc;
            } else {
                currentSrc = imgDatabase[(i - 1)].src;
                return currentSrc;
            }
        } else if (nextClicked && currentSrc === imgDatabase[i].src) {
            if (currentSrc === lastImage) {
                currentSrc = firstImage;
                console.log('Last image detected, going to start of series.');
                return currentSrc;
            } else {
                currentSrc = imgDatabase[(i + 1)].src;
                return currentSrc;
            }
        }
    }
}

function updateImage() {
    currentSrc = nextImage();
    $lbImage.velocity({
        opacity: 0,
    }, 150, function() {
        $lbImage.velocity({
            opacity: 1
        }, 150).attr('src', currentSrc);
    });
}

function updateDescription() {
    for (i = 0; i < imgDatabase.length; i++) {
        if (currentSrc === imgDatabase[i].src) {
            $('.image-description').text(imgDatabase[i].caption);
        }
    }
}

function filterResults(index) {
    var galleryItem = $('#item' + (index + 1));

    if (imgDatabase[index].isMatched) {
        galleryItem.velocity({
            bottom: 0
        }, {
            duration: 250,
            display: "inline-block"
        });
    } else {
        galleryItem.velocity({
            bottom: -204
        }, {
            duration: 250,
            display: "none"
        });
    }
}

function resetFilter() {
    for (var i = 0; i < imgDatabase.length; i++) {
        imgDatabase[i].isMatched = true;
        filterResults(i);
    }
}

$(document).ready(function() {

    $('body').append($lightbox);

    for (var i = 0; i < imgDatabase.length; i++) {
        // Give each of our objects an ID.
        imgDatabase[i].id = i + 1;
        // Pass object into assembleImage to build gallery.
        assembleImage(imgDatabase[i]);
    }

    /*  Image Filtering - Main Search on keyup.
          a. Store users input converted to lower case in userInput.
          b. Test if userInput.length is > 0, so we can be sure the user has entered some text.
          c. Loop through imgDatabase and test the following:
              1. If any of the imgDatabase.title's contain the userInput.
              2. If userInput parsed as an integer matches any of the imgDatabase.id's.
              3. When match is found, set isMatched = true. Else set it to false.
          d. Call filterResults if search field contains input, else call resetFilter. */


    $mainSearch.on('keyup', function() {
        var userInput = $mainSearch.val().toLowerCase(),
            results = 0;

        if (userInput.length > 0) {
            for (var i = 0; i < imgDatabase.length; i++) {
                if (imgDatabase[i].caption.toLowerCase().indexOf(userInput) !== -1 || parseInt(userInput) === imgDatabase[i].id || imgDatabase[i].type === userInput) {
                    results++;
                    imgDatabase[i].isMatched = true;
                } else {
                    imgDatabase[i].isMatched = false;
                }
                filterResults(i);
            }
            if (results === 0) {
                $('#results').text('No results found.');
            } else if (results === 1) {
                if ($('#results').css('visibility') === 'hidden') {
                    // This only occurs if the user is searching by id.
                    $('#results').velocity({
                        opacity: 1,
                    }, {
                        visibility: 'visible',
                        duration: 250
                    });
                }
                $('#results').text('Is this what you were looking for?');
            } else {
                $('#results').text(results + ' results found.').velocity({
                    opacity: 1,
                }, {
                    visibility: 'visible',
                    duration: 250
                });
            }
        } else {
            resetFilter();
            results = 0;
            $('#results').velocity({
                opacity: 0,
            }, {
                visibility: 'hidden',
                duration: 250
            });
            console.log('Search filter has been reset.');
        }
    });

    /*  Start lightbox when user clicks on any of the image 'cards'
          a. Prevent default anchor event from directly linking to the image.
          b. Store a reference to the clicked images href attribute, and set this to our lightbox image.
          c. Call updateDescription to update info text.
          d. Set lightboxIsActive = true and fade in the lightbox.
    */
    $('.layer-bottom a').on("click", function(event) {
        event.preventDefault();
        currentSrc = $(this).attr('href');
        $lbImage.attr('src', currentSrc);
        updateDescription();
        lightboxIsActive = true;
        $lightbox.velocity({
            opacity: 1
        }, {
            duration: 75,
            display: "block"
        });
        console.log('Lightbox Activated');
    });

    // Lightbox control functions

    // Previous
    $controls.children('#prev').on('click', function() {
        prevClicked = true;
        nextClicked = false;
        updateImage();
        updateDescription();
        console.log('Moving to previous image in series: ' + currentSrc);
    });

    // Next
    $controls.children('#next').on('click', function() {
        prevClicked = false;
        nextClicked = true;
        updateImage();
        updateDescription();
        console.log('Moving to next image in series: ' + currentSrc);
    });

    // Download
    $controls.children('#download').on('click', function() {
        console.log('Download trigger has fired.');
    });

    // Close
    $controls.children('#close').on('click', function() {
        $lightbox.velocity({
            opacity: 0
        }, {
            duration: 75,
            display: "none"
        });
        lightboxIsActive = false;
        console.log('Lightbox Closed');
    });

    /* Info Help - When user clicks on 'Hotkey Info' bar [Toggle Effect]
        a. By default hotkey-info is hidden, so we test this value
        to see whether it is currently visible. Added bonus we can keep track of visibility even if lightbox is closed and re-opened.
          IF: info-help is currently visible, and the help bar was clicked, we want to 'slide' the hotkeys upwards using margins and hide the element.
          ELSE: info-help is currently hidden, slide hotkeys into view with regular margins and set the display to visible.
    */

    $('#help').on('click', function() {
        if ($('#hotkey-info').css('visibility') === 'visible') {
            $('#hotkey-info').velocity({
                marginTop: -53
            }, {
                duration: 350,
                visibility: "hidden"
            });
        } else {
            $('#hotkey-info').velocity({
                marginTop: 4,
            }, {
                duration: 350,
                visibility: "visible"
            });
        }
    });

    /* Keyboard Controls for Lightbox
        a. Store a reference to most recent key press in keyPressed.
        b. Test if lightboxIsActive is true. If so, use switch statement to test for certain key presses.
        c. Have hotkeys trigger the click event on corresponding control.
    */
    $(document).keyup(function(e) {
        var keyPressed = e.which;
        if (lightboxIsActive) {
            switch (keyPressed) {
                case 27: // Escape
                    $lightbox.velocity({
                        opacity: 0
                    }, {
                        duration: 75,
                        display: "none"
                    });
                    lightboxIsActive = false;
                    console.log('Lightbox Closed.');
                    break;
                case 37: // Left Arrow
                    $controls.children('#prev').trigger('click');
                    break;
                case 39: // Right Arrow
                    $controls.children('#next').trigger('click');
                    break;
                case 73: // 'i'
                    $('#help').trigger('click');
                    break;
            }
        } else {
            switch (keyPressed) {
                case 192:
                    $toggle.trigger('click');
                    break;
            }
        }
    });
});
