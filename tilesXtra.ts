enum TileAnimationOrder {
    //% block="loop sync"
    LoopSync,
    //% block="loop async"
    LoopAsync,
    //% block="random"
    Random,
    //% block="delayed"
    Delayed

}

namespace scene {


    class animatedTile {

        originalTile: Image
        animation: Image[]
        loc: tiles.Location[]
        frames: number[]
        delay: number[]
        order: TileAnimationOrder
        time: number
        interval: number
        delayMax: number

        constructor(tile: Image, frames: Image[], frameInterval: number, order: TileAnimationOrder, delay?: number) {
            this.originalTile = tile
            this.animation = frames
            this.interval = frameInterval
            this.order = order
            this.delayMax = delay
            this.loc = []
            this.frames = []
            this.delay = []
            this.time = control.millis()
        }

        start() {
            game.eventContext().registerFrameHandler(scene.ANIMATION_UPDATE_PRIORITY, () => {
                //  state.animations = state.animations.filter((anim: SpriteAnimation) => {
                //      if (anim.sprite.flags & sprites.Flag.Destroyed)
                //          return false;
                //      return !anim.update(); // If update returns true, the animation is done and will be removed
                this.update()
                return true;

            });
        }

        public update(): void {
            const deltaTime = control.millis() - this.time;
            if (deltaTime > this.interval) {
                let frame: number
                for (let i = 0; i < this.loc.length; i++) {
                    if (this.delay[i] > 0) {
                        this.delay[i]--

                    } else {
                        if (this.order == TileAnimationOrder.Random) {
                            frame = randint(0, this.animation.length - 1)
                            this.delay[i] = randint(0, 3)
                        }
                        else {
                            if ((this.order == TileAnimationOrder.LoopAsync) && !randint(0, 20)) this.frames[i]++
                            frame = this.frames[i] = (this.frames[i] + 1) % this.animation.length
                        }
                        if ((this.order == TileAnimationOrder.Delayed) && (frame == 0)) {
                            tiles.setTileAt(this.loc[i], this.originalTile)
                            this.delay[i] = randint(this.delayMax / 2, this.delayMax)
                        } else
                            tiles.setTileAt(this.loc[i], this.animation[frame])
                    }
                }
                this.time = control.millis()
            }
        }

    }

    let animationList: animatedTile[] = []

    //% blockId=run_tile_anin
    //% block="animate $tile frames $frames=animation_editor interval $frameInterval order $order ||delay %delay"
    //% tile.shadow=tileset_tile_picker
    //% delay.min=0 delay.max=200 delay.step=1
    //% delay.defl=0
    //% blockNamespace="scene" group="Tiles Xtra" blockGap=8
    //% weight=200
    export function runTileAnimation(tile: Image, frames: Image[], frameInterval: number, order: TileAnimationOrder, delay?: number) {

        let newAnimation: animatedTile = new animatedTile(tile, frames, frameInterval, order, delay)
        const tm = game.currentScene().tileMap;
        const width = tm.areaWidth() >> tm.scale
        const height = tm.areaHeight() >> tm.scale

        for (let x = 0; x < width; x++)
            for (let y = 0; y < height; y++)
                if (tiles.getTileAt(x, y) == tile) {
                    newAnimation.loc.push(tiles.getTileLocation(x, y))
                    //frame order 
                    let startFrame = 0
                    if (order == TileAnimationOrder.LoopAsync)
                        startFrame = (randint(0, 5))
                    newAnimation.frames.push(startFrame)
                    // deley
                    let startDelay = 0
                    if (order == TileAnimationOrder.Delayed)
                        startDelay = randint(delay / 2, delay)
                    newAnimation.delay.push(startDelay)

                }
        animationList.push(newAnimation)
        newAnimation.start()
    }

}