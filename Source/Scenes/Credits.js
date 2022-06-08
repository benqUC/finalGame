class Credits extends Phaser.Scene
{
    constructor()
    {
        super("creditScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load sfx
        this.load.audio("wrapper1", "./assets/wrapper1.mp3");
    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // menu display configuration
        let creditConfig =
        {
            fontFamily: "Verdana",
            fontSize: "30px",
            backgroundColor: "#000000",
            color: "#ffffff",
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
            centerY - textSpacer*3, // y-coord
            "CREDITS", // initial text to be displayed
            creditConfig // configuration object
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY - textSpacer,
            "Benjamin Quang",
            creditConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY,
            "Justin Vicente",
            creditConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Jacob Phung",
            creditConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY + textSpacer*3,
            "Press SPACE to return to Tutorial",
            creditConfig
        ).setOrigin(0.5);

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
            this.sound.play("wrapper1");
            this.scene.start("tutorialScene");
        }
    }
}
//-end update()-----------------------------------------------------------------

