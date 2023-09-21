let apiKey
let sessionId
let token
let publisher
let session
let mst720p
let mst480p


getSessionCredentials('stream-booth')

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}


function getSessionCredentials(room){
  fetch('https://neru-68eeb4cf-video-api-dev.euw1.serverless.vonage.com/session/' + room).then(function fetch(res) {
      return res.json();
  }).then(function fetchJson(json) {
      apiKey = json.apiKey
      sessionId = json.sessionId
      token = json.token
      getMedia()
  }).catch(function catchErr(error) {
      console.log(error);
      console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}



function getMedia(){

  navigator.getUserMedia({video: {width: 1280, height: 720}},(ms)=>{
    // Got Media Stream Track for 720p Video
    mst720p = ms.getVideoTracks()[0]
    navigator.getUserMedia({video: {width: 640, height: 480}},(ms)=>{
      // Got Media Stream Track for 480p Video
      mst480p = ms.getVideoTracks()[0]
      console.log(mst720p, mst480p)
      initializeVideoAPISession()
    },(err)=>{console.log(err)})
  },(err)=>{console.log(err)})


}




function initializeVideoAPISession() {

    session = OT.initSession(apiKey, sessionId)
    console.log(session)
    

    session.on('sessionConnected',()=>{

        publisher = OT.initPublisher('publisherElement', {
          insertMode: 'append',
          width: '640px',
          height: '480px',
          videoSource: mst480p
        })

        session.publish(publisher, (error) => {
        if (error) {
            console.error('Error publishing stream', error);
            console.log(publisher)
        } else {
            // Published the stream
        }
        });

    })

    session.connect(token, (error) => {
        if (error) {
            console.error('Error connecting to session', error);
        } else {
            //session.publish(publisher, handleError);// Connected to the session
        }
    });

}

var captureButton = document.getElementById('captureButton'); // Replace with the actual button in your HTML

captureButton.addEventListener('click', async () => {
    var imageCapture = new ImageCapture(mst720p);
    var photoBlob = await imageCapture.takePhoto();

    let photo = new Image()
    photo.src = URL.createObjectURL(photoBlob)
    document.body.appendChild(photo)
});

