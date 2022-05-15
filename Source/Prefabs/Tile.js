class Tile extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, width, length, height)
    {
        super(scene, x, y, texture, frame, width, length, height);
        // add object to existing scene
        scene.add.existing(this);
    }

    update(playerSpeed,xmin,xmax)
    {
        // move 
        this.y += (playerSpeed);

        // fade away as it resets 
        if(this.y >= game.config.height-180){
            this.alpha -= 0.1;
        }

        // wraparound from left to right edge
        if(this.y >= game.config.height-130){
            // fully opace
            this.alpha = 1;
            // min/max value on zombie spawns
            var min = -50;
            var max = -1000;
            this.y = Phaser.Math.Between(min, max);
            this.x = Phaser.Math.Between(xmin,xmax-this.width/2);
        }  
    }

    reset()
    {
        this.y = -50;
    }
}