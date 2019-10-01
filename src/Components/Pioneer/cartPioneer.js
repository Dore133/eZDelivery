import React, { useState } from 'react';
import { connect } from 'react-redux';
import { removeFromCart } from '../../Store/Actions/cartActions.js';
import { Link } from 'react-router-dom';

function CartPioneer(props){
	
	let { cartItems, removeFromCart } = props;
	let totalPricez, subPricez = 0;
	let cartFooter = [];
	let deliveryPrice = 5;
	let orderNumber = 3552;
	let cartItemsList = cartItems.map((item, index) => { 			
		if(item) {
			let { id, title } = item;
			//subPricez += 20;
			return ( 
				<tr key={index}> 
					<td>{title}</td>
					<td>1</td>
					<td>$20.00</td> 
					<td>
						<a href="##" onClick={() => removeFromCart(id)}>
							<i className="material-icons red-text">delete_forever</i>
						</a>
					</td>
				</tr> 
			);  
		}
	});
	cartItems.forEach(() => {
		subPricez += 20;
	});
	totalPricez = subPricez + deliveryPrice;
	
	const [cartDetails, setCart] = useState({
		subPrice: subPricez,
		totalPrice: totalPricez,
		delivery: false,
		trackingCode: null,
		deliveryCode: null,
		cartStage: 1
	}); 
	
	let { subPrice, totalPrice, cartStage } = cartDetails;	
	
	function handleSubmit(e){
		//e.preventDefault();
		//setCart({...cartDetails, cartStage: 3})
	}
	
	if(cartStage === 1){	
		return(
			<div className="container">
				<div className="row">
					<div className="col s12 m8">
						<h1 className="flow-text">Pioneer Pizza</h1>
						<p className="flow-text">Cart</p>
					</div>				
					<div className="col s12 m4">
						<Link to="/ui/Pioneer" className="btn waves-light waves-effect blue">Menu</Link>
					</div>
				</div>
				<div className="row">
					<div className="col m8 s12">
						<table className="striped">
							<thead>
								<tr>
									<th>Item</th>
									<th>Quantity</th>
									<th>Price</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{ cartItemsList }
								<tr> 
									<td colSpan="2"><b>Sub Total</b></td>
									<td colSpan="2"><b>{ '$' + subPrice + '.00' }</b></td> 
								</tr>
								<tr> 
									<td colSpan="2"><b>Delivery</b></td>
									<td colSpan="2"><b>{ '$' + deliveryPrice + '.00' }</b></td> 
								</tr>
								<tr> 
									<td colSpan="2"><b>Total</b></td>
									<td colSpan="2"><b>{ '$' + totalPrice + '.00' }</b></td> 
								</tr>
							</tbody>
						</table>
					</div>
					<div className="col s12 m4">
						<a href="##" onClick={ () => setCart({cartStage: 2}) } className="blue btn waves-effect waves-light">
						Checkout
						</a>
					</div>
				</div>
			</div>
		)
	} else if(cartStage === 2) {
		return(
			<div className="container">
				<div className="row">
					<div className="col s8">
						<h1 className="flow-text">Pioneer Pizza</h1>
						<p className="flow-text">Check Out</p>
					</div>				
				</div>
				<div className="row">
					<div className="col s12">
						<form className="col s12" onSubmit={() => handleSubmit()}>
							<div className="row">
								<div className="input-field col s6">
									<input placeholder="Placeholder" id="first_name" type="text" className="validate" />
									<label htmlFor="first_name">First Name</label>
								</div>
								<div className="input-field col s6">
									<input id="last_name" type="text" className="validate" />
									<label htmlFor="last_name">Last Name</label>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12">
									<input value="" id="creditnumber" type="text" className="validate" />
									<label htmlFor="creditnumber">Credit Card</label>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12">
									<input id="address" type="text" className="validate" />
									<label htmlFor="password">Password</label>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12">
									<input id="email" type="email" className="validate" />
									<label htmlFor="email">Email</label>
								</div>
							</div>								
							<div className="row">
								<div className="input-field col s12">
									<button type="submit" className="btn wave-light waves-effect green lighten-2">
										Place Order
									</button>
								</div>
							</div>
						</form>
					</div>
					<div className="col s12 m4">
						<a href="##" onClick={ () => setCart({...cartDetails, cartStage: 1}) } className="blue btn waves-effect waves-light">
						Edit Cart
						</a>
						<a href="##" onClick={ () => setCart({...cartDetails, cartStage: 3}) } className="blue btn waves-effect waves-light">
						Place Order
						</a>
					</div>
				</div>
			</div>
		)
	} else{
		return (
			<div className="container">
				<div className="row">
					<div className="col s8">
						<h1 className="flow-text">Pioneer Pizza</h1>
						<p className="flow-text">Track Order status</p>
					</div>				
				</div>
				<div className="row">
					<div className="col s12">
						<p className="flow-text">Order number: <Link to={ "/map/pioneer/" + orderNumber  }> {  orderNumber } </Link></p>
					</div>
					<div className="col s12 m4">
						<a href="##" onClick={ () => setCart({...cartDetails, cartStage: 1}) } className="blue btn waves-effect waves-light">
						Edit Cart
						</a>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
    return {
		cartItems: state.cart.cartItems
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		removeFromCart: (id) => dispatch(removeFromCart(id))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPioneer)
