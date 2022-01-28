Object.defineProperty(String.prototype, "toTitleCase", {
    value: function toTitleCase() {
        return [this.slice(0,1).toUpperCase(),this.slice(1,this.length)].join('')
    },
    writable: true,
    configurable: true
});

const pic = document.getElementById('image')
let search = window.location.search
search = search.slice(1,search.length).toTitleCase()
let folder = search.slice(0,search.length-1)
pic.src = `./assets/${folder}s/${search}.svg`