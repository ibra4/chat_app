const user = {
    user: null,
    loggedIn: false
}

const UserReducer = (state = user, { type, payload }) => {
    switch (type) {
        case 'SET_USER':
            return { user: payload, loggedIn: true }
        default:
            return state
    }
}

export default UserReducer