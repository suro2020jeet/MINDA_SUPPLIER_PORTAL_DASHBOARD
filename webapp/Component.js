sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/minda/SuppPortalDB/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.minda.SuppPortalDB.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			if (sap.ui.getCore().plants == undefined) {
 				sap.ui.getCore().plants = {
 					aInternal: "",
 					aListener: function (val) {},
 					set plant(val) {
 						this.aInternal = val;
 						this.aListener(val);
 					},
 					get plant() {
 						return this.aInternal;
 					},
 					registerListener: function (listener) {
 						debugger;
 						this.aListener = listener;
 					}
 				};
 			}
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});