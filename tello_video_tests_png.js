const fs = require('fs');
const { spawn } = require('child_process');
const cv = require('opencv4nodejs');

var d = fs.readFileSync("video.base64.raw", 'utf8').split("\n\n");
//var image_stream = fs.createWriteStream('video.repeared.mp4');
//var video_stream_ref = fs.createWriteStream('video.ref.h264');


//var cmd = 'ffmpeg -i - -f mpjpeg - | mplayer -fps 30 -';
//var options = { stdio: [null, null, null, 'pipe'] };
//var args = [ '-fps', '30', '-' ];
//var proc = spawn(cmd);
//var pipe = proc.stdio[3];
//pipe.write(Buffer('awesome'));

//console.log(cv);


var ffmpeg = spawn ('ffmpeg', [ '-i', '-', '-c:v', 'png', '-f', 'image2pipe', '-']);

var png_header = Buffer([137, 80, 78, 71, 13, 10, 26, 10]);
var img = [];
var frame_id=0;

ffmpeg.stdout.on('data', (data) => {
	//console.log(data);
	var i = data.indexOf(png_header);
	//console.log("index of png header:",i);
	if (i>-1 && img.length>0) {
		img.push(data.slice(0,i));
		var image = cv.imdecode(Buffer.concat(img));
		//var image2 = cv.imdecode(Buffer.concat(img));
		//var c = new cv.Mat();
		//cv.canny(image,image2, 50,200);

var orb = new cv.ORBDetector()

var kp = orb.detect(image);
//console.log(kp);
//# compute the descriptors with ORB
//kp = orb.compute(image, kp);

//console.log(kp)
//# draw only keypoints location,not size and orientation
image2 = cv.drawKeyPoints(image,kp,(0,255,0), 0)
		cv.imwrite('frames/'+frame_id+".png",image2);
		//cv.imwrite('frames/'+frame_id+".png", image);
		img=[];
		img.push(data.slice(i));
		//fs.writeFile('frames/'+frame_id+".png", img_final, function () { console.log("hope done"); });
		frame_id++;
	} else {
		img.push(data);
	}
	//fs.writeFileSync('frames/'+(new Date().getTime())+".png", data.toString());
	//console.log(data.toString());
});


var current_pack_id=false;
for (var i in d) {
	if (d[i].length>0) {
		//console.log (".");
		var p = Buffer.from(d[i], 'base64');
		//current_pack_id=p.readUInt8(0);
		//console.log(current_pack_id, p.readUInt8(1), p.length);
		//proc.stdin.write(p.slice(2));
		ffmpeg.stdin.write(p.slice(2));
		//p.pipe(transcoder).pipe(output);
	}
}


//console.log(total);