'use strict'

const field = new Field(initArea(),initObjects([
    createPlayer(),
    createEnemy({id: 'enemy', position: pos(1,1), hp: 40}),
    {id: 'hole', position: pos(3,0)}
]))

REPRESENTATION_MAP.set('enemy', '敵')
REPRESENTATION_MAP.set('hole', '穴')

ReactDOM.render(
    <GameView field={field}/>,
    document.getElementById('app')
);