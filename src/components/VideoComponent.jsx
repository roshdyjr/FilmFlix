import React from 'react'

const VideoComponent = ({ id, small, title }) => {
    return (
        <iframe width={"100%"} height={small ? "150" : "500"} src={`https://www.youtube.com/embed/${id}`} title={title} allowFullScreen></iframe>
    )
}

export default VideoComponent