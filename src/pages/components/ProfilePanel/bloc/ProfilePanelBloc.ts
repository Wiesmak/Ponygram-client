import {BehaviorSubject} from "rxjs"
import ApplicationConfig from "../../../../ApplicationConfig"
import toast from "react-hot-toast"

export class ProfilePanelBloc {
    private readonly _pfp: BehaviorSubject<string>
    private readonly _email: BehaviorSubject<string>
    private readonly _username: BehaviorSubject<string>
    private readonly _id: BehaviorSubject<string>

    constructor() {
        this._pfp = new BehaviorSubject('')
        this._email = new BehaviorSubject('')
        this._username = new BehaviorSubject('')
        this._id = new BehaviorSubject('')
    }

    get pfp(): BehaviorSubject<string> {
        return this._pfp
    }

    get username(): BehaviorSubject<string> {
        return this._username
    }

    get email(): BehaviorSubject<string> {
        return this._email
    }

    get id(): BehaviorSubject<string> {
        return this._id
    }

    set pfp(value: string) {
        this._pfp.next(value)
    }

    set username(value: string) {
        this._username.next(value)
    }

    set email(value: string) {
        this._email.next(value)
    }

    set id(value: string) {
        this._id.next(value)
    }

    async load(): Promise<void> {
        const user = await fetch(`${ApplicationConfig.API_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (user.ok) {
            const data = await user.json()
            this.username = data.username
            this.email = data.email
            this.id = data.id
            const pfp = await fetch(`${ApplicationConfig.API_URL}/api/picture`, {
                method: 'GET',
                headers: {
                    'Accept': 'image/*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (pfp.ok) {
                const blob = await pfp.blob()
                this.pfp = URL.createObjectURL(blob)
            }
        }
    }

    async save(): Promise<void> {
        const username = this.username.getValue()
        const email = this.email.getValue()
        const promise = new Promise<void>((resolve, reject) => {
            fetch(`${ApplicationConfig.API_URL}/api/profile`, {
                method: 'PATCH',
                body: JSON.stringify({username, email}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response =>  response.ok ? resolve() : reject()).catch(err => reject(err))
        })
        await toast.promise(promise, {
            loading: 'Saving...',
            success: 'Saved!',
            error: 'Error!'
        })
    }

    async changePfp(file: File): Promise<void> {
        const filename = file.name
        const mimeType = file.type
        const extension = filename.split('.').at(-1)
        const promise = new Promise<void>((resolve, reject) => {
            fetch(`${ApplicationConfig.API_URL}/api/profile`, {
                method: 'POST',
                body: file,
                headers: {
                    'Content-Type': mimeType,
                    'Content-Disposition': `attachment; filename="${this.id.getValue()}.${extension}"`,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => response.ok ? resolve() : reject()).catch(err => reject(err))
        })
        await toast.promise(promise, {
            loading: 'Uploading...',
            success: 'Upload complete!',
            error: 'Error uploading image'
        })
        await this.load()
    }
}

const profilePanelBloc = new ProfilePanelBloc()
export default profilePanelBloc
