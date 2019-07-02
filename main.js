'use strict';
// genriFy 

const CLIENT_ID = `b8610b1c7d8d4cd49648964d156983a4`;


// LANDING PAGE
function hideLandingPage() {
    $('.landing-btn').on('click', function () {
        $('#landing-overlay').remove();
        $('header').show();
        $('main').show();
    });
}

// USER AUTHORIZIATION
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
    // let redirect = `http://localhost:5500/search.html`;
    let redirect = `https://stephenparkhum.github.io/genriFy/search.html`;
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
    $('.spotify-sign-btn').on('click', function () {
        $('.auth-link').attr('href', url);
    });
};

// GENRE SEARCHES
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
            $(`.results`).empty();
            $(`.results`).append(`
            <p>Please sign in to <span class="spotify-color">Spotify</span> before searching!</p>
            `);
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
    }).catch(error => {
        if (error.status == 401) {
            console.log(`You haven't logged in to Spotify yet!`);
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
                <th>Listen</th>
            </tr>
        </thead>
        <tbody class="results-artists">
        </tbody>
    </table>
    `);
};

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

const mainApp = (clientID) => {
    hideLandingPage();
    userAuthorize(clientID);
    let userData = getHashParams();
    $('main').append(`<div class="results">
        </div>`);
    $('.results').append('<p>Sign in to Spotify then search for a genre here!<i class="fas fa-arrow-up" style="padding-left: 15px; font-size: 30px;"></i></p>');
    $('input[type=submit').on('click touchend', function (event) {
        event.preventDefault();
        let genreSearchInput = $('input[type=text]').val();
        genreSearch(genreSearchInput, `artist`, userData.access_token);
        return false;

    });
};


mainApp(CLIENT_ID);