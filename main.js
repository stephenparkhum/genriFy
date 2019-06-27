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
        displayArtistData(text);
        getTopTracks(text, access_tk);
        console.log(text);

    });
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

function getTopTracks(artist, access_tk) {
    let artist_id = artist.items[0].id;
    let url = `https://api.spotify.com/v1/artists/${artist_id}/top-tracks`;
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${access_tk}`,
        })
    }).then(response => {
        if (response.ok) {
            console.log(response.json());
            return response.json();
        } else {
            console.log(`shit, this didn't work!`);
        }
    }).then(text => {
        console.log(`track working`);
    });
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
            <td><a href=${text.artists.items[i].external_urls.spotify} target="_blank">Spotify</a></td>
        </tr>
        `);


        //     $('.results').append(`
        //     <h1>${text.artists.items[i].name}</h1>
        //     <img src=${text.artists.items[i].images[1].url} alt="${text.artists.items[i].name} Photo"/>
        //     <p>Genres: ${text.artists.items[i].genres[i]}</p>
        //     <p>Followers: ${text.artists.items[i].followers.total.toLocaleString()}</p>
        //     <p>Popularity Rating: ${text.artists.items[i].popularity}</p>
        // `);
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