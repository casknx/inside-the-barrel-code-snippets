/*

Pros: 
- Simple
- Can do a lot with vanilla javascript (pass around functions, etc)
- Nested functions are private

Cons:
- Organization (You can end up with a lot of script includes.
- Can't easily unit test nested functions unless we return them within the higher functions 

// Examples
CodeSearch
FileTypeWorkflowHandler
Inspiration from: https://codecreative.io/blog/interface-design-patterns-for-script-includes/

Name: UserUtilsFunctionPattern
Scope: Global
*/
var UserUtilsFunctionPattern = function(userRecordSYSID) {
    var setLockOut = function(userRecordSYSID) {
        var _lockedOutUser = function(userRecSYSID) {
            var grUser = new GlideRecord('sys_user');
            grUser.get(userRecSYSID);
            var locked_out = String(grUser.locked_out);
            gs.print("Is user locked out: " + locked_out);
            gs.print("Lockout type of: " + typeof(locked_out));
            if (locked_out == 'true') {
                return true;
            } else {
                return false;
            }
        };

        if (!this._lockedOutUser(userRecordSYSID)) {
            var grUserLock = new GlideRecord('sys_user');
            grUserLock.get(userRecordSYSID);
            grUserLock.locked_out = true;
            return grUserLock.update();
        } else {
            return 3;
        }
    };
    return setLockOut(userRecordSYSID);
};
