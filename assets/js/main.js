import { getSongList } from "./songbook.js";

const siteUrl = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.indexOf('.html'))

switch (siteUrl) {
    case 'index':
        getSongList()
        break
}

document.querySelector('#search').addEventListener('click', () => {
    console.log('Du har trykket på søg');
    getSongList(true)
})