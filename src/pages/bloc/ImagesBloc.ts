import {BehaviorSubject} from "rxjs"
import ApplicationConfig from "../../ApplicationConfig"
import toast from "react-hot-toast"

export class ImagesBloc {
    private readonly _images: BehaviorSubject<string[]>

    constructor() {
        this._images = new BehaviorSubject([])
        this.fetchImages()
    }

    private fetchImages(): void {
        fetch(`${ApplicationConfig.API_URL}/api/images`, {
              method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
        }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this._images.next(data)
                    })
                }
            })
    }

    public uploadImage(file: File, tags: string, album: string): void {
        const promise = new Promise((resolve, reject) => {
            const tagsArray = tags.split(' ')
            const tagObjects = tagsArray.map(tag => {
                return {name: tag}
            })
            const filename = file.name
            const mimeType = file.type

            fetch(`${ApplicationConfig.API_URL}/api/images`, {
                method: 'POST',
                body: JSON.stringify({originalName: filename, album}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                if (response.ok) {
                    tagObjects.forEach(tag => {
                        fetch(`${ApplicationConfig.API_URL}/api/tags`, {
                            method: 'POST',
                            body: JSON.stringify(tag),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                    })
                    response.json().then(data => {
                        const id = data.message.split(' ').at(-1)
                        const extension = filename.split('.').at(-1)
                        fetch(`${ApplicationConfig.API_URL}/files/upload`, {
                            method: 'POST',
                            body: file,
                            headers: {
                                'Content-Type': mimeType,
                                'Content-Disposition': `attachment; filename="${id}.${extension}"`,
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        }).then(response => {
                            if (response.ok) {
                                fetch(`${ApplicationConfig.API_URL}/api/photos/tags/${id}`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({tags: tagObjects}),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                }).then(response => {
                                    if (response.ok) {
                                        this.fetchImages()
                                        resolve()
                                    }
                                })
                            } else reject(response)
                        }).catch((e) => reject(e))
                    }).catch((e) => reject(e))
                } else reject(response)
            }).catch((e) => reject(e))
        })
        toast.promise(promise,  {
            loading: 'Uploading...',
            success: 'Image uploaded!',
            error: 'Error uploading image'
        })
    }

    get images(): BehaviorSubject<any[]> {
        return this._images
    }

    set images(value: string[]) {
        this._images.next(value)
    }

    public refresh(): void {
        this.fetchImages()
    }
}

export default new ImagesBloc()
