class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load audio files
        this.load.audio("sfx_select", "./Assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./Assets/explosion38.wav");
        
        this.load.audio("bgm1", "./Assets/bgm/bgm1.wav");
        this.load.audio("bgm1_loop", "./Assets/bgm/bgm1_loop.wav");
        
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {

        this.initialize1 = false;
        // menu display configuration
        let menuConfig =
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
        this.menu = this.add.text
        (
            centerX, // x-coord
            centerY - textSpacer, // y-coord
            "(enter final game title)", // initial text to be displayed
            menuConfig // configuration object
        ).setOrigin(0.5);

        this.menu2 = this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press (E) for Easy or (H) for Hard",
            menuConfig
        ).setOrigin(0.5);

        // menu music plays
        // this.bgm1 = ['bgm1','bgm1_loop','bgm1_getReady']
        this.music = this.sound.add('bgm1');
        this.music.setLoop(true);
        
        this.cover = this.add.rectangle(0, 0, 9000, 9000, '#000021');
        this.coverText = this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press Space to continue",
            menuConfig
        ).setOrigin(0.5);

        // define input keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        if(this.initialize1 == false){
            if(Phaser.Input.Keyboard.JustDown(keySPACE))
            {
                // this is so we force user interaction to work around google autoplay
                this.cover.destroy();
                this.coverText.destroy();
                // menu music plays
                this.music.play();
                this.initialize1 = true;
            }
        }
        if(this.initialize1 == true){
            if(this.music.isPlaying == false){ 
                if(this.musicLoop.isPlaying == false){
                    this.musicLoop.play();              
                }
            }
            
            if(Phaser.Input.Keyboard.JustDown(keyE))
            {
                // configuration settings for easy mode
                game.settings =
                {
                    playerSpeed: 4,
                    fastzombieSpeed: 4,
                    gameTimer: 1320000,
                    gasTimer: 0,
                    gas: 8,
                    countdown: 0
                }
                this.sound.play("sfx_select");
                this.music.stop();
                this.scene.start("tutorialScene");
            }
    
            // configuration settings for hard mode
            if(Phaser.Input.Keyboard.JustDown(keyH))
            {
                game.settings =
                {
                    playerSpeed: 4,
                    fastzombieSpeed: 4,
                    gameTimer: 1320000,                
                    gasTimer: 0,
                    gas: 4,
                    countdown: 0
                }
                this.sound.play("sfx_select");
                this.music.stop();
                this.scene.start("tutorialScene");
            }
        }
    }
}
//-end update()-----------------------------------------------------------------

