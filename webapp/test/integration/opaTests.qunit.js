/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/minda/SuppPortalDB/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});