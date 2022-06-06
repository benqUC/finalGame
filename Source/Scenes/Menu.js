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
        // load sfx
        this.load.audio("wrapper2", "./assets/wrapper2.mp3");
        // load music
        this.load.audio("bgm1", "./assets/bgm/bgm1.wav");
        this.load.audio("bgm1_loop", "./assets/bgm/bgm1_loop.wav");
        // load background
        this.load.image("title", "./assets/gameTitle.png");
        
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

        // add background
        this.title = this.add.tileSprite(0, 0, 0, 0, 'title').setOrigin(0, 0);

        // menu music plays
        // this.bgm1 = ['bgm1','bgm1_loop','bgm1_getReady']
        this.music = this.sound.add('bgm1');
        this.music.setLoop(true);

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
                this.music.stop();
                this.sound.play("wrapper2");
                this.scene.start("tutorialScene");
            }
        }
    }
}
//-end update()-----------------------------------------------------------------

