'use strict';



// SPOTIFY VERSION

// CLIENT ID: b8610b1c7d8d4cd49648964d156983a4
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
            console.log(text.genres[i]);
        }
    });
}

const htmlTableInit = text => {
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
            </tr>
        </thead>
        <tbody class="results-artists">
        </tbody>
    </table>
    `);
};

function genreFilter(text, genre) {
    console.log(text.artists.items.genres.filter(genre));
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




const mainApp = () => {
    let userData = getHashParams();
    $('main').append(`<div class="results">
        </div>`);
    $('input[type=submit]').on('click', function (event) {
        event.preventDefault();
        let songSearch = $('input[type=text]').val();
        getSongData(songSearch, `artist`, userData.access_token);
        getGenres(userData.access_token);

    });
    console.log('the main app is working');

};

mainApp();