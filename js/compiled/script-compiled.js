var player,videoId,currentSrc,videoTitle,currentVideo,videoCount=0,$mainSearch=$("#main-search"),$songBar=$("#song-container"),$lightbox=$("#lightbox"),$lbContainer=$(".lightbox-container"),$lbImage=$(".selected"),$controls=$("#controls"),$toggle=$("#toggle"),controlBarExtended=!0,lightboxIsActive=!1,isMaximized=!1,prevClicked=!1,nextClicked=!1,recentlyPlayed=[],tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);
function onYouTubeIframeAPIReady(){for(var a=0;a<galleryDB.length;a++)"yt"===galleryDB[a].type&&(player=new YT.Player("item"+galleryDB[a].id,{videoId:galleryDB[a].videoID,events:{onReady:onPlayerReady,onStateChange:onPlayerStateChange}}),videoCount++);document.getElementById("pause").addEventListener("click",function(){currentVideo.pauseVideo()});document.getElementById("play").addEventListener("click",function(){currentVideo.playVideo()});document.getElementById("replay").addEventListener("click",
function(){currentVideo.seekTo(0)})}function updatePlayerReference(a){currentVideo=a.target;videoTitle=currentVideo.getVideoData().title;videoId=currentVideo.getVideoData().video_id}function onPlayerReady(a){updatePlayerReference(a);for(a=0;a<galleryDB.length;a++)galleryDB[a].videoID===videoId&&(galleryDB[a].caption=videoTitle)}
function onPlayerStateChange(a){var b=[{e:$("#play"),p:{opacity:0},o:{duration:50,visibility:"hidden"}},{e:$("#pause"),p:{opacity:1},o:{duration:50,visibility:"visible",sequenceQueue:!1}}],d=[{e:$("#pause"),p:{opacity:0},o:{duration:50,visibility:"hidden"}},{e:$("#play"),p:{opacity:1},o:{duration:50,visibility:"visible",sequenceQueue:!1}}];a.data==YT.PlayerState.PLAYING?(updatePlayerReference(a),$("#currentThumbnail").attr("src","https://img.youtube.com/vi/"+videoId+"/mqdefault.jpg"),$("#currentSong").text(videoTitle),
$.Velocity.RunSequence(b),recentlyPlayed.unshift(currentVideo),2<recentlyPlayed.length&&recentlyPlayed.pop()):null!==currentVideo&&(2!==currentVideo.getPlayerState()&&0!==currentVideo.getPlayerState()||$.Velocity.RunSequence(d));2===recentlyPlayed.length&&1===recentlyPlayed[0].getPlayerState()&&1===recentlyPlayed[1].getPlayerState()&&recentlyPlayed[0].getVideoData().video_id!=recentlyPlayed[1].getVideoData().video_id&&recentlyPlayed[1].pauseVideo()}
$toggle.on("click",function(){var a=[{e:$songBar,p:{height:48,bottom:0},o:{duration:350}},{e:$toggle,p:{rotateZ:0,scaleX:1,scaleY:1,top:0},o:{duration:100,sequenceQueue:!1}}],b=[{e:$songBar,p:{height:0,bottom:-3},o:{duration:150}},{e:$toggle,p:{rotateZ:180,scaleX:2,scaleY:2,top:-40},o:{duration:100,sequenceQueue:!1}}];controlBarExtended?($.Velocity.RunSequence(b),$("#toggle").addClass("showbar"),controlBarExtended=!1):($.Velocity.RunSequence(a),$("#toggle").removeClass("showbar"),controlBarExtended=
!0)});
function assembleImage(a){var b=$('<div class="gallery-item"></div>');if("img"===a.type){var d=$('<div class="layer-top"></div>'),c=$('<div class="layer-bottom"></div>'),h=$('<img src="'+a.thumbnail+'">'),e=$('<a href="'+a.src+'"></a>'),f=$('<div class="details"></div>'),g=$('<span class="title"></span>'),k=$('<i class="fa fa-expand fa-3x" aria-hidden="true"></i>'),l=$('<span class="resolution">'+a.resolution+"</span>"),m=$('<span class="image-id">ID - '+a.id+"</span>");d.append(h);g.append(a.title);f.append(k,
g,l,m);e.append(f);c.append(e);b.append(d,c)}b.attr("id","item"+a.id);$("#gallery").append(b)}function nextImage(){for(i=0;i<galleryDB.length;i++){var a=galleryDB[0].src,b=galleryDB[galleryDB.length-(videoCount+1)].src;if(prevClicked&&currentSrc===galleryDB[i].src)return currentSrc=currentSrc===a?b:galleryDB[i-1].src;if(nextClicked&&currentSrc===galleryDB[i].src)return currentSrc=currentSrc===b?a:galleryDB[i+1].src}}
function updateImage(){currentSrc=nextImage();$lbImage.velocity({opacity:0},150,function(){$lbImage.velocity({opacity:1},150).attr("src",currentSrc)})}function updateDescription(){for(i=0;i<galleryDB.length;i++)currentSrc===galleryDB[i].src&&$(".image-description").text(galleryDB[i].caption)}function filterResults(a){var b=$("#item"+(a+1));galleryDB[a].isMatched?b.velocity({bottom:0},{duration:250,display:"inline-block"}):b.velocity({bottom:-204},{duration:250,display:"none"})}
function resetFilter(){for(var a=0;a<galleryDB.length;a++)galleryDB[a].isMatched=!0,filterResults(a);results=0;$("#rsltimg").css("filter","grayscale(80%)");$("#results").velocity({opacity:0},{visibility:"hidden",duration:250})}
$(document).ready(function(){$("body").append($lightbox);for(var a=0;a<galleryDB.length;a++)galleryDB[a].id=a+1,assembleImage(galleryDB[a]);$mainSearch.on("keyup",function(){var a=$mainSearch.val().toLowerCase(),d=0;if(0<a.length){for(var c=0;c<galleryDB.length;c++)-1!==galleryDB[c].caption.toLowerCase().indexOf(a)||parseInt(a)===galleryDB[c].id||galleryDB[c].type===a?(d++,galleryDB[c].isMatched=!0):galleryDB[c].isMatched=!1,filterResults(c);0===d?($("#results").text("No results found."),$("#rsltimg").css("filter",
"grayscale(80%)")):1===d?$("#results").text("Found it!"):$("#results").text(d+" results found.");1<=d&&$("#rsltimg").css("filter","grayscale(0)");"hidden"===$("#results").css("visibility")&&$("#results").velocity({opacity:1},{visibility:"visible",duration:250})}else resetFilter()});$(".layer-bottom a").on("click",function(a){a.preventDefault();currentSrc=$(this).attr("href");$lbImage.attr("src",currentSrc);updateDescription();lightboxIsActive=!0;$lightbox.velocity({opacity:1},{duration:75,display:"block"})});
$controls.children("#prev").on("click",function(){prevClicked=!0;nextClicked=!1;updateImage();updateDescription()});$controls.children("#next").on("click",function(){prevClicked=!1;nextClicked=!0;updateImage();updateDescription()});$controls.children("#maximize").on("click",function(){var a=$(window).width(),a=[{e:$lbContainer,p:{maxWidth:a},o:{duration:500}},{e:$("#maximize"),p:{opacity:0},o:{duration:250,display:"none",sequenceQueue:!1}},{e:$("#minimize"),p:{opacity:1},o:{duration:250,display:"inline-block",
sequenceQueue:!1}}];$.Velocity.RunSequence(a);isMaximized=!0});$controls.children("#minimize").on("click",function(){var a=[{e:$lbContainer,p:{maxWidth:1E3},o:{duration:500}},{e:$("#minimize"),p:{opacity:0},o:{duration:250,display:"none",sequenceQueue:!1}},{e:$("#maximize"),p:{opacity:1},o:{duration:250,display:"inline-block",sequenceQueue:!1}}];$.Velocity.RunSequence(a);isMaximized=!1});$controls.children("#close").on("click",function(){$lightbox.velocity({opacity:0},{duration:75,display:"none"});
lightboxIsActive=!1});$("#help").on("click",function(){"visible"===$("#hotkey-info").css("visibility")?$("#hotkey-info").velocity({marginTop:-49},{duration:350,visibility:"hidden"}):$("#hotkey-info").velocity({marginTop:4},{duration:350,visibility:"visible"})});$(document).keyup(function(a){a=a.which;if(lightboxIsActive)switch(a){case 27:$lightbox.velocity({opacity:0},{duration:75,display:"none"});lightboxIsActive=!1;break;case 37:$controls.children("#prev").trigger("click");break;case 39:$controls.children("#next").trigger("click");
break;case 77:isMaximized?$controls.children("#minimize").trigger("click"):$controls.children("#maximize").trigger("click")}else switch(a){case 192:$toggle.trigger("click")}})});