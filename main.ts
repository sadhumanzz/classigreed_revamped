namespace SpriteKind {
    export const UI = SpriteKind.create()
    export const bulletFlash = SpriteKind.create()
    export const FlashOverlay = SpriteKind.create()
    export const GroundEnemy = SpriteKind.create()
    export const Bullet = SpriteKind.create()
    export const bulletTracer = SpriteKind.create()
    export const gibs = SpriteKind.create()
    export const metalScrap = SpriteKind.create()
    export const metalTrash = SpriteKind.create()
    export const effect = SpriteKind.create()
    export const projectileGroundEnemy = SpriteKind.create()
    export const enemyProjectile = SpriteKind.create()
    export const Camera = SpriteKind.create()
    export const Decor = SpriteKind.create()
    export const ChargeBar = SpriteKind.create()
}
namespace StatusBarKind {
    export const Curse = StatusBarKind.create()
}

//PLANS: GRENADE LAUNCHER, HOMING ROCKET

//pistolAmmo = 6,
//shotgunAmmo = 2,
//lmgAmmo = 30,
//sniperAmmo = 3

let playerIs_Sliding: boolean = false
let smoothCamera_Active: boolean = false
let scrapmetalArray: Image[] = []
let smoothCamera: Sprite = null
let fontNumArray: Image[] = []
let fontArray: Image[] = []
let playerSlamDetect: boolean = false
let waveAnnouncement: TextSprite = null
let randGibs: Image[] = []
let projectile: Sprite = null
let bulletTrace: Sprite = null
let bulletPopEffect: Sprite = null
let disY: number = 0
let disX:number = 0
let bulletCountArray: Image[] = []
let textSprite: TextSprite = null
let playerCurrentHP: number = 0
let playerMaxHP: number = 0
let emptyGun: Sprite = null
let playerCurseBar: StatusBarSprite = null
let currentAmmo: number = 0
let playerHealthBar: StatusBarSprite = null
let bars_areActive: boolean = false
let playerCanMove: boolean = false
let playerController: Sprite = null
let effectSprite: Sprite = null
let effectArray: Image[] = []
let gibs2: Sprite = null
let scrapMetal: Sprite = null
let currentGunSprite: Image = null
let currentGun: number = 0
let upcomingGun: number = 0
let gunTypeArray: number[] = []
let currentLevel: number = 0
let spawnableFloorTileArray: tiles.Location[] = []
let enemyController: Sprite = null
let waveCount: number = 0
let PPU: number = 16
let Friction: number = 1.06 * PPU
let playerAirFriction: number = 1 * PPU
let playerSlideFriction: number = 0.6 * PPU
let playerAcceleration: number = 2.5 * PPU
let Gravity: number = (10 * PPU) * 1.5
let curseFactor: number = 0

let deltaTime: number = Delta.DELTA()

let jumpVelocity: number = -(10.5 * PPU)
let fallVelocity: number = (10 * PPU)
let cutJumpHeight: number = -(3.5 * PPU)

let jumpPressedRemember: number = 0
let jumpPressedRememberTime: number = 5
let groundedRemember: number = 0
let groundedRememberTime: number = 5

let jumping: boolean = false
let falling: boolean = false

initLevel(0)

game.onUpdate(function () {
    if (!(controller.down.isPressed())) {
        for (let value of tiles.getTilesByType(assets.tile`myTile45`)) {
            if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`myTile45`)) {
                tiles.setWallAt(playerController.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
            } else {
                tiles.setWallAt(value, false)
            }
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile46`)) {
            if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`myTile46`)) {
                tiles.setWallAt(playerController.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
            } else {
                tiles.setWallAt(value, false)
            }
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile47`)) {
            if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`myTile47`)) {
                tiles.setWallAt(playerController.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
            } else {
                tiles.setWallAt(value, false)
            }
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile48`)) {
            if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`myTile48`)) {
                tiles.setWallAt(playerController.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), true)
            } else {
                tiles.setWallAt(value, false)
            }
        }
    } else {
        for (let value of tiles.getTilesByType(assets.tile`myTile45`)) {
            tiles.setWallAt(value, false)
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile46`)) {
            tiles.setWallAt(value, false)
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile47`)) {
            tiles.setWallAt(value, false)
        }
        for (let value of tiles.getTilesByType(assets.tile`myTile48`)) {
            tiles.setWallAt(value, false)
        }
    }

    if (playerCanMove) {
        if (controller.left.isPressed() || controller.right.isPressed()) {
            playerController.vx += (playerAcceleration * Math.sign(controller.dx())) * Delta.DELTA()
        }
        if (!(playerIs_Sliding)) {
            playerController.vx = (100 - Friction) / 100 * playerController.vx
        } else if (!(playerIs_Sliding) && !(playerController.isHittingTile(CollisionDirection.Bottom))) {
            playerController.vx = (100 - playerAirFriction) / 100 * playerController.vx
        } else {
            playerController.vx = (100 - playerSlideFriction) / 100 * playerController.vx
        }
        playerController.ay = Gravity
        if (playerController.isHittingTile(CollisionDirection.Bottom) && playerSlamDetect) {
            playerSlamDetect = false
            scene.cameraShake(3, 200)
            for (let value17 of sprites.allOfKind(SpriteKind.GroundEnemy)) {
                if (calcDistance(value17, playerController) < 45) {
                    value17.vy = -7 * PPU
                }
            }
            for (let value18 of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
                if (calcDistance(value18, playerController) < 45) {
                    value18.vy = -7 * 1.5 * PPU
                }
            }
        }
        if (controller.down.isPressed() && playerController.isHittingTile(CollisionDirection.Bottom)) {
            playerIs_Sliding = true
        } else {
            if (tiles.tileAtLocationIsWall(playerController.tilemapLocation().getNeighboringLocation(CollisionDirection.Top)) && playerController.isHittingTile(CollisionDirection.Bottom)) {
                playerIs_Sliding = true
            } else {
                playerIs_Sliding = false
            }
        }
    }

    if (playerCanMove) {
        if (playerIs_Sliding && characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
            animation.runImageAnimation(
                playerController,
                [img`
                ........................
                ........................
                ........................
                ........................
                ........................
                ........................
                ........................
                ........................
                ........................
                ........8888............
                .......833d8888.........
                .......838866768........
                .......8d8666768........
                ........88666668........
                .........8661618...8....
                .........836666888888...
                .........883338877778...
                ........8aaa77a866888...
                ........87aaaaa888......
                .......8aa977778........
                .......8aa97778.........
                ........89aa8aa8........
                .........87aa87a8.......
                ..........87a887a8......
                `],
                500,
                false
            )
            timer.throttle("action", 100, function () {
                initEffect(0, 0, 0)
            })
        } else if (playerIs_Sliding && characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
            animation.runImageAnimation(
                playerController,
                [img`
                    ........................
                    ........................
                    ........................
                    ........................
                    ........................
                    ........................
                    ........................
                    ........................
                    ........................
                    ............8888........
                    .........8888d338.......
                    ........867668838.......
                    ........8676668d8.......
                    ........86666688........
                    ....8...8161668.........
                    ...888888666638.........
                    ...877778833388.........
                    ...888668a77aaa8........
                    ......888aaaaa78........
                    ........877779aa8.......
                    .........87779aa8.......
                    ........8aa8aa98........
                    .......8a78aa78.........
                    ......8a788a78..........
                `],
                500,
                false
            )
            timer.throttle("action", 100, function () {
                initEffect(0, 0, 0)
            })
        }

        jumpPressedRemember -= deltaTime
        if (controller.up.isPressed()) {
            jumpPressedRemember = jumpPressedRememberTime
        }
    }
    //            playerController.vy = -7 * 1.5 * PPU
    if (playerCanMove) {
        //coyote time
        groundedRemember -= deltaTime
        if (playerController.isHittingTile(CollisionDirection.Bottom)) {
            groundedRemember = groundedRememberTime

        }

        controller.up.onEvent(ControllerButtonEvent.Released, function () {
            if (playerController.vy < -30) {
                playerController.vy = cutJumpHeight
            }
        })

        if ((jumpPressedRemember > 0) && (groundedRemember > 0)) {
            jumpPressedRemember = 0
            groundedRemember = 0
            playerController.vy = jumpVelocity
        }
    }
})

function initEnemy (Type: number) {
    waveCount += 1
    announceWave(waveCount)
    for (let index = 0; index < randint(1, waveCount + 5); index++) {
        enemyController = sprites.create(assets.image`groundEnemy`, SpriteKind.GroundEnemy)
    }
    for (let index = 0; index < randint(1, waveCount + 1); index++) {
        enemyController = sprites.create(assets.image`ProjectileEnemyStartSprite`, SpriteKind.projectileGroundEnemy)
    }
    for (let value of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        tiles.placeOnTile(value, spawnableFloorTileArray._pickRandom())
    }
    for (let value2 of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        tiles.placeOnTile(value2, spawnableFloorTileArray._pickRandom())
    }
    initEnemyAnimation()
}

sprites.onCreated(SpriteKind.enemyProjectile, function (sprite) {
    characterAnimations.loopFrames(
    sprite,
    [img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . c c c c c c c c . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . 1 1 1 1 1 1 1 1 1 1 . 
        . . . . 1 1 1 1 1 1 1 1 1 1 . 
        . . . . 1 1 1 1 1 1 1 1 1 1 . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . 2 2 2 2 2 2 2 2 . 
        . . . . . . 2 2 2 2 2 2 2 2 . 
        . . . . . . 2 2 2 2 2 2 2 2 . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . 1 1 1 1 1 1 . 
        . . . . . . . . 1 1 1 1 1 1 . 
        . . . . . . . . 1 1 1 1 1 1 . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `],
    75,
    characterAnimations.rule(Predicate.FacingRight)
    )
    characterAnimations.loopFrames(
    sprite,
    [img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . c c c c c c c c . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . 1 1 1 1 1 1 1 1 1 1 . . . . 
        . 1 1 1 1 1 1 1 1 1 1 . . . . 
        . 1 1 1 1 1 1 1 1 1 1 . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . 2 2 2 2 2 2 2 2 . . . . . . 
        . 2 2 2 2 2 2 2 2 . . . . . . 
        . 2 2 2 2 2 2 2 2 . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . 1 1 1 1 1 1 . . . . . . . . 
        . 1 1 1 1 1 1 . . . . . . . . 
        . 1 1 1 1 1 1 . . . . . . . . 
        . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . 
        `],
    75,
    characterAnimations.rule(Predicate.FacingLeft)
    )
    characterAnimations.loopFrames(
    sprite,
    [img`
        . . . . . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . c . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        `,img`
        . . . . . . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        `,img`
        . . . . . . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . 2 2 2 . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        `,img`
        . . . . . . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . 1 1 1 . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        . . . . . . . 
        `],
    75,
    characterAnimations.rule(Predicate.FacingUp)
    )
})

function initGunTypes () {
    if (currentLevel == 2) {
        gunTypeArray = [1]
    } else if (currentLevel == 4) {
        gunTypeArray = [2]
    } else if (currentLevel == 5) {
        gunTypeArray = [3]
    } else {
        gunTypeArray = [
        1,
        2,
        3,
        4
        ]
    }
    upcomingGun = gunTypeArray._pickRandom()
    currentGun = upcomingGun
    currentGunSprite = img`
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ........88.....8..
        .......8aa8888888.
        ......8aaa9877778.
        .......8a98666888.
        ........887888....
        .........8778.....
        .........8888.....
        ..................
        ..................
        ..................
        ..................
        ..................
        `
}

sprites.onCreated(SpriteKind.Projectile, function (sprite) {
    if (currentGun == 1) {
        scene.cameraShake(2, 200)
    } else if (currentGun == 2) {
        scene.cameraShake(3, 200)
        timer.after(225, function () {
            sprites.destroy(sprite)
        })
    }
})

sprites.onDestroyed(SpriteKind.GroundEnemy, function (sprite) {
    for (let index = 0; index < randint(1, 3); index++) {
        scrapMetal = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.metalScrap)
        scrapMetal.setPosition(sprite.x, sprite.y)
    }
    for (let index = 0; index < randint(1, 3); index++) {
        gibs2 = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.gibs)
        gibs2.setPosition(sprite.x, sprite.y)
    }
    scene.cameraShake(2, 100)
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        if (tiles.tileAtLocationIsWall(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom))) {
            tileUtil.coverTile(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), assets.tile`myTile23`)
        }
    }
})

function initEffect (effectType: number, x: number, y: number) {
    if (effectType == 0) {
        effectArray = [
        img`
            . . .
            . d .
            . . .
        `,
        img`
            . . .
            . e .
            . . .
        `,
        img`
            . . .
            . 1 .
            . . .
        `,
        img`
            . . . 
            . c . 
            . . . 
            `
        ]
        for (let index = 0; index < randint(0, 5); index++) {
            effectSprite = sprites.create(effectArray._pickRandom(), SpriteKind.effect)
            effectSprite.setPosition(playerController.x, playerController.bottom)
            effectSprite.lifespan = 300
            spriteutils.setVelocityAtAngle(effectSprite, -45, 15)
        }
    } else if (effectType == 1) {
        effectSprite = sprites.create(img`
            . . . . . . .
            . . . . . . .
            . . . . . . .
            . . . c . . .
            . . . . . . .
            . . . . . . .
            . . . . . . .
        `, SpriteKind.effect)
        effectSprite.setPosition(x, y)
        animation.runImageAnimation(
        effectSprite,
        [img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . c c . . . . . . 
            . . . . . . c c . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . 2 2 2 2 . . . . . 
            . . . . . 2 . . 2 . . . . . 
            . . . . . 2 . . 2 . . . . . 
            . . . . . 2 2 2 2 . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . 1 1 1 1 1 1 . . . . 
            . . . . 1 1 1 1 1 1 . . . . 
            . . . . 1 1 . . 1 1 . . . . 
            . . . . 1 1 . . 1 1 . . . . 
            . . . . 1 1 1 1 1 1 . . . . 
            . . . . 1 1 1 1 1 1 . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . 2 2 2 2 2 2 . . . . 
            . . . . 2 . . . . 2 . . . . 
            . . . . 2 . . . . 2 . . . . 
            . . . . 2 . . . . 2 . . . . 
            . . . . 2 . . . . 2 . . . . 
            . . . . 2 2 2 2 2 2 . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . 1 1 . . . . 1 1 . . . 
            . . . 1 1 . . . . 1 1 . . . 
            . . . 1 1 . . . . 1 1 . . . 
            . . . 1 1 . . . . 1 1 . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 . . . . . . 1 . . . 
            . . . 1 1 1 1 1 1 1 1 . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . 
            `],
        100,
        false
        )
        scene.cameraShake(2, 100)
        timer.after(550, function () {
            for (let value3 of sprites.allOfKind(SpriteKind.Player)) {
                sprites.destroy(effectSprite)
            }
        })
    }
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentGun != 0) {
        reloadGun()
    }
    if (bars_areActive) {
        curseFactor = playerHealthBar.value / (playerHealthBar.max * 3)
        if (currentAmmo > 1) {
            playerCurseBar.value += curseFactor
        }
    }
})

function checkGunDamage () {
    if (currentGun == 1) {
        return -0.7
    } else if (currentGun == 2) {
        return -0.3
    } else if (currentGun == 3) {
        return -0.5
    } else if (currentGun == 4) {
        return -0.5
    }
    return 0
}

scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile44`, function (sprite, location) {
    if (currentLevel == 2) {
        initGunTypes()
        initAmmo()
        initAmmoCounter()
        for (let index = 0; index < randint(1, 3); index++) {
            scrapMetal = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.metalScrap)
            tiles.placeOnTile(scrapMetal, location)
        }
        scene.cameraShake(2, 100)
        tiles.setTileAt(location, assets.tile`transparency16`)
        tiles.setWallAt(tiles.getTileLocation(9, 5), false)
        tiles.setWallAt(tiles.getTileLocation(9, 6), false)
        tiles.setTileAt(tiles.getTileLocation(9, 5), assets.tile`PlayerIndication0`)
        tiles.setTileAt(tiles.getTileLocation(9, 6), assets.tile`PlayerIndication0`)
    }
})

function reloadGun () {
    upcomingGun = gunTypeArray._pickRandom()
    currentGun = upcomingGun
    timer.throttle("action", 1500, function () {
        emptyGun = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.metalTrash)
    })
    if (currentGun == 1) {
        currentAmmo = 6
    } else if (currentGun == 2) {
        currentAmmo = 2
    } else if (currentGun == 3) {
        currentAmmo = 30
    } else if (currentGun == 4) {
        currentAmmo = 3
    }
}

function initEnemyAnimation () {
    for (let value4 of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        characterAnimations.loopFrames(
        value4,
        assets.animation`GroundEnemyRunRight`,
        100,
        characterAnimations.rule(Predicate.MovingRight, Predicate.HittingWallDown)
        )
        characterAnimations.loopFrames(
        value4,
        assets.animation`GroundEnemyRunLeft`,
        100,
        characterAnimations.rule(Predicate.MovingLeft, Predicate.HittingWallDown)
        )
        characterAnimations.loopFrames(
        value4,
        assets.animation`GroundEnemyFallLeft`,
        100,
        characterAnimations.rule(Predicate.MovingLeft)
        )
        characterAnimations.loopFrames(
        value4,
        assets.animation`GroundEnemyFallRight`,
        100,
        characterAnimations.rule(Predicate.MovingRight)
        )
    }
    for (let value5 of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        characterAnimations.loopFrames(
        value5,
        assets.animation`ProjectileEnemyRunRight`,
        100,
        characterAnimations.rule(Predicate.MovingRight, Predicate.HittingWallDown)
        )
        characterAnimations.loopFrames(
        value5,
        assets.animation`ProjectileEnemyRunLeft`,
        100,
        characterAnimations.rule(Predicate.MovingLeft, Predicate.HittingWallDown)
        )
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentGun == 1) {
        playerShoot()
    } else if (currentGun == 2) {
        playerShoot()
    } else if (currentGun == 3) {
        playerShoot()
        timer.debounce("action", 100, function () {
            playerShoot()
        })
        timer.debounce("action", 100, function () {
            playerShoot()
        })
    } else if (currentGun == 4) {
        playerShoot()
    }
})

sprites.onOverlap(SpriteKind.metalScrap, SpriteKind.Player, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    if (bars_areActive) {
        playerHealthChanged(randint(0.05, 0.5))
    }
})

scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`myTile40`)) {
        if (sprite.vy > 400) {
            for (let index = 0; index < randint(1, 2); index++) {
                scrapMetal = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.metalScrap)
                tiles.placeOnTile(scrapMetal, location)
            }
            scene.cameraShake(2, 100)
            tiles.setTileAt(location, assets.tile`transparency16`)
            tiles.setWallAt(location, false)
            sprite.vy = 400
        }
    }
})

sprites.onOverlap(SpriteKind.projectileGroundEnemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprites.changeDataNumberBy(sprite, "HP", checkGunDamage())
    if (sprites.readDataNumber(sprite, "HP") <= 0) {
        sprites.destroy(sprite)
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            info.changeScoreBy(100)
        } else {
            info.changeScoreBy(250)
        }
    } else {
        if (currentGun == 4) {
            timer.throttle("action", 1000, function () {
                sprites.setDataBoolean(sprite, "spiked", true)
                sprite.follow(otherSprite, otherSprite.vx)
            })
        } else {
            timer.throttle("knockback", 150, function () {
                sprite.vx += otherSprite.vx / 5
                sprite.vy += -2 * PPU
            })
        }
    }
})

sprites.onDestroyed(SpriteKind.metalTrash, function (sprite) {
    for (let index = 0; index < randint(0, 2); index++) {
        scrapMetal = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.metalScrap)
        scrapMetal.setPosition(sprite.x, sprite.y)
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.metalTrash, function (sprite, otherSprite) {
    if (sprite.vy > 400) {
        sprites.destroy(otherSprite)
        info.changeScoreBy(5)
    }
})

function initPlayer () {
    sprites.destroy(playerController)
    playerController = sprites.create(img`
        ....8888..........
        ...833d8888.......
        ...838866768......
        ...8d8666768......
        ....88666668......
        .....8661618......
        .....8366668...8..
        ......83338888888.
        .....87aaaa877778.
        ....8aaa77a866888.
        ....87aaaaa888....
        ...8aa977778......
        ...8aa97778.......
        ....89aaaaa8......
        .....8aaaa98......
        ....8aa78998......
        ....8a7887a8......
        ....878.878.......
        `, SpriteKind.Player)
    initPlayerAnimation()
    tiles.placeOnRandomTile(playerController, assets.tile`myTile26`)
    tileUtil.replaceAllTiles(assets.tile`myTile26`, assets.tile`transparency16`)
}

statusbars.onStatusReached(StatusBarKind.Curse, statusbars.StatusComparison.GTE, statusbars.ComparisonType.Percentage, 100, function (status) {
    playerCanMove = false
    for (let value of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        sprites.destroy(value)
    }
    for (let value of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        sprites.destroy(value)
    }
    game.splash("YOU GOT GILDED! A/SPACE TO", "GIVE IT ANOTHER SHOT")
    initLevel(9)
})

scene.onOverlapTile(SpriteKind.Player, assets.tile`PlayerIndication0`, function (sprite, location) {
    initLevel(currentLevel + 1)
})

function initBars () {
    playerMaxHP = 4
    playerCurrentHP = playerMaxHP
    playerHealthBar = statusbars.create(32, 6, StatusBarKind.Health)
    playerCurseBar = statusbars.create(32, 6, StatusBarKind.Curse)
    bars_areActive = true
    playerHealthBar.setColor(14, 8, 13)
    playerHealthBar.value = playerCurrentHP
    playerHealthBar.max = playerMaxHP
    playerHealthBar.attachToSprite(playerController, 0, 0)
    playerCurseBar.setColor(1, 0, 1)
    playerCurseBar.value = 0
    playerCurseBar.max = playerMaxHP
    playerCurseBar.attachToSprite(playerController, 0, 0)
}

spriteutils.onSpriteKindUpdateInterval(SpriteKind.projectileGroundEnemy, 500, function (sprite) {
    for (let value8 of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        if (calcDistance(value8, playerController) < 45) {
            sprites.setDataNumber(value8, "State", 2)
        } else {
            // States:
            // 0: Stand
            // 1: Patrol
            // 2: Chase
            sprites.setDataNumber(value8, "State", randint(0, 1))
        }
    }
    for (let value9 of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        if (!(sprites.readDataBoolean(value9, "spiked"))) {
            if (sprites.readDataNumber(value9, "State") == 0) {
                if (randint(0, 1) == 0) {
                    for (let index = 0; index < randint(1, 8); index++) {
                        if (tiles.tileAtLocationEquals(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).getNeighboringLocation(CollisionDirection.Left), assets.tile`transparency16`)) {
                            value9.vx += sprites.readDataNumber(value9, "acceleration")
                        } else {
                            if (value9.isHittingTile(CollisionDirection.Bottom) && (tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)) || tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Left)))) {
                                value9.vy = -5 * PPU
                            }
                            value9.vx += -1 * sprites.readDataNumber(value9, "acceleration")
                        }
                    }
                } else {
                    for (let index = 0; index < randint(1, 8); index++) {
                        if (tiles.tileAtLocationEquals(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).getNeighboringLocation(CollisionDirection.Right), assets.tile`transparency16`)) {
                            value9.vx += -1 * sprites.readDataNumber(value9, "acceleration")
                        } else {
                            timer.throttle("jump", 1000, function () {
                                if (value9.isHittingTile(CollisionDirection.Bottom) && (tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)) || tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Left)))) {
                                    value9.vy = -5 * PPU
                                }
                            })
                        }
                        value9.vx += sprites.readDataNumber(value9, "acceleration")
                    }
                }
            } else if (sprites.readDataNumber(value9, "State") == 1) {
            	
            } else if (sprites.readDataNumber(value9, "State") == 2) {
                if (calcDistanceX(value9, playerController) > 0) {
                    if (calcDistance(value9, playerController) <= 48) {
                        timer.throttle("jump", 1000, function () {
                            if (tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)) || tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Left))) {
                                value9.vy = -5 * PPU
                            }
                        })
                        value9.vx += sprites.readDataNumber(value9, "acceleration")
                        timer.throttle("shooting", randint(3000, 5000), function () {
                            if (characterAnimations.matchesRule(value9, characterAnimations.rule(Predicate.FacingRight))) {
                                enemyShoot(0, value9.x, value9.y)
                            }
                        })
                    }
                } else if (calcDistanceX(value9, playerController) < 0) {
                    if (calcDistance(value9, playerController) >= -48) {
                        timer.throttle("jump", 1000, function () {
                            if (tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)) || tiles.tileAtLocationIsWall(value9.tilemapLocation().getNeighboringLocation(CollisionDirection.Left))) {
                                value9.vy = -5 * PPU
                            }
                        })
                        value9.vx += -1 * sprites.readDataNumber(value9, "acceleration")
                        timer.throttle("shooting", randint(3000, 5000), function () {
                            if (characterAnimations.matchesRule(value9, characterAnimations.rule(Predicate.FacingLeft))) {
                                enemyShoot(1, value9.x, value9.y)
                            }
                        })
                    }
                }
            }
            value9.vx = (100 - sprites.readDataNumber(value9, "friction")) / 100 * value9.vx
        }
    }
})

function initAutomaticText (textInput: string, column: number, row: number) {
    textSprite = textsprite.create(textInput, 7, 2)
    textSprite.setFlag(SpriteFlag.AutoDestroy, true)
    tiles.placeOnTile(textSprite, tiles.getTileLocation(column, row))
    timer.after(200 * textInput.length, function () {
        textSprite.ay = -1 * PPU
    })
}

sprites.onDestroyed(SpriteKind.enemyProjectile, function (sprite) {
    initEffect(1, sprite.x, sprite.y)
})

sprites.onCreated(SpriteKind.metalTrash, function (sprite) {
    sprite.setPosition(playerController.x, playerController.y)
    sprite.setImage(currentGunSprite)
    sprite.setVelocity(randint(-64, 64), randint(-50, -100))
    sprite.ay = Gravity
    sprite.lifespan = 8000
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
})

function initAmmoCounter () {
    bulletCountArray = [
    assets.image`0`,
    assets.image`1`,
    assets.image`2`,
    assets.image`3`,
    assets.image`4`,
    assets.image`5`,
    assets.image`6`,
    assets.image`7`,
    assets.image`8`,
    assets.image`9`
    ]
}

function calcDistanceWith (startSprite: Sprite, endNumX: number, endNumY: number) {
    disX = startSprite.x - endNumX
    disY = startSprite.y - endNumY
    return Math.sqrt(disX ** 2 + disY ** 2)
}

sprites.onCreated(SpriteKind.GroundEnemy, function (sprite) {
    sprite.ay = Gravity
    sprites.setDataNumber(sprite, "HP", 2)
    sprites.setDataNumber(sprite, "acceleration", 0.9 * PPU)
    sprites.setDataNumber(sprite, "chaseAcceleration", 1.5 * PPU)
    sprites.setDataNumber(sprite, "friction", 2 * PPU)
})

statusbars.onZero(StatusBarKind.Health, function (status) {
    playerCanMove = false
    for (let value of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
        sprites.destroy(value)
    }
    for (let value of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        sprites.destroy(value)
    }
    game.splash("YOU DIED! A/SPACE TO", "GIVE IT ANOTHER SHOT")
    initLevel(9)
})

function playerShoot () {
    if (playerCanMove) {
        if (currentAmmo > 0) {
            bulletPopEffect = sprites.create(img`
                . . . . c . . . . 
                . . . . c 1 . . . 
                . . . 1 c c . . . 
                . 1 c c c c 1 . . 
                c c c c f c c c c 
                . . . c c c . . . 
                . . . 1 c 1 . . . 
                . . . 1 c . . . . 
                . . . . c . . . . 
                `, SpriteKind.bulletFlash)
            animation.runImageAnimation(
            bulletPopEffect,
            [img`
                . . . . c . . . . 
                . . . . c 1 . . . 
                . . . 1 c c . . . 
                . 1 c c c c 1 . . 
                c c c c f c c c c 
                . . . c c c . . . 
                . . . 1 c 1 . . . 
                . . . 1 c . . . . 
                . . . . c . . . . 
                `,img`
                . . . . . . . . . 
                . . . . . c . . . 
                . c 1 . 1 c . . . 
                . . c c c c 1 . . 
                . . . c f c c 1 . 
                . . 1 c c c . c c 
                . . c . . . . . . 
                . c . . . . . . . 
                . . . . . . . . . 
                `,img`
                . . . . . . . . . 
                . . . . . . . . . 
                . . . c . . 1 . . 
                . . . c c c . . . 
                . . 1 c f c . . . 
                . . . . c c 1 . . 
                . . . . . . c . . 
                . . . . . . . . . 
                . . . . . . . . . 
                `,img`
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . 1 . . . 
                . . . c f . . . . 
                . . . . c . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                `,img`
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . f . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                `,img`
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                . . . . . . . . . 
                `],
            100,
            false
            )
            if (currentGun == 1) {
                currentAmmo += -1
                bulletTrace = sprites.create(img`
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `, SpriteKind.bulletTracer)
                animation.runImageAnimation(
                bulletTrace,
                [img`
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,img`
                    ................................................................................................................................................................
                    1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    ................................................................................................................................................................
                    `,img`
                    ................................................................................................................................................................
                    ................................................................................................................................................................
                    ................................................................................................................................................................
                    `],
                200,
                false
                )
                if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
                    projectile = sprites.createProjectileFromSprite(img`
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        c c c 
                        . . . 
                        `, playerController, -300, 0)
                } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
                    projectile = sprites.createProjectileFromSprite(img`
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        . . . 
                        c c c 
                        . . . 
                        `, playerController, 300, 0)
                }
            } else if (currentGun == 2) {
                currentAmmo += -1
                if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
                    playerController.vx += 3 * PPU
                    for (let index = 0; index < randint(5, 10); index++) {
                        projectile = sprites.createProjectileFromSprite(img`
                            . . . 
                            . . . 
                            . . . 
                            . . . 
                            . . . 
                            . 1 . 
                            1 c 1 
                            . 1 . 
                            `, playerController, randint(-250, -300), randint(-96, 96))
                    }
                } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
                    playerController.vx += -3 * PPU
                    for (let index = 0; index < randint(5, 10); index++) {
                        projectile = sprites.createProjectileFromSprite(img`
                            . . . 
                            . . . 
                            . . . 
                            . . . 
                            . . . 
                            . 1 . 
                            1 c 1 
                            . 1 . 
                            `, playerController, randint(250, 300), randint(-96, 96))
                    }
                }
            } else if (currentGun == 3) {
                currentAmmo += -1
                if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
                    projectile = sprites.createProjectileFromSprite(img`
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . 1 1 . . . 
                        1 c c 1 1 1 
                        . 1 1 . . . 
                        `, playerController, -600, randint(-16, 16))
                } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
                    projectile = sprites.createProjectileFromSprite(img`
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . . . . . . 
                        . . . 1 1 . 
                        1 1 1 c c 1 
                        . . . 1 1 . 
                        `, playerController, 600, randint(-16, 16))
                }
            } else if (currentGun == 4) {
                currentAmmo += -1
                if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
                    projectile = sprites.createProjectileFromSprite(img`
                        . . . . . . . . 
                        . . . . . . . . 
                        . . . . . . . 7 
                        . . . . . . 6 7 
                        . 6 6 6 6 6 7 7 
                        7 7 7 7 7 7 7 7 
                        . . . . . . 6 7 
                        . . . . . . . . 
                        `, playerController, -300, 0)
                } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
                    projectile = sprites.createProjectileFromSprite(assets.image`railSpikeR`, playerController, 300, 0)
                }
            }
        } else {
            reloadGun()
        }
    }
}

function calcDistance (startSprite: Sprite, endSprite: Sprite) {
    disX = startSprite.x - endSprite.x
    disY = startSprite.y - endSprite.y
    return Math.sqrt(disX ** 2 + disY ** 2)
}

scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`myTile40`)) {
        for (let index = 0; index < randint(1, 2); index++) {
            scrapMetal = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.metalScrap)
            tiles.placeOnTile(scrapMetal, location)
        }
        scene.cameraShake(2, 100)
        tiles.setTileAt(location, assets.tile`transparency16`)
        tiles.setWallAt(location, false)
    }
})

let levelSet = [tilemap`level5`,
tilemap`level14`,
tilemap`level16`,
tilemap`level18`,
tilemap`level19`,
tilemap`level33`,
tilemap`level34`,
tilemap`level43`,
tilemap`level44`,
tilemap`level45`,
tilemap`level46`,
tilemap`level70`,
tilemap`level71`,
tilemap`level74`,
tilemap`level1`]
let nextLevel: number = 0


scene.onOverlapTile(SpriteKind.Player, assets.tile`PlayerIndication`, function (sprite, location) {
    if (currentLevel == 6 || currentLevel == 7) {
        initLevel(currentLevel + 1)
    }
})

sprites.onCreated(SpriteKind.gibs, function (sprite) {
    randGibs = [
    img`
        . . . . . . . . 
        . . . d . . . . 
        . . . e d d . . 
        . e e e e e . . 
        . e e e e e d . 
        . e . e e e d . 
        . . e e d d . . 
        . . . e . . . . 
        `,
    img`
        . . . . . . . . 
        . . . . f f . . 
        . . . . f f . . 
        . . . . f f f f 
        f f . f f . f f 
        f f f f . . . . 
        . . f f . . . . 
        . . f f . . . . 
        `,
    img`
        . . . . . . . . 
        . . . . d . . . 
        . . d d e . . . 
        . . e e e e e . 
        . d e e e e e . 
        . d e e e . e . 
        . . d d e e . . 
        . . . . e . . . 
        `,
    img`
        . . . . . . . . 
        . . f f . . . . 
        . . f f . . . . 
        f f f f . . . . 
        f f . f f . f f 
        . . . . f f f f 
        . . . . f f . . 
        . . . . f f . . 
        `,
    img`
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . f . . . . . 
        . . . f f . f f 
        . . . . f f f f 
        . . . . f f . . 
        . . . . f f . . 
        `,
    img`
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . . . f . . 
        f f . f f . . . 
        f f f f . . . . 
        . . f f . . . . 
        . . f f . . . . 
        `
    ]
    sprite.setImage(randGibs._pickRandom())
    sprite.setVelocity(randint(-64, 64), randint(-50, -100))
    sprite.ay = Gravity
    sprite.lifespan = 8000
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
})

function announceWave (Wave_Count: number) {
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    waveAnnouncement = textsprite.create("WAVE" + convertToText(Wave_Count), 2, 1)
    waveAnnouncement.setFlag(SpriteFlag.RelativeToCamera, true)
    waveAnnouncement.setMaxFontHeight(16)
    waveAnnouncement.setPosition(80, 30)
    timer.after(1000, function () {
        sprites.destroy(waveAnnouncement, effects.disintegrate, 200)
    })
}

// column, row
// image is 13*13 but changes according to number size. Smallest number is 1, at 6*13.
// 
// 2 pixels of padding
// Grid Cell: 15*15
// 
// Define a list of num images
// eliminate all characters that are not a number
// iterate over all those numbers
spriteutils.createRenderable(100, function (screen2) {
    if (currentAmmo >= 90) {
        spriteutils.drawTransparentImage(bulletCountArray[9], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 90], screen2, 17, 2)
    } else if (currentAmmo >= 80) {
        spriteutils.drawTransparentImage(bulletCountArray[8], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 80], screen2, 17, 2)
    } else if (currentAmmo >= 70) {
        spriteutils.drawTransparentImage(bulletCountArray[7], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 70], screen2, 17, 2)
    } else if (currentAmmo >= 60) {
        spriteutils.drawTransparentImage(bulletCountArray[6], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 60], screen2, 17, 2)
    } else if (currentAmmo >= 50) {
        spriteutils.drawTransparentImage(bulletCountArray[5], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 50], screen2, 17, 2)
    } else if (currentAmmo >= 40) {
        spriteutils.drawTransparentImage(bulletCountArray[4], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 40], screen2, 17, 2)
    } else if (currentAmmo >= 30) {
        spriteutils.drawTransparentImage(bulletCountArray[3], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 30], screen2, 17, 2)
    } else if (currentAmmo >= 20) {
        spriteutils.drawTransparentImage(bulletCountArray[2], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 20], screen2, 17, 2)
    } else if (currentAmmo >= 10) {
        spriteutils.drawTransparentImage(bulletCountArray[1], screen2, 2, 2)
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo - 10], screen2, 10, 2)
    } else {
        spriteutils.drawTransparentImage(bulletCountArray[currentAmmo], screen2, 2, 2)
    }
})

sprites.onCreated(SpriteKind.projectileGroundEnemy, function (sprite) {
    sprite.ay = Gravity
    sprites.setDataNumber(sprite, "HP", 3.5)
    sprites.setDataNumber(sprite, "acceleration", 1 * PPU)
    sprites.setDataNumber(sprite, "friction", 2.5 * PPU)
})

// player hit by projectile
sprites.onOverlap(SpriteKind.Player, SpriteKind.enemyProjectile, function (sprite, otherSprite) {
    timer.throttle("hit", 500, function () {
        if (!(playerSlamDetect)) {
            sprites.destroy(otherSprite)
            scene.cameraShake(3, 200)
            info.changeScoreBy(-50)
            playerHealthChanged(-0.5)
            if (sprite.vx == 0) {
                if (randint(0, 1) == 0) {
                    sprite.vx = 160 * -25
                } else {
                    sprite.vx = -160 * -25
                }
            } else {
                sprite.vx = sprite.vx * -25
            }
            sprite.vy = -5 * PPU
        }
    })
})

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    for (let value of sprites.allOfKind(SpriteKind.Text)) {
        sprites.destroy(value)
    }
    initLevel(9)
})

function initSpawnableArray () {
    for (let value10 of tiles.getTilesByType(assets.tile`myTile0`)) {
        if (calcDistanceWith(playerController, value10.x, value10.y) > 128) {
            if (tiles.tileAtLocationIsWall(value10.getNeighboringLocation(CollisionDirection.Bottom))) {
                if (!(tiles.tileAtLocationIsWall(value10))) {
                    spawnableFloorTileArray.push(value10)
                }
            }
        }
    }
    for (let value11 of tiles.getTilesByType(assets.tile`myTile17`)) {
        if (calcDistanceWith(playerController, value11.x, value11.y) > 128) {
            if (tiles.tileAtLocationIsWall(value11.getNeighboringLocation(CollisionDirection.Bottom))) {
                if (!(tiles.tileAtLocationIsWall(value11))) {
                    spawnableFloorTileArray.push(value11)
                }
            }
        }
    }
    for (let value12 of tiles.getTilesByType(assets.tile`transparency16`)) {
        if (calcDistanceWith(playerController, value12.x, value12.y) > 128) {
            if (tiles.tileAtLocationIsWall(value12.getNeighboringLocation(CollisionDirection.Bottom))) {
                if (!(tiles.tileAtLocationIsWall(value12))) {
                    spawnableFloorTileArray.push(value12)
                }
            }
        }
    }
}

controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (currentGun == 1) {
        timer.throttle("action", 450, function () {
            playerShoot()
        })
    } else if (currentGun == 2) {
        timer.throttle("action", 600, function () {
            playerShoot()
        })
    } else if (currentGun == 3) {
        timer.throttle("action", 100, function () {
            playerShoot()
        })
    } else if (currentGun == 4) {
        timer.throttle("action", 500, function () {
            playerShoot()
        })
    }
})

spriteutils.onSpriteKindUpdateInterval(SpriteKind.GroundEnemy, 500, function (sprite) {
    for (let value6 of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        if (calcDistance(value6, playerController) < 45) {
            sprites.setDataNumber(value6, "State", 2)
        } else {
            // States:
            // 0: Stand
            // 1: Patrol
            // 2: Chase
            sprites.setDataNumber(value6, "State", randint(0, 1))
        }
    }
    for (let value7 of sprites.allOfKind(SpriteKind.GroundEnemy)) {
        if (!(sprites.readDataBoolean(value7, "spiked"))) {
            if (sprites.readDataNumber(value7, "State") == 0) {
                if (randint(0, 1) == 0) {
                    for (let index = 0; index < randint(1, 8); index++) {
                        if (tiles.tileAtLocationEquals(value7.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).getNeighboringLocation(CollisionDirection.Left), assets.tile`transparency16`)) {
                            value7.vx += sprites.readDataNumber(value7, "acceleration")
                        } else {
                            value7.vx += -1 * sprites.readDataNumber(value7, "acceleration")
                        }
                    }
                } else {
                    for (let index = 0; index < randint(1, 8); index++) {
                        if (tiles.tileAtLocationEquals(value7.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).getNeighboringLocation(CollisionDirection.Right), assets.tile`transparency16`)) {
                            value7.vx += -1 * sprites.readDataNumber(value7, "acceleration")
                        } else {
                            value7.vx += sprites.readDataNumber(value7, "acceleration")
                        }
                    }
                }
            } else if (sprites.readDataNumber(value7, "State") == 1) {
            	
            } else if (sprites.readDataNumber(value7, "State") == 2) {
                if (calcDistanceX(value7, playerController) > 0) {
                    value7.vx += -1 * sprites.readDataNumber(value7, "chaseAcceleration")
                } else {
                    value7.vx += sprites.readDataNumber(value7, "chaseAcceleration")
                }
            }
            value7.vx = (100 - sprites.readDataNumber(value7, "friction")) / 100 * value7.vx
        }
    }
})

// player hit by melee
sprites.onOverlap(SpriteKind.Player, SpriteKind.GroundEnemy, function (sprite, otherSprite) {
    timer.throttle("hit", 500, function () {
        if (!(playerSlamDetect)) {
            scene.cameraShake(3, 200)
            info.changeScoreBy(-50)
            playerHealthChanged(-1)
            if (sprite.vx == 0) {
                if (randint(0, 1) == 0) {
                    sprite.vx = 160 * -25
                } else {
                    sprite.vx = -160 * -25
                }
            } else {
                sprite.vx = sprite.vx * -25
            }
            sprite.vy = -5 * PPU
        }
    })
})

function initFont () {
    // https://img.freepik.com/premium-vector/game-font-pixel-art-8bit-style-letters-numbers-vector-alphabet-pixel-white-background_360488-381.jpg?w=2000
    fontArray = [
    img`
        . . 8 8 8 8 . . 
        . 8 1 1 1 1 8 . 
        8 1 1 8 8 1 1 8 
        8 2 2 2 2 2 2 8 
        8 2 2 8 8 2 2 8 
        8 3 3 8 8 3 3 8 
        8 8 8 8 8 8 8 8 
        8 8 8 . . 8 8 8 
        `,
    img`
        . 8 8 8 8 8 8 . 
        8 1 1 1 1 1 1 8 
        8 1 1 8 8 1 1 8 
        8 2 2 2 2 2 8 . 
        8 2 2 8 8 2 2 8 
        8 3 3 3 3 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 8 8 8 8 . 
        `,
    img`
        . . 8 8 8 8 . . 
        . 8 1 1 1 1 8 . 
        8 1 1 8 8 1 1 8 
        8 2 2 8 8 8 8 . 
        8 2 2 8 8 2 2 8 
        8 8 3 3 3 3 8 8 
        . 8 8 8 8 8 8 . 
        . . 8 8 8 8 . . 
        `,
    img`
        . 8 8 8 8 8 . . 
        8 1 1 1 1 1 8 . 
        8 1 1 8 1 1 1 8 
        8 2 2 8 8 2 2 8 
        8 2 2 8 2 2 2 8 
        8 3 3 3 3 3 8 8 
        8 8 8 8 8 8 8 . 
        . 8 8 8 8 8 . . 
        `,
    img`
        . . 8 8 8 8 8 . 
        . 8 1 1 1 1 1 8 
        8 1 1 8 8 8 8 8 
        8 2 2 2 2 8 8 . 
        8 2 2 8 8 8 8 . 
        8 8 3 3 3 3 3 8 
        . 8 8 8 8 8 8 8 
        . . 8 8 8 8 8 . 
        `,
    img`
        . 8 8 8 8 8 . . 
        8 1 1 1 1 1 8 . 
        8 1 1 8 8 8 8 . 
        8 2 2 2 8 8 . . 
        8 2 2 8 8 . . . 
        8 3 3 8 . . . . 
        8 8 8 8 . . . . 
        . 8 8 . . . . . 
        `,
    img`
        . 8 8 8 8 8 . . 
        8 1 1 1 1 1 8 . 
        8 1 1 8 8 8 8 . 
        8 2 2 8 2 2 8 . 
        8 2 2 8 2 2 8 . 
        8 3 3 3 3 3 8 . 
        8 8 8 8 8 8 8 . 
        . 8 8 8 8 8 . . 
        `,
    img`
        . 8 8 . 8 8 . . 
        8 1 1 8 1 1 8 . 
        8 1 1 8 1 1 8 . 
        8 2 2 2 2 2 8 . 
        8 2 2 8 2 2 8 . 
        8 3 3 8 3 3 8 . 
        8 8 8 8 8 8 8 . 
        . 8 8 . 8 8 . . 
        `,
    img`
        . 8 8 8 8 . . . 
        8 1 1 1 1 8 . . 
        8 8 1 1 8 8 . . 
        . 8 2 2 8 . . . 
        . 8 2 2 8 . . . 
        8 3 3 3 3 8 . . 
        8 8 8 8 8 8 . . 
        . 8 8 8 8 . . . 
        `,
    img`
        . . . . . 8 8 . 
        . . . . 8 1 1 8 
        . . . . 8 1 1 8 
        . 8 8 . 8 2 2 8 
        8 2 2 8 8 2 2 8 
        8 3 3 3 3 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 8 8 8 8 . 
        `,
    img`
        . 8 8 . . 8 8 . 
        8 1 1 8 8 1 1 8 
        8 1 1 8 1 1 1 8 
        8 2 2 2 2 2 8 8 
        8 2 2 2 2 2 8 . 
        8 3 3 8 3 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 . 8 8 8 . 
        `,
    img`
        . 8 8 . . . . . 
        8 1 1 8 . . . . 
        8 1 1 8 . . . . 
        8 2 2 8 . . . . 
        8 2 2 8 8 8 . . 
        8 3 3 3 3 3 8 . 
        8 8 8 8 8 8 8 . 
        . 8 8 8 8 8 . . 
        `,
    img`
        . 8 8 . . . 8 8 . 
        8 1 1 8 . 8 1 1 8 
        8 1 1 1 8 1 1 1 8 
        8 2 2 2 2 2 2 2 8 
        8 2 2 8 2 8 2 2 8 
        8 3 3 8 8 8 3 3 8 
        8 8 8 8 . 8 8 8 8 
        . 8 8 . . . 8 8 . 
        `,
    img`
        . 8 . . 8 8 . . 
        8 1 8 8 1 1 8 . 
        8 1 1 8 1 1 8 . 
        8 2 2 2 2 2 8 . 
        8 2 2 8 2 2 8 . 
        8 3 3 8 3 3 8 . 
        8 8 8 8 8 8 8 . 
        . 8 8 . 8 8 . . 
        `,
    img`
        . . 8 8 8 . . . 
        . 8 1 1 1 8 . . 
        8 1 1 8 1 1 8 . 
        8 2 2 8 2 2 8 . 
        8 2 2 8 2 2 8 . 
        8 8 3 3 3 8 8 . 
        . 8 8 8 8 8 . . 
        . . 8 8 8 . . . 
        `,
    img`
        . 8 8 8 8 . . . 
        8 1 1 1 1 8 . . 
        8 1 1 8 1 1 8 . 
        8 2 2 2 2 2 8 . 
        8 2 2 8 8 8 8 . 
        8 3 3 8 8 8 . . 
        8 8 8 8 . . . . 
        . 8 8 . . . . . 
        `,
    img`
        . . 8 8 8 . . . 
        . 8 1 1 1 8 . . 
        8 1 1 8 1 1 8 . 
        8 2 2 8 2 2 8 . 
        8 2 2 8 2 2 8 . 
        8 8 3 3 3 8 8 . 
        . 8 8 3 8 8 . . 
        . . 8 8 8 . . . 
        . . . 8 . . . . 
        `,
    img`
        . 8 8 8 8 8 8 . 
        8 1 1 1 1 1 1 8 
        8 1 1 8 8 1 1 8 
        8 2 2 2 2 2 8 8 
        8 2 2 8 8 2 2 8 
        8 3 3 8 8 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 . . 8 8 . 
        `,
    img`
        . 8 8 8 8 8 . . 
        8 1 1 1 1 1 8 . 
        8 1 1 8 8 8 8 . 
        8 8 2 2 2 2 8 . 
        8 8 8 8 2 2 8 . 
        8 3 3 3 3 8 8 . 
        8 8 8 8 8 8 . . 
        . 8 8 8 8 . . . 
        `,
    img`
        . 8 8 8 8 8 8 . 
        8 1 1 1 1 1 1 8 
        8 8 8 1 1 8 8 8 
        . 8 8 2 2 8 8 . 
        . . 8 2 2 8 . . 
        . . 8 3 3 8 . . 
        . . 8 8 8 8 . . 
        . . . 8 8 . . . 
        `,
    img`
        . 8 8 . . 8 8 . 
        8 1 1 8 8 1 1 8 
        8 1 1 8 8 1 1 8 
        8 2 2 8 8 2 2 8 
        8 2 2 8 8 2 2 8 
        8 8 3 3 3 3 8 8 
        . 8 8 8 8 8 8 . 
        . . 8 8 8 8 . . 
        `,
    img`
        . 8 8 . . 8 8 . 
        8 1 1 8 8 1 1 8 
        8 1 1 8 8 1 1 8 
        8 2 2 8 8 2 2 8 
        8 2 2 8 2 2 8 8 
        8 3 3 3 3 8 8 . 
        8 8 8 8 8 8 . . 
        . 8 8 8 8 . . . 
        `,
    img`
        . 8 8 . . . 8 8 . 
        8 1 1 8 . 8 1 1 8 
        8 1 1 8 8 8 1 1 8 
        8 2 2 8 2 8 2 2 8 
        8 2 2 2 2 2 2 2 8 
        8 3 3 3 8 3 3 3 8 
        8 8 8 8 8 8 8 8 8 
        . 8 8 8 . 8 8 8 . 
        `,
    img`
        . 8 8 . . 8 8 . 
        8 1 1 8 8 1 1 8 
        8 1 1 1 1 1 1 8 
        8 8 2 2 2 2 8 8 
        8 2 2 2 2 2 2 8 
        8 3 3 8 8 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 . . 8 8 . 
        `,
    img`
        . 8 8 . . 8 8 . 
        8 1 1 8 8 1 1 8 
        8 1 1 1 1 1 1 8 
        8 8 2 2 2 2 8 8 
        . 8 8 2 2 8 8 . 
        . . 8 3 3 8 . . 
        . . 8 8 8 8 . . 
        . . . 8 8 . . . 
        `,
    img`
        . 8 8 8 8 8 . . 
        8 1 1 1 1 1 8 . 
        8 8 8 8 1 1 8 . 
        . 8 8 2 2 8 8 . 
        . 8 2 2 8 8 . . 
        8 3 3 3 3 3 8 . 
        8 8 8 8 8 8 8 . 
        . 8 8 8 8 8 . . 
        `
    ]
    fontNumArray = [
    img`
        . . 8 8 8 8 . . 
        . 8 1 1 1 1 8 . 
        8 1 1 8 8 1 1 8 
        8 2 2 8 8 2 2 8 
        8 2 2 8 8 2 2 8 
        8 8 3 3 3 3 8 8 
        . 8 8 8 8 8 8 . 
        . . 8 8 8 8 . . 
        `,
    img`
        . 8 8 . 
        8 1 1 8 
        8 1 1 8 
        8 2 2 8 
        8 2 2 8 
        8 3 3 8 
        8 8 8 8 
        . 8 8 . 
        `,
    img`
        . 8 8 8 8 8 8 . 
        8 1 1 1 1 1 1 8 
        8 8 8 8 8 1 1 8 
        8 2 2 2 2 2 2 8 
        8 2 2 8 8 8 8 8 
        8 3 3 3 3 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 8 8 8 8 . 
        `,
    img`
        . 8 8 8 8 8 . 
        8 1 1 1 1 1 8 
        8 8 8 8 1 1 8 
        . 8 8 2 2 8 8 
        . 8 8 8 2 2 8 
        8 3 3 3 3 3 8 
        8 8 8 8 8 8 8 
        . 8 8 8 8 8 . 
        `,
    img`
        . 8 8 . 8 8 . 
        8 1 1 8 1 1 8 
        8 1 1 8 1 1 8 
        8 2 2 2 2 2 8 
        8 8 8 8 2 2 8 
        . . . 8 3 3 8 
        . . . 8 8 8 8 
        . . . . 8 8 . 
        `,
    img`
        . 8 8 8 8 8 8 . 
        8 1 1 1 1 1 1 8 
        8 1 1 8 8 8 8 8 
        8 2 2 2 2 2 2 8 
        8 8 8 8 8 2 2 8 
        8 3 3 3 3 3 3 8 
        8 8 8 8 8 8 8 8 
        . 8 8 8 8 8 8 . 
        `,
    img`
        . 8 8 8 8 8 . 
        8 1 1 1 1 1 8 
        8 1 1 8 8 8 8 
        8 2 2 2 2 2 8 
        8 2 2 8 2 2 8 
        8 3 3 3 3 3 8 
        8 8 8 8 8 8 8 
        . 8 8 8 8 8 . 
        `,
    img`
        . 8 8 8 8 8 . 
        8 1 1 1 1 1 8 
        8 8 8 8 1 1 8 
        . 8 8 2 2 8 8 
        . 8 2 2 8 8 . 
        8 3 3 8 8 . . 
        8 8 8 8 . . . 
        . 8 8 . . . . 
        `,
    img`
        . 8 8 8 8 8 . 
        8 1 1 1 1 1 8 
        8 1 1 8 1 1 8 
        8 8 2 2 2 8 8 
        8 2 2 8 2 2 8 
        8 3 3 3 3 3 8 
        8 8 8 8 8 8 8 
        . 8 8 8 8 8 . 
        `,
    img`
        . 8 8 8 8 . . 
        8 1 1 1 1 8 . 
        8 1 1 8 1 1 8 
        8 2 2 2 2 2 8 
        8 8 8 8 2 2 8 
        . 8 8 8 3 3 8 
        . . . 8 8 8 8 
        . . . . 8 8 . 
        `
    ]
}

function initSmoothCamera () {
    smoothCamera = sprites.create(assets.image`CameraSprite`, SpriteKind.Camera)
    smoothCamera.setFlag(SpriteFlag.Invisible, true)
    smoothCamera.setFlag(SpriteFlag.Ghost, true)
}

sprites.onCreated(SpriteKind.bulletFlash, function (sprite) {
    if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
        sprite.setPosition(playerController.x - 8, playerController.y + 3)
    } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
        sprite.setPosition(playerController.x + 8, playerController.y + 3)
    }
    timer.after(300, function () {
        sprites.destroy(sprite)
    })
})

sprites.onOverlap(SpriteKind.GroundEnemy, SpriteKind.enemyProjectile, function (sprite, otherSprite) {
    sprites.changeDataNumberBy(sprite, "HP", -0.5)
    if (sprites.readDataNumber(sprite, "HP") <= 0) {
        sprites.destroy(sprite)
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            info.changeScoreBy(500)
        } else {
            info.changeScoreBy(1500)
        }
    } else {
        sprite.vx += otherSprite.vx / 5
        sprite.vy += -2 * PPU
    }
})

sprites.onCreated(SpriteKind.bulletTracer, function (sprite) {
    if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingLeft))) {
        sprite.setPosition(playerController.x - (8 + scene.screenWidth() / 2), playerController.y + 3)
    } else if (characterAnimations.matchesRule(playerController, characterAnimations.rule(Predicate.FacingRight))) {
        sprite.setPosition(playerController.x + (scene.screenWidth() / 2 + 8), playerController.y + 3)
    }
    timer.after(300, function () {
        sprites.destroy(sprite)
    })
})

function initAmmo () {
    if (currentGun == 1) {
        currentAmmo = 6
    } else if (currentGun == 2) {
        currentAmmo = 2
    } else if (currentGun == 3) {
        currentAmmo = 30
    } else if (currentGun == 4) {
        currentAmmo = 3
    }
    initAmmoCounter()
}

function attemptSlam () {
    if (!(playerController.isHittingTile(CollisionDirection.Bottom))) {
        playerController.vy = 50 * PPU
        playerSlamDetect = true
    }
}

function initPlayerAnimation () {
    characterAnimations.loopFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........8888............
        .......833d8888.........
        .......838866768........
        .......8d8666768........
        ........88666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        ........8aaa77a866888...
        ........87aaaaa888......
        .......8aa977778........
        .......8aa97778.........
        ........89aaaaa8........
        .........8aaaa98........
        ........8aa78998........
        ........8a7887a8........
        ........878.878.........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........888.............
        .......83338............
        .......833d8888.........
        .......8d8866768........
        ........88666768........
        .........8666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        ........8aaa77a866888...
        .......87aaaaaa888......
        ......8aaa977778........
        ......8aa977778.........
        .......889aaaaa8........
        .........8aaaa8.........
        ..........8aaa8.........
        ..........887a8.........
        .........899878.........
        ..........88.88.........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........8888............
        .......833d8888.........
        .......838866768........
        .......8d8666768........
        ........88666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        ........8aaa77a866888...
        ........87aaaaa888......
        .......8aa977778........
        .......8aa97778.........
        ........89aaaaa8........
        .........8aaaa98........
        ........8aa78998........
        ........8a7887a8........
        ........878.878.........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........888.............
        .......83338............
        .......833d8888.........
        .......8d8866768........
        ........88666768........
        .........8666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        .........8aa77a866888...
        .........879aaa888......
        ........8aa97778........
        ........8aa9778.........
        .........89aaaa8........
        .........8aaaaa8........
        .........8aa79998.......
        ........8aa788798.......
        .........888..878.......
        ...............8........
        `],
    100,
    characterAnimations.rule(Predicate.MovingRight, Predicate.HittingWallDown)
    )
    characterAnimations.loopFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        ........888.............
        .......83338............
        .......833d8888.........
        .......8d8866768........
        ........88666768........
        .........8666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        .........8aa77a866888...
        .........879aaa888......
        ........8aa97778........
        ........8aa9778.........
        .........89aaaa8........
        .........8aaaaa8........
        .........8aa79998.......
        ........8aa788798.......
        .........888..878.......
        ...............8........
        `],
    500,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ............8888........
        .........8888d338.......
        ........867668838.......
        ........8676668d8.......
        ........86666688........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aaa8........
        ......888aaaaa78........
        ........877779aa8.......
        .........87779aa8.......
        ........8aaaaa98........
        ........89aaaa8.........
        ........89987aa8........
        ........8a7887a8........
        .........878.878........
        `,img`
        ........................
        ........................
        ........................
        ........................
        .............888........
        ............83338.......
        .........8888d338.......
        ........8676688d8.......
        ........86766688........
        ........8666668.........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aaa8........
        ......888aaaaaa78.......
        ........877779aaa8......
        .........877779aa8......
        ........8aaaaa988.......
        .........8aaaa8.........
        .........8aaa8..........
        .........8a788..........
        .........878998.........
        .........88.88..........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ............8888........
        .........8888d338.......
        ........867668838.......
        ........8676668d8.......
        ........86666688........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aaa8........
        ......888aaaaa78........
        ........877779aa8.......
        .........87779aa8.......
        ........8aaaaa98........
        ........89aaaa8.........
        ........89987aa8........
        ........8a7887a8........
        .........878.878........
        `,img`
        ........................
        ........................
        ........................
        ........................
        .............888........
        ............83338.......
        .........8888d338.......
        ........8676688d8.......
        ........86766688........
        ........8666668.........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aa8.........
        ......888aaa978.........
        ........87779aa8........
        .........8779aa8........
        ........8aaaa98.........
        ........8aaaaa8.........
        .......89997aa8.........
        .......897887aa8........
        .......878..888.........
        ........8...............
        `],
    100,
    characterAnimations.rule(Predicate.MovingLeft, Predicate.HittingWallDown)
    )
    characterAnimations.loopFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        .............888........
        ............83338.......
        .........8888d338.......
        ........8676688d8.......
        ........86766688........
        ........8666668.........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aa8.........
        ......888aaa978.........
        ........87779aa8........
        .........8779aa8........
        ........8aaaa98.........
        ........8aaaaa8.........
        .......89997aa8.........
        .......897887aa8........
        .......878..888.........
        ........8...............
        `],
    500,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.runFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........8888............
        .......833d8888.........
        .......838866768........
        .......8d8666768........
        ........88666668........
        .........8661618...8....
        .........836666888888...
        .........883338877778...
        ........8aaa77a866888...
        ........87aaaaa888......
        .......8aa977778........
        .......8aa97778.........
        ........89aaaaa8........
        .........8aaaa98........
        ........8aa788998.......
        ........8a88.898........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........8888............
        .......833d8888.........
        .......838866768........
        .......8d8666768........
        ........88666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        ........8aaa77a866888...
        ........87aaaaa888......
        .......8aa977778........
        .......8aa97778.........
        ........89aaaaa8........
        .........8aaaa98........
        ........8aa788998.......
        ........8a88.898........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........8888............
        .......833d8888.........
        .......838866768........
        .......8d8666768........
        ........88666668........
        .........8661618........
        .........8366668...8....
        ..........83338888888...
        .........87aaaa877778...
        ........8aaa77a866888...
        ........87aaaaa888......
        .......8aa977778........
        .......8aa97778.........
        ........89aaaaa8........
        .........8aaaa98........
        ........8aa78998........
        ........8a7887a8........
        ........878.878.........
        `],
    100,
    characterAnimations.rule(Predicate.HittingWallDown, Predicate.FacingRight, Predicate.NotMoving)
    )
    characterAnimations.runFrames(
    playerController,
    [img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ............8888........
        .........8888d338.......
        ........867668838.......
        ........8676668d8.......
        ........86666688........
        ....8...8161668.........
        ...888888666638.........
        ...877778833388.........
        ...888668a77aaa8........
        ......888aaaaa78........
        ........877779aa8.......
        .........87779aa8.......
        ........8aaaaa98........
        ........89aaaa8.........
        .......899887aa8........
        ........898.88a8........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ............8888........
        .........8888d338.......
        ........867668838.......
        ........8676668d8.......
        ........86666688........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aaa8........
        ......888aaaaa78........
        ........877779aa8.......
        .........87779aa8.......
        ........8aaaaa98........
        ........89aaaa8.........
        .......899887aa8........
        ........898.88a8........
        `,img`
        ........................
        ........................
        ........................
        ........................
        ........................
        ........................
        ............8888........
        .........8888d338.......
        ........867668838.......
        ........8676668d8.......
        ........86666688........
        ........8161668.........
        ....8...8666638.........
        ...88888883338..........
        ...877778aaaa78.........
        ...888668a77aaa8........
        ......888aaaaa78........
        ........877779aa8.......
        .........87779aa8.......
        ........8aaaaa98........
        ........89aaaa8.........
        ........89987aa8........
        ........8a7887a8........
        .........878.878........
        `],
    100,
    characterAnimations.rule(Predicate.HittingWallDown, Predicate.FacingLeft, Predicate.NotMoving)
    )
}

sprites.onOverlap(SpriteKind.GroundEnemy, SpriteKind.Player, function (sprite, otherSprite) {
    if (otherSprite.vy > 400) {
        sprites.changeDataNumberBy(sprite, "HP", -1)
        if (sprites.readDataNumber(sprite, "HP") <= 0) {
            sprites.destroy(sprite)
            if (sprite.isHittingTile(CollisionDirection.Bottom)) {
                info.changeScoreBy(100)
            } else {
                info.changeScoreBy(250)
            }
        }
    }
})

sprites.onDestroyed(SpriteKind.projectileGroundEnemy, function (sprite) {
    for (let index = 0; index < randint(1, 3); index++) {
        scrapMetal = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.metalScrap)
        scrapMetal.setPosition(sprite.x, sprite.y)
    }
    for (let index = 0; index < randint(1, 3); index++) {
        gibs2 = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.gibs)
        gibs2.setPosition(sprite.x, sprite.y)
    }
    scene.cameraShake(2, 100)
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        tileUtil.coverTile(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), assets.tile`myTile23`)
    }
})

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(playerController.isHittingTile(CollisionDirection.Bottom))) {
        attemptSlam()
    }
})

function playerHealthChanged (Amount: number) {
    playerHealthBar.value += Amount
    curseFactor = playerHealthBar.value / playerHealthBar.max
    if (Amount < 0) {
        playerCurseBar.value += curseFactor
    } else {
        playerCurseBar.value += curseFactor * -1
    }
}

function calcDistanceX (startSprite: Sprite, endSprite: Sprite) {
    disX = startSprite.x - endSprite.x
    if (disX < 0) {
        return 0
    } else {
        return 1
    }
}

sprites.onDestroyed(SpriteKind.Projectile, function (sprite) {
    if (currentGun == 4) {
        for (let value of sprites.allOfKind(SpriteKind.GroundEnemy)) {
            if (sprites.readDataBoolean(value, "spiked")) {
                sprites.destroy(value)
            }
        }
        for (let value of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
            if (sprites.readDataBoolean(value, "spiked")) {
                sprites.destroy(value)
            }
        }
    }
})

function enemyShoot (dir: number, x: number, y: number) {
    if (dir == 0) {
        projectile = sprites.create(img`
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . c c c c c c c c . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            `, SpriteKind.enemyProjectile)
        projectile.setVelocity(-100, 0)
        projectile.setPosition(x, y)
    } else if (dir == 1) {
        projectile = sprites.create(img`
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . c c c c c c c c . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 
            `, SpriteKind.enemyProjectile)
        projectile.setVelocity(100, 0)
        projectile.setPosition(x, y)
    } else if (dir == 2) {
        projectile = sprites.create(img`
            . . . . . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . c . . . 
            . . . . . . . 
            . . . . . . . 
            . . . . . . . 
            . . . . . . . 
            . . . . . . . 
            . . . . . . . 
            `, SpriteKind.enemyProjectile)
        projectile.setVelocity(0, -100)
        projectile.setPosition(x, y)
    }
    projectile.setFlag(SpriteFlag.AutoDestroy, true)
    projectile.setFlag(SpriteFlag.DestroyOnWall, true)
}

sprites.onCreated(SpriteKind.metalScrap, function (sprite) {
    scrapmetalArray = [
    img`
        . . . 7 . . . . 
        . . 7 7 6 . . . 
        . 6 7 6 6 7 . . 
        . 8 6 6 7 7 6 . 
        . 8 8 6 7 6 7 8 
        . . 8 8 6 7 8 8 
        . . . 8 8 8 8 . 
        . . . . 8 8 . . 
        `,
    img`
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . 6 7 . . . 8 . 
        8 7 6 7 6 8 8 . 
        8 8 7 6 8 8 . . 
        . 8 8 8 8 . . . 
        . . 8 8 . . . . 
        `,
    img`
        . . . . . . . . 
        . 8 8 8 . . . . 
        . 8 7 8 . . . . 
        8 6 7 6 8 8 8 . 
        8 6 7 6 7 6 7 8 
        8 6 7 6 8 8 8 . 
        . 8 7 8 . . . . 
        . 8 8 8 . . . . 
        `,
    img`
        . . . . . . . . 
        . . 8 8 8 . . . 
        . 8 7 7 7 8 . . 
        8 7 7 8 7 7 8 . 
        8 7 8 . 6 7 8 . 
        8 7 7 6 7 7 8 . 
        . 8 7 7 7 8 . . 
        . . 8 8 8 . . . 
        `,
    img`
        . . . . . . . . 
        . . . c . . . . 
        . . . e . . . . 
        . . d e e d . . 
        . d e . d e . . 
        c e e . d e d . 
        . e d d d e d . 
        . . e e e d . . 
        `,
    img`
        . . . . . . . . 
        . . . . . . . . 
        . . . 6 . . . . 
        . . 6 6 7 . . . 
        . 6 6 7 7 6 . . 
        . 8 6 7 6 7 8 . 
        . . 8 6 7 8 . . 
        . . . 8 8 . . . 
        `,
    img`
        . . . c . . . . 
        . . c c f . . . 
        . f c f f c . . 
        . 1 f f c c f . 
        . 1 1 f c f c 2 
        . . 1 1 f c 2 2 
        . . . 1 1 2 2 . 
        . . . . 1 2 . . 
        `,
    img`
        . . . . . . . . 
        . . . . . . . . 
        . . . f . . . . 
        . . f f c . . . 
        . f f c c f . . 
        . 1 f c f c 2 . 
        . . 1 f c 2 . . 
        . . . 1 2 . . . 
        `
    ]
    sprite.setImage(scrapmetalArray._pickRandom())
    sprite.setVelocity(randint(-64, 64), randint(-50, -100))
    sprite.ay = Gravity
    // 15 seconds - lifespan is in miliseconds
    sprite.lifespan = 15000
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
})
//function initLevelButBetter() {
//    tiles.setCurrentTilemap(levelSet[nextLevel])
//    if (nextLevel == levelSet.length) {
//        game.over(true)
//    }
//
//}
function initLevel (LevelNum: number) {
    if (LevelNum == 0) {
        currentLevel = 0
        timer.after(500, function () {
            game.splash("[INITIALIZING SIMULATION...]")
            game.splash("PRESS SPACE OR", "THE A BUTTON TO BEGIN")
            timer.after(500, function () {
                tiles.setCurrentTilemap(tilemap`level5`)
                initPlayer()
                initSmoothCamera()
                color.startFade(color.Black, color.originalPalette, 1000)
                initAutomaticText("This is YOU.", 3, 3)
                timer.after(200 * "This is YOU.".length, function () {
                    playerCanMove = true
                    smoothCamera_Active = true
                    initAutomaticText("Move with your ARROWS", 4, 3)
                    timer.after(200 * "Move with your ARROWS".length, function () {
                        initAutomaticText("Or with your DPAD", 4, 3)
                    })
                })
            })
        })
    } else if (LevelNum == 1) {
        currentLevel = 1
        tiles.setCurrentTilemap(tilemap`level14`)
        initPlayer()
        playerCanMove = false
        initSmoothCamera()
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level16`)
            initPlayer()
            playerCanMove = true
        })
    } else if (LevelNum == 2) {
        currentLevel = 2
        tiles.setCurrentTilemap(tilemap`level18`)
        initPlayer()
        playerCanMove = false
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level19`)
            initPlayer()
            initAutomaticText("Take your ARMS. Hit X to RELOAD.", 4, 2)
            playerCanMove = true
        })
    } else if (LevelNum == 3) {
        currentLevel = 3
        tiles.setCurrentTilemap(tilemap`level33`)
        initPlayer()
        playerCanMove = false
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level34`)
            initPlayer()
            playerCanMove = true
        })
    } else if (LevelNum == 4) {
        currentLevel = 4
        tiles.setCurrentTilemap(tilemap`level43`)
        initPlayer()
        playerCanMove = false
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level44`)
            initPlayer()
            playerCanMove = true
            initGunTypes()
            initAmmo()
            initAmmoCounter()
            reloadGun()
        })
    } else if (LevelNum == 5) {
        currentLevel = 5
        tiles.setCurrentTilemap(tilemap`level45`)
        initPlayer()
        playerCanMove = false
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level46`)
            initPlayer()
            playerCanMove = true
            initGunTypes()
            initAmmo()
            initAmmoCounter()
            reloadGun()
        })
    } else if (LevelNum == 6) {
        currentLevel = 6
        tiles.setCurrentTilemap(tilemap`level70`)
        initPlayer()
        playerCanMove = false
        tiles.placeOnTile(smoothCamera, tiles.getTileLocation(0, 0))
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.vx = 150
        timer.after(1500, function () {
            smoothCamera.vx = 0
            tiles.setCurrentTilemap(tilemap`level71`)
            initPlayer()
            playerCanMove = true
            initGunTypes()
            initAmmo()
            initAmmoCounter()
            reloadGun()
        })
    } else if (LevelNum == 7) {
        currentLevel = 7
        tiles.setCurrentTilemap(tilemap`level74`)
        scene.cameraFollowSprite(smoothCamera)
        smoothCamera.follow(playerController, 500)
        playerCanMove = true
        initGunTypes()
        initAmmo()
        initAmmoCounter()
        reloadGun()
    } else if (LevelNum == 8) {
        currentLevel = 8
        game.splash("YOU HAVE BEEN CURSED BY", "THE HAND OF MIDAS.")
        game.splash("THE MORE DAMAGE YOU TAKE...", "THE MORE YOU STAND IDLE...")
        game.splash("THE MORE OF A STATUE", "YOU BECOME.")
        game.splash("THE ONLY WAY TO COUNTERACT", "IS TO GENERATE ELECTRICITY.")
        game.splash("CONVERT METAL INTO POWER.", "TURN THE TIDES.")
        game.splash("GOOD LUCK.", "[ENDING SIMULATION...]")
        initLevel(9)
    } else if (LevelNum == 9) {
        currentLevel = 9
        scene.setBackgroundImage(img`
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111222211111111111111111111111111111111111111111111111111111111111111111111111111111122221111111111111111111111111111111111111111111111111111
            1111111111111111111112222221111111111111111111111111111111111111111111111111111111111111111111111111111222222111111111111111111111111111111111111111111111111111
            1111111111111111111112222221122111111111111111111111111111111111111111111111111111111111111111111111111222222112211111111111111111111111111111111111111111111111
            1111111111111111112222222221222221111111111111111111111111111111111111111111111111111111111111111111222222222122222111111111111111111111111111111111111111111111
            1111111111111111122222222222222221111111111111111111111111111111111111111111111111111111111111111112222222222222222111111111111111111111111111111111111111111111
            1111111111111111222222222222222222211111111111111111111111111111111111111111111111111111111111111122222222222222222221111111111111111111111111111111111111111111
            1111111111111111222222222222222222221111111111111111111111111111111111111111111111111111111111111122222222222222222222111111111111111111111111111111111111111111
            1111111111111111122222222222222222221112211111111111111111111111111111111111111111111111111111111112222222222222222222111221111111111111111111111111111111111111
            1111111111111222212222222222222222221122222111111111111111111111111111111111111111111111111111122221222222222222222222112222211111111111111111111111111111111111
            1111111111112222221222222222222222211122222111111111111111111111111111111111111111111111111111222222122222222222222221112222211111111111111111111111111111111111
            1111111111112222222222222222222222122222222211111111111111111111111111111111111111111111111111222222222222222222222212222222221111111111111111111111111111111111
            1111111111112222222222222222222222222222222211111111111111111111111111111111111111111111111111222222222222222222222222222222221111111111111111111111111111111111
            1111111111111222222222222222222222222222222211111111111111111111111111111111111111111111111111122222222222222222222222222222221111111111111111111111111111111111
            1122211112222122222222222222222222222222222112211111111111112222111111111111111111112221111222212222222222222222222222222222211221111111111111222211111111111111
            1222221122222222222222222222222222222222222122221111111111122222211111111111111111122222112222222222222222222222222222222222212222111111111112222221111111111111
            1222221222222222222222222222222222222222222122221111111111122222212221111111111111122222122222222222222222222222222222222222212222111111111112222221222111111111
            1122222222222222222222222222222222222222222222221111111111111222222222111111111111112222222222222222222222222222222222222222222222111111111111122222222211111111
            1222222222222222222222222222222222222222222222211111111122221222222222111111111111122222222222222222222222222222222222222222222221111111112222122222222211111111
            2222222222222222222222222222222222222222222222221111111222222222222221111111111111222222222332222222222222222222222222222222222222111111122222222222222111111111
            2222222222222222222222222222222222222222222222222122211222222222222222222111111333222222222333222222222222222222222222222222222222212221122222222222222222211111
            2222222222222222222222222222222222222222222222222222222222222222222222222211111333222222222333222222222222222222222222222222222222222222222222222222222222221111
            2222222222222222222222222222222222222222222222222222222222222222222222222211133333332222223333322222222222222222222222222222222222222222222222222222222222221111
            2222222222222222222222222222222222222222233333333322222222222222222222222222233333332222223333322222222222222222222222222222222222222222233333333332222222222222
            2222222222222222222222222222222222222222233333333322222222222222222222222222233333332222223333322222222222222222222222222222222222222222233333333332222222222222
            2222222222222222222333222222222222222222232233333322222222222222222222222222232233332222233333332222222222222222222233222222222222222222233232333332222222222222
            2222222222222222223333322222222222222222233333332322222222222222222222222222233333332222233333332222222222222222222333322222222222222222233333322332222222222222
            2222222222222222233333322222222222222222233333333322222222223222222223333322232333332222233333332222222222222222233333322222222222222222233333333332222222222222
            2222222222222222233323222222322222222222233333333322222222233222222223333322233333332222233333332222222222222222233323222222332222222222233332333332222222233222
            2222222222222222233333322222322222222222233333332322222222233222222223333322233333332222233333332222222222222222233333322222332222222222233333332332222222233222
            2222222233322222233223222223332222222222233333333322333333233222222223333322233333332222233333332222222223322222233323222223332222222222233333333332333333333222
            3233222233333333333233322233333222222222233333332322322333233222222222332332233333332223333333333233222233333333333332322223333222222222233333322332322333333222
            3333222223233233333333322233333222222222233333333322333323233222222223333332233233332223333333333333222233233323333333322223333222222222233333333332333323333222
            3323222223332222333333322233333222222222233333333322333323333222222223333332233333332223333333333323222233332322333333322223333222222222233333333332333323333222
            3333222233333333333333332233333322332332333333333332322333333222222223333332233333332223333333333333222233333333333333332233333322232233333333333332322333333222
            3323222233333333333333332233333322333333333333333332333333333223223223333332233333332223333333333323222233333333333333332233333322233333333333333332333333333222
            3333323323233333333333332233333332333322333333333333322443333333233322332332233333332223333333333333332333233333333333332233333332223223333334333333322444333233
            3333323333333333333333333323333332333333333444333333333444333333233323333332233333332223333333333333332333333333333333333333333332333333333344333333333444333233
            3333323333333333333333333333333332333333333444333333333444333333333333333333333333332223333333333333332333333333333333333333333332333333333344333333333444333333
            3333323333333333333333333333333332333333344444443333334444433333333333333333333333333323333333333333332333333333333333333333333332323333334444444333334444433333
            3333344444444433333333333333333332333333344444443333334444433333333333333333333333333323333333333333344444444443333333333333333332333333334444444333334444433333
            3333344444444433333333333333333332333333344444443333334444433333333333333333333333333323333333333333344444444443333333333333333332333333334444444333334444433333
            3333343344444433333333333333333332333333343344443333344444443322233333333333333344333323333333333333344343444443333333333333333332333333334444444333344444444223
            3333344444443433333333333333333332333333344444443333344444443332233333333333333444433323333333333333344444433443333333333333333332333333334444444333344444444333
            3333344444444433333333334333333334444433343444443333344444443333333333323333344444433323333333333333344444444443333333333333333333444433334443444333344444444333
            3333344444444433333333344333333334444433344444443333344444443323333333333333344434333333443333333333344443444443333333344333333333444433334443444333344444444323
            3333344444443433333333344333333334444433344444443333344444443322233333333333344444433333443333333333344444443443333333344333333334444443334444444333344444444223
            3333344444444433444444344333333334444433344444443333344444443333333334423333344434333334443333333333344444444443444444444333333334444443334443444333344444444333
            3333344444443433433444344333333333443443344444443334444444444344333344444444444443433334444333333333344444433443433444444333333334444444334444444334444444444444
            3333344444444433444434344333333334444443344344443334444444444444333344344434444444433334444333333333344444444443444434444333333334444444334444344334444444444444
            3333344444444433444434444333333334444443344444443334444444444434333344443433444444433334444333333333344444444443444434444333333334444444334444444334444444444444
            3443444444444443433444444333333334444443344444443334444444444444333344444444444444443344444433343344444444444443433444444333333334444444334444444334444444444444
            4444444444444443444444444334334334444443344444443334444444444434333344444444444444443344444433344444444444444443444444444333334334444444334444444334444444444444
            4433444444444444433334444444344433443443344444443334444444444444443444344444444444443344444443334334444444444444433434444344344434444444334444444334444444444444
            4444444444444444444444444444344434444443344444443334444444444444443444444444444444444444444443444444444444444444444444444344344444444444334444344334444444444444
            4444444444444444444444444444444444444444444444443334444444444444443444444444444444444444444443444444444444444444444444444444444444444444444444444334444444444444
            4444444444444444444444444444444444444444444444444434444444444444443444444444444444444444444443434444444444444444444444444444444444444444444444444434444444444444
            4444444444444444444444444444444444444444444444444434444444444444443444444444444444444444444443444444444444444444444444444444443444444444444444444434444444444444
            4444444444444444444444444444444444444444444444444434444444444444443444444444444444444444444443444444444444444444444444444444444444444444444444444434444444444444
            4444444444444444444444444433344444444444444444444434444444444444443444444444444444444444444443444444444444444444444444444334343444444444444444444444444444444444
            4444444444444444444444444443344444444444444444444434444444444444443444444444444444444444444443444444444444444444444444444444343444444444444444444444444444444444
            4444444444444444444444444444444444434444444444444434444444444444444444444444444444444444444444444444444444444444444444444444443444434444444444444444444444444444
            4444444444444444444444444434444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444434444444444444444444444444444444444444
            4444444444444444444444444433344444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444334344444444444444444444444444444444444
            4444444444444444444444444444444444434444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444
            4444444444444444484444444444444444844444444444444444444448444444444444444484444444444444444444444844444444444444448444444444444444444444484444444444444444844444
            4444448444884444488444484448444484884448444444844488444448844448444844448488444844444484448844444884444844484444848844484444448444884444488444484448444484884448
            4484448848844844488444884448844484488488448444884884484448844488444884448448848844844488488448444884448844488444844884884484448848844844488444884448844484488488
            4488448848844884448848844448848488488884448844884884488444884884444884848848888444884488488448844488488444488484884888844488448848844884448848844448848488488884
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
            `)
        tiles.setCurrentTilemap(tilemap`level1`)
        playerCanMove = true
        initPlayer()
        initBars()
        initGunTypes()
        initAmmo()
        initAmmoCounter()
        reloadGun()
        sprites.destroy(smoothCamera)
        scene.cameraFollowSprite(playerController)
        timer.after(1000, function () {
            sprites.destroyAllSpritesOfKind(SpriteKind.Text)
            initSpawnableArray()
            waveCount = 0
            initEnemy(0)
        })
    }
}

sprites.onOverlap(SpriteKind.GroundEnemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprites.changeDataNumberBy(sprite, "HP", checkGunDamage())
    if (sprites.readDataNumber(sprite, "HP") <= 0) {
        sprites.destroy(sprite)
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            info.changeScoreBy(100)
        } else {
            info.changeScoreBy(250)
        }
    } else {
        if (currentGun == 4) {
            timer.throttle("action", 1000, function () {
                sprites.setDataBoolean(sprite, "spiked", true)
                sprite.follow(otherSprite, otherSprite.vx)
            })
        } else {
            timer.throttle("knockback", 150, function () {
                sprite.vx += otherSprite.vx / 5
                sprite.vy += -2 * PPU
            })
        }
    }
})

sprites.onOverlap(SpriteKind.projectileGroundEnemy, SpriteKind.Player, function (sprite, otherSprite) {
    if (otherSprite.vy > 400) {
        sprites.changeDataNumberBy(sprite, "HP", -1)
        if (sprites.readDataNumber(sprite, "HP") <= 0) {
            sprites.destroy(sprite)
            if (sprite.isHittingTile(CollisionDirection.Bottom)) {
                info.changeScoreBy(100)
            } else {
                info.changeScoreBy(250)
            }
        }
    }
})

game.onUpdateInterval(200, function () {
    if (playerCanMove) {
        if (currentLevel != 2) {
            if (currentLevel <= 5) {
                if (playerController.tilemapLocation().column >= 6) {
                    timer.throttle("action", 5000, function () {
                        scene.cameraShake(2, 50)
                        tiles.setWallAt(tiles.getTileLocation(9, 5), false)
                        tiles.setWallAt(tiles.getTileLocation(9, 6), false)
                        tiles.setTileAt(tiles.getTileLocation(9, 5), assets.tile`PlayerIndication0`)
                        tiles.setTileAt(tiles.getTileLocation(9, 6), assets.tile`PlayerIndication0`)
                    })
                }
            }
        }
    }
})

game.onUpdateInterval(500, function () {

    if (waveCount > 0) {
        if (sprites.allOfKind(SpriteKind.GroundEnemy).length < 1 && sprites.allOfKind(SpriteKind.projectileGroundEnemy).length < 1) {
            initEnemy(0)
        }
    }

    for (let value13 of sprites.allOfKind(SpriteKind.gibs)) {
        if (value13.isHittingTile(CollisionDirection.Bottom)) {
            value13.setVelocity(0, 0)
        }
    }
    for (let value14 of sprites.allOfKind(SpriteKind.metalScrap)) {
        if (calcDistance(value14, playerController) <= 55) {
            value14.follow(playerController, 75)
        } else {
            if (value14.isHittingTile(CollisionDirection.Bottom)) {
                value14.setVelocity(0, 0)
            }
        }
    }
    for (let value15 of sprites.allOfKind(SpriteKind.metalTrash)) {
        if (value15.isHittingTile(CollisionDirection.Bottom)) {
            value15.setVelocity(0, 0)
        }
    }
})

game.onUpdateInterval(1000, function () {
    if (bars_areActive) {
        playerCurseBar.value += 0.15
    }
})


game.onUpdateInterval(2000, function () {
    for (let value16 of sprites.allOfKind(SpriteKind.effect)) {
        sprites.destroy(value16)
    }
})

game.onUpdateInterval(5000, function () {
    if (playerCanMove) {
        for (let value of sprites.allOfKind(SpriteKind.GroundEnemy)) {
            if (tiles.tileAtLocationIsWall(value.tilemapLocation())) {
                sprites.destroy(value)
            }
        }
        for (let value of sprites.allOfKind(SpriteKind.projectileGroundEnemy)) {
            if (tiles.tileAtLocationIsWall(value.tilemapLocation())) {
                sprites.destroy(value)
            }
        }
    }
})


