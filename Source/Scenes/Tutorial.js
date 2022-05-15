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
        this.load.audio("sfx_select", "./Assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./Assets/explosion38.wav");
        
        //load bgm
        this.load.audio("bgm1_getReady", "./Assets/bgm/bgm1_getReady.wav");
        this.load.audio("bgm1_getReadyLoop", "./Assets/bgm/bgm1_getReadyLoop.wav");
        this.load.audio("go1", "./Assets/bgm/go1.wav");

        // load images/tile sprites
        this.load.image("car", "./Assets/car.png");
        this.load.image("road", "./Assets/Road-long.png");
        this.load.image("hud", "./Assets/hud.png");

        // zombies
        this.load.image("zombie", "./Assets/zombie.png");

        // obstacles
        this.load.image("roadblock1", "./Assets/obstacles/bigRoadblock.png");
        this.load.image("obstacle1", "./Assets/obstacles/obstacle01.png");
        this.load.image("obstacle2", "./Assets/obstacles/obstacle02.png");
 
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {

        this.road = this.add.tileSprite
        (
            0, 0, game.config.width, game.config.height, 'road'
        ).setOrigin(0, 0);

        this.hud = this.add.image(game.config.width/2, game.config.height - 240, 'hud');

        this.zombie1 = this.add.image(650, game.config.height/2 + 64*2.5, 'zombie');
        this.zombie2 = this.add.image(625, game.config.height/2 + 64*1.5, 'zombie');
        this.zombie3 = this.add.image(600, game.config.height/2 + 64*2.5, 'zombie');

        this.ob1 = this.add.image(1500, game.config.height/2 + 64*1.5, 'roadblock1');
        this.ob2 = this.add.image(1600, game.config.height/2 + 64*.5, 'obstacle1');
        this.ob3 = this.add.image(1700, game.config.height/2 + 64*1.5, 'obstacle2');

        // menu display configuration
        let tutConfig =
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 0
        };

        // meny text positioning
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        // show menu text
        this.add.text
        (
            centerX, // x-coord
            centerY - textSpacer, // y-coord
            "TUTORIAL", // initial text to be displayed
            tutConfig // configuration object
        ).setOrigin(0.5);

        // meny music plays
    //    this.sound.play("bgm");

        this.add.text
        (
            centerX,
            centerY,
            "Move with A and D or Arrows",
            tutConfig
        ).setOrigin(0.5);
        tutConfig.backgroundColor = "#00C080"; // set object property
        tutConfig.color = "#000000";

        this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Try to drive as long as possible without running out of fuel or taking too much damage.",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY + textSpacer*2,
            "Hit zombies to gain cash that can be converted into fuel.",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY + textSpacer*3,
            "Press Space to start",
            tutConfig
        ).setOrigin(0.5);


        tutConfig.fontSize = "14px";
        this.add.text
        (
            710,
            centerY + textSpacer*5.5,
            "Convert",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            800,
            centerY + textSpacer*5.5,
            "Speed",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            890,
            centerY + textSpacer*5.5,
            "Fuel",
            tutConfig
        ).setOrigin(0.5);

        tutConfig.backgroundColor = "#f3b141"; // set object property
        tutConfig.color = "#000000";
        
        this.add.text
        (
            1000,
            centerY + textSpacer*6.5,
            "Cash",
            tutConfig
        ).setOrigin(0.5);

        this.add.text
        (
            1100,
            centerY + textSpacer*6,
            "Time",
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
                playerSpeed: 4,
                fastzombieSpeed: 4,
                gameTimer: 1320000,                
                gasTimer: 0,
                gas: 8,
                apm: 'pm',
            }
            this.sound.play("sfx_select");
            this.getReady.stop();
            this.getReadyLoop.stop();
            this.scene.start("playScene");
        }
    }
}
//-end update()-----------------------------------------------------------------

