var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      xmldata = this.responseXML;
      clean(xmldata);
      createTable(xmldata);
    }
};
xhttp.open("GET", "assets/data/data.xml", true);
xhttp.send();

function createTable() {
  var dvdList = xmldata.childNodes[1].childNodes;
  //Create Table and Headings
  var body = document.getElementsByTagName("body")[0];
  if (document.getElementById("DVDList")){
    document.getElementById("DVDList").remove();
  }
  var table = document.createElement("table");
  table.id = "DVDList";
    var row = document.createElement("tr");
    row.id = "Headers";
    var heading = document.createElement("th");
    var text = document.createTextNode("Title");
    heading.style.width = "150px";
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    var text = document.createTextNode("Description");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    heading.style.width = "10%";
    var text = document.createTextNode("Price");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    heading.style.width = "200px";
    var text = document.createTextNode("Genre");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    heading.style.width = "100px";
    var text = document.createTextNode("Action");
    heading.appendChild(text);
    row.appendChild(heading);
    table.appendChild(row);
    //Read and Create Rows from XML
    for(var x = 0; x < dvdList.length; x++){
      if(dvdList[x].nodeName != '#text'){
        var row = document.createElement("tr");
        //Inside each DVD
        for(var y = 0; y < dvdList[x].childNodes.length; y++){
          var column = document.createElement("td");
          column.id = dvdList[x].childNodes[y].nodeName;
          if(dvdList[x].childNodes[y].nodeName == 'genre'){
            var innerTable = document.createElement("table");
            for(var z = 0; z < dvdList[x].childNodes[y].childNodes.length; z++){
              var innerRow = document.createElement("tr");
              var innerColumn = document.createElement("td");
              var innerText = document.createTextNode(dvdList[x].childNodes[y].childNodes[z].firstChild.nodeValue);
              innerColumn.appendChild(innerText);
              innerRow.appendChild(innerColumn);
              innerTable.appendChild(innerRow);
            }
            column.appendChild(innerTable);
          } else {
            var text = document.createTextNode(dvdList[x].childNodes[y].firstChild.nodeValue);
            column.appendChild(text);
          }
          row.appendChild(column);
        }
        var col = document.createElement("td");
        col.id = "actions";
        var updButton = document.createElement("input");
        updButton.type = "button";
        updButton.className = "btn btn-default";
        updButton.dataset.type = "Edit"
        updButton.value = updButton.dataset.type;
        updButton.addEventListener("click", function() {
          if(this.dataset.type.toUpperCase() == "EDIT") {
            var targetElem = this.parentElement.parentElement;
            console.log(targetElem);
            var targetXObj = parseAsXML(targetElem);
            var xmlElement = findElementInXML(targetXObj);
            var undoButton = document.createElement("input");
            undoButton.type = "button";
            undoButton.className = "btn btn-warning";
            undoButton.value = "Reset";
            undoButton.addEventListener("click", function() {
              this.parentElement.firstChild.dataset.type = "Edit";
              this.parentElement.firstChild.className = "btn btn-warning"
              this.parentElement.firstChild.value = this.parentElement.firstChild.dataset.type;
              this.remove();
            });
            this.parentElement.insertBefore(undoButton, this.nextSibling);
            var name = targetElem.children[0];
            var desc = targetElem.children[1];
            var price = targetElem.children[2];
            var genre = targetElem.children[3];
            for(var x = 0; x < targetElem.children.length - 1; x++) {
              var input = document.createElement("textarea");
              input.style.width = "100%";
              input.style.resize = "none";
              input.className = "form-control";
              if(targetElem.children[x].id.toUpperCase() == "GENRE") {
                genres = new DOMParser().parseFromString(targetElem.children[x].innerHTML, "text/xml");
                for(var y = 0; y < genres.firstChild.childNodes.length; y++) {
                  input.value += genres.firstChild.childNodes[y].firstChild.firstChild.nodeValue + "\n";
                }
              } else {
                input.value = targetElem.children[x].innerHTML;
              }
              targetElem.children[x].innerHTML = "";
              targetElem.children[x].appendChild(input);
              this.dataset.type = "Submit";
              this.className = "btn btn-success"
            }
          } else if (this.dataset.type.toUpperCase() == "SUBMIT") {
            this.nextSibling.remove();
            this.dataset.type = "Edit";
            this.className = "btn btn-warning"
          }
          this.value = this.dataset.type;
        })
        var delButton = document.createElement("input");
        delButton.type = "button";
        delButton.className = "btn btn-danger";
        delButton.value = "Delete";
        delButton.addEventListener("click", function(){
          //Match and delete data from XMLObject
          var targetElem = this.parentElement.parentElement;
          var targetXObj = parseAsXML(targetElem);
          findElementInXML(targetXObj).remove();
          createTable();
        });
        col.appendChild(updButton);
        col.appendChild(delButton);
        row.appendChild(col);
      }
      table.appendChild(row);
    }
    //Write Table to DOM
    body.appendChild(table);
}

function findElementInXML(targetXObj) {
  var listOfElem = xmldata.childNodes[1].childNodes;
  for(var x = 0; x < listOfElem.length; x++) {
    var name = targetXObj.childNodes[0].firstChild.nodeValue;
    var desc = targetXObj.childNodes[1].firstChild.nodeValue;
    var price = targetXObj.childNodes[2].firstChild.nodeValue;
    var genres = [];
    for(var y = 0; y < targetXObj.childNodes[3].childNodes.length; y++){
      genres.push(targetXObj.childNodes[3].childNodes[y].firstChild.nodeValue)
    }
    if(name == listOfElem[x].childNodes[0].firstChild.nodeValue && desc == listOfElem[x].childNodes[1].firstChild.nodeValue && price == listOfElem[x].childNodes[2].firstChild.nodeValue && genres.length == listOfElem[x].childNodes[3].childNodes.length){
      for (var z = 0; z < genres.length; z++) {
        if(genres[z] == listOfElem[x].childNodes[3].childNodes[z].firstChild.nodeValue) {
          if(z == genres.length - 1) {
            return listOfElem[x];
          }
          continue;
        } else {
          break;
        }
      }
    }
  }
}

function parseAsXML(elem) {
  var xmlDVD = document.createElement("DVD");
  var xmlName = document.createElement("Name");
  xmlName.appendChild(document.createTextNode(elem.childNodes[0].firstChild.nodeValue));
  var xmlDesc = document.createElement("Desc");
  xmlDesc.appendChild(document.createTextNode(elem.childNodes[1].firstChild.nodeValue));
  var xmlPrice = document.createElement("Price");
  xmlPrice.appendChild(document.createTextNode(elem.childNodes[2].firstChild.nodeValue));
  var xmlGenre = document.createElement("Genre");
  var genres = elem.childNodes[3].firstChild.childNodes;
  for (var x = 0; x < genres.length; x++) {
    var xmlType = document.createElement("Type");
    xmlType.appendChild(document.createTextNode(genres[x].firstChild.firstChild.nodeValue));
    xmlGenre.appendChild(xmlType);
  }
  xmlDVD.appendChild(xmlName);
  xmlDVD.appendChild(xmlDesc);
  xmlDVD.appendChild(xmlPrice);
  xmlDVD.appendChild(xmlGenre);
  return xmlDVD;
}

function insertDVD() {
  //Get data from form
  var name = document.getElementById("name").value;
  var desc = document.getElementById("desc").value;
  var price = document.getElementById("price").value;
  var genrelist = document.getElementById("genre").options;
  var genres = [];
  for(var x = 0; x < genrelist.length; x++) {
    if (genrelist[x].selected) {
      genres.push(genrelist[x].value);
    }
  }
  if (name.length == 0) {
    document.getElementById("name").parentElement.classList.add("has-error");
  } else {
    document.getElementById("name").parentElement.classList.remove("has-error");
    if (desc.length == 0) {
      document.getElementById("desc").parentElement.classList.add("has-error");
    } else {
      document.getElementById("desc").parentElement.classList.remove("has-error");
      if (price.length == 0) {
        document.getElementById("price").parentElement.classList.add("has-error");
      } else {
        document.getElementById("price").parentElement.classList.remove("has-error");
        if (genres.length == 0) {
          document.getElementById("genre").parentElement.classList.add("has-error");
        } else {
          document.getElementById("genre").parentElement.classList.remove("has-error");
          //Create new xml element and populate with form data
          var xmlDVD = document.createElement("DVD");
          var xmlName = document.createElement("Name");
          xmlName.appendChild(document.createTextNode(name));
          var xmlDesc = document.createElement("Desc");
          xmlDesc.appendChild(document.createTextNode(desc));
          var xmlPrice = document.createElement("Price");
          xmlPrice.appendChild(document.createTextNode(price));
          var xmlGenre = document.createElement("Genre");
          for (var x = 0; x < genres.length; x++) {
            var xmlType = document.createElement("Type");
            xmlType.appendChild(document.createTextNode(genres[x]));
            xmlGenre.appendChild(xmlType);
          }
          xmlDVD.appendChild(xmlName);
          xmlDVD.appendChild(xmlDesc);
          xmlDVD.appendChild(xmlPrice);
          xmlDVD.appendChild(xmlGenre);
          //insert new xml element into xmlObject
          xmldata.childNodes[1].appendChild(xmlDVD);
          createTable();
        }
      }
    }
  }
}

function clean(node){
  for(var n = 0; n < node.childNodes.length; n ++){
    var child = node.childNodes[n];
    if(child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))){
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1){
      clean(child);
    }
  }
}
