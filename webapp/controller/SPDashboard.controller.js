sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.minda.SuppPortalDB.controller.SPDashboard", {
		onInit: function () {
			var oModel = new JSONModel({
				"collection": [{
					"name": "S0113",
					"code": "Body",
					"since": "20/04/21",
					"quan": "39143",
					"fd": "4"
				}, {
					"name": "S0123",
					"code": "Body",
					"since": "20/04/21",
					"quan": "39143",
					"fd": "3"
				}, {
					"name": "S0133",
					"code": "Body",
					"since": "20/04/21",
					"quan": "39143",
					"fd": "7"
				}, {
					"name": "S0143",
					"code": "Body",
					"since": "20/04/21",
					"quan": "39143",
					"fd": "6"
				}],
				"reportedItems": [{
					"title": "S11098",
					"desc": "18/11/2013"
				}, {
					"title": "S21009",
					"desc": "10/10/2009"
				}, {
					"title": "S11120",
					"desc": "07/01/2010"
				}],

				"milk": [{
					"Store Name": "10+ Days",
					"Revenue": 48
				}, {
					"Store Name": "8 Days",
					"Revenue": 11
				}, {
					"Store Name": "7 Days",
					"Revenue": 5
				},{
					"Store Name": "6 Days",
					"Revenue": 11
				}, {
					"Store Name": "5 Days",
					"Revenue": 7
				},{
					"Store Name": "4 Days",
					"Revenue": 11
				},{
					"Store Name": "3 Days",
					"Revenue": 11
				},{
					"Store Name": "1 Day",
					"Revenue": 13
				}],
				"milk1": [{
					"Store Name": "Jan",
					"Revenue": 70
				}, {
					"Store Name": "Feb",
					"Revenue": 40
				}, {
					"Store Name": "Mar",
					"Revenue": 50
				},{
					"Store Name": "Apr",
					"Revenue": 34
				}, {
					"Store Name": "May",
					"Revenue": 7
				},{
					"Store Name": "Jun",
					"Revenue": 45
				}]

			});
			this.getView().setModel(oModel);
			this.getView().setModel(new JSONModel({
				busy: true
			}), "viewModel");
			var filter = [];
			filter.push(new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, '0000200323'));
			filter.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, "1033"));
			this.getOwnerComponent().getModel().read("/QprReportSet", {
				filters: filter,
				success: function(oData){
					var items = []
					for(var i = 0; i < oData.results.length; i++){
						if(oData.results[i].Status == 'Outstanding notification'){
							items.push(oData.results[i]);
						}
					}
					this.getView().getModel("viewModel").setProperty("/pendingItemsCount", items.length);
					this.getView().getModel("viewModel").setProperty("/pendingItems", items.splice(0, 3));
					this.getView().getModel("viewModel").setProperty("/busy", false);
				}.bind(this),
				error: function(oData){
					
				}.bind(this)
			});
		},
		setDate: function (sValue) {
			if (sValue == null || sValue == "" || sValue == undefined) {
				return (new Date()).toDateString();
			} else {
				return sValue.toDateString();
			}
		},

	});

});