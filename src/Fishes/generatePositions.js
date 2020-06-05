/**
 * Created by Vasilii on 05.06.2020.
 */

import { D, N, O } from './DNOdata'

const w = 10
const h = 10



export function generatePositions () {
    const arrPoseD = generatePosesLetter(D, (-D[0].length) / 2 * w - 200)
    const arrPoseN = generatePosesLetter(N, (-N[0].length) / 2 * w)
    const arrPoseO = generatePosesLetter(O, (-D[0].length) / 2 * w + 200)
    return [].concat(arrPoseD, arrPoseN, arrPoseO)
}


function generatePosesLetter(letter, offsetX) {
    const arr = []
    for (let i = 0; i < letter.length; i ++) {
        for(let j = 0; j < letter[i].length; j ++) {
            if (letter[i][j] === 1) {
                arr.push({
                    x: j * w + offsetX,
                    y: i * h
                })
            }
        }
    }
    return arr
}