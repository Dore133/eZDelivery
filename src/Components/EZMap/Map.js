import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import usericon from '../../assets/images/blue-location.png';
import busicon from '../../assets/images/bus-marker-2.png'
import moment from 'moment'

class Map extends Component {
	
	componentDidMount(){
        //const { initMaterial } = this.props;
        this.loadMap();
        //initMaterial('top');
    }

    loadMap(){
        if (this.props && this.props.google){
            const { google } = this.props;
            const { currentLocation } = this.state;

            // google is available
            const maps = google.maps;
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            const mapOptions = {
                center: currentLocation,
                zoom: 13,
                gestureHandling: 'greedy',
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: false,
                minZoom: 11,
                maxZoom: 15,
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
            this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
        }
        
        this.initMarkers();
    }
    
	render(){
        const style = {
            width: '100%',
            height: '100vh'
        }
        
		return (
			<div>
                <div ref='map' style={style} className="refMapgoogle">
                    <div className="progress"><div className="indeterminate"></div></div>
                </div>
                <div id="legend"><h5 className="legend-title">Legend</h5></div>
            </div>
		)
	}
}

export default Map
