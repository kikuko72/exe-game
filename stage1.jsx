'use strict'

const field = new Field(initArea())

ReactDOM.render(
    <GameView field={field}/>,
    document.getElementById('app')
);