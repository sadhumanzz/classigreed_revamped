// Add your code here
function initDecor() {
    tileUtil.createSpritesOnTiles(assets.tile`decor_grassSmall`, assets.image`decorSprite_grassSmall`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`decor_grassLarge`,assets.image`decorSprite_grassLarge`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`decor_vineSmall`, assets.image`decorSprite_vineSmall`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`decor_vineLarge`, assets.image`decorSprite_vineLarge`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`decor_vineLeft`, assets.image`decorSprite_vineLeft`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`decor_vineRight`, assets.image`decorSprite_vineRight`, SpriteKind.Decor)
    tileUtil.createSpritesOnTiles(assets.tile`bgdecor_chainVertical`, assets.image`bgdecorSprite_chainVertical`, SpriteKind.Decor)


}

sprites.onCreated(SpriteKind.Decor, function(sprite: Sprite) {
        sprite.z = 10000
    })
