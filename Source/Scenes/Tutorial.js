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
        this.load.audio("wrapper3", "./assets/wrapper3.mp3");
        
        //load bgm
        this.load.audio("bgm1_getReady", "./assets/bgm/Cute.mp3");
        this.load.audio("bgm1_getReadyLoop", "./assets/bgm/Cute.mp3");
        this.load.audio("go1", "./assets/bgm/WigglingBaby.mp3");
 
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
            centerY + textSpacer,
            "Press R during play to restart",
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
                hp: 5,
                playerSpeed: 5,
                gameTimer: 6000,
                respawnDelay1: 1,

                countdown: 0
            }
            this.sound.play("wrapper3");
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

