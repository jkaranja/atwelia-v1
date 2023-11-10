"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Renter"] = "Renter";
    Role["Agent"] = "Agent";
    Role["Buyer"] = "Buyer";
    Role["Guest"] = "Guest";
    Role["Subscriber"] = "Subscriber";
    Role["Admin"] = "Admin";
})(Role = exports.Role || (exports.Role = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Pending"] = "Pending";
    AccountStatus["Suspended"] = "Suspended";
    AccountStatus["Approved"] = "Approved";
    AccountStatus["Dormant"] = "Dormant";
    AccountStatus["Active"] = "Active";
    AccountStatus["Banned"] = "Banned";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
