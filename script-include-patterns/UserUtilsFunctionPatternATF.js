
// Server Side Script
(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Unit test for UserUtilsFunctionPattern', function() {

        var user_sys_id = steps("d2103b5a877101106d1c52873cbb3563").user.sys_id;
        var user_locked_out = steps("d2103b5a877101106d1c52873cbb3563").user.locked_out; // or params.u_locked_out;


        if (user_locked_out) {
            it('locked out user returns true then user does not update', function() {
				// check the record update count
                var checkRec = new GlideRecord('sys_user');
                checkRec.get(user_sys_id);
                var checkMod = Number(checkRec.sys_mod_count);
				
				// run the script
                var result = global.UserUtilsFunctionPattern(user_sys_id);
				
				// check the record update count
                var checkUpdateGR = new GlideRecord('sys_user');
                checkUpdateGR.get(user_sys_id);
                var checkUpdate = Number(checkUpdateGR.sys_mod_count);
				// compare it was not updated
                expect(checkUpdate).toEqual(checkMod);

            });
        } else {
            it('not locked out user returns false and user does update', function() {
				// check the record update count
				var checkRec2 = new GlideRecord('sys_user');
                checkRec2.get(user_sys_id);
                var checkMod2 = Number(checkRec2.sys_mod_count);

				// run the script
                var result = global.UserUtilsFunctionPattern(user_sys_id);
				
				// check the record update count 
                var checkUpdateGR2 = new GlideRecord('sys_user');
                checkUpdateGR2.get(user_sys_id);
                var checkUpdate2 = Number(checkUpdateGR2.sys_mod_count);
				gs.print(checkUpdate2);
				// compare that it was updated 
                expect(checkUpdate2).toEqual(checkMod2 + 1);
            });
        }




    });

})(outputs, steps, params, stepResult, assertEqual);
// uncomment the next line to execute this script as a jasmine test
jasmine.getEnv().execute();
