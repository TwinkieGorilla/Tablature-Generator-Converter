//const selectedFile = document.getElementById('input').file;

function handleFiles(event) {
	var files = event.target.files;
	$("#src").attr("src", URL.createObjectURL(files[0]));
	document.getElementById("audioSmack").load();
}

document.getElementById("upload").addEventListener("change", handleFiles, false);