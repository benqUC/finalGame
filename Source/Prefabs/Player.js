class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        // track the rockets firing status
        this.isFiring = false;
        this.moveSpeed = 10; 
    }


    update(speed)
    {
        if(keyA.isDown && this.x >= game.config.width/2 - 316 || keyLEFT.isDown && this.x >= game.config.width/2 - 316) {  // left movement
            this.x -= speed*(4/5);
        } else if (keyD.isDown && this.x <= game.config.width/2 + 259 || keyRIGHT.isDown && this.x <= game.config.width/2 + 259) {  //right movement
            this.x += speed*(4/5);
        }
    }

    // reset player 
    reset()
    {
        this.isFiring = false;
        this.y = game.config.height/1.45;
    }
}

