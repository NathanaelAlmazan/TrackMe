"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayDiff = void 0;
function getDayDiff(deadline) {
    const difference = Math.abs(new Date().getTime() - deadline.getTime());
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}
exports.getDayDiff = getDayDiff;
//# sourceMappingURL=dates.js.map