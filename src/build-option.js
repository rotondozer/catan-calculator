"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.None = exports.DevCard = exports.City = exports.Settlement = exports.Road = exports.BuildOption = void 0;
var sums_up_1 = require("sums-up");
var BuildOption = /** @class */ (function (_super) {
    __extends(BuildOption, _super);
    function BuildOption() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuildOption.prototype.isSameOption = function (opt) {
        return opt.type === this.type;
    };
    BuildOption.prototype.merge = function (opt) {
        if (this.isSameOption(opt)) {
            return this.inc(opt.getNum());
        }
        else {
            console.warn("trying to merge incompatible types, this is a noOp!");
            return None();
        }
    };
    BuildOption.prototype.inc = function (n) {
        if (n === void 0) { n = 1; }
        return this.kind === "None" ? this : new BuildOption(this.kind, this.getNum() + n);
    };
    BuildOption.prototype.toString = function () {
        return this.caseOf({
            Road: function () { return "road"; },
            Settlement: function () { return "settlement"; },
            City: function () { return "city"; },
            DevCard: function () { return "devCard"; },
            None: function () { return "none"; }
        });
    };
    BuildOption.prototype.getNum = function () {
        return this.caseOf({
            _: function (n) {
                if (n === void 0) { n = 0; }
                return n;
            },
            None: function () { return 0; }
        });
    };
    return BuildOption;
}(sums_up_1["default"]));
exports.BuildOption = BuildOption;
function Road(n) {
    if (n === void 0) { n = 0; }
    return new BuildOption("Road", n);
}
exports.Road = Road;
function Settlement(n) {
    if (n === void 0) { n = 0; }
    return new BuildOption("Settlement", n);
}
exports.Settlement = Settlement;
function City(n) {
    if (n === void 0) { n = 0; }
    return new BuildOption("City", n);
}
exports.City = City;
function DevCard(n) {
    if (n === void 0) { n = 0; }
    return new BuildOption("DevCard", n);
}
exports.DevCard = DevCard;
function None() {
    return new BuildOption("None");
}
exports.None = None;
