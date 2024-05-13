namespace SpriteKind {
    export const MovingBlock = SpriteKind.create()
}

let distance = 0
let list: tiles.Location[] = []
let fallingSprites: Sprite[] = []
let tempTile: Sprite = null
let moveTime = 250

function moveAllTiles(locations: tiles.Location[], sprites2: Sprite[], left: boolean) {
    timer.background(function () {
        for (let value of locations) {
            tempTile = sprites.create(assets.tile`MovableTile`, SpriteKind.MovingBlock)
            tiles.placeOnTile(tempTile, value)
            sprites2.push(tempTile)
            tiles.setTileAt(value, assets.tile`transparency16`)
            if (left) {
                tiles.setWallAt(tiles.locationInDirection(value, CollisionDirection.Left), true)
                moveTo(tempTile, tiles.locationXY(value, tiles.XY.x) - 16, tiles.locationXY(value, tiles.XY.y), moveTime)
            } else {
                tiles.setWallAt(tiles.locationInDirection(value, CollisionDirection.Right), true)
                moveTo(tempTile, tiles.locationXY(value, tiles.XY.x) + 16, tiles.locationXY(value, tiles.XY.y), moveTime)
            }
        }
        pause(moveTime)
        for (let value of locations) {
            tiles.setWallAt(value, false)
        }
        for (let value of sprites2) {
            tiles.setWallAt(tiles.locationOfSprite(value), true)
            tiles.setTileAt(tiles.locationOfSprite(value), assets.tile`MovableTile`)
            value.destroy()
        }
        fallingSprites = []
        for (let value of tiles.getTilesByType(assets.tile`MovableTile`)) {
            if (tileCanFall(tiles.locationXY(value, tiles.XY.column), tiles.locationXY(value, tiles.XY.row))) {
                tempTile = sprites.create(assets.tile`MovableTile`, SpriteKind.MovingBlock)
                tiles.placeOnTile(tempTile, value)
                fallingSprites.push(tempTile)
            }
        }
        if (fallingSprites.length > 0) {
            makeTilesFallRecursive(fallingSprites)
        }
    })
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`MovableTile`) && tiles.locationXY(location, tiles.XY.row) == tiles.locationXY(tiles.locationOfSprite(sprite), tiles.XY.row)) {
        list = getTilesToMoveRecursive(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row), tiles.locationXY(location, tiles.XY.column) < tiles.locationXY(tiles.locationOfSprite(sprite), tiles.XY.column), [])
        moveAllTiles(list, [], tiles.locationXY(location, tiles.XY.column) < tiles.locationXY(tiles.locationOfSprite(sprite), tiles.XY.column))
    }
})
function getTilesToMoveRecursive(column: number, row: number, left: boolean, allTiles: tiles.Location[]) {
    for (let value of allTiles) {
        if (tiles.locationXY(value, tiles.XY.column) == column && tiles.locationXY(value, tiles.XY.row) == row) {
            return allTiles
        }
    }
    if (canMoveTile(column, row, left)) {
        allTiles.push(tiles.getTileLocation(column, row))
        getTilesToMoveRecursive(column, row - 1, left, allTiles)
        if (left) {
            getTilesToMoveRecursive(column - 1, row, left, allTiles)
        } else {
            getTilesToMoveRecursive(column + 1, row, left, allTiles)
        }
    }
    return allTiles
}
function moveTo(sprite: Sprite, x: number, y: number, time: number) {
    distance = Math.sqrt(0 ** 2 + 0 ** 2)
    sprite.vx = (x - sprite.x) / time * 1000
    sprite.vy = (y - sprite.y) / time * 1000
}
function canMoveTile(col: number, row: number, left: boolean): any {
    if (!(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`MovableTile`))) {
        return false
    }
    if (left && tiles.tileIsWall(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Left)) || !(left) && tiles.tileIsWall(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Right))) {
        if (left) {
            return canMoveTile(col - 1, row, left)
        } else {
            return canMoveTile(col + 1, row, left)
        }
    }
    return true
}
function makeTilesFallRecursive(allSprites: Sprite[]) {
    for (let value of allSprites) {
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(value), CollisionDirection.Bottom), true)
        tiles.setTileAt(tiles.locationOfSprite(value), assets.tile`transparency16`)
        moveTo(value, value.x, value.y + 16, moveTime)
    }
    pause(moveTime)
    for (let value of allSprites) {
        tiles.setTileAt(tiles.locationOfSprite(value), assets.tile`MovableTile`)
        value.setVelocity(0, 0)
        tiles.placeOnTile(value, tiles.locationOfSprite(value))
    }
    fallingSprites = []
    for (let value of allSprites) {
        if (!(tiles.tileAtLocationEquals(tiles.locationInDirection(tiles.locationOfSprite(value), CollisionDirection.Top), assets.tile`MovableTile`))) {
            tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(value), CollisionDirection.Top), false)
        }
        if (tileCanFall(tiles.locationXY(tiles.locationOfSprite(value), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(value), tiles.XY.row))) {
            fallingSprites.push(value)
        } else {
            value.destroy()
        }
    }
    if (fallingSprites.length > 0) {
        makeTilesFallRecursive(fallingSprites)
    }
}
function tileCanFall(col: number, row: number): any {
    if (!(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`MovableTile`))) {
        return false
    }
    if (tiles.tileIsWall(tiles.locationInDirection(tiles.getTileLocation(col, row), CollisionDirection.Bottom))) {
        return tileCanFall(col, row + 1)
    }
    return true
}
