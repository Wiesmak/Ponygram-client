import {useEffect, useRef, useState} from "react"

interface ImageCardProps {
    url: string
    key: number
}

const ImageCard = ({url, key, ...props}: ImageCardProps) => {


    return (
        <div className="shadow-md rounded-lg h-[80vh] bg-white sticky top-4 transition-opacity duration-500 last:mb-[16vh]" key={key}>
            <img src={url} alt="Picture" className="h-[80vh] object-cover rounded-md shadow-inset"/>
        </div>
    )
}

export default ImageCard
