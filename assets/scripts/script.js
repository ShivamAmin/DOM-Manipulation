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
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    var text = document.createTextNode("Description");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    var text = document.createTextNode("Price");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
    var text = document.createTextNode("Genre");
    heading.appendChild(text);
    row.appendChild(heading);
    var heading = document.createElement("th");
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
          if(dvdList[x].childNodes[y].nodeName != '#text'){
            var column = document.createElement("td");
            if(dvdList[x].childNodes[y].nodeName == 'genre'){
              var innerTable = document.createElement("table");
              for(var z = 0; z < dvdList[x].childNodes[y].childNodes.length; z++){
                if(dvdList[x].childNodes[y].childNodes[z].nodeName != '#text'){
                  var innerRow = document.createElement("tr");
                  var innerColumn = document.createElement("td");
                  var innerText = document.createTextNode(dvdList[x].childNodes[y].childNodes[z].firstChild.nodeValue);
                  innerColumn.appendChild(innerText);
                  innerRow.appendChild(innerColumn);
                  innerTable.appendChild(innerRow);
                }
              }
              column.appendChild(innerTable);
            } else {
              var text = document.createTextNode(dvdList[x].childNodes[y].firstChild.nodeValue);
              column.appendChild(text);
            }
            row.appendChild(column);
          }
        }
        var col = document.createElement("td");
        var button = document.createElement("input");
        button.type = "button";
        button.className = "btn btn-danger";
        button.value = "Delete";
        button.addEventListener("click", function(){
          //Match and delete data from XMLObject
          var targetElem = this.parentElement.parentElement;
          var targetXObj = parseAsXML(targetElem);
          var listOfElem = xmldata.childNodes[1].childNodes;
          var elemIndex;
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
                    listOfElem[x].remove();
                  }
                  continue;
                } else {
                  break;
                }
              }
            }
          }
          createTable();
        });
        col.appendChild(button);
        row.appendChild(col);
      }
      table.appendChild(row);
    }
    //Write Table to DOM
    body.appendChild(table);
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
