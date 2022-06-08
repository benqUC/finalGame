class Ending extends Phaser.Scene
{
    constructor()
    {
        super("endingScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load sfx
        this.load.audio("wrapper2", "./assets/wrapper2.mp3");
        // load music
        this.load.audio("bgmBaby", "./assets/bgm/WigglingBaby.mp3");
        // load background
        this.load.image("ending", "./assets/gameEnding.png");
        
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // add background
        this.goodEnding = this.add.tileSprite(0, 0, 0, 0, 'ending').setOrigin(0, 0);
        // add music
        this.music = this.sound.add('bgmBaby');
        this.music.setLoop(true);
        this.music.play();
        // define input keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keySPACE))
        {
            this.music.setLoop(false);
            this.music.stop();
            this.sound.play("wrapper2");
            this.scene.start("menuScene");
        }
    }
}
//-end update()-----------------------------------------------------------------

