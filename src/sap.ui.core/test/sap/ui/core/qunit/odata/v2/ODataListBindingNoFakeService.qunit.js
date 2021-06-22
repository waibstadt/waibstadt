/*!
 * ${copyright}
 */
sap.ui.define([
	"sap/base/Log",
	"sap/ui/model/ChangeReason",
	"sap/ui/model/Context",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/ListBinding",
	"sap/ui/model/odata/ODataUtils",
	"sap/ui/model/odata/v2/ODataListBinding",
	"sap/ui/test/TestUtils"
], function (Log, ChangeReason, Context, Filter, FilterOperator, ListBinding, ODataUtils,
		ODataListBinding, TestUtils) {
	/*global QUnit,sinon*/
	/*eslint no-warning-comments: 0*/
	"use strict";

	//*********************************************************************************************
	QUnit.module("sap.ui.model.odata.v2.ODataListBinding (ODataListBindingNoFakeService)", {
		beforeEach : function () {
			this.oLogMock = this.mock(Log);
			this.oLogMock.expects("error").never();
			this.oLogMock.expects("warning").never();
		},

		afterEach : function (assert) {
			return TestUtils.awaitRendering();
		}
	});

	//*********************************************************************************************
[
	{transitionMessagesOnly : true, headers : {"sap-messages" : "transientOnly"}},
	{transitionMessagesOnly : false, headers : undefined}
].forEach(function (oFixture, i) {
	QUnit.test("loadData calls read w/ parameters refresh, headers, " + i, function (assert) {
		var oBinding,
			oContext = {},
			oModel = {
				read : function () {},
				checkFilterOperation : function () {},
				createCustomParams : function () {},
				resolve : function () {},
				resolveDeep : function () {}
			},
			bRefresh = "{boolean} bRefresh";

		this.mock(oModel).expects("createCustomParams").withExactArgs(undefined).returns("~custom");
		this.mock(oModel).expects("resolveDeep").withExactArgs("path", sinon.match.same(oContext))
			.returns("~deep");
		this.mock(oModel).expects("checkFilterOperation").withExactArgs([]);
		this.mock(ODataListBinding.prototype).expects("checkExpandedList").withExactArgs();

		oBinding = new ODataListBinding(oModel, "path", oContext);

		this.mock(oModel).expects("resolve").withExactArgs("path", sinon.match.same(oContext))
			.returns("~path");
		oBinding.bSkipDataEvents = true;
		oBinding.bRefresh = bRefresh;
		oBinding.bTransitionMessagesOnly = oFixture.transitionMessagesOnly;

		this.mock(oModel).expects("read").withExactArgs("path", {
				headers : oFixture.headers,
				canonicalRequest : undefined,
				context : sinon.match.same(oContext),
				error : sinon.match.func,
				groupId : undefined,
				success : sinon.match.func,
				updateAggregatedMessages : bRefresh,
				urlParameters : ["~custom"]
			})
			.returns();

		// code under test
		oBinding.loadData();
	});
});

	//*********************************************************************************************
[
	{parameters : undefined, expected : false},
	{parameters : {}, expected : false},
	{parameters : {foo : "bar"}, expected : false},
	{parameters : {transitionMessagesOnly : false}, expected : false},
	{parameters : {transitionMessagesOnly : 0}, expected : false},
	{parameters : {transitionMessagesOnly : true}, expected : true},
	{parameters : {transitionMessagesOnly : {}}, expected : true}
].forEach(function (oFixture, i) {
	QUnit.test("constructor: parameter transitionMessagesOnly, " + i, function (assert) {
		var oBinding,
			oModel = {
				read : function () {},
				checkFilterOperation : function () {},
				createCustomParams : function () {},
				resolve : function () {},
				resolveDeep : function () {}
			};

		this.mock(oModel).expects("createCustomParams")
			.withExactArgs(sinon.match.same(oFixture.parameters))
			.returns("~custom");
		this.mock(oModel).expects("resolveDeep").withExactArgs("path", "context").returns("~deep");
		this.mock(oModel).expects("checkFilterOperation").withExactArgs([]);
		this.mock(ODataListBinding.prototype).expects("checkExpandedList").withExactArgs()
			.returns(true);

		// code under test
		oBinding = new ODataListBinding(oModel, "path", "context", undefined /*aSorters*/,
			undefined /*aFilters*/, oFixture.parameters);

		assert.strictEqual(oBinding.bTransitionMessagesOnly, oFixture.expected);
	});
});

	//*********************************************************************************************
[{ // no data
	oIn : {aData : [], iLength : 100, iStart : 0, iThreshold : 0},
	oOut : {length : 100, startIndex : 0}
}, { // data at the beginning
	oIn : {aData : [{iLength : 10, iStart : 0}], iLength : 100, iStart : 0, iThreshold : 0},
	oOut : {length : 90, startIndex : 10}
}, { // data at the end
	oIn : {aData : [{iLength : 10, iStart : 90}], iLength : 100, iStart : 0, iThreshold : 0},
	oOut : {length : 90, startIndex : 0}
}, { // data at the beginning and at the end
	oIn : {
		aData : [{iLength : 10, iStart : 0}, {iLength : 10, iStart : 90}],
		iLength : 100,
		iStart : 0,
		iThreshold : 0
	},
	oOut : {length : 80, startIndex : 10}
}, { // data in middle of the requested range
	oIn : {aData : [{iLength : 10, iStart : 30}], iLength : 100, iStart : 0, iThreshold : 0},
	oOut : {length : 100, startIndex : 0}
}, { // no data with threshold
	oIn : {aData : [], iLength : 100, iStart : 0, iThreshold : 50},
	oOut : {length : 150, startIndex : 0}
}, { // data at the beginning with threshold
	oIn : {aData : [{iLength : 10, iStart : 0}], iLength : 100, iStart : 0, iThreshold : 50},
	oOut : {length : 140, startIndex : 10}
}, { // data at the end of the requested range with threshold
	oIn : {aData : [{iLength : 10, iStart : 90}], iLength : 100, iStart : 0, iThreshold : 50},
	oOut : {length : 150, startIndex : 0}
}, { // data at the end (requested range including threshold)
	oIn : {aData : [{iLength : 60, iStart : 90}], iLength : 100, iStart : 0, iThreshold : 50},
	oOut : {length : 90, startIndex : 0}
}, { // data at the beginning and in the middle of the requested range with threshold
	oIn : {
		aData : [{iLength : 10, iStart : 0}, {iLength : 10, iStart : 90}],
		iLength : 100,
		iStart : 0,
		iThreshold : 50
	},
	oOut : {length : 140, startIndex : 10}
}, { // data at the beginning and at the end with threshold
	oIn : {
		aData : [{iLength : 10, iStart : 0}, {iLength : 20, iStart : 130}],
		iLength : 100,
		iStart : 0,
		iThreshold : 50
	},
	oOut : {length : 120, startIndex : 10}
}, { // prepend complete threshold
	oIn : {aData : [], iLength : 30, iStart : 80, iThreshold : 50},
	oOut : {length : 130, startIndex : 30}
}, { // prepend complete threshold start with 0
	oIn : {aData : [], iLength : 30, iStart : 40, iThreshold : 50},
	oOut : {length : 120, startIndex : 0}
}, { // read at most to final length
	oIn : {aData : [], iFinalLength : 80, iLength : 30, iStart : 20, iThreshold : 50},
	oOut : {length : 80, startIndex : 0}
}, { // read at least threshold data
	oIn : {aData : [{iLength : 120, iStart : 0}], iLength : 100, iStart : 0, iThreshold : 50},
	oOut : {length : 50, startIndex : 120}
}, { // read at least threshold data start > threshold
	oIn : {aData : [{iLength : 60, iStart : 70}], iLength : 20, iStart : 70, iThreshold : 50},
	oOut : {length : 120, startIndex : 20}
}, { // only few entries missing at the beginning and the end
	oIn : {aData : [{iLength : 100, iStart : 30}], iLength : 20, iStart : 70, iThreshold : 50},
	oOut : {length : 120, startIndex : 20}
}, { // all data available
	oIn : {aData : [{iLength : 100, iStart : 0}], iLength : 20, iStart : 0, iThreshold : 50},
	oOut : {length : 0, startIndex : 70}
}, { // extend length because it is less than threshold but close the gap only
	oIn : {
		aData : [{iLength : 70, iStart : 0}, {iLength : 100, iStart : 90}],
		iLength : 20,
		iStart : 20,
		iThreshold : 50
	},
	oOut : {length : 20, startIndex : 70}
}, { // extend length because it is less than threshold; final length ignored
	oIn : {
		aData : [{iLength : 70, iStart : 0}],
		iFinalLength : 80,
		iLength : 20,
		iStart : 20,
		iThreshold : 50
	},
	oOut : {length : 50, startIndex : 70}
}].forEach(function (oFixture, i) {
	QUnit.test("calculateSection: #" + i, function (assert) {
		var oBinding = {
				aKeys : [],
				bLengthFinal : !!oFixture.oIn.iFinalLength,
				iLength : oFixture.oIn.iFinalLength
			},
			oResult;

		oFixture.oIn.aData.forEach(function (oAvailableData) {
			var i = oAvailableData.iStart,
				n = i + oAvailableData.iLength;

			for (; i < n; i += 1) {
				oBinding.aKeys[i] = "key" + i;
			}
		});

		// code under test
		oResult = ODataListBinding.prototype.calculateSection.call(oBinding, oFixture.oIn.iStart,
			oFixture.oIn.iLength, oFixture.oIn.iThreshold);

		assert.deepEqual(oResult, oFixture.oOut);
	});
});

	//*********************************************************************************************
["resolvedPath", undefined, null].forEach(function (sResolvedPath) {
	QUnit.test("_checkDataStateMessages: with deepPath: " + sResolvedPath, function (assert) {
		var oModel = {
				getMessagesByPath : function () {}
			},
			oBinding = {
				sDeepPath : "deepPath",
				oModel : oModel
			},
			oDataState = {
				setModelMessages : function () {}
			},
			aMessagesByPath = "aMessages";

		this.mock(oModel).expects("getMessagesByPath").withExactArgs("deepPath", true)
			.exactly(sResolvedPath === "resolvedPath" ? 1 : 0)
			.returns(aMessagesByPath);
		this.mock(oDataState).expects("setModelMessages").withExactArgs(aMessagesByPath)
			.exactly(sResolvedPath === "resolvedPath" ? 1 : 0);

		// code under test
		ODataListBinding.prototype._checkDataStateMessages.call(oBinding, oDataState, sResolvedPath);
	});
});

	//*********************************************************************************************
	QUnit.test("_getFilterForPredicate: keys for predicate known", function (assert) {
		var oBinding = {},
			oDataUtilsMock = this.mock(ODataUtils),
			oExpectedFilter = new Filter({
				and : true,
				filters : [
					new Filter("SalesOrderID", FilterOperator.EQ, "~42~"),
					new Filter("ItemPosition", FilterOperator.EQ, "~10~")
				]
			}),
			sPredicate = "(SalesOrderID='42',ItemPosition='10')";

		oDataUtilsMock.expects("parseValue").withExactArgs("'10'").returns("~10~");
		oDataUtilsMock.expects("parseValue").withExactArgs("'42'").returns("~42~");

		// code under test
		assert.deepEqual(
			ODataListBinding.prototype._getFilterForPredicate.call(oBinding, sPredicate),
			oExpectedFilter);
	});

	//*********************************************************************************************
	QUnit.test("_getFilterForPredicate: key for predicate unknown", function (assert) {
		var oModel = {
				oMetadata : {
					getKeyPropertyNamesByPath : function () {}
				}
			},
			oBinding = {
				sDeepPath : "~deepPath~",
				oModel : oModel
			};

		this.mock(oModel.oMetadata).expects("getKeyPropertyNamesByPath")
			.withExactArgs("~deepPath~")
			.returns(["SalesOrderID"]);
		this.mock(ODataUtils).expects("parseValue").withExactArgs("'42'").returns("~42~");

		// code under test
		assert.deepEqual(ODataListBinding.prototype._getFilterForPredicate.call(oBinding, "('42')"),
			new Filter("SalesOrderID", FilterOperator.EQ, "~42~"));
	});

	//*********************************************************************************************
	QUnit.test("_getFilterForPredicate: encoded key predicates; integrative", function (assert) {
		var oExpectedFilter = new Filter({
				bAnd : true,
				aFilters : [
					new Filter("string", FilterOperator.EQ, "abc123' !\"§$%&/()=:;/?+"),
					new Filter("datetime", FilterOperator.EQ,
						new Date(Date.UTC(2021, 5, 18, 9, 50, 58))),
					new Filter("datetimems", FilterOperator.EQ,
						new Date(Date.UTC(2021, 5, 19, 9, 50, 58, 123))),
					new Filter("datetimeoffset", FilterOperator.EQ,
						new Date(Date.UTC(2021, 5, 20, 9, 50, 58))),
					new Filter("time", FilterOperator.EQ,
						{"__edmType": "Edm.Time", "ms": 34936000}),
					new Filter("guid", FilterOperator.EQ, "42010aef-0de5-1edb-aead-63ba217fb0e7"),
					new Filter("null", FilterOperator.EQ, null),
					new Filter("decimal", FilterOperator.EQ, "-1.23"),
					new Filter("double", FilterOperator.EQ, "-2.34"),
					new Filter("float", FilterOperator.EQ, "-3.45"),
					new Filter("int64", FilterOperator.EQ, "-123"),
					new Filter("sbyte", FilterOperator.EQ, -78),
					new Filter("byte", FilterOperator.EQ, 255),
					new Filter("true", FilterOperator.EQ, true),
					new Filter("false", FilterOperator.EQ, false),
					new Filter("binary", FilterOperator.EQ, "0123456789abcdef")
				]
			}),
			sPredicate = "("
				+ "string='abc123''%20%21%22%c2%a7%24%25%26%2f%28%29%3d%3a%3b%2f%3f%2b',"
				+ "datetime=datetime'2021-06-18T09%3a50%3a58',"
				+ "datetimems=datetime'2021-06-19T09%3a50%3a58.123',"
				+ "datetimeoffset=datetimeoffset'2021-06-20T09%3a50%3a58Z',"
				// for following data types encoded characters cannot be in the key predicate
				+ "time=time'PT09H42M16S',"
				+ "guid=guid'42010aef-0de5-1edb-aead-63ba217fb0e7'," // only [A-Fa-f0-9] allowed
				+ "null=null,"
				+ "decimal=-1.23m,"
				+ "double=-2.34d,"
				+ "float=-3.45f,"
				+ "int64=-123l,"
				+ "sbyte=-78,"
				+ "byte=255,"
				+ "true=true,"
				+ "false=false,"
				+ "binary=binary'0123456789abcdef'" // [A-Fa-f0-9][A-Fa-f0-9]*
				+ ")";

		// code under test
		assert.deepEqual(ODataListBinding.prototype._getFilterForPredicate.call({}, sPredicate),
			oExpectedFilter);
	});

	//*********************************************************************************************
	QUnit.test("requestFilterForMessages: unresolved", function (assert) {
		var oModel = {
				getMessagesByPath : function () {},
				resolve : function () {}
			},
			oBinding = {
				oContext : "context",
				sDeepPath : "deepPath",
				oModel : oModel,
				sPath : "path"
			},
			oPromise;

		this.mock(oModel).expects("resolve")
			.withExactArgs(oBinding.sPath, oBinding.oContext)
			.returns(undefined);
		this.mock(oModel).expects("getMessagesByPath").never();

		// code under test
		oPromise = ODataListBinding.prototype.requestFilterForMessages.call(oBinding);

		assert.ok(oPromise instanceof Promise);

		return oPromise.then(function (oFilter) {
			assert.strictEqual(oFilter, null);
		});
	});

	//*********************************************************************************************
[true, false].forEach(function (bWithFilter) {
	[{
		aFilterForPredicate : [],
		aMessages : [] // contains sap.ui.core.message.Message objects
	}, {
		aFilterForPredicate : bWithFilter ? [] : ["(~keyPredicate~)"],
		aMessages : [{aFullTargets : ["~deepPath~(~keyPredicate~)"], message : "out"}]
	}, {
		aFilterForPredicate : ["(~keyPredicate~)"],
		aMessages : [{aFullTargets : ["~deepPath~(~keyPredicate~)"], message : "in"}]
	}, {
		aFilterForPredicate : bWithFilter
			? ["(~keyPredicate0~)", "(~keyPredicate2~)"]
			: ["(~keyPredicate0~)", "(~keyPredicate1~)", "(~keyPredicate2~)", "(~keyPredicate3~)"],
		aMessages : [
			{aFullTargets : ["~deepPath~"], message : "out"},
			{aFullTargets : ["~deepPath~(~keyPredicate0~)/foo"], message : "in"},
			{aFullTargets : ["~deepPath~(~keyPredicate1~)"], message : "out"},
			{aFullTargets : ["~deepPath~(~keyPredicate2~)"], message : "in"},
			{aFullTargets : ["~deepPath~(~keyPredicate3~)"], message : "out"}
		]
	}, {
		aFilterForPredicate : ["(~keyPredicate~)"],
		aMessages : [{
			aFullTargets : ["~deepPath~(~keyPredicate~)/A", "~deepPath~(~keyPredicate~)/B"],
			message : "in"
		}]
	}, {
		aFilterForPredicate : ["(~keyPredicate1~)", "(~keyPredicate2~)"],
		aMessages : [{
			aFullTargets : ["~deepPath~(~keyPredicate1~)/A", "~deepPath~(~keyPredicate2~)/B"],
			message : "in"
		}]
	}, {
		aFilterForPredicate : ["(~keyPredicate~)"],
		aMessages : [{
			aFullTargets : ["~parentEntity~", "~deepPath~(~keyPredicate~)/B"],
			message : "in"
		}]
	}].forEach(function (oFixture, i) {
	var sTitle = "requestFilterForMessages: with filter: " + bWithFilter + ", " + i;

	QUnit.test(sTitle, function (assert) {
		var oCallback = {
				fnFilter : function () {}
			},
			oCallbackMock = this.mock(oCallback),
			aFilterForPredicate = oFixture.aFilterForPredicate,
			aFilters = [],
			aMessages = oFixture.aMessages,
			oModel = {
				getMessagesByPath : function () {},
				resolve : function () {}
			},
			oBinding = {
				oContext : "context",
				sDeepPath : "~deepPath~",
				oModel : oModel,
				sPath : "path",
				_getFilterForPredicate : function () {}
			},
			oBindingMock = this.mock(oBinding),
			oPromise;

		this.mock(oModel).expects("resolve")
			.withExactArgs(oBinding.sPath, oBinding.oContext)
			.returns("resolvedPath");
		this.mock(oModel).expects("getMessagesByPath").withExactArgs("~deepPath~", true)
			.returns(aMessages);
		if (aMessages.length && bWithFilter) {
			aMessages.forEach(function (oMessage) {
				oCallbackMock.expects("fnFilter").withExactArgs(sinon.match.same(oMessage))
					.returns(oMessage.message === "in");
			});
		} else {
			oCallbackMock.expects("fnFilter").never();
		}
		if (aFilterForPredicate.length) {
			aFilterForPredicate.forEach(function (sPredicate) {
				var oFilter = new Filter("~property~", FilterOperator.EQ, "~value~");

				oBindingMock.expects("_getFilterForPredicate").withExactArgs(sPredicate)
					.returns(oFilter);
				aFilters.push(oFilter);
			});
		} else {
			oBindingMock.expects("_getFilterForPredicate").never();
		}

		// code under test
		oPromise = ODataListBinding.prototype.requestFilterForMessages
			.call(oBinding, bWithFilter ? oCallback.fnFilter : undefined);

		assert.ok(oPromise instanceof Promise);

		return oPromise.then(function (oFilter) {
			if (aFilters.length === 0) {
				assert.strictEqual(oFilter, null);
			} else if (aFilters.length === 1) {
				assert.deepEqual(oFilter, aFilters[0]);
			} else {
				assert.strictEqual(oFilter.bAnd, undefined);
				assert.deepEqual(oFilter.aFilters, aFilters);
			}
		});
	});
	});
});

	//*********************************************************************************************
[{
	bInitial : true,
	oMetadata : undefined,
	bRelative : false
}, {
	bInitial : true,
	oMetadata : {
		isLoaded : function () { return false; }
	},
	bRelative : false
}, {
	bInitial : false,
	oMetadata : {
		isLoaded : function () { return true; }
	},
	bRelative : false
}, {
	oContext : {bCreated : true},
	bInitial : true,
	oMetadata : {
		isLoaded : function () { return true; }
	},
	bRelative : true
}].forEach(function (oFixture, i) {
	QUnit.test("initialize: not yet ready for initialization, #" + i, function (assert) {
		var oBinding = {
				_checkPathType : function () {},
				isRelative : function () {},
				oContext : oFixture.oContext,
				bInitial : oFixture.bInitial,
				oModel : {
					oMetadata : oFixture.oMetadata
				}
			};

		this.mock(oBinding).expects("isRelative").withExactArgs().returns(oFixture.bRelative);
		this.mock(oBinding).expects("_checkPathType").never();

		// code under test
		assert.strictEqual(ODataListBinding.prototype.initialize.call(oBinding), oBinding);
	});
});

	//*********************************************************************************************
[{
	bRelative : false
}, {
	//oContext : undefined
	bRelative : true
}, {
	oContext : {bCreated : false},
	bRelative : true
}].forEach(function (oFixture, i) {
	[true, false].forEach(function (bBoundToList) {
		[true, false].forEach(function (bSuspended) {
			[true, false].forEach(function (bDataAvailable) {
	var sTitle = "initialize: initialize, #" + i + ", bound to a list: " + bBoundToList
			+ ", suspended: " + bSuspended + ", data available: " + bDataAvailable;

	QUnit.test(sTitle, function (assert) {
		var oBinding = {
				oContext : oFixture.oContext,
				bDataAvailable : bDataAvailable,
				bInitial : true,
				oModel : {
					oMetadata : {
						isLoaded : function () {}
					},
					resolve : function () {}
				},
				sPath : "~path",
				bSuspended : bSuspended,
				_checkPathType : function () {},
				_fireChange : function () {},
				_fireRefresh : function () {},
				_initSortersFilters : function () {},
				checkDataState : function () {},
				isRelative : function () {}
			},
			sResolvedPath = "~resolvedPath";

		this.mock(oBinding).expects("isRelative").withExactArgs().returns(oFixture.bRelative);
		this.mock(oBinding.oModel.oMetadata).expects("isLoaded").withExactArgs().returns(true);
		this.mock(oBinding).expects("_checkPathType").withExactArgs().returns(bBoundToList);
		this.mock(oBinding.oModel).expects("resolve")
			.withExactArgs("~path", sinon.match.same(oBinding.oContext))
			.exactly(bBoundToList ? 0 : 1)
			.returns(sResolvedPath);
		this.oLogMock.expects("error")
			.withExactArgs("List Binding is not bound against a list for ~resolvedPath")
			.exactly(bBoundToList ? 0 : 1);
		this.mock(oBinding).expects("_initSortersFilters").withExactArgs();
		this.mock(oBinding).expects("_fireChange").withExactArgs({reason: ChangeReason.Change})
			.exactly(!bSuspended && bDataAvailable ? 1 : 0);
		this.mock(oBinding).expects("_fireRefresh").withExactArgs({reason: ChangeReason.Refresh})
			.exactly(!bSuspended && !bDataAvailable ? 1 : 0);
		this.mock(oBinding).expects("checkDataState").withExactArgs();


		// code under test
		assert.strictEqual(ODataListBinding.prototype.initialize.call(oBinding), oBinding);

		assert.strictEqual(oBinding.bInitial, false);
	});
			});
		});
	});
});

	//*********************************************************************************************
	QUnit.test("setContext: calls checkDataState if context changes", function (assert) {
		var oModel = {
				resolve : function () {},
				resolveDeep : function () {}
			},
			oBinding = {
				oContext : "~oContext",
				bInitial : false,
				oModel : oModel,
				sPath : "~sPath",
				_checkPathType : function () {},
				_initSortersFilters : function () {},
				_refresh : function () {},
				checkDataState : function () {},
				checkExpandedList : function () {},
				isRelative : function () {}
			},
			oContext = {
				bCreated : false,
				isPreliminary : function () { return false; },
				isRefreshForced : function () { return false; },
				isUpdated : function () { return false; }
			};

		this.mock(oBinding).expects("isRelative").withExactArgs().returns(true);
		this.mock(Context).expects("hasChanged")
			.withExactArgs("~oContext", sinon.match.same(oContext))
			.returns(true);
		this.mock(oModel).expects("resolve")
			.withExactArgs("~sPath", sinon.match.same(oContext))
			.returns("~resolvedPath");
		this.mock(oModel).expects("resolveDeep")
			.withExactArgs("~sPath", sinon.match.same(oContext))
			.returns("~resolvedDeepPath");
		this.mock(oBinding).expects("_checkPathType").withExactArgs().returns(true);
		this.mock(oBinding).expects("checkDataState").withExactArgs();
		this.mock(oBinding).expects("_initSortersFilters").withExactArgs();
		this.mock(oBinding).expects("checkExpandedList").withExactArgs().returns(false);
		this.mock(oBinding).expects("_refresh").withExactArgs();

		// code under test
		ODataListBinding.prototype.setContext.call(oBinding, oContext);

		assert.strictEqual(oBinding.oContext, oContext);
	});
});