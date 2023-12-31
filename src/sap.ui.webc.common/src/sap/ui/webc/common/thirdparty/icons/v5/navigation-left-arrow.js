sap.ui.define(["exports", "sap/ui/webc/common/thirdparty/base/asset-registries/Icons"], function (_exports, _Icons) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pathData = _exports.ltr = _exports.default = _exports.accData = void 0;
  const name = "navigation-left-arrow";
  const pathData = "M340 358q9 9 9 22 0 11-9 22-10 9-22 9-13 0-22-9L172 278q-9-11-9-22 0-13 9-22l124-124q9-9 22-9 12 0 22 9 9 9 9 22 0 11-9 22L237 256z";
  _exports.pathData = pathData;
  const ltr = false;
  _exports.ltr = ltr;
  const accData = null;
  _exports.accData = accData;
  const collection = "SAP-icons-v5";
  const packageName = "@ui5/webcomponents-icons";
  (0, _Icons.registerIcon)(name, {
    pathData,
    ltr,
    collection,
    packageName
  });
  var _default = "SAP-icons-v5/navigation-left-arrow";
  _exports.default = _default;
});