import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component{
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col s12">
						<h1 className="flow-text">Choose interface</h1>
					</div>
					<div className="col s12">
					
						<div className="col s4">
							<div className="card">
								<div className="card-image">
									
								</div>
								<div className="card-content">
									<Link to="/ui/KDP">KDP</Link>
								</div>
							</div>
						</div>
						
						<div className="col s4">
							<div className="card">
								<div className="card-image">
									
								</div>
								<div className="card-content">
									<Link to="/ui/Pioneer">Pioneer Pizza</Link>
								</div>
							</div>
						</div>
						
						<div className="col s4">
							<div className="card">
								<div className="card-image">
									
								</div>
								<div className="card-content">
									<Link to="/ui/869">869 To Go</Link>
								</div>
							</div>
						</div>			
								
					</div>
				</div>
			</div>
		)
	}
}

export default Home
