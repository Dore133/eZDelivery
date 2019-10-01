import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firestoreConnect, withFirebase, firebaseConnect } from 'react-redux-firebase'
import ReactDOM from 'react-dom';
import usericon from '../../assets/images/blue-location.png'
import busicon from '../../assets/images/bus-marker-2.png'
import moment from 'moment'
import Preloader from '../Misc/Preloader';

export class MapContainer extends Component{
    constructor(props){
        super(props);
        const { userCoords, isGeolocationEnabled, isGeolocationAvailable } = this.props;
        
        // Global variables
        this.mapCenter = {lat: 17.294219, lng: -62.725735};
        this.markerCluster = null;
        this.globalMarker = {
            markerAPI: [],
            markerList: [],
            infoWindowAPI: []
        };
        this.state = {
            currentLocation: this.mapCenter,
            defaultLocation: {lat: 17.294219, lng: -62.294219}
        };
        this.iconLegend = {
            user: {
              name: 'User Position',
              icon: usericon,
              type: 'img'
            },
            bus: {
              name: 'Bus Position',
              icon: busicon,
              type: 'img'
            },
            busicon: {
                name: 'Bus',
                icon: '<i class="material-icons">directions_bus</i>',
                type: 'icon'
            },
            position: {
                name: 'Location',
                icon: '<i class="material-icons">gps_fixed</i>',
                type: 'icon'
            },
            time: {
                name: 'Time of location',
                icon: '<i class="material-icons">alarm</i>',
                type: 'icon'
            }
        };
        
        if(!isGeolocationAvailable){
			console.log('Your browser does not support Geolocation');
		} else{
			if(!isGeolocationEnabled){
				console.log('Geolocation is not enabled');
			} else{
				if(userCoords){
					if(userCoords.latitude === 17.1274104 || userCoords.longitude === -61.846771999999994){
						console.log('user coords incorrect!');
					} else{
                        console.log('got user coords');
                        this.mapCenter = {lat: userCoords.latitude, lng: userCoords.longitude};
					}
				}
			}
        }
    }

	componentDidMount(){
        this.loadMap();
    }

    loadMap(){
        if (this.props && this.props.google){
            const { google } = this.props;
            const currentLocation = this.mapCenter;

            // google is available
            const maps = google.maps;
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            const mapOptions = {
                center: currentLocation,
                zoom: 15,
                gestureHandling: 'greedy',
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true,
                minZoom: 11,
                maxZoom: 18,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'styled_map']
                }
            }

            const mapConfig = Object.assign({}, mapOptions);
            //Load map to DOM
            this.map = new maps.Map(node, mapConfig);
            
            // this.map.setTilt(45);
            // this.map.mapTypes.set('styled_map', styledMapType);
            // this.map.setMaxBounds(this.map.getBounds());
            this.map.setMapTypeId('hybrid');
            // Add a marker clusterer to manage the markers.
            // let MarkerClusterer = window.MarkerClusterer;
            // this.gooo = new MarkerClusterer(this.map, this.globalMarker.markerAPI);
            this.map.addListener('click', () => this.removeWindows(this.globalMarker));
            
            let icon = {
                url: usericon,
                anchor: new google.maps.Point(15,32),
                scaledSize: new google.maps.Size(32,32)
            };
            //console.log(currentLocation, this.state.defaultLocation);
            if(currentLocation.lat !== this.state.defaultLocation.lat){
                // Create a marker and set user position.
                new google.maps.Marker({
                    map: this.map,
                    position: currentLocation,
                    title: 'Current Location',
                    icon: icon
                });
            }

            //Create Legend
            var legend = document.getElementById('legend');
            var list = document.createElement('ul');
            for (var key in this.iconLegend) {
                var type     = this.iconLegend[key],
                    name     = type.name,
                    iconImg  = type.icon,
                    iconType = type.type;
                
                var li = document.createElement('li');
                li.innerHTML = (iconType === 'img') ? '<img src="' + iconImg + '"> ' + name : iconImg + ' ' + name;
                list.appendChild(li);
            }
            legend.appendChild(list);
            this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
        }
        
        this.initMarkers();
    }

    removeWindows(globalMarker){
        globalMarker.infoWindowAPI.forEach( infowindow => {
            infowindow.close();
        });
    }

    //edit markers on map
    changeMarker(busId, bus){
        console.log('bus modified: ', bus);

        let busDetails  = (bus.details) ? bus.details : '',
            busCoords   = bus.coords,
            busTime     = bus.time,
            busHeading  = bus.degrees,
            busSpeed    = bus.speed,
            gpsState    = bus.gpsState;
        
        let markerFind = this.getMarkerID(busId);
        let found = markerFind.found;
        let listId = markerFind.listId;

        //if already on map edit else add
        if(found === true){
            // console.log(this.globalMarker.markerList);
            if(gpsState && gpsState === true){
                // console.log('edit on map');
                let myinfoWindow = this.globalMarker.infoWindowAPI[listId];
                let myMarker = this.globalMarker.markerAPI[listId];
                let myBus = this.globalMarker.markerList[listId];
                
                myBus.coords = busCoords;
                myBus.time = busTime;
                myBus.details = busDetails;
                myMarker.setPosition(busCoords);
                myMarker.setTitle(busDetails.name);
                //if(busDetails !== ''){this.setInfoDetails(myinfoWindow, bus, myMarker);}
                this.setInfoDetails(myinfoWindow, bus, myMarker);
            } else{
                // console.log('remove from map');
                this.globalMarker.markerAPI[listId].setMap(null);
                this.globalMarker.markerAPI.splice(listId, 1);
                this.globalMarker.markerList.splice(listId, 1);
                this.globalMarker.infoWindowAPI.splice(listId, 1);
                console.log('c.markers ', this.globalMarker.markerAPI.length);
            }
        } else{
            if(gpsState && gpsState === true){
                console.log('new marker');
                let data = {
                    id: busId,
                    details: busDetails,
                    coords: busCoords,
                    time: busTime,
                    heading: busHeading,
                    speed: busSpeed,
                    gpsState
                }
                this.addMarker(data);
            }
        }
    }

    initMarkers(){
        console.log('initMarker()', this.props);
        
        const { firebase } = this.props;
        let FireDB = firebase.database();

        var busReflist = FireDB.ref('/MyRide/PushGEO/DevBoard');
        // busReflist.once('value', snapshot => {
        //     snapshot.forEach(bus => {
        //         console.log('once ref fb bus', bus.key, bus.val());
        //         let thisBus     = bus.val(),
        //             busId       = bus.key,
        //             busDetails  = (thisBus.details) ? thisBus.details : '',
        //             busCoords   = thisBus.coords,
        //             busTime     = thisBus.time,
        //             busHeading  = thisBus.degrees,
        //             busSpeed    = thisBus.speed,
        //             gpsState    = thisBus.gpsState;
                
        //         if(gpsState && gpsState === true){
        //             let data = {
        //                 id: busId,
        //                 details: busDetails,
        //                 coords: busCoords,
        //                 time: busTime,
        //                 heading: busHeading,
        //                 speed: busSpeed,
        //                 gpsState
        //             }

        //             this.addMarker(data);
        //         }
        //     });
        // });

        busReflist.on('child_added', snapshot => {
            let thisBus     = snapshot.val(),
                busId       = snapshot.key,
                busDetails  = (thisBus.details) ? thisBus.details : '',
                busCoords   = thisBus.coords,
                busTime     = thisBus.time,
                busHeading  = thisBus.degrees,
                busSpeed    = thisBus.speed,
                gpsState    = thisBus.gpsState;
            
            if(gpsState && gpsState === true){
                let data = {
                    id: busId,
                    details: busDetails,
                    coords: busCoords,
                    time: busTime,
                    heading: busHeading,
                    speed: busSpeed,
                    gpsState
                }

                this.addMarker(data);
            }
        })

        // bus data changed
        busReflist.on('child_changed', snapshot => {
            let busId       = snapshot.key,
                bus         = snapshot.val();
            
            this.changeMarker(busId, bus);
        });

        busReflist.on('child_removed', snapshot => {
            let busId       = snapshot.key,
                bus         = snapshot.val();
            
            this.changeMarker(busId, bus);
        });
    }

    //get specific bus marker from bus id
    getMarkerID(busId){
        // console.log('get marker id', busId);
        
        let listId,
            listindex = 0,
            found = false;

        //find out which id in array the marker is to edit
        this.globalMarker.markerAPI.forEach((marker) => {
            //console.log(this.globalMarker.markerAPI);
            // console.log('comparing', marker.busId, busId)
            if(marker.key === busId){
                // console.log('found in marker list');
                listId = listindex;
                found = true;
            }
            listindex++;
        });

        return {found, listId}
    }

    //add bus marker to map
    addMarker(bus){
        // add bus marker on map
        const { google } = this.props;
        
        // Create a marker and set its position.
        let icon = {
            url: busicon,
            anchor: new google.maps.Point(15,32),
            scaledSize: new google.maps.Size(45,45)
        }
        var busMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(bus.coords.lat, bus.coords.lng),
            // title: bus.details.busName,
            icon: icon,
            animation: google.maps.Animation.DROP,
            key: bus.id
        });

        //Bounce marker on click
        busMarker.addListener('click', toggleBounce);
        function toggleBounce() {
            function stopBounce(busMarker) {
                busMarker.setAnimation(null);
            }

            if (busMarker.getAnimation() !== null) {
                busMarker.setAnimation(null);
            } else {
                busMarker.setAnimation(google.maps.Animation.BOUNCE);
                window.setTimeout(stopBounce(busMarker), 1000);
            }
        }

        // add busmarker list to array
        this.globalMarker.markerList.push({
            busId: bus.id,
            details: bus.details,
            coords: bus.coords,
            time: bus.time
        }); 

        //add marker object to array (if want to edit marker detail edit this)
        this.globalMarker.markerAPI.push(busMarker); 
    
        // Check content
        // if(bus.details){
            //Add infowindow
            var infoWindow = new google.maps.InfoWindow({
                content: null,
                maxWidth: 500
            });

            //set which marker the listener should attach to from global array
            let thelength = this.globalMarker.markerAPI.length - 1;
            let globalBusMarker = this.globalMarker.markerAPI[thelength];
            // let globalBuslength = this.globalMarker.markerList.length - 1;
            //let globalBusDetails = this.globalMarker.markerList[globalBuslength];
            
            //function to set info window detaisl and open selected and close any other open
            const Info = (infoWindow, busId, busMarker) => {
                console.log('marker clicked');
                
                this.globalMarker.infoWindowAPI.forEach( infowindowz => {
                    infowindowz.close();
                });
                let markerFind = this.getMarkerID(busId);
                let listId = markerFind.listId;

                this.setInfoDetails(infoWindow, this.globalMarker.markerList[listId], busMarker);
                infoWindow.open(this.map, busMarker);
            }

            busMarker.addListener('click', () => Info(infoWindow, bus.id, globalBusMarker));
            this.globalMarker.infoWindowAPI.push(infoWindow); // add info window object to array
        // }
        
        console.log('a.markers ', this.globalMarker.markerAPI.length);
    }

    //function to set info window details
    setInfoDetails = (infoWindow, bus, busMarker) => {
        const { google }    = this.props;
        const geocoder      = new google.maps.Geocoder();
        
        if(bus){
            let AddressName     = '',
                //busName         = bus.details.busName,
                //busNumber       = bus.details.busNumber,
                //busEnd          = bus.details.busEnd,
                coordTime       = new Date(bus.time).getTime(),
                position        = {
                    lat: busMarker.getPosition().lat(),
                    lng: busMarker.getPosition().lng()
                },
                innerHTML;
            
            //GOOGLE Geolocation API
            if(bus.coords.lat !== 0){
                geocoder.geocode({'location': position}, function (results, status){
                    GeoDetails(results, status);
                });
            }

            //Insert details from google api to info window
            function GeoDetails(results, status){
                innerHTML = '<div class="myinfowindow">';
                innerHTML += '<h5 class="info-title"><i class="material-icons">directions_bus</i> '+ bus.busId +'</h5>';
                innerHTML += '<div class="info-content">';
                //innerHTML += '<h5>' + busNumber + ' | ' + busEnd + ' - Town</h5>';

                if (status === 'OK'){
                    if (results[0]){
                        // console.log(results[0]);
                        let resultAddress = results[0].address_components;
                        let i = 1;
                        const wrongName     = ['Unnamed Road', 'Brumaire', '300', 'P.O. Box 699, Basseterre', 'KN', 'St. Kitts', 'Saint Anne Sandy Point Parish', 'Saint Thomas Middle Island Parish', 'Saint George Basseterre Parish', 'Trants', 'Saint Paul Capisterre Parish', 'super', 'Trinity Palmetto Point Parish'],
                            defaultPOB    = 'Trinity Parish',
                            defaultST     = 'St. Thomas Parish',
                            defaultSP     = 'Sandy Point',
                            defaultTown   = 'Basseterre',
                            defaultSTP    = 'St. Paul Parish',
                            defaultTrants = 'Newton Ground';
                        let finalRoad = (roadName) => {
                            let nameStatus = wrongName.indexOf(roadName);
                            
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
                        
                        // Filter through road name
                        resultAddress.forEach(result => {
                            AddressName += (i !== 1) ? ' ': '';
                            let roadName = result.short_name;
                            
                            AddressName += finalRoad(roadName);
                            i++;
                        });
                        
                        innerHTML += '<span className="LocationInfo"><i class="material-icons tiny">gps_fixed</i> ' + AddressName  + '</span>';
                        
                    } else {
                        console.log('No results found');
                        innerHTML += 'No results found';
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                    innerHTML += 'Geocoder failed due to: ' + status;
                }

                innerHTML += (coordTime && coordTime !== '') ? '<span><i class="material-icons tiny">alarm</i> ' + moment(coordTime).fromNow() + '</span>' : '';
                innerHTML += '</div></div>';
                
                // Set content for info window
                infoWindow.setContent(innerHTML); 
            }
        }
    }

    componentWillUnmount(){
        // Stop listening to changes
        const { firebase } = this.props;
        let FireDB = firebase.database();

        var busReflist = FireDB.ref('/MyRide/PushGeo/DevBoard');
        busReflist.off();
    }

	render() {
        const style = {
            width: '100%',
            height: '92vh'
        }
		return (
			<div>
                <div ref='map' style={style} className="refMapgoogle">
                    <Preloader />
                </div>
                <div id="legend"><h5 className="legend-title">Legend</h5></div>
            </div>
		);
	}
}

const mapToStateToProps = (state) => {
    // console.log('mapToStateToProps', ownProps);
    
    return{
        todos: state.firebase.data[''],
        busGEO: state.firestore.ordered.MyRide,
        // trackerID: ownProps.match.params.id
    }
}

export default compose(
	connect(mapToStateToProps),
    firestoreConnect(),
    withFirebase,
    firebaseConnect((props) => [
        { path: '/MyRide/BusGEO/' } // string equivalent 'todos'
    ])
)(MapContainer);