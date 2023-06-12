import {useEffect, useState} from "react"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import imagesBloc from "./bloc/ImagesBloc"
import ApplicationConfig from "../ApplicationConfig"
import {HiCloudArrowUp} from "react-icons/hi2"
import ProfilePanel from "./components/ProfilePanel/ProfilePanel"
import ImageCard from "./components/ImageCard"
import NotFoundImage from "../assets/1313746.png"
import UploadPanel from "./components/UploadPanel"
import NoAvatarImage from "../assets/no_avatar.png"
import profilePanelBloc from "./components/ProfilePanel/bloc/ProfilePanelBloc"
import filtersPanelBloc from "./components/ProfilePanel/bloc/FiltersPanelBloc"
import FilterDrawer from "./components/ProfilePanel/components/FilterDrawer"

const HomePage = () => {
	const [openPanel, setOpenPanel] = useState(false)
	const [openUpload, setOpenUpload] = useState(false)
	const [openFilters, setOpenFilters] = useState(false)
	const togglePanel = () => setOpenPanel(!openPanel)
	const toggleUpload = () => setOpenUpload(!openUpload)
	const toggleFilters = () => {
		filtersPanelBloc.open = !openFilters
		setOpenFilters(!openFilters)
	}

	const [pfpUrl, setPfpUrl] = useState<string>("")

	const [images, setImages] = useState([])
	const [imageRefs, setImageRefs] = useState([])

	useEffect(() => {
		const imagesSubscription = imagesBloc.images.asObservable().subscribe(async (imgs) => {
			console.table(imgs)
			let keyCounter = 0
			setImages([])
			setImageRefs([])
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
						<ImageCard url={url} key={keyCounter} imageRef={image} />
					)])
					keyCounter++
				}
			}
		})

		return () => imagesSubscription.unsubscribe()
	}, [])

	useEffect(() => {
		const profilePanelBlocSubscription = profilePanelBloc.pfp.asObservable().subscribe((name) => {
			setPfpUrl(name)
		})
		profilePanelBloc.load()
		return () => profilePanelBlocSubscription.unsubscribe()
	}, [])

	useEffect(() => {
		const filtersPanelBlocSubscription = filtersPanelBloc.open.asObservable().subscribe((filters) => {
			setOpenFilters(filters)
		})

		return () => filtersPanelBlocSubscription.unsubscribe()
	}, [])


	return (
		<>
			<div className="w-full h-full bg-gray-100 overflow-hidden z-50 absolute t-0 l-0">
				<div className="pt-6 pb-6 px-8 shadow-md bg-white flex flex-row items-center justify-between">
					<h1 className="text-4xl text-center font-celestia mx-auto pb-2">Ponygram</h1>
					<div className="right-1">
						<img onClick={togglePanel} className="w-12 h-12 rounded-full object-scale-down" src={pfpUrl || NoAvatarImage} alt="Profile picture"/>
					</div>
				</div>

				<div className="mx-auto w-5/8 h-full mt-4">
					<div className="flex flex-col gap-8 h-full px-8 items-center overflow-scroll">
						{
							images.map((imageComponent) => {
								return imageComponent
							})
						}
						{
							images.length === 0 && (
								<div className="mt-24">
									<img src={NotFoundImage} alt="Picture" style={{height: "35vh"}}/>
									<h1 className="text-2xl text-center font-celestia">No images found!</h1>
								</div>
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
					<UploadPanel toggle={toggleUpload}/>
				</Drawer>
				<Drawer open={openFilters} direction={"left"} onClose={toggleFilters} size="20vw" className="rounded-l-lg w-1/5">
					<FilterDrawer />
				</Drawer>
			</div>
		</>
	)
}

export default HomePage
