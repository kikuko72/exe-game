'use strict'

const field = new Field(initArea(),[
    createPlayer(),
    createEnemy({position: pos(2,1), hp: 40})
])

ReactDOM.render(
    <GameView field={field}/>,
    document.getElementById('app')
);