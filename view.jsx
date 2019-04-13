'use strict'

const REPRESENTATION_MAP = new Map([
    [PLAYER_ID, '人']
])

const VisibleObject = (props) => {
    return (
        <div className="visible-object">
          {REPRESENTATION_MAP.get(props.object.id)}
        </div>
    )
}

const AreaView = (props) => {
    const classes = ['area-cell']
    classes.push(props.group === GROUP.PLAYER ? 'player-own' : 'enemy-own')

    const objects = props.objects.map((o) => <VisibleObject key={o.id} object={o}/>)
    return (
        <div className={classes.join(' ')}>
            {objects}
        </div>
    )
}

const FieldView = (props) => {
    const area = ALL_POSITIONS.map((row) => {
        const columns = row.map(pos =>
            <AreaView key={pos.x + '-' + pos.y}
                      group={props.field.getOwner(pos)}
                      objects={props.field.getObjects(pos)}/>
        )
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
  

  