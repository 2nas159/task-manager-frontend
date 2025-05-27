import React from 'react'
import { LuUpload, LuUser, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = React.useRef(null)
    const [preview, setPreview] = React.useState(null)

    const handleRemoveImage = () => {
        setImage(null)
        setPreview(null)
    }

    const onChooseFile = () => {
        inputRef.current.click()
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // update the image state
            setImage(file)

            // generate a preview URL from the file
            const previewUrl = URL.createObjectURL(file)
            setPreview(previewUrl)
        }
    }


    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                    <LuUser className="text-4xl text-blue-500" />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Profile photo"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector;
