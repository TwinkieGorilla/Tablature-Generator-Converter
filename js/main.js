function saveTabs() {
  
  // obtain each div within the content output
  var retainer = document.getElementById('output');
  var tabs = retainer.querySelectorAll('div');
  for (const tab in tabs)
  {
    console.log(`${tabs[tab].innerHTML}`);
    // attempt localStorage of the section container
    if (typeof(Storage) !== "undefined") {
      // Store
      localStorage.setItem("tabs", tabs[tab].innerHTML);
      // Retrieve
      //retainer.innerHTML = localStorage.getItem("tabs");
    } else {
      retainer.innerHTML = "Sorry, your browser does not support Web Storage...";
    }
  }
  //alert("clicked the save button");

}