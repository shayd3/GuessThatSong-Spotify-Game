var _baseUrl = 'https://api.spotify.com/v1/';
var _artistImg;
var _artistName;
var _artistUri;
var _artistID;
var _artistTopTracks;

$(document).ready(function(){
    $('#search').click(function(){
        searchArtists($('#query').val());
    });

    $('#game-start').click(function(){
        $(this).hide();
        $('#game-reset').show();

        $.ajax({
            url: _baseUrl + "artists/"+ _artistID + '/top-tracks',
            dataType: "json",
            data:{
                country: "US",
            },  
            success: function(response){
                var data = response;
                _artistTopTracks = [data.tracks.length];

                for(var i = 0; i < _artistTopTracks.length; i++){
                    _artistTopTracks[i] = data.tracks[i];
                }

                for(var i = 0; i < _artistTopTracks.length; i++)
                    $('#spotify-game').append("<iframe src='https://embed.spotify.com/?uri=".concat(_artistTopTracks[i].uri,"' width='80' height='80' frameborder='0' allowtransparency='true'></iframe>"));

            }
        })

        $('#spotify-game').show();

    });

    $('#game-reset').click(function(){
        $(this).hide();
        $('#game-start').hide();
        $('#spotify-search').show();
        $('#artist-img').html("");
        $('#artist-info').html("");
    });
})

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

            if(data.artists.items.length == 1){
                _artistImg = data.artists.items[0].images[0].url;
                _artistName = data.artists.items[0].name;
                _artistUri = data.artists.items[0].uri;
                _artistID = data.artists.items[0].id;
                
                $('#artist-img').append("<img src='".concat(_artistImg,"'/>"));
                $('#artist-info').append("<h1>".concat(_artistName ,"</h1>"));
                $('#query').val("");
                $('#spotify-search').hide();
                $('#game-start').show();
            } else {

                $('#artist-img').append("<h2 style='color: white;'>Artist not found! Please try again!</h2>");
            }
        },
        error: function(req, status, error){
            alert("Error: " + req.responseText + " | " + status + " | " + error);
        }
    })
};


