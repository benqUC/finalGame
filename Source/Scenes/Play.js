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
        this.load.image("target", "./assets/gameFist.png");

        // load atlases for player and enemy
        this.load.atlas("parent", "./assets/gamePlayerAtlas.png", "./assets/playermap.json");
        this.load.atlas("candy", "./assets/gameEnemyAtlas.png", "./assets/enemymap.json");

        // load environment
        this.load.image("block", "./assets/gameBox.png");
        this.load.image("path", "./assets/gamePath2.png");

        // load sound
        this.load.audio("start1", "./assets/bgm/CuteSnippet.mp3");
        this.load.audio("go1", "./assets/bgm/WigglingBaby.OGG");
        this.load.audio("go2", "./assets/bgm/go2.wav");
        this.load.audio("go3", "./assets/bgm/go3.wav");

        // load player
        this.load.image("tile", "./assets/gameTile.png");
        this.load.image("tower", "./assets/gameTower2.png");
        this.load.image("player", "./assets/gamePlayer.png");
        this.load.image("outline", "./assets/gameOutline.png");
        this.load.image("baby", "./assets/gameBaby.png");
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
        this.towers = [];
        this.towerNum = 0;

        this.baby = this.add.sprite(game.config.width/2, game.config.height/2, 'baby');

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
                // if(this.map[i][j] == 4){
                //     this.add.image(pX, pY, 'baby')
                // }
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
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //----------------------------------------------------------------------
        // add the UI text
        // player score updates during play
        this.p1Score = 0;
        // scores display configuration
        let scoreConfig =
        {
            fontFamily: "Comic Sans MS",
            fontSize: "20px",
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 150
        };
        this.scoreLeft = this.add.text
        (
            game.config.width/2 - 80, // x-coord
            game.config.height - 35, // y-coord
            "Score" + this.p1Score, // initial text
            scoreConfig // config settings
        );

        this.p1Lives = game.settings.playerSpeed;

        // this timer will indicate how much longer until player reaches checkpoint
        this.gameClock = game.settings.gameTimer;
        this.ampm = game.settings.apm;
        
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "Comic Sans MS",
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
            game.config.width/2 + 80,       // x-coord
            game.config.height - 35,         // y-coord
            this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        //  add the event to increment the clock
        //  code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        
        this.tMult = 0;

        let countdownConfig =
        {
            fontFamily: "Comic Sans MS",
            fontSize: "50px",
            backgroundColor: "#63beff",
            color: "#FFFFFF",
            align: "center",
            padding: {top: 20, bottom: 20},
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
        //game win event
        this.gameWin = false;
        // game over event
        this.gameOver = false;
        // checkpoint event
        this.checkpoint = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;

        // add Bullet 
        // this.Bullet = this.add.sprite(game.config.width/2, game.config.height/2, 'rocket');

        // this.firing = false;

        // this.matter.world.setBounds();

        // var canDrag = this.matter.world.nextGroup();

        // this.matter.add.image(100, 100, 'block', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(canDrag);

        // var noDrag = this.matter.world.nextGroup();

        // this.matter.add.image(200, 100, 'candy', null, { chamfer: 16 }).setBounce(0.9).setCollisionGroup(noDrag);

        // this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, collisionFilter: { group: canDrag } });

        // reticle creation
        this.reticle = this.add.sprite(game.config.width/2, game.config.height/2, 'target');
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
        console.log(game.settings.hp);
        // initiates Game Over Sequence
        if(game.settings.hp <= 0){
            this.gameOver = true;
        }
        if(this.p1Score >= 330){
            this.gameWin = true;
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


        // pause menu mechanic 
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.scene.pause();
            this.go1.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.resume("playScene");
        }

        // when game is over remove the game clock event
        if(this.gameOver) {
            this.time.removeAllEvents();
            this.go1.stop();
            this.scene.start("gameoverScene");
        }

        // when game is over remove the game clock event
        if(this.gameWin) {
            this.time.removeAllEvents();
            this.go1.stop();
            this.scene.start("endingScene");
        }

        // check for key input to restart
        if( Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.go1.stop();
            this.scene.restart(this.p1Score);
        }
        // key for menu
        if( Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.go1.stop();
            this.scene.start("menuScene");
        }
        // key for tutorial 
        if( Phaser.Input.Keyboard.JustDown(keyT))
        {
            this.go1.stop();
            this.scene.start("tutorialScene");
        }


        if((!this.gameOver & this.setup) && (!this.gameWin & this.setup))
        {
            // define reticles
            this.reticle.x = this.input.mousePointer.x;
            this.reticle.y = this.input.mousePointer.y;
            // update player
            this.player.update(this.p1Lives);
            this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

            // delay waves of enemies
            if(this.rD1 <= 0){
                this.spawnWave();
                this.rD1 = 60;
            }

            // update enemies
            for(var i = 0; i < this.enemies.length; i++){
                this.enemies[i].update(this.enemies[i].path);
            }
            
            // tower seeks closest enemy
            for(var i = 0; i < this.towers.length; i ++){
                var j = this.enemies.length - 1;
                this.towers[i].update(this.enemies[0].x, this.enemies[0].y);
            }

            for(var i = 0; i < this.enemies.length; i++){
                if(this.checkOverlap(this.baby, this.enemies[i]))
                {
                    // game.settings.hp--;
                    // console.log(game.settings.hp);
                    this.babyKill(this.enemies[i]);
                }        
            }
            

            // } else if (this.rangeDist > 50) {
            //     this.reticle.x = 50;
            //     this.reticle.y = 50;
            //     // this.rangeDist = 50;
            // }

            // console.log(this.reticle.x + ',' + this.reticle.y);
            // if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
            //     //console.log("testing");
            //     this.isFiring = true;
            // }
            // // if fired, move up
            // if(this.isFiring) {
            //     //console.log("fired");
            //     this.Bullet.x = this.reticle.x;
            //     console.log("fired");

                
            //     // this.Bullet.x = this.reticle.x;

            //     this.Bullet.y -= 1;
            // }

            if(this.canPlace()){
                this.input.on('pointerdown', () => this.placeTower(this.reticle.x, this.reticle.y));
            }

            // this.Bullet.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

            
            //var x = (this.player.x - this.reticle.x)^2;
            //var y = (this.player.y - this.reticle.y)^2;

            //console.log(x + ' , ' + y + ' : ' + this.tileX + ' , ' + this.tileY);

            for(var i = 0; i < this.enemies.length; i++){
                if(this.checkOverlap(this.player, this.enemies[i]))
                {
                    // game.settings.hp--;
                    // console.log(game.settings.hp);
                    this.enemieKill(this.enemies[i]);
                }        
            }
        }
        
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    
    checkCollision(player, enemy)
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
    }

    // spawn enemies
    spawnWave(){
            // add upper enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * -100 - 50; // delayed spawns
                this.enemy = new Enemy
                (this, 200, l, 'candy', 0, 10, 1).setOrigin(0, 0).setInteractive();
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }
            // add lower enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * 100 + 550 + 900; // delayed spawns
                this.enemy = new Enemy
                (this, 500, l, 'candy', 0, 10, 2).setOrigin(0, 0).setInteractive();
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }
            // add leftward enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * -100 - 50 - 1800; // delayed spawns
                this.enemy = new Enemy
                (this, l, 100, 'candy', 0, 10, 3).setOrigin(0, 0).setInteractive();
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy); 
            }    
            // add rightward enemies
            for(var i = 0; i < this.waveLength; i++){
                var l = i * 100 + 700 + 2700; // delayed spawns
                this.enemy = new Enemy
                (this, l, 400, 'candy', 0, 10, 4).setOrigin(0, 0).setInteractive();
                this.enemy.play('enemy_anim');
                this.enemies.push(this.enemy);
            } 
            this.input.on('gameobjectdown', function (pointer, gameObject) {
                gameObject.destroy();
                this.enemieKill(this.enemies[1]);
            });  
    }

    canPlace(){
        if(this.towerNum > 4){
            return false;
        } else {
            return true;
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

        // game.settings.hp -= 1;
        // this.p1Lives -= 1;

        // if (this.p1Lives <= 0) {
        //     this.gameOver = true;
        // }
    }

    babyKill(enemy)
    {
        enemy.alpha = 0; // set enemy to be fully transparent
        enemy.y = Phaser.Math.Between(-50, -1000); // reset enemy position
        enemy.alpha = 1; // set enemy to be fully visible

        // score increment and repaint
        // this.p1Score += enemy.points;
        // update the high score if needed
        
        // this.scoreLeft.text = "$" + this.p1Score;

        game.settings.hp -= 1;
        // this.p1Lives -= 1;

        // if (this.p1Lives <= 0) {
        //     this.gameOver = true;
        // }
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
        this.towers.push(this.tower);
        this.towerNum++;
        // this.map[i][j] = 1;
    }

    getDistance(x1, y1, x2, y2){
        let y = x2 - x1;
        let x = y2 - y1;
        
        return Math.sqrt(x * x + y * y);
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
