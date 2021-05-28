import * as React from 'react';
import {
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonLoading,
    IonModal,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToast,IonItem,IonLabel,IonCheckbox,
    IonToolbar
} from "@ionic/react";
import './index.scss'
import {arrowDownOutline, optionsOutline, statsChartOutline, swapHorizontal, timerOutline} from "ionicons/icons";
import url from "../../utils/url";
import rpc from "../../rpc";
import {ChainType, Transaction} from "../../types";
import walletWorker from "../../worker/walletWorker";
import * as utils from '../../utils';
import pancakeSwap from "../../contract/swap/bsc";
import BigNumber from "bignumber.js";
import router from "./router";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import GasPriceActionSheet from "../../components/GasPriceActionSheet";
import * as config from "../../config";
import EthToken from "../../contract/erc20/eth";
import selfStorage from "../../utils/storage";
import {type} from "os";
import interVar, {interVarSwap} from "../../interval";
import {createRef} from "react";
import i18n from "../../locales/i18n";

interface State {
    balance: any
    fromToken: string
    toToken: string
    fromAmount: string
    toAmount: string
    showModal: boolean
    account: any
    exact:string
    focus:string
    showAlert:boolean,
    showActionSheet:boolean,
    gasPrice:string,
    showProgress:boolean,
    tx:any,
    showToast:boolean,
    showLoading:boolean,
    toastMsg?:string,
    toastColor?:string

    crossReceipt:string
    allowance:string
    slippageTolerance:any
    deadline:any
    checked:boolean
    crossLimit:Array<string>,
    crossFee:string,
    priceSwap:boolean
}
const reg =  /^[1-9]\d*\.\d*|0\.\d*[0-9]\d*$/;

class Swap extends React.Component<any, State> {

    inputFromAmount:any
    inputToAmount:any

    constructor(props:any) {
        super(props);
        this.inputFromAmount = createRef()
        this.inputToAmount = createRef()
    }

    state: State = {
        balance: {},
        fromAmount: "",
        toAmount: "",
        fromToken: "BNB",
        toToken: "bLIGHT",
        showModal: false,
        account: {},
        exact:"from",
        focus:"from",
        showAlert:false,
        showActionSheet:false,
        gasPrice:"",
        showProgress:false,
        tx:{},
        showToast:false,
        showLoading:false,
        crossReceipt: "0x",
        allowance:"",
        slippageTolerance:selfStorage.getItem("swap:slippageTolerance") || "1",
        deadline:selfStorage.getItem("swap:deadline") || "20",
        checked:true,
        crossFee:"",
        crossLimit:["0","0"],
        priceSwap: false
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })

        interVarSwap.start(()=>{
            this.init().catch(e => {
                console.error(e)
            })
        },10 * 1000)
    }

    init = async () => {
        const {fromToken} = this.state;
        const chain = ChainType.BSC;
        const account = await walletWorker.accountInfo()
        const address = account.addresses[chain];
        const balance = await rpc.getBalance(chain, address, true)

        this.setState({
            balance: balance,
            account: account,
            crossReceipt: utils.bs58ToHex(account.addresses[ChainType.SERO]),
        })

        await this.getAllowance(fromToken)
    }

    getAllowance = async (fromToken:string)=>{
        const {account} = this.state;
        const chain = ChainType.BSC
        let allowance = "";
        if(fromToken !== "BNB"){
            const token: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.BSC[fromToken], chain);
            const rest: any = await token.allowance(account.addresses[chain], pancakeSwap.address);
            const value = utils.fromValue(rest, utils.getCyDecimal(fromToken, ChainType[chain]))
            if(value.toNumber() ==0){
                allowance = ""
            }else{
                allowance = value.toString()
            }
        }
        this.setState({
            allowance:allowance
        })
    }

    setCrossReceipt = async (v:any)=>{
        const {account} = this.state;
        if(v){
            this.setState({
                crossReceipt: utils.bs58ToHex(account.addresses[ChainType.SERO])
            })
        }else{
            this.setState({
                crossReceipt: "0x"
            })
        }
    }

    setFromAmount = async (v: any,fromT?:string,toT?:string) => {
        try{
            if(!v || parseFloat(v) == 0){
                this.setState({
                    toAmount:""
                })
                return
            }
        }catch (e){
            return
        }

        let {fromToken, toToken, checked,crossLimit} = this.state;
        fromToken = fromT || fromToken;
        toToken = toT || toToken;
        const decimalFrom = utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])
        const decimalTo = utils.getCyDecimal(toToken, ChainType[ChainType.BSC])
        const amount = utils.toValue(v, decimalFrom)
        const path = router.getPath(fromToken, toToken);
        const crossReceipt = this.getCrossReceipt();
        const out:any = await pancakeSwap.estimatSwapCross(amount,path,crossReceipt,false)
        const amounts:Array<string> = out[0]

        if(toToken != "BNB"){
            const rest = await pancakeSwap.crossLimit(router.getTokenAddress(toToken))
            crossLimit = [utils.fromValue(rest[0],decimalTo).toString(),utils.fromValue(rest[1],decimalTo).toString()]
            if(utils.fromValue(amounts[1],decimalTo).toNumber()<new BigNumber(crossLimit[0]).toNumber()){
                checked = false
            }else{
                checked = true
            }
        }

        this.setState({
            toAmount:utils.fromValue(amounts[1],decimalTo).toFixed(5,1),
            checked:checked,
            // crossFee:utils.fromValue(out[1],decimalTo).toFixed(5,1),
            crossLimit: crossLimit
        })

    }


    getCrossReceipt = ()=>{
        const {checked,account,toToken} = this.state;
        return checked && toToken != "BNB" ? utils.bs58ToHex(account.addresses[ChainType.SERO]):"0x"
    }

    setToAmount = async (v: any,fromT?:string,toT?:string) => {
        try{
            if(!v || parseFloat(v) == 0){
                this.setState({
                    fromAmount:""
                })
                return
            }
        }catch (e){
            return
        }
        let {fromToken, toToken,checked,crossLimit} = this.state;
        fromToken = fromT || fromToken;
        toToken = toT || toToken;

        const decimalFrom = utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])
        const decimalTo = utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])
        const amount = utils.toValue(v, decimalTo)
        const path = router.getPath(fromToken, toToken);
        const crossReceipt = this.getCrossReceipt();
        const out = await pancakeSwap.estimatSwapCross(amount,path,crossReceipt,true)
        const amounts:Array<string> = out[0]

        if(toToken != "BNB"){
            const rest = await pancakeSwap.crossLimit(router.getTokenAddress(toToken))
            crossLimit = [utils.fromValue(rest[0],decimalTo).toString(),utils.fromValue(rest[1],decimalTo).toString()]
            if(new BigNumber(v).toNumber()<new BigNumber(crossLimit[0]).toNumber()){
                checked = false
            }else{
                checked = true
            }
        }
        this.setState({
            fromAmount:utils.fromValue(amounts[0],decimalFrom).toFixed(5,1),
            exact:"to",
            checked:checked,
            // crossFee:utils.fromValue(out[1],decimalTo).toFixed(5,1),
            crossLimit: crossLimit
        })
    }

    approve = async (op: any) => {
        const {account,fromToken} = this.state;
        const chain = ChainType.BSC;
        let amount;
        if (op == "cancel") {
            amount = 0;
        }else{
            amount = new BigNumber(1e32);
        }
        const decimal = utils.getCyDecimal(fromToken,ChainType[chain])
        const defaultGasPrice = await utils.defaultGasPrice(ChainType.BSC);
        const tx: Transaction = {
            from: account.addresses && account.addresses[chain],
            to: config.CONTRACT_ADDRESS.ERC20[ChainType[chain]][fromToken],
            value: "0x0",
            cy: fromToken,
            gasPrice: "0x" + new BigNumber(defaultGasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: utils.toValue(amount, decimal),
            feeCy: utils.defaultCy(chain)
        }
        const ETH_COIN: EthToken = new EthToken(tx.to, chain);
        tx.data = await ETH_COIN.approve(pancakeSwap.address, utils.toValue(amount, decimal))
        tx.gas = await ETH_COIN.estimateGas(tx)
        tx.amount = tx.value;

        this.setState({
            tx: tx,
            showAlert: true
        })
    }

    commit = async ()=>{
        let {fromAmount, fromToken, toAmount, toToken, account,exact,slippageTolerance,deadline} = this.state;
        const decimalFrom = utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])
        const decimalTo = utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])
        const amountFrom = utils.toValue(fromAmount, decimalFrom)
        const amountTo = utils.toValue(toAmount, decimalTo)
        const defaultGasPrice = await utils.defaultGasPrice(ChainType.BSC);

        const path = router.getPath(fromToken, toToken);
        let to:string = account.addresses[ChainType.BSC];

        deadline = Math.floor(Date.now()/1000)+deadline * 60;

        const tx: Transaction = {
            from: to,
            to: pancakeSwap.address,
            value: "0x0",
            cy: fromToken,
            gasPrice: "0x" + new BigNumber(defaultGasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.BSC,
            amount: "0x0",
            feeCy: "BNB"
        }
        let sendTo = to;
        let crossReceipt = this.getCrossReceipt()
        if(crossReceipt != "0x"){
            sendTo = "0x0000000000000000000000000000000000000000"
        }
        // to = "0x0000000000000000000000000000000000000000"
        // crossReceipt = utils.bs58ToHex(account.addresses[ChainType.SERO])
        if(exact == "from"){
            const inMin = amountTo.multipliedBy(new BigNumber(1).minus(new BigNumber(slippageTolerance).div(100)));
            if (fromToken == "BNB") {
                tx.data = await pancakeSwap.swapExactETHForTokens(amountTo,path , sendTo , crossReceipt,deadline )
                tx.value = utils.toHex(amountFrom);
            } else if (toToken == "BNB") {
                tx.data = await pancakeSwap.swapExactTokensForETH(amountFrom,inMin,path,sendTo,deadline)
                tx.amount = utils.toHex(amountFrom);
            } else {
                tx.data = await pancakeSwap.swapExactTokensForTokens(amountFrom,inMin,path,sendTo,crossReceipt,deadline)
                tx.amount = utils.toHex(amountFrom);
            }
        }else if(exact == "to"){
            const outMax = amountFrom.multipliedBy(new BigNumber(slippageTolerance).div(100).plus(1));
            if (fromToken == "BNB") {
                tx.data = await pancakeSwap.swapETHForExactTokens(amountTo,path,sendTo,crossReceipt,deadline)
                tx.value = utils.toHex(outMax);
            } else if (toToken == "BNB") {
                tx.data = await pancakeSwap.swapTokensForExactETH(amountTo,outMax,path,sendTo,deadline)
                tx.amount = utils.toHex(amountFrom);
            } else {
                tx.data = await pancakeSwap.swapTokensForExactTokens(amountTo,outMax,path,sendTo,crossReceipt,deadline)
                tx.amount = utils.toHex(amountFrom);
            }
        }
        tx.gas = await pancakeSwap.estimateGas(tx)
        this.setState({
            tx:tx,
            showAlert:true
        })
    }

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f,
            slippageTolerance:selfStorage.getItem("swap:slippageTolerance")||"1",
            deadline:selfStorage.getItem("swap:deadline")||"20"
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert:f
        })
    }

    setShowActionSheet = (f: boolean) => {
        this.setState({
            showActionSheet: f
        })
    }

    setShowProgress = (f:boolean)=>{
        this.setState({
            showProgress:f
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    setShowToast = (f:boolean,color?:string,m?:string) =>{
        this.setState({
            showToast:f,
            toastMsg:m,
            toastColor:color
        })
    }

    setGasPrice=(v:string)=>{
        this.setState(
            {
                gasPrice:v,
                showActionSheet:false
            }
        )
    }

    confirm = async (hash:string) => {
        const {fromToken} = this.state;
        const chain = ChainType.BSC
        let intervalId:any = 0;
        this.setState({
            showLoading:true
        })
        intervalId = setInterval(()=>{
            rpc.getTransactionByHash(hash,chain).then((rest:any) => {
                if (rest && new BigNumber(rest.blockNumber).toNumber() > 0) {
                    this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    this.setShowProgress(false);
                    this.setState({
                        showLoading:false,
                        fromAmount:"",
                        toAmount:"",
                        focus:"from",
                        exact:"from"
                    })
                    this.init().catch(e=>{
                        console.error(e)
                    })
                }
            }).catch(e=>{
                this.setShowProgress(false);
                console.error(e)
            })
        },1000)
        this.setShowAlert(false)
    }

    setSlippageTolerance = (v:any)=>{
        if(v>=0 && v<=100){
            if(v && v != 0){
                selfStorage.setItem("swap:slippageTolerance",v);
            }
            this.setState({
                slippageTolerance:v
            })
        }
    }

    setDeadline = (v:any)=>{
        if(v && v != 0){
            selfStorage.setItem("swap:deadline",v)
        }
        this.setState({
            deadline:v
        })
    }

    setChecked = (f:boolean) =>{
        this.setState({checked:f})
    }

    setTextInputRef = (e:any) => {
        console.log(e,"setTextInputRef")
    };

    setSwapPosition = async ()=>{
        const {fromAmount,toAmount,focus,fromToken,toToken} = this.state;
        if(focus == "from"){
            this.setState({
                fromAmount:toAmount,
                toAmount:fromAmount,
                fromToken: toToken,
                toToken: fromToken,
                exact:"to",
                focus:"to"
            })
            await this.setToAmount(fromAmount,toToken,fromToken)

        }else if(focus == "to"){
            this.setState({
                toAmount:fromAmount,
                fromAmount:toAmount,
                fromToken: toToken,
                toToken: fromToken,
                exact:"from",
                focus:"from"
            })
            await this.setFromAmount(toAmount,toToken,fromToken)
        }
    }

    render() {
        const {balance, fromToken, fromAmount, toToken, toAmount,checked,crossLimit,crossFee,priceSwap,
            toastColor,toastMsg,allowance,exact,focus,slippageTolerance,deadline,
            showModal,showAlert,showProgress,showActionSheet,
            gasPrice,tx,showLoading,showToast} = this.state;

        const fromBalance = balance && balance[fromToken] && utils.fromValue(balance[fromToken],
            utils.getCyDecimal(fromToken, ChainType[ChainType.BSC])).toFixed(5, 1);

        const toBalance = balance && balance[toToken] && utils.fromValue(balance[toToken], utils.getCyDecimal(toToken, ChainType[ChainType.BSC])).toFixed(5, 1);
        return <IonPage>
            <IonHeader mode="ios">
                <IonToolbar color="primary" mode="ios">
                    <IonTitle>{i18n.t("swap")}</IonTitle>
                    <IonIcon slot="end" src={statsChartOutline} style={{fontSize: "24px", marginRight: "15px"}}
                             onClick={() => {
                                 url.chart("LIGHT_BNB")
                             }}/>
                </IonToolbar>

            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="swap">
                    <div className="swap-title">
                        <IonRow>
                            <IonCol size="8">
                                <div>
                                    <h2><IonText color="primary">{i18n.t("exchange")}</IonText></h2>
                                    <p><small><IonText color="secondary">Wrapped Pancake Swap</IonText></small>
                                    </p>
                                </div>
                            </IonCol>
                            <IonCol size="2" style={{padding: "40px 0"}}>
                                <IonIcon src={optionsOutline} size="large" color="primary" onClick={() => {
                                    this.setShowModal(true)
                                }}/>
                            </IonCol>
                            {/*<IonCol size="2" style={{padding: "40px 0"}}>*/}
                            {/*    <IonIcon src={timerOutline} size="large" color="primary"/>*/}
                            {/*</IonCol>*/}
                        </IonRow>
                    </div>
                    <div className="swap-content">
                        <div className="swap-item">
                            <IonRow>
                                <IonCol size="5">{i18n.t("from")}{exact=="to"?<small>({i18n.t("estimated")})</small>:""}</IonCol>
                                <IonCol size="7" style={{textAlign: "right"}}>
                                    {i18n.t("balance")}: {fromBalance}
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6">
                                    <input className="input-customer" placeholder="0.0" type="text" ref={this.inputFromAmount} value={fromAmount} onFocus={()=>{
                                        this.setState({
                                            focus:"from"
                                        })
                                    }}  onChange={(e)=>{
                                        const v = this.inputFromAmount.current.value;
                                        // if((v!=0||v!="0"||v!="0.") && !reg.test(v)){
                                        //     return
                                        // }
                                        this.setState({
                                            exact:"from",
                                            fromAmount:v,
                                        })
                                        setTimeout(()=>{
                                            this.setFromAmount(v).catch(err=>{
                                                console.error(err)
                                            })
                                        },100)
                                    }}  />
                                    <span className="swap-font" onClick={(e)=>{
                                        e.stopPropagation()
                                        this.setState({
                                            fromAmount:fromBalance,
                                            focus:"to",
                                            exact:"from"
                                        })
                                        this.setFromAmount(fromBalance).catch(e=>{
                                            console.error(e)
                                        })
                                    }}>{i18n.t("max")}</span>
                                </IonCol>
                                <IonCol size="6" style={{textAlign: "right"}}>
                                    <IonRow>
                                        <IonCol size="12" style={{textAlign: "right"}}>
                                            <IonSelect title="Select a token" mode="ios" value={fromToken}
                                                       onIonChange={(e) => {
                                                           this.setState({
                                                               toToken:fromToken,
                                                               fromToken: e.detail.value,
                                                           })
                                                       }}>
                                                {
                                                    router.getTokens().map(v=>{
                                                        return <IonSelectOption value={v}>{v}</IonSelectOption>
                                                    })
                                                }
                                            </IonSelect>
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </div>
                        <div style={{textAlign: "center", width: "100%"}}>
                            <IonIcon src={arrowDownOutline} size="large" onClick={() => {
                                this.getAllowance(toToken).catch(e=>{
                                    console.error(e)
                                })
                                this.setSwapPosition().catch(e=>{
                                    console.error(e)
                                })
                            }}/>
                        </div>
                        <div className="swap-item">
                            <IonRow>
                                <IonCol size="5">{i18n.t("to")}{exact=="from"?<small>({i18n.t("estimated")})</small>:""}</IonCol>
                                <IonCol size="7" style={{textAlign: "right"}}>{i18n.t("balance")}: {toBalance}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6">
                                    <input className="input-customer" placeholder="0.0" ref={this.inputToAmount} value={toAmount} onFocus={()=>{
                                        this.setState({
                                            focus:"to"
                                        })
                                    }} onChange={(e)=>{
                                        const v = this.inputToAmount.current.value;
                                        //
                                        // if((v!=0||v!="0"||v!="0.") && !reg.test(v)){
                                        //     return
                                        // }
                                        this.setState({
                                            exact:"to",
                                            toAmount:v,
                                        })
                                        setTimeout(()=>{
                                            this.setToAmount(v).catch(err=>{
                                                console.error(err)
                                            })
                                        },100)
                                    }} />
                                </IonCol>
                                <IonCol size="6" style={{textAlign: "right"}}>
                                    <IonRow>
                                        <IonCol size="12" style={{textAlign: "right"}}>
                                            <IonSelect title="Select a token" mode="ios" value={toToken}
                                                       onIonChange={(e) => {
                                                           this.setState({
                                                               fromToken:toToken,
                                                               toToken: e.detail.value
                                                           })
                                                       }}>
                                                {
                                                    router.getTokens().map(v=>{
                                                        return <IonSelectOption value={v}>{v}</IonSelectOption>
                                                    })
                                                }
                                            </IonSelect>
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </div>

                        {
                            toToken != "BNB" && <div className="swap-item-cross">
                                <IonItem lines="none">
                                    <IonLabel color="primary"><small>{i18n.t("cross")} {toToken} {i18n.t("to")} SERO {i18n.t("chain")}</small></IonLabel>
                                    <IonCheckbox checked={checked} disabled={!toAmount || new BigNumber(toAmount).toNumber()<new BigNumber(crossLimit[0]).toNumber()} mode="ios" slot="start" onIonChange={e => this.setChecked(e.detail.checked)} />
                                </IonItem>
                            </div>
                        }
                    </div>

                    <div>
                        <IonRow>
                            {
                                fromToken!="BNB" && fromAmount && new BigNumber(fromAmount).comparedTo(new BigNumber(fromBalance)) < 1 &&  <IonCol >
                                    <IonButton mode="ios" disabled={!!allowance} color={!allowance?"primary":"medium"} expand="block" onClick={() => {
                                        this.setShowLoading(true)
                                        this.approve("").then(()=>{
                                            this.setShowLoading(false)
                                        }).catch(e=>{
                                            this.setShowLoading(false)
                                            const err = typeof e =="string"?e:e.message;
                                            this.setShowToast(true,"danger",err)
                                            console.error(e)
                                        })
                                    }}>{!allowance?i18n.t("approve"):i18n.t("approved")}</IonButton>
                                </IonCol>
                            }
                            <IonCol>
                                <IonButton mode="ios" color={!allowance && fromToken!="BNB"?"medium":"primary"} disabled={!allowance && fromToken!="BNB" || !fromAmount || new BigNumber(fromAmount).comparedTo(new BigNumber(fromBalance)) == 1} expand="block" onClick={() => {
                                    this.setShowLoading(true)
                                    this.commit().then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(e=>{
                                        this.setShowLoading(false)
                                        const err = typeof e =="string"?e:e.message;
                                        this.setShowToast(true,"danger",err)
                                        console.error(e)
                                    })
                                }}>{(new BigNumber(fromAmount).comparedTo(new BigNumber(fromBalance)) == 1)?`${i18n.t("insufficient")} ${fromToken} ${i18n.t("balance")}`:i18n.t("swap")}</IonButton>
                            </IonCol>
                        </IonRow>

                        {
                            fromToken!="BNB" && fromAmount && new BigNumber(fromAmount).comparedTo(new BigNumber(fromBalance)) < 1 &&   <IonRow>
                                <IonCol size="2"></IonCol>
                                <IonCol size="8">
                                    <div className="sc-dWdcrH sc-eJBYSJ bHWkln csTlMB">
                                        <div className="sc-jGVbCA sc-fXoxut sc-Fyfyc sc-fFYUoA cBDHvY fnVNkv fTMjUf FCJNq">
                                            <div className="sc-iitrsy eGMabU">
                                                <div className={`sc-hlWvWH ${!allowance ?"ivaHnX":"DWCcU"}`}>1</div>
                                                <div className={`sc-dYzljZ ${!allowance?"jgcsSj":"hybVMo"}`}></div>
                                            </div>
                                            <div className={`sc-hlWvWH ${!allowance?"jxVUMv":"ivaHnX"}`}>2</div>
                                        </div>
                                    </div>
                                </IonCol>
                                <IonCol size="2"></IonCol>
                            </IonRow>
                        }

                    </div>

                    <div className="swap-price">
                        {
                            toAmount && <IonRow>
                                <IonCol size="2">{i18n.t("price")}</IonCol>
                                <IonCol size="10">
                                    <div style={{textAlign: "right"}}>
                                        {
                                            priceSwap?`${new BigNumber(toAmount).dividedBy(new BigNumber(fromAmount)).toFixed(6)} ${toToken} per ${fromToken}`:
                                                `${new BigNumber(fromAmount).dividedBy(new BigNumber(toAmount)).toFixed(6)} ${fromToken} per ${toToken}`
                                        }
                                          <IonIcon color="secondary" size="small" src={swapHorizontal} onClick={()=>{
                                            this.setState({
                                                priceSwap:!priceSwap
                                            })
                                    }}/>
                                    </div>
                                </IonCol>
                            </IonRow>
                        }
                        <IonRow>
                            <IonCol size="6">{i18n.t("slippage")}</IonCol>
                            <IonCol size="6" style={{textAlign: "right"}}>{slippageTolerance}%</IonCol>
                        </IonRow>

                        {
                            toAmount && toToken != "BNB" && checked && <>
                                <IonRow>
                                    <IonCol size="4">{i18n.t("crossLimit")}</IonCol>
                                    <IonCol size="8">
                                        <div style={{textAlign: "right"}}>{i18n.t("min")}: {crossLimit[0]} , {i18n.t("max")}: {crossLimit[1]}</div>
                                    </IonCol>
                                </IonRow>
                                {/*<IonRow>*/}
                                {/*    <IonCol size="4">Cross Fee</IonCol>*/}
                                {/*    <IonCol size="8">*/}
                                {/*        <div style={{textAlign: "right"}}>{crossFee} {toToken}</div>*/}
                                {/*    </IonCol>*/}
                                {/*</IonRow>*/}
                                {/*<IonRow>*/}
                                {/*    <IonCol size="4">Estimate</IonCol>*/}
                                {/*    <IonCol size="8">*/}
                                {/*        <div style={{textAlign: "right"}}>*/}
                                {/*            /!*{*!/*/}
                                {/*            /!*new BigNumber(toAmount).comparedTo(new BigNumber(crossFee))>=0?*!/*/}
                                {/*            /!*    new BigNumber(toAmount).minus(new BigNumber(crossFee)).toNumber():0*!/*/}
                                {/*            /!*} *!/*/}
                                {/*        {toAmount} {toToken}</div>*/}
                                {/*    </IonCol>*/}
                                {/*</IonRow>*/}
                            </>
                        }
                    </div>
                </div>

                <IonModal
                    isOpen={showModal}
                    cssClass='select-token-class'
                    swipeToClose={true}
                    onDidDismiss={() => this.setShowModal(false)}>


                    <div className="setting-content">
                        <div style={{borderBottom:"1px dashed #ddd"}}>
                            <IonRow  style={{padding:"12px 0 5px"}}>
                                <IonCol size="10" style={{textAlign:"center",fontSize:"24px",fontWeight:600}} ><IonText color="primary">{i18n.t("settings")}</IonText></IonCol>
                                <IonCol size="2" style={{textAlign:"center"}} onClick={(e)=>{
                                    e.stopPropagation();
                                    this.setShowModal(false)
                                }}>X</IonCol>
                            </IonRow>
                        </div>
                        <div style={{padding:"12px",fontWeight:600,fontSize:"16px"}}><IonText color="primary">{i18n.t("slippage")}</IonText></div>
                        <IonRow style={{paddingLeft:"24px"}}>
                            <IonCol size="4"><IonButton  mode="ios" color={slippageTolerance=="0.1"?"primary":"light"} onClick={()=>{
                                this.setSlippageTolerance("0.1")
                            }} expand="block">0.1%</IonButton></IonCol>
                            <IonCol size="4"><IonButton mode="ios" color={slippageTolerance=="0.5"?"primary":"light"}  onClick={()=>{
                                this.setSlippageTolerance("0.5")
                            }} expand="block">0.5%</IonButton></IonCol>
                            <IonCol size="4"><IonButton mode="ios" color={slippageTolerance=="1"?"primary":"light"}  onClick={()=>{
                                this.setSlippageTolerance("1")
                            }} expand="block">1%</IonButton></IonCol>
                            <IonCol size="10">
                                <IonInput type="number" placeholder="5" value={slippageTolerance} onIonChange={(e=>{
                                    this.setSlippageTolerance(e.detail.value)
                                })} className="sli-input"/>
                            </IonCol>
                            <IonCol size="2">
                                <div style={{padding:"10px 0"}}>%</div>
                            </IonCol>
                        </IonRow>
                        {
                            !slippageTolerance && <div style={{paddingLeft:"28px"}}><IonText color="danger">Enter a valid slippage percentage</IonText></div>
                        }

                        <div style={{padding:"12px 12px 5px",fontWeight:600,fontSize:"16px"}}><IonText color="primary">{i18n.t("deadline")}</IonText></div>
                        <IonRow style={{paddingLeft:"24px"}}>
                            <IonCol size="4">
                                <IonInput  type="number" placeholder="20" className="sli-input" value={deadline} onIonChange={(e=>{
                                    this.setDeadline(e.detail.value)
                                })}/>
                            </IonCol>
                            <IonCol size="4">
                                <div style={{padding:"10px 0"}}>{i18n.t("minutes")}</div>
                            </IonCol>
                        </IonRow>
                        {
                            !deadline && <div style={{paddingLeft:"28px"}} ><IonText  color="danger">Enter a valid deadline</IonText></div>
                        }

                    </div>



                    <div></div>
                </IonModal>

                <IonToast
                    color={!toastColor?"warning":toastColor}
                    position="top"
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMsg}
                    duration={1500}
                    mode="ios"
                />

                <IonLoading
                    mode="ios"
                    spinner={"bubbles"}
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => {
                        this.setState({
                            showLoading:false
                        })
                    }}
                    message={'Please wait...'}
                    duration={120000}
                />


                {/*<GasPriceActionSheet onClose={()=>this.setShowActionSheet(false)}  show={showActionSheet} onSelect={this.setGasPrice} value={gasPrice} chain={ChainType.BSC}/>*/}

                <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.setShowAlert(false)} onOK={this.confirm}/>

            </IonContent>
        </IonPage>;
    }
}

export default Swap