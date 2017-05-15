/// <reference types="aws-sdk" />

const BUCKET_NAME = "Your-Bucket-Name";
const MAX_FILE_LENGTH = 4194304;	// 4MB Limited
const REGION = "us-west-2";
const POOL_ID = "Your-Pool-Id";
const MAX_LABELS = 50;
const MIN_CONFIDENCE = 30;
const MIN_SIMILARITY = 80;
const COLLECTION_ID = "demo-collection";
const MAX_FACES = 10;

file = '';
file_type = '';
file2 = '';
file2_type = '';

function Unauthenticated_Login() {
	AWS.config.region = REGION;
	
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: POOL_ID,
	});

	AWS.config.credentials.get(function(){
		var accessKeyId = AWS.config.credentials.accessKeyId;
		var secretAccessKey = AWS.config.credentials.secretAccessKey;
		var sessionToken = AWS.config.credentials.sessionToken;
	});
}

function Upload_Picture(obj) {
	var array = new Array('gif', 'jpeg', 'png', 'jpg', 'bmp');
	var flag = false;

	if (obj.value == '') {
		alert("请选择要比对的图片!");
		file = '';
		file_type = '';
		return false;
	} else {
		var fileContentType = obj.value.match(/^(.*)(\.)(.{1,8})$/)[3];
		var objValue = obj.value;
		
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fileLenth = parseInt(fso.getFile(objValue).size);
		} catch (e) {
			try {
				fileLenth = parseInt(obj.files[0].size);
			} catch (e) {
				return false;
			}
		}

		if (fileLenth > MAX_FILE_LENGTH) {
			alert("请上传小于4MB的图片!");
			obj.value = '';
			file = '';
			file_type = '';
			return false;
		}

		for (var i in array) {
			if (fileContentType.toLowerCase() == array[i].toLowerCase()) {
				file = obj.files[0];
				file_type = fileContentType.toLowerCase();
				flag = true;
			}
		}

		if (!flag) {
			alert("您上传的图片格式不正确，请重新选择!");
			obj.value = '';
			file = '';
			file_type = '';
			return false;
		}
	}
}

function Upload_Picture2(obj) {
	var array = new Array('gif', 'jpeg', 'png', 'jpg', 'bmp');
	var flag = false;

	if (obj.value == '') {
		alert("请选择要比对的图片!");
		file2 = '';
		file2_type = '';
		return false;
	} else {
		var fileContentType = obj.value.match(/^(.*)(\.)(.{1,8})$/)[3];
		var objValue = obj.value;
		
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fileLenth = parseInt(fso.getFile(objValue).size);
		} catch (e) {
			try {
				fileLenth = parseInt(obj.files[0].size);
			} catch (e) {
				return false;
			}
		}

		if (fileLenth > MAX_FILE_LENGTH) {
			alert("请上传小于4MB的图片!");
			obj.value = '';
			file2 = '';
			file2_type = '';
			return false;
		}

		for (var i in array) {
			if (fileContentType.toLowerCase() == array[i].toLowerCase()) {
				file2 = obj.files[0];
				file2_type = fileContentType.toLowerCase();
				flag = true;
			}
		}

		if (!flag) {
			alert("您上传的图片格式不正确，请重新选择!");
			obj.value = '';
			file2 = '';
			file2_type = '';
			return false;
		}
	}
}

function Labels_Get() {
	if (file == '') {
		alert("请选择要比对的图片!");
		return false;
	}
	Clear_Labels_Get_Result();

	var reader = new FileReader();
	reader.onload = function () {
		Detect_Labels(reader.result);
	}
	reader.readAsDataURL(file);
}

function Detect_Labels(dataURI) {
	var params = {MaxLabels: MAX_LABELS, MinConfidence: MIN_CONFIDENCE, Image: {Bytes:dataURItoBlob(dataURI)}};
	var rekognition = new AWS.Rekognition();
	rekognition.detectLabels(params, function(err, data) {
		if (err == null) {
			var img = document.getElementById("pic-show-img");
			img.src = dataURI;

			Handle_Labels_Get_Data(data);

			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		}
	});
}

function Handle_Labels_Get_Data(data) {
	var info = document.getElementById("pic-info");
	console.log(data);

	if (data.Labels.length > 0) {
		var label_title = document.createElement("label");
		label_title.className = "pic-info-title";
		var text_title = document.createTextNode("检测结果");
		label_title.appendChild(text_title);

		info.appendChild(label_title);
	} else {
		var pic_error = document.getElementsByClassName("pic-info-error");

		pic_error[0].style.display = "block";
	}
	for (var i = 0; i < data.Labels.length; i++) {
		var label_name = document.createElement("div");
		label_name.style.float = "left";
		var text_name = document.createTextNode(data.Labels[i].Name);
		label_name.appendChild(text_name);

		var label_conf = document.createElement("div");
		label_conf.style.float = "right";
		var text_conf = document.createTextNode(data.Labels[i].Confidence.toFixed(1)+"%");
		label_conf.appendChild(text_conf);

		var label = document.createElement("div");
		label.setAttribute("style", "display: flex; justify-content: space-between");
		label.appendChild(label_name);
		label.appendChild(label_conf);

		var container = document.createElement("div");
		container.className = "pic-info-container";
		container.appendChild(label);
		info.appendChild(container);
	}
}

function Clear_Labels_Get_Result() {
	var info = document.getElementById("pic-info");
	var modal = document.getElementsByClassName("modal");
	var pic_error = document.getElementsByClassName("pic-info-error");
	var pic_title = document.getElementsByClassName("pic-info-title");
	var pic_container = document.getElementsByClassName("pic-info-container");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	var pic_title_length = pic_title.length;
	var pic_container_length = pic_container.length;
	for (var i = pic_title_length - 1; i >= 0; i--) {
		info.removeChild(pic_title[i]);
	}
	for (i = pic_container_length - 1; i >= 0; i--) {
		info.removeChild(pic_container[i]);
	}
}

function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);

	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return ab;
}

function Labels_Mod() {
	if (file == '') {
		alert("请选择要比对的图片!");
		return false;
	}
	Clear_Labels_Mod_Result();

	var reader = new FileReader();
	reader.onload = function () {
		Detect_Mod_Labels(reader.result);
	}
	reader.readAsDataURL(file);
}

function Detect_Mod_Labels(dataURI) {
	var params = {MinConfidence: 0, Image: {Bytes:dataURItoBlob(dataURI)}};
	var rekognition = new AWS.Rekognition();
	rekognition.detectModerationLabels(params, function(err, data) {
		if (err == null) {
			var img = document.getElementById("pic-show-img");
			img.src = dataURI;

			Handle_Labels_Mod_Data(data);

			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		}
	});
}

function Handle_Labels_Mod_Data(data) {
	var info = document.getElementById("pic-info");
	console.log(data);

	if (data.ModerationLabels.length > 0) {
		var label_title = document.createElement("label");
		label_title.className = "pic-info-title";
		var text_title = document.createTextNode("审核结果");
		label_title.appendChild(text_title);

		info.appendChild(label_title);
	} else {
		var pic_error = document.getElementsByClassName("pic-info-error");

		pic_error[0].style.display = "block";
	}
	for (var i = 0; i < data.ModerationLabels.length; i++) {
		var label_name = document.createElement("div");
		label_name.style.float = "left";
		var text_name = document.createTextNode(data.ModerationLabels[i].Name);
		label_name.appendChild(text_name);

		var label_conf = document.createElement("div");
		label_conf.style.float = "right";
		var text_conf = document.createTextNode(data.ModerationLabels[i].Confidence.toFixed(1)+"%");
		label_conf.appendChild(text_conf);

		var label = document.createElement("div");
		label.setAttribute("style", "display: flex; justify-content: space-between");
		label.appendChild(label_name);
		label.appendChild(label_conf);

		var container = document.createElement("div");
		container.className = "pic-info-container";
		container.appendChild(label);
		info.appendChild(container);
	}
}

function Clear_Labels_Mod_Result() {
	var info = document.getElementById("pic-info");
	var modal = document.getElementsByClassName("modal");
	var pic_error = document.getElementsByClassName("pic-info-error");
	var pic_title = document.getElementsByClassName("pic-info-title");
	var pic_container = document.getElementsByClassName("pic-info-container");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	var pic_title_length = pic_title.length;
	var pic_container_length = pic_container.length;
	for (var i = pic_title_length - 1; i >= 0; i--) {
		info.removeChild(pic_title[i]);
	}
	for (i = pic_container_length - 1; i >= 0; i--) {
		info.removeChild(pic_container[i]);
	}
}

function Face_Compare() {
	if ((file == '') || (file2 == '')) {
		alert("请选择要比对的图片!");
		return false;
	}
	Clear_Face_Compare_Result();

	var reader1 = new FileReader();
	var reader2 = new FileReader();
	reader1.onload = function () {
		Detect_Face_Compare(reader1.result, reader2.result);
	}
	reader2.onload = function () {
		Detect_Face_Compare(reader1.result, reader2.result);
	}
	reader1.readAsDataURL(file);
	reader2.readAsDataURL(file2);
}

function Detect_Face_Compare(dataURI1, dataURI2) {
	if ((dataURI1 == null) || (dataURI2 == null)) return false;

	var params = {SimilarityThreshold: MIN_SIMILARITY, SourceImage: {Bytes:dataURItoBlob(dataURI1)}, TargetImage: {Bytes:dataURItoBlob(dataURI2)}};
	var rekognition = new AWS.Rekognition();
	rekognition.compareFaces(params, function(err, data) {
		if (err == null) {
			var img1 = document.getElementById("pic-show-img");
			var img2 = document.getElementById("pic-show-img2");
			img1.src = dataURI1;
			img2.src = dataURI2;

			Handle_Face_Compare_Data(data);

			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		} else {
			var pic_error = document.getElementsByClassName("face-compare-error");

			pic_error[0].style.display = "block";
			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		}
	});
}

function Handle_Face_Compare_Data(data) {
	var result = document.getElementsByClassName("face-compare-result");
	console.log(data);

	if (data.FaceMatches.length == 0) {
		var pic_failure = document.getElementsByClassName("face-compare-failure");

		pic_failure[0].style.display = "block";
	}
	for (var i = 0; i < data.FaceMatches.length; i++) {
		var label_name = document.createElement("label");
		label_name.className = "face-compare-success";
		var text_name = document.createTextNode("相似度为: "+data.FaceMatches[i].Similarity.toFixed(1)+"%");
		label_name.appendChild(text_name);

		result[0].appendChild(label_name);
	}
}

function Clear_Face_Compare_Result() {
	var modal = document.getElementsByClassName("modal");
	var result = document.getElementsByClassName("face-compare-result");
	var pic_error = document.getElementsByClassName("face-compare-error");
	var pic_failure = document.getElementsByClassName("face-compare-failure");
	var pic_success = document.getElementsByClassName("face-compare-success");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	pic_failure[0].style.display = "none";
	var pic_success_length = pic_success.length;

	for (var i = pic_success_length - 1; i >= 0; i--) {
		result[0].removeChild(pic_success[i]);
	}
}

function Index_Face() {
	if (file == '') {
		alert("请选择要上传的图片!");
		return false;
	}
	Clear_Index_Face_Result();

	var reader = new FileReader();
	reader.onload = function () {
		Detect_Index(reader.result);
	}
	reader.readAsDataURL(file);
}

function Detect_Index(dataURI) {
	var params = {CollectionId: COLLECTION_ID, DetectionAttributes: [], ExternalImageId: file_type, Image: {Bytes:dataURItoBlob(dataURI)}};
	var rekognition = new AWS.Rekognition();
	rekognition.indexFaces(params, function(err, data) {
		if (err == null) {
			Handle_Index_Face_Data(data);

			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		} else {
			console.log(err);
		}
	});
}

function Handle_Index_Face_Data(data) {
	var result = document.getElementsByClassName("index-face-result");
	console.log(data);
	
	if (data.FaceRecords.length > 0) {
		var label_title = document.createElement("label");
		label_title.className = "index-face-title";
		var text_title = document.createTextNode("面部识别结果");
		label_title.appendChild(text_title);

		result[0].appendChild(label_title);

		var label_name = document.createElement("div");
		label_name.className = "index-face-success";
		var text_name = document.createTextNode("成功识别图像，图像删除码为："+data.FaceRecords[0].Face.ImageId);
		label_name.appendChild(text_name);

		result[0].appendChild(label_name);
	} else {
		var pic_error = document.getElementsByClassName("index-face-error");

		pic_error[0].style.display = "block";
	}

	var S3 = new AWS.S3();
	var params = {
		Bucket: BUCKET_NAME,
		Key: "collection/" + data.FaceRecords[0].Face.ImageId + "." + file_type,
		Body: file
	};
	console.log(params);
	S3.upload(params, function(err, data) {
		if (err == null) {
			var result = document.getElementsByClassName("index-face-result");
			var label_name = document.createElement("div");
			label_name.className = "index-face-success";
			var text_name = document.createTextNode("S3 文件上传成功。");
			label_name.appendChild(text_name);

			result[0].appendChild(label_name);
		} else console.log(err);
	});
}

function Clear_Index_Face_Result() {
	var result = document.getElementsByClassName("index-face-result");
	var modal = document.getElementsByClassName("modal");
	var pic_error = document.getElementsByClassName("index-face-error");
	var pic_title = document.getElementsByClassName("index-face-title");
	var pic_label = document.getElementsByClassName("index-face-success");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	var pic_title_length = pic_title.length;
	var pic_label_length = pic_label.length;
	for (var i = pic_title_length - 1; i >= 0; i--) {
		result[0].removeChild(pic_title[i]);
	}
	for (i = pic_label_length - 1; i >= 0; i--) {
		result[0].removeChild(pic_label[i]);
	}
}


function Search_Face() {
	if (file2 == '') {
		alert("请选择要搜索的图片!");
		return false;
	}
	Clear_Search_Face_Result();

	var reader = new FileReader();
	reader.onload = function () {
		Detect_Search(reader.result);
	}
	reader.readAsDataURL(file2);
}

function Detect_Search(dataURI) {
	var params = {CollectionId: COLLECTION_ID, FaceMatchThreshold: MIN_SIMILARITY, Image: {Bytes:dataURItoBlob(dataURI)}, MaxFaces: MAX_FACES};
	var rekognition = new AWS.Rekognition();
	rekognition.searchFacesByImage(params, function(err, data) {
		if (err == null) {
			var img = document.getElementById("pic-show-img");
			img.src = dataURI;

			Handle_Search_Face_Data(data);

			var modal = document.getElementsByClassName("modal");
			modal[0].style.display = "none";
		} else {
			console.log(err);
			var pic_error = document.getElementsByClassName("pic-info-error");
			pic_error[0].style.display = "block";
		}
	});
}

function Handle_Search_Face_Data(data) {
	var info = document.getElementById("pic-info");
	console.log(data);
	
	if (data.FaceMatches.length > 0) {
		var label_title = document.createElement("label");
		label_title.className = "pic-info-title";
		var text_title = document.createTextNode("搜索结果");
		label_title.appendChild(text_title);

		info.appendChild(label_title);
	} else {
		var pic_failure = document.getElementsByClassName("pic-info-failure");

		pic_failure[0].style.display = "block";
	}
	for (var i = 0; i < data.FaceMatches.length; i++) {
		var container = document.createElement("div");
		container.className = "pic-info-container";

		var img = document.createElement("img");
		img.style.display = "none";
		img.src = "collection/" + data.FaceMatches[i].Face.ImageId + "." + data.FaceMatches[i].Face.ExternalImageId;
		var image = new Image();
		image.src = img.src;

		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		context.drawImage(img, image.width*data.FaceMatches[i].Face.BoundingBox.Left, image.height*data.FaceMatches[i].Face.BoundingBox.Top, image.width*data.FaceMatches[i].Face.BoundingBox.Width, image.height*data.FaceMatches[i].Face.BoundingBox.Height, 0, 0, 100, 100);

		container.appendChild(img);
		container.appendChild(canvas);

		var label_name = document.createElement("div");
		label_name.className = "pic-info-success";
		var text_name = document.createTextNode("相似度为： " + data.FaceMatches[i].Similarity.toFixed(1) + "%");
		label_name.appendChild(text_name);

		container.appendChild(label_name);
		info.appendChild(container);
	}
}

function Clear_Search_Face_Result() {
	var info = document.getElementById("pic-info");
	var modal = document.getElementsByClassName("modal");
	var pic_error = document.getElementsByClassName("pic-info-error");
	var pic_failure = document.getElementsByClassName("pic-info-failure");
	var pic_title = document.getElementsByClassName("pic-info-title");
	var pic_container = document.getElementsByClassName("pic-info-container");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	pic_failure[0].style.display = "none";
	var pic_title_length = pic_title.length;
	var pic_container_length = pic_container.length;
	for (var i = pic_title_length - 1; i >= 0; i--) {
		info.removeChild(pic_title[i]);
	}
	for (i = pic_container_length - 1; i >= 0; i--) {
		info.removeChild(pic_container[i]);
	}
}

function Delete_Face() {
	var input = document.getElementsByClassName("index-face-code");

	Clear_Delete_Face_Result()

	var params = {CollectionId: COLLECTION_ID, FaceMatchThreshold: MIN_SIMILARITY, Image: {S3Object: {Bucket: BUCKET_NAME, Name: "collection/" + input[0].value}}, MaxFaces: MAX_FACES};
	var rekognition = new AWS.Rekognition();
	try {
		rekognition.searchFacesByImage(params, function(err, data) {
			if (err == null) {
				console.log(data);

				Handle_Delete_Face_Data(data);

				var modal = document.getElementsByClassName("modal");
				modal[0].style.display = "none";
			} else {
				console.log(err);
				var pic_error = document.getElementsByClassName("delete-face-error");
				pic_error[0].style.display = "block";
			}
		});
	} catch(e) {
		console.log(e);
		var pic_error = document.getElementsByClassName("delete-face-error");
		pic_error[0].style.display = "block";
	}
}

function Handle_Delete_Face_Data(data) {
	var input = document.getElementsByClassName("index-face-code");
	var delete_file_type = 'jpg';
	var rekognition = new AWS.Rekognition();

	for (var i = 0; i < data.FaceMatches.length; i++) {
		if (data.FaceMatches[i].Face.ImageId != input[0].value) continue;
		delete_file_type = data.FaceMatches[i].Face.ExternalImageId;
		var params = {CollectionId: COLLECTION_ID, FaceIds: [data.FaceMatches[i].Face.FaceId]};
		rekognition.deleteFaces(params, function(err, data) {
			if (err == null) {
				console.log(data);
			} else console.log(err);
		});
	}

	var S3 = new AWS.S3();
	var params = {
		Bucket: BUCKET_NAME,
		Key: "collection/" + input[0].value + "." + delete_file_type
	};
	S3.deleteObject(params, function(err, data) {
		if (err == null) {
			var result = document.getElementsByClassName("delete-face-result");
			var label_name = document.createElement("div");
			label_name.className = "delete-face-success";
			var text_name = document.createTextNode("图像删除成功。");
			label_name.appendChild(text_name);

			result[0].appendChild(label_name);
		} else console.log(err);
	});

}

function Clear_Delete_Face_Result() {
	var info = document.getElementsByClassName("delete-face-result");
	var modal = document.getElementsByClassName("modal");
	var pic_error = document.getElementsByClassName("delete-face-error");
	var pic_success = document.getElementsByClassName("delete-face-success");
	modal[0].style.display = "block";
	pic_error[0].style.display = "none";
	if (pic_success.length > 0) pic_success[0].style.display = "none";
}

