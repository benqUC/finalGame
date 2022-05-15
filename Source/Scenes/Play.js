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
        this.load.image("car", "./Assets/car.png");
        this.load.image("road", "./Assets/Road-long.png");
        this.load.image("hud", "./Assets/hud.png");

        // load car atlas
        this.load.atlas("car_atlas", "./Assets/car-atlas.png", "./Assets/carmap.json");

        // zombies
        this.load.image("zombie", "./Assets/zombie.png");

        // obstacles
        this.load.image("roadblock1", "./Assets/obstacles/bigRoadblock.png");
        this.load.image("obstacle1", "./Assets/obstacles/obstacle01.png");
        this.load.image("obstacle2", "./Assets/obstacles/obstacle02.png");

        // rpm meter
        this.load.image("rpm0", "./Assets/rpm/dial-rpm00.png");
        this.load.image("rpm1", "./Assets/rpm/dial-rpm01.png");
        this.load.image("rpm2", "./Assets/rpm/dial-rpm02.png");
        this.load.image("rpm3", "./Assets/rpm/dial-rpm03.png");
        this.load.image("rpm4", "./Assets/rpm/dial-rpm04.png");
        this.load.image("rpm5", "./Assets/rpm/dial-rpm05.png");

        // mph meter
        this.load.image("mph0", "./Assets/mph/dial-mph00.png");
        this.load.image("mph1", "./Assets/mph/dial-mph01.png");
        this.load.image("mph2", "./Assets/mph/dial-mph02.png");
        this.load.image("mph3", "./Assets/mph/dial-mph03.png");
        this.load.image("mph4", "./Assets/mph/dial-mph04.png");
        this.load.image("mph5", "./Assets/mph/dial-mph05.png");
        this.load.image("mph6", "./Assets/mph/dial-mph06.png");
        this.load.image("mph7", "./Assets/mph/dial-mph07.png");
        this.load.image("mph8", "./Assets/mph/dial-mph08.png");
        this.load.image("mph9", "./Assets/mph/dial-mph09.png");
        this.load.image("mph10", "./Assets/mph/dial-mph10.png");

        // gas meter
        this.load.image("gas1", "./Assets/gas/dial-gas05.png");
        this.load.image("gas2", "./Assets/gas/dial-gas04.png");
        this.load.image("gas3", "./Assets/gas/dial-gas03.png");
        this.load.image("gas4", "./Assets/gas/dial-gas02.png");
        this.load.image("gas5", "./Assets/gas/dial-gas01.png");

        // soundtracks
        this.load.audio("start1", "./Assets/bgm/start1.wav");
        this.load.audio("go1", "./Assets/bgm/go1.OGG");
        this.load.audio("go2", "./Assets/bgm/go2.wav");
        this.load.audio("go3", "./Assets/bgm/go3.wav");

        // load spritesheet for death animation
        this.load.spritesheet
        (
            "explosion",
            "./Assets/explosion.png",
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
        // place tile sprite background
        this.road = this.add.tileSprite
        (
            0, 0, game.config.width, game.config.height, 'road'
        ).setOrigin(0, 0);

        this.hud = this.add.image(game.config.width/2, game.config.height - 240, 'hud');

        this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm0');
        this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph0');
        this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas1');

        this.arpm = ['rpm0','rpm1','rpm2','rpm3','rpm4','rpm5']
        this.amph = ['mph0','mph1','mph2','mph3','mph4','mph5','mph6','mph7','mph8','mph9','mph10']
        //----------------------------------------------------------------------
        // add in the game objects
        // add player (p1)
        this.player = new Player
        (
            this, // scene
            game.config.width/2, // x-coord
            game.config.height/1.45, // y-coord
            "car_atlas", // texture
            0, // frame
            10,
        ).setScale(0.5, 0.5).setOrigin(0, 0);

        // add player animations
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
        for(var i = 0; i <= num; i++){

        }

        // add obstacle 1
        this.obstacle1 = new Obstacle
        (this, Phaser.Math.Between(this.omin, this.omax - 105), Phaser.Math.Between(min, max), 'roadblock1', 0).setOrigin(0, 0);
        this.obstacles.push(this.obstacle1);
        // add obstacle 2
        this.obstacle2 = new Obstacle
        (this, Phaser.Math.Between(this.omin, this.omax - 105), Phaser.Math.Between(min, max), 'obstacle1', 0).setOrigin(0, 0);
        this.obstacles.push(this.obstacle2);
        // add obstacle 3
        this.obstacle3 = new Obstacle
        (this, Phaser.Math.Between(this.omin, this.omax - 105), Phaser.Math.Between(min, max), 'obstacle2', 0).setOrigin(0, 0);
        this.obstacles.push(this.obstacle3);        
        
        // add zombie 1
        this.zombie1 = new Zombie
        (this, game.config.width/2 - 259, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie1);
        // add zombie 2
        this.zombie2 = new Zombie
        (this, this.zombie1.x + m, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie2);
        // add zombie 3
        this.zombie3 = new Zombie
        (this, this.zombie1.x + m*2, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie3);

        this.zombie4 = new Zombie
        (this, game.config.width/2 + 41, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie4);

        this.zombie5 = new Zombie
        (this, this.zombie4.x + m, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie5);

        this.zombie6 = new Zombie
        (this, this.zombie4.x + m*2, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);
        this.zombies.push(this.zombie6);

        //----------------------------------------------------------------------
        // add the user input
        // define mouse controls
        //mouse = this.input;
        // define keyboard keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
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
        // high score is saved across games played
        this.hScore = parseInt(localStorage.getItem("score")) || 0;
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
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 7500, //default 7500 (7.5 seconds)
                callback: () =>
                {
                    this.gameClock += 15000*this.tMult; 
                    this.timeLeft.text = this.formatTime(this.gameClock);
                },
                scope: this,
                loop: true
            }
        );
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
            game.config.width/2 - 250,       // x-coord
            game.config.height/2,         // y-coord
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

        // checkpoint
        this.uGasC = 1
        this.uGasP = 1
        this.uArmor = 1
        this.uKill = 1
        this.uFill = (8 - this.gas) * (11 - this.uGasC);

        //----------------------------------------------------------------------
        // game over event
        this.gameOver = false;
        // checkpoint event
        this.checkpoint = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        // generally updates every frame
        // starts Start timer
        if(!this.init){
            if(!this.start.isPlaying & !this.checkpoint){
                this.start.stop()       
                this.init = true;
                this.gasTimer -= 3;
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
            // update tile sprite
            this.road.tilePositionY -= this.p1Lives;  
            // update player
            this.player.update(this.p1Lives);

            // update zombies
            for(var i = 0; i < this.zombies.length; i++){
                this.zombies[i].update(1, this.p1Lives);
            }
            // update obstacles
            for(var i = 0; i < this.obstacles.length; i++){
                this.obstacles[i].update(this.p1Lives, this.omin, this.omax);
            }

            // check zombie collisions
            for(var i = 0; i < this.zombies.length; i++){
                if(this.checkCollision(this.player, this.zombies[i]))
                {
                    this.player.reset();
                    this.zombieKill(this.zombies[i]);
                }        
            }
            // check obstacle collisions
            for(var i = 0; i < this.obstacles.length; i++){
                if(this.checkCollision(this.player, this.obstacles[i]))
                {
                    this.player.reset();
                    this.obstacleDestroy(this.obstacles[i]);
                }        
            }
            // check if enemies overlap
            for(var i = 0; i < this.obstacles.length; i++){
                for(var j = 0; j < this.zombies.length; j++){
                    if(this.checkOverlap(this.zombies[j], this.obstacles[i]))
                    {
                        this.zombies[i].y -= 50;
                        console.log('boom');
                    }        
                }        
            }
            for(var i = 0; i < this.obstacles.length - 1; i++){
                for(var j = 1; j < this.obstacles.length; j++){
                    if(this.checkOverlap(this.obstacles[j], this.obstacles[i]))
                    {
                        this.obstacles[i].y -= 100;
                        console.log('boom');
                    }        
                }        
            }
        
            //switches clock from AM to PM
            if(this.gameClock >= 1500000){
                if(this.ampm == 'pm'){
                    this.ampm = 'am'
                }
                if(this.ampm == 'am'){
                    this.ampm = 'pm'
                }
                this.gameClock = 60000;
                this.timeLeft.text = this.formatTime(this.gameClock);
            }
        }
        
        // rpm indicator
        if(this.gasTimer == "0"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm0');
        } else if(this.gasTimer == "1"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm1');
        }else if(this.gasTimer == "2"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm2');
        }else if(this.gasTimer == "3"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm3');
        }else if(this.gasTimer == "4"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm4');
        }else if(this.gasTimer == "5"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm5');
        }
        // if a player avoids zombies for 15 seconds, they consume gas
        if(this.gasTimer == 6){
            this.consumeGas(this.player);
        }

        // mph indicator
        if(this.p1Lives == "0"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph0');
        } else if(this.p1Lives == "1"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph1');
        } else if(this.p1Lives == "2"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph2');
        } else if(this.p1Lives == "3"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph3');
        } else if(this.p1Lives == "4"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph4');
        } else if(this.p1Lives == "5"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph5');
        } else if(this.p1Lives == "6"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph6');
        } else if(this.p1Lives == "7"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph7');
        } else if(this.p1Lives == "8"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph8');
        } else if(this.p1Lives == "9"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph9');
        } else if(this.p1Lives >= "10"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph10');
        }

        // gas indicator
        if(this.gas <= 0){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas1');
        } else if(this.gas <= 2){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas2');
        } else if(this.gas <= 4){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas3');
        } else if(this.gas <= 6){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas4');
        } else if(this.gas >= 8){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas5');
        }
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    checkCollision(player, zombie)
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
    
    obstacleDestroy(obstacle)
    {
        this.gasTimer = 0;
        obstacle.alpha = 0; // set obstacle to be fully transparent
        obstacle.y = Phaser.Math.Between(-50, -1000); // reset position
        obstacle.alpha = 1; // set obstacle to be fully visible
        this.p1Lives -= 2;

        if (this.p1Lives <= 0) {
            this.gameOver = true;
        }
    }

    consumeGas(player){
        this.gasTimer = 0;
        this.p1Score -= 10;
        if(this.p1Score < 0){
            this.p1Score += 10;
            this.gas -= 1;
            this.gasMeter = this.gas;
        } else {
            this.scoreLeft.text = "$" + this.p1Score;
        }
        this.p1Lives += 1;
        if(this.gas <= 0){
            this.gameOver = true;
        }
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
