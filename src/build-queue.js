"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.BuildQueue = void 0;
var seidr_1 = require("seidr");
var maybe = seidr_1.Maybe.fromNullable;
var BuildQueue = /** @class */ (function () {
    function BuildQueue(fromQ) {
        this.queue = this.combineAdjacents(fromQ || []);
    }
    BuildQueue.prototype.combineAdjacents = function (queue_) {
        var _this = this;
        if (queue_ === []) {
            return queue_; // this is how the loop ends: when there aren't any elements ahead
        }
        var currentOpt = queue_[0];
        var restOfArr = queue_.slice(2);
        console.log("rest of arr ==== ", restOfArr);
        return maybe(queue_[1]).caseOf({
            Just: function (nextOpt) {
                if (nextOpt.isSameOption(currentOpt)) {
                    return __spreadArrays([currentOpt.merge(nextOpt)], _this.combineAdjacents(restOfArr));
                }
                else {
                    return __spreadArrays([currentOpt, nextOpt], _this.combineAdjacents(restOfArr));
                }
            },
            Nothing: function () { return [currentOpt]; }
        });
    };
    BuildQueue.prototype.add = function (buildOpt) {
        var _this = this;
        var updatedQueue = maybe(this.queue.pop()).caseOf({
            Nothing: function () { return [buildOpt]; },
            Just: function (lastOpt) {
                return _this.queue.concat(lastOpt.isSameOption(buildOpt) ? lastOpt.merge(buildOpt) : [lastOpt, buildOpt]);
            }
        });
        return new BuildQueue(updatedQueue);
    };
    return BuildQueue;
}());
exports.BuildQueue = BuildQueue;
