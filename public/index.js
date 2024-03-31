//platformImg defenition
const platformImg = new Image()
platformImg.src = './img/platform.png'
//backgroundImg defenition
const backgroundImg = new Image()
backgroundImg.src = './img/background.png'
//hillsImg defenition
const hillsImg = new Image()
hillsImg.src = './img/hills.png'
//platformSmallTallImg defenition
const platformSmallTallImg = new Image()
platformSmallTallImg.src = './img/platformSmallTall.png'
//spriteRunLeftImg defenition
const spriteRunLeftImg = new Image()
spriteRunLeftImg.src = './img/spriteRunLeft.png'
//spriteRunRightImg defenition
const spriteRunRightImg = new Image()
spriteRunRightImg.src = './img/spriteRunRight.png'
//spriteStandLeftImg defenition
const spriteStandLeftImg = new Image()
spriteStandLeftImg.src = './img/spriteStandLeft.png'
//spriteStandRightImg defenition
const spriteStandRightImg = new Image()
spriteStandRightImg.src = './img/spriteStandRight.png'

console.log(platformImg)

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const WinText = document.querySelector('.win')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5
class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 66
        this.height = 150
        this.image = spriteStandRightImg,
        this.frames = 0
        this.sprites = {
            stand: {
                right: spriteStandRightImg,
                left: spriteStandLeftImg,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: spriteRunRightImg,
                left: spriteRunLeftImg,
                cropWidth: 341,
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }

    update() {
        this.frames++
        if (
            this.frames > 59 && 
            (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
        this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y +this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
    }
}
class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image,
        this.width = image.width,
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image,
        this.width = image.width,
        this.height = image.height
    }

    draw() {
        
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

let player = new Player()
let platforms = []
let genericObjects = []

let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

let scrollOffSet = 0

function init() {
player = new Player()
platforms = [
    new Platform({ x: platformImg.width * 4 + 300 - 2 + platformImg.width - platformSmallTallImg.width, y: 270, image: platformSmallTallImg}),
    new Platform({
    x: -1, 
    y: 470,
    image: platformImg
}), 
new Platform({ x: platformImg.width - 3, y: 470, image: platformImg}),
new Platform({ x: platformImg.width * 2 + 100, y: 470, image: platformImg}),
new Platform({ x: platformImg.width * 3 + 300, y: 470, image: platformImg}),
new Platform({ x: platformImg.width * 4 + 300 - 2, y: 470, image: platformImg}),
new Platform({ x: platformImg.width * 5 + 700 - 2, y: 470, image: platformImg}),
new Platform({ x: platformImg.width * 6 + 700 - 4, y: 470, image: platformImg})

]
genericObjects = [
    new GenericObject({
            x: -1,
            y: -1,
            image: backgroundImg
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: hillsImg
        })
    ]


scrollOffSet = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffSet === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0
        
        if (keys.right.pressed) {
            scrollOffSet += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed && scrollOffSet > 0) {
            scrollOffSet -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.66
            })
        }
    }

    console.log(scrollOffSet)

    //platform collision detection
    platforms.forEach(platform => {
    if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width
     ) {
        player.velocity.y = 0
    }
})

//sprite switching conditional
if (
    keys.right.pressed && 
    lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth,
    player.width = player.sprites.run.width
} else if (
    keys.left.pressed && 
    lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth,
    player.width = player.sprites.run.width
} else if (
    !keys.left.pressed && 
    lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth,
    player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed && 
        lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth,
        player.width = player.sprites.stand.width
        }
// win condition
if (scrollOffSet > platformImg.width * 5 + 300 - 2) {
    const pElement = document.createElement('p')
    pElement.textContent = 'Well Done You Have Won The Game!'
    WinText.append(pElement)
}
// lose condition
if (player.position.y > canvas.height) {
    init()
}
}

init()
animate()

window.addEventListener('keydown', ({ keyCode }) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break

        case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }

    console.log(keys.right.pressed)
})

window.addEventListener('keyup', ({ keyCode }) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth,
            player.width = player.sprites.stand.width
            keys.left.pressed = false
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth,
            player.width = player.sprites.stand.width
            keys.right.pressed = false
            break

        case 87:
            console.log('up')
            break
    }
    console.log(keys.right.pressed)
})

