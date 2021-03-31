"use strict";
/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
exports.__esModule = true;
var types_1 = require("../types");
var Url = /** @class */ (function () {
    function Url() {
        var _this = this;
        this.base = "#";
        this.account = {
            create: "account/create",
            confirm: "account/confirm",
            backup: "account/backup",
            "import": "account/import",
            "export": "account/export",
            receive: "account/receive",
            unlock: "account/unlock"
        };
        this.transaction = {
            tunnel: "tunnel",
            tunnelNFT: "tunnel-nft",
            transfer: "transfer",
            transferNft: "transfer-nft",
            list: "transaction/list",
            info: "transaction/info"
        };
        this.settings = {
            setting: "tabs/settings",
            about: "manage/about"
        };
        this.epoch = {
            index: "tabs/epoch",
            altar: "epoch/altar",
            chaos: "epoch/chaos"
        };
        this.nftTabs = "tabs/nft";
        this.scan = "scan";
        this.swapWEth = "swap/eth";
        this.path_settings = function () {
            return [_this.base, _this.settings.setting].join("/");
        };
    }
    /**
     * go to page
     * @param path
     * @param delay seconds
     */
    Url.prototype.goTo = function (path, pre, delay) {
        var data = sessionStorage.getItem("history");
        if (pre) {
            var pathArr = data && JSON.parse(data);
            if (pathArr && pathArr.length > 0) {
                pathArr.push(pre);
                sessionStorage.setItem("history", JSON.stringify(pathArr));
            }
            else {
                sessionStorage.setItem("history", JSON.stringify([pre]));
            }
        }
        if (delay) {
            setTimeout(function () {
                window.location.href = path;
                // window.location.reload();
            });
            return;
        }
        window.location.href = path;
        // window.location.reload();
        return;
    };
    Url.prototype.back = function () {
        var data = sessionStorage.getItem("history");
        var pathArr = data && JSON.parse(data);
        if (pathArr && pathArr.length > 0) {
            var pre = pathArr.pop();
            sessionStorage.setItem("history", JSON.stringify(pathArr));
            window.location.href = pre;
            // window.location.reload();
        }
        else {
            this.home();
        }
    };
    Url.prototype.home = function () {
        this.goTo(this.base, "/#/");
        return;
    };
    Url.prototype.accountCreate = function () {
        this.goTo([this.base, this.account.create].join("/"), "");
    };
    Url.prototype.accountBackup = function (pre) {
        this.goTo([this.base, this.account.backup].join("/"), pre ? pre : [this.base, this.account.create].join("/"));
    };
    Url.prototype.accountConfirm = function () {
        this.goTo([this.base, this.account.confirm].join("/"), [this.base, this.account.backup].join("/"));
    };
    Url.prototype.accountImport = function () {
        this.goTo([this.base, this.account["import"]].join("/"), [this.base, this.account.create].join("/"));
    };
    Url.prototype.accountExport = function () {
        this.goTo([this.base, this.account["export"]].join("/"), [this.base, this.settings].join("/"));
    };
    Url.prototype.accountUnlock = function () {
        this.goTo([this.base, this.account.unlock].join("/"), "");
    };
    Url.prototype.receive = function (address, chain) {
        this.goTo([this.base, this.account.receive, address, chain].join("/"), window.location.hash);
    };
    Url.prototype.transfer = function (cy, chain, to) {
        var hash = window.location.hash;
        to ? this.goTo([this.base, this.transaction.transfer, cy, chain, to].join("/"), hash) :
            this.goTo([this.base, this.transaction.transfer, cy, chain].join("/"), hash);
        return;
    };
    Url.prototype.transferNFT = function (category, chain, value) {
        this.goTo([this.base, this.transaction.transferNft, category, chain, value].join("/"), [this.base, this.nftTabs].join("/"));
    };
    Url.prototype.tunnel = function (cy, chain1, chain2) {
        this.goTo([this.base, this.transaction.tunnel, cy, chain1, chain2].join("/"), [this.base].join("/"));
        return;
    };
    Url.prototype.tunnelNFT = function (symbol, chain, tokenId) {
        this.goTo([this.base, this.transaction.tunnelNFT, symbol, chain, tokenId].join("/"), [this.base, this.nftTabs].join("/"));
        return;
    };
    Url.prototype.transactionList = function (cy, chainName) {
        this.goTo([this.base, this.transaction.list, chainName, cy].join("/"), [this.base].join("/"));
        return;
    };
    Url.prototype.transactionInfo = function (chain, hash, cy) {
        this.goTo([this.base, this.transaction.info, chain, hash].join("/"), [this.base, this.transaction.list, types_1.ChainType[chain], cy].join("/"));
        return;
    };
    Url.prototype.aboutUs = function () {
        this.goTo([this.base, this.settings.about].join("/"), this.path_settings());
        return;
    };
    Url.prototype.qrScan = function (pre) {
        this.goTo([this.base, this.scan].join("/"), [this.base].join("/"));
        return;
    };
    Url.prototype.swapEth = function (op) {
        this.goTo([this.base, this.swapWEth, op].join("/"), [this.base].join("/"));
        return;
    };
    Url.prototype.frozenTronBalance = function () {
        this.goTo([this.base, "tron/frozen"].join("/"), [this.base].join("/"));
        return;
    };
    Url.prototype.epochAltar = function () {
        this.goTo([this.base, this.epoch.altar].join("/"), [this.base, this.epoch.index].join("/"));
        return;
    };
    Url.prototype.epochChaos = function () {
        this.goTo([this.base, this.epoch.chaos].join("/"), [this.base, this.epoch.index].join("/"));
    };
    return Url;
}());
var url = new Url();
exports["default"] = url;
