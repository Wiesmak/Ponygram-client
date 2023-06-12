import {useState} from "react"
import {LuFileUp} from "react-icons/lu"
import imagesBloc from "../bloc/ImagesBloc"

interface UploadPanelProps {
	toggle: () => void
}

const UploadPanel = ({toggle, ...props}: UploadPanelProps) => {
	const [tags, setTags] = useState("")
	const [album, setAlbum] = useState("")
	const [file, setFile] = useState<File | null>(null)

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
		if (file) imagesBloc.uploadImage(file, tags, album)
		setFile(null)
		setTags("")
		document.querySelector<HTMLInputElement>("#tags").value = ""
		setAlbum("")
		document.querySelector<HTMLInputElement>("#album").value = ""
		toggle()
	}

	return (
		<div>
			<form className="flex flex-col items-center w-full h-full p-8 mt-4" onSubmit={handleUpload}>
				<label htmlFor="file" className="cursor-pointer">
					<div className="rounded-full border-2 border-blue-300 p-8 hover:bg-blue-100 duration-300 transition-colors cursor:pointer">
						<LuFileUp color="#3b82f6" size="64px"/>
					</div>
				</label>
				<div className="my-7">
					{file && <p className="text-blue-500">{file.name.length <= 30 ? file.name : file.name.substring(0, 30) + '...'}</p>}
				</div>
				<input type="file" name="file" id="file" className="hidden" onChange={handleFileChange} accept="image/jpeg,image/png" required/>
				<input type="text" name="tags" id="tags" placeholder="#tags" required onChange={handleTagsChange} className="border border-blue-300 rounded-full w-1/5 px-4 py-2 font-celestia text-slate-600"/>
				<input type="text" name="album" id="album" placeholder="album" required onChange={handleAlbumChange} className="mt-4 border border-blue-300 rounded-full w-1/5 px-4 py-2 font-celestia text-slate-600"/>
				<input type="submit" value="Upload!" className="mt-8 bg-blue-500 rounded-full w-1/5 px-4 py-2 font-celestia text-white"/>
			</form>
		</div>
	)
}

export default UploadPanel
