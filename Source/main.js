// Create game configuration object
let config =
{
    type: Phaser.CANVAS,
    width: 650, //default 640
    height: 550, //default 480

    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },

    physics: {
        // default: "arcade",
        // arcade: {
        //   debug: true,
        //   debugShowBody: true
        // }
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: true,
            debugShowBody: true
        }
    },

    scene: [Menu, Tutorial, Credits, Play]
};

let game = new Phaser.Game(config); // create main game object

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let graphics;
let path;

// define the game settings, initially set for easy mode
game.settings =
{
    hp: 5,
    playerSpeed: 5,
    gameTimer: 6000,
    respawnDelay1: 1,

    countdown: 0
};

// reserve some keyboard bindings
let keyW, keyA, keyS, keyD, keyE, keyH, keyM, keyR, keyF, keyP, keyT, keyLEFT, keyRIGHT, keySPACE, keyESC, keyC;
// reserve an inputPlugin binding
let mouse;