import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import PioneerMenuGrid from '../Pioneer/PioneerMenuGrid.js';
import ShoppingCart from '../Pioneer/ShoppingCart.js';
import { initMaterial } from '../../Store/Actions/miscActions.js';
import { removeFromCart } from '../../Store/Actions/cartActions.js';

class PioneerHome extends Component{
	constructor(props){
		super(props);
		this.state = {
			trackNumber: null,
			isLoaded: false,
			error: null,
			menu: []
		}
	}
	
	componentDidMount() {		
		const { initMaterial } = this.props;
		
		initMaterial();
		
		fetch("http://jsonplaceholder.typicode.com/photos")
			.then(res => res.json())
			.then(
				(result) => {
					console.log('Photos API', result);
					this.setState({
						isLoaded: true,
						menu: result
					});
				},
				(error) => {
					console.log('Photos API Error', error);
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
		
	}
	
	render(){
		const { error, isLoaded, menu } = this.state;
		const { cartItems, removeFromCart } = this.props;
		
		const Content = (!isLoaded) ? <div className="progress"><div className="indeterminate"></div></div> : (error === null) ? <PioneerMenuGrid menuItems={menu} /> : <p>error</p>; 
		return(
			<div className="container">
				<div className="row">
					<div className="col s8">
						<h1 className="flow-text">Pioneer Pizza</h1>
						<p className="flow-text">Order Online</p>
						<p className="flow-text">Menu</p>
					</div>
					<div className="col s4">
						<ShoppingCart cartType="pioneer" cartItems={cartItems} removeFromCart={removeFromCart} />
					</div>
				</div>
				<div className="row">
					{Content}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	console.log('pioneerhome map state', state);
    return{
		cartItems: state.cart.cartItems
    }
}

const mapDispatchToProps = (dispatch) => {
	return{
		initMaterial: () => dispatch(initMaterial()),
		removeFromCart: (id) => dispatch(removeFromCart(id))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PioneerHome)
