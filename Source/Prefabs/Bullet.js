// Bullet prefab
class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
        // this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
    }

    update() {
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.y -= this.moveSpeed;
            console.log("testing");
            // this.sfxRocket.play();
        }
        // if fired, move up
        // if(this.isFiring) {
        //     this.y -= this.moveSpeed;
        // }
    }
}
