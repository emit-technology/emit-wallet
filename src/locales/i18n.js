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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
var i18next_1 = __importDefault(require("i18next"));
var de_DE_json_1 = __importDefault(require("./de_DE.json"));
var en_US_json_1 = __importDefault(require("./en_US.json"));
var es_ES_json_1 = __importDefault(require("./es_ES.json"));
var fr_FR_json_1 = __importDefault(require("./fr_FR.json"));
var it_IT_json_1 = __importDefault(require("./it_IT.json"));
var ja_JP_json_1 = __importDefault(require("./ja_JP.json"));
var ko_KR_json_1 = __importDefault(require("./ko_KR.json"));
var nl_NL_json_1 = __importDefault(require("./nl_NL.json"));
var pt_BR_json_1 = __importDefault(require("./pt_BR.json"));
var zh_CN_json_1 = __importDefault(require("./zh_CN.json"));
var zh_TW_json_1 = __importDefault(require("./zh_TW.json"));
var be_BY_json_1 = __importDefault(require("./be_BY.json"));
var react_i18next_1 = require("react-i18next");
var core_1 = require("@capacitor/core");
var lang = localStorage.getItem("language");
if (!lang) {
    lang = "en_US";
}
i18next_1.default.use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init({
    resources: {
        en_US: {
            translation: en_US_json_1.default,
        },
        zh_CN: {
            translation: zh_CN_json_1.default,
        },
        ko_KR: {
            translation: ko_KR_json_1.default,
        },
        ja_JP: {
            translation: ja_JP_json_1.default,
        },
        de_DE: {
            translation: de_DE_json_1.default,
        },
        es_ES: {
            translation: es_ES_json_1.default,
        },
        fr_FR: {
            translation: fr_FR_json_1.default,
        },
        it_IT: {
            translation: it_IT_json_1.default,
        },
        nl_NL: {
            translation: nl_NL_json_1.default,
        },
        pt_BR: {
            translation: pt_BR_json_1.default,
        },
        zh_TW: {
            translation: zh_TW_json_1.default,
        },
        be_BY: {
            translation: be_BY_json_1.default,
        }
    },
    fallbackLng: lang,
    debug: false,
    interpolation: {
        escapeValue: false,
    },
}).catch(function (e) {
    console.error(e);
});
i18next_1.default.changeLanguage(lang).then(function () {
}).catch(function (e) {
    console.error(e);
});
core_1.Plugins.Device.getLanguageCode().then(function (d) {
    var langCode = d.value;
    if (langCode.toLowerCase().indexOf("de") > -1) {
        langCode = "de_DE";
    }
    else if (langCode.toLowerCase().indexOf("en") > -1) {
        langCode = "en_US";
    }
    else if (langCode.toLowerCase().indexOf("be") > -1) {
        langCode = "be_BY";
    }
    else if (langCode.toLowerCase().indexOf("es") > -1) {
        langCode = "es_ES";
    }
    else if (langCode.toLowerCase().indexOf("fr") > -1) {
        langCode = "fr_FR";
    }
    else if (langCode.toLowerCase().indexOf("it") > -1) {
        langCode = "it_IT";
    }
    else if (langCode.toLowerCase().indexOf("ja") > -1) {
        langCode = "ja_JP";
    }
    else if (langCode.toLowerCase().indexOf("ko") > -1) {
        langCode = "ko_KR";
    }
    else if (langCode.toLowerCase().indexOf("nl") > -1) {
        langCode = "nl_NL";
    }
    else if (langCode.toLowerCase().indexOf("pt") > -1) {
        langCode = "pt_BR";
    }
    else if (langCode.toLowerCase().indexOf("zh") > -1) {
        langCode = "zh_TW";
    }
    else {
        langCode = "en_US";
    }
    var lang = localStorage.getItem("language");
    if (!lang) {
        lang = langCode;
        localStorage.setItem("language", lang);
    }
    i18next_1.default.changeLanguage(lang, function () {
        console.log("change language");
    }).catch(function (e) {
        console.error(e);
    });
});
exports.default = i18next_1.default;
