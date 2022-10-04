var firstXMLString =''; //this would be the original record exported
var secondXMLString =''; // this would be the second record exported
var findExtraTagsInSecondXML = /(<\?xml)(.*)(:\d\d">)/ //This finds the beginning <xml> tag
var replacedTagsInSecondXML = secondXMLString.replace(findExtraTagsInSecondXML, ''); // this removes the beginning <xml> tag
var mergedXML = firstXMLString.replaceAll('</unload>', replacedTagsInSecondXML); //this merges the the xmls together so that it can be safely inserted
