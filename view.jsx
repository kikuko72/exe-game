'use strict'

const VisibleObject = (props) => {
    return (
        <div className="visible-object">
          人
        </div>
    )
}

const AreaView = (props) => {
    const classes = ['area-cell']
    classes.push(props.group === GROUP.PLAYER ? 'player-own' : 'enemy-own')

    return (
        <div className={classes.join(' ')}>
            <VisibleObject />
        </div>
    )
}

const FieldView = (props) => {
    const area = ALL_POSITIONS.map((row) => {
        const columns = row.map(cell => <AreaView group={props.field.getOwner(cell.x, cell.y)} key={cell.x + '-' + cell.y}/>)
        return (
            <div className="area-row" key={row[0].y}>
                {columns}
            </div>
        )
    })

    return (
        <div>
            {area}
        </div>
    )
}

class GameView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            field: props.field
        }

        window._debugSetState = this.setState.bind(this)
    }

    render() {
        return (
            <div>
                <FieldView field={this.state.field} />
            </div>
        )
    }
}
  

  