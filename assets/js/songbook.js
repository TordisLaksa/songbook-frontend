import { myFetch } from './helper.js'

const mainSongs = document.querySelector('#mainSongs');

const getSongList = async () => {
    reset()

    //url variabel
    let strUrl;
    //Henter GET Params 
    const urlParams = new URLSearchParams(window.location.search);
    //Sætter variabel til array params (et array af de parametre jeg skal bruge)
    const arrParams = [];

    // Tjekker om keyword er sat i url params og definerer endpoint url
    if (urlParams.has('keyword')) {
        strUrl = `http://localhost:3000/api/songs/search`
        arrParams.push(`keyword=${urlParams.get('keyword')}`)
    } else {
        strUrl = 'http://localhost:3000/api/songs';
    }


    //tjekker om keyword er sat i url params og definerer endpoint url
    if (urlParams.has('orderby') || urlParams.has('limit') || urlParams.has('keyword')) {
        //tilføjer query string til url
        strUrl += '?'

        //tilføjer order by og direction til arrParams hvis de findes i url'en
        if (urlParams.has('orderby')) {
            arrParams.push(`orderby=?${urlParams.get('orderby')}`);
            if (urlParams.has('dir')) {
                arrParams.push(`dir=${urlParams.get('dir')}`);
            }
        }
        //tilføjer limit til arrParams hvis det findes i url'en
        if (urlParams.has('limit')) {
            arrParams.push(`limit=${urlParams.get('limit')}`);
        }
    }

    console.log(arrParams.join('&'));
    //Bygger endpoint url med string og join metode
    const strEndpoint = strUrl += arrParams.join('&')
    console.log(strEndpoint);

    //kalder fetch med mit api som endpoint
    const data = await myFetch(strEndpoint)

    const div = document.createElement('div')
    div.classList.add('listwrapper')

    const h2 = document.createElement('h2')
    h2.innerText = 'Oversigt'
    div.append(h2);

    const table = document.createElement('table')
    const trow = document.createElement('tr')

    const th1 = document.createElement('th')
    th1.innerText = 'ID'

    const th2 = document.createElement('th')
    th2.innerText = 'Title'

    const th3 = document.createElement('th')
    th3.innerText = ('Handling')

    trow.append(th1, th2, th3)
    table.append(trow)

    //Mapper data
    data.map(function (item, key) {
        //Definerer div wrapper
        const trow = document.createElement('tr')

        const tdata1 = document.createElement('td')
        tdata1.innerText = item.id
        // trow.append(tdata1)

        const tdata2 = document.createElement('td')
        const link = document.createElement('a')
        link.innerText = item.title

        //click event kalder detalje funktion med målets id
        link.addEventListener('click', () => {
            getSongDetails(item.id);
        })

        //Appender link og wrapper
        tdata2.append(link)
        trow.append(tdata1, tdata2);

        const tdata3 = document.createElement('td')
        const a = document.createElement('a')
        const i = document.createElement('i')
        i.classList.add('fas', 'fa-trash')
        a.append(i)
        tdata3.append(a)

        {/* <i class="fas fa-pencil-alt"></i> */ }
        const edit = document.createElement('a')
        edit.classList.add('edit')
        edit.addEventListener('click', () => {
            editSong(item.id)
        })
        tdata3.append(edit)

        const del = document.createElement('a');
        del.classList.add('del')
        del.addEventListener('click', () => {
            if (confirm(`Vil du slette sangen ${item.title} fra sangbogen?`)) {
                deleteSong(item.id)
            }
        })

        trow.append(tdata3)
        table.append(trow)
    })
    div.append(table)
    mainSongs.append(div)
}

/**
 * Funktionsvariabel til at hente detaljer
 * @param {number} song_id 
 */
const getSongDetails = async song_id => {
    reset();

    //kalder data
    const data = await myFetch(`http://localhost:3000/api/songs/${song_id}`)

    const div = document.createElement('div')
    div.classList.add('detailwrapper')

    const h2 = document.createElement('h2')
    h2.innerText = data.title

    const h3 = document.createElement('h3')
    h3.innerHTML = data.artist.name;

    const pre = document.createElement('pre')
    pre.innerHTML = data.content;

    div.append(h2, h3, pre)
    mainSongs.append(div)
}
/**
 * Funktionsvariabel til at slette
 * @param {number} song_id 
 */
const deleteSong = async song_id => {
    reset();

    let options = {
        method: 'DELETE'
    }

    // Kalder data
    const data = await myFetch(`http://localhost:3000/api/songs/${song_id}`, options);

    window.location.reload()
}

function reset() {
    mainSongs.innerHTML = '';
}




export { getSongList, getSongDetails, deleteSong }