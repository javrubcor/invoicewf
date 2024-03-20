sap.ui.controller("invoicewf.invoicewf.ext.controller.ObjectPageExt", {

	onInit: function () {

		that = this;

		//Convert Invoice Smart field into URL
		var oInv = this.getView().byId(
			"invoicewf.invoicewf::sap.suite.ui.generic.template.ObjectPage.view.Details::Invoice_HeaderSet--BasicData::InvoiceID::Field"
		);
		if (oInv) {
			oInv.attachPress(this.onOpenInvoice);
		}

		//Convert PO Smart field into URL
		var oPN = this.getView().byId(
			"invoicewf.invoicewf::sap.suite.ui.generic.template.ObjectPage.view.Details::Invoice_HeaderSet--Purchaseorder::HeaderToDetail::PoNumber::Field"
		);
		if (oPN) {
			oPN.attachPress(this.onOpenPurchaseN);
		}

	},

	onAfterRendering: function () {

	},

	formatEmail: function (Username) {

		///
		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oHost = oProperty.Host;
		var oMandt = oProperty.Mandt;
		var oInvoiceID = oProperty.InvoiceID;
		var oFiscalYear = oProperty.FiscalYear;
		var oSystem = oProperty.System;

		this.oModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.oModel, "oModelEmail");
		this.oModel.setData({
			Host: oHost,
			Mandt: oMandt,
			InvoiceID: oInvoiceID,
			FiscalYear: oFiscalYear,
			System: oSystem
		});

		var oSystem = oProperty.System;
		var oEmail;

		var oModel, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		var readURL = oModel.createKey("/User_EmailSet", {

			Username: Username,
			System: oSystem

		});

		sap.ui.core.BusyIndicator.show();
		oModel.read(readURL, {
			async: false,

			success: function (data, response) {
				sap.ui.core.BusyIndicator.hide();
				oEmail = data.EmailAddress;

			},
			error: function (oError) {
				var sErrorMsg;
				if (oError && oError.responseText) {
					try {
						if (JSON.parse(oError.responseText) && JSON.parse(oError.responseText).error) { //an error happened
							sErrorMsg = JSON.parse(oError.responseText).error.message.value;
						}
					} catch (e) {
						if (oError.responseText.indexOf("timed out") !== -1) {
							sErrorMsg = "Connection timed out. Please try later.";
						}
						if (oError.responseText.indexOf("Administrator") !== -1) {
							sErrorMsg = "Backend Error. Contact administrator. See ST22 log.";
						}
					}
				}
				// var sErrorMsg = "There was an error when editing the email";
				sap.m.MessageToast.show(sErrorMsg, {
					duration: 6000,
					width: "20em",
					closeOnBrowserNavigation: false
				});
			}
		});

		return oEmail;
	},

	onOpenInvoice: function (oEvent) {

		// Get the current invoice
		var oView = that.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFYear = oProperty.FiscalYear;
		var oHost = oProperty.Host;
		var oMandt = oProperty.Mandt;
		var oSystem = oProperty.System;

		if (oHost === "pl0306" || oHost === "pl5219") { //Prod system sapc & sapm  

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur.howdens.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*MIR4%20RBKP-BELNR=" +
					oInvoiceID + "RBKP-GJAHR=" + oFYear + "DYNP_OKCODE=SHOW";

			} else { //SAPM

				var sURL =
					"http://" + oHost + ".eur.howdens.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*MIR4%20RBKP-BELNR=" +
					oInvoiceID + "RBKP-GJAHR=" + oFYear + "DYNP_OKCODE=SHOW";
			}

		} else {

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*MIR4%20RBKP-BELNR=" +
					oInvoiceID + "RBKP-GJAHR=" + oFYear + "DYNP_OKCODE=SHOW";

			} else { //SAPM

				if (oHost === "dl6219") {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*MIR4%20RBKP-BELNR=" +
						oInvoiceID + "RBKP-GJAHR=" + oFYear + "DYNP_OKCODE=SHOW";

				} else {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*MIR4%20RBKP-BELNR=" +
						oInvoiceID + "RBKP-GJAHR=" + oFYear + "DYNP_OKCODE=SHOW";
				}

			}

		}

		window.open(sURL);

	},

	onOpenPurchaseN: function (oEvent) {

		var oView = that.getView();
		var oNavControl = that.extensionAPI.getNavigationController();
		var oModel = that.getOwnerComponent().getModel();
		var sPath = oEvent.getSource().getBindingContext().getPath();
		var oPo = oModel.getProperty(sPath + "/HeaderToDetail");
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oHost = oProperty.Host;
		var oMandt = oProperty.Mandt;
		var oSystem = oProperty.System;

		if (oHost === "pl0306" || oHost === "pl5219") { //Prod system sapc & sapm  

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur.howdens.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*OLR3_ME2XN%20OLR3_R3_TS_PDOC-EBELN=" +
					oPo.PoNumber + "DYNP_OKCODE=SHOW";

			} else { //SAPM				

				var sURL =
					"http://" + oHost + ".eur.howdens.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*OLR3_ME2XN%20OLR3_R3_TS_PDOC-EBELN=" +
					oPo.PoNumber + "DYNP_OKCODE=SHOW";

			}

		} else {

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*OLR3_ME2XN%20OLR3_R3_TS_PDOC-EBELN=" +
					oPo.PoNumber + "DYNP_OKCODE=SHOW";

			} else { //SAPM

				if (oHost === "dl6219") {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*OLR3_ME2XN%20OLR3_R3_TS_PDOC-EBELN=" +
						oPo.PoNumber + "DYNP_OKCODE=SHOW";

				} else {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*OLR3_ME2XN%20OLR3_R3_TS_PDOC-EBELN=" +
						oPo.PoNumber + "DYNP_OKCODE=SHOW";
				}
			}

		}

		window.open(sURL);

	},

	onClickActionInvoice_HeaderSetHeader1: function (oEvent) {

		that = this;

		// Get the current invoice
		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFiscalYear = oProperty.FiscalYear;
		var oSystem = oProperty.System;
		
		var oFilter = "UserModel>/UserlistSet?$filter=Lastname eq " + "'" + oSystem + "'";

		var oModel, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";

//		var oModel, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModel = new sap.ui.model.odata.ODataModel(sURL, true);
		new sap.ui.getCore().setModel(oModel, "UserModel");

		var oDialog = new sap.m.Dialog({
			title: "Forward  " + oInvoiceID + "  to:",
			resizable: true,

			content: [

				new sap.m.Input({
					id: "UserInput",
					showSuggestion: true,
					startSuggestion: 0,

					suggest: function (oEvent) {
						oEvent.getSource().setFilterFunction(function (sTerm, oItem) {
							// A case-insensitive "string contains" style filter
							return oItem.getText().match(new RegExp(sTerm, "i"));
						});
					},

					// suggest: function (oEvent) {

					// 	var sTerm = oEvent.getParameter("suggestValue");
					// 	var aFilters = [];

					// 	// var oSystemsTerm = oSystem + sTerm;
					// 	// oSystemsTerm.concat(oSystem, sTerm);

					// 	if (sTerm) {

					// 		aFilters.push(new sap.ui.model.Filter("Username", sap.ui.model.FilterOperator.Contains, sTerm));
					// 		// aFilters.push(new sap.ui.model.Filter(substringof(sTerm,"Username"), FilterOperator.EQ, true));
					// 	}
					// 	oEvent.mParameters.suggestValue = sTerm;
					// 	oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
					// },
					
					// /entitySet?$filter=region eq 'country'
					
					suggestionItems: {
						// path: "FirstModel>/UserlistSet",
						// path: "FirstModel>/UserlistSet?$filter=Lastname eq 'SAPC'",
						   path: oFilter,
						template: new sap.ui.core.Item({
							text: "{UserModel>Fullname}"
						})
					}
				}),

				new sap.m.Bar({
					design: "Footer",
					contentRight: new sap.m.Button({
						text: "OK",
						press: function (oEvent) {

							var oUser = sap.ui.getCore().byId("UserInput").getValue();

							var oResult = oUser.indexOf(" -");
							var oFinal = oUser.slice(0, oResult);

							var oModel, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";							
//							var oModel, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
							oModel = new sap.ui.model.odata.ODataModel(sURL, true);

							var that = this;

							oModel.callFunction("Forward", // function import name
								"POST", // http method
								// function import parameters
								{
									"InvoiceID": oInvoiceID,
									"FiscalYear": oFiscalYear,
									"System": oSystem,
									"ForwardTo": oFinal
								},
								null,
								function (oData, response) {

									if (response && response.headers && response.headers["sap-message"]) {
										if (JSON.parse(response.headers["sap-message"])) {
											if (JSON.parse(response.headers["sap-message"]).severity === "error") { //an error happened      
												sap.m.MessageBox.error(JSON.parse(response.headers["sap-message"]).message, {
													title: "Error"
												});
											} else {
												sap.m.MessageBox.success(JSON.parse(response.headers["sap-message"]).message, {
													title: "Success"
												});

											}
										}

									}

								}, // callback function for success
								function (oError) {

									var sErrorMsg = "There was an error when forwarding the invoice";
									if (oError && oError.responseText) {
										try {
											if (JSON.parse(oError.responseText) && JSON.parse(oError.responseText).error) { //an error happened
												sErrorMsg = JSON.parse(oError.responseText).error.message.value;
											}
										} catch (e) {
											if (oError.responseText.indexOf("timed out") !== -1) {
												sErrorMsg = "Connection timed out. Please try later.";
											}
											if (oError.responseText.indexOf("Administrator") !== -1) {
												sErrorMsg = "Backend Error. Contact administrator. See ST22 log.";
											}
										}
									}
									sap.m.MessageToast.show(sErrorMsg, {
										duration: 6000,
										width: "20em",
										closeOnBrowserNavigation: false
									});

								}); // callback function for error

							oDialog.close();

						}
					}),

					contentMiddle: new sap.m.Button({
						text: "Cancel",
						press: function (oEvent) {
							oDialog.close();
						}
					})
				})

			],

			afterClose: function () {
				oDialog.destroy();

				that.extensionAPI.refresh();
			}
		});

		oDialog.open();

		///////\\\\\\\
		// that = this;

		// // Get the current invoice
		// var oView = this.getView();
		// var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		// var oInvoiceID = oProperty.InvoiceID;
		// var oFiscalYear = oProperty.FiscalYear;
		// var oSystem = oProperty.System;

		// var data = {
		// 	Entity1: [{
		// 		"Username": "CORRALJ",
		// 		"Fullname": "Test1"
		// 	}, {
		// 		"Username": "ROBERTSA",
		// 		"Fullname": "Test2"
		// 	}, {
		// 		"Username": "CORRALZ",
		// 		"Fullname": "Test3"
		// 	}, ]
		// }

		// var oModel = new sap.ui.model.json.JSONModel();
		// oModel.setData(data);
		// new sap.ui.getCore().setModel(oModel, "FirstModel");

		// var oDialog = new sap.m.Dialog({
		// 	title: "Forward  " + oInvoiceID + "  to:",
		// 	resizable: true,

		// 	content: [

		// 		new sap.m.Input({
		// 			id: "shopInput",
		// 			showSuggestion: true,
		// 			suggest: function (oEvent) {

		// 				// var oInput = oView.byId("shopInput");
		// 				// // var view = that.getView();
		// 				// var sTerm = oEvent.getParameter("suggestValue")
		// 				// oInput.setFilterFunction(function (sTerm, oItem) {
		// 				// 	return oItem.getText().match(new RegExp(sTerm, "i"));
		// 				// });

		// 				var sTerm = oEvent.getParameter("suggestValue");
		// 				var aFilters = [];
		// 				if (sTerm) {
		// 					aFilters.push(new sap.ui.model.Filter("Username", sap.ui.model.FilterOperator.Contains, sTerm));
		// 					// aFilters.push(new sap.ui.model.Filter(substringof(sTerm,"Username"), FilterOperator.EQ, true));
		// 				}
		// 				oEvent.mParameters.suggestValue = sTerm;
		// 				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		// 			},
		// 			suggestionItems: {
		// 				path: "FirstModel>/Entity1",
		// 				template: new sap.ui.core.Item({
		// 					text: "{FirstModel>Username}"
		// 				})
		// 			}
		// 		})
		// 	],
		// });

		// oDialog.open();
		////////\\\\\\\\\

		////////
		////////
		// var that = this;

		// // Get the current invoice
		// var oView = this.getView();
		// var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		// var oInvoiceID = oProperty.InvoiceID;
		// var oFiscalYear = oProperty.FiscalYear;
		// var oSystem = oProperty.System;

		// var oDialog = new sap.m.Dialog({
		// 	title: "Forward  " + oInvoiceID + "  to:",
		// 	resizable: true,
		// 	content: [

		// 		// Create the input field, binding the suggested items to the
		// 		// product objects in the data model
		// 		new sap.m.Input("input_assisted1", {
		// 			type: sap.m.InputType.Text,
		// 			placeholder: 'Enter User',
		// 			showValueHelp: true,
		// 			showSuggestion: true,
		// 			suggestionItems: {
		// 				path: "/UserlistSet",
		// 				template: new sap.ui.core.Item({
		// 					text: "{Username}"
		// 				})
		// 			},

		// 			valueHelpRequest: function (oEvent) {

		// 				var oModel, sURL = "/SAPC_DEV_DL1106/odata/SAP/Z1674_INVOICE_WORKFLOW_SRV/";
		// 				oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		// 				var fSys = new sap.ui.model.Filter('Lastname', "EQ", oSystem);

		// 				if (!this._valueHelpSelectDialog) {

		// 					this._valueHelpSelectDialog = new sap.m.SelectDialog({

		// 						items: {
		// 							path: "/UserlistSet",
		// 							template: new sap.m.StandardListItem({
		// 								title: "{Username}",
		// 								description: "{Fullname}",
		// 								active: true
		// 							}),

		// 							filters: [fSys]
		// 						},
		// 						search: function (oEvent) {
		// 							var sValue = oEvent.getParameter("value");
		// 							var oFilter = new sap.ui.model.Filter(
		// 								"Username",
		// 								sap.ui.model.FilterOperator.EQ, sValue
		// 							);
		// 							if (oFilter) {
		// 								oEvent.getSource().getBinding("items").filter([oFilter]);
		// 							}
		// 						},

		// 						confirm: function (oEvent) {
		// 							var oSelectedItem = oEvent.getParameter("selectedItem");
		// 							if (oSelectedItem) {
		// 								sap.ui.getCore().byId("input_assisted1").setValue(oSelectedItem.getTitle());
		// 							}
		// 							oEvent.getSource().getBinding("items").filter([]);

		// 						},

		// 					});

		// 					this._valueHelpSelectDialog.setModel(oModel);

		// 				} else {
		// 					this._valueHelpSelectDialog.setModel(oModel);
		// 				}
		// 				this._valueHelpSelectDialog.open();

		// 			}
		// 		}),

		// 		new sap.m.Bar({
		// 			design: "Footer",
		// 			contentRight: new sap.m.Button({
		// 				text: "OK",
		// 				press: function (oEvent) {

		// 					var oUser = sap.ui.getCore().byId("input_assisted1").getValue();

		// 					var oModel, sURL = "/SAPC_DEV_DL1106/odata/SAP/Z1674_INVOICE_WORKFLOW_SRV/";
		// 					oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		// 					var that = this;

		// 					oModel.callFunction("Forward", // function import name
		// 						"POST", // http method
		// 						// function import parameters
		// 						{
		// 							"InvoiceID": oInvoiceID,
		// 							"FiscalYear": oFiscalYear,
		// 							"System": oSystem,
		// 							"ForwardTo": oUser
		// 						},
		// 						null,
		// 						function (oData, response) {

		// 							if (response && response.headers && response.headers["sap-message"]) {
		// 								if (JSON.parse(response.headers["sap-message"])) {
		// 									if (JSON.parse(response.headers["sap-message"]).severity === "error") { //an error happened      
		// 										sap.m.MessageBox.error(JSON.parse(response.headers["sap-message"]).message, {
		// 											title: "Error"
		// 										});
		// 									} else {
		// 										sap.m.MessageBox.success(JSON.parse(response.headers["sap-message"]).message, {
		// 											title: "Success"
		// 										});

		// 									}
		// 								}

		// 							}

		// 						}, // callback function for success
		// 						function (oError) {

		// 							var sErrorMsg = "There was an error when forwarding the invoice";
		// 							if (oError && oError.responseText) {
		// 								try {
		// 									if (JSON.parse(oError.responseText) && JSON.parse(oError.responseText).error) { //an error happened
		// 										sErrorMsg = JSON.parse(oError.responseText).error.message.value;
		// 									}
		// 								} catch (e) {
		// 									if (oError.responseText.indexOf("timed out") !== -1) {
		// 										sErrorMsg = "Connection timed out. Please try later.";
		// 									}
		// 									if (oError.responseText.indexOf("Administrator") !== -1) {
		// 										sErrorMsg = "Backend Error. Contact administrator. See ST22 log.";
		// 									}
		// 								}
		// 							}
		// 							sap.m.MessageToast.show(sErrorMsg, {
		// 								duration: 6000,
		// 								width: "20em",
		// 								closeOnBrowserNavigation: false
		// 							});

		// 						}); // callback function for error

		// 					oDialog.close();

		// 				}
		// 			}),

		// 			contentMiddle: new sap.m.Button({
		// 				text: "Cancel",
		// 				press: function (oEvent) {
		// 					oDialog.close();
		// 				}
		// 			})
		// 		})

		// 	],

		// 	afterClose: function () {
		// 		oDialog.destroy();

		// 		that.extensionAPI.refresh();
		// 	}

		// });

		// oDialog.open();
		//////
		//////

	},

	onClickActionInvoice_HeaderSetHeader2: function (oEvent) {

		// Get the current invoice
		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFYear = oProperty.FiscalYear;

		var sURL =
			"http://dl1106.eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=202&sap-language=EN&~transaction=*SWF_OBJ_EXEC_CL%20P_CATID=BO;P_TYPEID=BUS2081;P_INSTID=" +
			oInvoiceID + oFYear + ";P_METHOD=DISPLAY;DYNP_OKCODE=ONLI";

		window.open(sURL);

	},

	onClickActionInvoice_HeaderSetHeader3: function (oEvent) {

		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFiscalYear = oProperty.FiscalYear;
		var oText = oProperty.Text;
		var oSystem = oProperty.System;

		sap.ui.require.toUrl

		var oModel, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		var readURL = oModel.createKey("/Invoice_HeaderSet", {

			InvoiceID: oInvoiceID,
			FiscalYear: oFiscalYear,
			System: oSystem

		});

		sap.ui.core.BusyIndicator.show();
		oModel.read(readURL, {
			async: false,

			success: function (data, response) {
				sap.ui.core.BusyIndicator.hide();
				oText = data.Text;

			},
			error: function (oError) {
				var sErrorMsg = "There was an error when editing the notes";
				sap.m.MessageToast.show(sErrorMsg, {
					duration: 6000,
					width: "20em",
					closeOnBrowserNavigation: false
				});
			}
		});

		var dialog = new sap.m.Dialog({
			title: "Notes",
			type: "Message",

			content: [

				new sap.m.TextArea("notesTextarea", {
					value: oText,
					// value: "{/notesModel/0/Comments}",
					width: '100%',
					growing: false,
					rows: 4,
					wrapping: sap.ui.core.Wrapping.Hard,
					cols: 80 // #MagicNumber - that value is the way it has always been
						// placeholder: 'Add note (optional)'
				}),

			],
			endButton: new sap.m.Button({
				text: 'Save',
				press: function () {

					var oText = sap.ui.getCore().byId("notesTextarea").getValue();

					var oModel, 
					sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";					
					//sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
					oModel = new sap.ui.model.odata.ODataModel(sURL, true);

					oModel.callFunction("Notes", // function import name
						"POST", // http method
						// function import parameters
						{
							"InvoiceID": oInvoiceID,
							"FiscalYear": oFiscalYear,
							"System": oSystem,
							"Comments": oText
						},
						null,
						function (oData, response) {

							if (response && response.headers && response.headers["sap-message"]) {
								if (JSON.parse(response.headers["sap-message"])) {
									if (JSON.parse(response.headers["sap-message"]).severity === "error") { //an error happened      
										sap.m.MessageBox.error(JSON.parse(response.headers["sap-message"]).message, {
											title: "Error"
										});
									} else {
										sap.m.MessageBox.success(JSON.parse(response.headers["sap-message"]).message, {
											title: "Success"
										});
									}
								}
							}

						}, // callback function for success
						function (oError) {

							var sErrorMsg = "There was an error when editing the notes";
							if (oError && oError.responseText) {
								try {
									if (JSON.parse(oError.responseText) && JSON.parse(oError.responseText).error) { //an error happened
										sErrorMsg = JSON.parse(oError.responseText).error.message.value;
									}
								} catch (e) {
									if (oError.responseText.indexOf("timed out") !== -1) {
										sErrorMsg = "Connection timed out. Please try later.";
									}
									if (oError.responseText.indexOf("Administrator") !== -1) {
										sErrorMsg = "Backend Error. Contact administrator. See ST22 log.";
									}
								}
							}
							sap.m.MessageToast.show(sErrorMsg, {
								duration: 6000,
								width: "20em",
								closeOnBrowserNavigation: false
							});

						}); // callback function for error					

					dialog.close();
				}
			}),
			beginButton: new sap.m.Button({
				text: 'Cancel',
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function () {
				dialog.destroy();
			}

		});
		dialog.open();

	},
	onClickActionInvoice_HeaderSetSections1: function (oEvent) {

		var oModel, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
//		var oModel, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFiscalYear = oProperty.FiscalYear;
		var oSystem = oProperty.System;

		var oWFtext = oProperty.WorkflowStep;
		var oWFstatus = oProperty.WorkflowStatus;

		var dialog = new sap.m.Dialog({
			// title: oInvoiceID + " - " + oFiscalYear + " - " + oWFstatus + " - " + oWFtext,
			title: oWFstatus + " - " + oWFtext,
			type: "Message",
			contentWidth: "60%",

			endButton: new sap.m.Button({
				text: 'Close',
				press: function () {
					dialog.close();
				}
			}),

			afterClose: function () {
				dialog.destroy();
			}

		});

		var fInv = new sap.ui.model.Filter('InvoiceID', "EQ", oInvoiceID);
		var fFis = new sap.ui.model.Filter('FiscalYear', "EQ", oFiscalYear);
		var fSys = new sap.ui.model.Filter('System', "EQ", oSystem);

		var oTable = new sap.m.Table("oTable", {
			columns: [new sap.m.Column({
					// header: new sap.m.Label({
					// 	text: "Icon"
					// })
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text: "Action"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text: "Name"
					})
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text: "Date"
					})
				}),
			],

			items: {
				path: '/ProcessingLogSet',

				template: new sap.m.ColumnListItem({
					cells: [

						new sap.ui.core.Icon({
							src: {
								path: "ActionName",
								formatter: function (ActionName) {

									var u = jQuery.sap.getModulePath("invoicewf.invoicewf") + "/utility/ProcessLogConfig.json";
									var p;
									var e;

									if (!p) {
										p = jQuery.sap.sjax({
											url: u,
											dataType: "json"
										}).data || {};
									}
									// return p[ActionName] && p[ActionName].icon;
									return p[ActionName].icon;

								}

							}

						}),

						new sap.m.Text({
							text: "{ActionName}"
						}),
						new sap.m.Text({
							text: "{PerformedByName}"
						}),
						new sap.m.Text({
							text: "{Timestamp}"
						})
					]
				}),

				filters: [fInv, fFis, fSys]

			}

		});

		oTable.setModel(oModel);

		dialog.addContent(oTable);

		dialog.open();

	},
	onClickActionInvoice_HeaderSetHeader4: function (oEvent) {

		var oModel, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";		
//		var oModel, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModel = new sap.ui.model.odata.ODataModel(sURL, true);

		var oView = this.getView();
		var oProperty = oView.getModel().getProperty(oView.getBindingContext().sPath);
		var oInvoiceID = oProperty.InvoiceID;
		var oFiscalYear = oProperty.FiscalYear;
		var oSystem = oProperty.System;

		var that = this;

		oModel.callFunction("Replace", // function import name
			"POST", // http method
			// function import parameters
			{
				"InvoiceID": oInvoiceID,
				"FiscalYear": oFiscalYear,
				"System": oSystem

			},
			null,
			function (oData, response) {

				if (response && response.headers && response.headers["sap-message"]) {
					if (JSON.parse(response.headers["sap-message"])) {
						if (JSON.parse(response.headers["sap-message"]).severity === "error") { //an error happened      
							sap.m.MessageBox.error(JSON.parse(response.headers["sap-message"]).message, {
								title: "Error"
							});
						} else {
							sap.m.MessageBox.success(JSON.parse(response.headers["sap-message"]).message, {
								title: "Success"
							});
						}
					}

				}

			}, // callback function for success
			function (oError) {

				var sErrorMsg = "There was an error when replacing the workitem";
				if (oError && oError.responseText) {
					try {
						if (JSON.parse(oError.responseText) && JSON.parse(oError.responseText).error) { //an error happened
							sErrorMsg = JSON.parse(oError.responseText).error.message.value;
						}
					} catch (e) {
						if (oError.responseText.indexOf("timed out") !== -1) {
							sErrorMsg = "Connection timed out. Please try later.";
						}
						if (oError.responseText.indexOf("Administrator") !== -1) {
							sErrorMsg = "Backend Error. Contact administrator. See ST22 log.";
						}
					}
				}
				sap.m.MessageToast.show(sErrorMsg, {
					duration: 6000,
					width: "20em",
					closeOnBrowserNavigation: false
				});

			}); // callback function for error			

		that.extensionAPI.refresh();

	},

	// ,
	// onClickActionInvoice_HeaderSetSections1: function (oEvent) {}

	onOpenEmail: function (oEvent) {

		var oWI;
		var oModel = sap.ui.getCore().getModel("oModelEmail");
		var oHost = oModel.getProperty("/Host");
		var oMandt = oModel.getProperty("/Mandt");
		var oInvoiceID = oModel.getProperty("/InvoiceID");
		var oFiscalYear = oModel.getProperty("/FiscalYear");
		var oSystem = oModel.getProperty("/System");
		///
		///

		var oModelMain, sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";		
//		var oModelMain, sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		oModelMain = new sap.ui.model.odata.ODataModel(sURL, true);

		var readURL = oModelMain.createKey("/Invoice_HeaderSet", {

			InvoiceID: oInvoiceID,
			FiscalYear: oFiscalYear,
			System: oSystem

		});

		sap.ui.core.BusyIndicator.show();
		oModelMain.read(readURL, {
			async: false,
			// filters: [new sap.ui.model.Filter("InvoiceID", sap.ui.model.FilterOperator.EQ, oInvoiceID)],

			success: function (data, response) {
				sap.ui.core.BusyIndicator.hide();
				oWI = data.WorkitemID;

			},
			error: function (oError) {
				var sErrorMsg = "There was an error when generating the Email";
				sap.m.MessageToast.show(sErrorMsg, {
					duration: 6000,
					width: "20em",
					closeOnBrowserNavigation: false
				});
			}
		});

		if (oHost === "pl0306" || oHost === "pl5219") { //Prod system sapc & sapm

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur.howdens.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*SWNWIEX%20P_WI_ID=" + oWI + ";P_APPL=UWL;P_ACTION=EXECUTE;DYNP_OKCODE=ONLI";

			} else { //SAPM

				"http://" + oHost + ".eur.howdens.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*SWNWIEX%20P_WI_ID=" + oWI + ";P_APPL=UWL;P_ACTION=EXECUTE;DYNP_OKCODE=ONLI";

			}

		} else {

			if (oSystem === "SAPC") {

				var sURL =
					"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
					"&sap-language=EN&~transaction=*SWNWIEX%20P_WI_ID=" + oWI + ";P_APPL=UWL;P_ACTION=EXECUTE;DYNP_OKCODE=ONLI";

			} else { //SAPM			

				if (oHost === "dl6219") {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:8000/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*SWNWIEX%20P_WI_ID=" + oWI + ";P_APPL=UWL;P_ACTION=EXECUTE;DYNP_OKCODE=ONLI";

				} else {

					var sURL =
						"http://" + oHost + ".eur-d.howdev.corp:1080/sap/bc/gui/sap/its/webgui/?sap-client=" + oMandt +
						"&sap-language=EN&~transaction=*SWNWIEX%20P_WI_ID=" + oWI + ";P_APPL=UWL;P_ACTION=EXECUTE;DYNP_OKCODE=ONLI";

				}
			}

		}

		var oBodyText = `Dear user,

Please click on the link below to approve/reject this invoice 

Regards`;

		sap.m.URLHelper.triggerEmail(oEvent.getSource().mProperties.text, "Invoice n. " + oInvoiceID + " - " + oFiscalYear, oBodyText +
			" - " +
			sURL);

	}

});