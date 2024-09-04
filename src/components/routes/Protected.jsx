import React, { useContext } from 'react'
import { AuthContext } from '../../context/authProvider'
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
    const { user, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return null;
    }
    return (
        <>
            {user ? children : <Navigate to={"/"} />}
        </>
    )
}

export default Protected