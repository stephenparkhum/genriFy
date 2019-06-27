'use strict';

// LAST FM VERSION

// Application name	genriFy
// API key	13f28f92c32ac8d35dec5cfb09999ddb
// Shared secret	6c5fc27db015656c88f17efaf4aee489
// Registered to	Parkhum

// GET TAGS
// http://ws.audioscrobbler.com/2.0/


let url = '';
const searchTypes = {
    'artist_search': 'artists',
};

const myCreds = {
    'api_key': '13f28f92c32ac8d35dec5cfb09999ddb',
    'sec_key': '6c5fc27db015656c88f17efaf4aee489'
};

const displayResults = (response) => {
    $('.results').empty();
    let listenerSort = [];
    for (let i = 0; i < response.results.artistmatches.artist.length; i++) {
        listenerSort.push(`artist: ${response.results.artistmatches.artist[i].name}`);
        console.log(response.results.artistmatches.artist.sort((a, b) => a.listeners - b. listenerSort));
        $('.results').append(`
        <img src="${response.results.artistmatches.artist[i].image[1]["#text"]}" alt="${response.results.artistmatches.artist[i].name}"/><br />
        <h3>${response.results.artistmatches.artist[i].name}</h3>
        <p>${response.results.artistmatches.artist[i].listeners}</p>
        <a href=${response.results.artistmatches.artist[i].url} target="_blank">Last.FM Link</a>
        `);
    }
};

const lowLevelResults = (response) => {
    $('.results').append(`<h1>Bitches</h1>`);
};

const getResults = (creds, artist) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${creds.api_key}&format=json`)
  .then(response => {
      if (response.ok) {
        return response.json();
      }
  })
  .then(text => {
      displayResults(text);
    console.log(text.results.artistmatches);
    console.log('Request successful', text);
  })
  .catch(function(error) {
    console.log('Request failed', error);
  });
};

const mainApp = (creds) => {
    $('input[type=submit]').on('click', function(e) {
        event.preventDefault();
        let userInput = $('input[type=text]').val();
        getResults(creds, userInput);
    });
};

mainApp(myCreds);