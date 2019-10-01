import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class KdpHome extends Component{
	constructor(props){
		super(props);
		this.state = {
			trackNumber: null
		}
	}
	
	verifyTracking = (e) => {
		
	}
	
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col s12">
						<h1 className="flow-text">eZone</h1>
						<p className="flow-text">Track your package to you here!</p>
					</div>
					<div className="col s12">
						<p>Enter tracking number</p>
						<input type="text" value="" className="trackingNumber" onChange={this.verifyTracking} />
					</div>
				</div>
			</div>
		)
	}
}

export default KdpHome
