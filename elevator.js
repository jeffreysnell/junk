var boop = {
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            // let's go to all the floors (or did we forget one?)

        });
        addFloor(floorNum){
            if(!elevator.destinationQueue.includes(floorNum)){
                elevator.destinationQueue.push(floorNum);
            }
        }

        elevator.on("floor_button_pressed", function(floorNum) {
            console.log("go to ", floorNum);
            elevator.goToFloor(floorNum);
        });

        floors.forEach(floor=> {
            const floorNum = floor.floorNum();
            var goingTo = () => elevator.destinationQueue.includes(floorNum);
            floor.on("up_button_pressed", ()=> !goingTo() && elevator.goToFloor(floorNum));
            floor.on("down_button_pressed", ()=> !goingTo() && elevator.goToFloor(floorNum));
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}