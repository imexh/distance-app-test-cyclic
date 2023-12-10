document.addEventListener("DOMContentLoaded", startCamera);

let video, canvas, context;

function startCamera() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                detectFace();
            };
        })
        .catch((err) => {
            console.error("Error accessing webcam: ", err);
        });
}

function detectFace() {
    const faceCascade = new cv.CascadeClassifier();
    faceCascade.load("haarcascade_frontalface_default.xml");

    const cap = new cv.VideoCapture(video);

    const FPS = 30;

    function processVideo() {
        try {
            if (!streaming) {
                // clean and stop.
                cap.delete();
                return;
            }
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            cap.read(src);

            // Perform face detection
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            let faces = new cv.RectVector();
            let size = new cv.Size(0, 0);
            faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, size, size);

            // Draw rectangles around faces
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
            }

            // Display the result
            cv.imshow(canvas, src);

            // Clean up
            src.delete();
            gray.delete();
            faces.delete();

            // Call next frame
            setTimeout(processVideo, 1000 / FPS);
        } catch (err) {
            console.error("Error processing video: ", err);
        }
    }

    // Start processing video
    processVideo();
}

// Load OpenCV.js
let script = document.createElement("script");
script.setAttribute("async", "");
script.setAttribute("onload", "onOpenCvReady();");
script.src = "opencv.js";
document.head.appendChild(script);

function onOpenCvReady() {
    console.log("OpenCV.js is ready!");
    startCamera();
}
