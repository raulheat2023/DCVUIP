var modelName = 'c000_01';

var shots = [];
var grabLimit = 100; // total number of capture;
var grabRate = 30; // millisecond;
var count = 0;

function sleep (delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getResults() {
  var zip = new JSZip();
  var searchParams = (new URL(window.location.href)).searchParams;
  var childName = searchParams.get('mN') || modelName;
  for (var i = 0; i < shots.length; i++) {
    var filename = childName + "_" + pad(i, 4) + ".png";
    zip.file(filename, shots[i], {binary:true});
  }
  zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
  })
  .then(function callback(blob) {
    saveAs(blob, childName + "_" + canvas.width + "_" + grabLimit + "_" + grabRate + ".zip");
  }, function (e) {
    showError(e);
  });
}

function getFrameHQLS(mtn) {
  if (mtn == 'attack')
    motionMgr.startMotion(motionClick);
  else
    motionMgr.startMotion(motionIdle);
  setTimeout(function() {
    var encodedImg = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
    var img = window.atob(encodedImg);
    shots.push(img);
  }, count * grabRate);
  count++;
};

function getPNGsHQLS(grabLimit, grabRate, mtn) {
  var accTime = 0;
  shots = [];
  count = 0;

  for (var i = 0; i <= grabLimit; i++) {
    var interval = i * grabRate + 500;
    accTime = accTime + interval;
    setTimeout(function(){getFrameHQLS(mtn);}, accTime);
  };
  setTimeout(function(){getResults();}, accTime + grabLimit * grabRate + 1000);
};

function getPNGsLQHS(grabLimit, grabRate, mtn) {
  shots = [];
  count = 0;

  if (mtn == 'attack')
    motionMgr.startMotion(motionClick);
  else
    motionMgr.startMotion(motionIdle);
  var grabber = setInterval(function(){
    if (count > grabLimit) {
      clearInterval(grabber);
      getResults();
    }
    var encodedImg = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
    var img = window.atob(encodedImg);
    shots.push(img);
    count++;
  }, grabRate);
};
