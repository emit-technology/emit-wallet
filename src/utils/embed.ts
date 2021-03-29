// @ts-ignore
import seropp from 'sero-pp'

class Embed{

    async initPopup(){
        const dapp = {
            name: "EMIT",
            contractAddress: "EMIT",
            github: "https://github.com/emit-technology",
            author: "emit",
            url: window.location.origin+window.location.pathname,
            logo: window.location.origin+window.location.pathname +"assets/icon/icon.png",

            barColor:"#194381",
            navColor:"#194381",
            barMode:"dark",
            navMode:"light"
        }

        seropp.init(dapp,function (rest:any,err:any) {
            return Promise.resolve()
        });

    }
}
const embed = new Embed()
export default embed
