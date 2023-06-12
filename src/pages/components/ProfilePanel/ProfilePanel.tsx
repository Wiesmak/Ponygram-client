import {useEffect, useState} from "react"
import profilePanelBloc from "./bloc/ProfilePanelBloc"
import NoAvatarImage from "../../../assets/no_avatar.png"
import TextEdit from "./components/TextEdit"
import UserGallery from "./components/UserGallery"

const ProfilePanel = () => {
	const [userName, setUserName] = useState<string>("")
	const [userEmail, setUserEmail] = useState<string>("")
	const [pfpUrl, setPfpUrl] = useState<string>("")
	const [userId, setUserId] = useState<string>("")

	const handleSaveName = async (name: string) => {
		profilePanelBloc.username = name
		await profilePanelBloc.save()
	}

	const handleSaveEmail = async (email: string) => {
		profilePanelBloc.email = email
		await profilePanelBloc.save()
	}

	const handlePfpChange = async (event) => {
		const file = event.target.files[0]
		if (file) await profilePanelBloc.changePfp(file)
	}

	const handleLogout = () => {
		localStorage.removeItem("token")
		window.location.reload()
	}

	useEffect(() => {
		const userNamesSubscription = profilePanelBloc.username.asObservable().subscribe((name) => {
			setUserName(name)
		})
		const userEmailsSubscription = profilePanelBloc.email.asObservable().subscribe((email) => {
			setUserEmail(email)
		})
		const userPfpUrlsSubscription = profilePanelBloc.pfp.asObservable().subscribe((url) => {
			setPfpUrl(url)
		})
		const userIdSubscription = profilePanelBloc.id.asObservable().subscribe((id) => {
			setUserId(id)
		})

		profilePanelBloc.load()

		return () => {
			userNamesSubscription.unsubscribe()
			userEmailsSubscription.unsubscribe()
			userPfpUrlsSubscription.unsubscribe()
			userIdSubscription.unsubscribe()
		}
	}, [])


	return (
		<div className="flex flex-col items-center w-full h-full p-8">
			<label htmlFor="pfp" className="cursor-pointer">
				<img src={pfpUrl || NoAvatarImage} alt="Profile Picture" className="w-24 h-24 rounded-full object-scale-down mb-6"/>
			</label>
			<input type="file" name="pfp" id="pfp" className="hidden" accept="image/jpeg,image/png" onChange={handlePfpChange}/>
			<TextEdit text={userName} size="big" saveText={handleSaveName}/>
			<TextEdit text={userEmail} size="small" saveText={handleSaveEmail}/>
			<button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-6">Logout</button>
			<UserGallery userId={userId}/>
		</div>
	)
}

export default ProfilePanel
