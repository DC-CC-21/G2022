let levels = document.getElementById('levels')
let smallest = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
for(let i = 0; i < 100; i ++){
    createElement(i+1)
}

function createElement(i){
    let el = document.createElement('a')
    el.innerHTML = i;
    el.href = 'index.html'
    el.style.width = smallest*0.1+'px';
    el.style.height = smallest*0.1+'px';
    levels.append(el)
    
}

let search = window.location.search.split('=')
document.getElementById('grid').innerHTML = search[1]+'x'+search[1]