'use strict';



// SPOTIFY VERSION

const CLIENT_ID = `b8610b1c7d8d4cd49648964d156983a4`;
let genreList = [];


// LANDING PAGE
function hideLandingPage() {
    $('.landing-btn').on('click', function() {
        $('#landing-overlay').remove();
        $('header').show();
        $('main').show();
    });
}

hideLandingPage();

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

const userAuthorize = (clientId) => {
    let redirect = `http://localhost:5500`;
    // let redirect = `https://stephenparkhum.github.io/genriFy/`;
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
    $('.spotify-sign-btn').on('click', function () {
        $('.auth-link').attr('href', url);
        // console.log(url);
    });
};

function getUserData(user) {
    fetch(`https://api.spotify.com/v1/me`).then(response => {
            if (response.ok) {
                // console.log(response.json());
                displayUserData(response.json());
                return response.json();

            }
        })
        .then(responseJson => displayUserData(responseJson));
}


function getGenres(access_tk) {
    let headers = new Headers();
    headers.append('Authorization', `${access_tk}`);
    let url = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${access_tk}`,
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(`The 'getGenres' function is not working!`);
        }
    }).then(text => {
        for (let i = 0; i < text.genres.length; i++) {
            genreList.push(text.genres[i].toUpperCase());
        }
    });
}

// SEARCH BY GENRE
function genreSearch(query, type, access_tk) {
    let headers = new Headers();
    headers.append('Authorization', `${access_tk}`);
    let url = `https://api.spotify.com/v1/search?q=%20genre:%22${query}%22&type=${type}&limit=50`;
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${access_tk}`,
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(`The 'genreSearch' function is not working!`);
        }
    }).then(function (text) {
        if (text.artists.total > 0) {
            let popList = [];
            for (let i = 0; i < text.artists.items.length; i++) {
                popList.push(text.artists.items[i]);
            }
            popList.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
            sortByGenre(popList);
            
        } else {
            $('.results').empty();
            $('.results').append(`<p>We're sorry! There are no artists matching that <em>exact</em> genre.</p>`);
        }
        
    });
}

function sortByGenre(text) {
    htmlTableInit();
    for (let i = 0; i < text.length; i++) {
        $('.results-artists').append(`
        <tr>
            <td>${i+1}</td>
            <td>${text[i].name}</td>
            <td>${text[i].followers.total.toLocaleString()}</td>
            <td><a href=${text[i].external_urls.spotify} target="_blank">Spotify</a></td>
        </tr>
        `);
    }
}



// function getSongData(query, type, access_tk) {
//     let headers = new Headers();
//     headers.append('Authorization', `${access_tk}`);
//     let url = `https://api.spotify.com/v1/search?query=${query}&type=${type}&market=US&offset=0&limit=50`;
//     fetch(url, {
//         method: 'GET',
//         headers: new Headers({
//             'Authorization': `Bearer ${access_tk}`,
//         })
//     }).then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             console.log(`shit, this didn't work!`);
//         }
//     }).then(function (text) {
        
//         displayArtistData(text);
//     });
// }


function getTopTracks(artist, access_tk) {
    let headers = new Headers();
    headers.append('Authorization', `${access_tk}`);
    let artist_id = artist.artists.items[0].id;
    let url = `https://api.spotify.com/v1/artists/${artist_id}/top-tracks?country=US`;
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${access_tk}`,
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(`top tracks didn't work!`);
        }
    }).then(text => {
        displayTopTrack(text);
    });
}

// HTML DISPLAY & FORMATTING
// These functions handle displaying the artist's data in HTML format

const htmlTableInit = () => {
    $('.results').empty();
    $('.results').append(`
    <table class="results-table">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Artist</th>
                <th>Followers</th>
                <th>Profile</th>
            </tr>
        </thead>
        <tbody class="results-artists">
        </tbody>
    </table>
    `);
};

function displayTopTrack(track) {
    $('.top-track-link').text(`${track.tracks[0].name}`);
    $('.top-track-link').attr(`href`, `${track.tracks[0].external_urls.spotify}`);
}

function displayArtistData(text) {
    htmlTableInit(text);
    for (let i = 0; i < text.artists.items.length; i++) {
        $('.results-artists').append(`
        <tr>
            <td>${i+1}</td>
            <td>${text.artists.items[i].name}</td>
            <td>${text.artists.items[i].genres[0]}</td>
            <td>${text.artists.items[i].popularity}</td>
            <td><a href=${text.artists.items[i].external_urls.spotify} target="_blank">Spotify</a></td>
        </tr>
        `);
    }
}


// GENRE SORT TESTS

const mainApp = (clientID) => {
    userAuthorize(clientID);
    let userData = getHashParams();
    getGenres(userData.access_token);
    $('main').append(`<div class="results">
        </div>`);
    $('.results').append('<p>Search for a genre here!<i class="fas fa-arrow-up" style="padding-left: 15px; font-size: 30px;"></i></p>');
    $('input[type=submit').on('click', function (event) {
        event.preventDefault();
        let genreSearchInput = $('input[type=text]').val();
        genreSearch(genreSearchInput, `artist`, userData.access_token);

    });
};


mainApp(CLIENT_ID);