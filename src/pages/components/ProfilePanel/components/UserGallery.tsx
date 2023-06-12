import {useEffect, useState} from "react"
import imagesBloc from "../../../bloc/ImagesBloc.ts"
import ApplicationConfig from "../../../../ApplicationConfig.ts"

const UserGallery = (props) => {
	const {userId} = props
	const [imageRefs, setImageRefs] = useState<any[]>([])
	const [images, setImages] = useState<string[]>([])

	useEffect(() => {
		const imageBlocSubscription = imagesBloc.images.asObservable().subscribe((imgs) => {
			imgs.forEach((img) => {
				(img.author === userId) && setImageRefs(prevImageRefs => [...prevImageRefs, img])
				let ext = img.url.split(".").pop()
				if (ext === "jpg") ext = "jpeg"
				fetch(`${ApplicationConfig.API_URL}/files/get/${img.id}`, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Accept": `image/${ext}`
					}
				}).then((res) => {
					if (res.ok) {
						res.blob().then((blob) => {
							const url = URL.createObjectURL(blob)
							setImages(prevImages => [...prevImages, url])
						})
					}
				}).catch((err) => {
					console.error(err)
				})
			})
			console.log(imageRefs)
		})

		return () => {
			imageBlocSubscription.unsubscribe()
		}
	}, [])


	return (
		<div className="grid grid-cols-3 gap-1 p-2 overflow-y-scroll mt-[3vh]">
			{
				images.map((image, index) => {
					return (
						<div key={index} className="relative">
							<img onClick={
								() => window.open(image, "_blank")
							} className="aspect-w-1 aspect-h-1 object-cover" src={image} alt="User gallery image"/>
						</div>
					)
				})
			}
		</div>
	)
}

export default UserGallery
