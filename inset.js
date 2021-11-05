// Alex -  - JS
//String Maker by Alex. Email: Alexlam1822@gmail.com
// Jan 05, 2019

'use strict';

$(".txtParam").on("paste", function (e) {
    pasteText(e)
});

// Insert img to txtCodeArea
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
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
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


//when the number [insert] button press, add tab and number 
function btnAddV_OnClick(iID){
	//Add or show exist tab of variable
	if ($('#tab'+iID).length <=0){
		//Add Tab Title
		$('#tab-list').append($('<li class="nav-item"><a class="nav-link" id="ValTab'+iID+'" href="#tab' + iID + '" role="tab" data-toggle="tab"><span>Var_' + iID + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span> <button class="close" type="button" title="Remove this page">×</button></a></li>'));
		//Add Tab Content
		$('#tab-content').append($('<div class="tab-pane fade" id="tab' + iID + '" role="tabpanel"' + iID + '"><div class="txtNote">One parameter per line</div><dt class="txtParam" id="txtParam' + iID + '"  contenteditable="true"></dt>'));	
	}

	$('#tab-list a[href="#tab'+iID+'"]').tab('show');
	
	$('#txtCodeArea').focus();
	$('#txtCodeArea').text(pasteHtmlAtCaret('<img src="blue/'+iID+'.png" width="16px" height="16px">'));
}

//btnRun - Output the result
function  btnRun_OnClick(){
	$('#footer').text('Processing.....');	
    let sText= $('#txtCodeArea').html();
		$('#txtCodeResult').html(makeString(sText));
	
	let myDate = new Date();	
	$('#footer').text('Finished at '+myDate.toLocaleString()+'.      String Maker by Alex. Email: Alexlam1822@gmail.com');	
}

//btnRun - Output the result
function  btnDo_OnClick(){
	let sNav=$('.nav-tabs .active').text();
	let sID=sNav.toString().substring(4,5);
	let sRtn="";
	var iFirst=+$('#txtFnum').val();
	var iLast=+$('#txtLnum').val();
	var iStep=+$('#txtStep').val();
	
	for (let i=iFirst;i<=iLast;i+=iStep){
		sRtn+='<div>'+i+'</div>';
	}
	
	$('#txtParam'+sID).html(sRtn);
}


//Making string function
// sSrc - the html source in txtCodeArea
function makeString(sSrc){
	//Define maximum number of parameter 
	let iMax=9;   //0..9
	
	//Define variable
	let sRtn="";
	let iParmLineCount=0;
	let bParmDiff=false;
	let slParam=new Array();
	
	if (sSrc=='') {
		alert('No Content!');
		return 'There is no content exist!';
	};
	
	// count parameter;
	for (let j=0; j<=iMax;j++){
		slParam[j]=new Array();
		
		if ($('#txtParam'+j).length<=0){continue;}

		let sHtml=$('#txtParam'+j).html();

		if (sHtml.slice(0,5)=='<div>') {
			sHtml=sHtml.slice(5,sHtml.length-6);
			console.log(sHtml);
		}

		if (sHtml!=''){
			sHtml=sHtml.replace(/<\/div>/g,'');
			sHtml=sHtml.replace(/<br>/g,'');
			
			slParam[j]=sHtml.split('<div>');
			
			//delete the blank 
			for (let i=slParam[j].length-1; i>=0;i--){
				if (slParam[j][i]==''){
					slParam[j].splice(i,1);
				}
				else{
					break;
				}
			}
			
			//count the max length of parameters
			if (slParam[j].length > iParmLineCount) {
				if (iParmLineCount>0){bParmDiff=true;}
				iParmLineCount=slParam[j].length;
			};
		}
		else{
			if (iParmLineCount>0){bParmDiff=true;}
		}
		
	}
	
	// check if the lines of parameters are different
	if (bParmDiff){
		let bAnswer = confirm("The the lines of parameters are not equal, do you want to continue?");
		if (bAnswer){
			
		}
		else{
			return "The the lines of parameters are not equal!"
		}
	}

	if (iParmLineCount==0) {
		alert('No Parameter exist!');
		return 'There is no parameter exist!';
	};
	
	for (let k=0; k<iParmLineCount;k++){          //生成语句数量
		let sTemp=sSrc;
		for (let i=0; i<iMax;i++){          //参数数量
			let sKey;
			if (k>=slParam[i].length){
				sKey='';
			}else{
				sKey=slParam[i][k];
			}
			let sRp='<img src="blue/'+i+'.png" width="16px" height="16px">';
			sTemp=sTemp.replace(new RegExp(sRp,'g'),sKey);

		}
		sRtn+='<div>'+sTemp+'</div>';
	} 
	return sRtn;
}

//paste the parameter by text 
function pasteText(e){
	e.preventDefault();
	var text;
    var clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text") || "";
        if (text !== "") {
            if (window.getSelection) {
                var newNode = document.createElement("span");
                newNode.innerHTML = text;
                window.getSelection().getRangeAt(0).insertNode(newNode);
            } else {
                document.selection.createRange().pasteHTML(text);
            }
        }
    } else {
        text = clp.getData('text/plain') || "";
        if (text !== "") {
            document.execCommand('insertText', false, text);
        }
    }
}




