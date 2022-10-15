let maps = []
for(let i = 0; i < 9; i ++){
    maps.push('./assets/testMap.png')
}
maps[3] = './assets/sugarHillMap.png'
maps[4] = './assets/franconiaMap.png'
maps[5] = './assets/southTwinMountainMap.png'

maps[7] = './assets/lincolnMap.png'
maps[6] = './assets/mountMoosilauke.png'


let mapDiv = document.getElementById('maps')
maps.forEach(map => {
    let img = document.createElement('img')
    img.src = map;
    mapDiv.append(img)
})

let start = {
    touch1:0,
    touch2:0,
}
document.addEventListener('touchmove', (e) => {
    start.touch1 = e.touches[0];
    start.touch2 = e.touches[1];
    document.getElementById('pos').innerHTML = e.touches[0].clientX + ',' + e.touches[1].clientX//JSON.stringify(e.touches);
    // document.getElementById('pos').innerHTML = e.clientX+window.scrollX + ',' + e.clientY+window.scrollY
})


function dst(a,b){
    let touch1 = a.touch1 - b.touch1;
    let touch2 = a.touch2 - b.touch2;
    return Math.sqrt(touch1**2 + touch2**2)
}

document.addEventListener('mousemove', (e) => {
    // var lat=((e.clientY+window.scrollY)/(mapDiv.scrollHeight/180)-90)/-1
    // var lng = (e.clientX+window.scrollX)/(mapDiv.scrollWidth/360)-180

    // document.getElementById('pos').innerHTML = lat + ',' + lng + ', compass' + e.webkitCompassHeading 
    // document.getElementById('pos').innerHTML = e.clientX+window.scrollX + ',' + e.clientY+window.scrollY
})

