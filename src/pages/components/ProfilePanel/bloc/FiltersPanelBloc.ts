import {BehaviorSubject} from "rxjs"
import ApplicationConfig from "../../../../ApplicationConfig"
import toast from "react-hot-toast"
import imagesBloc from "../../../bloc/ImagesBloc"

export class FiltersPanelBloc {
    private readonly _open: BehaviorSubject<boolean>
    private readonly _image: BehaviorSubject<string>
    private readonly _options: BehaviorSubject<object>
    private readonly _filter: BehaviorSubject<string>

    constructor() {
        this._open = new BehaviorSubject(false)
        this._image = new BehaviorSubject('')
        this._options = new BehaviorSubject({})
        this._filter = new BehaviorSubject('')
    }

    get open(): BehaviorSubject<boolean> {
        return this._open
    }

    set open(value: boolean) {
        this._open.next(value)
    }

    get image(): BehaviorSubject<string> {
        return this._image
    }

    set image(value: string) {
        this._image.next(value)
    }

    get options(): BehaviorSubject<object> {
        return this._options
    }

    set options(value: object) {
        this._options.next(value)
    }

    get filter(): BehaviorSubject<string> {
        return this._filter
    }

    set filter(value: string) {
        this._filter.next(value)
    }

    public apply(): void {
        if (!(this._filter && this.options)) return

        const filter = this.filter.getValue()
        const options = this.options.getValue()

        const body = {
            filter: filter,
            options: options
        }

        const promise = new Promise((resolve, reject) => {
            fetch(`${ApplicationConfig.API_URL}/api/images/${this.image.getValue()}`, {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                if (response.ok) {
                    this.open = false
                    imagesBloc.refresh()
                    resolve()
                }
            }).catch(err => {
                reject(err)
            })
        })

        toast.promise(promise, {
            loading: 'Applying filter...',
            success: 'Filter applied!',
            error: 'Failed to apply filter'
        })
    }
}

const filtersPanelBloc = new FiltersPanelBloc()
export default filtersPanelBloc
