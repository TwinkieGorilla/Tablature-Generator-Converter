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
  // window.URL = window.URL || window.webkitURL;
  // var blob = new Blob([tabArray], { type: "text/plain;charset="+document.characterSet });
  // var url = window.URL.createObjectURL(blob);
  // saveAs(url,"doc.txt");

  //trying a different way
  var blob = new Blob([tabArray], {type: 'text/csv'});
  const url = URL.createObjectURL(blob, { oneTimeOnly: true })
  if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
  }
  else{
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = 'saved_tabs.txt';        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
  }

  //tabArray returns like this:
  // -------------,-------------,-------------
}
