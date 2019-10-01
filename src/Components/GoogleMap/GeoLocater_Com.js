import React, { Component } from 'react'
// import moment from 'moment'

export class GeoLocater extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            AddressName: null,
            CoordTime: null
        };
    }
    
    componentDidMount(){
        const { position, google, coordTime } = this.props;
        const geocoder = new google.maps.Geocoder();
        // const timeID = new Date().getTime();
        let AddressName = '';
        // let span = document.createElement('span');
        geocoder.geocode({'location': position}, function(results, status){
            if (status === 'OK') {
                if (results[0]) {
                    // console.log(results[0]);
                    let resultAddress = results[0].address_components;
                    let i = 1;
                    let wrongName = ['Unnamed Road', 'Brumaire', '300', 'P.O. Box 699, Basseterre', 'KN', 'St. Kitts', 'Saint Anne Sandy Point Parish', 'Saint Thomas Middle Island Parish', 'Saint George Basseterre Parish', 'Trants', 'Saint Paul Capisterre Parish', 'super', 'Trinity Palmetto Point Parish']
                    let defaultPOB = 'Trinity Parish';
                    let defaultST = 'St. Thomas Parish';
                    let defaultSP = 'Sandy Point';
                    let defaultTown = 'Basseterre';
                    let defaultSTP = 'St. Paul Parish'
                    let defaultTrants = 'Newton Ground';
                    let finalRoad = (roadName) => {
                        let nameStatus = wrongName.indexOf(roadName);
                        
                        // console.log(nameStatus,roadName);
                        switch (nameStatus) {
                            case 3:
                                return defaultPOB
                            case 12:
                                return defaultPOB
                            case 10:
                                return defaultSTP
                            case 9:
                                return defaultTrants
                            case 8:
                                return defaultTown
                            case 7:
                                return defaultST
                            case 6:
                                return defaultSP
                            case -1:
                                return roadName
                            default:
                                return ''
                        }
                    }
                    resultAddress.forEach(result => {
                        
                        AddressName += (i !== 1) ? ' ': '';
                        // console.log(result.short_name);
                        let roadName = result.short_name;
                        
                        AddressName += finalRoad(roadName);
                        i++;
                    });

                    handleState(AddressName,coordTime);
                    
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });

        const handleState = (AddressName,coordTime) => {
            this.setState({
                AddressName: AddressName
            });
        }
    }

    render() {
        let theAddress = null;
        let { AddressName } = this.state;
        if(AddressName !== ' ' && AddressName !== null){
            theAddress = <span><i className="material-icons tiny">gps_fixed</i> {this.state.AddressName}</span>;
        } 
        return (
            <p className='LocationInfo' id={'LocationInfo'}>
            {theAddress}
            </p>
        )
    }
}

export default GeoLocater