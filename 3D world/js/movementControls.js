Object.defineProperty(HTMLDivElement.prototype, "getPos", {
    value: function getPos() {
      function readPx(n) {
        return Number(n.replace(/px/g, ""));
      }
      return {
        x: readPx(this.style.left),
        y: readPx(this.style.top),
        width: readPx(this.style.width),
        height: readPx(this.style.height),
      };
    },
    writable: true,
    configurable: true,
});
class MovementControls{
    constructor(element, child){
        let current = element.getPos()
        let offset = 50;
        element.style.width = 100+'px'
        element.style.height = 100+'px'
        element.style.borderRadius = '50px'
        element.style.backgroundColor = 'rgba(100,100,100,10)'
        element.style.top = window.innerHeight-current.height+'px'
        element.style.left = offset + 'px' 
    }
    setupElement(){}
    
}
export{MovementControls}