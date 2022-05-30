class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }
    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load images/tile sprites
        this.load.image("car", "./assets/car.png");
        this.load.image("road", "./assets/Road-long.png");
        this.load.image("hud", "./assets/hud.png");
        this.load.image("target", "./assets/ball.png");
        this.load.image('rocket', './assets/rocket.png');

        // load car atlas
        this.load.atlas("car_atlas", "./assets/car-atlas.png", "./assets/carmap.json");

        // zombies
        this.load.image("zombie", "./assets/zombie.png");
        this.load.image("candyCorn", "./assets/gameEnemy.png");

        // obstacles
        this.load.image("roadblock1", "./assets/obstacles/bigRoadblock.png");
        this.load.image("obstacle1", "./assets/obstacles/obstacle01.png");
        this.load.image("obstacle2", "./assets/obstacles/obstacle02.png");
        this.load.image("block", "./assets/block.png");

        // soundtracks
        this.load.audio("start1", "./assets/bgm/start1.wav");
        this.load.audio("go1", "./assets/bgm/go1.OGG");
        this.load.audio("go2", "./assets/bgm/go2.wav");
        this.load.audio("go3", "./assets/bgm/go3.wav");

        this.load.image("test", "./assets/test.png");
        this.load.image("test1", "./assets/test1.png");
        this.load.image("p", "./assets/p.png");
        this.load.image("outline", "./assets/outline.png");

        // load spritesheet for death animation
        this.load.spritesheet
        (
            "explosion",
            "./assets/explosion.png",
            {
                frameWidth: 64,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 9
            }
        );
    } 
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {
        // initializes play scene
        this.init = false;
        
        // load soundtracks
        this.start = this.sound.add('start1')
        this.go1 = this.sound.add('go1')
        this.go2 = this.sound.add('go2')
        this.go3 = this.sound.add('go3')
        // detecting soundtrack loops
        this.go1Loop = false;
        this.go2Loop = false;
        this.go3Loop = false;

        //----------------------------------------------------------------------
        // configure the user interface
        // grid placement
        var X = game.config.width/50;
        var Y = game.config.height/50;
        
        this.grid = [];

        for(var i = 0; i < X; i++){ // x axis
            this.grid[i] = [];
            for(var j = 0; j < Y; j++){ // y axis
                this.grid[i][j] = new Tile
                (
                    this, // scene
                    25 + 50 * i, // x-coord
                    25 + 50 * j, // y-coord
                    "test", // texture
                    0, // frame
                    50, // width
                    50, // length
                    0, // height (0 is passable, 1 can have items be thrown over it, 2 is completely impassable on ground, 3 is impassible mid air)
                ).setScale(0.5, 0.5).setOrigin(0, 0);
                this.add.image(this.grid[i][j].x, this.grid[i][j].y, 'test')
            }
        }
        this.outline = this.add.image(-100, -100, 'outline');
        this.placeTower(2,3); // debug purposes
        console.log(this.grid[2][3].h)

        //----------------------------------------------------------------------
        // add in the game objects
        // add player (p1)
        this.player = new Player
        (
            this, // scene
            game.config.width/2, // x-coord
            game.config.height/1.45, // y-coord
            "p", // texture
            0, // frame
            false, // left collision checker
            false, // right collision checker
            false, // up collision checker
            false, // down collision checker
        ).setScale(0.5, 0.5).setOrigin(.5,.5);

        // add player animations
        /*
        this.anims.create({
            key: 'car_anim',
            frames: this.anims.generateFrameNames('car_atlas', {
                prefix: 'sprite',
                start: 1,
                end: 6,
                suffix: '',
            }),
            frameRate: 12,
            repeat: -1,
        });

        // play animation
        this.player.play("car_anim");
        */

        // array of obstacles and zombies
        this.obstacles = [];
        this.zombies = [];


        // m is multiplier on how far zombie 2 is from zombie 1. Useful if we are moving roads
        var m = 93;
        // min/max value on zombie spawns
        var min = -50;
        var max = -1000;
        // min/max on debris spawns
        this.omin = game.config.width/2 - 316; // max left
        this.omax = game.config.width/2 + 235; // max right

        var num = 4;

        // add obstacle 1
        this.obstacle1 = new Obstacle
        (this, Phaser.Math.Between(this.omin, this.omax - 105), Phaser.Math.Between(min, max), 'roadblock1', 0).setOrigin(0, 0);
        this.obstacles.push(this.obstacle1);

        //----------------------------------------------------------------------
        // add the user input
        // define mouse controls
        //mouse = this.input;
        // define keyboard keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        //----------------------------------------------------------------------
        // add the animations
        // animation config for zombie explosions
        this.anims.create
        (
            {
                key: "explode", //
                frames: this.anims.generateFrameNumbers
                (
                    "explosion", // key
                    { // configuration object
                        start: 0,
                        end: 9,
                        first: 0
                    }
                ),
                frameRate: 30
            }
        );

        //----------------------------------------------------------------------
        // add the UI text
        // player score updates during play
        this.p1Score = 0;
        // scores display configuration
        let scoreConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 150
        };
        this.scoreLeft = this.add.text
        (
            game.config.width/2 + 15, // x-coord
            game.config.height - 27, // y-coord
            "$" + this.p1Score, // initial text
            scoreConfig // config settings
        );

        this.p1Lives = game.settings.playerSpeed;

        // this timer will indicate how much longer until player reaches checkpoint
        this.gameClock = game.settings.gameTimer;
        this.ampm = game.settings.apm;
        
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 70
        };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            game.config.width/2 + 125,       // x-coord
            game.config.height - 80,         // y-coord
            this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        //  add the event to increment the clock
        //  code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        
        this.tMult = 0;

        let countdownConfig =
        {
            fontFamily: "Courier",
            fontSize: "50px",
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "center",
            padding: {top: 30, bottom: 30},
            fixedWidth: 500
        };
        this.countdown = game.settings.countdown;
        this.countdown = 3000;
        this.cdtLeft = this.add.text
        (
            game.config.width/2 - 250, // x-coord
            game.config.height/2, // y-coord
            "Get ready: " + this.formatTimeCountDown(this.countdown), // text to display
            countdownConfig // text style config object
        );
        this.cdt = this.time.addEvent
        (
            {
                delay: 1000, 
                callback: () =>
                {
                    this.countdown -= 1000*this.cdtMult;
                    this.cdtLeft.text = this.formatTimeCountDown(this.countdown);
                },
                scope: this,
                loop: true
            }
        );
        this.cdtMult = 1;
        this.start.play();       

        this.gasTimer = game.settings.gasTimer;
        this.gas = game.settings.gas;

        this.gasTime = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gasTimer++ * this.tMult;
                },
                scope: this,
                loop: true
            }
        );

        //----------------------------------------------------------------------
        // game over event
        this.gameOver = false;
        // checkpoint event
        this.checkpoint = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;

        // reticle creation
        this.reticle = this.add.sprite(game.config.width/2, game.config.height/2, 'target');

        // add Bullet 
        this.Bullet = this.add.sprite(game.config.width/2, game.config.height/2, 'rocket');

        this.firing = false;

        this.matter.world.setBounds();

        var canDrag = this.matter.world.nextGroup();

        this.matter.add.image(100, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);

        var noDrag = this.matter.world.nextGroup();

        this.matter.add.image(200, 100, 'candyCorn', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);

        this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, collisionFilter: { group: canDrag } });
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {   
        // checks where in the grid the player is located at
        this.tileX = Math.floor((this.player.x)/50); // 27
        this.tileY = Math.floor((this.player.y)/50); // 24
        
        //console.log(this.tileX+","+this.tileY)
        var j = this.tileX - 1;
        if(!this.init){
            if(!this.start.isPlaying & !this.checkpoint){
                this.start.stop()       
                this.init = true;
                this.go1.play();
                this.cdtLeft.destroy();
                this.cdtMult = 0;
                this.tMult = 1;
            }            
        }

        // when game is over remove the game clock event
        if(this.gameOver) {
            this.time.removeAllEvents();
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or M to Menu').setOrigin(0.5);
        }

        // check for key input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.scene.start("menuScene");
        }
        if(!this.gameOver & this.init)
        {
            // update player
            this.player.update(this.p1Lives);
            //this.checkCollision();
            this.createOutline(this.tileX,this.tileY);
            /*
            for(var i = 0; i < game.config.width/50; i++){ // x axis
                for(var j = 0; j < game.config.height/50; j++){ // y axis
                    if(){

                    }
                }
            }*/
            
            // update zombies
            for(var i = 0; i < this.zombies.length; i++){
                this.zombies[i].update(1, this.p1Lives);
            }

            // check if enemies overlap
            for(var i = 0; i < this.obstacles.length; i++){
                for(var j = 0; j < this.zombies.length; j++){
                    if(this.checkOverlap(this.zombies[j], this.obstacles[i]))
                    {
                        this.zombies[i].y -= 50;
                    }        
                }        
            }

            this.reticle.x = this.input.mousePointer.x;
            this.reticle.y = this.input.mousePointer.y;
            // console.log(this.reticle.x + ',' + this.reticle.y);
            if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
                console.log("testing");
                this.isFiring = true;
                this.Bullet.rotation = Phaser.Math.Angle.Between(this.Bullet.x, this.Bullet.y, this.reticle.x, this.reticle.y);
                // this.Bullet.x = this.input.mousePointer.x;
                // this.Bullet.y = this.input.mousePointer.y;
            }
            // if fired, move up
            if(this.isFiring) {
                console.log("fired");
                this.Bullet.x = this.reticle.x;

                this.Bullet.y -= 20;
            }

            if(this.canPlace()){
                this.input.on('pointerdown', () => this.placeTower(this.reticle.x, this.reticle.y));
            }

            console.log(this.canPlace())

            this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

            //var x = (this.player.x - this.reticle.x)^2;
            //var y = (this.player.y - this.reticle.y)^2;

            //console.log(x + ' , ' + y + ' : ' + this.tileX + ' , ' + this.tileY);
        }
        
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    
    /*checkCollision(player, zombie)
    {
        // simple AABB bounds checking
        if
        (
            player.x - 0 < zombie.x + zombie.width && // left side hitbox
            player.x - 50 + player.width > zombie.x && // right side hitbox
            player.y + 19 < zombie.y + zombie.height && // upper hitbox
            player.height + player.y > zombie.y + 160 // lower hitbox
        ) return true;

        else return false;
    }*/

    checkCollision()
    {
        // simple AABB bounds checking
        if(this.grid[this.tileX-1][this.tileY].h < 0){ // left side hitbox
            console.log("works");
            this.player.cl = true;
        }/*
        if(this.grid[this.tileX-1][this.tileY].h < 0){ // right side hitbox
            Player.collideRight = true;
        } 
        if(this.grid[this.tileX-1][this.tileY].h < 0){ // upper hitbox
            Player.collideUp = true;
        }
        if(this.grid[this.tileX-1][this.tileY].h < 0){ // lower hitbox
            Player.collideDown = true;
        }*/
    }

    

    canPlace(){
        var x = Math.floor(this.reticle.x/50);
        var y = Math.floor(this.reticle.y/50);
        
        if(this.grid[x][y] == this.grid[this.tileX - 1][this.tileY] ||               
            this.grid[x][y] == this.grid[this.tileX + 1][this.tileY] ||               
            this.grid[x][y] == this.grid[this.tileX][this.tileY - 1] ||               
            this.grid[x][y] == this.grid[this.tileX][this.tileY + 1] ||               
            this.grid[x][y] == this.grid[this.tileX - 1][this.tileY - 1] ||               
            this.grid[x][y] == this.grid[this.tileX - 1][this.tileY + 1] ||               
            this.grid[x][y] == this.grid[this.tileX + 1][this.tileY - 1] ||               
            this.grid[x][y] == this.grid[this.tileX + 1][this.tileY + 1]){
                return true;
        } else {
            return false;
        }
    }

    checkOverlap(o1, o2)
    {
        // simple AABB bounds checking
        if
        (
            o1.x < o1.x + o2.width && // left side hitbox
            o1.x + o1.width > o2.x && // right side hitbox
            o1.y < o2.y + o2.height && // upper hitbox
            o1.height + o1.y > o2.y // lower hitbox
        ) return true;

        else return false;
    }

    zombieKill(zombie)
    {
        this.gasTimer = 0;
        zombie.alpha = 0; // set zombie to be fully transparent
        zombie.y = Phaser.Math.Between(-50, -1000); // reset zombie position
        zombie.alpha = 1; // set zombie to be fully visible

        // score increment and repaint
        this.p1Score += zombie.points;
        // update the high score if needed
        
        this.scoreLeft.text = "$" + this.p1Score;

        this.p1Lives -= 1;

        if (this.p1Lives <= 0) {
            this.gameOver = true;
        }
    }

    placeTower(x,y){
        var i = Math.floor(x/50);
        var j = Math.floor(y/50);
        this.grid[i][j] = new Tower(
                this, // scene
                25 + 50 * i, // x-coord
                25 + 50 * j, // y-coord
                "test1", // texture
                0, // frame
                50, // width
                50, // length
                1, // height (0 is passable, 1 can have items be thrown over it, 2 is completely impassable on ground, 3 is impassible mid air)
        ).setScale(0.5, 0.5).setOrigin(0, 0);
        this.add.image(this.grid[i][j].x, this.grid[i][j].y, 'test1')
    }

    createOutline(x,y){ // creates outline for placing buildings
        this.outline.destroy();
        var X = 50*x+25;
        var Y = 50*y+25;
        this.outline = this.add.image(X, Y, 'outline');
        this.outline.alpha = 0.25;
    }
    
    formatTime(ms)
    {
        let s = ms/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
    
    formatTimeCountDown(ms)
    {
        let s = ms/1000;
        let seconds = s%60;
        seconds = seconds.toString().padStart(2);
        return `${seconds}`;
    }
    

}
