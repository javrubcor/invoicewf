sap.ui.define([
	'sap/ui/model/json/JSONModel'
], function (JSONModel) {
	"use strict";
	return {

		// colorstatus: function (DaysTillDue) {
		// 	// var e = 20;
		// 	//if (iNo < 50) {
		// 	// if (iNo < 20) {
		// 	// return sap.ui.core.ValueState.Error;
		// 	// } else {
		// 	//  return sap.ui.core.ValueState.Warning; 
		// 	// }
		// 	//} else {
		// 	// return sap.ui.core.ValueState.Success;
		// 	//}
		// 	// console.log('I WILL DO NOTHING!');
		// 	this.addStyleClass("yellowTxtHlight");
		// 	return DaysTillDue;
		// 	// return e;
		// },

		formatterActionIcon: function (S, r) {
			// get the path to the JSON file			
			var u = jQuery.sap.getModulePath("invoicewf.invoicewf") + "ext/utility/ProcessLogConfig.json";
			// var u = jQuery.sap.getModulePath("invoicewf.invoicewf", "ext/utility/ProcessLogConfig.json");

			// // initialize the model with the JSON file
			// var oModel = new JSONModel(u);

			// // set the model to the view
			// this.getView().setModel(oModel, "ProcessLogConfig");

			// Data is fetched here
			//jQuery.ajax(u, {   // load the data from a relative URL (the Data.json file in the same directory)
			//dataType: "json",
			//success: function(data){
			//var oModel = new sap.ui.model.json.JSONModel(data);
			//this.getView().setModel(oModel);
			//}
			//});

			////////////////////////////////////			

			// var sUrl = "/invoicewf.invoicewf/ext/utility/ProcessLogConfig.json";

			// jQuery.ajax({
			// 	type: "GET",
			// 	dataType: "json",
			// 	contentType : "application/json",
			// 	url: sUrl,
			// 	async: false,
			// 	// context: this,
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		var sMessage = jqXHR.status + " " + jqXHR.statusText + " " + jqXHR.responseText;
			// 		jQuery.sap.log.error("Data loading", sMessage, "index.html");
			// 		sap.m.MessageToast.show(sMessage);
			// 	},
			// 	success: function (oData, textStatus, jqXHR) {
			// 		if (oData === null || oData === undefined) {
			// 			var sMessage = "WARNING. Received a null or undefined response object.";
			// 			jQuery.sap.log.warning("Data loading", sMessage, "index.html");
			// 			sap.m.MessageToast.show(sMessage);
			// 			return;
			// 		}

			// 		var oModel = new sap.ui.model.json.JSONModel(oData);
			// 		var oList = this.byId("list");
			// 		oList.setModel(oModel);

			// 	}
			// });

			///////////////////////////////////////////////////////////

			// jQuery.ajax({
			// 	url: "mockData/Local.json",
			// 	dataType: "json",
			// 	success: function (data, textStatus, jqXHR) {
			// 		var jsonmodel = new sap.ui.model.json.JSONModel();
			// 		jsonmodel.setData(data);
			// 		sap.ui.getCore().setModel(jsonmodel, 'testmodel');
			// 		// mycontroller.List1.setModel(jsonmodel)
			// 	}
			// });

			////////////////////////////////////////////////////////////

			// oModel.getProperty(“/d/results”);			

			var p;

			var e;
			switch (S) {
			case "CREATED":
				e = "sap-icon://create";
				break;
			case "EXECUTED":
				e = "sap-icon://begin";
				break;
			case "REJECTED":
				e = "sap-icon://inspect-down";
				break;
			case "APPROVED":
				e = "sap-icon://complete";
				break;
			case "FORWARDED":
				e = "sap-icon://forward";
				break;
			}
			return e;

			// var e = this._getWorkflowLogStatusName(S);

			if (r) {
				if (r.toUpperCase() === "NEGATIVE") {
					e = "REJECTED";
				} else if (r.toUpperCase() === "POSITIVE") {
					e = "APPROVED";
				}
			}

			// var collection = this.getView().getModel("oModelq").getData().collection;
			// var index = $.inArray(e, $.map(collection, function (n) {
			// 	return n.nr;
			// }));
			// this.getView().getModel("oModelq").getProperty("/collection/" + index);

			////

			// if (!p) {
			// 	p = jQuery.sap.sjax({
			// 		url: u,
			// 		dataType: "json"
			// 	}).data || {};
			// }
			// return p[e] && p[e].icon;

		}

	};
});