const initialState = {
    page: "/",
    signIn: 'block',
    signOut: 'none'
}

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE':
            let signIn;
            let signOut;
            if (action.page === 'admin-panel' || action.page === 'user-panel') {
                signIn = 'block';
                signOut = 'none';
            } else {
                signIn = 'none';
                signOut = 'block';
            }
            return {
                page: action.page,
                signIn: signIn,
                signOut: signOut
            }
        default: return state
    }
}