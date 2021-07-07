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
				}, {
					"Store Name": "6 Days",
					"Revenue": 11
				}, {
					"Store Name": "5 Days",
					"Revenue": 7
				}, {
					"Store Name": "4 Days",
					"Revenue": 11
				}, {
					"Store Name": "3 Days",
					"Revenue": 11
				}, {
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
				}, {
					"Store Name": "Apr",
					"Revenue": 34
				}, {
					"Store Name": "May",
					"Revenue": 7
				}, {
					"Store Name": "Jun",
					"Revenue": 45
				}]

			});
			this.getView().setModel(oModel);
			this.getView().setModel(new JSONModel({
				busy: false,
				VendorCode: "0000200323",
				plant: "1031",
				showAdvancedSearch: false
			}), "viewModel");
			// this._getUserDetails();
			// this._getDataforDashboard();
			if (!sap.ushell) {} else {
				if (sap.ui.getCore().plants != undefined) {
					if (sap.ui.getCore().plants.hasOwnProperty("plant")) {
						if (sap.ui.getCore().plants.plant) {
							this.getView().getModel("viewModel").setProperty("/plant", sap.ui.getCore().plants.plant);
							this._getDataforDashboard();
						}
					}
					sap.ui.getCore().plants.registerListener(function (val) {
						if (val) {
							this.getView().getModel("viewModel").setProperty("/plant", val);
							this._getDataforDashboard();
						}
					}.bind(this));
				}
			}
		},
		setDate: function (sValue) {
			if (sValue == null || sValue == "" || sValue == undefined) {
				return (new Date()).toDateString();
			} else {
				return sValue.toDateString();
			}
		},
		_getDataforDashboard: function () {
			this.getView().getModel("viewModel").setProperty("/busy", true);
			var filter = [];
			filter.push(new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, this.getView().getModel("viewModel").getProperty(
				"/VendorCode")));
			filter.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.getView().getModel("viewModel").getProperty(
				"/plant")));
			this.getOwnerComponent().getModel().read("/QprReportSet", {
				filters: filter,
				success: function (oData) {
					var items = []
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].Status == 'Outstanding notification') {
							items.push(oData.results[i]);
						}
					}
					this.getView().getModel("viewModel").setProperty("/pendingItemsCount", items.length);
					this.getView().getModel("viewModel").setProperty("/pendingItems", items.splice(0, 3));
					this.getView().getModel("viewModel").setProperty("/busy", false);
				}.bind(this),
				error: function (oData) {

				}.bind(this)
			});
		},
		_getAllPlants: function (vendorid) {
			jQuery.ajax({
				type: "GET",
				contentType: "application/x-www-form-urlencoded",
				headers: {
					"Authorization": "Basic NDMyYjNjZjMtNGE1OS0zOWRiLWEwMWMtYzM5YzhjNGYyNTNkOjk2NTJmOTM0LTkwMmEtMzE1MS05OWNiLWVjZTE1MmJkZGQ1NA=="
				},
				url: "/token/accounts/c70391893/vendor/plants?vendorId=" + vendorid,
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					this.plants = data.plants;
					// this.currPlant = this.plants.find(x => x.id === this.plant).name;
					var plantModel = new JSONModel(data);
					this.getOwnerComponent().setModel(plantModel, "plantModel");
					this._getDataforDashboard();
				}.bind(this),
				error: function (data) {
					// console.log("error", data);
				}
			});
		},
		_getVendorName: function (role, user) {
			if (role === "Vendor") {
				jQuery.ajax({
					type: "GET",
					contentType: "application/x-www-form-urlencoded",
					headers: {
						"Authorization": "Basic NDMyYjNjZjMtNGE1OS0zOWRiLWEwMWMtYzM5YzhjNGYyNTNkOjk2NTJmOTM0LTkwMmEtMzE1MS05OWNiLWVjZTE1MmJkZGQ1NA=="
					},
					url: "/token/accounts/c70391893/users/groups?userId=" + user,
					async: false,
					success: function (data, textStatus, jqXHR) {
						var vendorid = data.groups[0].name;
						// data = JSON.stringify(data);
						this.getView().getModel("viewModel").setProperty("/VendorId", vendorid);
						this._getAllPlants(vendorid);
					}.bind(this),
					error: function (data) {
						// console.log("error", data);
					}
				});

			}
		},
		_getCurrentUserRole: function (user) {
			jQuery.ajax({
				type: "GET",
				contentType: "application/x-www-form-urlencoded",
				headers: {
					"Authorization": "Basic NDMyYjNjZjMtNGE1OS0zOWRiLWEwMWMtYzM5YzhjNGYyNTNkOjk2NTJmOTM0LTkwMmEtMzE1MS05OWNiLWVjZTE1MmJkZGQ1NA=="
				},
				url: "/token/accounts/c70391893/users/roles?userId=" + user,

				async: false,
				success: function (data, textStatus, jqXHR) {
					var role = data.result.roles[0].name;
					if (role === "Admin" || role == "Purchase") {
						this.getView().getModel("viewModel").setProperty("/showAdvancedSearch", true);
						this._getPlantsForUser(user);
					} else {
						this.getView().getModel("viewModel").setProperty("/showAdvancedSearch", false);
						this._getVendorName(role, user);
					}
				}.bind(this),
				error: function (data) {
					// console.log("error", data);
				}
			});
		},
		_getPlantsForUser: function (user) {
			jQuery.ajax({
				type: "GET",
				contentType: "application/x-www-form-urlencoded",
				headers: {
					"Authorization": "Basic NDMyYjNjZjMtNGE1OS0zOWRiLWEwMWMtYzM5YzhjNGYyNTNkOjk2NTJmOTM0LTkwMmEtMzE1MS05OWNiLWVjZTE1MmJkZGQ1NA=="
				},
				url: "/token/accounts/c70391893/users/groups/plants?userId=" + user,
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					this.plants = data.plants;
					// this.currPlant = this.plants.find(x => x.id === this.plant).name;
					var plantModel = new JSONModel(data);
					this.getOwnerComponent().setModel(plantModel, "plantModel");
				}.bind(this),
				error: function (data) {
					// console.log("error", data);
				}
			});
		},
		_getUserDetails: function () {
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/services/userapi/currentUser",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					var user = data.name,
						name = data.firstName;
					// user = "akmalhotra@mindagroup.com";
					user = "Delhi@shankarmoulding.com";
					this._getCurrentUserRole(user);
				}.bind(this)
			});

		},
		onChangePlant: function (oEvent) {
			debugger;
			this.getView().getModel("viewModel").setProperty("/plant", oEvent.getSource().getSelectedItem().getKey());
			jQuery.ajax({
				type: "GET",
				contentType: "application/x-www-form-urlencoded",
				headers: {
					"Authorization": "Basic NDMyYjNjZjMtNGE1OS0zOWRiLWEwMWMtYzM5YzhjNGYyNTNkOjk2NTJmOTM0LTkwMmEtMzE1MS05OWNiLWVjZTE1MmJkZGQ1NA=="
				},
				url: "/token/accounts/c70391893/plant/vendors?plantId=" + oEvent.getSource().getSelectedItem().getKey(),
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					this.plants = data.plants;
					this.getOwnerComponent().setModel(new JSONModel(data), "vendorModel");
				}.bind(this),
				error: function (data) {
					// console.log("error", data);
				}
			});
		},
		onChangeVendor: function (oEvent) {
			this.getView().getModel("viewModel").setProperty("/vendor", oEvent.getSource().getSelectedItem().getKey());
			this._getDataforDashboard();
		}

	});

});