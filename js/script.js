var player,
    videoId,
    currentSrc,
    videoTitle,
    currentVideo,
    videoCount = 0,
    $mainSearch = $('#main-search'),
    $songBar = $('#song-container'),
    $lightbox = $('#lightbox'),
    $lbContainer = $('.lightbox-container'),
    $lbImage = $('.selected'),
    $controls = $('#controls'),
    $toggle = $('#toggle'),
    controlBarExtended = true,
    lightboxIsActive = false,
    isMaximized = false,
    prevClicked = false,
    nextClicked = false,
    recentlyPlayed = [];

// Load YouTube IFrame Player API
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Load our YouTube Videos to the page when the IFrame API is ready.

function onYouTubeIframeAPIReady() {
    for (var i = 0; i < galleryDB.length; i++) {
        if (galleryDB[i].type === 'yt') {
            player = new YT.Player('item' + galleryDB[i].id, {
                videoId: galleryDB[i].videoID,
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
    // Grab video title from YT and set this to the corresponding object's title key in imgData.js. This is so we don't have to set it manually, and we can still search based off video title.
    updatePlayerReference(event);

    for (var i = 0; i < galleryDB.length; i++) {
        if (galleryDB[i].videoID === videoId) {
            galleryDB[i].caption = videoTitle;
        }
    }
}


function onPlayerStateChange(event) {
    var showPauseButton = [
            {
                e: $('#play'),
                p: {
                    opacity: 0
                },
                o: {
                    duration: 50,
                    visibility: 'hidden'
                }
            }, {
                e: $('#pause'),
                p: {
                    opacity: 1
                },
                o: {
                    duration: 50,
                    visibility: 'visible',
                    sequenceQueue: false
                }
            }
        ],
        showPlayButton = [
            {
                e: $('#pause'),
                p: {
                    opacity: 0
                },
                o: {
                    duration: 50,
                    visibility: 'hidden'
                }
            }, {
                e: $('#play'),
                p: {
                    opacity: 1
                },
                o: {
                    duration: 50,
                    visibility: 'visible',
                    sequenceQueue: false
                }
            }
        ];

    if (event.data == YT.PlayerState.PLAYING) {
        updatePlayerReference(event);

        $('#currentThumbnail').attr("src", 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg');
        $('#currentSong').text(videoTitle);
        $.Velocity.RunSequence(showPauseButton);

        /* Add currentVideo object to start of the recentlyPlayed array. We only want to store the current and previous video, so if the array is longer than 2 objects, remove the last object in the array. */
        recentlyPlayed.unshift(currentVideo);
        if (recentlyPlayed.length > 2) {
            recentlyPlayed.pop();
        }
    } else if (currentVideo !== null) {
        if (currentVideo.getPlayerState() === 2 || currentVideo.getPlayerState() === 0) {
            $.Velocity.RunSequence(showPlayButton);
        }
    }

    /* Check if our recentlyPlayed array currently holds two player objects, if so..
          1. Check if both are currently playing.
          2. Check if both have the same video_id
          3. If video_id's are not the same, pause the last (previous) video. */
    if (recentlyPlayed.length === 2) {
        if (recentlyPlayed[0].getPlayerState() === 1 && recentlyPlayed[1].getPlayerState() === 1 && recentlyPlayed[0].getVideoData().video_id != recentlyPlayed[1].getVideoData().video_id) {
            recentlyPlayed[1].pauseVideo();
        }
    }
}

// Minimize Currently Playing Bar
$toggle.on("click", function() {
    var showContolBar = [
            {
                e: $songBar,
                p: {
                    height: 48,
                    bottom: 0
                },
                o: {
                    duration: 350
                }
            }, {
                e: $toggle,
                p: {
                    rotateZ: 0,
                    scaleX: 1,
                    scaleY: 1,
                    top: 0
                },
                o: {
                    duration: 100,
                    sequenceQueue: false
                }
            }
        ],
        hideControlBar = [
            {
                e: $songBar,
                p: {
                    height: 0,
                    bottom: -3
                },
                o: {
                    duration: 150
                }
            }, {
                e: $toggle,
                p: {
                    rotateZ: 180,
                    scaleX: 2,
                    scaleY: 2,
                    top: -40
                },
                o: {
                    duration: 100,
                    sequenceQueue: false
                }
            }
        ];

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

/* When an galleryObject object is passed into the function..
    1. Create a div to hold the image and title
        1a. Create a span for the title
    2. Get title from the objects title key
        2a. Append the title and thumbnail to card
        2b. Get the title text and set it to our image-title text.
    3. Append completed card to the page. */

function assembleImage(galleryObject) {
    var $galleryItem = $('<div class="gallery-item"></div>');

    if (galleryObject.type === 'img') {
        var $top = $('<div class="layer-top"></div>'),
            $bottom = $('<div class="layer-bottom"></div>'),
            $thumbnail = $('<img src="' + galleryObject.thumbnail + '">'),
            $link = $('<a href="' + galleryObject.src + '"></a>'),
            $details = $('<div class="details"></div>'),
            $title = $('<span class="title"></span>'),
            $icon = $('<i class="fa fa-expand fa-3x" aria-hidden="true"></i>'),
            $resolution = $('<span class="resolution">' + galleryObject.resolution + '</span>'),
            $id = $('<span class="image-id">ID - ' + galleryObject.id + '</span>');

        // Populate front and back of card
        $top.append($thumbnail);
        $title.append(galleryObject.caption);
        $details.append($icon, $title, $resolution, $id);
        $link.append($details);
        $bottom.append($link);
        $galleryItem.append($top, $bottom);
    }

    $galleryItem.attr('id', 'item' + galleryObject.id);
    $('#gallery').append($galleryItem);
}

/* Loop through our galleryDB array and..
    1. Detect if previous or next is clicked.
    2. If previous, get src value for previous object. If next, get src value of the next object.
      2a. If we hit previous & we are on first image, set src to the value of the last index src.
      2b. If we hit next & we are on the last image, set src to the value of the first index src.
    3. Check our currentSrc against the current index src value until we get a match.
    4. Return the value of currentSrc */

function nextImage() {
    for (i = 0; i < galleryDB.length; i++) {
        var firstImage = galleryDB[0].src,
            lastImage = galleryDB[galleryDB.length - (videoCount + 1)].src;
        if (prevClicked && currentSrc === galleryDB[i].src) {
            if (currentSrc === firstImage) {
                currentSrc = lastImage;
                return currentSrc;
            } else {
                currentSrc = galleryDB[(i - 1)].src;
                return currentSrc;
            }
        } else if (nextClicked && currentSrc === galleryDB[i].src) {
            if (currentSrc === lastImage) {
                currentSrc = firstImage;
                return currentSrc;
            } else {
                currentSrc = galleryDB[(i + 1)].src;
                return currentSrc;
            }
        }
    }
}

// Function for updating the currentSrc using nextImage() and animating the transition between images in the lightbox.
function updateImage() {
    currentSrc = nextImage();
    $lbImage.velocity({
        opacity: 0
    }, 150, function() {
        $lbImage.velocity({
            opacity: 1
        }, 150).attr('src', currentSrc);
    });
}

function updateDescription() {
    for (i = 0; i < galleryDB.length; i++) {
        if (currentSrc === galleryDB[i].src) {
            $('.image-description').text(galleryDB[i].caption);
        }
    }
}

function filterResults(index) {
    var galleryItem = $('#item' + (index + 1));

    // If the index isMatched, return to default values.
    if (galleryDB[index].isMatched) {
        galleryItem.velocity({
            bottom: 0
        }, {
            duration: 250,
            display: "inline-block"
        });
    } else {
        // If the index is not matched, slide them downwards and hide the element.
        galleryItem.velocity({
            bottom: -204
        }, {
            duration: 250,
            display: "none"
        });
    }
}

function resetFilter() {
    for (var i = 0; i < galleryDB.length; i++) {
        galleryDB[i].isMatched = true;
        filterResults(i);
    }
}

$(document).ready(function() {

    $('body').append($lightbox);

    for (var i = 0; i < galleryDB.length; i++) {
        // Give each of our objects an ID.
        galleryDB[i].id = i + 1;
        // Pass object into assembleImage to build gallery.
        assembleImage(galleryDB[i]);
    }

    /*  Image Filtering - Main Search on keyup.
          a. Store users input converted to lower case in userInput.
          b. Test if userInput.length is > 0, so we can be sure the user has entered some text.
          c. Loop through galleryDB and test the following:
              1. If any of the galleryDB.title's contain the userInput.
              2. If userInput parsed as an integer matches any of the galleryDB.id's.
              3. When match is found, set isMatched = true. Else set it to false.
          d. Call filterResults if search field contains input, else call resetFilter. */

    $mainSearch.on('keyup', function() {
        var userInput = $mainSearch.val().toLowerCase(),
            results = 0;

        if (userInput.length > 0) {
            for (var i = 0; i < galleryDB.length; i++) {
                if (galleryDB[i].caption.toLowerCase().indexOf(userInput) !== -1 || parseInt(userInput) === galleryDB[i].id || galleryDB[i].type === userInput) {
                    results++;
                    galleryDB[i].isMatched = true;
                } else {
                    galleryDB[i].isMatched = false;
                }
                filterResults(i);
            }
            if (results === 0) {
                $('#results').text('No results found.');
            } else if (results === 1) {
                if ($('#results').css('visibility') === 'hidden') {
                    // This only occurs if the user is searching by id.
                    $('#results').velocity({
                        opacity: 1
                    }, {
                        visibility: 'visible',
                        duration: 250
                    });
                }
                $('#results').text('Found it!');
            } else {
                $('#results').text(results + ' results found.').velocity({
                    opacity: 1
                }, {
                    visibility: 'visible',
                    duration: 250
                });
            }
            $('#rsltimg').css("filter", "grayscale(0)");
        } else {
            resetFilter();
            results = 0;
            $('#results').velocity({
                opacity: 0
            }, {
                visibility: 'hidden',
                duration: 250
            });
            $('#rsltimg').css("filter", "grayscale(80%)");
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
    });

    // Lightbox control functions

    // Previous
    $controls.children('#prev').on('click', function() {
        prevClicked = true;
        nextClicked = false;
        updateImage();
        updateDescription();
    });

    // Next
    $controls.children('#next').on('click', function() {
        prevClicked = false;
        nextClicked = true;
        updateImage();
        updateDescription();
    });

    // Maximize
    $controls.children('#maximize').on('click', function() {
        var $windowWidth = $(window).width();
        var maximizeLightbox = [
            {
                e: $lbContainer,
                p: {
                    maxWidth: $windowWidth
                },
                o: {
                    duration: 500
                }
            }, {
                e: $('#maximize'),
                p: {
                    opacity: 0
                },
                o: {
                    duration: 250,
                    display: 'none',
                    sequenceQueue: false
                }
            }, {
                e: $('#minimize'),
                p: {
                    opacity: 1
                },
                o: {
                    duration: 250,
                    display: 'inline-block',
                    sequenceQueue: false
                }
            }
        ];
        $.Velocity.RunSequence(maximizeLightbox);
        isMaximized = true;
    });

    // Minimize
    $controls.children('#minimize').on('click', function() {
        var minimizeLightbox = [
            {
                e: $lbContainer,
                p: {
                    maxWidth: 1000
                },
                o: {
                    duration: 500
                }
            }, {
                e: $('#minimize'),
                p: {
                    opacity: 0
                },
                o: {
                    duration: 250,
                    display: 'none',
                    sequenceQueue: false
                }
            }, {
                e: $('#maximize'),
                p: {
                    opacity: 1
                },
                o: {
                    duration: 250,
                    display: 'inline-block',
                    sequenceQueue: false
                }
            }
        ];
        $.Velocity.RunSequence(minimizeLightbox);
        isMaximized = false;
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
                marginTop: -49
            }, {
                duration: 350,
                visibility: "hidden"
            });
        } else {
            $('#hotkey-info').velocity({
                marginTop: 4
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
                    break;
                case 37: // Left Arrow
                    $controls.children('#prev').trigger('click');
                    break;
                case 39: // Right Arrow
                    $controls.children('#next').trigger('click');
                    break;
                case 77: // 'm'
                    if (isMaximized) {
                        $controls.children('#minimize').trigger('click');
                    } else {
                        $controls.children('#maximize').trigger('click');
                    }
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
