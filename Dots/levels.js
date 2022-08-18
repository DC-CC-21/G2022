let levels = document.getElementById('levels')
let smallest = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

let search = window.location.search.split('=')
document.getElementById('grid').innerHTML = search[1]+'x'+search[1]

fetch('./levels.json')
.then(response => response.json())
.then(jsObject => {
    for(let i = 0; i < jsObject[search[1]].length; i ++){
        createElement(i+1)  
    }
})

function createElement(i){
    let el = document.createElement('a')
    el.innerHTML = i;
    el.href = `play.html?grid=${search[1]}&level=${i-1}`
    el.style.width = smallest*0.1+'px';
    el.style.height = smallest*0.1+'px';
    levels.append(el)
    
}
