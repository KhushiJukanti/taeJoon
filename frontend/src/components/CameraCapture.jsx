import React, { useRef, useState, useCallback, useEffect } from 'react';
import DisplayResult from './DisplayResult';
import { Button, Col } from 'react-bootstrap';
import Webcam from 'react-webcam';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CameraCapture = () => {
    const webcamRef = useRef(null);
    const cropperRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [recognizedTextData, setRecognizedTextData] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cameraList, setCameraList] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    // const [aspectRatio, setAspectRatio] = useState(1);

    const handleToggleCamera = () => {
        setIsCameraOn((prev) => !prev);
        setRecognizedTextData(''); // Clear recognized text when toggling camera
    };




    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter((device) => device.kind === 'videoinput');
                setCameraList(cameras);
                setSelectedCamera(cameras.length > 0 ? cameras[0].deviceId : '');
            } catch (error) {
                console.error('Error fetching cameras:', error);
            }
        };
        fetchCameras();
    }, []);


    const capture = useCallback(() => {
        const image = webcamRef.current.getScreenshot();
        if (image) {
            setImageSrc(image);
            // calculateAspectRatio(image);
        }
    }, [webcamRef]);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const image = reader.result;
            setImageSrc(image);
            // calculateAspectRatio(image);
        };
        reader.readAsDataURL(file);
    };

    // const calculateAspectRatio = (imageSrc) => {
    //     const img = new Image();
    //     img.onload = () => {
    //         const aspectRatio = img.width / img.height;
    //         setAspectRatio(aspectRatio);

    //     };
    //     img.src = imageSrc;
    // };


    const cropImage = () => {
        if (cropperRef.current) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            const croppedImageData = croppedCanvas.toDataURL();
            setCroppedImage(croppedImageData);
            performOCR(croppedImageData);
        }
    };


    const performOCR = async (image) => {
        try {
            const response = await axios.post('http://localhost:7000/recognize/recognize-text', { image });
            console.log('OCR Response:', response.data);
            if (response.data && response.data.text) {
                setRecognizedTextData(response.data.text);
            } else {
                setRecognizedTextData('');  // Ensure it's an array
            }
        } catch (error) {
            console.error('Error recognizing text:', error);
            setRecognizedTextData('');  // Reset to empty array on error
        }
    };

    // const toggleCamera = () => {
    //     if (cameraRunning) {
    //         stopCamera();
    //     } else {
    //         startCamera();
    //     }
    // };



    return (
        <div>
            {isCameraOn && (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ deviceId: selectedCamera }}
                />
            )}
            <div style={{ marginLeft: '100px' }}>
                <Button onClick={handleToggleCamera} variant="primary">
                    {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                </Button>
                {isCameraOn && <Button style={{ marginLeft: '100px' }} variant="success" onClick={capture}>Capture</Button>}
                <input style={{ marginLeft: '150px' }} type="file" accept="image/*" onChange={uploadImage} />
            </div>
            {imageSrc && (
                <div style={{ marginLeft: '25%' }}>
                    <Cropper
                        src={imageSrc}
                        style={{ height: '50%', width: '50%' }}
                        // initialAspectRatio={2}
                        guides={false}
                        cropBoxResizable={true}
                        dragMode="crop"
                        cropBoxMovable={true}
                        ref={cropperRef}
                    />
                    <button onClick={cropImage}>Crop</button>
                </div>
            )}
            {croppedImage && <img src={croppedImage} alt="Cropped" />}
            <div className='container mt-5'>
                <Col>
                    <DisplayResult recognizedTextData={recognizedTextData} />
                </Col>
            </div>
        </div>

    );
};

export default CameraCapture;



// This code for focusing on specific word.....................................................
// import React, { useRef, useState, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import '../App.css'

// const CameraCapture = () => {
//     const webcamRef = useRef(null);
//     const [isCameraOn, setIsCameraOn] = useState(false);
//     const [imageSrc, setImageSrc] = useState(null);
//     const [recognizedTextData, setRecognizedTextData] = useState([]);

//     const handleToggleCamera = () => {
//         setIsCameraOn((prev) => !prev);
//         setRecognizedTextData([]); // Clear recognized text when toggling camera
//     };

//     const capture = useCallback(() => {
//         const image = webcamRef.current.getScreenshot();
//         setImageSrc(image);
//         performOCR(image);
//     }, [webcamRef]);

//     const uploadImage = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             const image = reader.result;
//             setImageSrc(image);
//             performOCR(image);
//         };
//         reader.readAsDataURL(file);
//     };

//     const performOCR = async (image) => {
//         try {
//             const response = await axios.post('http://localhost:7000/api/recognize-text', { image });
//             setRecognizedTextData(response.data.textData);
//         } catch (error) {
//             console.error('Error recognizing text:', error);
//         }
//     };

//     const handleWordClick = (index) => {
//         setRecognizedTextData(prevState =>
//             prevState.map((word, i) => ({
//                 ...word,
//                 highlighted: i === index ? !word.highlighted : word.highlighted
//             }))
//         );
//     };

//     return (
//         <div>
//             {isCameraOn && (
//                 <Webcam
//                     audio={false}
//                     ref={webcamRef}
//                     screenshotFormat="image/jpeg"
//                 />
//             )}
//             <div>
//                 <button onClick={handleToggleCamera}>
//                     {isCameraOn ? 'Stop Camera' : 'Start Camera'}
//                 </button>
//                 {isCameraOn && <button onClick={capture}>Capture</button>}
//                 <input type="file" accept="image/*" onChange={uploadImage} />
//             </div>
//             <div style={{ position: 'relative' }}>
//                 {imageSrc && (
//                     <img
//                         src={imageSrc}
//                         alt="Captured"
//                         className={recognizedTextData.some(word => word.highlighted) ? 'blurred' : ''}
//                         style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
//                     />
//                 )}
//                 {recognizedTextData.length > 0 && (
//                     <div style={{ position: 'relative' }}>
//                         {recognizedTextData.map((word, index) => (
//                             <span
//                                 key={index}
//                                 style={{
//                                     left: ${word.bbox.x0}px,
//                                     top: ${word.bbox.y0}px,
//                                     position: 'absolute',
//                                     backgroundColor: word.highlighted ? 'yellow' : 'transparent',
//                                     color: 'black',
//                                     borderRadius: '2px',
//                                     padding: '2px',
//                                     cursor: 'pointer'
//                                 }}
//                                 className={word.highlighted ? 'highlight' : ''}
//                                 onClick={() => handleWordClick(index)}
//                             >
//                                 {word.text}
//                             </span>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CameraCapture;