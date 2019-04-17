'use strict'

const field = new Field(
    initArea([
        [pos(3,0), PLAYER_AREA.newCondition(CONDITION.HOLE)]
    ])
    , initOccupiers([
        createPlayer(),
        createEnemy({id: 'enemy', position: pos(1,1), hp: 40})
]))

REPRESENTATION_MAP.set('enemy', '敵')

const ATTACK = {
    SHOCK_WAVE : new AttackTemplate(
        {
            power: 10, 
            controller : (self, field) => new Move(self.id, self.group === GROUP.ENEMY ? DIRECTION.RIGHT : DIRECTION.LEFT, field) // dummy
        })
}
REPRESENTATION_MAP.set(ATTACK.SHOCK_WAVE, '波')

ReactDOM.render(
    <GameView field={field}/>,
    document.getElementById('app')
);