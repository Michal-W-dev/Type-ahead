const searchInput = document.querySelector('.search')
const suggestions = document.querySelector('.suggestions')


const url = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = [];

const req = fetch(url)
    .then(res => res.json())
    .then(data => cities.push(...data))
    .catch((err) => console.log('ERROR!', err))

function findCities(matchWord, cities) {
    return cities.filter(el => {
        const regex = new RegExp(matchWord, 'gi')
        return el.city.match(regex) || el.state.match(regex)
        // return el.city.includes(matchWord) || el.state.includes(matchWord)
    })
}

function numberWithCommas(num) {
    num = Number(num)
    return num.toLocaleString()
}

function displayMatches(delay) {
    let id;
    return (evt) => {
        clearTimeout(id)
        id = setTimeout(() => {
            const matchArray = findCities(evt.target.value, cities)
            // console.log(evt.target.value, matchArray);
            suggestions.innerHTML = ''
            if (!matchArray.length) { matchNotFound() }
            else if (evt.target.value.length > 0) { matchFound(matchArray, evt) }
            else if (!evt.target.value.length) { noInput() }
        }, delay)
    }
}
searchInput.addEventListener('input', displayMatches(600))

// Display when match not found
function matchNotFound() {
    suggestions.innerHTML = `
    <li style='justify-content:center;color:red;'>MATCH NOT FOUND!</li>
    <li style='justify-content:center;'>Please try again</li> `
}

// Display when match found
function matchFound(matchArray, evt) {
    // matchArray.forEach((el) => {suggestion.innerHTML += `<li><span>${el.city}</span><span class="population">${el.population}</span></li>`});
    html = matchArray.map((el) => {
        const regex = new RegExp(evt.target.value, 'gi')
        const cityName = el.city.replace(regex, `<span class="hl">${evt.target.value}</span>`)
        const stateName = el.state.replace(regex, `<span class="hl">${evt.target.value}</span>`)
        return `
            <li>
              <span>${cityName}, ${stateName}</span>
              <span class="population">${numberWithCommas(el.population)}</span>
            </li> `
    }).join('')
    suggestions.innerHTML = html;
}

// Display when there is no input  (input.value.length = 0)
function noInput() {
    suggestions.innerHTML = `
    <li>Filter for a city</li>
    <li>or a state</li>`
}