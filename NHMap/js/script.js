function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

fetch('./assets/mapTiles.json')
.then(response => response.json())
.then(jsObject => {
    // let maps = []
    // for(let i = 0; i < 9; i ++){
    //     maps.push('./assets/testMap.png')
    // }
    // maps[3] = './assets/sugarHillMap.png'
    // maps[4] = './assets/franconiaMap.png'
    // maps[5] = './assets/southTwinMountainMap.png'
    
    // maps[6] = './assets/mountMoosilauke.png'
    // maps[7] = './assets/lincolnMap.png'
    // maps[8] = './assets/mountOsceolaMap.png'
    
    
    let mapDiv = document.getElementById('maps')
    Object.keys(jsObject[0]).forEach(map => {
        let container = document.createElement('div')
        
        let img = document.createElement('img')
        img.src = jsObject[0][map];
        container.append(img)
        
        let label = document.createElement('div')
        label.innerHTML = map
        container.append(label)
    
        mapDiv.append(container)
    })
    jsObject[1].forEach(item => {
        let container = document.createElement('div')
        container.classList.add('marker')
        
        container.innerHTML = item.name;
        container.style.left = map(item.x,0,4093, 0, window.innerWidth*3) + 'px'
        container.style.top = map(item.y, 0, 5900.261780104712, 0, (window.innerWidth/0.6945454545454546)*3) + 'px'

    
        document.body.append(container)
    })
    var style = getComputedStyle(document.body)
    document.getElementById('pos').innerHTML = window.innerWidth*3 + ',' + (window.innerWidth/0.6945454545454546)*3;
})



