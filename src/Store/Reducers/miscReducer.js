const initState = {
    misc: null
}

const miscReducer = (state = initState, action) => {
    switch(action.type){
        case 'FAV_ADDED' :
            console.log('favorite bus added');
            return {
                ...state,
                misc: null
            }
        case 'FAV_ERROR' :
            console.log('something went wrong ');
            return {
                ...state,
                miscError: 'login failed '+action.err
            }
        
        default :
            return state;
    }
}

export default miscReducer;


