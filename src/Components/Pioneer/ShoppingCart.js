import React from 'react';
import { Link } from 'react-router-dom';

const ShoppingCart = ({ cartItems, removeFromCart }) => {
	let cartAmount = ( cartItems ) ? cartItems.length : 0;
	let newBadge = ( cartItems.length !== 0 ) ? 'new ' : '';
	//let clearBtn = ( cartItems.length !== 0 ) ? <div className="colz s12z left"><a href="##"><i className="material-icons left">clear_all</i></a></div> : null;
	let cartCollection = [];
	if( cartItems.length !== 0 ){
		cartItems.map((item, index) => { 
			//console.error(item);
			if(item) {
				let { id, title } = item;
				cartCollection.push( 
					<li className="collection-item" key={index}> 
						{title} 
						<a href="##" className="secondary-content" onClick={() => removeFromCart(id)}>
							<i className="material-icons right">clear</i>
						</a> 
					</li> 
				);  
			}
		});
		
		cartCollection.push(
			<li className="collection-item" key="orderBtn">
				<Link to="/cart/Pioneer/" className="btn waves-effect waves-light">
					<i className="material-icons right">forward</i> 
					Order Now
				</Link>
			</li>
		);
	} else{
		cartCollection.push(<li className="collection-item" key="none">No items</li>);
	}
	return(
		<div className="col s12">
			<ul className="collapsible popout">
				<li>
					<div className="collapsible-header">
						<i className="material-icons">shopping_cart</i>
						Shopping Cart
						<span className={newBadge + "badge notify"}>
							{ cartAmount }
						</span>
					</div>
					<div className="collapsible-body">
						{/*clearBtn*/}
						<ul className="collection">
							{ cartCollection }
							{ /*cartCheckout*/ }
						</ul>
					</div>
				</li>
			</ul>
		</div>
	)
}

/*const mapStateToProps = (state) => {
	console.log('shopping cart map state', state);
    return{
		cartItems: state.cart.cartItems
    }
}*/

//export default connect(mapStateToProps)(ShoppingCart);
export default ShoppingCart
