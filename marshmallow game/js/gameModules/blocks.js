import * as ct from "../../../3D world/js/constant.js";
import { blocks, key, blockSize} from "../play.js";

import { cube, plane} from "../../../3D world/js/constant.js";

export class Block{
    constructor(x, y, scene, size, type){
        this.type = (type+'.glb')
        // loadModel('assets/brick.glb')
        this.w = blockSize[0]
        this.h = blockSize[1];
        this.b = cube(scene, {x:x*this.w, y:y*this.h, z:0}, [blockSize[0],blockSize[1],2], 0x00aaff, true, true)
        this.b.geometry.translate(this.w/2, this.h/2, 0)
    }
}