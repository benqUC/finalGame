class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, cl, cr, cu, cd)
    {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        // track the rockets firing status
        this.isFiring = false;
        this.collideLeft = cl;
        this.collideRight = cr;
        this.collideUp = cu;
        this.collideDown = cd;
    }


    update(speed, grid)
    {
        this.tileX = Math.floor((this.x)/50); // 27
        this.tileY = Math.floor((this.y)/50); // 24

        if (keyW.isDown && keyA.isDown && this.y >= 0 && this.x >= 0 && !this.cl && !this.cu) {  //Northwest movement
            this.x -= speed*3/4;
            this.y -= speed*3/4;
        } else if (keyW.isDown && keyD.isDown && this.y >= 0 && this.x <= game.config.width - 50 && !this.cr && !this.cu) {  //Northeast movement
            this.x += speed*3/4;
            this.y -= speed*3/4;
        } else if (keyS.isDown && keyD.isDown && this.y <= game.config.height - 50 && this.x <= game.config.width - 50 && !this.cr && !this.cd) {  //Soutwest movement
            this.x += speed*3/4;
            this.y += speed*3/4;
        } else if (keyS.isDown && keyA.isDown && this.y <= game.config.height - 50 && this.x >= 0 && !this.cl && !this.cd) {  //Southeast movement
            this.x -= speed*3/4;
            this.y += speed*3/4;
        } else if(keyW.isDown && this.y >= 0) {  // left movement
            this.y -= speed;
        } else if (keyA.isDown && this.x >= 0) {  //right movement
            this.x -= speed;
        } else if (keyS.isDown && this.y <= game.config.height - 50) {  //right movement
            this.y += speed;
        } else if (keyD.isDown && this.x <= game.config.width - 50) {  //right movement
            this.x += speed;
        } 

    }

    // reset player 
    reset()
    {
        this.isFiring = false;
        this.y = game.config.height/1.45;
    }
}

