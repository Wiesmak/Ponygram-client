import {useEffect, useRef, useState} from "react"
import LoginBloc from "../bloc/LoginBloc"
import loginBloc from "../bloc/LoginBloc"

const LoginPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [username, setUsername] = useState("")

	const [mode, setMode] = useState<"login" | "register">("login")

	useEffect(() => {

		const loginSubscription = loginBloc.isLoggedIn().subscribe((loggedIn) => {
			if (loggedIn) {
				console.log("token: " + loginBloc.token)
				window.location.href = "/"
			} else {
				setError("Wrong email or password")
			}
		})

		return () => loginSubscription.unsubscribe()
	}, [])

	useEffect(() => {
		const modeSubscription = loginBloc.mode.subscribe((mode) => {
			if (mode === "register") {
				setMode("register")
			} else {
				setMode("login")
			}
		})

		return () => modeSubscription.unsubscribe()
	}, [])


	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError("")
		if (mode === "login") {
			loginBloc.login(email, password)
		} else {
			loginBloc.register(email, password, username)
		}
	}

	const switchMode = () => {
		loginBloc.switchMode()
	}

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}

	return (
		<>
			<div className="w-full h-full bg-cover font-celestia" style={{backgroundImage: "url(https://derpicdn.net/img/view/2018/11/20/1886618.jpg)"}}>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="flex flex-row justify-center items-center h-full gap-24">
						<div className="absolute inset-0 bg-black opacity-50 z-0"></div>
						<div className="flex flex-col justify-center items-center z-10">
							<img src="https://derpicdn.net/img/view/2021/4/12/2591981.png" className="w-72" alt="Pony with phone"/>
						</div>
						<div className="flex flex-col justify-center items-center z-10">
							<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
								<h1 className="text-6xl font-bold font-equestria text-amber-200 pt-6">Ponygram</h1>
								<p className="text-xl font-bold text-cyan-200 mb-6">{mode === 'register' ? 'Register' : 'Login'}</p>
								{mode === 'register' && (<input onChange={handleUsernameChange} type="text" placeholder="Username" required className="border-2 border-black rounded-md p-2 m-2" />)}
								<input onChange={handleEmailChange} type="email" placeholder="E-mail" required className="border-2 border-black rounded-md p-2 m-2" />
								<input onChange={handlePasswordChange} type="password" placeholder="Password" required className="border-2 border-black rounded-md p-2 m-2"/>
								<div className="flex flex-row gap-2">
									<button className="border-2 border-black rounded-md p-2 m-2 bg-white" type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
									<button onClick={switchMode} className="border-2 border-black rounded-md p-2 m-2 bg-white" type="button">{mode === 'register' ? 'Login' : 'Register'}</button>
								</div>

							</form>
							{error && <p className="text-red-500">{error}</p>}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default LoginPage
