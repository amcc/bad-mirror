// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let log = true;
let nose=[];
let rightEye = [];
let leftEye = [];
let baseScale = 80;
let scale;

let noseSize = 50;
let eyeSize = 70;
let earSize = 70;

let showVideo = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  blendMode(MULTIPLY)
  pixelDensity(1);
  video = createCapture({
      audio: false,
      video: {
        facingMode: "user",
        frameRate: 15
      }
    },
    function() {
      // videoLoaded = true;
      // console.log('capture ready.')
    }
  );
  video.size(width, height);
  // video.elt.setAttribute("playsinline", "");
  frameRate(17);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.addClass('video')
  video.addClass('hide');
}

function modelReady() {
  select('#status').html('');
}

function draw() {
  clear();
  // image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  // drawSkeleton();
  if(poses[0])showBits(poses[0].pose.keypoints)
  
  if (poses.length > 0 && log) {
    console.log(poses[0].pose.keypoints);
    log = false;
  }
}

function showBits(keypoints) {

    for (let i = 0; i < 5; i++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = keypoints[i];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.1) {
        fill(255, 0, 0);
        noStroke();
        if (keypoint.part === "nose") {
          nose = [keypoint.position.x, keypoint.position.y];
          push()
          translate(nose[0], nose[1]);
          fill(255,0, 255)
          triangle(0, -noseSize*scale, -noseSize*scale, noseSize*scale, noseSize*scale, noseSize*scale);
          rect(-noseSize*scale, noseSize*scale-0.5, noseSize*2*scale, 2000*scale)
          pop()
        } else if (keypoint.part === "rightEye") {
          rightEye = [keypoint.position.x, keypoint.position.y];
          noFill()
          stroke(0, 255, 255)
          strokeWeight(20*scale)
          circle(rightEye[0], rightEye[1], eyeSize*scale);
        } else if (keypoint.part === "leftEye") {
          leftEye = [keypoint.position.x, keypoint.position.y];
          noFill()
          stroke(0, 255, 255)
          strokeWeight(20*scale)
          circle(leftEye[0], leftEye[1], eyeSize*scale);
        } else if (keypoint.part === "rightEar") {
          push()
          translate(keypoint.position.x, keypoint.position.y);
          noFill()
          fill(255, 255, 0)
          stroke(255, 255, 0)
          noStroke();
          strokeWeight(5)
          rect(-2000*scale, -(earSize/2)*scale, (2000+earSize/4)*scale, earSize*scale);
          pop()
        } else if (keypoint.part === "leftEar") {
          push()
          translate(keypoint.position.x, keypoint.position.y);
          noFill()
          fill(255, 255, 0)
          stroke(255, 255, 0)
          noStroke();
          strokeWeight(5)
          rect(-earSize/4, -(earSize/2)*scale, 2000*scale, earSize*scale);
          pop()
        } else {
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
        scale = dist(leftEye[0], leftEye[1], rightEye[0], rightEye[1])/baseScale
        // console.log(scale)
      }
    }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}

function mousePressed(){
  if(showVideo){
    video.removeClass('show');
    video.addClass('hide')
  }else{
    video.addClass('show');
    video.removeClass('hide')
  }
  showVideo = !showVideo;
}
