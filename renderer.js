const selectBtn = document.getElementById('selectBtn');
const statusText = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const languageSelect = document.getElementById('language');

async function processVideo(videoPath) {
  if (!videoPath) {
    statusText.innerText = "Invalid video path.";
    return;
  }

  selectBtn.disabled = true;
  progressBar.value = 10;

  const selectedLanguage = languageSelect.value;

  try {
    statusText.innerText = "Extracting audio...";
    progressBar.value = 30;

    const audioPath = await window.api.extractAudio(videoPath);

    statusText.innerText = "Transcribing...";
    progressBar.value = 60;

    const subtitlePath = await window.api.transcribe(audioPath, selectedLanguage);

    progressBar.value = 100;
    statusText.innerText = "Subtitle saved at: " + subtitlePath;

  } catch (err) {
    console.error(err);
    statusText.innerText = "Error: " + err.message;
  }

  selectBtn.disabled = false;
}

selectBtn.onclick = async () => {
  const selectedVideo = await window.api.selectVideo();
  if (selectedVideo) {
    processVideo(selectedVideo);
  }
};
