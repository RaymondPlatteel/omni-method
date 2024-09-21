/// <reference lib="webworker" />

async function uploadVideo() {
  // upload file and get video link
  if (this.localVideoPath) {
    // save thumbnail
    const thumbDest = this.storageService.remoteScoreVideoPath(this.newScore, 'jpg');
    // wait for thumbnail url
    await this.storageService.uploadFile(this.videoThumbnailUrl, thumbDest, 'image/jpg').then((url) => {
      console.log("upload thumbnail return url", url);
      this.newScore.videoThumbnailUrl = url;
    });
    // save video
    const dest = this.storageService.remoteScoreVideoPath(this.newScore);
    // wait for video url
    await this.storageService.uploadFile(this.localVideoPath, dest).then((url) => {
      console.log("uploadFile return download url", url);
      this.newScore.videoUrl = url;
    });
  }

  // save score with video link
  console.log("save new score with videoUrl", this.newScore.videoUrl);
  this.userService.saveScore(this.newScore);

}


addEventListener('message', ({data}) => {
  console.log("worker received message:", data);
  const response = `worker response to ${JSON.stringify(data)}`;
  postMessage(response);
});
