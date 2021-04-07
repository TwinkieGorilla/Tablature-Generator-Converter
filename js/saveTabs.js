var eString = document.getElementById('string1');
var BString = document.getElementById('string2');
var GString = document.getElementById('string3');
var DString = document.getElementById('string4');
var AString = document.getElementById('string5');
var EString = document.getElementById('string6');

function saveTabs() {
  var tabs2 = new Array();

  //grab each string - newline char is for the format of the saved file
  tabs2.push('e||-' + eString.innerHTML + '\n');
  tabs2.push('B||-' + BString.innerHTML + '\n');
  tabs2.push('G||-' + GString.innerHTML + '\n');
  tabs2.push('D||-' + DString.innerHTML + '\n');
  tabs2.push('A||-' + AString.innerHTML + '\n');
  tabs2.push('E||-' + EString.innerHTML + '\n');

  //create blob from tabs2 and save it
  var blob = new Blob(tabs2, {type: 'text/plain', endings: 'transparent'});
  
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
}
