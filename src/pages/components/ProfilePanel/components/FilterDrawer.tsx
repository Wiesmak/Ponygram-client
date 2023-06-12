import {FaMagic} from "react-icons/fa"
import {useState} from "react"
import filtersPanelBloc from "../bloc/FiltersPanelBloc"

enum FilterType {
	ROTATE = "rotate",
	RESIZE = "resize",
	GRAYSCALE = "grayscale",
	BLUR = "blur",
	SHARPEN = "sharpen",
	REFORMAT = "reformat",
	CROP = "crop",
	FLIP = "flip",
	NEGATE = "negate",
	TINT = "tint"
}

const FilterDrawer = () => {
	const [filterType, setFilterType] = useState<FilterType>(FilterType.ROTATE)

	const [options, setOptions] = useState<any>({})

	const handleOptionChange = (event) => {
		const value: string = (event.target).value
		setFilterType(value as FilterType)
	}

	const handleApply = () => {
		console.log(filterType, options)
		filtersPanelBloc.options = options
		filtersPanelBloc.filter = filterType
		filtersPanelBloc.apply()
	}

	const renderOptions = () => {
		switch (filterType) {
			case FilterType.ROTATE:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								degrees: event.target.value
							})
						} min="0" max="360" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">rotation: {options.degrees} deg</p>
					</>
				)
			case FilterType.RESIZE:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								width: event.target.value,
								height: options.height ?? 0
							})
						} min="100" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">width: {options.width}px</p>
						<input onChange={
							(event) => setOptions({
								width: options.width ?? 0,
								height: event.target.value
							})
						} min="100" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">height: {options.height}px</p>
					</>
				)
			case FilterType.BLUR:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								stigma: event.target.value
							})
						} min="0.5" max="10" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">sigma: {options.stigma}</p>
					</>
				)
			case FilterType.SHARPEN:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								stigma: event.target.value
							})
						} min="0.5" max="10" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">sigma: {options.stigma}</p>
					</>
				)
			case FilterType.REFORMAT:
				return (
					<>
						<select onChange={
							(event) => setOptions({
								format: event.target.value
							})
						} className="w-full h-full rounded-full text-center">
							<option value="png">PNG</option>
							<option value="jpg">JPG</option>
						</select>
					</>
				)
			case FilterType.CROP:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								width: event.target.value,
								height: options.height ?? 0,
								left: options.left ?? 0,
								top: options.top ?? 0
							})
						} min="0" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">width: {options.width}</p>
						<input onChange={
							(event) => setOptions({
								width: options.width ?? 0,
								height: event.target.value,
								left: options.left ?? 0,
								top: options.top ?? 0
							})
						} min="0" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">height: {options.height}</p>
						<input onChange={
							(event) => setOptions({
								width: options.width ?? 0,
								height: options.height ?? 0,
								left: event.target.value,
								top: options.top ?? 0
							})
						} min="0" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">left: {options.left}</p>
						<input onChange={
							(event) => setOptions({
								width: options.width ?? 0,
								height: options.height ?? 0,
								left: options.left ?? 0,
								top: event.target.value
							})
						} min="0" max="1000" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">top: {options.top}</p>
					</>
				)
			case FilterType.FLIP:
				return (
					<>
						<select onChange={
							(event) => setOptions({
								vertical: event.target.value === "vertical",
								horizontal: event.target.value === "horizontal"
							})
						} className="w-full h-full rounded-full text-center">
							<option value="horizontal">Horizontal</option>
							<option value="vertical">Vertical</option>
						</select>
					</>
				)
			case FilterType.TINT:
				return (
					<>
						<input onChange={
							(event) => setOptions({
								red: event.target.value,
								green: options.green ?? 0,
								blue: options.blue ?? 0
							})
						} min="0" max="255" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">red: {options.red}</p>
						<input onChange={
							(event) => setOptions({
								red: options.red ?? 0,
								green: event.target.value,
								blue: options.blue ?? 0
							})
						} min="0" max="255" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">green: {options.green}</p>
						<input onChange={
							(event) => setOptions({
								red: options.red ?? 0,
								green: options.green ?? 0,
								blue: event.target.value
							})
						} min="0" max="255" type="range" className="w-full h-full rounded-full" style={{
							background: "linear-gradient(to right, #000000, #ffffff)",
						}} />
						<p className="text-center">blue: {options.blue}</p>
					</>
				)
			default:
				return (
					<p></p>
				)
		}
	}

	return (
		<div className="flex flex-col items-center w-full h-full p-8">
			<div onClick={handleApply} className="w-24 h-24 p-6 rounded-full object-scale-down mb-6 border-2 border-black rounded-full flex flex-col items-center justify-center cursor-pointer">
				<FaMagic size="48" />
			</div>
			<select onChange={handleOptionChange} className="w-full h-12 my-6 border-2 border-black rounded-full text-center">
				<option value="rotate">Rotate</option>
				<option value="resize">Resize</option>
				<option value="grayscale">Grayscale</option>
				<option value="blur">Blur</option>
				<option value="sharpen">Sharpen</option>
				<option value="reformat">Reformat</option>
				<option value="crop">Crop</option>
				<option value="flip">Flip</option>
				<option value="negate">Negate</option>
				<option value="tint">Tint</option>
			</select>
			<div className="w-full h-12 my-3 text-center">
				{renderOptions()}
			</div>
		</div>
	)
}

export default FilterDrawer
