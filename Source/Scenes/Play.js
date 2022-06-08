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
        this.load.image("target", "./assets/gameFist.png");
        this.load.image('rocket', './assets/rocket.png');

        // load atlases for player and enemy
        this.load.atlas("parent", "./assets/gamePlayerAtlas.png", "./assets/playermap.json");
        this.load.atlas("candy", "./assets/gameEnemyAtlas.png", "./assets/enemymap.json");

        // load environment
        this.load.image("roadblock1", "./assets/obstacles/bigRoadblock.png");
        this.load.image("obstacle1", "./assets/obstacles/obstacle01.png");
        this.load.image("obstacle2", "./assets/obstacles/obstacle02.png");
        this.load.image("block", "./assets/gameBox.png");
        this.load.image("path", "./assets/gamePath.png");

        // load sound
        this.load.audio("start1", "./assets/bgm/start1.wav");
        this.load.audio("go1", "./assets/bgm/go1.OGG");
        this.load.audio("go2", "./assets/bgm/go2.wav");
        this.load.audio("go3", "./assets/bgm/go3.wav");

        // load player
        this.load.image("tile", "./assets/gameTile.png");
        this.load.image("path", "./assets/gamePath.png");
        this.load.image("tower", "./assets/gameTower2.png");
        this.load.image("player", "./assets/gamePlayer.png");
        this.load.image("outline", "./assets/gameOutline.png");
        this.load.image("baby", "./assets/gameBaby.png");

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
        this.setup = false;
        
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
        this.grid = [];
        this.map = [[0,0,0,0,1,0,0,0,0,0,0,0,0],
                    [0,0,0,0,1,1,1,1,1,1,0,0,0],
                    [1,1,1,1,1,1,0,0,0,1,0,1,1],
                    [0,0,1,1,1,1,0,0,0,1,0,1,1],
                    [0,0,1,0,0,0,1,1,1,1,0,1,1],
                    [0,0,1,1,1,1,4,1,1,1,1,1,1],
                    [0,0,0,0,0,0,1,0,0,0,0,0,1],
                    [0,0,1,1,1,1,1,0,0,0,0,0,1],
                    [0,0,1,0,0,0,0,0,0,0,0,0,1],
                    [0,0,1,1,1,1,1,1,1,1,1,0,0],
                    [0,0,0,0,0,0,0,0,0,0,1,0,0]];

        for(var i = 0; i < this.map.length; i++){ // x axis
            for(var j = 0; j < this.map[i].length; j++){ // y axis
                var pX = 25 + 50 * j;
                var pY = 25 + 50 * i;
                if(this.map[i][j] == 0){
                    this.add.image(pX, pY, 'tile')
                }
                if(this.map[i][j] == 1){
                    this.add.image(pX, pY, 'path')
                }
            }
        }

        //----------------------------------------------------------------------
        // add in the game objects
        // add player (p1)
        this.player = new Player
        (
            this, // scene
            game.config.width/2, // x-coord
            game.config.height/1.45, // y-coord
            "parent", // texture
            0, // frame
            false, // left collision checker
            false, // right collision checker
            false, // up collision checker
            false, // down collision checker
        ).setScale(0.5, 0.5).setOrigin(.5,.5);

        // add player animations
        this.anims.create({
            key: 'player_walk',
            frames: this.anims.generateFrameNames('parent', {
                prefix: 'walk',
                start: 1,
                end: 4,
                suffix: '',
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNames('parent', {
                prefix: 'idle',
                start: 1,
                end: 1,
                suffix: '',
            }),
            frameRate: 12,
            repeat: -1,
        });

        // add enemy animation
        this.anims.create({
            key: 'enemy_anim',
            frames: this.anims.generateFrameNames('candy', {
                prefix: 'bounce',
                start: 1,
                end: 6,
                suffix: '',
            }),
            frameRate: 12,
            repeat: -1,
        });

        // array of obstacles and enemies
        this.obstacles = [];
        this.enemies = [];

        this.waveLength = 5;
        
        //----------------------------------------------------------------------
        // add the user input
        // define mouse controls
        //mouse = this.input;
        // define keyboard keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //----------------------------------------------------------------------
        // add the animations
        // animation config for enemy explosions
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

        this.rD1 = game.settings.respawnDelay1;
    
        this.timer = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.rD1-- * this.tMult;
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

        // add Bullet 
        this.Bullet = this.add.sprite(game.config.width/2, game.config.height/2, 'rocket');

        this.firing = false;

        this.matter.world.setBounds();

        var canDrag = this.matter.world.nextGroup();

        this.matter.add.image(100, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);

        var noDrag = this.matter.world.nextGroup();

        this.matter.add.image(200, 100, 'candy', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);

        this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, collisionFilter: { group: canDrag } });

        // reticle creation
        this.reticle = this.add.sprite(game.config.width/2, game.config.height/2, 'target');

        this.rangeDist = Phaser.Math.Distance.BetweenPoints(this.input.mousePointer, this.player);
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {   
        // play animations when player is moving
        if (keyW.isDown || keyA.isDown || keyS.isDown || keyD.isDown) {
            this.player.play("player_walk", true);
        } else {
            this.player.play("player_idle", true);
        }

        // checks where in the grid the player is located at
        this.tileX = Math.floor((this.player.x)/50); // 27
        this.tileY = Math.floor((this.player.y)/50); // 24

        // checks where in the grid the player is located at
        this.cursorX = Math.floor(this.reticle.x/50);
        this.cursorY = Math.floor(this.reticle.y/50);

        if(!this.setup){
            if(!this.start.isPlaying & !this.checkpoint){
                this.start.stop()       
                this.setup = true;
                this.go1.play();
                this.cdtLeft.destroy();
                this.cdtMult = 0;   
                this.tMult = 1;
            }            
        }

        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.scene.pause();
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.resume("playScene");
        }

        // when game is over remove the game clock event
        if(this.gameOver) {
            this.time.removeAllEvents();
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or M to Menu').setOrigin(0.5);
        }

        // check for key input to restart
        if( Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.scene.start("menuScene");
        }
        if(!this.gameOver & this.setup)
        {
            // update player
            this.player.update(this.p1Lives);
            //this.checkCollision();
            
            // delay waves of enemies
            if(this.rD1 <= 0){
                this.spawnWave();
                this.rD1 = 60;
            }

            // update enemies
            for(var i = 0; i < this.enemies.length; i++){
                this.enemies[i].update(this.enemies[i].path);
            }

            // } else if (this.rangeDist > 50) {
            //     this.reticle.x = 50;
            //     this.reticle.y = 50;
            //     // this.rangeDist = 50;
            // }

            // console.log(this.reticle.x + ',' + this.reticle.y);
            if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
                //console.log("testing");
                this.isFiring = true;
            }
            // if fired, move up
            if(this.isFiring) {
                //console.log("fired");
                this.Bullet.x = this.reticle.x;
                console.log("fired");

                
                // this.Bullet.x = this.reticle.x;

                this.Bullet.y -= 1;
            }

            this.reticle.x = this.input.mousePointer.x;
            this.reticle.y = this.input.mousePointer.y;

            if(this.canPlace()){
                this.input.on('pointerdown', () => this.placeTower(this.reticle.x, this.reticle.y));
            }

            this.Bullet.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

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
    
    /*checkCollision(player, enemy)
    {
        // simple AABB bounds checking
        if
        (
            player.x - 0 < enemy.x + enemy.width && // left side hitbox
            player.x - 50 + player.width > enemy.x && // right side hitbox
            player.y + 19 < enemy.y + enemy.height && // upper hitbox
            player.height + player.y > enemy.y + 160 // lower hitbox
        ) return true;

        else return false;
    }*/

    checkCollision()
    {
        // simple AABB bounds checking
        if(this.grid[this.tileX-1][this.tileY].h < 0){ // left side hitbox
            //console.log("              ");
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

    // spawn enemies
    spawnWave(){
            // add upper enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * -100 - 50; // delayed spawns
                this.enemy = new Enemy
                (this, 200, l, 'candy', 0, 10, 1).setOrigin(0, 0);
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }
            // add lower enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * 100 + 550 + 900; // delayed spawns
                this.enemy = new Enemy
                (this, 500, l, 'candy', 0, 10, 2).setOrigin(0, 0);
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }
            // add leftward enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * -100 - 50 - 1800; // delayed spawns
                this.enemy = new Enemy
                (this, l, 100, 'candy', 0, 10, 3).setOrigin(0, 0);
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }    
            // add rightward enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * 100 + 700 + 2700; // delayed spawns
                this.enemy = new Enemy
                (this, l, 400, 'candy', 0, 10, 4).setOrigin(0, 0);
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }          
    }

    canPlace(){
        if(this.reticle.x > 10 & this.reticle.x < 625 & this.reticle.y > 10 & this.reticle.y < 525){
            console.log('works');
            if(this.map[this.cursorX][this.cursorY] == 0){
                return true;
            } else {
                return false;
            }
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

    enemieKill(enemy)
    {
        enemy.alpha = 0; // set enemy to be fully transparent
        enemy.y = Phaser.Math.Between(-50, -1000); // reset enemy position
        enemy.alpha = 1; // set enemy to be fully visible

        // score increment and repaint
        this.p1Score += enemy.points;
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
        this.tower = new Tower(
                this, // scene
                25 + 50 * i, // x-coord
                25 + 50 * j, // y-coord
                "tower", // texture
                0, // frame
                50, // width
                50, // length
                1, // height (0 is passable, 1 can have items be thrown over it, 2 is completely impassable on ground, 3 is impassible mid air)
        ).setScale(1, 1).setOrigin(0.5, 0.5);
        this.map[i][j] == 1;
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
