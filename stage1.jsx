'use strict'

const field = new Field(initArea(),[
    createPlayer(),
    createEnemy({id: 'enemy', position: pos(1,1), hp: 40})
])

REPRESENTATION_MAP.set('enemy', '敵')

ReactDOM.render(
    <GameView field={field}/>,
    document.getElementById('app')
);