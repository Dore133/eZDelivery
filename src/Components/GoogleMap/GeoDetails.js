import React, { Component } from 'react'
import moment from 'moment'

export class GeoDetails extends Component {
    constructor(props){
        super(props);
        this.setState({
            roadName: null
        });
        console.log('mounted');
    }

    componentDidMount(){
        console.log('mounted');
        
        let i = 1;
        let AddressName = null;
        let resultAddress = this.props.AddressName;
        let { coordTime } = this.props;
        let wrongName = ['Unnamed Road', 'Brumaire', '300', 'P.O. Box 699, Basseterre', 'KN', 'St. Kitts', 'Saint Anne Sandy Point Parish', 'Saint Thomas Middle Island Parish']
        let defaultPOB = 'Trinity Palmetto Point Parish';
        let defaultST = 'Saint Thomas Parish'
        let defaultSP = 'Sandy Point'
        let finalRoad = (roadName) => {
            let nameStatus = wrongName.indexOf(roadName);
            
            console.log(nameStatus,roadName);
            switch (nameStatus) {
                case 3:
                    return defaultPOB
                case 7:
                    return defaultST
                case 6:
                    return defaultSP
                default:
                    return ''
            }
        }
        
        resultAddress.forEach(result => {
            AddressName += (i !== 1) ? ' ': '';
            let roadName = result.short_name;
            
            AddressName += finalRoad(roadName);
            if(i === resultAddress.length){
                if(coordTime){AddressName += ' at ' + moment(coordTime.toDate()).calendar()}
            }
            i++;
        });

        this.setState({
            roadName: AddressName
        });
    }

    render() {
        
        return (
            <div>
                <span className='LocationInfo'>
                    <i className="material-icons tiny">directions_bus gps_fixed</i> {this.state.roadName}
                </span>
            </div>
        )
    }
}

export default GeoDetails
