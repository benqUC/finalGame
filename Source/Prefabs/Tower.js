class Tower extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, width, length, height, dmg)
    {
        super(scene, x, y, texture, frame, width, length, height, dmg);
        // add object to existing scene
        scene.add.existing(this);
        this.h = height;
    }

    update(angleX,angleY)
    {
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, angleX, angleY);
    }
    
}