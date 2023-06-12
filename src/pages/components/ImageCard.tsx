import {useEffect, useRef, useState} from "react"
import ApplicationConfig from "../../ApplicationConfig.ts"
import {FaMagic} from "react-icons/fa"
import filtersPanelBloc from "./ProfilePanel/bloc/FiltersPanelBloc"

interface ImageCardProps {
    url: string
    key: number
    imageRef: any
}

const ImageCard = ({url, key, imageRef, ...props}: ImageCardProps) => {
    const [hover, setHover] = useState(false)
    const [author, setAuthor] = useState("")
    const [openFilters, setOpenFilters] = useState(false)

    const toggleFilters = () => {
        filtersPanelBloc.open = !openFilters
        setOpenFilters(!openFilters)
    }

    const handleOpen = () => {
        filtersPanelBloc.image = imageRef.id
        toggleFilters()
    }

    useEffect(() => {
        fetch(`${ApplicationConfig.API_URL}/user/info/${imageRef.author}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    setAuthor(data.username)
                })
            } else {
                setAuthor("")
            }
        }).catch(err => {
            setAuthor("")
        })
    }, [])

    useEffect(() => {
        const filtersPanelBlocSubscription = filtersPanelBloc.open.asObservable().subscribe((filters) => {
            setOpenFilters(filters)
        })

        return () => filtersPanelBlocSubscription.unsubscribe()
    }, [])


    const switchHover = () => setHover(!hover)

    // noinspection TypeScriptValidateJSTypes
    return (
        <div className="shadow-md rounded-lg h-[80vh] bg-white sticky top-4 transition-opacity duration-500 last:mb-[16vh]" key={key} onMouseEnter={switchHover} onMouseLeave={switchHover}>
            <img src={url} alt="Picture" className="h-[80vh] object-cover rounded-md shadow-inset"/>
            <div className={`transition-opacty duration-200 absolute top-0 left-0 w-full h-8 bg-black bg-opacity-50 flex flex-row items-center justify-around ${hover ? "opacity-100" : "opacity-0"}`}>
                {
                    <>
                        <div className="text-white text-sm px-2 py-1 rounded-md m-1">
                            {'@' + author || imageRef.author}
                        </div>
                        <div className="text-white text-sm px-2 py-1 rounded-md m-1">
                            {imageRef.album}
                        </div>
                    </>
                }
            </div>
            <div className={`transition-opacty duration-200 absolute bottom-0 left-0 w-full h-8 bg-black bg-opacity-50 flex flex-col items-center justify-center ${hover ? "opacity-100" : "opacity-0"}`}>
                <div className="flex flex-row justify-center items-center flex-nowrap">
                    {
                        imageRef.tags.map((tag: string, index: number) => {
                            return (
                                <div key={index} className="text-white text-sm px-2 py-1 rounded-md m-1">
                                    {tag.name}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button onClick={handleOpen} className={`transition-opacty duration-200 absolute bottom-12 right-4 w-8 h-8 rounded-full bg-white bg-opacity-50 flex flex-row items-center justify-center ${hover ? "opacity-100" : "opacity-0"}`}>
                <FaMagic />
            </button>
        </div>
    )
}

export default ImageCard
