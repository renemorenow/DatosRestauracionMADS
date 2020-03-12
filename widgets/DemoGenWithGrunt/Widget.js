define(['dojo/_base/declare', 'jimu/BaseWidget'], function (declare, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

        // Custom widget code goes here

        baseClass: 'demo-gen-with-grunt',
        // this property is set by the framework when widget is loaded.
        // name: 'DemoGenWithGrunt',
        // add additional properties here

        //methods to communication with app container:
        postCreate: function () {
            this.inherited(arguments);
            console.log('DemoGenWithGrunt::postCreate');
        }

        // startup: function() {
        //   this.inherited(arguments);
        //   console.log('DemoGenWithGrunt::startup');
        // },

        // onOpen: function(){
        //   console.log('DemoGenWithGrunt::onOpen');
        // },

        // onClose: function(){
        //   console.log('DemoGenWithGrunt::onClose');
        // },

        // onMinimize: function(){
        //   console.log('DemoGenWithGrunt::onMinimize');
        // },

        // onMaximize: function(){
        //   console.log('DemoGenWithGrunt::onMaximize');
        // },

        // onSignIn: function(credential){
        //   console.log('DemoGenWithGrunt::onSignIn', credential);
        // },

        // onSignOut: function(){
        //   console.log('DemoGenWithGrunt::onSignOut');
        // }

        // onPositionChange: function(){
        //   console.log('DemoGenWithGrunt::onPositionChange');
        // },

        // resize: function(){
        //   console.log('DemoGenWithGrunt::resize');
        // }

        //methods to communication between widgets:

    });
});
