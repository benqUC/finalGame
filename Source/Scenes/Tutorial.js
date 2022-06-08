class Tutorial extends Phaser.Scene
{
    constructor()
    {
        super("tutorialScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load audio files
        this.load.audio("wrapper1", "./assets/wrapper1.mp3");
        this.load.audio("sfx_select", "./assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./assets/explosion38.wav");
        
        //load bgm
        this.load.audio("bgm1_getReady", "./assets/bgm/bgm1_getReady.wav");
        this.load.audio("bgm1_getReadyLoop", "./assets/bgm/bgm1_getReadyLoop.wav");
        this.load.audio("go1", "./assets/bgm/go1.wav");

        // load images/tile sprites
        this.load.image("car", "./assets/car.png");
        this.load.image("road", "./assets/Road-long.png");
        this.load.image("hud", "./assets/hud.png");

        // zombies
        this.load.image("zombie", "./assets/zombie.png");

        // obstacles
        this.load.image("roadblock1", "./assets/obstacles/bigRoadblock.png");
        this.load.image("obstacle1", "./assets/obstacles/obstacle01.png");
        this.load.image("obstacle2", "./assets/obstacles/obstacle02.png");
 
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // menu display configuration
        let tutConfig =
        {
            fontFamily: "Comic Sans MS",
            fontSize: "50px",
            backgroundColor: "#ff8400",
            color: "#000000",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 0
        };

        // menu text positioning
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        // show menu text
        this.add.text
        (
            centerX, // x-coord
            centerY - textSpacer*3 - textSpacer/2, // y-coord
            "TUTORIAL", // initial text to be displayed
            tutConfig // configuration object
        ).setOrigin(0.5);
        tutConfig.backgroundColor = "#00db33"; // change highlight
        tutConfig.fontSize = "30px"; // change font size

        this.add.text
        (
            centerX,
            centerY - textSpacer*2,
            "Move with W A S D",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY - textSpacer,
            "Use mouse to control drone and", 
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY,
            "click to pick up boxes/build towers",
            tutConfig
        ).setOrigin(0.5);
        tutConfig.backgroundColor = "#0080db"; // change highlight

        this.add.text
        (
            centerX,
            centerY + textSpacer*2,
            "Press SPACE to start",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY + textSpacer*3,
            "Press C to open Credits",
            tutConfig
        ).setOrigin(0.5);
        
        //  initialize soundtrack
        this.getReady = this.sound.add('bgm1_getReady')
        this.getReady.setLoop(false);
        this.getReadyLoop = this.sound.add('bgm1_getReadyLoop')
        this.getReadyLoop.setLoop(true);
        this.go = this.sound.add('go1')

        // define input keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.getReady.play();  
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        if(this.getReady.isPlaying == false){
            if(this.getReadyLoop.isPlaying == false){
                this.getReadyLoop.play();              
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE))
        {
            // configuration settings for easy mode
            game.settings =
            {
                playerSpeed: 5,
                fastzombieSpeed: 4,
                gameTimer: 6000,
                respawnDelay1: 1,

                countdown: 0
            }
            this.sound.play("sfx_select");
            this.getReady.stop();
            this.getReadyLoop.stop();
            this.scene.start("playScene");
        }
        // enter Credits
        if(Phaser.Input.Keyboard.JustDown(keyC))
        {
            this.getReady.stop();
            this.getReadyLoop.stop();
            this.sound.play("wrapper1");
            this.scene.start("creditScene");
        }
    }
}
//-end update()-----------------------------------------------------------------

