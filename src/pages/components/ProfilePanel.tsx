import {FiEdit3} from "react-icons/fi"

const ProfilePanel = () => {
	return (
		<div className="flex flex-col items-center w-full h-full p-8">
			<img src="https://derpicdn.net/img/view/2023/6/6/3138262.jpg" alt="Profile Picture" className="w-24 h-24 rounded-full object-scale-down mb-6"/>
			<div className="flex flex-row items-baseline justify-center gap-3">
				<p className="text-xl font-bold text-center text-grey-900">@Twilight Sparkle</p>
				<FiEdit3/>
			</div>

		</div>
	)
}

export default ProfilePanel
