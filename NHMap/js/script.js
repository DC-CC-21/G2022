
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
    Object.keys(jsObject).forEach(map => {
        let container = document.createElement('div')
        
        let img = document.createElement('img')
        img.src = jsObject[map];
        container.append(img)
        
        let label = document.createElement('div')
        label.innerHTML = map
        container.append(label)
    
        mapDiv.append(container)
    })
    
    

})



