import React, { Component } from 'react'
import moment from 'moment'

export class GeoLocater extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            AddressName: null,
            CoordTime: null
        };
    }
    
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.position !== prevProps.position) {
            // console.log('position change');
            const { position, google, coordTime } = this.props;
            const geocoder = new google.maps.Geocoder();
            let AddressName = '';
            // let span = document.createElement('span');
            geocoder.geocode({'location': position}, function(results, status){
                if (status === 'OK') {
                    if (results[0]) {
                        // console.log(results[0]);
                        let resultAddress = results[0].address_components;
                        let loopLength = resultAddress.length;
                        let i = 1;
                        resultAddress.forEach(result => {
                            
                            // console.log(result.short_name);
                            AddressName += (result.short_name !== 'Unnamed Road') ? (i !== loopLength) ? result.short_name + ', ' :'' : '';
                            // i++;
                        });

                        handleState(AddressName);
                        
                    } else {
                        console.log('No results found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            });

            const handleState = (AddressName) => {
                this.setState({
                    AddressName: AddressName,
                    CoordTime: moment(coordTime.toDate()).calendar()
                });
            }
        }
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
                    let loopLength = resultAddress.length;
                    let i = 1;
                    resultAddress.forEach(result => {
                        
                        // console.log(result.short_name);
                        AddressName += (result.short_name !== 'Unnamed Road') ? (i !== loopLength) ? result.short_name + ', ' :'' : '';
                        // i++;
                    });

                    handleState(AddressName);
                    
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });

        const handleState = (AddressName) => {
            // console.log('changin state ', AddressName);
            this.setState({
                AddressName: AddressName,
                CoordTime: moment(coordTime.toDate()).calendar()
            });
        }
    }

    render() {
        return (
            <p className='LocationInfo' id={'LocationInfo'}>
                <i className="material-icons tiny">directions_bus gps_fixed</i> {this.state.CoordTime} | {this.state.AddressName}
            </p>
        )
    }
}

export default GeoLocater