var gameScenes = Array();
var infoPanel;
var currentScene = "universe";

function setup() {
    createCanvas(600, 600);
    var universeScene = new UniverseScene("universe");
    var shipScene = new ShipScene("ship");

    gameScenes[shipScene.name] = shipScene;
    gameScenes[universeScene.name] = universeScene; 
    gameScenes[currentScene].setup();  
}

function draw () {
    gameScenes[currentScene].draw();
}

function mousePressed() {
    //currentScene = "ship"
    gameScenes[currentScene].mousePressed();
}

function SelectStar(star) {

}



class GameObject{

    constructor(x, y) {
        this.position = createVector(x, y);
    }

    draw(){}

}


class Star extends GameObject {

    constructor(x, y, radius, colour, name) {
        super(x,y);
        this.radius = radius; 
        this.colour = colour;
        this.name = name;
        this.isSelected = false;
        this.numberOfPlanets = Math.floor(random(1, 8));
        this.distanceToShip = -1;
        this.shipPosition = null;
       
    }


    draw() {
        
        fill(this.colour);
        ellipse(this.position.x, this.position.y, this.radius);

        if(this.isSelected) {
            fill(220)
            line(this.position.x, this.position.y, this.position.x + 50, this.position.y - 50);
            rect(this.position.x + 50, this.position.y - 100, 75, 50);
            fill(20)
            //stroke(0)
            text(this.name, this.position.x + 55, this.position.y - 80);
            text(this.numberOfPlanets, this.position.x + 55, this.position.y - 70);
            text(this.distanceToShip.toFixed(2), this.position.x + 55, this.position.y - 50);
            //stroke(220)
            line(this.position.x, this.position.y, this.shipPosition.x, this.shipPosition.y);
            //stroke(0)
        }

    }

    setSelected(shipPosition) {
        this.shipPosition = shipPosition;
        this.distanceToShip = dist(this.position.x, this.position.y, this.shipPosition.x, this.shipPosition.y);
        this.isSelected = true;
    }

}

class InfoPanel extends GameObject {

    constructor(x, y, width, height) {
        super(x,y);
        this.width = width;
        this.height = height;
    }

    draw() {
        rect(this.position.x, this.position.y, this.width, this.height);
    }


}


class Ship extends GameObject {

    constructor(x, y, name) {
        super(x,y);
        this.name = name;
        this.showShip = true;
    }

    draw() {
        if(this.showShip) {
            fill(220)
            line(this.position.x, this.position.y, this.position.x + 50, this.position.y - 50);
            rect(this.position.x + 50, this.position.y - 100, 75, 50);
            fill(20)
            text(this.name, this.position.x + 55, this.position.y - 75);
        }
    }
}

class GameScene {
    constructor(name) {
        this.name = name;
    }
    setup() {}
    update() {}
    draw() {}
    mousePressed() {}

}

class UniverseScene extends GameScene {

    constructor(name) {
        super(name);
        this.gameObjects = Array();
        this.infoPanel = new InfoPanel(0, 0, width/6, height);
        this.ship = new Ship(width/2, height/2, "Ship McShip");
    }

    setup() {
        for(var i = 0; i < 50; i++) {
            var starColour = color(random(0, 255), random(0, 255), random(0, 255));
    
            var star = new Star(random(0, width), 
                                random(0, height), 
                                random(1, 30),
                                starColour,
                                "star" + i);
            this.gameObjects.push(star);
            this.gameObjects.push(this.ship);
        }
        
    }

    mousePressed() {
        for(var i = 0; i < this.gameObjects.length; i++) {
            if(this.gameObjects[i] instanceof Star) {
                this.gameObjects[i].isSelected = false;
                var distance = dist(mouseX, mouseY, this.gameObjects[i].position.x, this.gameObjects[i].position.y);
                if(distance <= this.gameObjects[i].radius) {
                    this.gameObjects[i].setSelected(createVector(this.ship.position.x, this.ship.position.y));
                    console.log("Clicked " + this.gameObjects[i].name);
                }
            }
        }
    }

    update() {

    }

    draw() {
        background(50);
        for(var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }
    
        this.infoPanel.draw();
    }

}

class ShipRoom {
    constructor(x,y) {
        this.position = createVector(x,y);
    }

    draw(){}

}

class Bridge extends ShipRoom {
    constructor(x,y) {
        super(x,y);
        this.colour = "white"
    }
    setup(){}
    draw() {
        fill(222);
        rect(this.position.x, this.position.y, 100, 100)
    }
}


class ShipScene extends GameScene {

    constructor(name) {
        super(name);
        this.gameObjects = Array();
        this.infoPanel = new InfoPanel(0, 0, width/6, height);
        this.showInfoPanel = false;
    }

    setup(){

        var bridge = new Bridge(90,90);
        this.gameObjects.push(bridge);

    }
    update(){}
    mousePressed(){}
    draw(){
        background(0);
        for(var i = 0; i < this.gameObjects.length; i++) {

            this.gameObjects[i].draw();
        }
        if(this.showInfoPanel) {
            this.infoPanel.draw();
        }

    }


}
