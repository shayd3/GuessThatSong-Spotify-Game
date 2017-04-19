var _baseUrl = 'https://api.spotify.com/v1/';
var _artistImg;
var _artistName;
var _artistUri;
var _artistID;
var _artistTopTracks;
var audioObject = null;
var correct = 0;
var wrong = 0;
var score;

$(document).ready(function () {
    $('#search').click(function () {
        searchArtists($('#query').val());
    });

    $('#game-start').click(function () {
        $(this).hide();
        $('#game-reset').show();

        $.ajax({
            url: _baseUrl + "artists/" + _artistID + '/top-tracks',
            dataType: "json",
            data: {
                country: "US",
            },
            success: function (response) {
                var data = response;

                _artistTopTracks = data.tracks;

                _artistTopTracks = shuffleArray(_artistTopTracks);

                $.each(_artistTopTracks, function (index, value) {
                    $('#spotify-game').append("<i class='fa fa-play-circle-o play-btn' aria-hidden='true' value='" + index + "'></i>&nbsp&nbsp<input type='text' id='" + index + "' class='form-control' style='width:50%; display:inline-block' placeholder='Guess the song!' > <br>");

                    $('#spotify-game').click(function (e) {
                        var target = e.target;
                        if (target !== null && target.classList.contains('play-btn')) {
                            if (audioObject) {
                                audioObject.pause();
                            }
                            audioObject = new Audio(getPreviewTrack(target.getAttribute("value")));
                            audioObject.play();
                            target.classList.add('playing');

                            audioObject.addEventListener('ended', function () {
                                target.classList.remove('playing');
                            });
                            audioObject.addEventListener('pause', function () {
                                target.classList.remove('playing');
                            });
                        }

                    })
                })
                $('#spotify-game').append("<input type='submit' id='submit-answers' class='btn' value='Submit'>")
                
                $('#submit-answers').click(function () {
                    console.log('I was clicked!');
                    $('#spotify-game input.form-control').each(function (index) {
                        if ($(this).val().toLowerCase() == _artistTopTracks[index].name.toLowerCase()) {
                            correct += 1;
                        }
                    });
                    score = correct + "/10";
                    $('#spotify-game').hide();

                    $('#spotify-game-results').append("<h1>Results</h1>" + 
                                                      "<h2>Score: " + score + "</h2>"+
                                                      "<h2>Answers: </h2>");
                    for(var i = 0; i < _artistTopTracks.length; i++){
                        $('#spotify-game-results').append("<h3>"+ (i+1) + ".) "+ _artistTopTracks[i].name +"</h3>");

                    }
                    $('#spotify-game-results').show();
                });
            }
        });


        $('#spotify-game').show();

    });



    $('#game-reset').click(function () {
        $(this).hide();
        $('#game-start').hide();
        $('#spotify-search').show();
        $('#artist-img').html("");
        $('#artist-info').html("");
        $('#spotify-game').html("");
        $('#spotify-game-results').html("").hide();
        score = "";
        correct = 0;
        wrong = 0;
    });
})

function shuffleArray(array){
    var curIndex = array.length, temp, randIndex;
      while (0 !== curIndex) {

        randIndex = Math.floor(Math.random() * curIndex);
        curIndex -= 1;

        temp = array[curIndex];
        array[curIndex] = array[randIndex];
        array[randIndex] = temp;
      }
      return array;
}

var getPreviewTrack = function (i) {
    return _artistTopTracks[i].preview_url;
}

var searchArtists = function (query) {
    $.ajax({
        url: _baseUrl + 'search',
        dataType: "json",
        data: {
            q: query,
            type: 'artist',
            limit: 1
        },
        success: function (response) {
            var data = response;

            $('#artist-img').html("");
            $('#artist-info').html("");

            if (data.artists.items.length == 1) {
                _artistImg = data.artists.items[0].images[0].url;
                _artistName = data.artists.items[0].name;
                _artistUri = data.artists.items[0].uri;
                _artistID = data.artists.items[0].id;

                $('#artist-img').append("<img src='".concat(_artistImg, "'/>"));
                $('#artist-info').append("<h1>".concat(_artistName, "</h1>"));
                $('#query').val("");
                $('#spotify-search').hide();
                $('#game-start').show();
            } else {

                $('#artist-img').append("<h2 style='color: white;'>Artist not found! Please try again!</h2>");
            }
        },
        error: function (req, status, error) {
            alert("Error: " + req.responseText + " | " + status + " | " + error);
        }
    })
};