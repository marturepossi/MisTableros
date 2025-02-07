import { createContext, useContext, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
const SessionContext = createContext()   
function useSession(){
    return useContext(SessionContext)
}

function useToken(){
    const { token } = useSession()
    return token
}

function useLogout(){
    const { onLogout } = useSession()
    return onLogout
}

function useLogin(){
    const { onLogin } = useSession()
    return onLogin
}

function SessionProvider({children}){
    const [token, setToken] = useState(localStorage.getItem("token"))

    const navigate = useNavigate()

    const onLogin = useCallback((jwt) => {
        localStorage.setItem("token", jwt)
        setToken(jwt)
        navigate("/")
    }, [navigate] )

    const onLogout = useCallback(() => {
        localStorage.clear()
        setToken(null)
        navigate("/login")
    }, [navigate])

    return (
        <SessionContext.Provider value={{ token, onLogin, onLogout }}>
            {children}
        </SessionContext.Provider>
    )
}

export { SessionContext, SessionProvider, useSession, useToken, useLogout, useLogin }