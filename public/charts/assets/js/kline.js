
var kline = {

    host: "https://node-event.emit.technology",
    messageId: 0,
    chart:null,
    timeline:"1H",
    updateFlag:false,
    symbol: "LIGHT/BNB",

    init: function () {
        var that = this;
        var symbol = this.getQueryString("symbol");
        // console.log("symbol",symbol)
        if(symbol){
            this.symbol = symbol.split("_").join("/")
        }
        $("title").html(this.symbol);
        $("#symbol").text(this.symbol);

        this.chart = klinecharts.init('chart', options)
        this.chart.createTechnicalIndicator('MA', false, {id: 'candle_pane'})
        this.chart.createTechnicalIndicator('VOL')
        this.chart.createTechnicalIndicator('MACD')

        this.chart.loadMore(function (timestamp){
            console.log(timestamp,"timestamp11")
            const ret = that.getTimeModal();
            var timediff = ret.timediff;
            var timeModel = ret.timeModel;
            var endTime = Math.floor(timestamp / 1000);
            var fromTime = endTime-timediff;

            that.post(that.symbol, fromTime, endTime, timeModel, function (rest, err) {
                if (err) {
                    // alert(err);
                    return
                } else {
                    if(rest && rest.length>1){
                        rest.map(v=>{
                            v.timestamp = v.timestamp * 1000
                        })
                        that.chart.applyMoreData(rest,true)
                    }
                }
            })
        })

        that.timeline = localStorage.getItem("timeline");
        if(!this.timeline){
            this.timeline = "1H";//default
        }
        $('.top-bar-item').removeClass('top-bar-item-selected')
        $(`#${this.timeline}`).addClass('top-bar-item-selected');
        this.getDataByTimeLine(this.timeline)

        setInterval(function (){
            that.getDataByTimeLine()
        },5 * 1000)

        $('.top-bar-item').bind('click', function () {

            that.updateFlag=false
            $('.top-bar-item').removeClass('top-bar-item-selected')
            $(this).addClass('top-bar-item-selected');
            that.timeline = $(this).text();
            that.getDataByTimeLine()
            localStorage.setItem("timeline",that.timeline)
        })
    },

    getQueryString:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },

    getTimeModal: function () {
        var that =this;
        var timediff = 12 * 24 * 60 * 60;
        var timeModel = 1 * 60 * 60;
        var t = that.timeline;
        if (t === "5m") {
            timediff = 1 * 24 * 60 * 60;
            timeModel = 5 * 60;
        } else if (t === "15m") {
            timediff = 3 * 24 * 60 * 60;
            timeModel = 15 * 60;
        } else if (t === "30m") {
            timediff = 6 * 24 * 60 * 60;
            timeModel = 30 * 60;
        } else if (t === "1H") {
            timediff = 12 * 24 * 60 * 60;
            timeModel = 1 * 60 * 60;
        } else if (t === "1D") {
            timediff = 24 * 12 * 24 * 60 * 60;
            timeModel = 24 * 60 * 60;
        }
        return {timediff, timeModel};
    },
    getDataByTimeLine:function (){
        var that = this;
        // var t =  that.timeline;
        const ret = this.getTimeModal();
        var timediff = ret.timediff;
        var timeModel = ret.timeModel;
        if(!that.updateFlag){
            that.getData(timediff,timeModel)
        }else{
            that.updateData(timediff,timeModel)
        }
        this.updateFlag = true
    },

    post: function (symbol, fromTime, endTime, timeModel, cb) {
        var params = [symbol, fromTime, endTime, timeModel]
        var data = {"id": this.messageId++, "jsonrpc": "2.0", "method": "swap_kLineRecord", "params": params}
        $.ajax({
            type: 'POST',
            url: this.host,
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (resp) {
                cb(resp.result)
            },
            error: function (xhr, type) {
                cb("", "get data failed!")
            }
        });
    },

    getData:function (timediff = 30 * 24 * 60 * 60,timeModel=24 * 60 * 60){
        var that = this;
        // var timediff = 30 * 24 * 60 * 60;
        var endTime = Math.floor(Date.now() / 1000);
        var fromTime = endTime - timediff;
        // var timeModel = 24 * 60 * 60;

        this.post(that.symbol, fromTime, endTime, timeModel, function (rest, err) {
            if (err) {
                // alert(err);
                return
            } else {
                rest.map(v=>{
                    v.timestamp = v.timestamp * 1000
                })
                that.chart.applyNewData(rest, true)
            }
        })
    },

    updateData : function (timediff = 30 * 24 * 60 * 60,timeModel=24 * 60 * 60){
        var that = this;
        // var timeModel = 24 * 60 * 60;
        var dataList = that.chart.getDataList()
        if(dataList && dataList.length>0){
            var lastData = dataList[dataList.length - 1]
            // var timediff = 30 * 24 * 60 * 60;
            var endTime = Math.floor(Date.now() / 1000);
            var fromTime = Math.floor(lastData.timestamp/1000) - timeModel;

            that.post(that.symbol, fromTime, endTime, timeModel, function (rest, err) {
                if (err) {
                    // alert(err);
                    return
                } else {
                    if(rest && rest.length>0){
                        var newData = rest[rest.length-1]
                        newData.timestamp =  newData.timestamp * 1000 ;
                        that.chart.updateData(newData)
                    }
                }
            })
        }

    },



}

var options = {
    grid: {
        show: true,
        // 网格水平线
        horizontal: {
            show: true,
            size: 1,
            color: '#393939',
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [2, 2]
        },
        // 网格垂直线
        vertical: {
            show: false,
            size: 1,
            color: '#393939',
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [2, 2]
        }
    },
    // 蜡烛图
    candle: {
        // 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
        margin: {
            top: 0.2,
            bottom: 0.1
        },
        // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
        type: 'candle_solid',
        // 蜡烛柱
        bar: {
            upColor: '#5dae62',
            downColor: '#cd633f',
            noChangeColor: '#888888'
        },
        // 面积图
        area: {
            lineSize: 2,
            lineColor: '#2196F3',
            value: 'close',
            fillColor: [{
                offset: 0,
                color: 'rgba(33, 150, 243, 0.01)'
            }, {
                offset: 1,
                color: 'rgba(33, 150, 243, 0.2)'
            }]
        },
        priceMark: {
            show: true,
            // 最高价标记
            high: {
                show: true,
                color: '#D9D9D9',
                textMargin: 5,
                textSize: 10,
                textFamily: 'Helvetica Neue',
                textWeight: 'normal'
            },
            // 最低价标记
            low: {
                show: true,
                color: '#D9D9D9',
                textMargin: 5,
                textSize: 10,
                textFamily: 'Helvetica Neue',
                textWeight: 'normal',
            },
            // 最新价标记
            last: {
                show: true,
                upColor: '#5dae62',
                downColor: '#cd633f',
                noChangeColor: '#888888',
                line: {
                    show: true,
                    // 'solid'|'dash'
                    style: 'dash',
                    dashValue: [4, 4],
                    size: 1
                },
                text: {
                    show: true,
                    size: 12,
                    paddingLeft: 2,
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 2,
                    color: '#FFFFFF',
                    family: 'Helvetica Neue',
                    weight: 'normal'
                }
            }
        },
        // 提示
        tooltip: {
            showRule: 'always',
            showType: 'rect',
            labels: ['', 'Open', 'Close', 'High', 'Low', 'Vol'],
            // 可以是数组，也可以是方法，如果是方法则需要返回一个数组
            // 数组和方法返回的数组格式为:
            // [xxx, xxx, ......]或者[{ color: '#fff', value: xxx }, { color: '#000', value: xxx }, .......]
            values: null,
            defaultValue: 'n/a',
            rect: {
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 6,
                offsetLeft: 4,
                offsetTop: 8,
                offsetRight: 4,
                bordrRadius: 4,
                borderSize: 1,
                borderColor: '#3f4254',
                fillColor: 'rgba(17, 17, 17, .3)'
            },
            text: {
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: '#D9D9D9',
                marginLeft: 4,
                marginTop: 6,
                marginRight: 4,
                marginBottom: 0
            }
        }
    },
    // 技术指标
    technicalIndicator: {
        margin: {
            top: 0.2,
            bottom: 0.1
        },
        bar: {
            upColor: '#5dae62',
            downColor: '#cd633f',
            noChangeColor: '#888888'
        },
        line: {
            size: 1,
            colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
        },
        circle: {
            upColor: '#5dae62',
            downColor: '#cd633f',
            noChangeColor: '#888888'
        },
        // 最新值标记
        lastValueMark: {
            show: false,
            text: {
                show: false,
                color: '#ffffff',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                paddingLeft: 3,
                paddingTop: 2,
                paddingRight: 3,
                paddingBottom: 2
            }
        },
        // 提示
        tooltip: {
            showRule: 'always',
            showName: true,
            showParams: true,
            defaultValue: 'n/a',
            text: {
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                color: '#D9D9D9',
                marginTop: 6,
                marginRight: 8,
                marginBottom: 0,
                marginLeft: 8
            }
        }
    },
    // x轴
    xAxis: {
        show: true,
        height: null,
        // x轴线
        axisLine: {
            show: true,
            color: '#888888',
            size: 1
        },
        // x轴分割文字
        tickText: {
            show: true,
            color: '#D9D9D9',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 12,
            paddingTop: 3,
            paddingBottom: 6
        },
        // x轴分割线
        tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: '#888888'
        }
    },
    // y轴
    yAxis: {
        show: true,
        width: null,
        // 'left' | 'right'
        position: 'right',
        // 'normal' | 'percentage'
        type: 'normal',
        inside: false,
        // y轴线
        axisLine: {
            show: true,
            color: '#888888',
            size: 1
        },
        // x轴分割文字
        tickText: {
            show: true,
            color: '#D9D9D9',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 12,
            paddingLeft: 3,
            paddingRight: 6
        },
        // x轴分割线
        tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: '#888888'
        }
    },
    // 图表之间的分割线
    separator: {
        size: 1,
        color: '#888888',
        fill: true,
        activeBackgroundColor: 'rgba(230, 230, 230, .15)'
    },
    // 十字光标
    crosshair: {
        show: true,
        // 十字光标水平线及文字
        horizontal: {
            show: true,
            line: {
                show: true,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [4, 2],
                size: 1,
                color: '#888888'
            },
            text: {
                show: true,
                color: '#D9D9D9',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderSize: 1,
                borderColor: '#505050',
                backgroundColor: '#505050'
            }
        },
        // 十字光标垂直线及文字
        vertical: {
            show: true,
            line: {
                show: true,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [4, 2],
                size: 1,
                color: '#888888'
            },
            text: {
                show: true,
                color: '#D9D9D9',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderSize: 1,
                borderColor: '#505050',
                backgroundColor: '#505050'
            }
        }
    },
    graphicMark: {
        line: {
            color: '#2196F3',
            size: 1
        },
        point: {
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            borderSize: 1,
            radius: 4,
            activeBackgroundColor: '#2196F3',
            activeBorderColor: '#2196F3',
            activeBorderSize: 1,
            activeRadius: 6
        },
        polygon: {
            stroke: {
                size: 1,
                color: '#2196F3'
            },
            fill: {
                color: 'rgba(33, 150, 243, 0.1)'
            }
        },
        arc: {
            stroke: {
                size: 1,
                color: '#2196F3'
            },
            fill: {
                color: 'rgba(33, 150, 243, 0.1)'
            }
        },
        text: {
            color: '#2196F3',
            size: 12,
            family: 'Helvetica Neue',
            weight: 'normal',
            marginLeft: 2,
            marginRight: 2,
            marginTop: 2,
            marginBottom: 6
        }
    },
    annotation: {
        symbol: {
            // 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
            type: 'diamond',
            // 'top' | 'bottom' | 'point'
            position: 'top',
            size: 8,
            color: '#1e88e5',
            activeSize: 10,
            activeColor: '#FF9600',
            offset: [0, 20]
        }
    }
}
