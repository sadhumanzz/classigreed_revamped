//https://www.youtube.com/watch?v=7NzoIaMlqtY CODE FROM HERE, IN PROGRESS

let indexOf: Number = 0
let INDEXOFLETTER: Number = 0

function initFont() {
    // https://img.freepik.com/premium-vector/game-font-pixel-art-8bit-style-letters-numbers-vector-alphabet-pixel-white-background_360488-381.jpg?w=2000
    fontArray = [
        assets.image`8bit_A`,
        assets.image`8bit_B`,
        assets.image`8bit_C`,
        assets.image`8bit_D`,
        assets.image`8bit_E`,
        assets.image`8bit_F`,
        assets.image`8bit_G`,
        assets.image`8bit_H`,
        assets.image`8bit_I`,
        assets.image`8bit_J`,
        assets.image`8bit_K`,
        assets.image`8bit_L`,
        assets.image`8bit_M`,
        assets.image`8bit_N`,
        assets.image`8bit_O`,
        assets.image`8bit_P`,
        assets.image`8bit_Q`,
        assets.image`8bit_R`,
        assets.image`8bit_S`,
        assets.image`8bit_T`,
        assets.image`8bit_U`,
        assets.image`8bit_V`,
        assets.image`8bit_W`,
        assets.image`8bit_X`,
        assets.image`8bit_Y`,
        assets.image`8bit_Z`
    ]
    fontNumArray = [
        assets.image`8bit_0`,
        assets.image`8bit_1`,
        assets.image`8bit_2`,
        assets.image`8bit_3`,
        assets.image`8bit_4`,
        assets.image`8bit_5`,
        assets.image`8bit_6`,
        assets.image`8Bit_7`,
        assets.image`8bit_8`,
        assets.image`8bit_9`
    ]
}

function displayFont(font: string, size: number, text: string, top: number, left: number) {
    let textSprite: Image = image.create(text.length, 8)
    for (let i = 0; i < (text.length - 1); i++) {
        INDEXOFLETTER = getAlphabetIndex(text.charAt(i))
    }
}

function getAlphabetIndex(char: string) {
    indexOf = char.indexOf("abcdefghijklmnopqrstuvwxyz")
    if (indexOf <= 0) {
        return indexOf
    }
    indexOf = char.indexOf("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    return indexOf
}

game.onUpdateInterval(100, function () {
    if (playerCanMove) {
        

    }
})