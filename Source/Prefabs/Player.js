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
        if (keyW.isDown && keyA.isDown &&  this.y >= 0 && this.x >= 0) {  //Northwest movement
            this.x -= speed/2;
            this.y -= speed/2;
        } else if (keyW.isDown && keyD.isDown && this.y >= 0 && this.x <= game.config.width - 50) {  //Northeast movement
            this.x += speed/2;
            this.y -= speed/2;
        } else if (keyS.isDown && keyD.isDown && this.y <= game.config.height - 50 && this.x <= game.config.width - 50) {  //Soutwest movement
            this.x += speed/2;
            this.y += speed/2;
        } else if (keyS.isDown && keyA.isDown && this.y <= game.config.height - 50 && this.x >= 0) {  //Southeast movement
            this.x -= speed/2;
            this.y += speed/2;
        } else if(keyW.isDown && this.y >= 0) {  // left movement
            this.y -= speed*(4/5);
        } else if (keyA.isDown && this.x >= 0) {  //right movement
            this.x -= speed*(4/5);
        } else if (keyS.isDown && this.y <= game.config.height - 50) {  //right movement
            this.y += speed*(4/5);
        } else if (keyD.isDown && this.x <= game.config.width - 50) {  //right movement
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

