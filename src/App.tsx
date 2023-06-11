import React, {useEffect} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AuthBloc from "./bloc/AuthBloc"
import {Toaster} from "react-hot-toast"

const App: React.FC = () => {
    useEffect(() => {
        const authBloc = new AuthBloc()

        const subscription = authBloc.logged.subscribe((loggedIn) => {
          if (!loggedIn && window.location.pathname !== "/login") {
            window.location.href = "/login"
          }
        })

        return () => subscription.unsubscribe()
    }, [])


    return (
        <>
            <Toaster/>
            <BrowserRouter>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
