var alias = getAlias('<sys_id>'); //create a credential for an admin account

// Versions to install
var assetVersion = "4.0.1";
var vrVersion = "4.0.1";
var itsmVersion = "4.0.0";
var connectorVersion = "4.0.1";

// The instance url
var instanceURL = gs.getProperty('glide.servlet.uri');

//Creating the batch plan
var batchPlan = installPlanTenableApps(assetVersion, vrVersion, itsmVersion, connectorVersion);

// Running the install batch flow action
var outputs = installBatch(batchPlan, alias, instanceURL);

// Outputing the response
gs.print(JSON.stringify(outputs, '', 4));


/* 
The supporting functions
*/
function getAlias(sysID) {
    var foo = new GlideRecord('sys_alias');
    foo.get(sysID);
    return foo;
}

// Flow Action Snippet Code
function installBatch(batch_plan, alias, url) {

    try {
        var inputs = {};
        inputs['batch_plan'] = batch_plan; // JSON 
        inputs['credential_alias'] = alias; // GlideRecord of table: sys_alias 
        inputs['instance_url'] = url; // String 

        // Start Asynchronously: Uncomment to run in background. Code snippet will not have access to outputs.
        // sn_fd.FlowAPI.getRunner().action('sn_cicd_spoke.cicd_batch_install').inBackground().withInputs(inputs).run();

        // Execute Synchronously: Run in foreground. Code snippet has access to outputs.
        var result = sn_fd.FlowAPI.getRunner().action('sn_cicd_spoke.cicd_batch_install').inForeground().withInputs(inputs).run();
        var outputs = result.getOutputs();

        // Get Outputs:
        // Note: outputs can only be retrieved when executing synchronously.
        var http_status = outputs['http_status']; // String
        var status = outputs['status']; // String
        var status_detail = outputs['status_detail']; // String
        var status_label = outputs['status_label']; // String
        var status_message = outputs['status_message']; // String
        var error = outputs['error']; // String
        var progress_id = outputs['progress_id']; // String
        var progress_url = outputs['progress_url']; // String
        var results_id = outputs['results_id']; // String
        var results_url = outputs['results_url']; // String
        var percent_complete = outputs['percent_complete']; // String
        var rollback_id = outputs['rollback_id']; // String

      // Added this to get the output
        return outputs;

    } catch (ex) {
        var message = ex.getMessage();
        gs.error(message);
    }

}

/* 
Create the batch plan example
*/
function installPlanTenableApps(assetVersion, connectorVersion, vrVersion, itsmVersion) {
    var payload = new JSON();
    var packages = [];
    var asset = new JSON();
    var connector = new JSON();
    var vr = new JSON();
    var itsm = new JSON();

    if (connectorVersion && connectorVersion != '') {
        connector["id"] = "a8bc0dbfdb014b002951d92b5e9619e4";
        connector["type"] = "application";
        connector["load_demo_data"] = false;
        connector["requested_version"] = connectorVersion;
        packages.push(connector);
    }

    if (assetVersion && assetVersion != '') {
        asset["id"] = "9e0813f0db841300fe8d73198c961980";
        asset["type"] = "application";
        asset["load_demo_data"] = false;
        asset["requested_version"] = assetVersion;
        packages.push(asset);
    }

    if (vrVersion && vrVersion != '') {

        vr["id"] = "cc5d6fe0db4dd3000b85735a8c96198d";
        vr["type"] = "application";
        vr["load_demo_data"] = false;
        vr["requested_version"] = vrVersion;
        packages.push(vr);
    }

    if (itsmVersion && itsmVersion != '') {
        itsm["id"] = "14fd99c2dbc61b0013c2755a8c9619e8";
        itsm["type"] = "application";
        itsm["load_demo_data"] = false;
        itsm["requested_version"] = itsmVersion;
        packages.push(itsm);
    }
    // asset["notes"] = "";
    // asset["requested_customization_version"] "";
    payload["name"] = "Install all Tenable plugins";
    payload["notes"] = "Install 4 of the Tenable plugins";
    payload["packages"] = packages;

    return JSON.stringify(payload);
}
