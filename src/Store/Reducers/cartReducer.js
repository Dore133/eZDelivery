const initState = {
    cartError: null,
    cartItems: []
}

/* object standard
 * 
 * cartItems: [{
    id: 1,
    title: 'lorem ipsum',
    itemDesc: {
        title: 'lorem ipsum'
        quanity: 1,
        price: 20,
        url: ''
    }
}]*/

const cartReducer = (state = initState, action) => {
    let { cartItems } = state;
    switch(action.type){
        case 'ADDTOCART' :
            let { item } = action;
            let tempCartItems = [];
            
            if(item !== null || item !== ''){
                cartItems.push(item);
            }
            
            return {
                ...state,
                cartItems
            }
        case 'REMOVEFROMCART' :
            let { id } = action;
            let newCartItems = [];
            
            if(id !== null || id !== '' && cartItems.length !== 0){
                cartItems = cartItems.map((item) => {
                    if(item !== undefined && item.id !== id){
                        newCartItems.push(item);
                        return item;
                    }
                });
                
            }
            
            return {
                ...state,
                cartItems: newCartItems
            }
        default :
            return state;
    }
}

export default cartReducer;
