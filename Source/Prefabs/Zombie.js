class Enemy extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, pointValue, choice)
    {
        super(scene, x, y, texture, frame, pointValue, choice);

        // add object to existing scene
        scene.add.existing(this);
        //Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 0;

        // store pointValue
        this.points = pointValue;

        // store path choice
        this.path = choice;
        this.pathX = [];
        this.pathY = [];

        this.i = 0;
        this.j = 0; 

        this.speed = 1;
    }
    

    update(choice)
    {     
        //chooses path
        this.choosePath(choice);

        // follow horizontal path
        var diffX = this.pathX[this.i] - this.x;
        // if waypoint is to the right
        if(diffX > 0){
            this.x += this.speed;
        // if waypoint is to the left            
        } else if(diffX < 0){
            this.x -= this.speed;
        }
        
        // follow verticle path
        var diffY = this.pathY[this.j] - this.y;
        // if waypoint is to the right
        if(diffY > 0){
                this.y += this.speed;
        // if waypoint is to the left            
        } else if(diffY < 0){
                this.y -= this.speed;
        }

        if(diffX == 0 & diffY == 0){
            this.i++;
            this.j++;
            console.log('works');
        }

        if(this.x == 300 & this.y == 250){
            this.alpha -= 0.05 * this.speed;
            this.scale -= 0.05 * this.speed;
        }
    }
    
    choosePath(choice){
        if(choice == 1){ // upper path
            this.pathX = [200, 450, 450, 300, 300];
            this.pathY = [50, 50, 200, 200, 250];
        } else if(choice == 2){ // lower path
            this.pathX = [500, 100, 100, 300, 300];
            this.pathY = [450, 450, 350, 350, 250];
        } else if(choice == 3){ // left path
            this.pathX = [250, 250, 100, 100, 300];
            this.pathY = [100, 150, 150, 250, 250];
        } else if(choice == 4){ // right path
            this.pathX = [600, 600, 550, 550, 300];
            this.pathY = [400, 100, 100, 250, 250];
        }
    }

    startOnPath()
    {
        this.follower.t = 0;
            this.hp = 100;
            
            path.getPoint(this.follower.t, this.follower.vec);
            
            this.setPosition(this.follower.vec.x, this.follower.vec.y);      
    }

    receiveDamage(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);      
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
}