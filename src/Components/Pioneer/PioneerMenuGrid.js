import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import CardItem from './CardItem.js';
import { addToCart } from '../../Store/Actions/cartActions.js';

class PioneerMenuCard extends Component{
	constructor(props){
		super(props);
		
		const { menuItems } = this.props;
		let isLoaded = ( menuItems.length !== 0 ) ? true : false;
		
		this.state = {
			isLoaded,
			error: null,
			menuItems,
			grid: []
		}
	}
	
	componentDidMount(){
		const { menuItems } = this.state;
		const { addToCart } = this.props;
		
		let tempGrid = [];
		let i = 1;
		let postAmount = 12;
		
		menuItems.forEach((item) => {
			let { title, thumbnailUrl, id } = item;
			
			if(i <= postAmount ){
				//console.log('grid stuff', id);
				tempGrid.push(<CardItem cardTitle={title} cardImage={thumbnailUrl} addToCart={addToCart} itemId={id} key={id} />);
				i++;
			} else{
				return
			}
		});
		
		this.setState({
			grid: tempGrid
		});
	}
	
	render(){
		const { grid } = this.state;
		const finalGrid = ( grid.length === 0 ) ? <h1>Nothing to show</h1> : grid;
		
		return finalGrid
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (id, title) => dispatch(addToCart(id, title))
	}
}



export default connect(null,mapDispatchToProps)(PioneerMenuCard)
