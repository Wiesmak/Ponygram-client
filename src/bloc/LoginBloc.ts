import {BehaviorSubject, Observable} from "rxjs"
import ApplicationConfig from "../ApplicationConfig"

export class LoginBloc {
    private readonly _loginSubject: BehaviorSubject<boolean>
    private readonly _modeSubject: BehaviorSubject<string>

    constructor() {
        this._loginSubject = new BehaviorSubject(false)
        this._modeSubject = new BehaviorSubject('login')
    }

    login(email: string, password: string): void {
        fetch(`${ApplicationConfig.API_URL}/user/login`, {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    localStorage.setItem('token', data.token)
                    this.loginSubject = true
                })
            } else {
                this.loginSubject = false
            }
        }).catch(err => {
            console.error(err)
            this.loginSubject = false
        })
    }

    register(email: string, password: string, username: string): void {
        fetch(`${ApplicationConfig.API_URL}/user/register`, {
            method: 'POST',
            body: JSON.stringify({email, password, username}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                this.switchMode()
                this.login(email, password)
            } else {
                this.loginSubject = false
            }
        })
    }

    isLoggedIn(): Observable<boolean> {
        return this._loginSubject.asObservable()
    }

    get loginSubject(): BehaviorSubject<boolean> {
        return this._loginSubject
    }

    set loginSubject(value: boolean) {
        this._loginSubject.next(value)
    }

    get token(): string {
        return localStorage.getItem('token') || ''
    }

    get mode(): Observable<string> {
        return this._modeSubject.asObservable()
    }

    set mode(value: string) {
        this._modeSubject.next(value)
    }

    switchMode(): void {
        if (this._modeSubject.getValue() === 'login') {
            this.mode = 'register'
        } else {
            this.mode = 'login'
        }
    }
}

const loginBloc = new LoginBloc()
export default loginBloc
