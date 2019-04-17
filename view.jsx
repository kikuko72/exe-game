'use strict'

const REPRESENTATION_MAP = new Map([
    [PLAYER_ID, '人'],
    [CONDITION.HOLE, '穴']
])

const VisibleObject = (props) => {
    return (
        <div className="visible-object">
          {REPRESENTATION_MAP.get(props.representationKey)}
        </div>
    )
}

const HitPoint = (props) => {
    if (typeof props.object.hp !== 'undefined' && props.object.isCharacter) {
        const classes = ['hit-point']
        const digits = ((n) => n.toString().length)(props.object.hp)
        classes.push('digits-' + digits)
        return (
            <div className={classes.join(' ')}>{props.object.hp}</div>
        )
    }

    return null
}

const CellOccupier = (props) => (
    props.occupier === null ? null :
    <div className="area-cell-container">
        <VisibleObject representationKey={props.occupier.id}/>
        <HitPoint object={props.occupier}/>
    </div>
)

const AreaView = (props) => {
    const classes = ['area-cell']
    classes.push(props.area.owner === GROUP.PLAYER ? 'player-own' : 'enemy-own')

    const effects = props.effects.map(e => <VisibleObject key={e.id} representationKey={e.template}/>)
    return (
        <div className={classes.join(' ')}>
            <div className="area-cell-container">
                <div className="area-condition">
                    {REPRESENTATION_MAP.get(props.area.condition)}
                </div>
                <CellOccupier occupier={props.occupier} />
                {effects}
            </div>
        </div>
    )
}

const FieldView = (props) => {
    const area = ALL_POSITIONS.map((row) => {
        const columns = row.map(pos =>
            <AreaView key={pos.x + '-' + pos.y}
                      area={props.field.getArea(pos)}
                      occupier={props.field.getOccupier(pos)}
                      effects={props.field.getEffects(pos)}/>
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
  

  