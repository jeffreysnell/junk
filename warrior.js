const RUN = "RUN";
const FIGHT = "shoot";
const WALK = "walk";
const HEAL = "rest";
const RESCUE = "rescue";
const TURN = "pivot";

const condition = (action, ...conditions) => conditions.every(condition => !!condition) && action || null;

class Player {
    constructor() {
        this.previousHealth = 20;
    }

    
    playTurn(warrior) {

        const nextSpace = warrior.feel();
        const nextUnitSpace = this.nextUnitSpace(warrior)
        const unit = nextSpace.getUnit();
        const health = warrior.health();
        this.running = this.running && health < 20;

        this.decideOn(WALK, true);
        this.decideOn(TURN, nextSpace.isWall())
        this.decideOn(RESCUE, !nextSpace.isEmpty(), !!unit);
        this.decideOn(FIGHT, !!nextUnitSpace && nextUnitSpace.getUnit().isEnemy());
        this.decideOn(HEAL, this.isHurt(warrior), this.running, nextSpace.isEmpty());
        this.decideOn(RUN, this.needsRestBadly(health), this.shouldRun(health, nextSpace));

        this.react(warrior, this.action);

        this.previousHealth = warrior.health();
    }

    decideOn(action, ...conditions) {
        this.action = condition(action, ...conditions) || this.action;
    }

    nextUnitSpace(warrior) {
        return warrior.look().find(space => !space.isEmpty() && !!space.getUnit());
    }

    shouldRun(health, space) {
        return health < this.previousHealth || !space.isEmpty();
    }

    isHurt(warrior) {
        return warrior.health() < 20;
    }

    needsRestBadly(health) {
        return health <= 8;
    }

    react(warrior, action) {
        warrior.think("I should " + action);
        switch (action) {
            case RUN:
                warrior.walk("backward");
                this.running = true;
                break;
            default:
                warrior[action]();
        }
    }
}


