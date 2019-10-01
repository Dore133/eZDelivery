import React from 'react';
//import { Link } from 'react-router-dom';

const CardItem = (props) => {
	let { cardTitle, cardImage, addToCart, itemId } = props;
	const titleLength = 20;
	
	let cardTitleShort = ( cardTitle.length > titleLength ) ? cardTitle.slice(0,titleLength) + '...' : cardTitle;
	
	return(
		<div className="col s12 m4 l3 pioneerCard">
			<div className="card">
				<div className="card-image waves-effect waves-block waves-light">
					<img className="activator" src={cardImage} alt={ cardTitle } />
				</div>
				<div className="card-content">
					<span className="card-title activator grey-text text-darken-4">{ cardTitleShort } {/*<i className="material-icons right">more_vert</i>*/}</span>
					<p><a href="##" onClick={() => addToCart(itemId, cardTitle)}><i className="material-icons">add_shopping_cart</i></a></p>
				</div>
				<div className="card-reveal">
					<span className="card-title grey-text text-darken-4">{ cardTitle }<i className="material-icons right">close</i></span>
					<p>Here is some more information about this product that is only revealed once clicked on.</p>
					<p><a href="##" onClick={() => addToCart(itemId, cardTitle)}><i className="material-icons">add_shopping_cart</i></a></p>
				</div>
			</div>		
		</div>
	)
}

export default CardItem
