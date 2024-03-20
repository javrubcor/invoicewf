sap.ui.define([], function () {
	"use strict";
	return {

		//   };

		// });

		// invoicewf.invoicewf.Conversions = (function () {
		// var u = jQuery.sap.getModulePath("invoicewf.invoicewf") + "/utility/ProcessLogConfig.json";
		// var p;

		formatterActionIcon: function (S, r) {
			var u = jQuery.sap.getModulePath("invoicewf.invoicewf") + "/utility/ProcessLogConfig.json";
			var p;

			var e;
			e = this._getWorkflowLogStatusName(S);

			// var c = function () {
			// 	this.oEventSource.updateAggregation("items");
			// 	this.oEventSource.rerender();
			// };			

			if (r) {
				if (r.toUpperCase() === "NEGATIVE") {
					e = "REJECTED";
				} else if (r.toUpperCase() === "POSITIVE") {
					e = "APPROVED";
				}
			}
			if (!p) {
				p = jQuery.sap.sjax({
					url: u,
					dataType: "json"
				}).data || {};
			}
			return p[e] && p[e].icon;
		},

		_getWorkflowLogStatusName: function (S) {
			var e;
			switch (S) {
			case "READY":
				e = "WORKFLOW_TASK_CREATED";
				break;
			case "IN_PROGRESS":
				e = "WORKFLOW_TASK_IN_PROGRESS";
				break;
			case "COMPLETED":
				e = "WORKFLOW_TASK_COMPLETED";
				break;
			case "WORKFLOW_STARTED":
				e = S;
				break;
			case "FOR_RESUBMISSION":
				e = "WORKFLOW_TASK_SUSPENDEDED";
				break;
			case "CANCELLED":
				e = "WORKFLOW_TASK_CANCELED";
				break;
			}
			return e;
		}
	};
});