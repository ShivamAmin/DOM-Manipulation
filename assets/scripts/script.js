var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    xmldata = this.responseXML;
    clean(xmldata);
    refreshTable();
  }
};
xhttp.open("GET", "assets/data/data.xml", true);
xhttp.send();

function refreshTable() {
  var dvdList = xmldata.childNodes[1].childNodes;
  //Create Table and Headings
  var body = document.getElementById("first");
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
    var row = document.createElement("tr");
    //Inside each DVD
    for(var y = 0; y < dvdList[x].childNodes.length; y++){
      var column = document.createElement("td");
      column.id = dvdList[x].childNodes[y].nodeName;
      var tDiv = document.createElement("div");
      var iDiv = document.createElement("div");
      tDiv.id = "text";
      iDiv.id = "input";
      iDiv.style.display = 'none';
      var input = document.createElement("textarea");
      input.style.width = "100%";
      input.style.resize = "none";
      input.className = "form-control";
      if(dvdList[x].childNodes[y].nodeName == 'genre'){
        var innerTable = document.createElement("table")
        for(var z = 0; z < dvdList[x].childNodes[y].childNodes.length; z++){
          var innerRow = document.createElement("tr");
          var innerColumn = document.createElement("td");
          var innerText = document.createTextNode(dvdList[x].childNodes[y].childNodes[z].firstChild.nodeValue + "\n");
          innerColumn.appendChild(innerText);
          innerRow.appendChild(innerColumn);
          innerTable.appendChild(innerRow);
          //input.value += dvdList[x].childNodes[y].childNodes[z].firstChild.nodeValue + "\n"
        }
        tDiv.appendChild(innerTable);
        column.appendChild(tDiv);
      } else {
        var text = document.createTextNode(dvdList[x].childNodes[y].firstChild.nodeValue);
        tDiv.appendChild(text);
        //input.value = text.nodeValue;
        column.appendChild(tDiv);
      }
      iDiv.appendChild(input);
      column.appendChild(iDiv);
      row.appendChild(column);
      row.dataset.view = "text";
    }
    var col = document.createElement("td");
    col.id = "actions";
    var updButton = document.createElement("input");
    updButton.type = "button";
    updButton.className = "btn btn-default";
    updButton.dataset.type = "Edit"
    updButton.value = updButton.dataset.type;
    updButton.addEventListener("click", function() {
      var delButton = this.nextSibling;
      var targetElem = this.parentElement.parentElement;
      var targetXObj = parseAsXML(targetElem);
      var xmlElement = findElementInXML(targetXObj, false);
      var view = targetElem.dataset.view;
      if(view == "text") {
        targetElem.dataset.view = "input";
        this.value = "Submit";
        this.className = "btn btn-success";
        this.nextSibling.dataset.type = "Reset";
        this.nextSibling.value = "Reset";
        for(x = 0; x < targetElem.children.length - 1; x++) {
          var e = targetElem.children[x];
          inp = e.firstChild.nextSibling.firstChild;
          e.firstChild.style.display = 'none';
          e.firstChild.nextSibling.style.display = '';
          if(e.id.toUpperCase() == "GENRE") {
            genres = new DOMParser().parseFromString(e.firstChild.innerHTML, "text/xml");
            inp.value = '';
            for(var y = 0; y < genres.firstChild.childNodes.length; y++) {
              inp.value += genres.firstChild.childNodes[y].firstChild.firstChild.nodeValue.trim() + "\n";
            }
          } else {
            e.firstChild.nextSibling.firstChild.value = e.firstChild.innerHTML;
          }
        }
      } else {
        targetElem.dataset.view = "text";
        this.value = "Edit";
        this.className = "btn btn-default";
        this.nextSibling.dataset.type = "Delete";
        this.nextSibling.value = "Delete";
        var dvd = document.createElement("dvd");
        for(x = 0; x < targetElem.children.length - 1; x++) {
          var e = targetElem.children[x];
          inp = e.firstChild.nextSibling.firstChild;
          e.firstChild.style.display = '';
          e.firstChild.nextSibling.style.display = 'none';
          var tag = document.createElement(e.id);
          if(e.id.toUpperCase() == "GENRE") {
            genres = new DOMParser().parseFromString(e.firstChild.innerHTML, "text/xml");
            i = inp.value.split("\n");
            etable = document.createElement("table");
            for(var y = 0; y < i.length; y++) {
              if (i[y] != "") {
                etr = document.createElement("tr");
                etd = document.createElement("td");
                etxt = document.createTextNode(i[y].trim());
                var type = document.createElement("type");
                type.appendChild(document.createTextNode(i[y].trim()));
                tag.appendChild(type);
                etd.appendChild(etxt);
                etr.appendChild(etd);
                etable.appendChild(etr);
              }
            }
            e.firstChild.replaceChild(etable, e.firstChild.firstChild);
          } else {
            tag.appendChild(document.createTextNode(e.firstChild.nextSibling.firstChild.value));
            e.firstChild.innerHTML = e.firstChild.nextSibling.firstChild.value;
          }
          dvd.appendChild(tag);
        }
        xmldata.childNodes[1].replaceChild(dvd, xmlElement);
      }
    });
    var delButton = document.createElement("input");
    delButton.type = "button";
    delButton.className = "btn btn-danger";
    delButton.value = "Delete";
    delButton.dataset.type = "Delete";
    delButton.addEventListener("click", function(){
      var targetElem = this.parentElement.parentElement;
      var targetXObj = parseAsXML(targetElem);
      if(this.dataset.type.toUpperCase() == 'DELETE') {
        //Match and delete data from XMLObject
        findElementInXML(targetXObj, false).remove();
      } else {
        this.dataset.type = "Delete";
        this.previousSibling.value = "Edit";
        targetElem.dataset.view = "text";
        this.previousSibling.className = "btn btn-default";
        for(x = 0; x < targetElem.children.length - 1; x++) {
          var e = targetElem.children[x];
          e.firstChild.style.display = '';
          e.firstChild.nextSibling.style.display = 'none';
        }
      }
      this.value = this.dataset.type;
      refreshTable();
    });
    col.appendChild(updButton);
    col.appendChild(delButton);
    row.appendChild(col);
    table.appendChild(row);
  }
  //Write Table to DOM
  body.appendChild(table);
}

function findElementInXML(targetXObj, bool) {
  var listOfElem = xmldata.childNodes[1].childNodes;
  for(var x = 0; x < listOfElem.length; x++) {
    var name = targetXObj.childNodes[0].firstChild.nodeValue;
    var desc = targetXObj.childNodes[1].firstChild.nodeValue;
    var price = targetXObj.childNodes[2].firstChild.nodeValue;
    var genres = [];
    for(var y = 0; y < targetXObj.childNodes[3].childNodes.length; y++){
      genres.push(targetXObj.childNodes[3].childNodes[y].firstChild.nodeValue.trim());
    }
    if(name == listOfElem[x].childNodes[0].firstChild.nodeValue && desc == listOfElem[x].childNodes[1].firstChild.nodeValue && price == listOfElem[x].childNodes[2].firstChild.nodeValue && genres.length == listOfElem[x].childNodes[3].childNodes.length){
      for (var z = 0; z < genres.length; z++) {
        if(genres[z] == listOfElem[x].childNodes[3].childNodes[z].firstChild.nodeValue) {
          if(z == genres.length - 1) {
            if(bool) {
              return x;
            } else {
              return listOfElem[x];
            }
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
  xmlName.appendChild(document.createTextNode(elem.childNodes[0].firstChild.firstChild.nodeValue));
  var xmlDesc = document.createElement("Desc");
  xmlDesc.appendChild(document.createTextNode(elem.childNodes[1].firstChild.firstChild.nodeValue));
  var xmlPrice = document.createElement("Price");
  xmlPrice.appendChild(document.createTextNode(elem.childNodes[2].firstChild.firstChild.nodeValue));
  var xmlGenre = document.createElement("Genre");
  var genres = elem.childNodes[3].firstChild.firstChild.childNodes;
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
  var name = document.getElementById("addName").value;
  var desc = document.getElementById("addDesc").value;
  var price = document.getElementById("addPrice").value;
  var genrelist = document.getElementById("addGenre").options;
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
          refreshTable();
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
