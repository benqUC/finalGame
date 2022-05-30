// Create game configuration object
let config =
{
    type: Phaser.CANVAS,
    width: 650, //default 640
    //width: 1700, //default 640
    
    height: 500, //default 480

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

    scene: [Menu, Tutorial, Play]
};

let game = new Phaser.Game(config); // create main game object

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// define the game settings, initially set for easy mode
game.settings =
{
    playerSpeed: 5,
    fastzombieSpeed: 4,
    gameTimer: 6000,
    gasTimer: 0,
    gas: 8,
    countdown: 0
};

// reserve some keyboard bindings
let keyW, keyA, keyS, keyD, keyE, keyH, keyM, keyR, keyF, keyLEFT, keyRIGHT, keySPACE;
// reserve an inputPlugin binding
let mouse;