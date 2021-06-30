// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions, descContainer;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    descContainer = document.getElementById("desc-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    document.querySelector('#title').style.display = 'none';
    document.querySelector('button').style.display = 'none';
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    if(prediction[0].className === "노란색" && prediction[0].probability.toFixed(2) == 1.00) {
        //! 이미지가 노란색인 조건에 부합한 경우
        labelContainer.childNodes[0].innerHTML = '노란색'
        labelContainer.style.color = "#ffd801"
    } else if(prediction[1].className === "하늘색" && prediction[1].probability.toFixed(2) == 1.00) {
        //! 이미지가 하늘색인 조건에 부합한 경우
        labelContainer.childNodes[0].innerHTML = '하늘색'
        labelContainer.style.color = "#1F9AE0"
    } else if(prediction[3].className === "검정색" && prediction[3].probability.toFixed(2) == 1.00) {
        //! 이미지가 검정색인 조건에 부합한 경우
        labelContainer.childNodes[0].innerHTML = '검정색'
        labelContainer.style.color = "#000000"
    } else {
        labelContainer.childNodes[0].innerHTML = '색상을 찾을 수 없습니다.'
        labelContainer.style.color = "#000000"
    }
}

const initBtn = document.querySelector('#init-btn');
initBtn.addEventListener('click', () => {
    init()
})
