// Verify attachment is included and in correct format
var saGR = new GlideRecord("sys_attachment");
saGR.addQuery("table_sys_id", current.sys_id);
saGR.addQuery("table_name", 'ZZ_YYsc_cart_item');
saGR.query();

//Do some checking here
if (!saGR.next()) {
    gs.addErrorMessage("You must attach a file to submit. Your import submission has been aborted.");
    current.setAbortAction(true);
    producer.redirect = "/now/nav/ui/classic/params/target/com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D93f2f6b98712011051c8fd57dabb357a";
	producer.portal_redirect = "/sp?id=sc_cat_item&sys_id=93f2f6b98712011051c8fd57dabb357a";
    javascript_abort();
} else {
	var sysAttachmentID = saGR.getUniqueValue();
    if (saGR.getRowCount() > 1) {
        gs.addErrorMessage("You may only attach one file at a time for this import wizard. Your import submission has been aborted.");
        current.setAbortAction(true);
        producer.redirect = "/now/nav/ui/classic/params/target/com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D93f2f6b98712011051c8fd57dabb357a";
		producer.portal_redirect = "/sp?id=sc_cat_item&sys_id=93f2f6b98712011051c8fd57dabb357a";
        javascript_abort();
    }
}

//check to make sure the file format is correct on the attachment
var passedFormatCheck = false;
if (saGR.file_name.endsWith('.xls') == true || saGR.file_name.endsWith('.xlsx') == true) {
    passedFormatCheck = true;
} else {
    gs.addErrorMessage("This import type is expecting submission of an Excel file (.xls), but a different file format was attached. Your import submission has been aborted.");
    current.setAbortAction(true);
    producer.redirect = "/now/nav/ui/classic/params/target/com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D93f2f6b98712011051c8fd57dabb357a";
	producer.portal_redirect = "/sp?id=sc_cat_item&sys_id=93f2f6b98712011051c8fd57dabb357a";
    javascript_abort();
}

if (passedFormatCheck == true) {
    gs.addInfoMessage(saGR.file_name.toString() + ' is the correct format, starting import...');
    // Set the following variables with the name of your import set table and task id column  
    var importSetTableName = "u_time_card_data_import";
    var transformMapSysIDs = "d929b6718752011051c8fd57dabb3585"; 	
    
    current.name = "Time Card Data Import";
    current.import_set_table_name = importSetTableName;
    current.file_retrieval_method = "Attachment";
    current.type = "File";
    current.format = "Excel";
    current.header_row = 1;
    current.sheet_number = 1;
	var dataSourceID = current.insert(); //Need this since we want to load and transform directly
	saGR.table_name = 'sys_data_source'; //Need to move the attachment to the new record
	var updateAttachment = saGR.update();	
	
	
    //Now it's time to load the excel file into import table
    var loader = new GlideImportSetLoader();
    var importSetRec = loader.getImportSetGr(current);
    var ranload = loader.loadImportSetTable(importSetRec, current);
    importSetRec.state = "loaded";
    importSetRec.update();
    var transformWorker = new GlideImportSetTransformerWorker(importSetRec.sys_id, transformMapSysIDs);
    transformWorker.setBackground(true);
    transformWorker.start();
	gs.addInfoMessage("Time Card Data import started successfully!");
	current.setAbortAction(true);
	
	producer.portal_redirect = "/sp?id=sc_category";
	
	
}



function javascript_abort() {
    return;
}
