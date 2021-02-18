function saveTabs() {
  // obtain each div within the content output
  var tabs = document.getElementById("output").querySelectorAll("div");
  // make a list for each div? then take the list and throw into a file?
  var tabArray = new Array();
  for (var i = 0; i < tabs.length; i++)
  {
    console.log(tabs[i].innerText);
    tabArray[i] = tabs[i].innerText;
  }

  // make a blob
  window.URL = window.URL || window.webkitURL;
  var blob = new Blob([tabArray], { type: "text/plain;charset="+document.characterSet });
  var url = window.URL.createObjectURL(blob);
  saveAs(url,"doc.txt");

  //tabArray returns like this:
  // -------------,-------------,-------------
}
