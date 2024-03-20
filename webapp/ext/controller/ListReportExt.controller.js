sap.ui.controller("invoicewf.invoicewf.ext.controller.ListReportExt", {

	/*
	 * Content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */

	handleFiscalYear: function (oEvent) {
		var _oInput = oEvent.getSource();
		var val = _oInput.getValue();
		val = val.replace(/[^\d]/g, '');
		_oInput.setValue(val);

		var sUserInput = oEvent.getParameter("value");
		var oInputControl = oEvent.getSource();

		var oLenght = sUserInput.length;

		if (oLenght === 4) {
			oInputControl.setValueState(sap.ui.core.ValueState.Success);
		} else {
			oInputControl.setValueState(sap.ui.core.ValueState.Error);
		}

	},

	handleCompCode: function (oEvent) {
		var sUserInput = oEvent.getParameter("value");
		var oInputControl = oEvent.getSource();
		if (sUserInput) {
			oInputControl.setValueState(sap.ui.core.ValueState.Success);
		} else {
			oInputControl.setValueState(sap.ui.core.ValueState.Error);
		}
	},

	handleSystem: function (oEvent) {
		var sUserInput = oEvent.getParameter("value");
		var oInputControl = oEvent.getSource();
		if (sUserInput) {
			oInputControl.setValueState(sap.ui.core.ValueState.Success);
		} else {
			oInputControl.setValueState(sap.ui.core.ValueState.Error);
		}
	},

	handleStatus: function (oEvent) {

        var changedItem = oEvent.getParameter("changedItem");
        var isSelected = oEvent.getParameter("selected");
        var state = "Selected";

        if (!isSelected) {
          state = "Deselected";
        }

        //Check if "Selected All is selected
        if (changedItem.mProperties.key == "All") {
          var oName, res;

          //If it is Selected
          if (state == "Selected") {

            var oItems = oEvent.oSource.mAggregations.items;
            for (var i = 0; i < oItems.length; i++) {
              if (i == 0) {
                oName = oItems[i].mProperties.key;
              } else {
                oName = oName + ',' + oItems[i].mProperties.key;
              } //If i == 0									
            } //End of For Loop

            res = oName.split(",");
            oEvent.oSource.setSelectedKeys(res);

          } else {
            res = null;
            oEvent.oSource.setSelectedKeys(res);
          }
        }
      },

	handleVendors: function (oEvent) {

	},

	onParentClicked: function (oEvent) {
		var bSelected = oEvent.getParameter("selected");

		if (bSelected == "Selected") {

		} else {

		}
	},

// commentout
	onValueHelpRequested: function () {

		var that = this;

		var oModel = sap.ui.getCore().getModel("oModelCC");
		var oCompCode = oModel.getProperty("/CompCode");
		var oSAPC = oModel.getProperty("/SAPC");
		var oSAPM = oModel.getProperty("/SAPM");

		this.getView().setModel(oModel, "oModelCC");
		// sap.ui.getCore().byId("cc1").setValue(oCompCode);

		//var sURL = "/SAPC_DEV_DL1106/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		var sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		//var sURL = "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";	
		this.oModel = new sap.ui.model.odata.ODataModel(sURL, true);
		// /sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/VendorListSet?$filter=CompCode eq '2200'
		// /sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/VendorListSet?$filter=CompCode eq '2200' and (System eq 'SAPC' or System eq 'SAPM')
		var oFilter = new Array();
		var oFilterCC = new sap.ui.model.Filter("CompCode", "EQ", oCompCode);
		var oFilterSC = new sap.ui.model.Filter("System", "EQ", "SAPC");
		var oFilterSM = new sap.ui.model.Filter("System", "EQ", "SAPM");

		oFilter.push(oFilterCC);

		if (oSAPC) {
			oFilter.push(oFilterSC);
		}

		if (oSAPM) {
			oFilter.push(oFilterSM);
		}

		this.oModel.read("/VendorListSet", {

			async: false,

			filters: oFilter,

			success: function (oData, oResponse) {
				that.oStop = "false";
				that.aItems = [];
				var index = oData.results.length;
				var i;
				for (i = 0; i < index; i++) {
					that.aItems.push(oData.results[i]);
				}

			},

			error: function (oError) {
				that.oStop = "true";
				sap.m.MessageToast.show("No Vendors for Company Code", {
					duration: 3000
				});
			}

		});

		if (this.oStop === "false") {

			var aCols = this.oColModel.getData().cols;
			this._oBasicSearchField = new sap.m.SearchField({
				showSearchButton: false
			});

			this._pFragment = new sap.ui.core.Fragment.load({
				name: "invoicewf.invoicewf.ext.fragment.vendorsSearch",
				controller: this
			}).then(function name(oFragment) {
				this._oValueHelpDialog = oFragment;
				this.getView().addDependent(this._oValueHelpDialog);

				this._oValueHelpDialog.setRangeKeyFields([{
					label: "Vendors",
					key: "VendorNo",
					type: "string",
					typeInstance: new sap.ui.model.type.String({}, {
						maxLength: 7
					})
				}]);

				this._oValueHelpDialog.setIncludeRangeOperations([
					sap.ui.model.FilterOperator.Contains,
					sap.ui.model.FilterOperator.BT
					// sap.ui.model.FilterOperator.EndsWith
				], "string");

				this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {

					var oRowsModel = new sap.ui.model.json.JSONModel();
					oRowsModel.setData(this.aItems);
					oTable.setModel(oRowsModel);
					oTable.setModel(this.oColModel, "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/");
					}

					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/VendorListSet", function () {
							return new sap.ui.core.ColumnListItem({
								cells: aCols.map(function (column) {
									return new sap.ui.core.Label({
										text: "{" + column.template + "}"
									});
								})
							});
						});
					}

					this._oValueHelpDialog.update();
				}.bind(this));

				this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				this._oValueHelpDialog.open();

			}.bind(this));

		}

	},

	onValueHelpOkPress: function (oEvent) {
		var aTokens = oEvent.getParameter("tokens");
		this._oMultiInput.setTokens(aTokens);
		this._oValueHelpDialog.close();
	},

	onValueHelpCancelPress: function () {
		this._oValueHelpDialog.close();
	},

	onValueHelpAfterClose: function () {
		this._oValueHelpDialog.destroy();
	},

// commentout
	onFilterBarSearch: function (oEvent) {
		var sSearchQuery = this._oBasicSearchField.getValue(),
			aSelectionSet = oEvent.getParameter("selectionSet");
		var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
			if (oControl.getValue()) {
				aResult.push(new sap.ui.model.Filter({
					path: oControl.getName(),
					operator: sap.ui.model.FilterOperator.Contains,
					value1: oControl.getValue()
				}));
			}

			return aResult;
		}, []);

		aFilters.push(new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter({
					path: "System",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				}),
				new sap.ui.model.Filter({
					path: "VendorNo",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				}),
				new sap.ui.model.Filter({
					path: "Name",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				})
			],
			and: false
		}));

		this._filterTable(new sap.ui.model.Filter({
			filters: aFilters,
			and: true
		}));
	},

	_filterTable: function (oFilter) {
		var oValueHelpDialog = this._oValueHelpDialog;

		oValueHelpDialog.getTableAsync().then(function (oTable) {
			if (oTable.bindRows) {
				oTable.getBinding("rows").filter(oFilter);
			}

			if (oTable.bindItems) {
				oTable.getBinding("items").filter(oFilter);
			}

			oValueHelpDialog.update();
		});
	},

	onInit: function () {

// commentout

		this._oMultiInput = this.getView().byId("multiVendor");
		this._oMultiInput.setTokens(this._getDefaultTokens());
		this._oMultiInput.addValidator(
			this._onMultiInputValidate);

		this.oColModel = new sap.ui.model.json.JSONModel();
		this.oColModel.setData({
			cols: [{
				label: "System",
				template: "System"
			}, {
				label: "VendorNo",
				template: "VendorNo"
			}, {
				label: "Name",
				template: "Name"
			}]
		});
		
		
		

		this.getView().byId("listReport").setProperty("useExportToExcel", true);

		this.getView().byId("listReport").attachEvent("beforeExport", function (oEvent) {
			//alert("excel is instantiated");
			var mExcelSettings = oEvent.getParameter("exportSettings");

			mExcelSettings.fileName = mExcelSettings.fileName + " - Supplier Invoice";

		});

	},

	_getDefaultTokens: function () {

	},

	_onMultiInputValidate: function (oArgs) {
		if (oArgs.suggestionObject) {
			var oObject = oArgs.suggestionObject.getBindingContext().getObject(),
				oToken = new sap.m.Token();

			oToken.setKey(oObject.VendorNo);
			oToken.setText(oObject.Name + " (" + oObject.Name + ")");
			return oToken;
		}

		return null;
	},

	onAfterRendering: function () {

		var oPgHdr = sap.ui.getCore().byId(
			"invoicewf.invoicewf::sap.suite.ui.generic.template.ListReport.view.ListReport::Invoice_HeaderSet--template:::ListReportPage:::DynamicPageHeader"
		);
		if (oPgHdr) {
			oPgHdr.addStyleClass('HowBlckBgrnd');
		}

	},

	buttonActive: function (WorkflowStatus) {

		var rtnVal;
		if (WorkflowStatus === "Ready") {
			rtnVal = true;
		} else if (WorkflowStatus === "Waiting") {
			rtnVal = true;
		} else if (WorkflowStatus === "Reserved") {
			rtnVal = true;
		} else if (WorkflowStatus === "In Process") {
			rtnVal = true;
		} else if (WorkflowStatus === "Error") {
			rtnVal = false;
		} else if (WorkflowStatus === "Executed") {
			rtnVal = false;
		} else if (WorkflowStatus === "Completed") {
			rtnVal = false;
		} else if (WorkflowStatus === "Logically Deleted") {
			rtnVal = false;
		} else if (WorkflowStatus === "In Preparation") {
			rtnVal = false;
		} else if (WorkflowStatus === "Exception Caught") {
			rtnVal = false;
		} else if (WorkflowStatus === "Exception Being Handled") {
			rtnVal = false;
		} else if (WorkflowStatus === "No Workflow") {
			rtnVal = false;
		}
		return rtnVal;
		// }
	},

	handleQuickViewBtnPress: function (oEvent) {
		// var oModel = this.getView().getModel("CardModel");
		var oModel = this.getView().getModel();
		this.openQuickView(oEvent, oModel);
	},

	openQuickView: function (oEvent, oModel) {

		var QVModel, 
		sURL = sap.ui.require.toUrl("invoicewf/invoicewf") + "/sap/opu/odata/sap/Z1674_INVOICE_WORKFLOW_SRV/";
		//sURL = "/SAPC_DEV_DL1106/odata/SAP/Z1674_INVOICE_WORKFLOW_SRV";
		QVModel = new sap.ui.model.odata.ODataModel(sURL, true);

		this.getView()
			.setModel(QVModel, "QuickVModel");

		var oButton = oEvent.getSource(),
			oView = this.getView(),
			oContext = oEvent.getSource().getBindingContext();

		this._pQuickView = new sap.ui.core.Fragment.load({
			name: "invoicewf.invoicewf/ext/fragment.QuickView",
			controller: this
		}).then(function (oQuickView) {
			oView.addDependent(oQuickView);
			return oQuickView;
		});

		this._pQuickView.then(function (oQuickView) {

			var sPath = oContext.getPath();

			oQuickView.bindElement({
				path: sPath
					// model: oModel.name
			});

			oQuickView.openBy(oButton);
		});

	},

	getCustomAppStateDataExtension: function (oCustomAppData) {

		this.oModel = new sap.ui.model.json.JSONModel();

		if (oCustomAppData) {

			var oCustomField1 = this.oView.byId("comboboxCc");
			if (oCustomField1) {
				oCustomAppData.CompCode = oCustomField1.getSelectedKey();

			}

			var oCustomField2 = this.oView.byId("comboboxSt");
			if (oCustomField2) {
				oCustomAppData.Domvalue_l = oCustomField2.getSelectedKeys();
			}

			var oCustomField3 = this.oView.byId("comboboxSy");
			if (oCustomField3) {
				oCustomAppData.System = oCustomField3.getSelectedKeys();

				if (oCustomAppData.System) {
					for (var i = 0; i < oCustomAppData.System.length; i++) {

						var oSys = oCustomAppData.System[i];

						if (oSys === "SAPC") {
							oCustomAppData.SAPC = oSys;
						} else {
							oCustomAppData.SAPM = oSys;
						}
					}
				}

			}

			var oCustomField4 = this.oView.byId("comboboxAc");
			if (oCustomField4) {
				oCustomAppData.BUSAB = oCustomField4.getSelectedKeys();
			}

			var oCustomField5 = this.oView.byId("FiscalYear");
			if (oCustomField5) {
				oCustomAppData.FiscalYear = oCustomField5.getValue();
			}

			var oCustomField6 = this.oView.byId("multiVendor");
			if (oCustomField6) {
				oCustomAppData.VendorNo = oCustomField6.getValue();
			}

			this.oModel.setData({
				CompCode: oCustomAppData.CompCode,
				SAPC: oCustomAppData.SAPC,
				SAPM: oCustomAppData.SAPM
			});
			sap.ui.getCore().setModel(this.oModel, "oModelCC");

		}

	},

	/*
	 * In order to restore content of the custom field in the filterbar e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */
	restoreCustomAppStateDataExtension: function (oCustomAppData) {

		if (oCustomAppData) {

			if (oCustomAppData.CompCode) {
				var oComboBox = this.oView.byId("comboboxCc");
				oComboBox.setSelectedKey(
					oCustomAppData.CompCode
				);
			}

			if (oCustomAppData.Domvalue_l) {
				var oComboBox2 = this.oView.byId("comboboxSt");
				oComboBox2.setSelectedKeys(
					oCustomAppData.Domvalue_l
				);
			}

			if (oCustomAppData.SAPC) {
				var oComboBox3 = this.oView.byId("comboboxSy");
				oComboBox3.setSelectedKeys(
					oCustomAppData.SAPC
				);
			}

			if (oCustomAppData.SAPM) {
				var oComboBox4 = this.oView.byId("comboboxSy");
				oComboBox4.setSelectedKeys(
					oCustomAppData.SAPM
				);
			}

			if (oCustomAppData.BUSAB) {
				var oComboBox5 = this.oView.byId("comboboxAc");
				oComboBox5.setSelectedKeys(
					oCustomAppData.BUSAB
				);
			}

			if (oCustomAppData.FiscalYear) {
				var FiscalYear = this.oView.byId("FiscalYear");
				FiscalYear.setValue(oCustomAppData.FiscalYear);
			}

			if (oCustomAppData.VendorNo) {
				var multiVendor = this.oView.byId("multiVendor");
				multiVendor.setValue(oCustomAppData.VendorNo);
			}

		}

	},

	onBeforeRebindTableExtension: function (oEvent) {

		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oFilters = oBindingParams.filters;

		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());

		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {

			//Custom filter

			// Multi combobox
			var aItems = this.getView().byId('comboboxCc').getSelectedKey();
			if (aItems) {
				for (var i = 0; i < aItems.length; i++) {
					// oBindingParams.filters.push(new sap.ui.model.Filter("CompanyCode", "EQ", aItems[i]));
					oBindingParams.filters.push(new sap.ui.model.Filter("CompanyCode", "EQ", aItems));
				}
			} else {
				sap.m.MessageToast.show("Please enter System, Company Code, Status, Fiscal Year and Vendor number");
				oBindingParams.filters.push(new sap.ui.model.Filter("CompanyCode", "EQ", "XXXX"));
			}

			var fItems = this.getView().byId('FiscalYear').getValue();
			if (fItems) {
				for (var i = 0; i < fItems.length; i++) {
					// oBindingParams.filters.push(new sap.ui.model.Filter("CompanyCode", "EQ", aItems[i]));
					oBindingParams.filters.push(new sap.ui.model.Filter("FiscalYear", "EQ", fItems));
				}
			} else {
				sap.m.MessageToast.show("Please enter System, Company Code, Status, Fiscal Year and Vendor number");
				oBindingParams.filters.push(new sap.ui.model.Filter("FiscalYear", "EQ", "0000"));
			}

			var bItems = this.getView().byId('comboboxSt').getSelectedKeys();
			var bLenght = bItems.length;
			if (bLenght !== 0) {
				// if (bItems) {
				for (var i = 0; i < bItems.length; i++) {
					oBindingParams.filters.push(new sap.ui.model.Filter("Status", "EQ", bItems[i]));
				}
			} else {
				sap.m.MessageToast.show("Please enter System, Company Code, Status, Fiscal Year and Vendor number");
				oBindingParams.filters.push(new sap.ui.model.Filter("Status", "EQ", "0"));
			}

			//
			var sItems = this.getView().byId('comboboxSy').getSelectedKeys();
			var sLenght = sItems.length;
			if (sLenght !== 0) {
				// if (sItems) {
				for (var i = 0; i < sItems.length; i++) {
					// oBindingParams.filters.push(new sap.ui.model.Filter("CompanyCode", "EQ", aItems[i]));
					oBindingParams.filters.push(new sap.ui.model.Filter("System", "EQ", sItems[i]));
				}
			} else {
				sap.m.MessageToast.show("Please enter System, Company Code, Status, Fiscal Year and Vendor number");
				oBindingParams.filters.push(new sap.ui.model.Filter("System", "EQ", "XXXX"));
			}

			var dItems = this.getView().byId('comboboxAc').getSelectedKeys();
			for (var i = 0; i < dItems.length; i++) {
				oBindingParams.filters.push(new sap.ui.model.Filter("BUSAB", "EQ", dItems[i]));
			}

			// Get array of Tokens

			var oBindingParams = oEvent.getParameter("bindingParams");
			var oFilter, aFilter = [];
			oBindingParams.parameters = oBindingParams.parameters || {};
			var oSmartTable = oEvent.getSource();
			var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());

			if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				//Custom Supplier filter
				var oCustomControl = oSmartFilterBar.getControlByKey("VendorNo");
				if (oCustomControl instanceof sap.m.MultiInput) {


					aFilter = this._getTokens(oCustomControl, "InvoicingPartyID");
					if (aFilter.length > 0) {
						oBindingParams.filters.push.apply(oBindingParams.filters, aFilter);
					}
				}
			}

// commentout
			var oVend = this.getView().byId("multiVendor").getValue();

			if (oVend) {
				oBindingParams.filters.push(new sap.ui.model.Filter("InvoicingPartyID", "EQ", oVend));
			} else {

				var aTokens = this.getView().byId("multiVendor").getTokens();

				var vLenght = aTokens.length;

				if (vLenght !== 0) {

					var sData = aTokens.map(function (oToken) {
						return oToken.getText();
					});

				} else {

					sap.m.MessageToast.show("Please enter System, Company Code, Status, Fiscal Year and Vendor number");
					oBindingParams.filters.push(new sap.ui.model.Filter("InvoicingPartyID", "EQ", "XXXXXXXXXX"));
				}

			}
			
			
			
			
			
			
			

		}

	},

	_getTokens: function (oControl, sName) {
		var aToken, aFilters = [];
		aToken = oControl.getTokens();

		if (aToken) {
			for (var i = 0; i < aToken.length; i++) {

				var key = aToken[i].getProperty("key");

				var key2 = (key.substring(0, 5));

				if (key2 !== "range") {

					aFilters.push(new sap.ui.model.Filter(sName, "EQ", aToken[i].getProperty("key")));

				} else {

					var text = aToken[i].getProperty("text");
					var text2 = (text.substring(0, 1));

					if (text2 === "!") {

						///

						var number = text.match(/\d+/g).map(Number);

						///

						aFilters.push(new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.NE, number));
					} else {

						var pos = text.indexOf("...");

						if (pos !== -1) {

							var low = text.substr(0, pos);
							var high = text.substr(pos + 3);

							aFilters.push(new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.BT, low, high));

						} else {

							aFilters.push(new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.Contains, aToken[i].getProperty("text")));

						}
					}

				}

			}
		}
		return aFilters;
	}

});