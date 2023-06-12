import {FiCheck, FiEdit3} from "react-icons/fi"
import {useState} from "react"
import toast from "react-hot-toast"

interface TextEditProps {
	text: string
	saveText: (text: string) => void
	size?: 'big' | 'small'
}

const TextEdit = ({text, saveText, size = 'big', ...props}: TextEditProps) => {
	const [mode, setMode] = useState<'view' | 'edit'>('view')
	const [value, setValue] = useState<string>(text)

	const switchMode = () => setMode(mode === 'view' ? 'edit' : 'view')

	const handleChange = (event) => setValue(event.target.value)

	const handleSave = () => {
		switchMode()
		saveText(value)
	}

	const copyToClipboard = async () => {
		await toast.promise(navigator.clipboard.writeText(value), {
			loading: 'Copying to clipboard...',
			success: 'Copied to clipboard!',
			error: 'Failed to copy to clipboard!'
		})
	}

	return (
		<div className={`flex flex-row items-baseline justify-center gap-3${size === 'big' ? ' mb-2' : ''}`}>
			{
				mode === 'view'
					? <p className={`select-none text-center text-grey-900${size === 'big' ? ' text-xl font-bold' : ''}`} onClick={copyToClipboard}>
						{size === "big" ? `@${text}` : text}
					  </p>
					: <input type="text" className={`text-center text-grey-900${size === 'big' ? ' text-xl font-bold' : ''}`} defaultValue={text} onChange={handleChange}/>
			}
			{
				mode === 'view'
					? size === 'big'
						? <FiEdit3 className="cursor-pointer" onClick={switchMode}/>
						: <FiEdit3 size="12px" className="cursor-pointer" onClick={switchMode}/>
					: size === 'big'
						? <FiCheck className="cursor-pointer" onClick={handleSave}/>
						: <FiCheck size="12px" className="cursor-pointer" onClick={handleSave}/>
			}
		</div>
	)
}

export default TextEdit
