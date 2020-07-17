// The Model, View, Controller (MVC) object system

var view = {
    updateMessage: function(msg) {
        // update the result of the user's coordinate inputs, whether it is a hit, miss or the battleship has been sunk 
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;  
    }, 
    displayMiss: function(location) {
        // display 'miss' to signify that the the user's coordinate inputs were incorrect 
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
    displayHit: function(location) {
        // display a ship to signify that the user's coordinate inputs were correct 
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
};


var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [ 
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] } 
    ],
   

    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.updateMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.updateMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.updateMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
    return true;
    },

    generateShipLocations: function() {
        var locations; 
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            //horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            //vertical ship 
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                // add the location to array for new horizontal ship
                newShipLocations.push(row + "" + (col + i));
            } else {
                // add the location to array for a new vertical ship
                newShipLocations.push((row + i) + "" + col);
            }
        } 
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];

            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true 
                }
            }
        }
        return false;
    }
}; 


function parseGuess(guess) {
    // this array contains all the letters that could form part of a valid guess
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; 

    if (guess.length !== 2 || guess === null) {
        alert("Oops! That's not a valid guess. Please enter a letter and a number on the board");  
    } else {
        firstCharacterOfGuess = guess.charAt(0); 
        var row = alphabet.indexOf(firstCharacterOfGuess)
        // using the indexOf method allows us to get a number that corresponds exactly to the letter the player guessed
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            ("Oops, that's off the board!");
        } else {
            return row + column;
        }
        return null; 
    }
    

    /* This is my attempt at converting the alphabets to numbers. It's very long winded, and can be done in 4 lines of code.
    if (guessInput.charAt(0) === "A") {
        guessInput.charAt(0) = 0;
    }
    else if (guessInput.charAt(0) === "B") {
        guessInput.charAt(0) = 1;
    }
    else if (guessInput.charAt(0) === "C") {
        guessInput.charAt(0) = 2;
    }
    else if (guessInput.charAt(0) === "D") {
        guessInput.charAt(0) = 3;
    }
    else if (guessInput.charAt(0) === "E") {
        guessInput.charAt(0) = 4;
    }
    else if (guessInput.charAt(0) === "F") {
        guessInput.charAt(0) = 5;
    }
    else if (guessInput.charAt(0) === "G") {
        guessInput.charAt(0) = 6;
    }*/

}

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);

        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.updateMessage("You sank all my battleships in " + this.guesses + " guesses");
            }
        }
    }

}


function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput"); 
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}
window.onload = init;


function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    //the guess is stored in the value property of the input element 
    var guess = guessInput.value;
    
    controller.processGuess(guess);

    guessInput.value = "";
}

function reload() {
    var messageArea2 = document.getElementById("messageArea2");

    messageArea2.innerHTML = "Reload?";
    messageArea2.addEventListener("click");
}

reload();


