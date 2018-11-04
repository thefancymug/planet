var gameScenes = Array();
var infoPanel;
var currentScene = "universe";
var planets = Array();

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

function mouseMoved() {
    gameScenes[currentScene].mouseMoved();
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
    mousePressed(){}
    mouseMoved(){}

}


class Star extends GameObject {

    constructor(x, y, radius, colour, name) {
        super(x,y);
        this.radius = radius; 
        this.colour = colour;
        this.name = name;
        this.isSelected = false;
        this.numberOfPlanets = Math.floor(random(1, 6));
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
    mouseMoved() {}

}

class UniverseScene extends GameScene {

    constructor(name) {
        super(name);
        this.gameObjects = Array();
        this.infoPanel = new InfoPanel(0, 0, width/6, height);
        this.ship = new Ship(width/2, height/2, "Ship McShip");
        this.selectedStar = null;
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
                    this.selectedStar = this.gameObjects[i];
                    var systemScene = new SystemScene(this.selectedStar.name, this.selectedStar);
                    gameScenes[systemScene.name] = systemScene;
                    currentScene = this.selectedStar.name;
                    console.log(currentScene);
                    break;
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

class Planet extends GameObject {

    constructor(x, y, star, index) {
        super(x, y)
        var resources = ["metal", "gas", "organics"];
        this.amount = 100
        this.radius = random(10, 40)
        var colours = ["red", "blue", "green"]
        this.zoomLevel = 1
        var randomIndex = Math.floor(random(0, colours.length));
        this.colour = colours[randomIndex];
        this.resource = resources[randomIndex];
        this.star = star;
        this.name = this.star.name + "-" + index;
    }


    draw() {
        fill(this.colour);
        strokeWeight(2);
        ellipse(this.position.x, this.position.y, this.radius * this.zoomLevel)
        strokeWeight(1)
        stroke(0);
    }

}

class SystemScene extends GameScene {
    
    constructor(name, star) {
        super(name);
        this.star = star;
        this.selectedPlanetIndex = 0;
        this.isPlanetSelected = false;
        if(planets[this.star.name]) {

        } else {
            planets[this.star.name] = [];
            for(var i = 0; i < this.star.numberOfPlanets; i++) {
                var x = i * 75 + this.star.radius * 2.5 + 50
                var planet = new Planet(x, height/2, this.star, i)
                planets[this.star.name].push(planet)
            }
        }


    }

    mouseMoved() {
        for(var i = 0; i < this.star.numberOfPlanets; i++) {
            if(dist(planets[this.star.name][i].position.x, 
                    planets[this.star.name][i].position.y, 
                    mouseX, 
                    mouseY) < planets[this.star.name][i].radius) {
                        this.selectedPlanetIndex = i;
                        this.isPlanetSelected = true;
                        planets[this.star.name][i].zoomLevel = 2;
                        break;

            } else {
                planets[this.star.name][i].zoomLevel = 1;
            }
            this.isPlanetSelected = false; 
        }
    }

    mousePressed(){
        if(!this.isPlanetSelected)  {
            currentScene = "universe";
        }
    }

    draw() {
        
        background(50);
        text(this.star.numberOfPlanets, 5, 10);
        fill('yellow');
        
        ellipse(0, height/2, this.star.radius * 5);
        
        for(var i = 0; i < planets[this.star.name].length; i++) {
            if(i == this.selectedPlanetIndex && this.isPlanetSelected) {
                stroke(255);
            }
            planets[this.star.name][i].draw();
        }
        if(this.isPlanetSelected) {
            this.drawPlanetInfo();
            this.drawPlanetSelectionBox();
        }

    }


    drawPlanetInfo() {
        fill("#dddddd")
        text(planets[this.star.name][this.selectedPlanetIndex].resource, width/2, 10)
        text("[ Click for info ]", width/2, 20)
    }

    drawPlanetSelectionBox() {
        fill("#ffccaa")
        stroke("black")
        strokeWeight(3)
        rect(width/2 - 100, height - 160, 200, 150)

        strokeWeight(0)
        fill("black")
        
        text(planets[this.star.name][this.selectedPlanetIndex].name, width/2 - 100, height - 140)
        text(planets[this.star.name][this.selectedPlanetIndex].amount, width/2 - 100, height - 120)


    }




}
