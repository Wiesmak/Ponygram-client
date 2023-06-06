import {BehaviorSubject, Observable} from "rxjs"

export default class AuthBloc {
    private readonly _logged: BehaviorSubject<boolean>
    constructor() {
        this._logged = new BehaviorSubject(false)
        this.checkLogin()
    }

    private checkLogin(): void {
        const token = localStorage.getItem('token')
        if (token) {
            return this._logged.next(true)
        } else {
            return this._logged.next(false)
        }
    }

    get logged(): Observable<boolean> {
        return this._logged.asObservable()
    }

    set logged(value: boolean) {
        this._logged.next(value)
    }
}
