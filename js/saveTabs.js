var eString = document.getElementById('string1');
var BString = document.getElementById('string2');
var GString = document.getElementById('string3');
var DString = document.getElementById('string4');
var AString = document.getElementById('string5');
var EString = document.getElementById('string6');

var ukeString1 = document.getElementById('ukeString1');
var ukeString2 = document.getElementById('ukeString2');
var ukeString3 = document.getElementById('ukeString3');
var ukeString4 = document.getElementById('ukeString4');

function saveTabs() {
  var tabs2 = new Array();
  tabs2.push('Generated using the Tablature Generator Converter - Copyright 2021 \n https://tablaturegeneratorconverter.netlify.app/ \n\n');
  //grab each string - newline char is for the format of the saved file
  tabs2.push(eString.innerHTML + '\n');
  tabs2.push(BString.innerHTML + '\n');
  tabs2.push(GString.innerHTML + '\n');
  tabs2.push(DString.innerHTML + '\n');
  tabs2.push(AString.innerHTML + '\n');
  tabs2.push(EString.innerHTML + '\n');

  var tabs3 = new Array();
  tabs3.push('Generated using the Tablature Generator Converter - Copyright 2021 \n https://tablaturegeneratorconverter.netlify.app/ \n\n');
  //grab each string - newline char is for the format of the saved file
  tabs3.push(ukeString1.innerHTML + '\n');
  tabs3.push(ukeString2.innerHTML + '\n');
  tabs3.push(ukeString3.innerHTML + '\n');
  tabs3.push(ukeString4.innerHTML + '\n');

  

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

  // only runs if convert button is pressed
  if(document.getElementById('ukeString1').innerHTML !== ""){

    var blob = new Blob(tabs3, {type: 'text/plain', endings: 'transparent'});
    
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = 'converted_tabs.txt';        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
  }
}
