/**
  Author: Alex Lam
	Application: String Maker
	Email: Alexlin1822@hotmail.com

	V2.0 Updated at Jan 05, 2019
	V2.1 Updated at Mar 22, 2022
	V2.2 Updated at Aug 15, 2023
  V2.3 Updated at Feb 2, 2024
  V3.0 Updated at Feb 10, 2024
 */

"use strict";

//Define maximum number of parameter
var iMax = 26; //1..26

/**
 * @description Insert img to txtCodeArea
 * @param {string} sHtml
 * @returns {string}
 *
 */
function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}

/**
 * @description when the number [insert] button press, add tab and number
 * @param {*} iID new tab id
 */
function btnAddV_OnClick(iID) {
  //Add or show exist tab of variable
  if ($("#tab" + iID).length <= 0) {
    //Add Tab Title
    $("#tab-list").append(
      $(
        '<li class="nav-item"><a class="nav-link" id="ValTab' +
          iID +
          '" href="#tab' +
          iID +
          '" role="tab" data-toggle="tab"><span>Var[' +
          iID +
          ']</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> <button class="close" type="button" title="Remove this page">×</button></a></li>'
      )
    );

    //Add Tab Content
    $("#tab-content").append(
      $(
        '<div class="tab-pane fade" id="tab' +
          iID +
          '" role="tabpanel"' +
          iID +
          '"><div class="txtNote">One parameter per line</div><dt class="txtParam" id="txtParam' +
          iID +
          '"  contenteditable="plaintext-only"></dt>'
      )
    );
  }

  $('#tab-list a[href="#tab' + iID + '"]').tab("show");

  $("#txtCodeArea").focus();
  $("#txtCodeArea").text(
    pasteHtmlAtCaret(
      '<img src="blue/' + iID + '.png" width="16px" height="16px">'
    )
  );
}

/**
 * Add the parameters from the 2-d array which includes csv data to the tabs
 * @param {} csvData  2-d array of csv data
 * @returns
 */
function addParamsFromArray(csvData) {
  let lastNode = -1;

  for (let i = 1; i <= iMax; i++) {
    if ($("#txtParam" + i).length > 0) {
      lastNode = i;

      if ($("#txtParam" + i).html().length > 0) {
        lastNode++;
      }
    }
  }

  let cols = csvData[0].length;
  if (lastNode + cols <= iMax) {
    for (let i = 0; i < cols; i++) {
      let sRtn = "";
      for (let j = 0; j < csvData.length; j++) {
        sRtn += "<div>" + csvData[j][i].trim() + "</div>";
      }
      if ($("#txtParam" + (lastNode + i)).length <= 0) {
        //Add Tab Title
        $("#tab-list").append(
          $(
            '<li class="nav-item"><a class="nav-link" id="ValTab' +
              (lastNode + i) +
              '" href="#tab' +
              (lastNode + i) +
              '" role="tab" data-toggle="tab"><span>Var[' +
              (lastNode + i) +
              ']</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> <button class="close" type="button" title="Remove this page">×</button></a></li>'
          )
        );
        //Add Tab Content
        $("#tab-content").append(
          $(
            '<div class="tab-pane fade" id="tab' +
              (lastNode + i) +
              '" role="tabpanel"' +
              (lastNode + i) +
              '"><div class="txtNote">One parameter per line</div><dt class="txtParam" id="txtParam' +
              (lastNode + i) +
              '"  contenteditable="plaintext-only"></dt>'
          )
        );
      }
      // $('#tab-list a[href="#tab' + (lastNode + i) + '"]').tab("show");
      $("#txtParam" + (lastNode + i)).html(sRtn);
    }
    $('#tab-list a[href="#tab' + lastNode + '"]').tab("show");
  } else {
    alert(
      "The number of columns in the CSV file exceeds the maximum number of parameters allowed"
    );
    return;
  }
}

/**
 * @description Get the id from the string which includes Var[ID]
 * @param {} inputString
 * @returns
 */
function get_ID(inputString) {
  const regex = /\[(.*?)\]/;
  const matches = regex.exec(inputString);
  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return "";
  }
}

/**
 * @description when the run button press, output the result
 * @param {*} iID new tab id
 */
function btnGenerateResult_OnClick() {
  $("#footer").text("Processing.....");
  let sText = $("#txtCodeArea").html();
  console.log(sText);
  $("#txtCodeResult").html(makeString(sText));

  let myDate = new Date();
  $("#footer").text(
    "Finished at " +
      myDate.toLocaleString() +
      ". Result copied to Clipboard!!   String Maker by Alex. Email: Alexlam1822@gmail.com"
  );
  copyToClipboard();
}

/**
 * @description when the copy button press, copy the result to clipboard
 */
function btnCopy_OnClick() {
  copyToClipboard();
  alert("The result has been copied to the clipboard");
}

function copyToClipboard() {
  let tt = "";
  const formattedContents = $("#txtCodeResult")
    .find("div")
    .map(function () {
      tt += $(this).text().trim() + "\n";
    });
  navigator.clipboard.writeText(tt);
}

/**
 * @description when the number [insert] button press, add tab and number
 * Button [Generate Parameters] is pressed
 */
function btnGenerateParameters_OnClick() {
  let sNav = $(".nav-tabs .active").text();
  let s = sNav.split(" ");
  let sID = get_ID(s[0].toString());
  let sRtn = "";
  var iFirst = +$("#txtFnum").val();
  var iLast = +$("#txtLnum").val();
  var iStep = +$("#txtStep").val();

  for (let i = iFirst; i <= iLast; i += iStep) {
    sRtn += "<div>" + i + "</div>";
  }

  $("#txtParam" + sID).html(sRtn);
}

/**
 * @description Making string function
 * Button [Generate the result below] is pressed
 * @param {*} sSrc - the html source in txtCodeArea
 */
function makeString(sSrc) {
  //Define variable
  let sRtn = "";
  let iParmLineCount = 0;
  let bParmDiff = false;
  let slParam = new Array();

  if (sSrc == "") {
    alert("No Content!");
    return "There is no content exist!";
  }

  // count parameter;
  for (let j = 0; j <= iMax; j++) {
    slParam[j] = new Array();

    if ($("#txtParam" + j).length <= 0) {
      continue;
    }

    let sHtml = $("#txtParam" + j).html();

    if (sHtml.slice(0, 5) == "<div>") {
      sHtml = sHtml.slice(5, sHtml.length - 6);
    }

    if (sHtml != "") {
      sHtml = sHtml.replace(/<\/div>/g, "");
      sHtml = sHtml.replace(/<br>/g, "");

      if (sHtml.includes("\r")) {
        sHtml = sHtml.replace(/<div>/g, "");
        slParam[j] = sHtml.split("\r");
      } else if (sHtml.includes("\n")) {
        sHtml = sHtml.replace(/<div>/g, "");
        slParam[j] = sHtml.split("\n");
      } else if (sHtml.includes("<div>")) {
        slParam[j] = sHtml.split("<div>");
      }

      //delete the blank
      for (let i = slParam[j].length - 1; i >= 0; i--) {
        if (slParam[j][i] == "") {
          slParam[j].splice(i, 1);
        } else {
          break;
        }
      }

      //count the max length of parameters
      if (slParam[j].length > iParmLineCount) {
        if (iParmLineCount > 0) {
          bParmDiff = true;
        }
        iParmLineCount = slParam[j].length;
      }
    } else {
      if (iParmLineCount > 0) {
        bParmDiff = true;
      }
    }
  }

  // check if the lines of parameters are different
  if (bParmDiff) {
    let bAnswer = confirm(
      "The the lines of parameters are not equal, do you want to continue?"
    );
    if (bAnswer) {
    } else {
      return "The the lines of parameters are not equal!";
    }
  }

  if (iParmLineCount == 0) {
    alert("No Parameter exist!");
    return "There is no parameter exist!";
  }

  //replace the parameter
  for (let k = 0; k < iParmLineCount; k++) {
    let sTemp = sSrc;
    for (let i = 0; i <= iMax; i++) {
      let sKey;
      if (k >= slParam[i].length) {
        sKey = "";
      } else {
        sKey = slParam[i][k];
      }
      let sRp = '<img src="blue/' + i + '.png" width="16px" height="16px">';
      sTemp = sTemp.replace(new RegExp(sRp, "g"), sKey);
    }
    sRtn += "<div>" + sTemp + "</div>";
  }
  return sRtn;
}

/**
 * @description csv text to 2-d array
 * @param {} csvText
 * @returns
 */
function parseCSV(csvText) {
  if (csvText.trim() === "") {
    return null;
  }
  const rows = csvText.trim().split("\n");
  const csvData = [];
  rows.forEach((row) => {
    row = row.trim();
    row = row.endsWith(",") ? row.slice(0, -1) : row;
    const columns = row
      .replace("\r", "")
      .replace("\t", "")
      .split(",")
      .map((col) => col.trim());

    csvData.push(columns);
  });
  return csvData;
}

/**
 * @description when the example button press, add the example parameters to the tabs
 * @returns
 */
function btnExample_OnClick() {
  const contents = "John, male, 18\nGeen, female, 20\nLily, female, 21";

  const csvData = parseCSV(contents);

  if (csvData === null) {
    alert("Invalid CSV file");
    return;
  }

  addParamsFromArray(csvData);

  let sText =
    'Name: <img src="blue/1.png" width="16px" height="16px">,  Gender: <img src="blue/2.png" width="16px" height="16px">, Age:<img src="blue/3.png" width="16px" height="16px">';
  $("#txtCodeArea").html(sText);
  btnGenerateResult_OnClick(); //Generate the result
}

/**
 * @description when the clear button press, clear the content
 */
function btnClear_OnClick() {
  window.location.reload();
}

/**
 *  @description when the button press, call the related file input to select the file
 */
function btnImportCSV_OnClick() {
  btnImportCSV_file.click();
}
function btnExportParameters_OnClick() {
  let content = preCSV();
  let filename = "Parameters.csv";
  saveToFile(content, filename);
}
function btnImportTemplate_OnClick() {
  btnImportTemplate_file.click();
}
function btnExportTemplate_OnClick() {
  let content = $("#txtCodeArea").html();
  let filename = "template.tpl";
  saveToFile(content, filename);
}

/**
 * @description when the csv file is selected, read the file and add the parameters to the tabs
 * @param {*} event
 */
function btnImportCSV_file_OnChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    const csvData = parseCSV(contents);

    if (csvData === null) {
      alert("Invalid CSV file");
      return;
    }

    addParamsFromArray(csvData);
  };

  reader.readAsText(file);
}

/**
 * @description when the template file is selected, read the file and add the content to the txtCodeArea
 * @param {} event
 */
function btnImportTemplate_file_OnChange(event) {
  console.log("btnImportTemplate_file_OnChange");

  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    console.log(contents);
    if (contents === null) {
      alert("Invalid template file");
      return;
    }
    $("#txtCodeArea").html(contents);
  };
  reader.readAsText(file);
}

/**
 * @description Save the content to a file
 * @param {*} content
 * @param {*} filename
 */
function saveToFile(content, filename) {
  let stringData = content;
  const dataURL = `data:text/plain;base64,${btoa(stringData)}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = dataURL;
  downloadLink.download = filename;
  downloadLink.target = "_blank";
  downloadLink.click();
}

/**
 * @description convert the 2-d array to csv
 * @returns
 */
function preCSV() {
  //Define variable
  let sRtn = "";
  let iParmLineCount = 0;
  let bParmDiff = false;
  let slParam = new Array();
  // count parameter;
  for (let j = 0; j <= iMax; j++) {
    slParam[j] = new Array();

    if ($("#txtParam" + j).length <= 0) {
      continue;
    }

    let sHtml = $("#txtParam" + j).html();

    if (sHtml.slice(0, 5) == "<div>") {
      sHtml = sHtml.slice(5, sHtml.length - 6);
    }

    if (sHtml != "") {
      sHtml = sHtml.replace(/<\/div>/g, "");
      sHtml = sHtml.replace(/<br>/g, "");

      if (sHtml.includes("\r")) {
        sHtml = sHtml.replace(/<div>/g, "");
        slParam[j] = sHtml.split("\r");
      } else if (sHtml.includes("\n")) {
        sHtml = sHtml.replace(/<div>/g, "");
        slParam[j] = sHtml.split("\n");
      } else if (sHtml.includes("<div>")) {
        slParam[j] = sHtml.split("<div>");
      }

      //delete the blank
      for (let i = slParam[j].length - 1; i >= 0; i--) {
        if (slParam[j][i] == "") {
          slParam[j].splice(i, 1);
        } else {
          break;
        }
      }

      //count the max length of parameters
      if (slParam[j].length > iParmLineCount) {
        if (iParmLineCount > 0) {
          bParmDiff = true;
        }
        iParmLineCount = slParam[j].length;
      }
    } else {
      if (iParmLineCount > 0) {
        bParmDiff = true;
      }
    }
  }

  // 2-D array to csv
  for (let k = 0; k < iParmLineCount; k++) {
    for (let i = 1; i <= iMax; i++) {
      let sKey;
      if (k >= slParam[i].length) {
        sKey = "";
      } else {
        sKey = slParam[i][k];
      }
      sRtn += sKey + ",";
    }
    sRtn = sRtn.slice(0, -1) + "\n";
  }
  return sRtn;
}
