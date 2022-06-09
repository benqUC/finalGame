class GameOver extends Phaser.Scene
{
    constructor()
    {
        super("gameoverScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load sfx
        this.load.audio("wrapper2", "./assets/wrapper2.mp3");
        // load background
        this.load.image("gameOver", "./assets/gameOver.png");
        
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // add background
        this.badEnding = this.add.tileSprite(0, 0, 0, 0, 'gameOver').setOrigin(0, 0);

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
            this.sound.play("wrapper2");
            this.scene.start("menuScene");
        }
    }
}
//-end update()-----------------------------------------------------------------

