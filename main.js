'use strict';



// SPOTIFY VERSION

const CLIENT_ID = `b8610b1c7d8d4cd49648964d156983a4`;
// CLIENT SECRET: 2e993016563d4281a5b1e98f8db936f9


let genreList = [];

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
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
    $('.spotify-sign-btn').on('click', function () {
        $('.auth-link').attr('href', url);
        console.log(url);
    });
};

function getUserData(user) {
    fetch(`https://api.spotify.com/v1/me`).then(response => {
            if (response.ok) {
                console.log(response.json());
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
            console.log(`shit, this didn't work!`);
        }
    }).then(text => {
        for (let i = 0; i < text.genres.length; i++) {
            genreList.push(text.genres[i]);
        }
    });
}

function getSongData(query, type, access_tk) {
    let headers = new Headers();
    headers.append('Authorization', `${access_tk}`);
    let url = `https://api.spotify.com/v1/search?query=${query}&type=${type}&market=US&offset=0&limit=20`;
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${access_tk}`,
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(`shit, this didn't work!`);
        }
    }).then(function (text) {
        getTopTracks(text, access_tk);
        displayArtistData(text);
        console.log(text);

    });
}


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
        // for (let i = 0; i < text.tracks.length; i++) {
        //     console.log(`${text.tracks[i].name} & ${text.tracks[i].popularity}`);
        // }
        displayTopTrack(text);
        console.log(text.tracks);
    });
}

const htmlTableInit = () => {
    $('.results').empty();
    $('.results').append(`
    <table class="results-table">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Followers</th>
                <th>URL</th>
                <th>Top Track</th>
            </tr>
        </thead>
        <tbody class="results-artists">
        </tbody>
    </table>
    `);
};


function displayTopTrack(track) {
    $('.top-track-link').text(`${track.tracks[0].name}`);
    $('.top-track-link').attr(`href`,`${track.tracks[0].external_urls.spotify}`);
}



function displayArtistData(text) {
    htmlTableInit(text);
    for (let i = 0; i < text.artists.items.length; i++) {
        $('.results-artists').append(`
        <tr>
            <td>${i+1}</td>
            <td>${text.artists.items[i].name}</td>
            <td>${text.artists.items[i].genres[i]}</td>
            <td>${text.artists.items[i].followers.total.toLocaleString()}</td>
            <td><a href=${text.artists.items[i].external_urls.spotify} target="_blank">Spotify</a></td>
            <td><a href="#" target="_blank" class="top-track-link">$</a></td>
        </tr>
        `);
    }
}



// AUTOCOMPLETE SEARCH




const mainApp = (clientID) => {
    userAuthorize(clientID);
    let userData = getHashParams();
    getGenres(userData.access_token);
    $('main').append(`<div class="results">
        </div>`);
    $('input[type=submit]').on('click', function (event) {
        event.preventDefault();
        let songSearch = $('input[type=text]').val();
        getSongData(songSearch, `artist`, userData.access_token);
        console.log(genreList);

    });
    console.log('the main app is working');

};


mainApp(CLIENT_ID);