import {FormEventHandler, useEffect, useRef, useState} from "react"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import imagesBloc from "./bloc/ImagesBloc"
import ApplicationConfig from "../ApplicationConfig"
import {HiCloudArrowUp} from "react-icons/hi2"
import {LuFileUp} from "react-icons/lu"
import ProfilePanel from "./components/ProfilePanel"
import ImageCard from "./components/ImageCard"
import NotFoundImage from "../assets/1313746.png"

const HomePage = () => {
	const [openPanel, setOpenPanel] = useState(false)
	const [openUpload, setOpenUpload] = useState(false)
	const togglePanel = () => setOpenPanel(!openPanel)
	const toggleUpload = () => setOpenUpload(!openUpload)

	const [images, setImages] = useState([])
	const [imageRefs, setImageRefs] = useState([])

	const [tags, setTags] = useState("")
	const [album, setAlbum] = useState("")
	const [file, setFile] = useState<File | null>(null)

	useEffect(() => {
		const imagesSubscription = imagesBloc.images.asObservable().subscribe(async (imgs) => {
			console.table(imgs)
			let keyCounter = 0
			for (const image of imgs) {
				setImageRefs(prevImageRefs => [...prevImageRefs, image])
				const ext = image.url.split(".").pop()
				const res = await fetch(`${ApplicationConfig.API_URL}/files/get/${image.id}`, {
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("token")}`,
						"Accept": `image/${ext}`
					}
				})
				if (res.ok) {
					const blob = await res.blob()
					const url = URL.createObjectURL(blob)
					setImages(prevImages => [...prevImages, (
						<ImageCard url={url} key={keyCounter} />
					)])
					keyCounter++
				}
			}
		})

		return () => imagesSubscription.unsubscribe()
	}, [])


	const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTags(event.target.value)
	}

	const handleAlbumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAlbum(event.target.value)
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			setFile(files[0])
		}
	}

	const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (file) {
			imagesBloc.uploadImage(file, tags, album)
		}
	}

	return (
		<>
			<div className="w-full h-full bg-gray-100 overflow-hidden z-50 absolute t-0 l-0">
				<div className="pt-6 pb-6 px-8 shadow-md bg-white flex flex-row items-center justify-between">
					<h1 className="text-4xl text-center font-celestia mx-auto pb-2">Ponygram</h1>
					<div className="right-1">
						<img onClick={togglePanel} className="w-12 h-12 rounded-full object-scale-down" src="https://derpicdn.net/img/view/2023/6/6/3138262.jpg" alt="Profile picture"/>
					</div>
				</div>

				<div className="mx-auto w-5/8 h-full mt-4">
					<div className="flex flex-col gap-8 h-full px-8 items-center overflow-scroll">
						{
							images.map((imageComponent, index) => {
								return imageComponent
							})
						}
						{
							images.length === 0 && (
								<img src={NotFoundImage} alt="Picture" style={{height: "35vh"}}/>
							)
						}
					</div>
				</div>
				<div onClick={toggleUpload} className="fixed bottom-4 right-10 m-4 w-14 h-14 rounded-full bg-blue-500 text-white text-2xl font-bold shadow-md flex flex-col items-center justify-center active:bg-blue-700 transition-colors transition-75">
					<HiCloudArrowUp/>
				</div>
				<Drawer open={openPanel} direction="right" onClose={togglePanel} size="20vw" className="rounded-l-lg w-1/5">
					<ProfilePanel />
				</Drawer>
				<Drawer open={openUpload} direction={"bottom"} onClose={toggleUpload} size="60vh" className="rounded-t-lg w-full">
					<div>
						<form className="flex flex-col items-center w-full h-full p-8 mt-4" onSubmit={handleUpload}>
							<label htmlFor="file" className="cursor:pointer">
								<div className="rounded-full border-2 border-blue-300 p-8 hover:bg-blue-100 duration-300 transition-colors cursor:pointer">
									<LuFileUp color="#3b82f6" size="64px"/>
								</div>
							</label>
							<input type="file" name="file" id="file" className="hidden" onChange={handleFileChange} required/>
							<input type="text" name="tags" id="tags" placeholder="#tags" required onChange={handleTagsChange} className="mt-14 border border-blue-300 rounded-full w-1/5 px-4 py-2 font-celestia text-slate-600"/>
							<input type="text" name="album" id="album" placeholder="album" required onChange={handleAlbumChange} className="mt-4 border border-blue-300 rounded-full w-1/5 px-4 py-2 font-celestia text-slate-600"/>
							<input type="submit" value="Upload!" className="mt-8 bg-blue-500 rounded-full w-1/5 px-4 py-2 font-celestia text-white"/>
						</form>
					</div>
				</Drawer>
			</div>
		</>
	)
}

export default HomePage
