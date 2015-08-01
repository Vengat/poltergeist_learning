var clientContext;
var oList;
var tagshowname = '';
var arrShowImages = [];
var arrShowVideos = [];

$(document).ready(function(){
	tagshowname=$.trim($('#pageTitle span').text().replace('SHOWS >',''));
});

function GetPartsIfAny(param,charLimit) {
    var returnStr = '';    
    var flag = 0;
    if (param.length > charLimit) {
        while ((param.length - 1) > (flag + charLimit)) {
            returnStr += param.substring(flag, (flag + charLimit)) + '<br/>';
            flag += charLimit;
            if ((flag + charLimit) > (param.length - 1)) {
                returnStr += param.substring(flag, param.length) + '<br/>';
            }
        }
        return returnStr;
    }
    else {
        return param;
    }
}

//Calling all the funcs from this main function
function {
	var pageID = Number($(".Id").text());
    clientContext = new SP.ClientContext("/sites/vh1press/Shows");
    oList = clientContext.get_web().get_lists().getByTitle('Show Assets');
    
	ShowImages(pageID);
	ShowTagging();
	ShowVideos(pageID);	
	
}

/*---------------------------------------Image Section Layout using ECMA Script--------------------------------------*/

function ShowImages(pageID) {
	$('#img-pagination').before('<span id="loadImg" class="ldimg" ><img src="/sites/vh1press/style%20library/images/loading.gif" alt="loading" /></span>');
    var camlQuery = new SP.CamlQuery();
    //Hard coded the content type ID to fetch only the Images files and not the Videos files
    camlQuery.set_viewXml("<View><Query>"+
    							"<Where>"+
	    							"<Eq>"+
									"<FieldRef Name='ContentTypeId'/>"+
	                                    "<Value Type='ContentTypeId'>0x0101009148F5A04DDD49CBA7127AADA5FB792B00AADE34325A8B49CDA8BB4DB53328F21400A1EE0C56CD1CB745BD12DD963CFF8CB3</Value>"+
									"</Eq>"+
								"</Where>"+
    							"</Query><ViewFields><FieldRef Name='ContentTypeId'/><FieldRef Name='FileDirRef'/><FieldRef Name='FileLeafRef'/><FieldRef Name='Title'/><FieldRef Name='ID'/><FieldRef Name='ImageWidth'/><FieldRef Name='ImageHeight'/><FieldRef Name='wic_System_Copyright'/></ViewFields></View>");
    camlQuery.set_folderServerRelativeUrl('/sites/vh1press/Shows/Show assets/' + pageID);

    this.ShowImagecollListItem = oList.getItems(camlQuery);
    clientContext.load(ShowImagecollListItem);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onImageQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}
function onQueryFailed(sender, args) {
    //alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

function onImageQuerySucceeded(sender, args) {
    var listItemEnumerator = ShowImagecollListItem.getEnumerator();
    var j = 0;
    var i;
    var tableforImages = '<table width="70%" cellpadding="12" id="showImages" class="tblWrpr"><tr>';
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();        
			j++;
			
			var thumbName=oListItem.get_fieldValues().FileLeafRef.split('.')[0]+'_'+oListItem.get_fieldValues().FileLeafRef.split('.')[1]+'.jpg';
			var thumbnailPath='/sites/vh1press/Shows/Show assets/'+$.trim($('.Id').text())+'/_w/'+thumbName;			
thumbnailPath=thumbnailPath.replace(/'/g, "%27");
            var Path = oListItem.get_fieldValues().FileDirRef;
            var ImageName = oListItem.get_fieldValues().FileLeafRef;
            var ImageTitle = oListItem.get_fieldValues().Title;
            var ImageFullName;

            if (ImageTitle != null) {

                ImageFullName = GetPartsIfAny(ImageTitle,20);
            }
            else {
                ImageFullName = GetPartsIfAny(ImageName.split('.')[0],20);
            }

            var itemid = oListItem.get_fieldValues().ID;
            var width = oListItem.get_fieldValues().ImageWidth;
            var height = oListItem.get_fieldValues().ImageHeight;
            var copyright = oListItem.get_fieldValues().wic_System_Copyright;	
            var formatPath = encodeURI(Path);
            var formatImageName = encodeURI(ImageName).replace(/'/g, "%27");            
            var formatCopyright = copyright != null ? encodeURI(copyright.replace(/'/g, "\x22")) : ''; 
            var formatImageTitle = encodeURI(ImageTitle).replace(/'/g, "%27");
            i = j - 1;
            if (j % 3 == 0) {
                //arrShowImages.push({ item: "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" + Path + "/" + ImageName + "?RenditionID=5' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');>" + ImageFullName + "</a></span></td></tr></table></td>" });
                //tableforImages += "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" + Path + "/" + ImageName + "?RenditionID=5' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');>" + ImageFullName + "</a></span></td></tr></table></td></tr><tr>";
                 arrShowImages.push({ item: "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle +"');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" +thumbnailPath +"' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  + "');>" + ImageFullName + "</a></span></td></tr></table></td>" });
				
                tableforImages += "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  +"');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" + thumbnailPath + "' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  +"');>" + ImageFullName + "</a></span></td></tr></table></td></tr><tr>";
            }
            else {
                //arrShowImages.push({ item: "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + Path + "/" + ImageName + "?RenditionID=5' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');>" + ImageFullName + "</a></span></td></tr></table></td>" });
                //tableforImages += "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + Path + "/" + ImageName + "?RenditionID=5' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "," + formatImageName + "," + formatCopyright + "," + width + "," + formatImageTitle + "');>" + ImageFullName + "</a></span></td></tr></table></td>";
                arrShowImages.push({ item: "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  +"');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + thumbnailPath + "' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  + "');>" + ImageFullName + "</a></span></td></tr></table></td>" });
				
                tableforImages += "<td valign='top' class='item" + i + "'><table><tr><td><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  +"');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + thumbnailPath + "' /></a></td></tr><br /><tr><td ><span class='link'><a style='cursor:pointer' title='" + decodeURI(formatImageTitle != 'null' ? formatImageTitle : formatImageName.split('.')[0]) + "::" + ((copyright != null ? decodeURI(formatCopyright) : "")) + "' onclick=openImage('" + formatPath + "','" + formatImageName + "','" + formatCopyright + "','" + width + "','" + formatImageTitle  +"');>" + ImageFullName + "</a></span></td></tr></table></td>";
            }        
    }

    tableforImages += "</tr></table>";
	if(tableforImages.indexOf('</td>')>-1)
	{
	    $(tableforImages).insertBefore('#LoadImagesFromSiteAssets');
	    showsImgPagination();
	}
    $('#loadImg').hide();
    //JQuery UI code to initialize the the tooltip for the Images
    $('#showImages').tooltip(
			{
			    tooltipClass: 'tooltip',
			    items: "[title]",
			    content: function () {
			        var element = $(this);
			        if (element.is("[title]")) {
			            var arrParts = element.attr("title").split('::');
			            var html = ''
			            if (arrParts.length == 2) {
			                html = '<p>' + GetPartsIfAny(arrParts[0],35) + '</p><p>' + GetPartsIfAny(arrParts[1],35) + '</p>';
			            }
			            else {
			                html = '<p>' + GetPartsIfAny(arrParts[0],35) + '</p>';
			            }
			            return html;
			        }
			    }
			});
}
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------ onclick Open Image Pop-Up -------------------------------------------*/

function openImage(formatPath, formatImageName, formatCopyright, width, formatImageTitle) {
	ImageLoading();
    var formatPath = formatPath;
    var formatImageName = formatImageName;
	var formatCopyright = formatCopyright;
    var width = width;
    var Ititle = formatImageTitle;
    Ititle = Ititle.replace(/\%20+/g, ' ');    
    if (formatCopyright == '') {

        if (Ititle != 'null') {
            formatCopyright = Ititle;           
            formatCopyright = formatCopyright.split('.')[0];
        }
        else if (formatImageName != 'null') {           
            formatCopyright = formatImageName.split('.')[0];
        }
        else {
            formatCopyright = ' ';
        }
    }


    var formatURL = formatPath + '/' + formatImageName;
	formatURL = formatURL.replace(/'/g, "%27");
	var height;
    if (width > 600) 
    {
        width = 680;
        height= 600;
    } 
 
    /*
    var nwidth = parseInt(width,10) + 100;
    var nheight = parseInt(height,10) + 100;	
    var options = SP.UI.$create_DialogOptions();
    options.title = "Image";
    options.width = nwidth;
    options.height = nheight;
    //options.allowMaximize = true;
    options.url = "/sites/vh1press/Shows/SitePages/OpenImage.aspx?ImageID="+itemid;

    SP.UI.ModalDialog.showModalDialog(options);
    */																						
    var PopUpDiv = '';  
    if(height==undefined)
    	PopUpDiv+="<div><span class='button b-close'><span>X</span></span><div style='position: absolute;height:100%;width:100%;display: inline-block;' class='loader-img-container'><img src='/sites/vh1press/style%20library/images/loading.gif' style='margin: auto;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' ></div><img onload='javascript:ImageLoaded();' width='" + width + "'  src='" + formatURL + "' style='visibility:hidden;' class='large-image-press' /></div><div style='color:white;text-align:center;width:" + width + "' id='dvcprightImg' >" + decodeURI(formatCopyright) + "</div>";        
    else
    	PopUpDiv+="<div><span class='button b-close'><span>X</span></span><div style='position: absolute;height:100%;width:100%;display: inline-block;' class='loader-img-container'><img src='/sites/vh1press/style%20library/images/loading.gif' style='margin: auto;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' ></div><img onload='javascript:ImageLoaded();' width='" + width + "'  height='" + height + "' src='" + formatURL + "' style='visibility:hidden;' class='large-image-press' /></div><div style='color:white;text-align:center;width:" + width + "' id='dvcprightImg'>" + decodeURI(formatCopyright) + "</div>";   
    $('#dialogImage').html(PopUpDiv);
    $('#dialogImage').bPopup({
        opacity: 0.6,
        positionStyle: 'absolute',
        //modalClose:false,
        position:[(screen.width/2)-(width/2),10], 
        fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
        followSpeed: 1500, //can be a string ('slow'/'fast') or int
        onClose: function () { $("#dialogVideo").find("iframe").each(function () { $(this).attr("src", ""); }); $("#dialogVideo").empty(); }
    });

}

/*----------------------------------------------------------------------------------------------------------------*/


/*------------------------------------------------- Show Tagging -------------------------------------------------*/

function ShowTagging() {
//$('#ReleaseSection').before('<span id="loadImgT" class="ldimg" ><img src="/sites/vh1press/style%20library/images/loading.gif" alt="loading" /></span>');
    var clientContext = new SP.ClientContext("/sites/vh1press");
    var oList = clientContext.get_web().get_lists().getByTitle('Pages');
    var camlQuery = new SP.CamlQuery();  
    // CAML query to fetch the releases tagged with the current show
	camlQuery.set_viewXml("<View><Query>"+ 
						"<Where>"+
						"<Contains>"+
						"<FieldRef Name='Show'/>"+
						"<Value Type='TaxonomyFieldType'>"+tagshowname+"</Value>"+
						"</Contains>"+
						"</Where>" + 							
    					  "</Query><ViewFields><FieldRef Name='Title'/><FieldRef Name='FileRef'/><FieldRef Name='Show'/></ViewFields></View>");
    this.collListItem = oList.getItems(camlQuery);
    clientContext.load(collListItem);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededT), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceededT(sender, args) {
    var listItemEnumerator = collListItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var DisplayRelease = oListItem.get_item('Title');
        var ReleaseURL = oListItem.get_item('FileRef');
        var formatDispalyRelease = "<br /><a style='font-family:Segoe UI,Segoe,Tahoma,Helvetica,Arial,sans-serif;font-size:13px;color:#444;' href='" + ReleaseURL + "'>" + DisplayRelease + "</a><br /><br />";
         $('#ReleaseSection').append(formatDispalyRelease);
    }
    $('#loadImgT').hide();
}
/*----------------------------------------------------------------------------------------------------------------*/


/*---------------------------------------Video Section Layout using ECMA Script--------------------------------------*/

function ShowVideos(pageID) {
    //$('#vid-pagination').before('<span id="loadImgVid" class="ldimg" ><img src="/sites/vh1press/style%20library/images/loading.gif" alt="loading" /></span>');
    var camlQuery = new SP.CamlQuery();
    //Hard coded the content type ID to fetch only the Video files and not the Image files
    camlQuery.set_viewXml("<View><Query>"+
    							"<Where>"+
	    							"<Eq>"+
									"<FieldRef Name='ContentTypeId'/>"+
	                                    "<Value Type='ContentTypeId'>0x0120D520A8080034D0AF1705D7F24994302EA8C70E07D1</Value>"+
									"</Eq>"+
								"</Where>"+
    							"</Query><ViewFields><FieldRef Name='ContentTypeId'/><FieldRef Name='FileDirRef'/><FieldRef Name='FileLeafRef'/><FieldRef Name='Title'/><FieldRef Name='ID'/><FieldRef Name='ImageWidth'/><FieldRef Name='ImageHeight'/><FieldRef Name='AlternateThumbnailUrl'/><FieldRef Name='AlternateThumbnailUrl'/><FieldRef Name='Video_x0020_Copyright'/><FieldRef Name='MediaLengthInSeconds'/></ViewFields></View>");
    camlQuery.set_folderServerRelativeUrl('/sites/vh1press/Shows/Show assets/' + pageID);
    this.collListItemVid = oList.getItems(camlQuery);
    clientContext.load(collListItemVid);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onVideoQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onVideoQuerySucceeded(sender, args) {
    var listItemInfo = '';

    var listItemEnumerator = collListItemVid.getEnumerator();


    var j = 0;
    var i;
    var tableforVideo = '<table width="80%" style="margin-top:54px;" cellpadding="10" id="showVideos" class="tblWrpr"><tr>';

    while (listItemEnumerator.moveNext()) {

        var oListItem = listItemEnumerator.get_current();       
            j++;
            var Thumbnail = oListItem.get_fieldValues().AlternateThumbnailUrl.$3_1;
            Thumbnail = Thumbnail.split(',')[0];
            var itemid = oListItem.get_fieldValues().ID;

            var VideoName = oListItem.get_fieldValues().FileLeafRef;
            var VideoFullName = GetPartsIfAny(VideoName,20);
            var Path = oListItem.get_fieldValues().FileDirRef;
            var copyright = oListItem.get_item('Video_x0020_Copyright') != null ? oListItem.get_item('Video_x0020_Copyright') : (oListItem.get_item('Title') != null ? oListItem.get_item('Title') : oListItem.get_item('FileLeafRef'));
            var formatCopyright = encodeURI(copyright).replace(/'/g, "\x22");
            var length = '';
            var time = oListItem.get_fieldValues().MediaLengthInSeconds;
            if (time != null) {
                var hours = parseInt(time / 3600) % 24;
                var minutes = parseInt(time / 60) % 60;
                var seconds = time % 60;

                length = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            }

            var rootFolder = Path + '/' + VideoName;
            var formatrootFolder = encodeURI(rootFolder);


            i = j - 1;
            if (j % 3 == 0) {
                arrShowVideos.push({ item: "<td valign='top'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' class='item" + i + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "','" + formatCopyright + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" + Thumbnail + "?RenditionID=5' /></a><br /><span class='link'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "');>" + VideoFullName + "</a></span><br />" + length + "</td>" });
                tableforVideo += "<td valign='top'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' class='item" + i + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "','" + formatCopyright + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid' src='" + Thumbnail + "?RenditionID=5' /></a><br /><span class='link'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "');>" + VideoFullName + "</a></span><br />" + length + "</td></tr><tr>";
            }
            else {
                arrShowVideos.push({ item: "<td valign='top'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "'  class='item" + i + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "','" + formatCopyright + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + Thumbnail + "?RenditionID=5' /></a><br /><span class='link'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "');>" + VideoFullName + "</a></span><br />" + length + "</td>" });
                tableforVideo += "<td valign='top'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' class='item" + i + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "','" + formatCopyright + "');><img style='height:125px;width:150px;border:2px #cfcfcf solid;' src='" + Thumbnail + "?RenditionID=5' /></a><br /><span class='link'><a style='cursor:pointer' title='" + decodeURI(VideoFullName) + "::" + (oListItem.get_item('Video_x0020_Copyright') != null ? decodeURI(formatCopyright) : "") + "' onclick=myPlayVideo('" + itemid + "','" + formatrootFolder + "');>" + VideoFullName + "</a></span><br />" + length + "</td>";
            }       
    }
    tableforVideo += "</tr></table>";
	if(tableforVideo.indexOf('</td')>-1)
	{
	    $(tableforVideo).insertBefore('#LoadVideosFromSiteAssets');
	    showsVidPagination();
	}
    $('#loadImgVid').hide();
   //JQuery UI code to initialize the the tooltip for the Videos
    $('#showVideos').tooltip(
			{
			    tooltipClass: 'tooltip',
			    items: "[title]",
			    content: function () {
			        var element = $(this);
			        if (element.is("[title]")) {
			            var arrParts = element.attr("title").split('::');
			            var html = ''
			            if (arrParts.length == 2)
			                html = '<p>' + GetPartsIfAny(arrParts[0],35) + '</p><p>' + GetPartsIfAny(arrParts[1],35) + '</p>';
			            else
			                html = '<p>' + GetPartsIfAny(arrParts[0],35) + '</p>';

			            return html;
			        }
			    }
			});

}

/*----------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------ onclick Open Video Pop-Up -------------------------------------------*/

function myPlayVideo(ID, rootFolder, copyright) {
    rootFolder = encodeURIComponent(rootFolder);
    var url;
    url = "/sites/VH1Press/Shows/Show%20assets/Forms/Video/videoplayerpage.aspx?ID=" + ID + "&FolderCTID=0x0120D520A8080034D0AF1705D7F24994302EA8C70E07D1&List=c3397086-4f34-478b-86be-55679d70f6c8&RootFolder=" + rootFolder + "%2FAdditional%20Content&RecSrc=" + rootFolder;

    $("#dialogVideo").load(url + " #WebPartctl00_ctl40_idPageMediaPlayer", function (response, status, xhr) {

        if (status == "error") {
            var msg = "Sorry but there was an error: ";
            alert(msg + xhr.status + " " + xhr.statusText);
        }       
        $("#dialogVideo").prepend('<span class="button b-close"><span>X</span></span>');
        $('#dialogVideo').append('<div style="color:#fff" id="dvcrightVid">' + decodeURI(copyright) + '</div>');
        $("#WebPartctl00_ctl40_idPageMediaPlayer").removeAttr('style');
        // $( "#dialogVideo" ).dialog({modal: true,height:'auto', width:'auto',beforeClose:function(){ $("#dialogVideo").find("iframe").each(function (){$(this).attr("src","");});$("#dialogVideo").empty();}});
        $('#dialogVideo').bPopup({
            opacity: 0.6,
             positionStyle: 'absolute',
	        //modalClose:false,
	        //position:[(screen.width/2)-(width/2),10],
            fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
            followSpeed: 1500, //can be a string ('slow'/'fast') or int
            onClose: function () { $("#dialogVideo").find("iframe").each(function () { $(this).attr("src", ""); }); $("#dialogVideo").empty(); }
        });
    });
}
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', InitializeContextAndStartLoadingContents);

function ImageLoaded(){
	//show the image hide the loading image.
	$(".loader-img-container").hide();
	$(".large-image-press").css("visibility","visible");
}

function ImageLoading(){
//show the loading image and hide the 
	$(".loader-img-container").show();
	$(".large-image-press").css("visibility","hidden");
}