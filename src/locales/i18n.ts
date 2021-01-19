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

import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import de_DE from './de_DE.json';
import en_US from './en_US.json';
import es_ES from './es_ES.json';
import fr_FR from './fr_FR.json';
import it_IT from './it_IT.json';
import ja_JP from './ja_JP.json';
import ko_KR from './ko_KR.json';
import nl_NL from './nl_NL.json';
import pt_BR from './pt_BR.json';
import zh_CN from './zh_CN.json';
import zh_TW from './zh_TW.json';
import be_BY from './be_BY.json';

import {initReactI18next} from 'react-i18next';
import {Plugins} from "@capacitor/core";

let lang = localStorage.getItem("language");
if (!lang) {
    lang = "en_US";
}
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en_US: {
                translation: en_US,
            },
            zh_CN: {
                translation: zh_CN,
            },
            ko_KR: {
                translation: ko_KR,
            },
            ja_JP: {
                translation: ja_JP,
            },
            de_DE: {
                translation: de_DE,
            },
            es_ES: {
                translation: es_ES,
            },
            fr_FR: {
                translation: fr_FR,
            },
            it_IT: {
                translation: it_IT,
            },
            nl_NL: {
                translation: nl_NL,
            },
            pt_BR: {
                translation: pt_BR,
            },
            zh_TW: {
                translation: zh_TW,
            },
            be_BY:{
                translation: be_BY,
            }
        },
        fallbackLng: lang,
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    }).catch(e=>{
    console.error(e)
});

i18n.changeLanguage(lang).then(()=>{
}).catch(e=>{
    console.error(e)
})

Plugins.Device.getLanguageCode().then(d=>{
    let langCode = d.value;
    if(langCode.toLowerCase().indexOf("de")>-1){
        langCode = "de_DE"
    }else if(langCode.toLowerCase().indexOf("en")>-1){
        langCode = "en_US"
    }else if(langCode.toLowerCase().indexOf("be")>-1){
        langCode = "be_BY"
    }else if(langCode.toLowerCase().indexOf("es")>-1){
        langCode = "es_ES"
    }else if(langCode.toLowerCase().indexOf("fr")>-1){
        langCode = "fr_FR"
    }else if(langCode.toLowerCase().indexOf("it")>-1){
        langCode = "it_IT"
    }else if(langCode.toLowerCase().indexOf("ja")>-1){
        langCode = "ja_JP"
    }else if(langCode.toLowerCase().indexOf("ko")>-1){
        langCode = "ko_KR"
    }else if(langCode.toLowerCase().indexOf("nl")>-1){
        langCode = "nl_NL"
    }else if(langCode.toLowerCase().indexOf("pt")>-1){
        langCode = "pt_BR"
    }else if(langCode.toLowerCase().indexOf("zh")>-1){
        langCode = "zh_TW"
    }
    let lang = localStorage.getItem("language");
    if(!lang){
        lang = langCode;
        localStorage.setItem("language", lang);
    }
    i18n.changeLanguage(lang,()=>{
        console.log("change language")
    }).catch(e=>{
        console.error(e)
    })
})


export default i18n;
