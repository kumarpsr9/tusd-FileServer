/* global tus */
/* eslint-disable no-console, no-alert */

let upload          = null
let uploadIsRunning = false

const input           = document.querySelector('input[type=file]')
const chunkInput      = document.querySelector('#chunksize')
const pbar      = document.querySelector('#pbar')
const fileurl      = document.querySelector('#fileurl')
const parallelInput   = document.querySelector('#paralleluploads')
const endpointInput   = document.querySelector('#endpoint')


input.addEventListener("change", function(e) {
  // Get the selected file from the input element
  var file = e.target.files[0]
 
 

  // Create a new tus upload
  var upload = new tus.Upload(file, {
      endpoint: endpointInput.value,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
          filename: file.name,
          filetype: file.type
      },
      onError: function(error) {
          console.log("Failed because: " + error)
      },
      onProgress: function(bytesUploaded, bytesTotal) {
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2) 
          pbar.style.width = percentage + '%';
          pbar.textContent = percentage + '%';
          console.log(bytesUploaded, bytesTotal, percentage + "%")
      },
      onSuccess: function() {
          console.log("Download %s from %s", upload.file.name, upload.url)
          fileurl.textContent = upload.url;
          fileurl.href = upload.url;
      }
  })

  // Check if there are any previous uploads to continue.
  upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one. 
      if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
  })
})