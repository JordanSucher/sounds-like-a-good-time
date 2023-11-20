import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const FromFile = () => {
    let [error, setError] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);

    const saveActivity = async (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];

        if (file) {
            // Check if the file is a video
            if (file.type.startsWith('video/')) {
                // Create a URL for the video file
                const url = URL.createObjectURL(file);
                setVideoUrl(url);
                setError('');
                localStorage.setItem('videoUrl', url);

            } else {
                setError('Please upload a valid video file.');
                setVideoUrl(null);
            }
        }
    }

    return (
        <div className="custom-activities">
            <h1>Play synth on top of any video.</h1>
            <p></p>
            <form onSubmit={saveActivity}>
                <label>
                    URL:
                    <input type="file" name="file" />
                </label>
                {error && <p style={{color: 'red', fontSize: '10px'}}>{error}</p>}
                <input className="submit" type="submit" value="Submit" />
            </form>
            
            {videoUrl && 
                <Link to={{
                    pathname: '/visualize',
                    state: {
                        url: videoUrl
                    }
                }}>
                    Play Video
                </Link>
            }

        </div>
    )
}

export default FromFile