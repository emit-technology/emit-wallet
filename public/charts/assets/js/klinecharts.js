/**
 * @license
 * KLineChart v7.1.0
 * Copyright (c) 2019 lihu.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.klinecharts = {}));
}(this, (function (exports) { 'use strict';

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 成交均线
 */
var averagePrice = {
  name: 'AVP',
  series: 'price',
  precision: 4,
  plots: [{
    key: 'avp',
    title: 'AVP: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList) {
    var totalTurnover = 0;
    var totalVolume = 0;
    return dataList.map(function (kLineData) {
      var avp = {};
      var turnover = kLineData.turnover || 0;
      var volume = kLineData.volume || 0;
      totalTurnover += turnover;
      totalVolume += volume;

      if (totalVolume !== 0) {
        avp.avp = totalTurnover / totalVolume;
      }

      return avp;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 多空指标
 * 公式: BBI = (MA(CLOSE, M) + MA(CLOSE, N) + MA(CLOSE, O) + MA(CLOSE, P)) / 4
 *
 */
var bullAndBearIndex = {
  name: 'BBI',
  series: 'price',
  precision: 4,
  calcParams: [3, 6, 12, 24],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  plots: [{
    key: 'bbi',
    title: 'BBI: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var maxParam = Math.max.apply(null, calcParams);
    var closeSums = [];
    var mas = [];
    return kLineDataList.map(function (kLineData, i) {
      var bbi = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, index) {
        closeSums[index] = (closeSums[index] || 0) + close;

        if (i >= param - 1) {
          mas[index] = closeSums[index] / param;
          closeSums[index] -= kLineDataList[i - (param - 1)].close;
        }
      });

      if (i >= maxParam - 1) {
        var maSum = 0;
        mas.forEach(function (ma) {
          maSum += ma;
        });
        bbi.bbi = maSum / 4;
      }

      return bbi;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * DMA
 * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
 */
var differentOfMovingAverage = {
  name: 'DMA',
  calcParams: [10, 50, 10],
  plots: [{
    key: 'dma',
    title: 'DMA: ',
    type: 'line'
  }, {
    key: 'ama',
    title: 'AMA: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var maxParam = Math.max(calcParams[0], calcParams[1]);
    var closeSum1 = 0;
    var closeSum2 = 0;
    var dmaSum = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var dma = {};
      var close = kLineData.close;
      closeSum1 += close;
      closeSum2 += close;
      var ma1;
      var ma2;

      if (i >= calcParams[0] - 1) {
        ma1 = closeSum1 / calcParams[0];
        closeSum1 -= dataList[i - (calcParams[0] - 1)].close;
      }

      if (i >= calcParams[1] - 1) {
        ma2 = closeSum2 / calcParams[1];
        closeSum2 -= dataList[i - (calcParams[1] - 1)].close;
      }

      if (i >= maxParam - 1) {
        var dif = ma1 - ma2;
        dma.dma = dif;
        dmaSum += dif;

        if (i >= maxParam + calcParams[2] - 2) {
          dma.ama = dmaSum / calcParams[2];
          dmaSum -= result[i - (calcParams[2] - 1)].dma;
        }
      }

      result.push(dma);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * DMI
 *
 * MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
 * HD :=HIGH-REF(HIGH,1);
 * LD :=REF(LOW,1)-LOW;
 * DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
 * DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
 *
 * PDI: DMP*100/MTR;
 * MDI: DMM*100/MTR;
 * ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
 * ADXR:EXPMEMA(ADX,MM);
 * 公式含义：
 * MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
 * HD赋值:最高价-昨日最高价
 * LD赋值:昨日最低价-最低价
 * DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
 * DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
 * 输出PDI:DMP*100/MTR
 * 输出MDI:DMM*100/MTR
 * 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
 * 输出ADXR:ADX的MM日指数平滑移动平均
 *
 */
var directionalMovementIndex = {
  name: 'DMI',
  calcParams: [14, 6],
  plots: [{
    key: 'pdi',
    title: 'PDI: ',
    type: 'line'
  }, {
    key: 'mdi',
    title: 'MDI: ',
    type: 'line'
  }, {
    key: 'adx',
    title: 'ADX: ',
    type: 'line'
  }, {
    key: 'adxr',
    title: 'ADXR: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var trSum = 0;
    var hSum = 0;
    var lSum = 0;
    var mtr = 0;
    var dmp = 0;
    var dmm = 0;
    var dxSum = 0;
    var adx = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var dmi = {};
      var preKLineData = dataList[i - 1] || kLineData;
      var preClose = preKLineData.close;
      var high = kLineData.high;
      var low = kLineData.low;
      var hl = high - low;
      var hcy = Math.abs(high - preClose);
      var lcy = Math.abs(preClose - low);
      var hhy = high - preKLineData.high;
      var lyl = preKLineData.low - low;
      var tr = Math.max(Math.max(hl, hcy), lcy);
      var h = hhy > 0 && hhy > lyl ? hhy : 0;
      var l = lyl > 0 && lyl > hhy ? lyl : 0;
      trSum += tr;
      hSum += h;
      lSum += l;

      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          mtr = mtr - mtr / calcParams[0] + tr;
          dmp = dmp - dmp / calcParams[0] + h;
          dmm = dmm - dmm / calcParams[0] + l;
        } else {
          mtr = trSum;
          dmp = hSum;
          dmm = lSum;
        }

        var pdi = 0;
        var mdi = 0;

        if (mtr !== 0) {
          pdi = dmp * 100 / mtr;
          mdi = dmm * 100 / mtr;
        }

        dmi.pdi = pdi;
        dmi.mdi = mdi;
        var dx = 0;

        if (mdi + pdi !== 0) {
          dx = Math.abs(mdi - pdi) / (mdi + pdi) * 100;
        }

        dxSum += dx;

        if (i >= calcParams[0] * 2 - 2) {
          if (i > calcParams[0] * 2 - 2) {
            adx = (adx * (calcParams[0] - 1) + dx) / calcParams[0];
          } else {
            adx = dxSum / calcParams[0];
          }

          dmi.adx = adx;

          if (i >= calcParams[0] * 2 + calcParams[1] - 3) {
            dmi.adxr = (result[i - (calcParams[1] - 1)].adx + adx) / 2;
          }
        }
      }

      result.push(dmi);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * EMV 简易波动指标
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 *
 */
var easeOfMovementValue = {
  name: 'EMV',
  calcParams: [14, 9],
  plots: [{
    key: 'emv',
    title: 'EMV: ',
    type: 'line'
  }, {
    key: 'maEmv',
    title: 'MAEMV: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var emSum = 0;
    var emvSum = 0;
    var emList = [];
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var emv = {};
      var preKLineData = dataList[i - 1] || kLineData;
      var high = kLineData.high;
      var low = kLineData.low;
      var turnover = kLineData.turnover || 0;
      var halfHl = (high + low) / 2;
      var preHalfHl = (preKLineData.high + preKLineData.low) / 2;
      var hl = high - low;
      var em = 0;

      if (turnover !== 0) {
        em = (halfHl - preHalfHl) * hl / turnover;
      }

      emList.push(em);
      emSum += em;

      if (i >= calcParams[0] - 1) {
        emv.emv = emSum;
        emSum -= emList[i - (calcParams[0] - 1)];
        emvSum += emv.emv;

        if (i >= calcParams[0] + calcParams[1] - 2) {
          emv.maEmv = emvSum / calcParams[1];
          emvSum -= result[i - (calcParams[1] - 1)].emv;
        }
      }

      result.push(emv);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * EMA 指数移动平均
 */
var exponentialMovingAverage = {
  name: 'EMA',
  series: 'price',
  calcParams: [6, 12, 20],
  precision: 4,
  shouldCheckParamCount: false,
  shouldOhlc: true,
  plots: [{
    key: 'ema6',
    title: 'EMA6: ',
    type: 'line'
  }, {
    key: 'ema12',
    title: 'EMA12: ',
    type: 'line'
  }, {
    key: 'ema20',
    title: 'EMA20: ',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "ema".concat(p),
        title: "EMA".concat(p, ": "),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var closeSum = 0;
    var emaValues = [];
    return dataList.map(function (kLineData, i) {
      var ema = {};
      var close = kLineData.close;
      closeSum += close;
      calcParams.forEach(function (param, j) {
        if (i >= param - 1) {
          if (i > param - 1) {
            emaValues[j] = (2 * close + (param - 1) * emaValues[j]) / (param + 1);
          } else {
            emaValues[j] = closeSum / param;
          }

          ema[plots[j].key] = emaValues[j];
        }
      });
      return ema;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MA 移动平均
 */
var movingAverage = {
  name: 'MA',
  series: 'price',
  calcParams: [5, 10, 30, 60],
  precision: 4,
  shouldCheckParamCount: false,
  shouldOhlc: true,
  plots: [{
    key: 'ma5',
    title: 'MA5: ',
    type: 'line'
  }, {
    key: 'ma10',
    title: 'MA10: ',
    type: 'line'
  }, {
    key: 'ma30',
    title: 'MA30: ',
    type: 'line'
  }, {
    key: 'ma60',
    title: 'MA60: ',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "ma".concat(p),
        title: "MA".concat(p, ": "),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var closeSums = [];
    return dataList.map(function (kLineData, i) {
      var ma = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, j) {
        closeSums[j] = (closeSums[j] || 0) + close;

        if (i >= param - 1) {
          ma[plots[j].key] = closeSums[j] / param;
          closeSums[j] -= dataList[i - (param - 1)].close;
        }
      });
      return ma;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 */
var movingAverageConvergenceDivergence = {
  name: 'MACD',
  calcParams: [12, 26, 9],
  baseValue: 0,
  plots: [{
    key: 'dif',
    title: 'DIF: ',
    type: 'line'
  }, {
    key: 'dea',
    title: 'DEA: ',
    type: 'line'
  }, {
    key: 'macd',
    title: 'MACD: ',
    type: 'bar',
    color: function color(data, options) {
      var currentData = data.currentData;
      var macd = (currentData.technicalIndicatorData || {}).macd;

      if (macd > 0) {
        return options.bar.upColor;
      } else if (macd < 0) {
        return options.bar.downColor;
      } else {
        return options.bar.noChangeColor;
      }
    },
    isStroke: function isStroke(data) {
      var preData = data.preData,
          currentData = data.currentData;
      var macd = (currentData.technicalIndicatorData || {}).macd;
      var preMacd = (preData.technicalIndicatorData || {}).macd;
      return preMacd < macd;
    }
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var closeSum = 0;
    var emaShort;
    var emaLong;
    var dif = 0;
    var difSum = 0;
    var dea = 0;
    var maxPeriod = Math.max(calcParams[0], calcParams[1]);
    return dataList.map(function (kLineData, i) {
      var macd = {};
      var close = kLineData.close;
      closeSum += close;

      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          emaShort = (2 * close + (calcParams[0] - 1) * emaShort) / (calcParams[0] + 1);
        } else {
          emaShort = closeSum / calcParams[0];
        }
      }

      if (i >= calcParams[1] - 1) {
        if (i > calcParams[1] - 1) {
          emaLong = (2 * close + (calcParams[1] - 1) * emaLong) / (calcParams[1] + 1);
        } else {
          emaLong = closeSum / calcParams[1];
        }
      }

      if (i >= maxPeriod - 1) {
        dif = emaShort - emaLong;
        macd.dif = dif;
        difSum += dif;

        if (i >= maxPeriod + calcParams[2] - 2) {
          if (i > maxPeriod + calcParams[2] - 2) {
            dea = (dif * 2 + dea * (calcParams[2] - 1)) / (calcParams[2] + 1);
          } else {
            dea = difSum / calcParams[2];
          }

          macd.macd = (dif - dea) * 2;
          macd.dea = dea;
        }
      }

      return macd;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * sma
 */
var simpleMovingAverage = {
  name: 'SMA',
  calcParams: [12, 2],
  series: 'price',
  precision: 4,
  plots: [{
    key: 'sma',
    title: 'SMA: ',
    type: 'line'
  }],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var closeSum = 0;
    var smaValue = 0;
    return kLineDataList.map(function (kLineData, i) {
      var sma = {};
      var close = kLineData.close;
      closeSum += close;

      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          smaValue = (close * calcParams[1] + smaValue * (calcParams[0] - calcParams[1] + 1)) / (calcParams[0] + 1);
        } else {
          smaValue = closeSum / calcParams[0];
        }

        sma.sma = smaValue;
      }

      return sma;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * trix
 *
 * TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
 * TRIX=(TR-昨日TR)/昨日TR*100；
 * MATRIX=TRIX的M日简单移动平均；
 * 默认参数N设为12，默认参数M设为9；
 * 默认参数12、9
 * 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
 * TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
 * TRMA:MA(TRIX,M)
 *
 */
var tripleExponentiallySmoothedAverage = {
  name: 'TRIX',
  calcParams: [12, 9],
  plots: [{
    key: 'trix',
    title: 'TRIX: ',
    type: 'line'
  }, {
    key: 'maTrix',
    title: 'MATRIX: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var closeSum = 0;
    var ema1;
    var ema2;
    var oldTr;
    var ema1Sum = 0;
    var ema2Sum = 0;
    var trixSum = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var trix = {};
      var close = kLineData.close;
      closeSum += close;

      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          ema1 = (2 * close + (calcParams[0] - 1) * ema1) / (calcParams[0] + 1);
        } else {
          ema1 = closeSum / calcParams[0];
        }

        ema1Sum += ema1;

        if (i >= calcParams[0] * 2 - 2) {
          if (i > calcParams[0] * 2 - 2) {
            ema2 = (2 * ema1 + (calcParams[0] - 1) * ema2) / (calcParams[0] + 1);
          } else {
            ema2 = ema1Sum / calcParams[0];
          }

          ema2Sum += ema2;

          if (i >= calcParams[0] * 3 - 3) {
            var tr;
            var trixValue = 0;

            if (i > calcParams[0] * 3 - 3) {
              tr = (2 * ema2 + (calcParams[0] - 1) * oldTr) / (calcParams[0] + 1);
              trixValue = (tr - oldTr) / oldTr * 100;
            } else {
              tr = ema2Sum / calcParams[0];
            }

            oldTr = tr;
            trix.trix = trixValue;
            trixSum += trixValue;

            if (i >= calcParams[0] * 3 + calcParams[1] - 4) {
              trix.maTrix = trixSum / calcParams[1];
              trixSum -= result[i - (calcParams[1] - 1)].trix;
            }
          }
        }
      }

      result.push(trix);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * BRAR
 * 默认参数是26。
 * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
 * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
 * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
 * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
 *
 */
var brar = {
  name: 'BRAR',
  calcParams: [26],
  plots: [{
    key: 'br',
    title: 'BR: ',
    type: 'line'
  }, {
    key: 'ar',
    title: 'AR: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var hcy = 0;
    var cyl = 0;
    var ho = 0;
    var ol = 0;
    return dataList.map(function (kLineData, i) {
      var brar = {};
      var high = kLineData.high;
      var low = kLineData.low;
      var open = kLineData.open;
      var preClose = (dataList[i - 1] || kLineData).close;
      ho += high - open;
      ol += open - low;
      hcy += high - preClose;
      cyl += preClose - low;

      if (i >= calcParams[0] - 1) {
        if (ol !== 0) {
          brar.ar = ho / ol * 100;
        } else {
          brar.ar = 0;
        }

        if (cyl !== 0) {
          brar.br = hcy / cyl * 100;
        } else {
          brar.br = 0;
        }

        var agoKLineData = dataList[i - (calcParams[0] - 1)];
        var agoHigh = agoKLineData.high;
        var agoLow = agoKLineData.low;
        var agoOpen = agoKLineData.open;
        var agoPreClose = (dataList[i - calcParams[0]] || dataList[i - (calcParams[0] - 1)]).close;
        hcy -= agoHigh - agoPreClose;
        cyl -= agoPreClose - agoLow;
        ho -= agoHigh - agoOpen;
        ol -= agoOpen - agoLow;
      }

      return brar;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MID:=REF(HIGH+LOW,1)/2;
 * CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
 * MA1:REF(MA(CR,M1),M1/2.5+1);
 * MA2:REF(MA(CR,M2),M2/2.5+1);
 * MA3:REF(MA(CR,M3),M3/2.5+1);
 * MA4:REF(MA(CR,M4),M4/2.5+1);
 * MID赋值:(昨日最高价+昨日最低价)/2
 * 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
 * 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
 * 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
 * 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
 * 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
 *
 */
var currentRatio = {
  name: 'CR',
  calcParams: [26, 10, 20, 40, 60],
  plots: [{
    key: 'cr',
    title: 'CR: ',
    type: 'line'
  }, {
    key: 'ma1',
    title: 'MA1: ',
    type: 'line'
  }, {
    key: 'ma2',
    title: 'MA2: ',
    type: 'line'
  }, {
    key: 'ma3',
    title: 'MA3: ',
    type: 'line'
  }, {
    key: 'ma4',
    title: 'MA4: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var ma1ForwardPeriod = Math.ceil(calcParams[1] / 2.5 + 1);
    var ma2ForwardPeriod = Math.ceil(calcParams[2] / 2.5 + 1);
    var ma3ForwardPeriod = Math.ceil(calcParams[3] / 2.5 + 1);
    var ma4ForwardPeriod = Math.ceil(calcParams[4] / 2.5 + 1);
    var ma1Sum = 0;
    var ma1List = [];
    var ma2Sum = 0;
    var ma2List = [];
    var ma3Sum = 0;
    var ma3List = [];
    var ma4Sum = 0;
    var ma4List = [];
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var cr = {};
      var preData = dataList[i - 1] || kLineData;
      var preMid = (preData.high + preData.close + preData.low + preData.open) / 4;
      var highSubPreMid = Math.max(0, kLineData.high - preMid);
      var preMidSubLow = Math.max(0, preMid - kLineData.low);

      if (i >= calcParams[0] - 1) {
        if (preMidSubLow !== 0) {
          cr.cr = highSubPreMid / preMidSubLow * 100;
        } else {
          cr.cr = 0;
        }

        var agoData = dataList[i - (calcParams[0] - 1)];
        var agoPreData = dataList[i - calcParams[0]] || agoData;
        var agoPreMid = (agoPreData.high + agoPreData.close + agoPreData.low + agoPreData.open) / 4;
        Math.max(0, agoData.high - agoPreMid);
        Math.max(0, agoPreMid - agoData.low);
        ma1Sum += cr.cr;
        ma2Sum += cr.cr;
        ma3Sum += cr.cr;
        ma4Sum += cr.cr;

        if (i >= calcParams[0] + calcParams[1] - 2) {
          ma1List.push(ma1Sum / calcParams[1]);

          if (i >= calcParams[0] + calcParams[1] + ma1ForwardPeriod - 3) {
            cr.ma1 = ma1List[ma1List.length - 1 - ma1ForwardPeriod];
          }

          ma1Sum -= result[i - (calcParams[1] - 1)].cr;
        }

        if (i >= calcParams[0] + calcParams[2] - 2) {
          ma2List.push(ma2Sum / calcParams[2]);

          if (i >= calcParams[0] + calcParams[2] + ma2ForwardPeriod - 3) {
            cr.ma2 = ma2List[ma2List.length - 1 - ma2ForwardPeriod];
          }

          ma2Sum -= result[i - (calcParams[2] - 1)].cr;
        }

        if (i >= calcParams[0] + calcParams[3] - 2) {
          ma3List.push(ma3Sum / calcParams[3]);

          if (i >= calcParams[0] + calcParams[3] + ma3ForwardPeriod - 3) {
            cr.ma3 = ma3List[ma3List.length - 1 - ma3ForwardPeriod];
          }

          ma3Sum -= result[i - (calcParams[3] - 1)].cr;
        }

        if (i >= calcParams[0] + calcParams[4] - 2) {
          ma4List.push(ma4Sum / calcParams[4]);

          if (i >= calcParams[0] + calcParams[4] + ma4ForwardPeriod - 3) {
            cr.ma4 = ma4List[ma4List.length - 1 - ma4ForwardPeriod];
          }

          ma4Sum -= result[i - (calcParams[4] - 1)].cr;
        }
      }

      result.push(cr);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * mtm
 * 公式 MTM（N日）=C－CN
 */
var momentum = {
  name: 'MTM',
  calcParams: [12, 6],
  plots: [{
    key: 'mtm',
    title: 'MTM: ',
    type: 'line'
  }, {
    key: 'maMtm',
    title: 'MAMTM: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var mtmSum = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var mtm = {};

      if (i >= calcParams[0]) {
        var close = kLineData.close;
        var agoClose = dataList[i - calcParams[0]].close;
        mtm.mtm = close - agoClose;
        mtmSum += mtm.mtm;

        if (i >= calcParams[0] + calcParams[1] - 1) {
          mtm.maMtm = mtmSum / calcParams[1];
          mtmSum -= result[i - (calcParams[1] - 1)].mtm;
        }
      }

      result.push(mtm);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * PSY
 * 公式：PSY=N日内的上涨天数/N×100%。
 */
var psychologicalLine = {
  name: 'PSY',
  calcParams: [12, 6],
  plots: [{
    key: 'psy',
    title: 'PSY: ',
    type: 'line'
  }, {
    key: 'maPsy',
    title: 'MAPSY: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var upCount = 0;
    var psySum = 0;
    var upList = [];
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var psy = {};
      var preClose = (dataList[i - 1] || kLineData).close;
      var upFlag = kLineData.close - preClose > 0 ? 1 : 0;
      upList.push(upFlag);
      upCount += upFlag;

      if (i >= calcParams[0] - 1) {
        psy.psy = upCount / calcParams[0] * 100;
        psySum += psy.psy;

        if (i >= calcParams[0] + calcParams[1] - 2) {
          psy.maPsy = psySum / calcParams[1];
          psySum -= result[i - (calcParams[1] - 1)].psy;
        }

        upCount -= upList[i - (calcParams[0] - 1)];
      }

      result.push(psy);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 变动率指标
 * 公式：ROC = (CLOSE - REF(CLOSE, N)) / REF(CLOSE, N)
 */
var rateOfChange = {
  name: 'ROC',
  calcParams: [12, 6],
  shouldCheckParamCount: true,
  plots: [{
    key: 'roc',
    title: 'ROC: ',
    type: 'line'
  }, {
    key: 'maRoc',
    title: 'MAROC: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var result = [];
    var rocSum = 0;
    kLineDataList.forEach(function (kLineData, i) {
      var roc = {};

      if (i >= calcParams[0] - 1) {
        var close = kLineData.close;
        var agoClose = (kLineDataList[i - calcParams[0]] || kLineDataList[i - (calcParams[0] - 1)]).close;

        if (agoClose !== 0) {
          roc.roc = (close - agoClose) / agoClose * 100;
        } else {
          roc.roc = 0;
        }

        rocSum += roc.roc;

        if (i >= calcParams[0] - 1 + calcParams[1] - 1) {
          roc.maRoc = rocSum / calcParams[1];
          rocSum -= result[i - (calcParams[1] - 1)].roc;
        }
      }

      result.push(roc);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * VR
 * VR=（UVS+1/2PVS）/（DVS+1/2PVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为UVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为DVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为PVS
 *
 */
var volumeRatio = {
  name: 'VR',
  calcParams: [26, 6],
  plots: [{
    key: 'vr',
    title: 'VR: ',
    type: 'line'
  }, {
    key: 'maVr',
    title: 'MAVR: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var uvs = 0;
    var dvs = 0;
    var pvs = 0;
    var vrSum = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var vr = {};
      var close = kLineData.close;
      var preClose = (dataList[i - 1] || kLineData).close;
      var volume = kLineData.volume;

      if (close > preClose) {
        uvs += volume;
      } else if (close < preClose) {
        dvs += volume;
      } else {
        pvs += volume;
      }

      if (i >= calcParams[0] - 1) {
        var halfPvs = pvs / 2;

        if (dvs + halfPvs === 0) {
          vr.vr = 0;
        } else {
          vr.vr = (uvs + halfPvs) / (dvs + halfPvs) * 100;
        }

        vrSum += vr.vr;

        if (i >= calcParams[0] + calcParams[1] - 2) {
          vr.maVr = vrSum / calcParams[1];
          vrSum -= result[i - (calcParams[1] - 1)].vr;
        }

        var agoData = dataList[i - (calcParams[0] - 1)];
        var agoPreData = dataList[i - calcParams[0]] || agoData;
        var agoClose = agoData.close;
        var agoVolume = agoData.volume;

        if (agoClose > agoPreData.close) {
          uvs -= agoVolume;
        } else if (agoClose < agoPreData.close) {
          dvs -= agoVolume;
        } else {
          pvs -= agoVolume;
        }
      }

      result.push(vr);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var awesomeOscillator = {
  name: 'AO',
  calcParams: [5, 34],
  shouldCheckParamCount: true,
  plots: [{
    key: 'ao',
    title: 'AO: ',
    type: 'bar',
    color: function color(data, technicalIndicatorOptions) {
      var preData = data.preData,
          currentData = data.currentData;
      var preAo = (preData.technicalIndicatorData || {}).ao;
      var ao = (currentData.technicalIndicatorData || {}).ao;

      if (ao > preAo) {
        return technicalIndicatorOptions.bar.upColor;
      } else {
        return technicalIndicatorOptions.bar.downColor;
      }
    },
    isStroke: function isStroke(data) {
      var preData = data.preData,
          currentData = data.currentData;
      var preAo = (preData.technicalIndicatorData || {}).ao;
      var ao = (currentData.technicalIndicatorData || {}).ao;
      return ao > preAo;
    }
  }],
  baseValue: 0,
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList, calcParams) {
    var maxParam = Math.max(calcParams[0], calcParams[1]);
    var shortSum = 0;
    var longSum = 0;
    var short = 0;
    var long = 0;
    return kLineDataList.map(function (kLineData, i) {
      var ao = {};
      var middle = (kLineData.low + kLineData.high) / 2;
      shortSum += middle;
      longSum += middle;

      if (i >= calcParams[0] - 1) {
        short = shortSum / calcParams[0];
        var agoKLineData = kLineDataList[i - (calcParams[0] - 1)];
        shortSum -= (agoKLineData.low + agoKLineData.high) / 2;
      }

      if (i >= calcParams[1] - 1) {
        long = longSum / calcParams[1];
        var _agoKLineData = kLineDataList[i - (calcParams[1] - 1)];
        longSum -= (_agoKLineData.low + _agoKLineData.high) / 2;
      }

      if (i >= maxParam - 1) {
        ao.ao = short - long;
      }

      return ao;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * BIAS
 * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
 */
var bias = {
  name: 'BIAS',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [{
    key: 'bias6',
    title: 'BIAS6: ',
    type: 'line'
  }, {
    key: 'bias12',
    title: 'BIAS12: ',
    type: 'line'
  }, {
    key: 'bias24',
    title: 'BIAS24: ',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (p) {
      return {
        key: "bias".concat(p),
        title: "BIAS".concat(p, ": "),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var closeSums = [];
    return dataList.map(function (kLineData, i) {
      var bias = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, j) {
        closeSums[j] = (closeSums[j] || 0) + close;

        if (i >= param - 1) {
          var mean = closeSums[j] / calcParams[j];
          bias[plots[j].key] = (close - mean) / mean * 100;
          closeSums[j] -= dataList[i - (param - 1)].close;
        }
      });
      return bias;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * CCI
 * CCI（N日）=（TP－MA）÷MD÷0.015
 * 其中，TP=（最高价+最低价+收盘价）÷3
 * MA=近N日TP价的累计之和÷N
 * MD=近N日TP - 当前MA绝对值的累计之和÷N
 *
 */
var commodityChannelIndex = {
  name: 'CCI',
  calcParams: [20],
  plots: [{
    key: 'cci',
    title: 'CCI: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var p = calcParams[0] - 1;
    var tpSum = 0;
    var tpList = [];
    return dataList.map(function (kLineData, i) {
      var cci = {};
      var tp = (kLineData.high + kLineData.low + kLineData.close) / 3;
      tpSum += tp;
      tpList.push(tp);

      if (i >= p) {
        var maTp = tpSum / calcParams[0];
        var sliceTpList = tpList.slice(i - p, i + 1);
        var sum = 0;
        sliceTpList.forEach(function (tp) {
          sum += Math.abs(tp - maTp);
        });
        var md = sum / calcParams[0];
        cci.cci = md !== 0 ? (tp - maTp) / md / 0.015 : 0;
        var agoTp = (dataList[i - p].high + dataList[i - p].low + dataList[i - p].close) / 3;
        tpSum -= agoTp;
      }

      return cci;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * RSI
 * RSI = SUM(MAX(CLOSE - REF(CLOSE,1),0),N) / SUM(ABS(CLOSE - REF(CLOSE,1)),N) × 100
 */
var relativeStrengthIndex = {
  name: 'RSI',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [{
    key: 'rsi1',
    title: 'RSI1: ',
    type: 'line'
  }, {
    key: 'rsi2',
    title: 'RSI2: ',
    type: 'line'
  }, {
    key: 'rsi3',
    title: 'RSI3: ',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (_, index) {
      var num = index + 1;
      return {
        key: "rsi".concat(num),
        title: "RSI".concat(num, ": "),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var sumCloseAs = [];
    var sumCloseBs = [];
    return dataList.map(function (kLineData, i) {
      var rsi = {};
      var preClose = (dataList[i - 1] || kLineData).close;
      var tmp = kLineData.close - preClose;
      calcParams.forEach(function (param, j) {
        if (tmp > 0) {
          sumCloseAs[j] = (sumCloseAs[j] || 0) + tmp;
        } else {
          sumCloseBs[j] = (sumCloseBs[j] || 0) + Math.abs(tmp);
        }

        if (i >= param - 1) {
          if (sumCloseBs[j] !== 0) {
            rsi[plots[j].key] = 100 - 100.0 / (1 + sumCloseAs[j] / sumCloseBs[j]);
          } else {
            rsi[plots[j].key] = 0;
          }

          var agoData = dataList[i - (param - 1)];
          var agoPreData = dataList[i - param] || agoData;
          var agoTmp = agoData.close - agoPreData.close;

          if (agoTmp > 0) {
            sumCloseAs[j] -= agoTmp;
          } else {
            sumCloseBs[j] -= Math.abs(agoTmp);
          }
        }
      });
      return rsi;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
function calcHnLn() {
  var dataList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var hn = Number.MIN_SAFE_INTEGER;
  var ln = Number.MAX_SAFE_INTEGER;
  dataList.forEach(function (data) {
    hn = Math.max(data.high, hn);
    ln = Math.min(data.low, ln);
  });
  return {
    hn: hn,
    ln: ln
  };
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * KDJ
 *
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 */

var stockIndicatorKDJ = {
  name: 'KDJ',
  calcParams: [9, 3, 3],
  plots: [{
    key: 'k',
    title: 'K: ',
    type: 'line'
  }, {
    key: 'd',
    title: 'D: ',
    type: 'line'
  }, {
    key: 'j',
    title: 'J: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var kdj = {};
      var close = kLineData.close;

      if (i >= calcParams[0] - 1) {
        var lhn = calcHnLn(dataList.slice(i - (calcParams[0] - 1), i + 1));
        var ln = lhn.ln;
        var hn = lhn.hn;
        var hnSubLn = hn - ln;
        var rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100;
        kdj.k = ((calcParams[1] - 1) * (result[i - 1].k || 50) + rsv) / calcParams[1];
        kdj.d = ((calcParams[2] - 1) * (result[i - 1].d || 50) + kdj.k) / calcParams[2];
        kdj.j = 3.0 * kdj.k - 2.0 * kdj.d;
      }

      result.push(kdj);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * WR
 * 公式 WR(N) = 100 * [ C - HIGH(N) ] / [ HIGH(N)-LOW(N) ]
 */

var williamsR = {
  name: 'WR',
  calcParams: [6, 10, 14],
  shouldCheckParamCount: false,
  plots: [{
    key: 'wr1',
    title: 'WR1: ',
    type: 'line'
  }, {
    key: 'wr2',
    title: 'WR2: ',
    type: 'line'
  }, {
    key: 'wr3',
    title: 'WR3: ',
    type: 'line'
  }],
  regeneratePlots: function regeneratePlots(params) {
    return params.map(function (_, i) {
      return {
        key: "wr".concat(i + 1),
        title: "WR".concat(i + 1, ": "),
        type: 'line'
      };
    });
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    return dataList.map(function (kLineData, i) {
      var wr = {};
      var close = kLineData.close;
      calcParams.forEach(function (param, index) {
        var p = param - 1;

        if (i >= p) {
          var hln = calcHnLn(dataList.slice(i - p, i + 1));
          var hn = hln.hn;
          var ln = hln.ln;
          var hnSubLn = hn - ln;
          wr[plots[index].key] = hnSubLn === 0 ? 0 : (close - hn) / hnSubLn * 100;
        }
      });
      return wr;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 计算布林指标中的标准差
 * @param dataList
 * @param ma
 * @return {number}
 */
function getBollMd(dataList, ma) {
  var dataSize = dataList.length;
  var sum = 0;
  dataList.forEach(function (data) {
    var closeMa = data.close - ma;
    sum += closeMa * closeMa;
  });
  var b = sum > 0;
  sum = Math.abs(sum);
  var md = Math.sqrt(sum / dataSize);
  return b ? md : -1 * md;
}
/**
 * BOLL
 */


var bollingerBands = {
  name: 'BOLL',
  series: 'price',
  calcParams: [20, 2],
  calcParamsAllowDecimal: {
    1: true
  },
  precision: 4,
  shouldOhlc: true,
  plots: [{
    key: 'up',
    title: 'UP: ',
    type: 'line'
  }, {
    key: 'mid',
    title: 'MID: ',
    type: 'line'
  }, {
    key: 'dn',
    title: 'DN: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var p = calcParams[0] - 1;
    var closeSum = 0;
    return dataList.map(function (kLineData, i) {
      var close = kLineData.close;
      var boll = {};
      closeSum += close;

      if (i >= p) {
        boll.mid = closeSum / calcParams[0];
        var md = getBollMd(dataList.slice(i - p, i + 1), boll.mid);
        boll.up = boll.mid + calcParams[1] * md;
        boll.dn = boll.mid - calcParams[1] * md;
        closeSum -= dataList[i - p].close;
      }

      return boll;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var stopAndReverse = {
  name: 'SAR',
  series: 'price',
  calcParams: [2, 2, 20],
  precision: 4,
  shouldOhlc: true,
  plots: [{
    key: 'sar',
    title: 'SAR: ',
    type: 'circle',
    color: function color(data, options) {
      var currentData = data.currentData;
      var kLineData = currentData.kLineData || {};
      var technicalIndicatorData = currentData.technicalIndicatorData || {};
      var halfHL = (kLineData.high + kLineData.low) / 2;

      if (technicalIndicatorData.sar < halfHL) {
        return options.circle.upColor;
      }

      return options.circle.downColor;
    }
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var startAf = calcParams[0] / 100;
    var step = calcParams[1] / 100;
    var maxAf = calcParams[2] / 100; // 加速因子

    var af = startAf; // 极值

    var ep = -100; // 判断是上涨还是下跌  false：下跌

    var isIncreasing = false;
    var sar = 0;
    return dataList.map(function (kLineData, i) {
      // 上一个周期的sar
      var preSar = sar;
      var high = kLineData.high;
      var low = kLineData.low;

      if (isIncreasing) {
        // 上涨
        if (ep === -100 || ep < high) {
          // 重新初始化值
          ep = high;
          af = Math.min(af + step, maxAf);
        }

        sar = preSar + af * (ep - preSar);
        var lowMin = Math.min(dataList[Math.max(1, i) - 1].low, low);

        if (sar > kLineData.low) {
          sar = ep; // 重新初始化值

          af = startAf;
          ep = -100;
          isIncreasing = !isIncreasing;
        } else if (sar > lowMin) {
          sar = lowMin;
        }
      } else {
        if (ep === -100 || ep > low) {
          // 重新初始化值
          ep = low;
          af = Math.min(af + step, maxAf);
        }

        sar = preSar + af * (ep - preSar);
        var highMax = Math.max(dataList[Math.max(1, i) - 1].high, high);

        if (sar < kLineData.high) {
          sar = ep; // 重新初始化值

          af = 0;
          ep = -100;
          isIncreasing = !isIncreasing;
        } else if (sar < highMax) {
          sar = highMax;
        }
      }

      return {
        sar: sar
      };
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * OBV
 * OBV = REF(OBV) + sign * V
 */
var onBalanceVolume = {
  name: 'OBV',
  calcParams: [30],
  plots: [{
    key: 'obv',
    title: 'OBV: ',
    type: 'line'
  }, {
    key: 'maObv',
    title: 'MAOBV: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams) {
    var obvSum = 0;
    var oldObv = 0;
    var result = [];
    dataList.forEach(function (kLineData, i) {
      var preKLineData = dataList[i - 1] || kLineData;

      if (kLineData.close < preKLineData.close) {
        oldObv -= kLineData.volume;
      } else if (kLineData.close > preKLineData.close) {
        oldObv += kLineData.volume;
      }

      var obv = {
        obv: oldObv
      };
      obvSum += oldObv;

      if (i >= calcParams[0] - 1) {
        obv.maObv = obvSum / calcParams[0];
        obvSum -= result[i - (calcParams[0] - 1)].obv;
      }

      result.push(obv);
    });
    return result;
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 价量趋势指标
 * 公式:
 * X = (CLOSE - REF(CLOSE, 1)) / REF(CLOSE, 1) * VOLUME
 * PVT = SUM(X)
 *
 */
var priceAndVolumeTrend = {
  name: 'PVT',
  plots: [{
    key: 'pvt',
    title: 'PVT: ',
    type: 'line'
  }],
  calcTechnicalIndicator: function calcTechnicalIndicator(kLineDataList) {
    var sum = 0;
    return kLineDataList.map(function (kLineData, i) {
      var pvt = {};
      var close = kLineData.close;
      var volume = kLineData.volume;
      var preClose = (kLineDataList[i - 1] || kLineData).close;
      var x = 0;

      if (preClose !== 0) {
        x = (close - preClose) / preClose * volume;
      }

      sum += x;
      pvt.pvt = sum;
      return pvt;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var volume = {
  name: 'VOL',
  series: 'volume',
  calcParams: [5, 10, 20],
  shouldCheckParamCount: false,
  shouldFormatBigNumber: true,
  precision: 0,
  baseValue: 0,
  minValue: 0,
  plots: [{
    key: 'ma5',
    title: 'MA5: ',
    type: 'line'
  }, {
    key: 'ma10',
    title: 'MA10: ',
    type: 'line'
  }, {
    key: 'ma20',
    title: 'MA20: ',
    type: 'line'
  }, {
    key: 'volume',
    title: 'VOLUME: ',
    type: 'bar',
    color: function color(data, options) {
      var kLineData = data.currentData.kLineData || {};

      if (kLineData.close > kLineData.open) {
        return options.bar.upColor;
      } else if (kLineData.close < kLineData.open) {
        return options.bar.downColor;
      }

      return options.bar.noChangeColor;
    }
  }],
  regeneratePlots: function regeneratePlots(params) {
    var plots = params.map(function (p) {
      return {
        key: "ma".concat(p),
        title: "MA".concat(p, ": "),
        type: 'line'
      };
    });
    plots.push({
      key: 'volume',
      title: 'VOLUME: ',
      type: 'bar',
      color: function color(data, options) {
        var kLineData = data.currentData.kLineData || {};

        if (kLineData.close > kLineData.open) {
          return options.bar.upColor;
        } else if (kLineData.close < kLineData.open) {
          return options.bar.downColor;
        }

        return options.bar.noChangeColor;
      }
    });
    return plots;
  },
  calcTechnicalIndicator: function calcTechnicalIndicator(dataList, calcParams, plots) {
    var volSums = [];
    return dataList.map(function (kLineData, i) {
      var volume = kLineData.volume || 0;
      var vol = {
        volume: volume
      };
      calcParams.forEach(function (param, j) {
        volSums[j] = (volSums[j] || 0) + volume;

        if (i >= param - 1) {
          vol[plots[j].key] = volSums[j] / param;
          volSums[j] -= dataList[i - (param - 1)].volume;
        }
      });
      return vol;
    });
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var extension = {
  technicalIndicatorExtensions: {},
  graphicMarkExtensions: {},
  addTechnicalIndicator: function addTechnicalIndicator(technicalIndicators) {
    var _this = this;

    if (technicalIndicators) {
      [].concat(technicalIndicators).forEach(function (technicalIndicator) {
        if (technicalIndicator.name) {
          _this.technicalIndicatorExtensions[technicalIndicator.name] = technicalIndicator;
        }
      });
    }
  },
  addGraphicMark: function addGraphicMark(graphicMarks) {
    var _this2 = this;

    if (graphicMarks) {
      [].concat(graphicMarks).forEach(function (graphicMark) {
        if (graphicMark.name) {
          _this2.graphicMarkExtensions[graphicMark.name] = graphicMark;
        }
      });
    }
  }
};

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function merge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return;
  }

  for (var key in source) {
    if (key in target) {
      var targetProp = target[key];
      var sourceProp = source[key];

      if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp)) {
        merge(targetProp, sourceProp);
      } else {
        if (isValid(source[key])) {
          target[key] = source[key];
        }
      }
    }
  }
}
function clone(target) {
  if (!target || !isObject(target)) {
    return target;
  }

  var copy;

  if (isArray(target)) {
    copy = [];
  } else {
    copy = {};
  }

  var p;
  var v;

  for (p in target) {
    if (target.hasOwnProperty(p)) {
      v = target[p];

      if (v && isObject(v)) {
        copy[p] = clone(v);
      } else {
        copy[p] = v;
      }
    }
  }

  return copy;
}
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}
/**
 * @param {*} value
 * @return {boolean}
 */

function isFunction(value) {
  return typeof value === 'function';
}
/**
 * @param {*} value
 * @return {boolean}
 */

function isObject(value) {
  return !!value && _typeof(value) === 'object';
}
/**
 * 判断是否是数字
 * @param value
 * @returns {boolean}
 */

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}
/**
 * 判断是否有效
 * @param value
 * @returns {boolean}
 */

function isValid(value) {
  return value !== null && value !== undefined;
}
/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */

function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 线的样式
 * @type {{DASH: string, SOLID: string}}
 */
var LineStyle = {
  DASH: 'dash',
  SOLID: 'solid'
};
/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */

var YAxisPosition = {
  LEFT: 'left',
  RIGHT: 'right'
};
/**
 * y轴类型
 * @type {{PERCENTAGE: string, NORMAL: string}}
 */

var YAxisType = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage'
};
/**
 * 蜡烛图样式
 * @type {{AREA: string, OHLC: string, CANDLE_STROKE: string, CANDLE_SOLID: string, CANDLE_DOWN_STROKE: string, CANDLE_UP_STROKE: string}}
 */

var CandleType = {
  CANDLE_SOLID: 'candle_solid',
  CANDLE_STROKE: 'candle_stroke',
  CANDLE_UP_STROKE: 'candle_up_stroke',
  CANDLE_DOWN_STROKE: 'candle_down_stroke',
  OHLC: 'ohlc',
  AREA: 'area'
};
/**
 * 说明显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */

var TooltipShowRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
};
/**
 * 主图数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */

var TooltipCandleShowType = {
  RECT: 'rect',
  STANDARD: 'standard'
};
/**
 * 注解标识类似
 * @type {{RECT: string, TRIANGLE: string, DIAMOND: string, CUSTOM: string, NONE: string, CIRCLE: string}}
 */

var AnnotationSymbolType = {
  CIRCLE: 'circle',
  RECT: 'rect',
  TRIANGLE: 'triangle',
  DIAMOND: 'diamond',
  CUSTOM: 'custom',
  NONE: 'none'
};
/**
 * 注解位置
 * @type {{TOP: string, BOTTOM: string, POINT: string}}
 */

var AnnotationPosition = {
  POINT: 'point',
  TOP: 'top',
  BOTTOM: 'bottom'
};
/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], show: boolean, style: string}, show: boolean, vertical: {size: number, color: string, dashValue: number[], show: boolean, style: string}}}
 */

var defaultGrid = {
  show: true,
  horizontal: {
    show: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  },
  vertical: {
    show: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  }
};
/**
 * 默认蜡烛柱图样式配置
 * @type {{area: {fillColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */

var defaultCandle = {
  margin: {
    top: 0.2,
    bottom: 0.1
  },
  type: CandleType.CANDLE_SOLID,
  bar: {
    /**
     * 上涨颜色
     */
    upColor: '#26A69A',

    /**
     * 下跌颜色
     */
    downColor: '#EF5350',

    /**
     * 无变化时颜色
     */
    noChangeColor: '#888888'
  },
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
    high: {
      show: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    low: {
      show: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    last: {
      show: true,
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888',
      line: {
        show: true,
        style: LineStyle.DASH,
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
  tooltip: {
    showRule: TooltipShowRule.ALWAYS,
    showType: TooltipCandleShowType.STANDARD,
    labels: ['时间: ', '开: ', '收: ', '高: ', '低: ', '成交量: '],
    values: null,
    defaultValue: 'n/a',
    rect: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 6,
      offsetLeft: 8,
      offsetTop: 8,
      offsetRight: 8,
      borderRadius: 4,
      borderSize: 1,
      borderColor: '#3f4254',
      fillColor: 'rgba(17, 17, 17, .3)'
    },
    text: {
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      color: '#D9D9D9',
      marginLeft: 8,
      marginTop: 6,
      marginRight: 8,
      marginBottom: 0
    }
  }
};
/**
 * 默认的技术指标样式配置
 * @type {{bar: {noChangeColor: string, upColor: string, downColor: string}, line: {size: number, colors: [string, string, string, string, string]}, tooltip: {showParams: boolean, showName: boolean, showRule: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}}, circle: {noChangeColor: string, upColor: string, downColor: string}, lastValueMark: {show: boolean, text: {paddingBottom: number, color: string, size: number, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}}}}
 */

var defaultTechnicalIndicator = {
  margin: {
    top: 0.2,
    bottom: 0.1
  },
  bar: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
  line: {
    size: 1,
    colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
  },
  circle: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
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
  tooltip: {
    showRule: TooltipShowRule.ALWAYS,
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
};
/**
 * 默认x轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, tickText: {paddingBottom: number, color: string, size: number, show: boolean, weight: string, paddingTop: number, family: string}, height: null, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */

var defaultXAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,

  /**
   * 高度
   */
  height: null,

  /**
   * 轴线配置
   */
  axisLine: {
    show: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, width: null, position: string, tickText: {color: string, size: number, paddingRight: number, show: boolean, weight: string, family: string, paddingLeft: number}, type: string, inside: boolean, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */

var defaultYAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,

  /**
   * 宽度
   */
  width: null,

  /**
   * y轴类型
   */
  type: YAxisType.NORMAL,

  /**
   * 轴位置
   */
  position: YAxisPosition.RIGHT,

  /**
   * 轴是否在内部
   */
  inside: false,

  /**
   * 轴线配置
   */
  axisLine: {
    show: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
};
var defaultCrosshair = {
  show: true,
  horizontal: {
    show: true,
    line: {
      show: true,
      style: LineStyle.DASH,
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
  vertical: {
    show: true,
    line: {
      show: true,
      style: LineStyle.DASH,
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
};
/**
 * 默认图形标记配置
 * @type {{arc: {fill: {color: string}, stroke: {size: number, color: string}}, polygon: {fill: {color: string}, stroke: {size: number, color: string}}, line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */

var defaultGraphicMark = {
  point: {
    backgroundColor: '#2196F3',
    borderColor: 'rgba(33, 150, 243, 0.35)',
    borderSize: 1,
    radius: 5,
    activeBackgroundColor: '#2196F3',
    activeBorderColor: 'rgba(33, 150, 243, 0.35)',
    activeBorderSize: 3,
    activeRadius: 5
  },
  line: {
    color: '#2196F3',
    size: 1,
    dashValue: [2, 2]
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
    color: '#1e88e5',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    marginBottom: 6
  }
};
/**
 * 默认注解信息配置
 * @type {{}}
 */

var defaultAnnotation = {
  symbol: {
    type: AnnotationSymbolType.DIAMOND,
    position: AnnotationPosition.TOP,
    size: 8,
    color: '#1e88e5',
    activeSize: 10,
    activeColor: '#FF9600',
    offset: [0, 20]
  }
};
/**
 * 图表之间默认分割配置
 * @type {{size: number, color: string}}
 */

var defaultSeparator = {
  size: 1,
  color: '#888888',
  fill: true,
  activeBackgroundColor: 'rgba(33, 150, 243, 0.08)'
};
var defaultStyleOptions = {
  grid: defaultGrid,
  candle: defaultCandle,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  crosshair: defaultCrosshair,
  graphicMark: defaultGraphicMark,
  annotation: defaultAnnotation
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */

function formatValue(data, key) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '--';

  if (data && isObject(data)) {
    var value = data[key];

    if (isValid(value)) {
      return value;
    }
  }

  return defaultValue;
}
/**
 * 格式化时间
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */

function formatDate(dateTimeFormat, timestamp) {
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'MM-DD hh:mm';

  if (isNumber(timestamp)) {
    var dateTimeString = dateTimeFormat.format(new Date(timestamp));
    var dateTimeStringArray = dateTimeString.split(', ');
    var dateStringArray = dateTimeStringArray[0].split('/');
    var date = {
      YYYY: dateStringArray[2],
      MM: dateStringArray[0],
      DD: dateStringArray[1],
      'hh:mm': dateTimeStringArray[1].match(/^[\d]{2}/)[0] === '24' ? dateTimeStringArray[1].replace(/^[\d]{2}/, '00') : dateTimeStringArray[1]
    };
    return format.replace(/YYYY|MM|DD|(hh:mm)/g, function (key) {
      return date[key];
    });
  }

  return '--';
}
/**
 * 格式化精度
 */

function formatPrecision(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var v = +value;

  if ((v || v === 0) && isNumber(v)) {
    return v.toFixed(precision);
  }

  return "".concat(v);
}
/**
 * 格式化大数据
 * @param value
 */

function formatBigNumber(value) {
  if (isNumber(+value)) {
    if (value > 1000000000) {
      return "".concat(+(value / 1000000000).toFixed(3), "B");
    }

    if (value > 1000000) {
      return "".concat(+(value / 1000000).toFixed(3), "M");
    }

    if (value > 1000) {
      return "".concat(+(value / 1000).toFixed(3), "K");
    }

    return value;
  }

  return '--';
}

/**
 * 技术指标系列
 * @type {{PRICE: string, VOLUME: string, NORMAL: string}}
 */

var TechnicalIndicatorSeries = {
  PRICE: 'price',
  VOLUME: 'volume',
  NORMAL: 'normal'
};
/**
 * 绘制类型
 * @type {{BAR: string, LINE: string, CIRCLE: string}}
 */

var TechnicalIndicatorPlotType = {
  LINE: 'line',
  BAR: 'bar',
  CIRCLE: 'circle'
};

var TechnicalIndicator = /*#__PURE__*/function () {
  function TechnicalIndicator(_ref) {
    var name = _ref.name,
        series = _ref.series,
        calcParams = _ref.calcParams,
        plots = _ref.plots,
        precision = _ref.precision,
        calcParamsAllowDecimal = _ref.calcParamsAllowDecimal,
        shouldCheckParamCount = _ref.shouldCheckParamCount,
        shouldOhlc = _ref.shouldOhlc,
        shouldFormatBigNumber = _ref.shouldFormatBigNumber,
        baseValue = _ref.baseValue,
        minValue = _ref.minValue,
        maxValue = _ref.maxValue,
        styles = _ref.styles;

    _classCallCheck(this, TechnicalIndicator);

    // 指标名
    this.name = name || ''; // 指标系列，值有 'price', 'volume', 'normal

    this.series = series || 'normal'; // 精度

    this.precision = isValid(precision) && isNumber(precision) && precision >= 0 ? precision : 4; // 计算参数

    this.calcParams = isArray(calcParams) ? calcParams : []; // 数据信息

    this.plots = isArray(plots) ? plots : []; // 计算参数是否允许小数

    this.calcParamsAllowDecimal = isObject(calcParamsAllowDecimal) ? calcParamsAllowDecimal : {}; // 是否需要检查参数

    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true; // 是否需要ohlc

    this.shouldOhlc = shouldOhlc; // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K

    this.shouldFormatBigNumber = shouldFormatBigNumber; // 基础比对数据

    this.baseValue = isNumber(baseValue) ? baseValue : null; // 指定的最小值

    this.minValue = minValue; // 指定的最大值

    this.maxValue = maxValue; // 样式

    this.styles = styles; // 指标计算结果

    this.result = [];
  }

  _createClass(TechnicalIndicator, [{
    key: "setPrecision",
    value: function setPrecision(precision) {
      if (isNumber(precision) && precision >= 0) {
        this.precision = parseInt(precision, 10);
        return true;
      }

      return false;
    }
    /**
     * 设置计算参数是否允许小数
     * @param calcParamsAllowDecimal
     */

  }, {
    key: "setCalcParamsAllowDecimal",
    value: function setCalcParamsAllowDecimal(calcParamsAllowDecimal) {
      if (isObject(calcParamsAllowDecimal)) {
        this.calcParamsAllowDecimal = calcParamsAllowDecimal;
      }
    }
  }, {
    key: "setCalcParams",
    value: function setCalcParams(params) {
      if (!isArray(params)) {
        return false;
      }

      if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
        return false;
      }

      for (var i = 0; i < params.length; i++) {
        var v = params[i];

        if (!isNumber(v) || v <= 0 || !this.calcParamsAllowDecimal[i] && parseInt(v, 10) !== v) {
          return false;
        }
      }

      this.calcParams = clone(params);
      var plots = this.regeneratePlots(params);

      if (plots && isArray(plots)) {
        this.plots = plots;
      }

      return true;
    }
  }, {
    key: "setStyles",
    value: function setStyles(styles, defaultStyles) {
      if (!isObject(styles)) {
        return false;
      }

      if (!this.styles) {
        this.styles = {
          bar: clone(defaultStyles.bar),
          line: clone(defaultStyles.line),
          circle: clone(defaultStyles.circle)
        };
      }

      merge(this.styles, styles);
      return true;
    }
    /**
     * 计算技术指标
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(dataList, calcParams) {}
    /**
     * 重新生成各项数据
     * @private
     */

  }, {
    key: "regeneratePlots",
    value: function regeneratePlots(params) {}
  }]);

  return TechnicalIndicator;
}();

/**
 * 创建技术指标映射
 * @return {{}}
 */

function createTechnicalIndicatorMapping() {
  var mapping = {};
  var technicalIndicatorExtensions = extension.technicalIndicatorExtensions;

  for (var name in technicalIndicatorExtensions) {
    var technicalIndicatorInstance = createTechnicalIndicatorInstance(technicalIndicatorExtensions[name]);

    if (technicalIndicatorInstance) {
      mapping[name] = technicalIndicatorInstance;
    }
  }

  return mapping;
}
/**
 * 创建一个新的技术指标
 * @param name
 * @param series
 * @param calcParams
 * @param plots
 * @param precision
 * @param calcParamsAllowDecimal
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param baseValue
 * @param minValue
 * @param maxValue
 * @param styles
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @param render
 * @returns {TechnicalIndicatorClass|null}
 */

function createTechnicalIndicatorInstance(_ref) {
  var name = _ref.name,
      series = _ref.series,
      calcParams = _ref.calcParams,
      plots = _ref.plots,
      precision = _ref.precision,
      calcParamsAllowDecimal = _ref.calcParamsAllowDecimal,
      shouldCheckParamCount = _ref.shouldCheckParamCount,
      shouldOhlc = _ref.shouldOhlc,
      shouldFormatBigNumber = _ref.shouldFormatBigNumber,
      baseValue = _ref.baseValue,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      styles = _ref.styles,
      calcTechnicalIndicator = _ref.calcTechnicalIndicator,
      regeneratePlots = _ref.regeneratePlots,
      render = _ref.render;

  if (!name || !isFunction(calcTechnicalIndicator)) {
    {
      console.warn('The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!');
    }

    return null;
  }

  var TechnicalIndicatorClass = /*#__PURE__*/function (_TechnicalIndicator) {
    _inherits(TechnicalIndicatorClass, _TechnicalIndicator);

    var _super = _createSuper(TechnicalIndicatorClass);

    function TechnicalIndicatorClass() {
      _classCallCheck(this, TechnicalIndicatorClass);

      return _super.call(this, {
        name: name,
        series: series,
        calcParams: calcParams,
        plots: plots,
        precision: precision,
        calcParamsAllowDecimal: calcParamsAllowDecimal,
        shouldCheckParamCount: shouldCheckParamCount,
        shouldOhlc: shouldOhlc,
        shouldFormatBigNumber: shouldFormatBigNumber,
        baseValue: baseValue,
        minValue: minValue,
        maxValue: maxValue,
        styles: styles
      });
    }

    return TechnicalIndicatorClass;
  }(TechnicalIndicator);

  TechnicalIndicatorClass.prototype.calcTechnicalIndicator = calcTechnicalIndicator;

  if (regeneratePlots && isFunction(regeneratePlots)) {
    TechnicalIndicatorClass.prototype.regeneratePlots = regeneratePlots;
  }

  if (render && isFunction(render)) {
    TechnicalIndicatorClass.prototype.render = render;
  }

  return new TechnicalIndicatorClass();
}
/**
 * 获取技术指标信息
 * @param technicalIndicator
 * @return {{series, calcParams, precision, name, styles}}
 */

function getTechnicalIndicatorInfo(technicalIndicator) {
  return {
    name: technicalIndicator.name,
    series: technicalIndicator.series,
    calcParams: technicalIndicator.calcParams,
    calcParamsAllowDecimal: technicalIndicator.calcParamsAllowDecimal,
    shouldCheckParamCount: technicalIndicator.shouldCheckParamCount,
    shouldOhlc: technicalIndicator.shouldOhlc,
    shouldFormatBigNumber: technicalIndicator.shouldFormatBigNumber,
    precision: technicalIndicator.precision,
    styles: technicalIndicator.styles,
    result: technicalIndicator.result || []
  };
}
/**
 * 获取技术指标提示数据
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @return {{calcParamText: string, values: [], name: string}}
 */

function getTechnicalIndicatorTooltipData() {
  var technicalIndicatorData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var technicalIndicator = arguments.length > 1 ? arguments[1] : undefined;
  var calcParams = technicalIndicator.calcParams;
  var plots = technicalIndicator.plots;
  var precision = technicalIndicator.precision;
  var shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
  var values = [];
  var name = '';
  var calcParamText = '';

  if (plots.length > 0) {
    name = technicalIndicator.name;
  }

  if (calcParams.length > 0) {
    calcParamText = "(".concat(calcParams.join(','), ")");
  }

  plots.forEach(function (plot) {
    var data = {};

    if (isValid(plot.title)) {
      var value = technicalIndicatorData[plot.key];

      if (isValid(value)) {
        value = formatPrecision(value, precision);

        if (shouldFormatBigNumber) {
          value = formatBigNumber(value);
        }
      }

      data.title = plot.title;
      data.value = value;
    }

    values.push(data);
  });
  return {
    values: values,
    name: name,
    calcParamText: calcParamText
  };
}

/**
 * 覆盖物
 */

var Overlay = /*#__PURE__*/function () {
  function Overlay(_ref) {
    var id = _ref.id,
        chartData = _ref.chartData,
        xAxis = _ref.xAxis,
        yAxis = _ref.yAxis;

    _classCallCheck(this, Overlay);

    this._id = id;
    this._chartData = chartData;
    this._xAxis = xAxis;
    this._yAxis = yAxis;
    this._styles = null;
  }
  /**
   * 绘制
   * @param ctx
   */


  _createClass(Overlay, [{
    key: "draw",
    value: function draw(ctx) {}
    /**
     * 设置样式
     * @param styles
     * @param defaultStyles
     */

  }, {
    key: "setStyles",
    value: function setStyles(styles, defaultStyles) {
      if (!isObject(styles)) {
        return false;
      }

      if (!this._styles) {
        this._styles = clone(defaultStyles);
      }

      merge(this._styles, styles);
      return true;
    }
    /**
     * 获取id
     * @return {*}
     */

  }, {
    key: "id",
    value: function id() {
      return this._id;
    }
    /**
     * 获取样式
     * @return {null}
     */

  }, {
    key: "styles",
    value: function styles() {
      return this._styles;
    }
    /**
     * 检查鼠标点是否在图形上
     * @param point
     */

  }, {
    key: "checkMousePointOnGraphic",
    value: function checkMousePointOnGraphic(point) {} // -------------------- 事件开始 -------------------

    /**
     * 点击事件
     * @param id
     * @param points
     * @param event
     */

  }, {
    key: "onClick",
    value: function onClick(_ref2) {
      _ref2.id;
          _ref2.points;
          _ref2.event;
    }
    /**
     * 右击事件
     * @param id
     * @param points
     * @param event
     */

  }, {
    key: "onRightClick",
    value: function onRightClick(_ref3) {
      _ref3.id;
          _ref3.points;
          _ref3.event;
    }
    /**
     * 鼠标进入事件
     * @param id
     * @param points
     * @param event
     */

  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(_ref4) {
      _ref4.id;
          _ref4.points;
          _ref4.event;
    }
    /**
     * 鼠标离开事件
     * @param id
     * @param points
     * @param event
     */

  }, {
    key: "onMouseLeave",
    value: function onMouseLeave(_ref5) {
      _ref5.id;
          _ref5.points;
          _ref5.event;
    } // -------------------- 事件结束 -------------------

  }]);

  return Overlay;
}();

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * 绘制实心圆
 * @param ctx
 * @param fillColor
 * @param circlePoint
 * @param radius
 */

function renderFillCircle(ctx, fillColor, circlePoint, radius) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(circlePoint.x, circlePoint.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DEVIATION = 2;
/**
 * 根据三角形三个点获取三角形面积
 * @param point1
 * @param point2
 * @param point3
 * @return {number}
 */

function getTriangleSquare(point1, point2, point3) {
  var x1 = Math.abs(point2.x - point1.x);
  var y1 = Math.abs(point2.y - point1.y);
  var x2 = Math.abs(point3.x - point1.x);
  var y2 = Math.abs(point3.y - point1.y);
  return Math.abs(x1 * y2 - x2 * y1) / 2;
}
/**
 * 获取一次函数斜率和截距，即 y = kx + b 中的k值和b值
 * @param point1
 * @param point2
 */

function getLinearSlopeIntercept(point1, point2) {
  var difX = point1.x - point2.x;

  if (difX !== 0) {
    var k = (point1.y - point2.y) / difX;
    var b = point1.y - k * point1.x;
    return {
      k: k,
      b: b
    };
  }
}
/**
 * 获取点在两点决定的一次函数上的y值
 * @param point1
 * @param point2
 * @param targetPoint
 */

function getLinearYFromPoints(point1, point2, targetPoint) {
  var kb = getLinearSlopeIntercept(point1, point2);
  return getLinearYFromSlopeIntercept(kb, targetPoint);
}
/**
 * 获取点在斜率和截距确定的线上的y值
 * @param kb
 * @param targetPoint
 */

function getLinearYFromSlopeIntercept(kb, targetPoint) {
  if (kb) {
    return targetPoint.x * kb.k + kb.b;
  }

  return targetPoint.y;
}
/**
 * 点是否在线上
 * @param point1
 * @param point2
 * @param targetPoint
 */

function checkPointOnStraightLine(point1, point2, targetPoint) {
  if (!targetPoint || !point1 || !point2) {
    return false;
  }

  if (point1.x === point2.x) {
    return Math.abs(targetPoint.x - point1.x) < DEVIATION;
  }

  var kb = getLinearSlopeIntercept(point1, point2);
  var y = getLinearYFromSlopeIntercept(kb, targetPoint);
  var yDif = Math.abs(y - targetPoint.y);
  return yDif * yDif / (kb.k * kb.k + 1) < DEVIATION * DEVIATION;
}
/**
 * 点是否在线段上
 * @param point1
 * @param point2
 * @param targetPoint
 * @returns {boolean}
 */

function checkPointOnRayLine(point1, point2, targetPoint) {
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      if (point1.y < point2.y) {
        return point1.y - targetPoint.y < DEVIATION;
      } else {
        return targetPoint.y - point1.y < DEVIATION;
      }
    }

    if (point1.x < point2.x) {
      return point1.x - targetPoint.x < DEVIATION;
    } else {
      return targetPoint.x - point1.x < DEVIATION;
    }
  }

  return false;
}
/**
 * 判断点是否在线段上面
 * @param point1
 * @param point2
 * @param targetPoint
 */

function checkPointOnSegment(point1, point2, targetPoint) {
  if (checkPointOnStraightLine(point1, point2, targetPoint)) {
    if (point1.x === point2.x) {
      return Math.abs(point1.y - targetPoint.y) + Math.abs(point2.y - targetPoint.y) - Math.abs(point1.y - point2.y) < DEVIATION * 2;
    }

    return Math.abs(point1.x - targetPoint.x) + Math.abs(point2.x - targetPoint.x) - Math.abs(point1.x - point2.x) < DEVIATION * 2;
  }

  return false;
}
/**
 * 点是否在圆内
 * @param circleCenterPoint
 * @param radius
 * @param targetPoint
 * @returns {boolean}
 */

function checkPointInCircle(circleCenterPoint, radius, targetPoint) {
  if (!targetPoint) {
    return false;
  }

  var difX = targetPoint.x - circleCenterPoint.x;
  var difY = targetPoint.y - circleCenterPoint.y;
  return !(difX * difX + difY * difY > radius * radius);
}
/**
 * 检查点是否在三角形内部
 * @param trianglePoints
 * @param targetPoint
 * @return {boolean}
 */

function checkPointInTriangle(trianglePoints, targetPoint) {
  var square = getTriangleSquare(trianglePoints[0], trianglePoints[1], trianglePoints[2]);
  var compareSquare = getTriangleSquare(trianglePoints[0], trianglePoints[1], targetPoint) + getTriangleSquare(trianglePoints[0], trianglePoints[2], targetPoint) + getTriangleSquare(trianglePoints[1], trianglePoints[2], targetPoint);
  return Math.abs(square - compareSquare) < DEVIATION;
}
/**
 * 检查点是否在三角形菱形内部
 * @param centerPoint
 * @param width
 * @param height
 * @param targetPoint
 * @return {boolean}
 */

function checkPointInDiamond(centerPoint, width, height, targetPoint) {
  var xDis = Math.abs(centerPoint.x - targetPoint.x);
  var yDis = Math.abs(centerPoint.y - targetPoint.y);
  return xDis * height + yDis * width < width * height / 2 + DEVIATION;
}
/**
 * 检查点是否在矩形内部
 * @param point1
 * @param point2
 * @param targetPoint
 * @return {boolean}
 */

function checkPointInRect(point1, point2, targetPoint) {
  return targetPoint.x >= point1.x && targetPoint.x <= point2.x && targetPoint.y >= point1.y && targetPoint.y <= point2.y;
}
/**
 * 根据两点获取一条射线
 * @param point1
 * @param point2
 * @param xyMax
 * @return {(*|{x: *, y: *})[]|*[]}
 */

function getRayLine(point1, point2, xyMax) {
  if (point1 && point2) {
    var point;

    if (point1.x === point2.x && point1.y !== point2.y) {
      if (point1.y < point2.y) {
        point = {
          x: point1.x,
          y: xyMax.y
        };
      } else {
        point = {
          x: point1.x,
          y: 0
        };
      }
    } else if (point1.x > point2.x) {
      point = {
        x: 0,
        y: getLinearYFromPoints(point1, point2, {
          x: 0,
          y: point1.y
        })
      };
    } else {
      point = {
        x: xyMax.x,
        y: getLinearYFromPoints(point1, point2, {
          x: xyMax.x,
          y: point1.y
        })
      };
    }

    return [point1, point];
  }

  return [];
}
/**
 * 获取平行线
 * @param points
 * @param xyMax
 * @param extendParallelLineCount
 * @returns {Array}
 */

function getParallelLines(points, xyMax) {
  var extendParallelLineCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lines = [];

  if (points.length > 1) {
    if (points[0].x === points[1].x) {
      var startY = 0;
      var endY = xyMax.y;
      lines.push([{
        x: points[0].x,
        y: startY
      }, {
        x: points[0].x,
        y: endY
      }]);

      if (points.length > 2) {
        lines.push([{
          x: points[2].x,
          y: startY
        }, {
          x: points[2].x,
          y: endY
        }]);
        var distance = points[0].x - points[2].x;

        for (var i = 0; i < extendParallelLineCount; i++) {
          var d = distance * (i + 1);
          lines.push([{
            x: points[0].x + d,
            y: startY
          }, {
            x: points[0].x + d,
            y: endY
          }]);
        }
      }
    } else {
      var startX = 0;
      var endX = xyMax.x;
      var kb = getLinearSlopeIntercept(points[0], points[1]);
      var k = kb.k;
      var b = kb.b;
      lines.push([{
        x: startX,
        y: startX * k + b
      }, {
        x: endX,
        y: endX * k + b
      }]);

      if (points.length > 2) {
        var b1 = points[2].y - k * points[2].x;
        lines.push([{
          x: startX,
          y: startX * k + b1
        }, {
          x: endX,
          y: endX * k + b1
        }]);

        var _distance = b - b1;

        for (var _i = 0; _i < extendParallelLineCount; _i++) {
          var b2 = b + _distance * (_i + 1);
          lines.push([{
            x: startX,
            y: startX * k + b2
          }, {
            x: endX,
            y: endX * k + b2
          }]);
        }
      }
    }
  }

  return lines;
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */
function renderHorizontalLine(ctx, y, left, right) {
  ctx.beginPath();
  var correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(left, y + correction);
  ctx.lineTo(right, y + correction);
  ctx.stroke();
  ctx.closePath();
}
/**
 * 绘制垂直直线
 * @param ctx
 * @param x
 * @param top
 * @param bottom
 */

function renderVerticalLine(ctx, x, top, bottom) {
  ctx.beginPath();
  var correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(x + correction, top);
  ctx.lineTo(x + correction, bottom);
  ctx.stroke();
  ctx.closePath();
}
/**
 * 绘制线
 * @param ctx
 * @param renderFuc
 */

function renderLine(ctx, renderFuc) {
  ctx.save();

  if (ctx.lineWidth % 2) {
    ctx.translate(0.5, 0.5);
  }

  renderFuc();
  ctx.restore();
}

var GRAPHIC_MARK_DRAW_STEP_START = 1; // 标记图形绘制步骤结束

var GRAPHIC_MARK_DRAW_STEP_FINISHED = -1;
/**
 * 图形标记鼠标操作元素类型
 * @type {{OTHER: string, POINT: string, NONE: string}}
 */

var GraphicMarkMouseOperateElement = {
  OTHER: 'other',
  POINT: 'point',
  NONE: 'none'
};
/**
 * 绘制类型
 * @type {{ARC: string, POLYGON: string, LINE: string, CONTINUOUS_LINE: string, TEXT: string}}
 */

var GraphicMarkDrawType = {
  LINE: 'line',
  TEXT: 'text',
  CONTINUOUS_LINE: 'continuous_line',
  POLYGON: 'polygon',
  ARC: 'arc'
};
/**
 * 绘制风格
 * @type {{STROKE: string, FILL: string, SOLID: string, DASH: string}}
 */

var GraphicMarkDrawStyle = {
  STROKE: 'stroke',
  FILL: 'fill',
  SOLID: 'solid',
  DASH: 'dash'
};
/**
 * 线类型
 * @type {{VERTICAL: number, COMMON: number, HORIZONTAL: number}}
 */

var LineType = {
  COMMON: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
};
/**
 * 获取绘制线类型
 * @param point1
 * @param point2
 * @private
 */

function getLineType(point1, point2) {
  if (point1.x === point2.x) {
    return LineType.VERTICAL;
  }

  if (point1.y === point2.y) {
    return LineType.HORIZONTAL;
  }

  return LineType.COMMON;
}
/**
 * 标记图形
 */


var GraphicMark = /*#__PURE__*/function (_Overlay) {
  _inherits(GraphicMark, _Overlay);

  var _super = _createSuper(GraphicMark);

  function GraphicMark(_ref) {
    var _this;

    var id = _ref.id,
        name = _ref.name,
        totalStep = _ref.totalStep,
        chartData = _ref.chartData,
        xAxis = _ref.xAxis,
        yAxis = _ref.yAxis,
        points = _ref.points,
        styles = _ref.styles,
        lock = _ref.lock;

    _classCallCheck(this, GraphicMark);

    _this = _super.call(this, {
      id: id,
      chartData: chartData,
      xAxis: xAxis,
      yAxis: yAxis
    });
    _this._name = name;
    _this._totalStep = totalStep;
    _this._lock = lock;
    _this._drawStep = GRAPHIC_MARK_DRAW_STEP_START;
    _this._tpPoints = [];

    _this._applyPoints(points);

    _this.setStyles(styles, chartData.styleOptions().graphicMark);

    return _this;
  }
  /**
   * 加载点
   * @param points
   */


  _createClass(GraphicMark, [{
    key: "_applyPoints",
    value: function _applyPoints(points) {
      if (isArray(points) && points.length > 0) {
        var repeatTotalStep;

        if (points.length >= this._totalStep - 1) {
          this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED;
          this._tpPoints = points.slice(0, this._totalStep - 1);
          repeatTotalStep = this._totalStep - 1;
        } else {
          this._drawStep = points.length + 1;
          this._tpPoints = clone(points);
          repeatTotalStep = points.length;
        } // 重新演练绘制一遍，防止因为点不对而绘制出错误的图形


        for (var i = 0; i < repeatTotalStep; i++) {
          this.performMouseMoveForDrawing(i + 2, this._tpPoints, this._tpPoints[i], this._xAxis, this._yAxis);
        }

        if (this._drawStep === GRAPHIC_MARK_DRAW_STEP_FINISHED) {
          this.performMousePressedMove(this._tpPoints, this._tpPoints.length - 1, this._tpPoints[this._tpPoints.length - 1], this._xAxis, this._yAxis);
        }
      }
    }
    /**
     * 时间戳转换成x轴上点的位置
     * @param tpPoint
     * @return {*|number}
     * @private
     */

  }, {
    key: "_timestampOrDataIndexToPointX",
    value: function _timestampOrDataIndexToPointX(_ref2) {
      var timestamp = _ref2.timestamp,
          dataIndex = _ref2.dataIndex;
      return timestamp ? this._xAxis.convertToPixel(this._chartData.timestampToDataIndex(timestamp)) : this._xAxis.convertToPixel(dataIndex);
    }
    /**
     * 绘制线
     * @param ctx
     * @param lines
     * @param style
     * @param markOptions
     * @private
     */

  }, {
    key: "_drawLines",
    value: function _drawLines(ctx, lines, style, markOptions) {
      ctx.save();
      ctx.strokeStyle = markOptions.line.color;
      ctx.lineWidth = markOptions.line.size;

      if (style === GraphicMarkDrawStyle.DASH) {
        ctx.setLineDash(markOptions.line.dashValue);
      }

      lines.forEach(function (points) {
        if (points.length > 1) {
          var lineType = getLineType(points[0], points[1]);

          switch (lineType) {
            case LineType.COMMON:
              {
                renderLine(ctx, function () {
                  ctx.beginPath();
                  ctx.moveTo(points[0].x, points[0].y);
                  ctx.lineTo(points[1].x, points[1].y);
                  ctx.stroke();
                  ctx.closePath();
                });
                break;
              }

            case LineType.HORIZONTAL:
              {
                renderHorizontalLine(ctx, points[0].y, points[0].x, points[1].x);
                break;
              }

            case LineType.VERTICAL:
              {
                renderVerticalLine(ctx, points[0].x, points[0].y, points[1].y);
                break;
              }
          }
        }
      });
      ctx.restore();
    }
    /**
     * 绘制连续线
     * @param ctx
     * @param continuousLines
     * @param style
     * @param markOptions
     * @private
     */

  }, {
    key: "_drawContinuousLines",
    value: function _drawContinuousLines(ctx, continuousLines, style, markOptions) {
      ctx.save();
      ctx.strokeStyle = markOptions.line.color;
      ctx.lineWidth = markOptions.line.size;

      if (style === GraphicMarkDrawStyle.DASH) {
        ctx.setLineDash(markOptions.line.dashValue);
      }

      continuousLines.forEach(function (points) {
        if (points.length > 0) {
          renderLine(ctx, function () {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (var i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.stroke();
            ctx.closePath();
          });
        }
      });
      ctx.restore();
    }
    /**
     * 绘制多边形
     * @param ctx
     * @param polygons
     * @param style
     * @param markOptions
     * @private
     */

  }, {
    key: "_drawPolygons",
    value: function _drawPolygons(ctx, polygons, style, markOptions) {
      ctx.save();
      var fillStroke;

      if (style === GraphicMarkDrawStyle.FILL) {
        ctx.fillStyle = markOptions.polygon.fill.color;
        fillStroke = ctx.fill;
      } else {
        ctx.lineWidth = markOptions.polygon.stroke.size;
        ctx.strokeStyle = markOptions.polygon.stroke.color;
        fillStroke = ctx.stroke;
      }

      polygons.forEach(function (points) {
        if (points.length > 0) {
          renderLine(ctx, function () {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (var i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.closePath();
            fillStroke.call(ctx);
          });
        }
      });
      ctx.restore();
    }
    /**
     * 画圆弧
     * @param ctx
     * @param arcs
     * @param style
     * @param markOptions
     * @private
     */

  }, {
    key: "_drawArcs",
    value: function _drawArcs(ctx, arcs, style, markOptions) {
      ctx.save();

      if (style === GraphicMarkDrawStyle.FILL) {
        ctx.fillStyle = markOptions.arc.fill.color;
      } else {
        ctx.lineWidth = markOptions.arc.stroke.size;
        ctx.strokeStyle = markOptions.arc.stroke.color;
      }

      arcs.forEach(function (_ref3) {
        var x = _ref3.x,
            y = _ref3.y,
            radius = _ref3.radius,
            startAngle = _ref3.startAngle,
            endAngle = _ref3.endAngle;
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);

        if (style === GraphicMarkDrawStyle.FILL) {
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.stroke();
          ctx.closePath();
        }
      });
      ctx.restore();
    }
    /**
     * 绘制文字
     * @param ctx
     * @param texts
     * @param style
     * @param markOptions
     * @private
     */

  }, {
    key: "_drawText",
    value: function _drawText(ctx, texts, style, markOptions) {
      ctx.save();
      var fillStroke;

      if (style === GraphicMarkDrawStyle.STROKE) {
        ctx.strokeStyle = markOptions.text.color;
        fillStroke = ctx.strokeText;
      } else {
        ctx.fillStyle = markOptions.text.color;
        fillStroke = ctx.fillText;
      }

      ctx.font = "".concat(markOptions.text.weight, " ").concat(markOptions.text.size, "px ").concat(markOptions.text.family);
      texts.forEach(function (_ref4) {
        var x = _ref4.x,
            y = _ref4.y,
            text = _ref4.text;
        fillStroke.call(ctx, text, x + markOptions.text.marginLeft, y - markOptions.text.marginBottom);
      });
      ctx.restore();
    }
    /**
     * 绘制
     * @param ctx
     */

  }, {
    key: "draw",
    value: function draw(ctx) {
      var _this2 = this;

      var xyPoints = this._tpPoints.map(function (_ref5) {
        var timestamp = _ref5.timestamp,
            price = _ref5.price,
            dataIndex = _ref5.dataIndex;
        return {
          x: _this2._timestampOrDataIndexToPointX({
            timestamp: timestamp,
            dataIndex: dataIndex
          }),
          y: _this2._yAxis.convertToPixel(price)
        };
      });

      var markOptions = this._styles || this._chartData.styleOptions().graphicMark;

      if (this._drawStep !== GRAPHIC_MARK_DRAW_STEP_START && xyPoints.length > 0) {
        var viewport = {
          width: this._xAxis.width(),
          height: this._yAxis.height()
        };
        var precision = {
          price: this._chartData.pricePrecision(),
          volume: this._chartData.volumePrecision()
        };
        var graphicDataSources = this.createGraphicDataSource(this._drawStep, this._tpPoints, xyPoints, viewport, precision, this._xAxis, this._yAxis) || [];
        graphicDataSources.forEach(function (_ref6) {
          var type = _ref6.type,
              isDraw = _ref6.isDraw,
              style = _ref6.style,
              _ref6$dataSource = _ref6.dataSource,
              dataSource = _ref6$dataSource === void 0 ? [] : _ref6$dataSource;

          if (!isValid(isDraw) || isDraw) {
            switch (type) {
              case GraphicMarkDrawType.LINE:
                {
                  _this2._drawLines(ctx, dataSource, style, markOptions);

                  break;
                }

              case GraphicMarkDrawType.CONTINUOUS_LINE:
                {
                  _this2._drawContinuousLines(ctx, dataSource, style, markOptions);

                  break;
                }

              case GraphicMarkDrawType.POLYGON:
                {
                  _this2._drawPolygons(ctx, dataSource, style, markOptions);

                  break;
                }

              case GraphicMarkDrawType.ARC:
                {
                  _this2._drawArcs(ctx, dataSource, style, markOptions);

                  break;
                }

              case GraphicMarkDrawType.TEXT:
                {
                  _this2._drawText(ctx, dataSource, style, markOptions);

                  break;
                }
            }
          }
        });

        if (this.drawExtend) {
          ctx.save();
          this.drawExtend(ctx, graphicDataSources, markOptions, viewport, precision, this._xAxis, this._yAxis);
          ctx.restore();
        }
      }

      var graphicMarkMouseOperate = this._chartData.graphicMarkMouseOperate();

      if (graphicMarkMouseOperate.hover.id === this._id && graphicMarkMouseOperate.hover.element !== GraphicMarkMouseOperateElement.NONE || graphicMarkMouseOperate.click.id === this._id && graphicMarkMouseOperate.click.element !== GraphicMarkMouseOperateElement.NONE) {
        xyPoints.forEach(function (_ref7, index) {
          var x = _ref7.x,
              y = _ref7.y;
          var radius = markOptions.point.radius;
          var color = markOptions.point.backgroundColor;
          var borderColor = markOptions.point.borderColor;
          var borderSize = markOptions.point.borderSize;

          if (graphicMarkMouseOperate.hover.id === _this2._id && graphicMarkMouseOperate.hover.element === GraphicMarkMouseOperateElement.POINT && index === graphicMarkMouseOperate.hover.elementIndex) {
            radius = markOptions.point.activeRadius;
            color = markOptions.point.activeBackgroundColor;
            borderColor = markOptions.point.activeBorderColor;
            borderSize = markOptions.point.activeBorderSize;
          }

          renderFillCircle(ctx, borderColor, {
            x: x,
            y: y
          }, radius + borderSize);
          renderFillCircle(ctx, color, {
            x: x,
            y: y
          }, radius);
        });
      }
    }
    /**
     * 设置是否锁定
     * @param lock
     */

  }, {
    key: "setLock",
    value: function setLock(lock) {
      this._lock = lock;
    }
    /**
     * 获取名字
     * @return {*}
     */

  }, {
    key: "name",
    value: function name() {
      return this._name;
    }
    /**
     * 是否锁定
     * @return {*}
     */

  }, {
    key: "lock",
    value: function lock() {
      return this._lock;
    }
    /**
     * 总步骤数
     * @return {*}
     */

  }, {
    key: "totalStep",
    value: function totalStep() {
      return this._totalStep;
    }
    /**
     * 获取点
     * @return {[]}
     */

  }, {
    key: "tpPoints",
    value: function tpPoints() {
      return this._tpPoints;
    }
    /**
     * 是否在绘制中
     * @return {boolean}
     */

  }, {
    key: "isDrawing",
    value: function isDrawing() {
      return this._drawStep !== GRAPHIC_MARK_DRAW_STEP_FINISHED;
    }
    /**
     * 检查鼠标点是否在图形上
     * @param point
     * @return {{id: *, elementIndex: number, element: string}}
     */

  }, {
    key: "checkMousePointOnGraphic",
    value: function checkMousePointOnGraphic(point) {
      var markOptions = this._styles || this._chartData.styleOptions().graphicMark;

      var xyPoints = []; // 检查鼠标点是否在图形的点上

      for (var i = 0; i < this._tpPoints.length; i++) {
        var _this$_tpPoints$i = this._tpPoints[i],
            timestamp = _this$_tpPoints$i.timestamp,
            price = _this$_tpPoints$i.price,
            dataIndex = _this$_tpPoints$i.dataIndex;
        var xyPoint = {
          x: this._timestampOrDataIndexToPointX({
            timestamp: timestamp,
            dataIndex: dataIndex
          }),
          y: this._yAxis.convertToPixel(price)
        };
        xyPoints.push(xyPoint);

        if (checkPointInCircle(xyPoint, markOptions.point.radius, point)) {
          return {
            id: this._id,
            element: GraphicMarkMouseOperateElement.POINT,
            elementIndex: i,
            instance: this
          };
        }
      } // 检查鼠标点是否在点构成的其它图形上


      var graphicDataSources = this.createGraphicDataSource(this._drawStep, this._tpPoints, xyPoints, {
        width: this._xAxis.width(),
        height: this._yAxis.height()
      }, {
        price: this._chartData.pricePrecision(),
        volume: this._chartData.volumePrecision()
      }, this._xAxis, this._yAxis) || [];

      var _iterator = _createForOfIteratorHelper(graphicDataSources),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              key = _step$value.key,
              type = _step$value.type,
              isCheck = _step$value.isCheck,
              _step$value$dataSourc = _step$value.dataSource,
              dataSource = _step$value$dataSourc === void 0 ? [] : _step$value$dataSourc;

          if (isCheck) {
            for (var _i = 0; _i < dataSource.length; _i++) {
              var points = dataSource[_i];

              if (this.checkMousePointOn(key, type, points, point)) {
                return {
                  id: this._id,
                  element: GraphicMarkMouseOperateElement.OTHER,
                  elementIndex: _i,
                  instance: this
                };
              }
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * 绘制过程中鼠标移动事件
     * @param point
     */

  }, {
    key: "mouseMoveForDrawing",
    value: function mouseMoveForDrawing(point) {
      var dataIndex = this._xAxis.convertFromPixel(point.x);

      var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

      var price = this._yAxis.convertFromPixel(point.y);

      this._tpPoints[this._drawStep - 1] = {
        timestamp: timestamp,
        price: price,
        dataIndex: dataIndex
      };
      this.performMouseMoveForDrawing(this._drawStep, this._tpPoints, {
        timestamp: timestamp,
        price: price,
        dataIndex: dataIndex
      }, this._xAxis, this._yAxis);
      this.onDrawing({
        id: this._id,
        step: this._drawStep,
        points: this._tpPoints
      });
    }
    /**
     * 鼠标左边按钮点击事件
     */

  }, {
    key: "mouseLeftButtonDownForDrawing",
    value: function mouseLeftButtonDownForDrawing() {
      if (this._drawStep === this._totalStep - 1) {
        this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED;
        this.onDrawEnd({
          id: this._id,
          points: this._tpPoints
        });
      } else {
        this._drawStep++;
      }
    }
    /**
     * 鼠标按住移动方法
     * @param point
     * @param event
     */

  }, {
    key: "mousePressedMove",
    value: function mousePressedMove(point, event) {
      var graphicMarkMouseOperate = this._chartData.graphicMarkMouseOperate();

      var elementIndex = graphicMarkMouseOperate.click.elementIndex;

      if (!this._lock && graphicMarkMouseOperate.click.id === this._id && graphicMarkMouseOperate.click.element === GraphicMarkMouseOperateElement.POINT && elementIndex !== -1) {
        var dataIndex = this._xAxis.convertFromPixel(point.x);

        var timestamp = this._chartData.dataIndexToTimestamp(dataIndex);

        var price = this._yAxis.convertFromPixel(point.y);

        this._tpPoints[elementIndex].timestamp = timestamp;
        this._tpPoints[elementIndex].dataIndex = dataIndex;
        this._tpPoints[elementIndex].price = price;
        this.performMousePressedMove(this._tpPoints, elementIndex, {
          dataIndex: dataIndex,
          timestamp: timestamp,
          price: price
        }, this._xAxis, this._yAxis);
        this.onPressedMove({
          id: graphicMarkMouseOperate.click.id,
          points: this._tpPoints,
          event: event
        });
      }
    } // -------------------- 事件开始 -------------------

    /**
     * 开始绘制事件回调
     * @param id
     */

  }, {
    key: "onDrawStart",
    value: function onDrawStart(_ref8) {
      _ref8.id;
    }
    /**
     * 绘制过程中事件回调
     * @param id
     * @param step
     * @param points
     */

  }, {
    key: "onDrawing",
    value: function onDrawing(_ref9) {
      _ref9.id;
          _ref9.step;
          _ref9.points;
    }
    /**
     * 绘制结束事件回调
     * @param id
     * @param points
     */

  }, {
    key: "onDrawEnd",
    value: function onDrawEnd(_ref10) {
      _ref10.id;
          _ref10.points;
    }
    /**
     * 按住移动事件
     * @param id
     * @param points
     * @param event
     */

  }, {
    key: "onPressedMove",
    value: function onPressedMove(_ref11) {
      _ref11.id;
          _ref11.points;
          _ref11.event;
    }
    /**
     * 移除事件回调
     * @param id
     */

  }, {
    key: "onRemove",
    value: function onRemove(_ref12) {
      _ref12.id;
    } // -------------------- 事件结束 -------------------
    // --------------------- 自定义时需要实现的一些方法开始 ----------------------

    /**
     * 检查鼠标点在其它图形上
     * @param key
     * @param type
     * @param points
     * @param mousePoint
     */

  }, {
    key: "checkMousePointOn",
    value: function checkMousePointOn(key, type, points, mousePoint) {}
    /**
     * 创建图形配置
     * @param step
     * @param tpPoints
     * @param xyPoints
     * @param viewport
     * @param precision
     * @param xAxis
     * @param yAxis
     */

  }, {
    key: "createGraphicDataSource",
    value: function createGraphicDataSource(step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) {}
    /**
     * 处理绘制过程中鼠标移动
     * @param step
     * @param tpPoints
     * @param tpPoint
     * @param xAxis
     * @param yAxis
     */

  }, {
    key: "performMouseMoveForDrawing",
    value: function performMouseMoveForDrawing(step, tpPoints, tpPoint, xAxis, yAxis) {}
    /**
     * 处理鼠标按住移动
     * @param tpPoints
     * @param pressedPointIndex
     * @param tpPoint
     * @param xAxis
     * @param yAxis
     */

  }, {
    key: "performMousePressedMove",
    value: function performMousePressedMove(tpPoints, pressedPointIndex, tpPoint, xAxis, yAxis) {} // --------------------- 自定义时需要实现的一些方法结束 ----------------------

  }]);

  return GraphicMark;
}(Overlay);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Delegate = /*#__PURE__*/function () {
  function Delegate() {
    _classCallCheck(this, Delegate);

    this._observers = [];
  }

  _createClass(Delegate, [{
    key: "subscribe",
    value: function subscribe(observer) {
      if (this._observers.indexOf(observer) < 0) {
        this._observers.push(observer);
      }
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(observer) {
      var index = this._observers.indexOf(observer);

      if (index > -1) {
        this._observers.splice(index, 1);
      } else {
        this._observers = [];
      }
    }
  }, {
    key: "execute",
    value: function execute(data) {
      this._observers.forEach(function (observer) {
        observer(data);
      });
    }
  }, {
    key: "hasObservers",
    value: function hasObservers() {
      return this._observers.length > 0;
    }
  }]);

  return Delegate;
}();

/**
 * 创建图形标记映射
 * @return {{}}
 */

function createGraphicMarkMapping() {
  var mapping = {};
  var graphicMarkExtensions = extension.graphicMarkExtensions;

  for (var name in graphicMarkExtensions) {
    var graphicMarkClass = createGraphicMarkClass(graphicMarkExtensions[name]);

    if (graphicMarkClass) {
      mapping[name] = graphicMarkClass;
    }
  }

  return mapping;
}
/**
 * 创建图形标记类
 * @param name
 * @param series
 * @param checkMousePointOn
 * @param createGraphicDataSource
 * @param performMousePressedMove
 * @param performMouseMoveForDrawing
 * @param drawExtend
 * @return {Mark|null}
 */

function createGraphicMarkClass(_ref) {
  var name = _ref.name,
      totalStep = _ref.totalStep,
      checkMousePointOn = _ref.checkMousePointOn,
      createGraphicDataSource = _ref.createGraphicDataSource,
      performMousePressedMove = _ref.performMousePressedMove,
      performMouseMoveForDrawing = _ref.performMouseMoveForDrawing,
      drawExtend = _ref.drawExtend;

  if (!name || !isNumber(totalStep) || !isFunction(checkMousePointOn) || !isFunction(createGraphicDataSource)) {
    {
      console.warn('Required attribute "name" and "totalStep", method "checkMousePointOn" and "createGraphicDataSource", new graphic mark cannot be generated!!!');
    }

    return null;
  }

  var Mark = /*#__PURE__*/function (_GraphicMark) {
    _inherits(Mark, _GraphicMark);

    var _super = _createSuper(Mark);

    function Mark(_ref2) {
      var id = _ref2.id,
          chartData = _ref2.chartData,
          xAxis = _ref2.xAxis,
          yAxis = _ref2.yAxis,
          points = _ref2.points,
          styles = _ref2.styles,
          lock = _ref2.lock;

      _classCallCheck(this, Mark);

      return _super.call(this, {
        id: id,
        name: name,
        totalStep: totalStep,
        chartData: chartData,
        xAxis: xAxis,
        yAxis: yAxis,
        points: points,
        styles: styles,
        lock: lock
      });
    }

    return Mark;
  }(GraphicMark);

  Mark.prototype.checkMousePointOn = checkMousePointOn;
  Mark.prototype.createGraphicDataSource = createGraphicDataSource;

  if (isFunction(performMousePressedMove)) {
    Mark.prototype.performMousePressedMove = performMousePressedMove;
  }

  if (isFunction(performMouseMoveForDrawing)) {
    Mark.prototype.performMouseMoveForDrawing = performMouseMoveForDrawing;
  }

  if (isFunction(drawExtend)) {
    Mark.prototype.drawExtend = drawExtend;
  }

  return Mark;
}
/**
 * 获取图形标记信息
 * @param graphicMark
 * @return {{name, lock: *, styles, id, points: (*|*[])}}
 */

function getGraphicMarkInfo(graphicMark) {
  return {
    name: graphicMark.name(),
    id: graphicMark.id(),
    totalStep: graphicMark.totalStep(),
    lock: graphicMark.lock(),
    points: graphicMark.tpPoints(),
    styles: graphicMark.styles()
  };
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 二分查找最接近的数
 * @param dataList
 * @param valueKey
 * @param targetNumber
 * @return {number}
 */
function binarySearchNearest(dataList, valueKey, targetNumber) {
  var left = 0;
  var right = 0;

  for (right = dataList.length - 1; left !== right;) {
    var midIndex = Math.floor((right + left) / 2);
    var mid = right - left;
    var midValue = dataList[midIndex][valueKey];

    if (targetNumber === dataList[left][valueKey]) {
      return left;
    }

    if (targetNumber === dataList[right][valueKey]) {
      return right;
    }

    if (targetNumber === midValue) {
      return midIndex;
    }

    if (targetNumber > midValue) {
      left = midIndex;
    } else {
      right = midIndex;
    }

    if (mid <= 2) {
      break;
    }
  }

  return left;
}

var InvalidateLevel = {
  NONE: 0,
  OVERLAY: 1,
  TOOLTIP: 2,
  MAIN: 3,
  FULL: 4
};
var ActionType = {
  drawCandle: 'drawCandle',
  drawTechnicalIndicator: 'drawTechnicalIndicator',
  zoom: 'zoom',
  scroll: 'scroll',
  crosshair: 'crosshair'
};
/**
 * 删除图形标记实例操作类型
 * @type {{ACTION: string, ID: string}}
 */

var RemoveGraphicMarkOperateType = {
  ACTION: 'action',
  ID: 'id'
};
var MAX_DATA_SPACE = 50;
var MIN_DATA_SPACE = 1;

var ChartData = /*#__PURE__*/function () {
  function ChartData(styleOptions, invalidateHandler) {
    _classCallCheck(this, ChartData);

    // 刷新持有者
    this._invalidateHandler = invalidateHandler; // 样式配置

    this._styleOptions = clone(defaultStyleOptions);
    merge(this._styleOptions, styleOptions); // 所有技术指标映射

    this._technicalIndicatorMapping = createTechnicalIndicatorMapping(); // 是否可以缩放

    this._zoomEnabled = true; // 是否可以拖拽滑动

    this._scrollEnabled = true; // 价格精度

    this._pricePrecision = 6; // 数量精度

    this._volumePrecision = 4;
    this._dateTimeFormat = new Intl.DateTimeFormat('en', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }); // 数据源

    this._dataList = []; // 可见的数据(需要绘制的数据)

    this._visibleDataList = []; // 是否在加载中

    this._loading = true; // 加载更多回调

    this._loadMoreCallback = null; // 还有更多

    this._more = true; // 可见区域数据占用的空间

    this._totalDataSpace = 0; // 每一条数据的空间

    this._dataSpace = 6; // bar的空间

    this._barSpace = this._calcBarSpace(); // 向右偏移的空间

    this._offsetRightSpace = 50; // 向右偏移的数量

    this._offsetRightBarCount = this._offsetRightSpace / this._dataSpace; // 左边最小可见bar的个数

    this._leftMinVisibleBarCount = 2; // 右边最小可见bar的个数

    this._rightMinVisibleBarCount = 2; // 开始绘制的索引

    this._from = 0; // 结束的索引

    this._to = 0; // 十字光标信息

    this._crosshair = {}; // 用来记录开始拖拽时向右偏移的数量

    this._preOffsetRightBarCount = 0; // 拖拽标记图形标记

    this._dragGraphicMarkFlag = false; // 图形标记映射

    this._graphicMarkMapping = createGraphicMarkMapping(); // 图形标记鼠标操作信息

    this._graphicMarkMouseOperate = {
      click: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      hover: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    }; // 绘图标记数据

    this._graphicMarks = []; // 注解标记

    this._annotations = {}; // 可见的注解标记

    this._visibleAnnotations = []; // 注解鼠标操作信息

    this._annotationMouseOperate = {
      id: ''
    }; // 调整pane标记

    this._dragPaneFlag = false; // 内部十字光标代理

    this._crosshairDelegate = new Delegate(); // 事件代理

    this._actionDelegate = {};
  }
  /**
   * 计算一条柱子的空间
   * @returns {number}
   * @private
   */


  _createClass(ChartData, [{
    key: "_calcBarSpace",
    value: function _calcBarSpace() {
      var rateBarSpace = Math.floor(this._dataSpace * 0.8);
      var floorBarSpace = Math.floor(this._dataSpace);
      var optimalBarSpace = Math.min(rateBarSpace, floorBarSpace - 1);
      return Math.max(1, optimalBarSpace);
    }
    /**
     * 内部用来设置一条数据的空间
     * @param dataSpace
     * @returns {boolean}
     * @private
     */

  }, {
    key: "_innerSetDataSpace",
    value: function _innerSetDataSpace(dataSpace) {
      if (!dataSpace || dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE || this._dataSpace === dataSpace) {
        return false;
      }

      this._dataSpace = dataSpace;
      this._barSpace = this._calcBarSpace();
      return true;
    }
    /**
     * 调整可见数据
     * @private
     */

  }, {
    key: "_adjustVisibleDataList",
    value: function _adjustVisibleDataList() {
      // 处理需要绘制的数据
      var dataSize = this._dataList.length;
      var halfBarSpace = this._barSpace / 2;
      this._visibleDataList = [];
      this._visibleAnnotations = [];

      for (var i = this._from; i < this._to; i++) {
        var kLineData = this._dataList[i];
        var deltaFromRight = dataSize + this._offsetRightBarCount - i;
        var x = this._totalDataSpace - (deltaFromRight - 0.5) * this._dataSpace + halfBarSpace;

        this._visibleDataList.push({
          index: i,
          x: x,
          data: kLineData
        });

        var annotation = this._annotations[kLineData.timestamp];

        if (annotation) {
          var _iterator = _createForOfIteratorHelper(annotation),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var an = _step.value;
              an.createSymbolCoordinate(x);

              this._visibleAnnotations.push(an);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }
    /**
     * 调整绘制起点终点位置
     * @private
     */

  }, {
    key: "_adjustFromTo",
    value: function _adjustFromTo() {
      var dataSize = this._dataList.length;
      var barLength = this._totalDataSpace / this._dataSpace;
      var halfBarSpace = this._barSpace / 2;
      var halfBarCount = halfBarSpace / this._dataSpace;
      var maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize) + (1 - halfBarCount);

      if (this._offsetRightBarCount > maxRightOffsetBarCount) {
        this._offsetRightBarCount = maxRightOffsetBarCount;
      }

      var minRightOffsetBarCount = -dataSize + Math.min(this._rightMinVisibleBarCount, dataSize) + halfBarCount;

      if (this._offsetRightBarCount < minRightOffsetBarCount) {
        this._offsetRightBarCount = minRightOffsetBarCount;
      }

      this._to = Math.round(this._offsetRightBarCount + dataSize);
      this._from = Math.floor(this._to - barLength) - 1;

      if (this._to > dataSize) {
        this._to = dataSize;
      }

      if (this._from < 0) {
        this._from = 0;
      }

      this._adjustVisibleDataList(); // 处理加载更多，有更多并且没有在加载则去加载更多


      if (this._from === 0 && this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
        this._loading = true;

        this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'));
      }
    }
    /**
     * 获取样式配置
     * @return {{}}
     */

  }, {
    key: "styleOptions",
    value: function styleOptions() {
      return this._styleOptions;
    }
    /**
     * 设置样式配置
     * @param options
     */

  }, {
    key: "applyStyleOptions",
    value: function applyStyleOptions(options) {
      merge(this._styleOptions, options);
    }
    /**
     * 获取技术指标信息
     * @param name
     * @return {{}|{series: *, calcParams: *, precision: *, name: *}}
     */

  }, {
    key: "technicalIndicatorInfo",
    value: function technicalIndicatorInfo(name) {
      if (isValid(name)) {
        var technical = this.technicalIndicator(name);

        if (technical) {
          return getTechnicalIndicatorInfo(technical);
        }
      } else {
        var technicals = {};

        for (var _name in this._technicalIndicatorMapping) {
          var instance = this._technicalIndicatorMapping[_name];
          technicals[_name] = getTechnicalIndicatorInfo(instance);
        }

        return technicals;
      }

      return {};
    }
    /**
     * 根据指标类型获取指标类
     * @param name
     * @return {*}
     */

  }, {
    key: "technicalIndicator",
    value: function technicalIndicator(name) {
      return this._technicalIndicatorMapping[name];
    }
    /**
     * 价格精度
     * @returns {number}
     */

  }, {
    key: "pricePrecision",
    value: function pricePrecision() {
      return this._pricePrecision;
    }
    /**
     * 数量精度
     * @returns {number}
     */

  }, {
    key: "volumePrecision",
    value: function volumePrecision() {
      return this._volumePrecision;
    }
    /**
     * 获取时间格式化
     * @returns {Intl.DateTimeFormat | Intl.DateTimeFormat}
     */

  }, {
    key: "dateTimeFormat",
    value: function dateTimeFormat() {
      return this._dateTimeFormat;
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      var dateTimeFormat;

      try {
        dateTimeFormat = new Intl.DateTimeFormat('en', {
          hour12: false,
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        {
          console.warn(e.message);
        }
      }

      if (dateTimeFormat) {
        this._dateTimeFormat = dateTimeFormat;
      }
    }
    /**
     * 获取时区
     * @returns {null}
     */

  }, {
    key: "timezone",
    value: function timezone() {
      return this._dateTimeFormat.resolvedOptions().timeZone;
    }
    /**
     * 加载价格和数量精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "applyPriceVolumePrecision",
    value: function applyPriceVolumePrecision(pricePrecision, volumePrecision) {
      this._pricePrecision = pricePrecision;
      this._volumePrecision = volumePrecision;

      for (var name in this._technicalIndicatorMapping) {
        var series = this._technicalIndicatorMapping[name].series;

        switch (series) {
          case TechnicalIndicatorSeries.PRICE:
            {
              this._technicalIndicatorMapping[name].setPrecision(pricePrecision);

              break;
            }

          case TechnicalIndicatorSeries.VOLUME:
            {
              this._technicalIndicatorMapping[name].setPrecision(volumePrecision);

              break;
            }
        }
      }
    }
    /**
     * 加载技术指标精度
     * @param precision
     * @param name
     */

  }, {
    key: "applyTechnicalIndicatorPrecision",
    value: function applyTechnicalIndicatorPrecision(precision, name) {
      var technicalIndicator = this.technicalIndicator(name);

      if (technicalIndicator) {
        technicalIndicator.setPrecision(precision);
      } else {
        for (var _name2 in this._technicalIndicatorMapping) {
          this._technicalIndicatorMapping[_name2].setPrecision(precision);
        }
      }
    }
    /**
     * 获取数据源
     * @returns {[]|*[]}
     */

  }, {
    key: "dataList",
    value: function dataList() {
      return this._dataList;
    }
    /**
     * 获取可见数据源
     * @returns {[]|*[]}
     */

  }, {
    key: "visibleDataList",
    value: function visibleDataList() {
      return this._visibleDataList;
    }
    /**
     * 清空数据源
     */

  }, {
    key: "clearDataList",
    value: function clearDataList() {
      this._more = true;
      this._loading = true;
      this._dataList = [];
      this._visibleDataList = [];
      this._from = 0;
      this._to = 0;
    }
    /**
     * 添加数据
     * @param data
     * @param pos
     * @param more
     */

  }, {
    key: "addData",
    value: function addData(data, pos, more) {
      if (isObject(data)) {
        if (isArray(data)) {
          this._loading = false;
          this._more = isBoolean(more) ? more : true;
          var isFirstAdd = this._dataList.length === 0;
          this._dataList = data.concat(this._dataList);

          if (isFirstAdd) {
            this.setOffsetRightSpace(this._offsetRightSpace);
          } else {
            this._adjustFromTo();
          }
        } else {
          var dataSize = this._dataList.length;

          if (pos >= dataSize) {
            this._dataList.push(data);

            if (this._offsetRightBarCount < 0) {
              this._offsetRightBarCount -= 1;
            }

            this._adjustFromTo();
          } else {
            this._dataList[pos] = data;

            this._adjustVisibleDataList();
          }
        }
      }
    }
    /**
     * 获取一条数据的空间
     * @returns {number}
     */

  }, {
    key: "dataSpace",
    value: function dataSpace() {
      return this._dataSpace;
    }
    /**
     * 获取绘制一条数据的空间（不包括bar之间的间隙）
     * @returns {*}
     */

  }, {
    key: "barSpace",
    value: function barSpace() {
      return this._barSpace;
    }
    /**
     * 设置一条数据的空间
     * @param dataSpace
     */

  }, {
    key: "setDataSpace",
    value: function setDataSpace(dataSpace) {
      if (this._innerSetDataSpace(dataSpace)) {
        this._adjustFromTo();

        this.invalidate();
      }
    }
    /**
     * 设置可见区域数据占用的总空间
     * @param totalSpace
     */

  }, {
    key: "setTotalDataSpace",
    value: function setTotalDataSpace(totalSpace) {
      if (this._totalDataSpace === totalSpace) {
        return;
      }

      this._totalDataSpace = totalSpace;

      this._adjustFromTo();
    }
    /**
     * 设置右边可以偏移的空间
     * @param space
     */

  }, {
    key: "setOffsetRightSpace",
    value: function setOffsetRightSpace(space) {
      this._offsetRightSpace = space;
      this._offsetRightBarCount = space / this._dataSpace;

      this._adjustFromTo();
    }
    /**
     * 设置左边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setLeftMinVisibleBarCount",
    value: function setLeftMinVisibleBarCount(barCount) {
      this._leftMinVisibleBarCount = barCount;
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      this._rightMinVisibleBarCount = barCount;
    }
    /**
     * 获取数据绘制起点
     * @returns {number}
     */

  }, {
    key: "from",
    value: function from() {
      return this._from;
    }
    /**
     * 获取数据绘制终点
     * @returns {number}
     */

  }, {
    key: "to",
    value: function to() {
      return this._to;
    }
    /**
     * 获取十字光标信息
     * @returns {{}}
     */

  }, {
    key: "crosshair",
    value: function crosshair() {
      return this._crosshair;
    }
    /**
     * 设置十字光标点所在的pane的标识
     * @param point
     * @param paneId
     * @param notInvalidate
     */

  }, {
    key: "setCrosshairPointPaneId",
    value: function setCrosshairPointPaneId(point, paneId, notInvalidate) {
      var p = point || {};

      if (this._crosshair.x !== p.x || this._crosshair.y !== p.y || this._crosshair.paneId !== paneId) {
        this._crosshair = _objectSpread2(_objectSpread2({}, point), {}, {
          paneId: paneId
        });

        if (!notInvalidate) {
          this.invalidate(InvalidateLevel.TOOLTIP);
        }
      }
    }
    /**
     * 开始滚动
     */

  }, {
    key: "startScroll",
    value: function startScroll() {
      this._preOffsetRightBarCount = this._offsetRightBarCount;
    }
    /**
     * 滚动
     * @param distance
     */

  }, {
    key: "scroll",
    value: function scroll(distance) {
      if (!this._scrollEnabled) {
        return;
      }

      var distanceBarCount = distance / this._dataSpace;
      this.actionExecute(ActionType.scroll, {
        barCount: distanceBarCount,
        distance: distance
      });
      this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount;

      this._adjustFromTo();

      this.invalidate();
    }
    /**
     * x转换成浮点数的位置
     * @param x
     * @returns {number}
     */

  }, {
    key: "coordinateToFloatIndex",
    value: function coordinateToFloatIndex(x) {
      var dataSize = this._dataList.length;
      var deltaFromRight = (this._totalDataSpace - x) / this._dataSpace;
      var index = dataSize + this._offsetRightBarCount - deltaFromRight;
      return Math.round(index * 1000000) / 1000000;
    }
    /**
     * 数据索引转换成时间戳
     * @param dataIndex
     * @return {*}
     */

  }, {
    key: "dataIndexToTimestamp",
    value: function dataIndexToTimestamp(dataIndex) {
      var data = this._dataList[dataIndex];

      if (data) {
        return data.timestamp;
      }
    }
    /**
     * 将时间戳转换成数据索引位置
     * @param timestamp
     * @return {number}
     */

  }, {
    key: "timestampToDataIndex",
    value: function timestampToDataIndex(timestamp) {
      if (this._dataList.length === 0) {
        return 0;
      }

      return binarySearchNearest(this._dataList, 'timestamp', timestamp);
    }
    /**
     * 数据索引转换成位置
     * @param dataIndex
     */

  }, {
    key: "dataIndexToPosition",
    value: function dataIndexToPosition(dataIndex) {
      var dataSize = this._dataList.length;
      var deltaFromRight = dataSize + this._offsetRightBarCount - dataIndex;
      return this._totalDataSpace - (deltaFromRight - 0.5) * this._dataSpace + this._barSpace / 2;
    }
    /**
     * 位置换成数据索引转
     * @param pixel
     */

  }, {
    key: "positionToDataIndex",
    value: function positionToDataIndex(pixel) {
      return Math.round(this.coordinateToFloatIndex(pixel)) - 1;
    }
    /**
     * 缩放
     * @param scale
     * @param point
     */

  }, {
    key: "zoom",
    value: function zoom(scale, point) {
      if (!this._zoomEnabled) {
        return;
      }

      if (!point || isValid(point.x)) {
        point = {
          x: isValid(this._crosshair.x) ? this._crosshair.x : this._totalDataSpace / 2
        };
      }

      this.actionExecute(ActionType.zoom, {
        point: point,
        scale: scale
      });
      var floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x);
      var dataSpace = this._dataSpace + scale * (this._dataSpace / 10);

      if (this._innerSetDataSpace(dataSpace)) {
        this._offsetRightBarCount += floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x);

        this._adjustFromTo();

        this.invalidate();
      }
    }
    /**
     * 刷新
     * @param invalidateLevel
     */

  }, {
    key: "invalidate",
    value: function invalidate(invalidateLevel) {
      this._invalidateHandler(invalidateLevel);
    }
    /**
     * 设置是否可以缩放
     * @param enabled
     */

  }, {
    key: "setZoomEnabled",
    value: function setZoomEnabled(enabled) {
      this._zoomEnabled = enabled;
    }
    /**
     * 获取是否可以缩放
     * @return {boolean}
     */

  }, {
    key: "zoomEnabled",
    value: function zoomEnabled() {
      return this._zoomEnabled;
    }
    /**
     * 设置是否可以拖拽滚动
     * @param enabled
     */

  }, {
    key: "setScrollEnabled",
    value: function setScrollEnabled(enabled) {
      this._scrollEnabled = enabled;
    }
    /**
     * 获取是否可以拖拽滚动
     * @return {boolean}
     */

  }, {
    key: "scrollEnabled",
    value: function scrollEnabled() {
      return this._scrollEnabled;
    }
    /**
     * 设置加载更多
     * @param callback
     */

  }, {
    key: "loadMore",
    value: function loadMore(callback) {
      this._loadMoreCallback = callback;
    }
    /**
     * 清空图形标记
     */

  }, {
    key: "clearGraphicMark",
    value: function clearGraphicMark() {
      if (this._graphicMarks.length > 0) {
        this._graphicMarks = [];
        this.invalidate(InvalidateLevel.OVERLAY);
      }
    }
    /**
     * 根据id获取图形标记
     * @param id
     * @return {{instance: *, index: number}|null}
     * @private
     */

  }, {
    key: "getGraphicMarkInstanceById",
    value: function getGraphicMarkInstanceById(id) {
      for (var i = 0; i < this._graphicMarks.length; i++) {
        if (this._graphicMarks[i].id() === id) {
          return {
            index: i,
            instance: this._graphicMarks[i]
          };
        }
      }

      return null;
    }
    /**
     * 添加标记实例
     * @param graphicMark
     */

  }, {
    key: "addGraphicMarkInstance",
    value: function addGraphicMarkInstance(graphicMark) {
      var markInfo = this.getGraphicMarkInstanceById(graphicMark.id());

      if (markInfo) {
        return false;
      }

      var lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1];

      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        this._graphicMarks[this._graphicMarks.length - 1] = graphicMark;
      } else {
        this._graphicMarks.push(graphicMark);
      }

      this.invalidate(InvalidateLevel.OVERLAY);
      return true;
    }
    /**
     * 添加自定义标记图形
     * @param graphicMark
     */

  }, {
    key: "addCustomGraphicMark",
    value: function addCustomGraphicMark(graphicMark) {
      var _this = this;

      var marks = [].concat(graphicMark);
      marks.forEach(function (mark) {
        var GraphicMarkClass = createGraphicMarkClass(mark);

        if (GraphicMarkClass) {
          _this._graphicMarkMapping[mark.name] = GraphicMarkClass;
        }
      });
    }
    /**
     * 设置图形标记配置
     * @param id
     * @param options
     */

  }, {
    key: "setGraphicMarkOptions",
    value: function setGraphicMarkOptions(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var styles = options.styles,
          lock = options.lock;
      var markInfo = this.getGraphicMarkInstanceById(id);

      if (markInfo) {
        var graphicMark = markInfo.instance;
        graphicMark.setLock(lock);

        if (graphicMark.setStyles(styles, this._styleOptions.graphicMark)) {
          this.invalidate(InvalidateLevel.OVERLAY);
        }
      }
    }
    /**
     * 获取图形标记信息
     * @param id
     * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
     */

  }, {
    key: "getGraphicMark",
    value: function getGraphicMark(id) {
      if (id) {
        var _iterator2 = _createForOfIteratorHelper(this._graphicMarks),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var graphicMark = _step2.value;

            if (graphicMark.id() === id) {
              return getGraphicMarkInfo(graphicMark);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        return this._graphicMarks.map(function (graphicMark) {
          return getGraphicMarkInfo(graphicMark);
        });
      }

      return null;
    }
    /**
     * 移除图形实例
     * @param options 参数
     */

  }, {
    key: "removeGraphicMarkInstance",
    value: function removeGraphicMarkInstance(options) {
      var graphicMarks = this._graphicMarks;
      var removeIndex = -1;

      if (options.type === RemoveGraphicMarkOperateType.ID) {
        var markInfo = this.getGraphicMarkInstanceById(options.id);

        if (markInfo) {
          removeIndex = markInfo.index;
        }
      } else {
        removeIndex = options.index;
      }

      if (removeIndex !== -1) {
        graphicMarks[removeIndex].onRemove({
          id: graphicMarks[removeIndex].id()
        });
        graphicMarks.splice(removeIndex, 1);
        this.invalidate(InvalidateLevel.OVERLAY);
      }
    }
    /**
     * 获取图形标记拖拽标记
     * @returns {boolean}
     */

  }, {
    key: "dragGraphicMarkFlag",
    value: function dragGraphicMarkFlag() {
      return this._dragGraphicMarkFlag;
    }
    /**
     * 设置图形标记拖拽标记
     * @param flag
     */

  }, {
    key: "setDragGraphicMarkFlag",
    value: function setDragGraphicMarkFlag(flag) {
      this._dragGraphicMarkFlag = flag;
    }
    /**
     * 获取图形标记鼠标操作信息
     * @return {{hover: {id: string, elementIndex: number, element: string}, click: {id: string, elementIndex: number, element: string}}}
     */

  }, {
    key: "graphicMarkMouseOperate",
    value: function graphicMarkMouseOperate() {
      return this._graphicMarkMouseOperate;
    }
    /**
     * 获取拖拽Pane标记
     * @return {boolean}
     */

  }, {
    key: "dragPaneFlag",
    value: function dragPaneFlag() {
      return this._dragPaneFlag;
    }
    /**
     * 设置拖拽Pane标记
     * @param flag
     */

  }, {
    key: "setDragPaneFlag",
    value: function setDragPaneFlag(flag) {
      this._dragPaneFlag = flag;
    }
    /**
     * 获取图形标记映射
     * @returns {{}}
     */

  }, {
    key: "graphicMarkMapping",
    value: function graphicMarkMapping() {
      return this._graphicMarkMapping;
    }
    /**
     * 获取图形标记的数据
     * @returns {{}}
     */

  }, {
    key: "graphicMarks",
    value: function graphicMarks() {
      return this._graphicMarks;
    }
    /**
     * 获取可见的注解
     * @return {[]}
     */

  }, {
    key: "visibleAnnotations",
    value: function visibleAnnotations() {
      return this._visibleAnnotations;
    }
    /**
     * 获取注解鼠标操作信息
     * @return {null}
     */

  }, {
    key: "annotationMouseOperate",
    value: function annotationMouseOperate() {
      return this._annotationMouseOperate;
    }
    /**
     * 创建注解
     * @param annotations
     */

  }, {
    key: "addAnnotations",
    value: function addAnnotations(annotations) {
      var _this2 = this;

      annotations.forEach(function (annotation) {
        if (_this2._annotations[annotation.id()]) {
          _this2._annotations[annotation.id()].push(annotation);
        } else {
          _this2._annotations[annotation.id()] = [annotation];
        }
      });

      this._adjustVisibleDataList();

      this.invalidate(InvalidateLevel.OVERLAY);
    }
    /**
     * 移除注解
     * @param points
     */

  }, {
    key: "removeAnnotation",
    value: function removeAnnotation(points) {
      var _this3 = this;

      var shouldAdjust = false;

      if (points) {
        [].concat(points).forEach(function (_ref) {
          var timestamp = _ref.timestamp;

          if (_this3._annotations[timestamp]) {
            shouldAdjust = true;
            delete _this3._annotations[timestamp];
          }
        });

        if (shouldAdjust) {
          this._adjustVisibleDataList();
        }
      } else {
        shouldAdjust = true;
        this._annotations = {};
        this._visibleAnnotations = [];
      }

      if (shouldAdjust) {
        this.invalidate(InvalidateLevel.OVERLAY);
      }
    }
    /**
     * 设置覆盖物鼠标操作信息
     * @param graphicMarkOperate
     * @param annotationOperate
     */

  }, {
    key: "setOverlayMouseOperate",
    value: function setOverlayMouseOperate(graphicMarkOperate, annotationOperate) {
      var _this$_graphicMarkMou = this._graphicMarkMouseOperate,
          hover = _this$_graphicMarkMou.hover,
          click = _this$_graphicMarkMou.click;
      var id = this._annotationMouseOperate.id;
      var lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1];
      var shouldInvalidate = false;

      if (graphicMarkOperate.hover && (hover.id !== graphicMarkOperate.hover.id || hover.element !== graphicMarkOperate.hover.element || hover.elementIndex !== graphicMarkOperate.hover.elementIndex)) {
        this._graphicMarkMouseOperate.hover = _objectSpread2({}, graphicMarkOperate.hover);
        shouldInvalidate = true;
      }

      if (graphicMarkOperate.click && (click.id !== graphicMarkOperate.click.id || click.element !== graphicMarkOperate.click.element || click.elementIndex !== graphicMarkOperate.click.elementIndex)) {
        this._graphicMarkMouseOperate.click = _objectSpread2({}, graphicMarkOperate.click);
        shouldInvalidate = true;
      }

      if (annotationOperate && id !== annotationOperate.id) {
        this._annotationMouseOperate = _objectSpread2({}, annotationOperate);
        shouldInvalidate = true;
      }

      if (shouldInvalidate || lastGraphicMark && lastGraphicMark.isDrawing()) {
        this.invalidate(InvalidateLevel.OVERLAY);
      }
    }
    /**
     * 添加一个自定义指标
     * @param technicalIndicator
     */

  }, {
    key: "addCustomTechnicalIndicator",
    value: function addCustomTechnicalIndicator(technicalIndicator) {
      var _this4 = this;

      var techs = [].concat(technicalIndicator);
      techs.forEach(function (tech) {
        var technicalIndicatorInstance = createTechnicalIndicatorInstance(tech || {});

        if (technicalIndicatorInstance) {
          // 将生成的新的指标类放入集合
          _this4._technicalIndicatorMapping[technicalIndicatorInstance.name] = technicalIndicatorInstance;
        }
      });
    }
    /**
     * 获取十字光标事件代理
     * @return {Delegate}
     */

  }, {
    key: "crosshairDelegate",
    value: function crosshairDelegate() {
      return this._crosshairDelegate;
    }
    /**
     * 事件执行
     * @param type
     * @param data
     * @param executeBeforeFun
     * @param executeAfterFun
     */

  }, {
    key: "actionExecute",
    value: function actionExecute(type, data, executeBeforeFun, executeAfterFun) {
      if (this.hasAction(type)) {
        executeBeforeFun && executeBeforeFun();

        this._actionDelegate[type].execute(data);

        executeAfterFun && executeAfterFun();
      }
    }
    /**
     * 是否有事件监听
     * @param type
     * @return {boolean}
     */

  }, {
    key: "hasAction",
    value: function hasAction(type) {
      var delegate = this._actionDelegate[type];
      return delegate && delegate.hasObservers();
    }
    /**
     * 订阅事件
     * @param type
     * @param callback
     * @return {boolean}
     */

  }, {
    key: "subscribeAction",
    value: function subscribeAction(type, callback) {
      if (!(type in ActionType)) {
        return false;
      }

      var delegate = this._actionDelegate[type];

      if (!delegate) {
        delegate = new Delegate();
        this._actionDelegate[type] = delegate;
      }

      delegate.subscribe(callback);
      return true;
    }
    /**
     * 取消事件订阅
     * @param type
     * @param callback
     * @return {boolean}
     */

  }, {
    key: "unsubscribeAction",
    value: function unsubscribeAction(type, callback) {
      if (!(type in ActionType)) {
        return false;
      }

      var delegate = this._actionDelegate[type];

      if (delegate) {
        delegate.unsubscribe(callback);

        if (!delegate.hasObservers()) {
          delete this._actionDelegate[type];
        }

        return true;
      }

      return false;
    }
  }]);

  return ChartData;
}();

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 获取屏幕比
 * @param canvas
 * @returns {number}
 */
function getPixelRatio(canvas) {
  return canvas.ownerDocument && canvas.ownerDocument.defaultView && canvas.ownerDocument.defaultView.devicePixelRatio || 2;
}
/**
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */

function calcTextWidth(ctx, text) {
  return Math.round(ctx.measureText(text).width);
}
/**
 * 创建字体
 * @param fontSize
 * @param fontFamily
 * @param fontWeight
 * @returns {string}
 */

function createFont() {
  var fontSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
  var fontWeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  var fontFamily = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Helvetica Neue';
  return "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
}

var Pane = /*#__PURE__*/function () {
  function Pane(props) {
    _classCallCheck(this, Pane);

    this._height = -1;
    this._container = props.container;
    this._chartData = props.chartData;

    this._initBefore(props);

    this._initElement();

    this._mainWidget = this._createMainWidget(this._element, props);
    this._yAxisWidget = this._createYAxisWidget(this._element, props);
  }

  _createClass(Pane, [{
    key: "_initBefore",
    value: function _initBefore(props) {}
  }, {
    key: "_initElement",
    value: function _initElement() {
      this._element = document.createElement('div');
      this._element.style.margin = '0';
      this._element.style.padding = '0';
      this._element.style.position = 'relative';
      this._element.style.overflow = 'hidden';
      this._element.style.width = '100%';
      var lastElement = this._container.lastChild;

      if (lastElement) {
        this._container.insertBefore(this._element, lastElement);
      } else {
        this._container.appendChild(this._element);
      }
    }
    /**
     * 创建主组件
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {}
    /**
     * 创建y轴组件
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createYAxisWidget",
    value: function _createYAxisWidget(container, props) {}
    /**
     * 计算轴
     * @private
     */

  }, {
    key: "computeAxis",
    value: function computeAxis() {}
    /**
     * 获取宽度
     * @returns {number}
     */

  }, {
    key: "width",
    value: function width() {
      return this._element.offsetWidth;
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      this._mainWidget.setWidth(mainWidgetWidth);

      this._yAxisWidget && this._yAxisWidget.setWidth(yAxisWidgetWidth);
    }
    /**
     * 获取高度
     */

  }, {
    key: "height",
    value: function height() {
      return this._height;
    }
    /**
     * 设置临时高度
     * @param height
     */

  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;

      this._mainWidget.setHeight(height);

      this._yAxisWidget && this._yAxisWidget.setHeight(height);
    }
  }, {
    key: "setOffsetLeft",
    value: function setOffsetLeft(mainWidgetOffsetLeft, yAxisWidgetOffsetLeft) {
      this._mainWidget.setOffsetLeft(mainWidgetOffsetLeft);

      this._yAxisWidget && this._yAxisWidget.setOffsetLeft(yAxisWidgetOffsetLeft);
    }
  }, {
    key: "layout",
    value: function layout() {
      if (this._element.offsetHeight !== this._height) {
        this._element.style.height = "".concat(this._height, "px");
      }

      this._mainWidget.layout();

      this._yAxisWidget && this._yAxisWidget.layout();
    }
    /**
     * 刷新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      this._yAxisWidget && this._yAxisWidget.invalidate(level);

      this._mainWidget.invalidate(level);
    }
    /**
     * 将canvas转换成图片
     * @param includeTooltip
     * @param includeGraphicMark
     * @return {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage(includeTooltip, includeGraphicMark) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._element.offsetWidth;
      var height = this._element.offsetHeight;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      var mainWidgetElement = this._mainWidget.getElement();

      var mainWidgetWidth = mainWidgetElement.offsetWidth;
      var mainWidgetHeight = mainWidgetElement.offsetHeight;
      var mainWidgetOffsetLeft = parseInt(mainWidgetElement.style.left, 10);
      ctx.drawImage(this._mainWidget.getImage(includeTooltip, includeGraphicMark), mainWidgetOffsetLeft, 0, mainWidgetWidth, mainWidgetHeight);

      if (this._yAxisWidget) {
        var yAxisWidgetElement = this._yAxisWidget.getElement();

        var yAxisWidgetWidth = yAxisWidgetElement.offsetWidth;
        var yAxisWidgetHeight = yAxisWidgetElement.offsetHeight;
        var yAxisWidgetOffsetLeft = parseInt(yAxisWidgetElement.style.left, 10);
        ctx.drawImage(this._yAxisWidget.getImage(includeTooltip), yAxisWidgetOffsetLeft, 0, yAxisWidgetWidth, yAxisWidgetHeight);
      }

      return canvas;
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._container.removeChild(this._element);
    }
  }]);

  return Pane;
}();

var Widget = /*#__PURE__*/function () {
  function Widget(props) {
    _classCallCheck(this, Widget);

    this._width = 0;
    this._height = 0;

    this._initElement(props.container);

    this._mainView = this._createMainView(this._element, props);
    this._expandView = this._createExpandView(this._element, props);
    this._crosshairView = this._createCrosshairView(this._element, props);
  }
  /**
   * 初始化element
   * @param container
   * @private
   */


  _createClass(Widget, [{
    key: "_initElement",
    value: function _initElement(container) {
      this._element = document.createElement('div');
      this._element.style.top = '0';
      this._element.style.margin = '0';
      this._element.style.padding = '0';
      this._element.style.position = 'absolute';
      this._element.style.overflow = 'hidden';
      container.appendChild(this._element);
    }
    /**
     * 创建主view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createMainView",
    value: function _createMainView(container, props) {}
    /**
     * 创建拓展的view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createExpandView",
    value: function _createExpandView(container, props) {}
    /**
     * 创建浮层view
     * @param container
     * @param props
     * @private
     */

  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {}
  }, {
    key: "getElement",
    value: function getElement() {
      return this._element;
    }
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;

      this._mainView.setWidth(width);

      this._crosshairView.setWidth(width);

      this._expandView && this._expandView.setWidth(width);
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;

      this._mainView.setHeight(height);

      this._crosshairView.setHeight(height);

      this._expandView && this._expandView.setHeight(height);
    }
  }, {
    key: "setOffsetLeft",
    value: function setOffsetLeft(offsetLeft) {
      this._element.style.left = "".concat(offsetLeft, "px");
    }
  }, {
    key: "layout",
    value: function layout() {
      if (this._element.offsetWidth !== this._width) {
        this._element.style.width = "".concat(this._width, "px");
      }

      if (this._element.offsetHeight !== this._height) {
        this._element.style.height = "".concat(this._height, "px");
      }

      this._mainView.layout();

      this._crosshairView.layout();

      this._expandView && this._expandView.layout();
    }
    /**
     * 更新
     * @param level
     */

  }, {
    key: "invalidate",
    value: function invalidate(level) {
      switch (level) {
        case InvalidateLevel.OVERLAY:
          {
            this._expandView && this._expandView.flush();
            break;
          }

        case InvalidateLevel.TOOLTIP:
          {
            this._crosshairView.flush();

            break;
          }

        case InvalidateLevel.MAIN:
        case InvalidateLevel.FULL:
          {
            this._mainView.flush();

            this._crosshairView.flush();

            this._expandView && this._expandView.flush();
            break;
          }
      }
    }
    /**
     * 将widget转换成图片
     * @param includeTooltip
     * @param includeGraphicMark
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage(includeTooltip, includeGraphicMark) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      canvas.style.width = "".concat(this._width, "px");
      canvas.style.height = "".concat(this._height, "px");
      canvas.width = this._width * pixelRatio;
      canvas.height = this._height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.drawImage(this._mainView.getImage(), 0, 0, this._width, this._height);

      if (includeGraphicMark && this._expandView) {
        ctx.drawImage(this._expandView.getImage(), 0, 0, this._width, this._height);
      }

      if (includeTooltip) {
        ctx.drawImage(this._crosshairView.getImage(), 0, 0, this._width, this._height);
      }

      return canvas;
    }
  }]);

  return Widget;
}();

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * requestAnimationFrame兼容
 * @param fn
 */
function requestAnimationFrame(fn) {
  if (!window.requestAnimationFrame) {
    return window.setTimeout(fn, 1000 / 60);
  }

  return window.requestAnimationFrame(fn);
}
/**
 * cancelAnimationFrame兼容
 * @param id
 */

function cancelAnimationFrame(id) {
  if (!window.cancelAnimationFrame) {
    clearTimeout(id);
  }

  window.cancelAnimationFrame(id);
}

var View = /*#__PURE__*/function () {
  function View(container, chartData) {
    _classCallCheck(this, View);

    this._chartData = chartData;

    this._initCanvas(container);
  }
  /**
   * 初始化画布
   * @param container
   * @private
   */


  _createClass(View, [{
    key: "_initCanvas",
    value: function _initCanvas(container) {
      this._canvas = document.createElement('canvas');
      this._canvas.style.position = 'absolute';
      this._canvas.style.top = '0';
      this._canvas.style.left = '0';
      this._canvas.style.zIndex = '2';
      this._ctx = this._canvas.getContext('2d');
      container.appendChild(this._canvas);
    }
    /**
     * 重新绘制
     * @param extendFun
     * @private
     */

  }, {
    key: "_redraw",
    value: function _redraw(extendFun) {
      this._ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight);

      extendFun && extendFun();

      this._draw();
    }
    /**
     * 绘制
     */

  }, {
    key: "_draw",
    value: function _draw() {}
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;
    }
  }, {
    key: "layout",
    value: function layout() {
      var _this = this;

      if (this._height !== this._canvas.offsetHeight || this._width !== this._canvas.offsetWidth) {
        this._redraw(function () {
          var pixelRatio = getPixelRatio(_this._canvas);
          _this._canvas.style.width = "".concat(_this._width, "px");
          _this._canvas.style.height = "".concat(_this._height, "px");
          _this._canvas.width = Math.floor(_this._width * pixelRatio);
          _this._canvas.height = Math.floor(_this._height * pixelRatio);

          _this._ctx.scale(pixelRatio, pixelRatio);
        });
      } else {
        this.flush();
      }
    }
    /**
     * 刷新
     */

  }, {
    key: "flush",
    value: function flush() {
      var _this2 = this;

      if (this.requestAnimationId) {
        cancelAnimationFrame(this.requestAnimationId);
        this.requestAnimationId = null;
      }

      this.requestAnimationId = requestAnimationFrame(function () {
        _this2._redraw();
      });
    }
    /**
     * 获取图片
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage() {
      return this._canvas;
    }
  }]);

  return View;
}();

var TechnicalIndicatorView = /*#__PURE__*/function (_View) {
  _inherits(TechnicalIndicatorView, _View);

  var _super = _createSuper(TechnicalIndicatorView);

  function TechnicalIndicatorView(container, chartData, xAxis, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(TechnicalIndicatorView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGrid();

      this._drawTechnicalIndicators();
    }
    /**
     * 绘制网格
     * @private
     */

  }, {
    key: "_drawGrid",
    value: function _drawGrid() {
      var _this2 = this;

      var gridOptions = this._chartData.styleOptions().grid;

      if (!gridOptions.show) {
        return;
      }

      var gridHorizontalOptions = gridOptions.horizontal;

      this._ctx.save();

      if (gridHorizontalOptions.show) {
        this._ctx.strokeStyle = gridHorizontalOptions.color;
        this._ctx.lineWidth = gridHorizontalOptions.size;

        if (gridHorizontalOptions.style === LineStyle.DASH) {
          this._ctx.setLineDash(gridHorizontalOptions.dashValue);
        } else {
          this._ctx.setLineDash([]);
        }

        this._yAxis.ticks().forEach(function (tick) {
          renderHorizontalLine(_this2._ctx, tick.y, 0, _this2._width);
        });
      }

      var gridVerticalOptions = gridOptions.vertical;

      if (gridVerticalOptions.show) {
        this._ctx.strokeStyle = gridVerticalOptions.color;
        this._ctx.lineWidth = gridVerticalOptions.size;

        if (gridVerticalOptions.style === LineStyle.DASH) {
          this._ctx.setLineDash(gridVerticalOptions.dashValue);
        } else {
          this._ctx.setLineDash([]);
        }

        this._xAxis.ticks().forEach(function (tick) {
          renderVerticalLine(_this2._ctx, tick.x, 0, _this2._height);
        });
      }

      this._ctx.restore();
    }
    /**
     * 绘制指标
     * @private
     */

  }, {
    key: "_drawTechnicalIndicators",
    value: function _drawTechnicalIndicators() {
      var _this3 = this;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      technicalIndicators.forEach(function (technicalIndicator) {
        var plots = technicalIndicator.plots;
        var lines = [];

        var dataList = _this3._chartData.dataList();

        var technicalIndicatorResult = technicalIndicator.result;
        var styles = technicalIndicator.styles || technicalIndicatorOptions; // 技术指标自定义绘制

        if (technicalIndicator.render) {
          _this3._ctx.save();

          technicalIndicator.render(_this3._ctx, {
            from: _this3._chartData.from(),
            to: _this3._chartData.to(),
            kLineDataList: _this3._chartData.dataList(),
            technicalIndicatorDataList: technicalIndicatorResult
          }, {
            width: _this3._width,
            height: _this3._height,
            dataSpace: _this3._chartData.dataSpace(),
            barSpace: _this3._chartData.barSpace()
          }, styles, {
            convertFromPixel: _this3._xAxis.convertFromPixel.bind(_this3._xAxis),
            convertToPixel: _this3._xAxis.convertToPixel.bind(_this3._xAxis)
          }, {
            convertFromPixel: _this3._yAxis.convertFromPixel.bind(_this3._yAxis),
            convertToPixel: _this3._yAxis.convertToPixel.bind(_this3._yAxis)
          }, _this3._yAxis.isCandleYAxis());

          _this3._ctx.restore();
        }

        var baseValue = technicalIndicator.baseValue;

        if (!isValid(baseValue)) {
          baseValue = _this3._yAxis.min();
        }

        var baseValueY = _this3._yAxis.convertToPixel(baseValue);

        var isCandleYAxis = _this3._yAxis.isCandleYAxis();

        _this3._ctx.lineWidth = 1;

        _this3._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
          var technicalIndicatorData = technicalIndicatorResult[i] || {};
          var lineValueIndex = 0;

          if (technicalIndicator.shouldOhlc && !isCandleYAxis) {
            _this3._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, styles.bar, CandleType.OHLC);
          }

          var coordinateY = {};
          plots.forEach(function (plot) {
            var value = technicalIndicatorData[plot.key];

            var valueY = _this3._yAxis.convertToPixel(value);

            coordinateY[plot.key] = valueY;

            switch (plot.type) {
              case TechnicalIndicatorPlotType.CIRCLE:
                {
                  if (isValid(value)) {
                    var cbData = {
                      preData: {
                        kLineData: dataList[i - 1],
                        technicalIndicatorData: technicalIndicatorResult[i - 1]
                      },
                      currentData: {
                        kLineData: kLineData,
                        technicalIndicatorData: technicalIndicatorData
                      },
                      nextData: {
                        kLineData: dataList[i + 1],
                        technicalIndicatorData: technicalIndicatorResult[i + 1]
                      }
                    };
                    var circle = {
                      x: x,
                      y: valueY,
                      radius: halfBarSpace,
                      color: plot.color && plot.color(cbData, styles) || styles.circle.noChangeColor,
                      isStroke: plot.isStroke ? plot.isStroke(cbData) : true
                    };

                    _this3._drawCircle(circle);
                  }

                  break;
                }

              case TechnicalIndicatorPlotType.BAR:
                {
                  if (isValid(value)) {
                    var _cbData = {
                      preData: {
                        kLineData: dataList[i - 1],
                        technicalIndicatorData: technicalIndicatorResult[i - 1]
                      },
                      currentData: {
                        kLineData: kLineData,
                        technicalIndicatorData: technicalIndicatorData
                      },
                      nextData: {
                        kLineData: dataList[i + 1],
                        technicalIndicatorData: technicalIndicatorResult[i + 1]
                      }
                    };
                    var height = Math.abs(baseValueY - valueY);
                    var bar = {
                      x: x - halfBarSpace,
                      width: halfBarSpace * 2,
                      height: Math.max(1, height)
                    };

                    if (valueY > baseValueY) {
                      bar.y = baseValueY;
                    } else {
                      bar.y = height < 1 ? baseValueY - 1 : valueY;
                    }

                    bar.color = plot.color && plot.color(_cbData, styles) || styles.bar.noChangeColor;
                    bar.isStroke = plot.isStroke ? plot.isStroke(_cbData) : false;

                    _this3._drawBar(bar);
                  }

                  break;
                }

              case TechnicalIndicatorPlotType.LINE:
                {
                  var line = null;

                  if (isValid(value)) {
                    line = {
                      x: x,
                      y: valueY
                    };
                  }

                  if (lines[lineValueIndex]) {
                    lines[lineValueIndex].push(line);
                  } else {
                    lines[lineValueIndex] = [line];
                  }

                  lineValueIndex++;
                  break;
                }
            }

            _this3._drawActionExecute(ActionType.drawTechnicalIndicator, {
              ctx: _this3._ctx,
              kLineData: kLineData,
              dataIndex: i,
              technicalIndicatorData: technicalIndicatorData,
              technicalIndicatorName: technicalIndicator.name,
              coordinate: _objectSpread2({
                x: x
              }, coordinateY),
              viewport: {
                width: _this3._width,
                height: _this3._height
              },
              barSpace: barSpace,
              halfBarSpace: halfBarSpace,
              isCandle: isCandleYAxis
            });
          });
        }, function () {
          _this3._drawLines(lines, styles);
        });
      });
    }
    /**
     * 绘制图形
     * @param onDrawing
     * @param onDrawEnd
     * @private
     */

  }, {
    key: "_drawGraphics",
    value: function _drawGraphics(onDrawing, onDrawEnd) {
      var visibleDataList = this._chartData.visibleDataList();

      var barSpace = this._chartData.barSpace();

      var halfBarSpace = barSpace / 2;
      visibleDataList.forEach(function (_ref, n) {
        var x = _ref.x,
            index = _ref.index,
            data = _ref.data;
        onDrawing(x, index, data, halfBarSpace, barSpace, n);
      });
      onDrawEnd && onDrawEnd();
    }
    /**
     * 绘制线
     * @param lines
     * @param technicalIndicatorOptions
     */

  }, {
    key: "_drawLines",
    value: function _drawLines(lines, technicalIndicatorOptions) {
      var _this4 = this;

      var colors = technicalIndicatorOptions.line.colors || [];
      var colorSize = colors.length;
      this._ctx.lineWidth = technicalIndicatorOptions.line.size;
      renderLine(this._ctx, function () {
        lines.forEach(function (lineItem, i) {
          _this4._ctx.strokeStyle = colors[i % colorSize];

          _this4._ctx.beginPath();

          var isStart = true;
          lineItem.forEach(function (line) {
            if (isValid(line)) {
              if (isStart) {
                _this4._ctx.moveTo(line.x, line.y);

                isStart = false;
              } else {
                _this4._ctx.lineTo(line.x, line.y);
              }
            }
          });

          _this4._ctx.stroke();

          _this4._ctx.closePath();
        });
      });
    }
    /**
     * 绘制柱
     */

  }, {
    key: "_drawBar",
    value: function _drawBar(bar) {
      if (bar.isStroke) {
        this._ctx.strokeStyle = bar.color;

        this._ctx.strokeRect(bar.x + 0.5, bar.y, bar.width - 1, bar.height);
      } else {
        this._ctx.fillStyle = bar.color;

        this._ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
      }
    }
    /**
     * 绘制圆点
     * @param circle
     * @private
     */

  }, {
    key: "_drawCircle",
    value: function _drawCircle(circle) {
      this._ctx.strokeStyle = circle.color;
      this._ctx.fillStyle = circle.color;

      this._ctx.beginPath();

      this._ctx.arc(circle.x, circle.y, circle.radius, Math.PI * 2, 0, true);

      if (circle.isStroke) {
        this._ctx.stroke();
      } else {
        this._ctx.fill();
      }

      this._ctx.closePath();
    }
    /**
     * 绘制蜡烛柱
     * @param x
     * @param halfBarSpace
     * @param barSpace
     * @param dataIndex
     * @param kLineData
     * @param barOptions
     * @param barStyle
     * @private
     */

  }, {
    key: "_drawCandleBar",
    value: function _drawCandleBar(x, halfBarSpace, barSpace, dataIndex, kLineData, barOptions, barStyle) {
      var open = kLineData.open,
          close = kLineData.close,
          high = kLineData.high,
          low = kLineData.low;

      if (close > open) {
        this._ctx.strokeStyle = barOptions.upColor;
        this._ctx.fillStyle = barOptions.upColor;
      } else if (close < open) {
        this._ctx.strokeStyle = barOptions.downColor;
        this._ctx.fillStyle = barOptions.downColor;
      } else {
        this._ctx.strokeStyle = barOptions.noChangeColor;
        this._ctx.fillStyle = barOptions.noChangeColor;
      }

      var openY = this._yAxis.convertToPixel(open);

      var closeY = this._yAxis.convertToPixel(close);

      var highY = this._yAxis.convertToPixel(high);

      var lowY = this._yAxis.convertToPixel(low);

      var highEndY = Math.min(openY, closeY);
      var lowStartY = Math.max(openY, closeY);

      this._ctx.fillRect(x - 0.5, highY, 1, highEndY - highY);

      this._ctx.fillRect(x - 0.5, lowStartY, 1, lowY - lowStartY);

      var barHeight = Math.max(1, lowStartY - highEndY);

      switch (barStyle) {
        case CandleType.CANDLE_SOLID:
          {
            this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);

            break;
          }

        case CandleType.CANDLE_STROKE:
          {
            this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);

            break;
          }

        case CandleType.CANDLE_UP_STROKE:
          {
            if (close > open) {
              this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);
            } else {
              this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);
            }

            break;
          }

        case CandleType.CANDLE_DOWN_STROKE:
          {
            if (close > open) {
              this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight);
            } else {
              this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight);
            }

            break;
          }

        default:
          {
            this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY);

            this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1);

            this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1);

            break;
          }
      }

      this._drawActionExecute(ActionType.drawCandle, {
        ctx: this._ctx,
        dataIndex: dataIndex,
        kLineData: kLineData,
        coordinate: {
          x: x,
          open: openY,
          close: closeY,
          high: highY,
          low: lowY
        },
        viewport: {
          width: this._width,
          height: this._height
        },
        barSpace: barSpace,
        halfBarSpace: halfBarSpace,
        isCandle: this._yAxis.isCandleYAxis()
      });
    }
    /**
     * 执行绘制事件监听
     * @param type
     * @param data
     * @private
     */

  }, {
    key: "_drawActionExecute",
    value: function _drawActionExecute(type, data) {
      var _this5 = this;

      this._chartData.actionExecute(type, data, function () {
        _this5._ctx.save();
      }, function () {
        _this5._ctx.restore();
      });
    }
  }]);

  return TechnicalIndicatorView;
}(View);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 绘制文字
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param text
 */
function renderText(ctx, color, x, y, text) {
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

var TechnicalIndicatorCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(TechnicalIndicatorCrosshairView, _View);

  var _super = _createSuper(TechnicalIndicatorCrosshairView);

  function TechnicalIndicatorCrosshairView(container, chartData, xAxis, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(TechnicalIndicatorCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      var crosshair = this._chartData.crosshair();

      var dataList = this._chartData.dataList();

      var realDataIndex;
      var dataIndex;

      if (isValid(crosshair.x)) {
        realDataIndex = this._xAxis.convertFromPixel(crosshair.x);

        if (realDataIndex < 0) {
          dataIndex = 0;
        } else if (realDataIndex > dataList.length - 1) {
          dataIndex = dataList.length - 1;
        } else {
          dataIndex = realDataIndex;
        }
      } else {
        realDataIndex = dataList.length - 1;
        dataIndex = realDataIndex;
      }

      var kLineData = dataList[dataIndex];

      if (kLineData) {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var styleOptions = this._chartData.styleOptions();

        var crosshairOptions = styleOptions.crosshair;

        var realX = this._xAxis.convertToPixel(realDataIndex);

        if (crosshair.paneId === this._additionalDataProvider.id()) {
          // 绘制十字光标水平线
          this._drawCrosshairLine(crosshairOptions, 'horizontal', crosshair.y, 0, this._width, renderHorizontalLine);
        }

        if (crosshair.paneId) {
          // 绘制十字光标垂直线
          this._drawCrosshairLine(crosshairOptions, 'vertical', realX, 0, this._height, renderVerticalLine);
        }

        this._drawTooltip(crosshair, kLineData, dataIndex, realX, technicalIndicators);
      }
    }
    /**
     * 绘制图例
     * @param crosshair
     * @param kLineData
     * @param dataIndex
     * @param realX
     * @param technicalIndicators
     * @private
     */

  }, {
    key: "_drawTooltip",
    value: function _drawTooltip(crosshair, kLineData, dataIndex, realX, technicalIndicators) {
      this._drawBatchTechnicalIndicatorToolTip(crosshair, dataIndex, technicalIndicators);
    }
    /**
     * 绘制十字光标线
     * @param crosshairOptions
     * @param optionsKey
     * @param fixedCoordinate
     * @param startCoordinate
     * @param endCoordinate
     * @param drawLine
     * @private
     */

  }, {
    key: "_drawCrosshairLine",
    value: function _drawCrosshairLine(crosshairOptions, optionsKey, fixedCoordinate, startCoordinate, endCoordinate, drawLine) {
      var crosshairDirectionOptions = crosshairOptions[optionsKey];
      var crosshairLineOptions = crosshairDirectionOptions.line;

      if (!crosshairOptions.show || !crosshairDirectionOptions.show || !crosshairLineOptions.show) {
        return;
      }

      this._ctx.save();

      this._ctx.lineWidth = crosshairLineOptions.size;
      this._ctx.strokeStyle = crosshairLineOptions.color;

      if (crosshairLineOptions.style === LineStyle.DASH) {
        this._ctx.setLineDash(crosshairLineOptions.dashValue);
      }

      drawLine(this._ctx, fixedCoordinate, startCoordinate, endCoordinate);

      this._ctx.restore();
    }
    /**
     * 批量绘制技术指标提示
     * @param crosshair
     * @param dataIndex
     * @param technicalIndicators
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawBatchTechnicalIndicatorToolTip",
    value: function _drawBatchTechnicalIndicatorToolTip(crosshair, dataIndex, technicalIndicators) {
      var _this2 = this;

      var offsetTop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;
      var top = offsetTop;
      technicalIndicators.forEach(function (technicalIndicator) {
        _this2._drawTechnicalIndicatorTooltip(crosshair, dataIndex, technicalIndicator, technicalIndicatorOptions, top);

        top += technicalIndicatorTooltipOptions.text.marginTop + technicalIndicatorTooltipOptions.text.size + technicalIndicatorTooltipOptions.text.marginBottom;
      });
    }
    /**
     * 绘制指标图例
     * @param crosshair
     * @param dataIndex
     * @param technicalIndicator
     * @param technicalIndicatorOptions
     * @param offsetTop
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorTooltip",
    value: function _drawTechnicalIndicatorTooltip(crosshair, dataIndex, technicalIndicator, technicalIndicatorOptions) {
      var _this3 = this;

      var offsetTop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;

      if (this._shouldDrawTooltip(crosshair, technicalIndicatorTooltipOptions)) {
        var styles = technicalIndicator.styles || technicalIndicatorOptions;
        var technicalIndicatorResult = technicalIndicator.result;
        var technicalIndicatorData = technicalIndicatorResult[dataIndex];
        var tooltipData = getTechnicalIndicatorTooltipData(technicalIndicatorData, technicalIndicator);
        var colors = styles.line.colors;

        var dataList = this._chartData.dataList();

        var cbData = {
          preData: {
            kLineData: dataList[dataIndex - 1],
            technicalIndicatorData: technicalIndicatorResult[dataIndex - 1]
          },
          currentData: {
            kLineData: dataList[dataIndex],
            technicalIndicatorData: technicalIndicatorData
          },
          nextData: {
            kLineData: dataList[dataIndex + 1],
            technicalIndicatorData: technicalIndicatorResult[dataIndex + 1]
          }
        };
        var plots = technicalIndicator.plots;
        var technicalIndicatorTooltipTextOptions = technicalIndicatorTooltipOptions.text;
        var values = tooltipData.values;
        var textMarginLeft = technicalIndicatorTooltipTextOptions.marginLeft;
        var textMarginRight = technicalIndicatorTooltipTextOptions.marginRight;
        var labelX = 0;
        var labelY = technicalIndicatorTooltipTextOptions.marginTop + offsetTop;
        var textSize = technicalIndicatorTooltipTextOptions.size;
        var textColor = technicalIndicatorTooltipTextOptions.color;
        var colorSize = colors.length;
        this._ctx.textBaseline = 'top';
        this._ctx.font = createFont(textSize, technicalIndicatorTooltipTextOptions.weight, technicalIndicatorTooltipTextOptions.family);

        if (technicalIndicatorTooltipOptions.showName) {
          var nameText = tooltipData.name;
          var nameTextWidth = calcTextWidth(this._ctx, nameText);
          labelX += textMarginLeft;
          renderText(this._ctx, textColor, labelX, labelY, nameText);
          labelX += nameTextWidth;

          if (!technicalIndicatorTooltipOptions.showParams) {
            labelX += textMarginRight;
          }
        }

        if (technicalIndicatorTooltipOptions.showParams) {
          var calcParamText = tooltipData.calcParamText;
          var calcParamTextWidth = calcTextWidth(this._ctx, calcParamText);

          if (!technicalIndicatorTooltipOptions.showName) {
            labelX += textMarginLeft;
          }

          renderText(this._ctx, textColor, labelX, labelY, calcParamText);
          labelX += calcParamTextWidth + textMarginRight;
        }

        var lineCount = 0;
        var valueColor;
        plots.forEach(function (plot, i) {
          switch (plot.type) {
            case TechnicalIndicatorPlotType.CIRCLE:
              {
                valueColor = plot.color && plot.color(cbData, styles) || styles.circle.noChangeColor;
                break;
              }

            case TechnicalIndicatorPlotType.BAR:
              {
                valueColor = plot.color && plot.color(cbData, styles) || styles.bar.noChangeColor;
                break;
              }

            case TechnicalIndicatorPlotType.LINE:
              {
                valueColor = colors[lineCount % colorSize] || textColor;
                lineCount++;
                break;
              }
          }

          var title = values[i].title;

          if (isValid(title)) {
            labelX += textMarginLeft;
            var text = "".concat(title).concat(values[i].value || technicalIndicatorTooltipOptions.defaultValue);
            var textWidth = calcTextWidth(_this3._ctx, text);
            renderText(_this3._ctx, valueColor, labelX, labelY, text);
            labelX += textWidth + textMarginRight;
          }
        });
      }
    }
    /**
     * 是否需要绘制图例
     * @param crosshair
     * @param tooltipOptions
     * @return {boolean|boolean|*}
     * @private
     */

  }, {
    key: "_shouldDrawTooltip",
    value: function _shouldDrawTooltip(crosshair, tooltipOptions) {
      var showRule = tooltipOptions.showRule;
      return showRule === TooltipShowRule.ALWAYS || showRule === TooltipShowRule.FOLLOW_CROSS && !!crosshair.paneId;
    }
  }]);

  return TechnicalIndicatorCrosshairView;
}(View);

var TechnicalIndicatorWidget = /*#__PURE__*/function (_Widget) {
  _inherits(TechnicalIndicatorWidget, _Widget);

  var _super = _createSuper(TechnicalIndicatorWidget);

  function TechnicalIndicatorWidget() {
    _classCallCheck(this, TechnicalIndicatorWidget);

    return _super.apply(this, arguments);
  }

  _createClass(TechnicalIndicatorWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new TechnicalIndicatorView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new TechnicalIndicatorCrosshairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return TechnicalIndicatorWidget;
}(Widget);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 绘制带边框并填充的矩形
 * @param ctx
 * @param fillColor
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */
function renderStrokeFillRect(ctx, fillColor, borderColor, borderSize, x, y, width, height) {
  renderFillRect(ctx, fillColor, x, y, width, height);
  renderStrokeRect(ctx, borderColor, borderSize, x, y, width, height);
}
/**
 * 绘制空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param width
 * @param height
 */

function renderStrokeRect(ctx, borderColor, borderSize, x, y, width, height) {
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(x, y, width, height);
}
/**
 * 绘制填充的矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param width
 * @param height
 */

function renderFillRect(ctx, color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
/**
 * 绘制圆角空心矩形
 * @param ctx
 * @param borderColor
 * @param borderSize
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderStrokeRoundRect(ctx, borderColor, borderSize, x, y, w, h, r) {
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = borderColor;
  renderRoundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}
/**
 * 绘制填充圆角矩形
 * @param ctx
 * @param color
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderFillRoundRect(ctx, color, x, y, w, h, r) {
  ctx.fillStyle = color;
  renderRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
}
/**
 * 绘制圆角矩形
 * @param ctx
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */

function renderRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

var YAxisView = /*#__PURE__*/function (_View) {
  _inherits(YAxisView, _View);

  var _super = _createSuper(YAxisView);

  function YAxisView(container, chartData, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxisView);

    _this = _super.call(this, container, chartData);
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxisView, [{
    key: "_draw",
    value: function _draw() {
      var yAxisOptions = this._chartData.styleOptions().yAxis;

      if (yAxisOptions.show) {
        this._drawAxisLine(yAxisOptions);

        this._drawTickLines(yAxisOptions);

        this._drawTickLabels(yAxisOptions);

        this._drawTechnicalIndicatorLastValue(yAxisOptions);

        this._drawLastPriceLabel(yAxisOptions);
      }
    }
  }, {
    key: "_drawAxisLine",
    value: function _drawAxisLine(yAxisOptions) {
      var axisLine = yAxisOptions.axisLine;

      if (!axisLine.show) {
        return;
      }

      this._ctx.strokeStyle = axisLine.color;
      this._ctx.lineWidth = axisLine.size;
      var x;

      if (this._isDrawFromStart(yAxisOptions)) {
        x = 0;
      } else {
        x = this._width - 1;
      }

      renderVerticalLine(this._ctx, x, 0, this._height);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(yAxisOptions) {
      var _this2 = this;

      var tickLine = yAxisOptions.tickLine;

      if (!tickLine.show) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var tickLineLength = tickLine.length;
      var startX;
      var endX;

      if (this._isDrawFromStart(yAxisOptions)) {
        startX = 0;

        if (yAxisOptions.axisLine.show) {
          startX += yAxisOptions.axisLine.size;
        }

        endX = startX + tickLineLength;
      } else {
        startX = this._width;

        if (yAxisOptions.axisLine.show) {
          startX -= yAxisOptions.axisLine.size;
        }

        endX = startX - tickLineLength;
      }

      this._yAxis.ticks().forEach(function (tick) {
        renderHorizontalLine(_this2._ctx, tick.y, startX, endX);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(yAxisOptions) {
      var _this3 = this;

      var tickText = yAxisOptions.tickText;

      if (!tickText.show) {
        return;
      }

      var tickLine = yAxisOptions.tickLine;
      var tickLineShow = tickLine.show;
      var tickLineLength = tickLine.length;
      var labelX;

      if (this._isDrawFromStart(yAxisOptions)) {
        labelX = tickText.paddingLeft;

        if (yAxisOptions.axisLine.show) {
          labelX += yAxisOptions.axisLine.size;
        }

        if (tickLineShow) {
          labelX += tickLineLength;
        }

        this._ctx.textAlign = 'left';
      } else {
        labelX = this._width - tickText.paddingRight;

        if (yAxisOptions.axisLine.show) {
          labelX -= yAxisOptions.axisLine.size;
        }

        if (tickLineShow) {
          labelX -= tickLineLength;
        }

        this._ctx.textAlign = 'right';
      }

      this._ctx.textBaseline = 'middle';
      this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family);
      this._ctx.fillStyle = tickText.color;

      this._yAxis.ticks().forEach(function (tick) {
        _this3._ctx.fillText(tick.v, labelX, tick.y);
      });

      this._ctx.textAlign = 'left';
    }
    /**
     * 绘制技术指标最后值
     * @param yAxisOptions
     * @private
     */

  }, {
    key: "_drawTechnicalIndicatorLastValue",
    value: function _drawTechnicalIndicatorLastValue(yAxisOptions) {
      var _this4 = this;

      var technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

      var lastValueMarkOptions = technicalIndicatorOptions.lastValueMark;

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      if (!lastValueMarkOptions.show || !lastValueMarkOptions.text.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      technicalIndicators.forEach(function (technicalIndicator) {
        var technicalIndicatorResult = technicalIndicator.result || [];
        var dataSize = technicalIndicatorResult.length;
        var technicalIndicatorData = technicalIndicatorResult[dataSize - 1] || {};
        var plots = technicalIndicator.plots;
        var cbData = {
          preData: {
            kLineData: dataList[dataSize - 2],
            technicalIndicatorData: technicalIndicatorResult[dataSize - 2]
          },
          currentData: {
            kLineData: dataList[dataSize - 1],
            technicalIndicatorData: technicalIndicatorData
          },
          nextData: {
            kLineData: null,
            technicalIndicatorData: null
          }
        };
        var precision = technicalIndicator.precision;
        var styles = technicalIndicator.styles || technicalIndicatorOptions;
        var colors = styles.line.colors || [];
        var colorSize = colors.length;
        var lineCount = 0;
        plots.forEach(function (plot) {
          var value = technicalIndicatorData[plot.key];
          var backgroundColor;

          switch (plot.type) {
            case TechnicalIndicatorPlotType.CIRCLE:
              {
                backgroundColor = plot.color && plot.color(cbData, styles) || styles.circle.noChangeColor;
                break;
              }

            case TechnicalIndicatorPlotType.BAR:
              {
                backgroundColor = plot.color && plot.color(cbData, styles) || styles.bar.noChangeColor;
                break;
              }

            case TechnicalIndicatorPlotType.LINE:
              {
                backgroundColor = colors[lineCount % colorSize];
                lineCount++;
                break;
              }
          }

          if (isValid(value)) {
            _this4._drawMarkLabel(yAxisOptions, value, precision, technicalIndicator.shouldFormatBigNumber, _objectSpread2(_objectSpread2({}, lastValueMarkOptions.text), {}, {
              backgroundColor: backgroundColor
            }));
          }
        });
      });
    }
    /**
     * 绘制最新价文字
     * @private
     */

  }, {
    key: "_drawLastPriceLabel",
    value: function _drawLastPriceLabel(yAxisOptions) {
      if (!this._yAxis.isCandleYAxis()) {
        return;
      }

      var priceMarkOptions = this._chartData.styleOptions().candle.priceMark;

      var lastPriceMarkOptions = priceMarkOptions.last;

      if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.text.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var kLineData = dataList[dataList.length - 1];

      if (!kLineData) {
        return;
      }

      var close = kLineData.close;
      var open = kLineData.open;
      var backgroundColor;

      if (close > open) {
        backgroundColor = lastPriceMarkOptions.upColor;
      } else if (close < open) {
        backgroundColor = lastPriceMarkOptions.downColor;
      } else {
        backgroundColor = lastPriceMarkOptions.noChangeColor;
      }

      this._drawMarkLabel(yAxisOptions, close, this._chartData.pricePrecision(), false, _objectSpread2(_objectSpread2({}, lastPriceMarkOptions.text), {}, {
        backgroundColor: backgroundColor
      }));
    }
    /**
     * 绘制标记label
     * @param yAxisOptions
     * @param value
     * @param precision
     * @param shouldFormatBigNumber
     * @param size
     * @param weight
     * @param family
     * @param color
     * @param backgroundColor
     * @param paddingLeft
     * @param paddingTop
     * @param paddingRight
     * @param paddingBottom
     * @private
     */

  }, {
    key: "_drawMarkLabel",
    value: function _drawMarkLabel(yAxisOptions, value, precision, shouldFormatBigNumber, _ref) {
      var size = _ref.size,
          weight = _ref.weight,
          family = _ref.family,
          color = _ref.color,
          backgroundColor = _ref.backgroundColor,
          paddingLeft = _ref.paddingLeft,
          paddingTop = _ref.paddingTop,
          paddingRight = _ref.paddingRight,
          paddingBottom = _ref.paddingBottom;

      var valueY = this._yAxis.convertToPixel(value);

      valueY = +Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98)).toFixed(0);
      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromData = (this._chartData.visibleDataList()[0] || {}).data;
        var fromClose = fromData.close;
        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        text = formatPrecision(value, precision);

        if (shouldFormatBigNumber) {
          text = formatBigNumber(text);
        }
      }

      this._ctx.font = createFont(size, weight, family);
      var rectWidth = calcTextWidth(this._ctx, text) + paddingLeft + paddingRight;
      var rectHeight = paddingTop + size + paddingBottom;
      var rectStartX;

      if (this._isDrawFromStart(yAxisOptions)) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      renderFillRect(this._ctx, backgroundColor, rectStartX, valueY - paddingTop - size / 2, rectWidth, rectHeight);
      this._ctx.textBaseline = 'middle';
      renderText(this._ctx, color, rectStartX + paddingLeft, valueY, text);
    }
    /**
     * 判断是否从开始点绘制
     * @private
     */

  }, {
    key: "_isDrawFromStart",
    value: function _isDrawFromStart(yAxisOptions) {
      return yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside || yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside;
    }
  }]);

  return YAxisView;
}(View);

var YAxisCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(YAxisCrosshairView, _View);

  var _super = _createSuper(YAxisCrosshairView);

  function YAxisCrosshairView(container, chartData, yAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxisCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._yAxis = yAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxisCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrossHairLabel();
    }
  }, {
    key: "_drawCrossHairLabel",
    value: function _drawCrossHairLabel() {
      var crosshair = this._chartData.crosshair();

      if (crosshair.paneId !== this._additionalDataProvider.id() || this._chartData.dataList().length === 0) {
        return;
      }

      var styleOptions = this._chartData.styleOptions();

      var crosshairOptions = styleOptions.crosshair;
      var crosshairHorizontalOptions = crosshairOptions.horizontal;
      var crosshairHorizontalTextOptions = crosshairHorizontalOptions.text;

      if (!crosshairOptions.show || !crosshairHorizontalOptions.show || !crosshairHorizontalTextOptions.show) {
        return;
      }

      var value = this._yAxis.convertFromPixel(crosshair.y);

      var text;

      if (this._yAxis.isPercentageYAxis()) {
        var fromClose = this._chartData.visibleDataList()[0].data.close;

        text = "".concat(((value - fromClose) / fromClose * 100).toFixed(2), "%");
      } else {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var precision = 0;
        var shouldFormatBigNumber = false;

        if (this._yAxis.isCandleYAxis()) {
          precision = this._chartData.pricePrecision();
        } else {
          technicalIndicators.forEach(function (technicalIndicator) {
            precision = Math.max(technicalIndicator.precision, precision);

            if (!shouldFormatBigNumber) {
              shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
            }
          });
        }

        text = formatPrecision(value, precision);

        if (shouldFormatBigNumber) {
          text = formatBigNumber(text);
        }
      }

      var textSize = crosshairHorizontalTextOptions.size;
      this._ctx.font = createFont(textSize, crosshairHorizontalTextOptions.weight, crosshairHorizontalTextOptions.family);
      var yAxisDataLabelWidth = calcTextWidth(this._ctx, text);
      var rectStartX;
      var paddingLeft = crosshairHorizontalTextOptions.paddingLeft;
      var paddingRight = crosshairHorizontalTextOptions.paddingRight;
      var paddingTop = crosshairHorizontalTextOptions.paddingTop;
      var paddingBottom = crosshairHorizontalTextOptions.paddingBottom;
      var borderSize = crosshairHorizontalTextOptions.borderSize;
      var rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;
      var yAxisOptions = styleOptions.yAxis;

      if (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside || yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside) {
        rectStartX = 0;
      } else {
        rectStartX = this._width - rectWidth;
      }

      var rectY = crosshair.y - borderSize - paddingTop - textSize / 2; // 绘制y轴文字外的边框

      renderStrokeFillRect(this._ctx, crosshairHorizontalTextOptions.backgroundColor, crosshairHorizontalTextOptions.borderColor, borderSize, rectStartX, rectY, rectWidth, rectHeight);
      this._ctx.textBaseline = 'middle';
      renderText(this._ctx, crosshairHorizontalTextOptions.color, rectStartX + borderSize + paddingLeft, crosshair.y, text);
    }
  }]);

  return YAxisCrosshairView;
}(View);

var YAxisWidget = /*#__PURE__*/function (_Widget) {
  _inherits(YAxisWidget, _Widget);

  var _super = _createSuper(YAxisWidget);

  function YAxisWidget() {
    _classCallCheck(this, YAxisWidget);

    return _super.apply(this, arguments);
  }

  _createClass(YAxisWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new YAxisView(container, props.chartData, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new YAxisCrosshairView(container, props.chartData, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return YAxisWidget;
}(Widget);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Axis = /*#__PURE__*/function () {
  function Axis(chartData) {
    _classCallCheck(this, Axis);

    this._chartData = chartData;
    this._width = 0;
    this._height = 0;
    this._cacheMinValue = 0;
    this._cacheMaxValue = 0;
    this._minValue = 0;
    this._maxValue = 0;
    this._range = 0;
    this._ticks = [];

    this._initMeasureCanvas();
  }

  _createClass(Axis, [{
    key: "_initMeasureCanvas",
    value: function _initMeasureCanvas() {
      var measureCanvas = document.createElement('canvas');
      var pixelRatio = getPixelRatio(measureCanvas);
      this._measureCtx = measureCanvas.getContext('2d');

      this._measureCtx.scale(pixelRatio, pixelRatio);
    }
  }, {
    key: "min",
    value: function min() {
      return this._minValue;
    }
  }, {
    key: "max",
    value: function max() {
      return this._maxValue;
    }
  }, {
    key: "width",
    value: function width() {
      return this._width;
    }
  }, {
    key: "height",
    value: function height() {
      return this._height;
    }
  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this._width = width;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      this._height = height;
    }
    /**
     * 获取ticks
     * @returns {[]|*[]}
     */

  }, {
    key: "ticks",
    value: function ticks() {
      return this._ticks;
    }
    /**
     * 计算轴
     */

  }, {
    key: "computeAxis",
    value: function computeAxis(forceCompute) {
      var _this$_computeMinMaxV = this._computeMinMaxValue(),
          min = _this$_computeMinMaxV.min,
          max = _this$_computeMinMaxV.max,
          range = _this$_computeMinMaxV.range;

      this._minValue = min;
      this._maxValue = max;

      if (this._cacheMinValue !== min || this._cacheMaxValue !== max || forceCompute) {
        this._cacheMinValue = min;
        this._cacheMaxValue = max;
        this._range = range;
        this._ticks = this._computeOptimalTicks(this._computeTicks());
        return true;
      }

      return false;
    }
    /**
     * 计算最大最小值
     */

  }, {
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {}
    /**
     * 计算最佳的tick
     * @param ticks
     */

  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {}
    /**
     * 计算轴上的tick值
     */

  }, {
    key: "_computeTicks",
    value: function _computeTicks() {
      var ticks = [];

      if (this._range >= 0) {
        var interval = this._nice(this._range / 8.0);

        var precision = this._getIntervalPrecision(interval);

        var first = this._round(Math.ceil(this._minValue / interval) * interval, precision);

        var last = this._round(Math.floor(this._maxValue / interval) * interval, precision);

        var n = 0;
        var f = first;

        if (interval !== 0) {
          while (f <= last) {
            ticks[n] = {
              v: f.toFixed(precision)
            };
            ++n;
            f += interval;
          }
        }
      }

      return ticks;
    }
  }, {
    key: "_nice",
    value: function _nice(value) {
      var exponent = Math.floor(Math.log(value) / Math.LN10);
      var exp10 = Math.pow(10.0, exponent);
      var f = value / exp10; // 1 <= f < 10

      var nf = 0;

      if (f < 1.5) {
        nf = 1;
      } else if (f < 2.5) {
        nf = 2;
      } else if (f < 3.5) {
        nf = 3;
      } else if (f < 4.5) {
        nf = 4;
      } else if (f < 5.5) {
        nf = 5;
      } else if (f < 6.5) {
        nf = 6;
      } else {
        nf = 8;
      }

      value = nf * exp10;
      return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value;
    }
  }, {
    key: "_getIntervalPrecision",
    value: function _getIntervalPrecision(value) {
      var str = value.toString(); // Consider scientific notation: '3.4e-12' '3.4e+12'

      var eIndex = str.indexOf('e');

      if (eIndex > 0) {
        var precision = +str.slice(eIndex + 1);
        return precision < 0 ? -precision : 0;
      } else {
        var dotIndex = str.indexOf('.');
        return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
      }
    }
  }, {
    key: "_round",
    value: function _round(x, precision) {
      if (precision == null) {
        precision = 10;
      }

      precision = Math.min(Math.max(0, precision), 20);
      x = (+x).toFixed(precision);
      return +x;
    }
  }]);

  return Axis;
}();

var YAxis = /*#__PURE__*/function (_Axis) {
  _inherits(YAxis, _Axis);

  var _super = _createSuper(YAxis);

  function YAxis(chartData, isCandleYAxis, additionalDataProvider) {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _super.call(this, chartData);
    _this._isCandleYAxis = isCandleYAxis;
    _this._additionalDataProvider = additionalDataProvider;
    return _this;
  }

  _createClass(YAxis, [{
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {
      var min = this._minValue;
      var max = this._maxValue;
      var range = Math.abs(max - min);
      var marginOptions;

      if (this._isCandleYAxis) {
        marginOptions = this._chartData.styleOptions().candle.margin;
      } else {
        marginOptions = this._chartData.styleOptions().technicalIndicator.margin;
      }

      var topRate;
      var bottomRate;

      if (marginOptions.top > 1) {
        topRate = marginOptions.top / this._height;
      } else {
        topRate = isNumber(marginOptions.top) ? marginOptions.top : 0.2;
      }

      if (marginOptions.bottom > 1) {
        bottomRate = marginOptions.bottom / this._height;
      } else {
        bottomRate = isNumber(marginOptions.bottom) ? marginOptions.bottom : 0.1;
      } // 保证每次图形绘制上下都留间隙


      min = min - range * bottomRate;
      max = max + range * topRate;
      range = Math.abs(max - min);
      return {
        min: min,
        max: max,
        range: range
      };
    }
  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {
      var optimalTicks = [];
      var tickLength = ticks.length;

      if (tickLength > 0) {
        var textHeight = this._chartData.styleOptions().xAxis.tickText.size;

        var y = this._innerConvertToPixel(+ticks[0].v);

        var tickCountDif = 1;

        if (tickLength > 1) {
          var nextY = this._innerConvertToPixel(+ticks[1].v);

          var yDif = Math.abs(nextY - y);

          if (yDif < textHeight * 2) {
            tickCountDif = Math.ceil(textHeight * 2 / yDif);
          }
        }

        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var precision = 0;
        var shouldFormatBigNumber = false;

        if (this._isCandleYAxis) {
          precision = this._chartData.pricePrecision();
        } else {
          technicalIndicators.forEach(function (technicalIndicator) {
            precision = Math.max(precision, technicalIndicator.precision);

            if (!shouldFormatBigNumber) {
              shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
            }
          });
        }

        var isPercentageAxis = this.isPercentageYAxis();

        for (var i = 0; i < tickLength; i += tickCountDif) {
          var v = ticks[i].v;
          v = +v === 0 ? '0' : v;

          var _y = this._innerConvertToPixel(+v);

          var value = '';

          if (isPercentageAxis) {
            value = "".concat(formatPrecision(v, 2), "%");
          } else {
            value = formatPrecision(v, precision);

            if (shouldFormatBigNumber) {
              value = formatBigNumber(value);
            }
          }

          if (_y > textHeight && _y < this._height - textHeight) {
            optimalTicks.push({
              v: value,
              y: _y
            });
          }
        }
      }

      return optimalTicks;
    }
    /**
     * 计算最大最小值
     */

  }, {
    key: "calcMinMaxValue",
    value: function calcMinMaxValue() {
      var _this2 = this;

      var technicalIndicators = this._additionalDataProvider.technicalIndicators();

      var minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      var plotsResult = [];
      var shouldOhlc = false;
      var minValue = Number.MAX_SAFE_INTEGER;
      var maxValue = Number.MIN_SAFE_INTEGER;
      var technicalIndicatorPrecision = Number.MIN_SAFE_INTEGER;
      technicalIndicators.forEach(function (technicalIndicator) {
        if (!shouldOhlc) {
          shouldOhlc = technicalIndicator.should;
        }

        technicalIndicatorPrecision = Math.max(technicalIndicatorPrecision, technicalIndicator.precision);

        if (isValid(technicalIndicator.minValue) && isNumber(technicalIndicator.minValue)) {
          minValue = Math.min(minValue, technicalIndicator.minValue);
        }

        if (isValid(technicalIndicator.maxValue) && isNumber(technicalIndicator.maxValue)) {
          maxValue = Math.max(maxValue, technicalIndicator.maxValue);
        }

        plotsResult.push({
          plots: technicalIndicator.plots,
          result: technicalIndicator.result
        });
      });
      var precision = 4;

      if (this._isCandleYAxis) {
        var pricePrecision = this._chartData.pricePrecision();

        if (technicalIndicatorPrecision !== Number.MIN_SAFE_INTEGER) {
          precision = Math.max(technicalIndicatorPrecision, pricePrecision);
        } else {
          precision = pricePrecision;
        }
      } else {
        if (technicalIndicatorPrecision !== Number.MIN_SAFE_INTEGER) {
          precision = technicalIndicatorPrecision;
        }
      }

      var visibleDataList = this._chartData.visibleDataList();

      var candleOptions = this._chartData.styleOptions().candle;

      var isArea = candleOptions.type === CandleType.AREA;
      var areaValueKey = candleOptions.area.value;
      var shouldCompareHighLow = this._isCandleYAxis && !isArea || !this._isCandleYAxis && shouldOhlc;
      visibleDataList.forEach(function (_ref) {
        var index = _ref.index,
            data = _ref.data;

        if (shouldCompareHighLow) {
          minMaxArray[0] = Math.min(minMaxArray[0], data.low);
          minMaxArray[1] = Math.max(minMaxArray[1], data.high);
        }

        if (_this2._isCandleYAxis && isArea) {
          minMaxArray[0] = Math.min(minMaxArray[0], data[areaValueKey]);
          minMaxArray[1] = Math.max(minMaxArray[1], data[areaValueKey]);
        }

        plotsResult.forEach(function (_ref2) {
          var plots = _ref2.plots,
              result = _ref2.result;
          var technicalIndicatorData = result[index] || {};
          plots.forEach(function (plot) {
            var value = technicalIndicatorData[plot.key];

            if (isValid(value)) {
              minMaxArray[0] = Math.min(minMaxArray[0], value);
              minMaxArray[1] = Math.max(minMaxArray[1], value);
            }
          });
        });
      });

      if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
        if (minValue !== Number.MAX_SAFE_INTEGER) {
          minMaxArray[0] = Math.min(minValue, minMaxArray[0]);
        }

        if (maxValue !== Number.MIN_SAFE_INTEGER) {
          minMaxArray[1] = Math.max(maxValue, minMaxArray[1]);
        }

        if (this.isPercentageYAxis()) {
          var fromClose = visibleDataList[0].data.close;
          this._minValue = (minMaxArray[0] - fromClose) / fromClose * 100;
          this._maxValue = (minMaxArray[1] - fromClose) / fromClose * 100;

          if (this._minValue === this._maxValue || Math.abs(this._minValue - this._maxValue) < Math.pow(10, -2)) {
            this._minValue -= 10;
            this._maxValue += 10;
          }
        } else {
          this._minValue = minMaxArray[0];
          this._maxValue = minMaxArray[1];

          if (this._minValue === this._maxValue || Math.abs(this._minValue - this._maxValue) < Math.pow(10, -precision)) {
            var percentValue = this._minValue !== 0 ? Math.abs(this._minValue * 0.2) : 10;
            this._minValue = this._minValue !== 0 ? this._minValue - percentValue : this._minValue;
            this._maxValue += percentValue;
          }
        }
      } else {
        this._minValue = 0;
        this._maxValue = 0;
      }
    }
  }, {
    key: "_innerConvertToPixel",
    value: function _innerConvertToPixel(value) {
      return Math.round((1.0 - (value - this._minValue) / this._range) * this._height);
    }
  }, {
    key: "isCandleYAxis",
    value: function isCandleYAxis() {
      return this._isCandleYAxis;
    }
    /**
     * 是否是蜡烛图y轴组件
     * @returns {boolean}
     */

  }, {
    key: "isPercentageYAxis",
    value: function isPercentageYAxis() {
      return this._isCandleYAxis && this._chartData.styleOptions().yAxis.type === YAxisType.PERCENTAGE;
    }
  }, {
    key: "getSelfWidth",
    value: function getSelfWidth() {
      var _this3 = this;

      var styleOptions = this._chartData.styleOptions();

      var yAxisOptions = styleOptions.yAxis;
      var width = yAxisOptions.width;

      if (isValid(width) && isNumber(+width)) {
        return +width;
      }

      var yAxisWidth = 0;

      if (yAxisOptions.show) {
        if (yAxisOptions.axisLine.show) {
          yAxisWidth += yAxisOptions.axisLine.size;
        }

        if (yAxisOptions.tickLine.show) {
          yAxisWidth += yAxisOptions.tickLine.length;
        }

        if (yAxisOptions.tickText.show) {
          var textWidth = 0;
          this._measureCtx.font = createFont(yAxisOptions.tickText.size, yAxisOptions.tickText.weight, yAxisOptions.tickText.family);

          this._ticks.forEach(function (tick) {
            textWidth = Math.max(textWidth, calcTextWidth(_this3._measureCtx, tick.v));
          });

          yAxisWidth += yAxisOptions.tickText.paddingLeft + yAxisOptions.tickText.paddingRight + textWidth;
        }
      }

      var crosshairOptions = styleOptions.crosshair;
      var crosshairVerticalTextWidth = 0;

      if (crosshairOptions.show && crosshairOptions.horizontal.show && crosshairOptions.horizontal.text.show) {
        var technicalIndicators = this._additionalDataProvider.technicalIndicators();

        var technicalIndicatorPrecision = 0;
        var shouldFormatBigNumber = false;
        technicalIndicators.forEach(function (technicalIndicator) {
          technicalIndicatorPrecision = Math.max(technicalIndicator.precision, technicalIndicatorPrecision);

          if (!shouldFormatBigNumber) {
            shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber;
          }
        });
        this._measureCtx.font = createFont(crosshairOptions.horizontal.text.size, crosshairOptions.horizontal.text.weight, crosshairOptions.horizontal.text.family);
        var precision = 2;

        if (!this.isPercentageYAxis()) {
          if (this._isCandleYAxis) {
            var pricePrecision = this._chartData.pricePrecision();

            var lastValueMarkOptions = styleOptions.technicalIndicator.lastValueMark;

            if (lastValueMarkOptions.show && lastValueMarkOptions.text.show) {
              precision = Math.max(technicalIndicatorPrecision, pricePrecision);
            } else {
              precision = pricePrecision;
            }
          } else {
            precision = technicalIndicatorPrecision;
          }
        }

        var valueText = formatPrecision(this._maxValue, precision);

        if (shouldFormatBigNumber) {
          valueText = formatBigNumber(valueText);
        }

        crosshairVerticalTextWidth += crosshairOptions.horizontal.text.paddingLeft + crosshairOptions.horizontal.text.paddingRight + crosshairOptions.horizontal.text.borderSize * 2 + calcTextWidth(this._measureCtx, valueText);
      }

      return Math.max(yAxisWidth, crosshairVerticalTextWidth);
    }
  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(pixel) {
      var yAxisValue = (1.0 - pixel / this._height) * this._range + this._minValue;

      if (this.isPercentageYAxis()) {
        var fromData = (this._chartData.visibleDataList()[0] || {}).data || {};
        var fromClose = fromData.close;
        return fromClose * yAxisValue / 100 + fromClose;
      }

      return yAxisValue;
    }
  }, {
    key: "convertToPixel",
    value: function convertToPixel(value) {
      var realValue = value;

      if (this.isPercentageYAxis()) {
        var fromData = (this._chartData.visibleDataList()[0] || {}).data || {};
        var fromClose = fromData.close;

        if (isValid(fromClose)) {
          realValue = (value - fromClose) / fromClose * 100;
        }
      }

      return this._innerConvertToPixel(realValue);
    }
  }]);

  return YAxis;
}(Axis);

var TechnicalIndicatorPane = /*#__PURE__*/function (_Pane) {
  _inherits(TechnicalIndicatorPane, _Pane);

  var _super = _createSuper(TechnicalIndicatorPane);

  function TechnicalIndicatorPane(props) {
    var _this;

    _classCallCheck(this, TechnicalIndicatorPane);

    _this = _super.call(this, props);
    _this._technicalIndicators = [];

    if ('height' in props) {
      _this.setHeight(props.height);
    }

    _this.setTechnicalIndicator(_this._chartData.technicalIndicator(props.name));

    return _this;
  }

  _createClass(TechnicalIndicatorPane, [{
    key: "_initBefore",
    value: function _initBefore(props) {
      this._id = props.id;
      this._yAxis = this._createYAxis(props);
    }
  }, {
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, false, {
        technicalIndicators: this.technicalIndicators.bind(this)
      });
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new TechnicalIndicatorWidget({
        container: container,
        chartData: props.chartData,
        xAxis: props.xAxis,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicators: this.technicalIndicators.bind(this),
          id: this.id.bind(this)
        }
      });
    }
  }, {
    key: "_createYAxisWidget",
    value: function _createYAxisWidget(container, props) {
      return new YAxisWidget({
        container: container,
        chartData: props.chartData,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicators: this.technicalIndicators.bind(this),
          id: this.id.bind(this)
        }
      });
    }
    /**
     * 是否包含指标
     * @param name
     * @return {boolean}
     * @private
     */

  }, {
    key: "_includeTechnicalIndicator",
    value: function _includeTechnicalIndicator(name) {
      var _iterator = _createForOfIteratorHelper(this._technicalIndicators),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var technicalIndicator = _step.value;

          if (technicalIndicator.name === name) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      _get(_getPrototypeOf(TechnicalIndicatorPane.prototype), "setHeight", this).call(this, height);

      this._yAxis.setHeight(height);
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      _get(_getPrototypeOf(TechnicalIndicatorPane.prototype), "setWidth", this).call(this, mainWidgetWidth, yAxisWidgetWidth);

      this._yAxis.setWidth(yAxisWidgetWidth);
    }
  }, {
    key: "computeAxis",
    value: function computeAxis(forceCompute) {
      this._yAxis.calcMinMaxValue();

      return this._yAxis.computeAxis(forceCompute);
    }
  }, {
    key: "getSelfAxisWidth",
    value: function getSelfAxisWidth() {
      return this._yAxis.getSelfWidth();
    }
    /**
     * 获取id
     * @returns {string}
     */

  }, {
    key: "id",
    value: function id() {
      return this._id;
    }
  }, {
    key: "yAxis",
    value: function yAxis() {
      return this._yAxis;
    }
    /**
     * 获取技术指标
     * @return {[]}
     */

  }, {
    key: "technicalIndicators",
    value: function technicalIndicators() {
      return this._technicalIndicators;
    }
    /**
     * 是否无指标
     * @return {boolean}
     */

  }, {
    key: "isEmptyTechnicalIndicator",
    value: function isEmptyTechnicalIndicator() {
      return this._technicalIndicators.length === 0;
    }
    /**
     * 移除技术指标
     * @param name
     * @return {boolean}
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(name) {
      if (name) {
        var deletePos = -1;

        for (var i = 0; i < this._technicalIndicators.length; i++) {
          if (this._technicalIndicators[i].name === name) {
            deletePos = i;
            break;
          }
        }

        if (deletePos > -1) {
          this._technicalIndicators.splice(deletePos, 1);

          return true;
        }
      } else {
        this._technicalIndicators = [];
        return true;
      }
    }
    /**
     * 设置技术指标类型
     * @param technicalIndicator
     * @param isStack
     */

  }, {
    key: "setTechnicalIndicator",
    value: function setTechnicalIndicator(technicalIndicator, isStack) {
      if (technicalIndicator) {
        if (this._includeTechnicalIndicator(technicalIndicator.name)) {
          return false;
        }

        var cloneInstance = Object.create(technicalIndicator);

        if (isStack) {
          this._technicalIndicators.push(cloneInstance);
        } else {
          this._technicalIndicators = [cloneInstance];
        }

        this.calcTechnicalIndicator(cloneInstance);
        return true;
      }

      return false;
    }
    /**
     * 计算单个技术指标
     * @param technicalIndicator
     */

  }, {
    key: "calcTechnicalIndicator",
    value: function calcTechnicalIndicator(technicalIndicator) {
      technicalIndicator.result = technicalIndicator.calcTechnicalIndicator(this._chartData.dataList(), technicalIndicator.calcParams, technicalIndicator.plots) || [];
    }
    /**
     * 计算所有技术指标
     */

  }, {
    key: "calcAllTechnicalIndicator",
    value: function calcAllTechnicalIndicator() {
      var _this2 = this;

      this._technicalIndicators.forEach(function (technicalIndicator) {
        _this2.calcTechnicalIndicator(technicalIndicator);
      });

      return this.computeAxis();
    }
  }]);

  return TechnicalIndicatorPane;
}(Pane);

var CandleView = /*#__PURE__*/function (_TechnicalIndicatorVi) {
  _inherits(CandleView, _TechnicalIndicatorVi);

  var _super = _createSuper(CandleView);

  function CandleView() {
    _classCallCheck(this, CandleView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGrid();

      var candleOptions = this._chartData.styleOptions().candle;

      if (candleOptions.type === CandleType.AREA) {
        this._drawArea(candleOptions);
      } else {
        this._drawCandle(candleOptions);

        this._drawLowHighPrice(candleOptions.priceMark, 'high', 'high', Number.MIN_SAFE_INTEGER, [-2, -5], function (price, comparePrice) {
          if (price > comparePrice) {
            return price;
          }
        });

        this._drawLowHighPrice(candleOptions.priceMark, 'low', 'low', Number.MAX_SAFE_INTEGER, [2, 5], function (price, comparePrice) {
          if (price < comparePrice) {
            return price;
          }
        });
      }

      this._drawTechnicalIndicators();

      this._drawLastPriceLine(candleOptions.priceMark);
    }
    /**
     * 绘制面积图
     * @param candleOptions
     * @private
     */

  }, {
    key: "_drawArea",
    value: function _drawArea(candleOptions) {
      var _this = this;

      var linePoints = [];
      var areaPoints = [];
      var minY = Number.MAX_SAFE_INTEGER;
      var areaOptions = candleOptions.area;

      var onDrawing = function onDrawing(x, i, kLineData, halfBarSpace, n) {
        var value = kLineData[areaOptions.value];

        if (isValid(value) && isNumber(value)) {
          var y = _this._yAxis.convertToPixel(value);

          if (n === 0) {
            var startX = x - halfBarSpace;
            areaPoints.push({
              x: startX,
              y: _this._height
            });
            areaPoints.push({
              x: startX,
              y: y
            });
            linePoints.push({
              x: startX,
              y: y
            });
          }

          linePoints.push({
            x: x,
            y: y
          });
          areaPoints.push({
            x: x,
            y: y
          });
          minY = Math.min(minY, y);
        }
      };

      var onDrawEnd = function onDrawEnd() {
        var areaPointLength = areaPoints.length;

        if (areaPointLength > 0) {
          var lastPoint = areaPoints[areaPointLength - 1];
          var halfBarSpace = _this._chartData.barSpace() / 2;
          var endX = lastPoint.x + halfBarSpace;
          linePoints.push({
            x: endX,
            y: lastPoint.y
          });
          areaPoints.push({
            x: endX,
            y: lastPoint.y
          });
          areaPoints.push({
            x: endX,
            y: _this._height
          });
        }

        if (linePoints.length > 0) {
          // 绘制分时线
          _this._ctx.lineWidth = areaOptions.lineSize;
          _this._ctx.strokeStyle = areaOptions.lineColor;
          renderLine(_this._ctx, function () {
            _this._ctx.beginPath();

            _this._ctx.moveTo(linePoints[0].x, linePoints[0].y);

            for (var i = 1; i < linePoints.length; i++) {
              _this._ctx.lineTo(linePoints[i].x, linePoints[i].y);
            }

            _this._ctx.stroke();

            _this._ctx.closePath();
          });
        }

        if (areaPoints.length > 0) {
          // 绘制分时线填充区域
          var fillColor = areaOptions.fillColor;

          if (isArray(fillColor)) {
            var gradient = _this._ctx.createLinearGradient(0, _this._height, 0, minY);

            try {
              fillColor.forEach(function (_ref) {
                var offset = _ref.offset,
                    color = _ref.color;
                gradient.addColorStop(offset, color);
              });
            } catch (e) {}

            _this._ctx.fillStyle = gradient;
          } else {
            _this._ctx.fillStyle = fillColor;
          }

          _this._ctx.beginPath();

          _this._ctx.moveTo(areaPoints[0].x, areaPoints[0].y);

          for (var i = 1; i < areaPoints.length; i++) {
            _this._ctx.lineTo(areaPoints[i].x, areaPoints[i].y);
          }

          _this._ctx.closePath();

          _this._ctx.fill();
        }
      };

      this._drawGraphics(onDrawing, onDrawEnd);
    }
    /**
     * 绘制蜡烛
     * @param candleOptions
     * @private
     */

  }, {
    key: "_drawCandle",
    value: function _drawCandle(candleOptions) {
      var _this2 = this;

      this._drawGraphics(function (x, i, kLineData, halfBarSpace, barSpace) {
        _this2._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, candleOptions.bar, candleOptions.type);
      });
    }
    /**
     * 渲染最高最低价格
     * @param priceMarkOptions
     * @param optionKey
     * @param priceKey
     * @param initPriceValue
     * @param offsets
     * @param compare
     * @private
     */

  }, {
    key: "_drawLowHighPrice",
    value: function _drawLowHighPrice(priceMarkOptions, optionKey, priceKey, initPriceValue, offsets, compare) {
      var _this3 = this;

      var lowHighPriceMarkOptions = priceMarkOptions[optionKey];

      if (!priceMarkOptions.show || !lowHighPriceMarkOptions.show) {
        return;
      }

      var visibleDataList = this._chartData.visibleDataList();

      var price = initPriceValue;
      var pos = -1;
      visibleDataList.forEach(function (_ref2) {
        var index = _ref2.index,
            data = _ref2.data;
        var comparePrice = compare(formatValue(data, priceKey, initPriceValue), price);

        if (comparePrice) {
          price = comparePrice;
          pos = index;
        }
      });

      var pricePrecision = this._chartData.pricePrecision();

      var priceY = this._yAxis.convertToPixel(price);

      var startX = this._xAxis.convertToPixel(pos);

      var startY = priceY + offsets[0];
      this._ctx.textAlign = 'left';
      this._ctx.lineWidth = 1;
      this._ctx.strokeStyle = lowHighPriceMarkOptions.color;
      this._ctx.fillStyle = lowHighPriceMarkOptions.color;
      renderLine(this._ctx, function () {
        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX - 2, startY + offsets[0]);

        _this3._ctx.lineTo(startX, startY);

        _this3._ctx.lineTo(startX + 2, startY + offsets[0]);

        _this3._ctx.stroke();

        _this3._ctx.closePath();
      }); // 绘制竖线

      var y = startY + offsets[1];
      renderLine(this._ctx, function () {
        _this3._ctx.beginPath();

        _this3._ctx.moveTo(startX, startY);

        _this3._ctx.lineTo(startX, y);

        _this3._ctx.lineTo(startX + 5, y);

        _this3._ctx.stroke();

        _this3._ctx.closePath();
      });
      this._ctx.font = createFont(lowHighPriceMarkOptions.textSize, lowHighPriceMarkOptions.textWeight, lowHighPriceMarkOptions.textFamily);
      var text = formatPrecision(price, pricePrecision);
      this._ctx.textBaseline = 'middle';

      this._ctx.fillText(text, startX + 5 + lowHighPriceMarkOptions.textMargin, y);
    }
    /**
     * 绘制最新价线
     * @param priceMarkOptions
     * @private
     */

  }, {
    key: "_drawLastPriceLine",
    value: function _drawLastPriceLine(priceMarkOptions) {
      var lastPriceMarkOptions = priceMarkOptions.last;

      if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.line.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var kLineData = dataList[dataList.length - 1];

      if (!kLineData) {
        return;
      }

      var close = kLineData.close;
      var open = kLineData.open;

      var priceY = this._yAxis.convertToPixel(close);

      priceY = +Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98)).toFixed(0);
      var color;

      if (close > open) {
        color = lastPriceMarkOptions.upColor;
      } else if (close < open) {
        color = lastPriceMarkOptions.downColor;
      } else {
        color = lastPriceMarkOptions.noChangeColor;
      }

      this._ctx.save();

      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = lastPriceMarkOptions.line.size;

      if (lastPriceMarkOptions.line.style === LineStyle.DASH) {
        this._ctx.setLineDash(lastPriceMarkOptions.line.dashValue);
      }

      renderHorizontalLine(this._ctx, priceY, 0, this._width);

      this._ctx.restore();
    }
  }]);

  return CandleView;
}(TechnicalIndicatorView);

var CandleCrosshairView = /*#__PURE__*/function (_TechnicalIndicatorCr) {
  _inherits(CandleCrosshairView, _TechnicalIndicatorCr);

  var _super = _createSuper(CandleCrosshairView);

  function CandleCrosshairView() {
    _classCallCheck(this, CandleCrosshairView);

    return _super.apply(this, arguments);
  }

  _createClass(CandleCrosshairView, [{
    key: "_drawTooltip",
    value: function _drawTooltip(crosshair, kLineData, dataIndex, realX, technicalIndicators) {
      var styleOptions = this._chartData.styleOptions();

      var candleOptions = styleOptions.candle;
      var candleTooltipOptions = candleOptions.tooltip;

      var isDrawCandleTooltip = this._shouldDrawTooltip(crosshair, candleTooltipOptions);

      if (candleTooltipOptions.showType === TooltipCandleShowType.STANDARD) {
        var offsetTop = isDrawCandleTooltip ? candleTooltipOptions.text.size + candleTooltipOptions.text.marginTop : 0;

        this._drawCandleTooltipWithStandard(kLineData, candleOptions, isDrawCandleTooltip);

        this._drawBatchTechnicalIndicatorToolTip(crosshair, dataIndex, technicalIndicators, offsetTop);
      } else {
        this._drawCandleTooltipWithRect(kLineData, technicalIndicators, dataIndex, realX, candleOptions, isDrawCandleTooltip, styleOptions.technicalIndicator, this._shouldDrawTooltip(crosshair, styleOptions.technicalIndicator.tooltip));
      }

      if (crosshair.paneId) {
        this._chartData.crosshairDelegate().execute({
          dataIndex: dataIndex,
          kLineData: kLineData,
          x: crosshair.x,
          y: crosshair.y
        });
      }
    }
    /**
     * 绘制蜡烛默认的图例
     * @param kLineData
     * @param candleOptions
     * @param isDrawCandleTooltip
     * @private
     */

  }, {
    key: "_drawCandleTooltipWithStandard",
    value: function _drawCandleTooltipWithStandard(kLineData, candleOptions, isDrawCandleTooltip) {
      var _this = this;

      if (!isDrawCandleTooltip) {
        return;
      }

      var values = this._getCandleTooltipData(kLineData, candleOptions);

      var candleTooltipOptions = candleOptions.tooltip;
      var textMarginLeft = candleTooltipOptions.text.marginLeft;
      var textMarginRight = candleTooltipOptions.text.marginRight;
      var textSize = candleTooltipOptions.text.size;
      var textColor = candleTooltipOptions.text.color;
      var labels = candleTooltipOptions.labels;
      this._ctx.textBaseline = 'top';
      this._ctx.font = createFont(textSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
      var labelX = textMarginLeft;
      var labelY = candleTooltipOptions.text.marginTop;
      labels.forEach(function (label, i) {
        var labelWidth = calcTextWidth(_this._ctx, label);
        renderText(_this._ctx, textColor, labelX, labelY, label);
        labelX += labelWidth;
        var value = values[i] || candleTooltipOptions.defaultValue;
        var valueText;
        var valueColor;

        if (isObject(value)) {
          valueText = value.value || candleTooltipOptions.defaultValue;
          valueColor = value.color || textColor;
        } else {
          valueColor = textColor;
          valueText = value;
        }

        var textWidth = calcTextWidth(_this._ctx, valueText);
        renderText(_this._ctx, valueColor, labelX, labelY, valueText);
        labelX += textWidth + textMarginLeft + textMarginRight;
      });
    }
    /**
     * 绘制蜡烛图矩形类型图例
     * @param kLineData
     * @param technicalIndicators
     * @param dataIndex
     * @param x
     * @param candleOptions
     * @param isDrawCandleTooltip
     * @param technicalIndicatorOptions
     * @param isDrawTechnicalIndicatorTooltip
     * @private
     */

  }, {
    key: "_drawCandleTooltipWithRect",
    value: function _drawCandleTooltipWithRect(kLineData, technicalIndicators, dataIndex, x, candleOptions, isDrawCandleTooltip, technicalIndicatorOptions, isDrawTechnicalIndicatorTooltip) {
      var _this2 = this;

      if (!isDrawCandleTooltip && !isDrawTechnicalIndicatorTooltip) {
        return;
      }

      var candleTooltipOptions = candleOptions.tooltip;
      var baseLabels = candleTooltipOptions.labels;

      var baseValues = this._getCandleTooltipData(kLineData, candleOptions);

      var baseTextMarginLeft = candleTooltipOptions.text.marginLeft;
      var baseTextMarginRight = candleTooltipOptions.text.marginRight;
      var baseTextMarginTop = candleTooltipOptions.text.marginTop;
      var baseTextMarginBottom = candleTooltipOptions.text.marginBottom;
      var baseTextSize = candleTooltipOptions.text.size;
      var baseTextColor = candleTooltipOptions.text.color;
      var rectOptions = candleTooltipOptions.rect;
      var rectBorderSize = rectOptions.borderSize;
      var rectPaddingLeft = rectOptions.paddingLeft;
      var rectPaddingRight = rectOptions.paddingRight;
      var rectPaddingTop = rectOptions.paddingTop;
      var rectPaddingBottom = rectOptions.paddingBottom;
      var rectLeft = rectOptions.offsetLeft;
      var rectRight = rectOptions.offsetRight;
      var maxLabelWidth = 0;
      var rectWidth = 0;
      var rectHeight = 0;

      this._ctx.save();

      this._ctx.textBaseline = 'top';

      if (isDrawCandleTooltip) {
        this._ctx.font = createFont(baseTextSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
        baseLabels.forEach(function (label, i) {
          var value = baseValues[i];
          var v;

          if (isObject(value)) {
            v = value.value || candleTooltipOptions.defaultValue;
          } else {
            v = value;
          }

          var text = "".concat(label).concat(v);
          var labelWidth = calcTextWidth(_this2._ctx, text) + baseTextMarginLeft + baseTextMarginRight;
          maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
        });
        rectHeight += (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length;
      }

      var technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip;
      var indicatorTextMarginLeft = technicalIndicatorTooltipOptions.text.marginLeft;
      var indicatorTextMarginRight = technicalIndicatorTooltipOptions.text.marginRight;
      var indicatorTextMarginTop = technicalIndicatorTooltipOptions.text.marginTop;
      var indicatorTextMarginBottom = technicalIndicatorTooltipOptions.text.marginBottom;
      var indicatorTextSize = technicalIndicatorTooltipOptions.text.size;
      var indicatorTooltipDataList = [];

      var dataList = this._chartData.dataList();

      technicalIndicators.forEach(function (technicalIndicator) {
        var result = technicalIndicator.result;
        indicatorTooltipDataList.push({
          tooltipData: getTechnicalIndicatorTooltipData(result[dataIndex], technicalIndicator),
          cbData: {
            preData: {
              kLineData: dataList[dataIndex - 1],
              technicalIndicatorData: result[dataIndex - 1]
            },
            currentData: {
              kLineData: dataList[dataIndex],
              technicalIndicatorData: result[dataIndex]
            },
            nextData: {
              kLineData: dataList[dataIndex + 1],
              technicalIndicatorData: result[dataIndex + 1]
            }
          }
        });
      });

      if (isDrawTechnicalIndicatorTooltip) {
        this._ctx.font = createFont(indicatorTextSize, technicalIndicatorTooltipOptions.text.weight, technicalIndicatorTooltipOptions.text.family);
        indicatorTooltipDataList.forEach(function (_ref) {
          var tooltipData = _ref.tooltipData;
          tooltipData.values.forEach(function (_ref2) {
            var title = _ref2.title,
                value = _ref2.value;

            if (isValid(title)) {
              var v = value || technicalIndicatorTooltipOptions.defaultValue;
              var text = "".concat(title).concat(v);
              var labelWidth = calcTextWidth(_this2._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight;
              maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
              rectHeight += indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize;
            }
          });
        });
      }

      rectWidth += maxLabelWidth;

      if (rectWidth === 0 || rectHeight === 0) {
        return;
      }

      rectWidth += rectBorderSize * 2 + rectPaddingLeft + rectPaddingRight;
      rectHeight += rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom;
      var centerX = this._width / 2;
      var rectX;

      if (x < centerX) {
        rectX = this._width - rectRight - rectWidth;
      } else {
        rectX = rectLeft;
      }

      var rectY = rectOptions.offsetTop;
      var radius = rectOptions.borderRadius;
      renderFillRoundRect(this._ctx, rectOptions.fillColor, rectX, rectY, rectWidth, rectHeight, radius);
      renderStrokeRoundRect(this._ctx, rectOptions.borderColor, rectBorderSize, rectX, rectY, rectWidth, rectHeight, radius);
      var baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft;
      var labelY = rectY + rectBorderSize + rectPaddingTop;

      if (isDrawCandleTooltip) {
        // 开始渲染基础数据文字
        this._ctx.font = createFont(baseTextSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family);
        baseLabels.forEach(function (label, i) {
          labelY += baseTextMarginTop;
          _this2._ctx.textAlign = 'left';
          renderText(_this2._ctx, baseTextColor, baseLabelX, labelY, label);
          var value = baseValues[i];
          var text;
          var color;

          if (isObject(value)) {
            color = value.color || baseTextColor;
            text = value.value || candleTooltipOptions.defaultValue;
          } else {
            color = baseTextColor;
            text = value || candleTooltipOptions.defaultValue;
          }

          _this2._ctx.textAlign = 'right';
          renderText(_this2._ctx, color, rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight, labelY, text);
          labelY += baseTextSize + baseTextMarginBottom;
        });
      }

      if (isDrawTechnicalIndicatorTooltip) {
        // 开始渲染指标数据文字
        var _technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator;

        var indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft;
        this._ctx.font = createFont(indicatorTextSize, technicalIndicatorTooltipOptions.text.weight, technicalIndicatorTooltipOptions.text.family);
        indicatorTooltipDataList.forEach(function (_ref3, techIndex) {
          var tooltipData = _ref3.tooltipData,
              cbData = _ref3.cbData;
          var styles = technicalIndicators[techIndex].styles || _technicalIndicatorOptions;
          var colors = styles.line.colors;
          var colorSize = colors.length;
          var plots = technicalIndicators[techIndex].plots;
          var lineCount = 0;
          var valueColor;
          plots.forEach(function (plot, i) {
            switch (plot.type) {
              case TechnicalIndicatorPlotType.CIRCLE:
                {
                  valueColor = plot.color && plot.color(cbData, styles) || styles.circle.noChangeColor;
                  break;
                }

              case TechnicalIndicatorPlotType.BAR:
                {
                  valueColor = plot.color && plot.color(cbData, styles) || styles.bar.noChangeColor;
                  break;
                }

              case TechnicalIndicatorPlotType.LINE:
                {
                  valueColor = colors[lineCount % colorSize] || styles.text.color;
                  lineCount++;
                  break;
                }
            }

            var value = tooltipData.values[i];

            if (isValid(value.title)) {
              labelY += indicatorTextMarginTop;
              _this2._ctx.textAlign = 'left';
              _this2._ctx.fillStyle = valueColor;

              _this2._ctx.fillText("".concat(value.title), indicatorLabelX, labelY);

              _this2._ctx.textAlign = 'right';

              _this2._ctx.fillText(value.value || technicalIndicatorTooltipOptions.defaultValue, rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight, labelY);

              labelY += indicatorTextSize + indicatorTextMarginBottom;
            }
          });
        });
      }

      this._ctx.restore();
    }
    /**
     * 获取蜡烛提示数据
     * @param kLineData
     * @param candleOptions
     * @returns {*}
     * @private
     */

  }, {
    key: "_getCandleTooltipData",
    value: function _getCandleTooltipData(kLineData, candleOptions) {
      var _this3 = this;

      var baseValues = candleOptions.tooltip.values;
      var values = [];

      if (baseValues) {
        if (isFunction(baseValues)) {
          values = baseValues(kLineData, candleOptions) || [];
        } else if (isArray(baseValues)) {
          values = baseValues;
        }
      } else {
        var pricePrecision = this._chartData.pricePrecision();

        var volumePrecision = this._chartData.volumePrecision();

        values = [formatValue(kLineData, 'timestamp'), formatValue(kLineData, 'open'), formatValue(kLineData, 'close'), formatValue(kLineData, 'high'), formatValue(kLineData, 'low'), formatValue(kLineData, 'volume')];
        values.forEach(function (value, index) {
          switch (index) {
            case 0:
              {
                values[index] = formatDate(_this3._chartData.dateTimeFormat(), value, 'YYYY-MM-DD hh:mm');
                break;
              }

            case values.length - 1:
              {
                values[index] = formatBigNumber(formatPrecision(value, volumePrecision));
                break;
              }

            default:
              {
                values[index] = formatPrecision(value, pricePrecision);
                break;
              }
          }
        });
      }

      return values;
    }
  }]);

  return CandleCrosshairView;
}(TechnicalIndicatorCrosshairView);

var OverlayView = /*#__PURE__*/function (_View) {
  _inherits(OverlayView, _View);

  var _super = _createSuper(OverlayView);

  function OverlayView() {
    _classCallCheck(this, OverlayView);

    return _super.apply(this, arguments);
  }

  _createClass(OverlayView, [{
    key: "_draw",
    value: function _draw() {
      this._drawGraphicMarks();

      this._drawAnnotations();
    }
    /**
     * 绘制图形标记
     * @private
     */

  }, {
    key: "_drawGraphicMarks",
    value: function _drawGraphicMarks() {
      var _this = this;

      var graphicMarks = this._chartData.graphicMarks();

      graphicMarks.forEach(function (graphicMark) {
        graphicMark.draw(_this._ctx);
      });
    }
    /**
     * 绘制注解
     * @private
     */

  }, {
    key: "_drawAnnotations",
    value: function _drawAnnotations() {
      var _this2 = this;

      var annotations = this._chartData.visibleAnnotations();

      annotations.forEach(function (annotation) {
        annotation.draw(_this2._ctx);
      });
    }
  }]);

  return OverlayView;
}(View);

var CandleWidget = /*#__PURE__*/function (_TechnicalIndicatorWi) {
  _inherits(CandleWidget, _TechnicalIndicatorWi);

  var _super = _createSuper(CandleWidget);

  function CandleWidget() {
    _classCallCheck(this, CandleWidget);

    return _super.apply(this, arguments);
  }

  _createClass(CandleWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new CandleView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }, {
    key: "_createExpandView",
    value: function _createExpandView(container, props) {
      return new OverlayView(container, props.chartData);
    }
  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new CandleCrosshairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider);
    }
  }]);

  return CandleWidget;
}(TechnicalIndicatorWidget);

var CandlePane = /*#__PURE__*/function (_TechnicalIndicatorPa) {
  _inherits(CandlePane, _TechnicalIndicatorPa);

  var _super = _createSuper(CandlePane);

  function CandlePane() {
    _classCallCheck(this, CandlePane);

    return _super.apply(this, arguments);
  }

  _createClass(CandlePane, [{
    key: "_createYAxis",
    value: function _createYAxis(props) {
      return new YAxis(props.chartData, true, {
        technicalIndicators: this.technicalIndicators.bind(this)
      });
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new CandleWidget({
        container: container,
        chartData: props.chartData,
        xAxis: props.xAxis,
        yAxis: this._yAxis,
        additionalDataProvider: {
          technicalIndicators: this.technicalIndicators.bind(this),
          id: this.id.bind(this)
        }
      });
    }
  }]);

  return CandlePane;
}(TechnicalIndicatorPane);

var XAxisView = /*#__PURE__*/function (_View) {
  _inherits(XAxisView, _View);

  var _super = _createSuper(XAxisView);

  function XAxisView(container, chartData, xAxis) {
    var _this;

    _classCallCheck(this, XAxisView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    return _this;
  }

  _createClass(XAxisView, [{
    key: "_draw",
    value: function _draw() {
      var xAxisOptions = this._chartData.styleOptions().xAxis;

      if (xAxisOptions.show) {
        this._drawAxisLine(xAxisOptions);

        this._drawTickLines(xAxisOptions);

        this._drawTickLabels(xAxisOptions);
      }
    }
  }, {
    key: "_drawAxisLine",
    value: function _drawAxisLine(xAxisOptions) {
      var xAxisLine = xAxisOptions.axisLine;

      if (!xAxisLine.show) {
        return;
      }

      this._ctx.strokeStyle = xAxisLine.color;
      this._ctx.lineWidth = xAxisLine.size;
      renderHorizontalLine(this._ctx, 0, 0, this._width);
    }
  }, {
    key: "_drawTickLines",
    value: function _drawTickLines(xAxisOptions) {
      var _this2 = this;

      var tickLine = xAxisOptions.tickLine;

      if (!tickLine.show) {
        return;
      }

      this._ctx.lineWidth = tickLine.size;
      this._ctx.strokeStyle = tickLine.color;
      var startY = xAxisOptions.axisLine.show ? xAxisOptions.axisLine.size : 0;
      var endY = startY + tickLine.length;

      this._xAxis.ticks().forEach(function (tick) {
        renderVerticalLine(_this2._ctx, tick.x, startY, endY);
      });
    }
  }, {
    key: "_drawTickLabels",
    value: function _drawTickLabels(xAxisOptions) {
      var tickText = xAxisOptions.tickText;

      if (!tickText.show) {
        return;
      }

      var tickLine = xAxisOptions.tickLine;
      this._ctx.textBaseline = 'top';
      this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family);
      this._ctx.textAlign = 'center';
      this._ctx.fillStyle = tickText.color;
      var labelY = tickText.paddingTop;

      if (xAxisOptions.axisLine.show) {
        labelY += xAxisOptions.axisLine.size;
      }

      if (tickLine.show) {
        labelY += tickLine.length;
      }

      var ticks = this._xAxis.ticks();

      var tickLength = ticks.length;

      for (var i = 0; i < tickLength; i++) {
        this._ctx.fillText(ticks[i].v, ticks[i].x, labelY);
      }
    }
  }]);

  return XAxisView;
}(View);

var XAxisCrosshairView = /*#__PURE__*/function (_View) {
  _inherits(XAxisCrosshairView, _View);

  var _super = _createSuper(XAxisCrosshairView);

  function XAxisCrosshairView(container, chartData, xAxis) {
    var _this;

    _classCallCheck(this, XAxisCrosshairView);

    _this = _super.call(this, container, chartData);
    _this._xAxis = xAxis;
    return _this;
  }

  _createClass(XAxisCrosshairView, [{
    key: "_draw",
    value: function _draw() {
      this._drawCrosshairLabel();
    }
  }, {
    key: "_drawCrosshairLabel",
    value: function _drawCrosshairLabel() {
      var crosshair = this._chartData.crosshair();

      if (!crosshair.paneId) {
        return;
      }

      var crosshairOptions = this._chartData.styleOptions().crosshair;

      var crosshairVerticalOptions = crosshairOptions.vertical;
      var crosshairVerticalTextOptions = crosshairVerticalOptions.text;

      if (!crosshairOptions.show || !crosshairVerticalOptions.show || !crosshairVerticalTextOptions.show) {
        return;
      }

      var dataList = this._chartData.dataList();

      var dataPos;

      if (isValid(crosshair.x)) {
        dataPos = this._xAxis.convertFromPixel(crosshair.x);
      } else {
        dataPos = dataList.length - 1;
      }

      var kLineData = dataList[dataPos];

      if (!kLineData) {
        return;
      }

      var x = this._xAxis.convertToPixel(dataPos);

      var timestamp = kLineData.timestamp;
      var text = formatDate(this._chartData.dateTimeFormat(), timestamp, 'YYYY-MM-DD hh:mm');
      var textSize = crosshairVerticalTextOptions.size;
      this._ctx.font = createFont(textSize, crosshairVerticalTextOptions.weight, crosshairVerticalTextOptions.family);
      var labelWidth = calcTextWidth(this._ctx, text);
      var labelX = x - labelWidth / 2;
      var paddingLeft = crosshairVerticalTextOptions.paddingLeft;
      var paddingRight = crosshairVerticalTextOptions.paddingRight;
      var paddingTop = crosshairVerticalTextOptions.paddingTop;
      var paddingBottom = crosshairVerticalTextOptions.paddingBottom;
      var borderSize = crosshairVerticalTextOptions.borderSize; // 保证整个x轴上的提示文字总是完全显示

      if (labelX < paddingLeft + borderSize) {
        labelX = paddingLeft + borderSize;
      } else if (labelX > this._width - labelWidth - borderSize - paddingRight) {
        labelX = this._width - labelWidth - borderSize - paddingRight;
      }

      var rectX = labelX - borderSize - paddingLeft;
      var rectWidth = labelWidth + borderSize * 2 + paddingRight + paddingLeft;
      var rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom;
      renderStrokeFillRect(this._ctx, crosshairVerticalTextOptions.backgroundColor, crosshairVerticalTextOptions.borderColor, borderSize, rectX, 0, rectWidth, rectHeight); // 绘制轴上的提示文字

      this._ctx.textBaseline = 'top';
      renderText(this._ctx, crosshairVerticalTextOptions.color, labelX, borderSize + paddingTop, text);
    }
  }]);

  return XAxisCrosshairView;
}(View);

var XAxisWidget = /*#__PURE__*/function (_Widget) {
  _inherits(XAxisWidget, _Widget);

  var _super = _createSuper(XAxisWidget);

  function XAxisWidget() {
    _classCallCheck(this, XAxisWidget);

    return _super.apply(this, arguments);
  }

  _createClass(XAxisWidget, [{
    key: "_createMainView",
    value: function _createMainView(container, props) {
      return new XAxisView(container, props.chartData, props.xAxis);
    }
  }, {
    key: "_createCrosshairView",
    value: function _createCrosshairView(container, props) {
      return new XAxisCrosshairView(container, props.chartData, props.xAxis);
    }
  }]);

  return XAxisWidget;
}(Widget);

var XAxis = /*#__PURE__*/function (_Axis) {
  _inherits(XAxis, _Axis);

  var _super = _createSuper(XAxis);

  function XAxis() {
    _classCallCheck(this, XAxis);

    return _super.apply(this, arguments);
  }

  _createClass(XAxis, [{
    key: "_computeMinMaxValue",
    value: function _computeMinMaxValue() {
      var min = this._chartData.from();

      var max = this._chartData.to() - 1;
      var range = max - min + 1;
      return {
        min: min,
        max: max,
        range: range
      };
    }
  }, {
    key: "_computeOptimalTicks",
    value: function _computeOptimalTicks(ticks) {
      var optimalTicks = [];
      var tickLength = ticks.length;

      var dataList = this._chartData.dataList();

      if (tickLength > 0) {
        var dateTimeFormat = this._chartData.dateTimeFormat();

        var tickText = this._chartData.styleOptions().xAxis.tickText;

        this._measureCtx.font = createFont(tickText.size, tickText.weight, tickText.family);
        var defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00');
        var pos = parseInt(ticks[0].v, 10);
        var x = this.convertToPixel(pos);
        var tickCountDif = 1;

        if (tickLength > 1) {
          var nextPos = parseInt(ticks[1].v, 10);
          var nextX = this.convertToPixel(nextPos);
          var xDif = Math.abs(nextX - x);

          if (xDif < defaultLabelWidth) {
            tickCountDif = Math.ceil(defaultLabelWidth / xDif);
          }
        }

        for (var i = 0; i < tickLength; i += tickCountDif) {
          var _pos = parseInt(ticks[i].v, 10);

          var kLineData = dataList[_pos];
          var timestamp = kLineData.timestamp;
          var label = formatDate(dateTimeFormat, timestamp, 'hh:mm');

          if (i !== 0) {
            var prePos = parseInt(ticks[i - tickCountDif].v, 10);
            var preKLineData = dataList[prePos];
            var preTimestamp = preKLineData.timestamp;
            label = this._optimalTickLabel(dateTimeFormat, timestamp, preTimestamp) || label;
          }

          var _x = this.convertToPixel(_pos);

          optimalTicks.push({
            v: label,
            x: _x,
            oV: timestamp
          });
        }

        var optimalTickLength = optimalTicks.length;

        if (optimalTickLength === 1) {
          optimalTicks[0].v = formatDate(dateTimeFormat, optimalTicks[0].oV, 'YYYY-MM-DD hh:mm');
        } else {
          var firstTimestamp = optimalTicks[0].oV;
          var secondTimestamp = optimalTicks[1].oV;

          if (optimalTicks[2]) {
            var thirdV = optimalTicks[2].v;

            if (/^[0-9]{2}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'MM-DD');
            } else if (/^[0-9]{4}-[0-9]{2}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY-MM');
            } else if (/^[0-9]{4}$/.test(thirdV)) {
              optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY');
            }
          } else {
            optimalTicks[0].v = this._optimalTickLabel(dateTimeFormat, firstTimestamp, secondTimestamp) || optimalTicks[0].v;
          }
        }
      }

      return optimalTicks;
    }
  }, {
    key: "_optimalTickLabel",
    value: function _optimalTickLabel(dateTimeFormat, timestamp, comparedTimestamp) {
      var year = formatDate(dateTimeFormat, timestamp, 'YYYY');
      var month = formatDate(dateTimeFormat, timestamp, 'YYYY-MM');
      var day = formatDate(dateTimeFormat, timestamp, 'MM-DD');

      if (year !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY')) {
        return year;
      } else if (month !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY-MM')) {
        return month;
      } else if (day !== formatDate(dateTimeFormat, comparedTimestamp, 'MM-DD')) {
        return day;
      }

      return null;
    }
    /**
     * 获取自身高度
     */

  }, {
    key: "getSelfHeight",
    value: function getSelfHeight() {
      var stylOptions = this._chartData.styleOptions();

      var xAxisOptions = stylOptions.xAxis;
      var height = xAxisOptions.height;

      if (isValid(height) && isNumber(+height)) {
        return +height;
      }

      var crosshairOptions = stylOptions.crosshair;
      var xAxisHeight = 0;

      if (xAxisOptions.show) {
        if (xAxisOptions.axisLine.show) {
          xAxisHeight += xAxisOptions.axisLine.size;
        }

        if (xAxisOptions.tickLine.show) {
          xAxisHeight += xAxisOptions.tickLine.length;
        }

        if (xAxisOptions.tickText.show) {
          xAxisHeight += xAxisOptions.tickText.paddingTop + xAxisOptions.tickText.paddingBottom + xAxisOptions.tickText.size;
        }
      }

      var crosshairVerticalTextHeight = 0;

      if (crosshairOptions.show && crosshairOptions.vertical.show && crosshairOptions.vertical.text.show) {
        crosshairVerticalTextHeight += crosshairOptions.vertical.text.paddingTop + crosshairOptions.vertical.text.paddingBottom + crosshairOptions.vertical.text.borderSize * 2 + crosshairOptions.vertical.text.size;
      }

      return Math.max(xAxisHeight, crosshairVerticalTextHeight);
    }
  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(pixel) {
      return this._chartData.positionToDataIndex(pixel);
    }
  }, {
    key: "convertToPixel",
    value: function convertToPixel(value) {
      return this._chartData.dataIndexToPosition(value);
    }
  }]);

  return XAxis;
}(Axis);

var XAxisPane = /*#__PURE__*/function (_Pane) {
  _inherits(XAxisPane, _Pane);

  var _super = _createSuper(XAxisPane);

  function XAxisPane() {
    _classCallCheck(this, XAxisPane);

    return _super.apply(this, arguments);
  }

  _createClass(XAxisPane, [{
    key: "_initBefore",
    value: function _initBefore() {
      this._xAxis = new XAxis(this._chartData);
    }
  }, {
    key: "_createMainWidget",
    value: function _createMainWidget(container, props) {
      return new XAxisWidget({
        container: container,
        chartData: props.chartData,
        xAxis: this._xAxis
      });
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      this._xAxis.computeAxis(true);
    }
  }, {
    key: "getSelfAxisHeight",
    value: function getSelfAxisHeight() {
      return this._xAxis.getSelfHeight();
    }
  }, {
    key: "xAxis",
    value: function xAxis() {
      return this._xAxis;
    }
  }, {
    key: "setWidth",
    value: function setWidth(mainWidgetWidth, yAxisWidgetWidth) {
      _get(_getPrototypeOf(XAxisPane.prototype), "setWidth", this).call(this, mainWidgetWidth, yAxisWidgetWidth);

      this._xAxis.setWidth(mainWidgetWidth);
    }
  }, {
    key: "setHeight",
    value: function setHeight(height) {
      _get(_getPrototypeOf(XAxisPane.prototype), "setHeight", this).call(this, height);

      this._xAxis.setHeight(height);
    }
  }]);

  return XAxisPane;
}(Pane);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The file comes from tradingview/lightweight-charts
 * https://www.tradingview.com/
 * Convert files from typescript to javascript.
 * Modified the class name.
 * The use of the source code of this file is also subject to the terms
 * and consitions of the license of "lightweight-charts" (Apache License V2, see
 * </licenses/LICENSE-lightweight-charts>).
 */
var MouseEventButton = {
  LEFT: 0,
  RIGHT: 2
};
var DELAY_RESET_CLICK = 500;
var DELAY_LONG_TAG = 600;

function getBoundingClientRect(element) {
  return element.getBoundingClientRect() || {
    left: 0,
    top: 0
  };
}

function isTouchEvent(event) {
  return Boolean(event.touches);
}

function preventDefault(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function checkTouchEvents() {
  if ('ontouchstart' in window) {
    return true;
  }

  return Boolean(window.DocumentTouch && document instanceof window.DocumentTouch);
}

var touch = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || checkTouchEvents();
var mobileTouch = 'onorientationchange' in window && touch;

function getDistance(p1, p2) {
  var xDiff = p1.clientX - p2.clientX;
  var yDiff = p1.clientY - p2.clientY;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

var EventType = {
  MOUSE: 'mouse',
  TOUCH: 'touch'
};

var EventBase = /*#__PURE__*/function () {
  function EventBase(target, eventHandler, options) {
    _classCallCheck(this, EventBase);

    this._target = target;
    this._handler = eventHandler;
    this._options = options;
    this._clickCount = 0;
    this._clickTimeoutId = null;
    this._longTapTimeoutId = null;
    this._longTapActive = false;
    this._mouseMoveStartPosition = null;
    this._moveExceededManhattanDistance = false;
    this._cancelClick = false;
    this._unsubscribeOutsideEvents = null;
    this._unsubscribeMousemove = null;
    this._unsubscribeRoot = null;
    this._startPinchMiddlePoint = null;
    this._startPinchDistance = 0;
    this._pinchPrevented = false;
    this._preventDragProcess = false;
    this._mousePressed = false;

    this._init();
  }

  _createClass(EventBase, [{
    key: "destroy",
    value: function destroy() {
      if (this._unsubscribeOutsideEvents !== null) {
        this._unsubscribeOutsideEvents();

        this._unsubscribeOutsideEvents = null;
      }

      if (this._unsubscribeMousemove !== null) {
        this._unsubscribeMousemove();

        this._unsubscribeMousemove = null;
      }

      if (this._unsubscribeRoot !== null) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      this._clearLongTapTimeout();

      this._resetClickTimeout();
    }
  }, {
    key: "_mouseEnterHandler",
    value: function _mouseEnterHandler(enterEvent) {
      var _this = this;

      if (this._unsubscribeMousemove) {
        this._unsubscribeMousemove();
      }

      {
        var boundMouseMoveHandler = this._mouseMoveHandler.bind(this);

        var boundMouseWheelHandler = this._mouseWheelHandler.bind(this);

        this._unsubscribeMousemove = function () {
          _this._target.removeEventListener('mousemove', boundMouseMoveHandler);

          _this._target.removeEventListener('wheel', boundMouseWheelHandler);
        };

        this._target.addEventListener('mousemove', boundMouseMoveHandler);

        this._target.addEventListener('wheel', boundMouseWheelHandler, {
          passive: false
        });
      }

      if (isTouchEvent(enterEvent)) {
        this._mouseMoveHandler(enterEvent);
      }

      var compatEvent = this._makeCompatEvent(enterEvent);

      this._processEvent(compatEvent, this._handler.mouseEnterEvent);
    }
  }, {
    key: "_resetClickTimeout",
    value: function _resetClickTimeout() {
      if (this._clickTimeoutId !== null) {
        clearTimeout(this._clickTimeoutId);
      }

      this._clickCount = 0;
      this._clickTimeoutId = null;
    }
  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(moveEvent) {
      if (this._mousePressed && !isTouchEvent(moveEvent)) {
        return;
      }

      var compatEvent = this._makeCompatEvent(moveEvent);

      this._processEvent(compatEvent, this._handler.mouseMoveEvent);
    }
  }, {
    key: "_mouseWheelHandler",
    value: function _mouseWheelHandler(wheelEvent) {
      var compatEvent = this._makeCompatEvent(wheelEvent);

      wheelEvent.localX = compatEvent.localX;
      wheelEvent.localY = compatEvent.localY;

      this._processEvent(wheelEvent, this._handler.mouseWheelEvent);
    }
  }, {
    key: "_mouseMoveWithDownHandler",
    value: function _mouseMoveWithDownHandler(moveEvent) {
      if ('button' in moveEvent && moveEvent.button !== MouseEventButton.LEFT) {
        return;
      }

      if (this._startPinchMiddlePoint !== null) {
        return;
      }

      var isTouch = isTouchEvent(moveEvent);

      if (this._preventDragProcess && isTouch) {
        return;
      }

      this._pinchPrevented = true;

      var compatEvent = this._makeCompatEvent(moveEvent);

      var startMouseMovePos = this._mouseMoveStartPosition;
      var xOffset = Math.abs(startMouseMovePos.x - compatEvent.pageX);
      var yOffset = Math.abs(startMouseMovePos.y - compatEvent.pageY);
      var moveExceededManhattanDistance = xOffset + yOffset > 5;

      if (!moveExceededManhattanDistance && isTouch) {
        return;
      }

      if (moveExceededManhattanDistance && !this._moveExceededManhattanDistance && isTouch) {
        // vertical drag is more important than horizontal drag
        // because we scroll the page vertically often than horizontally
        var correctedXOffset = xOffset * 0.5; // a drag can be only if touch page scroll isn't allowed

        var isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertTouchDragAsPageScroll;
        var isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzTouchDragAsPageScroll; // if drag event happened then we should revert preventDefault state to original one
        // and try to process the drag event
        // else we shouldn't prevent default of the event and ignore processing the drag event

        if (!isVertDrag && !isHorzDrag) {
          this._preventDragProcess = true;
        }
      }

      if (moveExceededManhattanDistance) {
        this._moveExceededManhattanDistance = true; // if manhattan distance is more that 5 - we should cancel click event

        this._cancelClick = true;

        if (isTouch) {
          this._clearLongTapTimeout();
        }
      }

      if (!this._preventDragProcess) {
        this._processEvent(compatEvent, this._handler.pressedMouseMoveEvent); // we should prevent default in case of touch only
        // to prevent scroll of the page


        if (isTouch) {
          preventDefault(moveEvent);
        }
      }
    }
  }, {
    key: "_mouseUpHandler",
    value: function _mouseUpHandler(mouseUpEvent) {
      if ('button' in mouseUpEvent && mouseUpEvent.button !== MouseEventButton.LEFT) {
        return;
      }

      var compatEvent = this._makeCompatEvent(mouseUpEvent);

      this._clearLongTapTimeout();

      this._mouseMoveStartPosition = null;
      this._mousePressed = false;

      if (this._unsubscribeRoot) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      if (isTouchEvent(mouseUpEvent)) {
        this._mouseLeaveHandler(mouseUpEvent);
      }

      this._processEvent(compatEvent, this._handler.mouseUpEvent);

      ++this._clickCount;

      if (this._clickTimeoutId && this._clickCount > 1) {
        this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent);

        this._resetClickTimeout();
      } else {
        if (!this._cancelClick) {
          this._processEvent(compatEvent, this._handler.mouseClickEvent);
        }
      } // prevent safari's dblclick-to-zoom
      // we handle mouseDoubleClickEvent here ourself


      if (isTouchEvent(mouseUpEvent)) {
        preventDefault(mouseUpEvent);

        this._mouseLeaveHandler(mouseUpEvent);

        if (mouseUpEvent.touches.length === 0) {
          this._longTapActive = false;
        }
      }
    }
  }, {
    key: "_clearLongTapTimeout",
    value: function _clearLongTapTimeout() {
      if (this._longTapTimeoutId === null) {
        return;
      }

      clearTimeout(this._longTapTimeoutId);
      this._longTapTimeoutId = null;
    }
  }, {
    key: "_mouseDownHandler",
    value: function _mouseDownHandler(downEvent) {
      if ('button' in downEvent && downEvent.button !== MouseEventButton.LEFT && downEvent.button !== MouseEventButton.RIGHT) {
        return;
      }

      var compatEvent = this._makeCompatEvent(downEvent);

      if ('button' in downEvent && downEvent.button === MouseEventButton.RIGHT) {
        this._processEvent(compatEvent, this._handler.mouseRightDownEvent);

        return;
      }

      this._cancelClick = false;
      this._moveExceededManhattanDistance = false;
      this._preventDragProcess = false;

      if (isTouchEvent(downEvent)) {
        this._mouseEnterHandler(downEvent);
      }

      this._mouseMoveStartPosition = {
        x: compatEvent.pageX,
        y: compatEvent.pageY
      };

      if (this._unsubscribeRoot) {
        this._unsubscribeRoot();

        this._unsubscribeRoot = null;
      }

      {
        var boundMouseMoveWithDownHandler = this._mouseMoveWithDownHandler.bind(this);

        var boundMouseUpHandler = this._mouseUpHandler.bind(this);

        var rootElement = this._target.ownerDocument.documentElement;

        this._unsubscribeRoot = function () {
          rootElement.removeEventListener('touchmove', boundMouseMoveWithDownHandler);
          rootElement.removeEventListener('touchend', boundMouseUpHandler);
          rootElement.removeEventListener('mousemove', boundMouseMoveWithDownHandler);
          rootElement.removeEventListener('mouseup', boundMouseUpHandler);
        };

        rootElement.addEventListener('touchmove', boundMouseMoveWithDownHandler, {
          passive: false
        });
        rootElement.addEventListener('touchend', boundMouseUpHandler, {
          passive: false
        });

        this._clearLongTapTimeout();

        if (isTouchEvent(downEvent) && downEvent.touches.length === 1) {
          this._longTapTimeoutId = setTimeout(this._longTapHandler.bind(this, downEvent), DELAY_LONG_TAG);
        } else {
          rootElement.addEventListener('mousemove', boundMouseMoveWithDownHandler);
          rootElement.addEventListener('mouseup', boundMouseUpHandler);
        }
      }
      this._mousePressed = true;

      this._processEvent(compatEvent, this._handler.mouseDownEvent);

      if (!this._clickTimeoutId) {
        this._clickCount = 0;
        this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), DELAY_RESET_CLICK);
      }
    }
  }, {
    key: "_init",
    value: function _init() {
      var _this2 = this;

      this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this));

      this._target.addEventListener('touchcancel', this._clearLongTapTimeout.bind(this));

      {
        var doc = this._target.ownerDocument;

        var outsideHandler = function outsideHandler(event) {
          if (!_this2._handler.mouseDownOutsideEvent) {
            return;
          }

          if (event.target && _this2._target.contains(event.target)) {
            return;
          }

          _this2._handler.mouseDownOutsideEvent();
        };

        this._unsubscribeOutsideEvents = function () {
          doc.removeEventListener('mousedown', outsideHandler);
          doc.removeEventListener('touchstart', outsideHandler);
        };

        doc.addEventListener('mousedown', outsideHandler);
        doc.addEventListener('touchstart', outsideHandler, {
          passive: true
        });
      }

      this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this));

      this._target.addEventListener('touchstart', this._mouseDownHandler.bind(this), {
        passive: true
      });

      if (!mobileTouch) {
        this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this));
      }

      this._initPinch(); // Hey mobile Safari, what's up?
      // If mobile Safari doesn't have any touchmove handler with passive=false
      // it treats a touchstart and the following touchmove events as cancelable=false,
      // so we can't prevent them (as soon we subscribe on touchmove inside handler of touchstart).
      // And we'll get scroll of the page along with chart's one instead of only chart's scroll.


      this._target.addEventListener('touchmove', function () {}, {
        passive: false
      });
    }
  }, {
    key: "_initPinch",
    value: function _initPinch() {
      var _this3 = this;

      if (this._handler.pinchStartEvent === undefined && this._handler.pinchEvent === undefined && this._handler.pinchEndEvent === undefined) {
        return;
      }

      this._target.addEventListener('touchstart', function (event) {
        return _this3._checkPinchState(event.touches);
      }, {
        passive: true
      });

      this._target.addEventListener('touchmove', function (event) {
        if (event.touches.length !== 2 || _this3._startPinchMiddlePoint === null) {
          return;
        }

        if (_this3._handler.pinchEvent !== undefined) {
          var currentDistance = getDistance(event.touches[0], event.touches[1]);
          var scale = currentDistance / _this3._startPinchDistance;

          _this3._handler.pinchEvent(_this3._startPinchMiddlePoint, scale);

          preventDefault(event);
        }
      }, {
        passive: false
      });

      this._target.addEventListener('touchend', function (event) {
        _this3._checkPinchState(event.touches);
      });
    }
  }, {
    key: "_checkPinchState",
    value: function _checkPinchState(touches) {
      if (touches.length === 1) {
        this._pinchPrevented = false;
      }

      if (touches.length !== 2 || this._pinchPrevented || this._longTapActive) {
        this._stopPinch();
      } else {
        this._startPinch(touches);
      }
    }
  }, {
    key: "_startPinch",
    value: function _startPinch(touches) {
      var box = getBoundingClientRect(this._target);
      this._startPinchMiddlePoint = {
        x: (touches[0].clientX - box.left + (touches[1].clientX - box.left)) / 2,
        y: (touches[0].clientY - box.top + (touches[1].clientY - box.top)) / 2
      };
      this._startPinchDistance = getDistance(touches[0], touches[1]);

      if (this._handler.pinchStartEvent !== undefined) {
        this._handler.pinchStartEvent();
      }

      this._clearLongTapTimeout();
    }
  }, {
    key: "_stopPinch",
    value: function _stopPinch() {
      if (this._startPinchMiddlePoint === null) {
        return;
      }

      this._startPinchMiddlePoint = null;

      if (this._handler.pinchEndEvent !== undefined) {
        this._handler.pinchEndEvent();
      }
    }
  }, {
    key: "_mouseLeaveHandler",
    value: function _mouseLeaveHandler(event) {
      if (this._unsubscribeMousemove) {
        this._unsubscribeMousemove();
      }

      var compatEvent = this._makeCompatEvent(event);

      this._processEvent(compatEvent, this._handler.mouseLeaveEvent);
    }
  }, {
    key: "_longTapHandler",
    value: function _longTapHandler(event) {
      var compatEvent = this._makeCompatEvent(event);

      this._processEvent(compatEvent, this._handler.longTapEvent);

      this._cancelClick = true; // long tap is active untill touchend event with 0 touches occured

      this._longTapActive = true;
    }
  }, {
    key: "_processEvent",
    value: function _processEvent(event, callback) {
      if (!callback) {
        return;
      }

      callback.call(this._handler, event);
    }
  }, {
    key: "_makeCompatEvent",
    value: function _makeCompatEvent(event) {
      // TouchEvent has no clientX/Y coordinates:
      // We have to use the last Touch instead
      var eventLike;

      if ('touches' in event && event.touches.length) {
        eventLike = event.touches[0];
      } else if ('changedTouches' in event && event.changedTouches.length) {
        eventLike = event.changedTouches[0];
      } else {
        eventLike = event;
      }

      var box = getBoundingClientRect(this._target);
      return {
        clientX: eventLike.clientX,
        clientY: eventLike.clientY,
        pageX: eventLike.pageX,
        pageY: eventLike.pageY,
        screenX: eventLike.screenX,
        screenY: eventLike.screenY,
        localX: eventLike.clientX - box.left,
        localY: eventLike.clientY - box.top,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        type: event.type.startsWith('mouse') ? EventType.MOUSE : EventType.TOUCH,
        target: eventLike.target,
        view: event.view
      };
    }
  }]);

  return EventBase;
}();

var SeparatorPane = /*#__PURE__*/function () {
  function SeparatorPane(container, chartData, paneIndex, dragEnabled, dragEventHandler) {
    _classCallCheck(this, SeparatorPane);

    this._chartData = chartData;
    this._paneIndex = paneIndex;
    this._width = 0;
    this._offsetLeft = 0;
    this._dragEventHandler = dragEventHandler;
    this._dragFlag = false;

    this._initElement(container, dragEnabled);
  }

  _createClass(SeparatorPane, [{
    key: "_initElement",
    value: function _initElement(container, dragEnabled) {
      this._container = container;
      this._wrapper = this._createElement();
      this._wrapper.style.position = 'relative';
      this._element = this._createElement();
      this._element.style.width = '100%';
      this._element.style.position = 'absolute';
      this._element.style.zIndex = '20';
      this._element.style.top = '-3px';
      this._element.style.height = '7px';

      if (dragEnabled) {
        this._element.style.cursor = 'ns-resize';
        this._dragEvent = new EventBase(this._element, {
          mouseDownEvent: this._mouseDownEvent.bind(this),
          mouseUpEvent: this._mouseUpEvent.bind(this),
          pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
          mouseEnterEvent: this._mouseEnterEvent.bind(this),
          mouseLeaveEvent: this._mouseLeaveEvent.bind(this)
        }, {
          treatVertTouchDragAsPageScroll: false,
          treatHorzTouchDragAsPageScroll: true
        });
      }

      this._wrapper.appendChild(this._element);

      var lastElement = container.lastChild;

      if (lastElement) {
        container.insertBefore(this._wrapper, lastElement);
      } else {
        container.appendChild(this._wrapper);
      }
    }
    /**
     * 创建div节点
     * @private
     */

  }, {
    key: "_createElement",
    value: function _createElement() {
      var element = document.createElement('div');
      element.style.margin = '0';
      element.style.padding = '0';
      return element;
    }
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._dragFlag = true;
      this._startY = event.pageY;

      this._dragEventHandler.startDrag(this._paneIndex);
    }
  }, {
    key: "_mouseUpEvent",
    value: function _mouseUpEvent() {
      this._dragFlag = false;

      this._chartData.setDragPaneFlag(false);
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      var dragDistance = event.pageY - this._startY;

      this._dragEventHandler.drag(dragDistance, this._paneIndex);

      this._chartData.setDragPaneFlag(true);

      this._chartData.setCrosshairPointPaneId();
    }
  }, {
    key: "_mouseEnterEvent",
    value: function _mouseEnterEvent() {
      var separatorOptions = this._chartData.styleOptions().separator;

      this._element.style.background = separatorOptions.activeBackgroundColor;

      this._chartData.setDragPaneFlag(true);

      this._chartData.setCrosshairPointPaneId();
    }
  }, {
    key: "_mouseLeaveEvent",
    value: function _mouseLeaveEvent() {
      if (!this._dragFlag) {
        this._element.style.background = null;

        this._chartData.setDragPaneFlag(false);
      }
    }
    /**
     * 获取高度
     * @returns {number}
     */

  }, {
    key: "height",
    value: function height() {
      return this._wrapper.offsetHeight;
    }
    /**
     * 设置尺寸
     * 用于fill属性
     * @param offsetLeft
     * @param width
     */

  }, {
    key: "setSize",
    value: function setSize(offsetLeft, width) {
      this._offsetLeft = offsetLeft;
      this._width = width;
      this.invalidate();
    }
    /**
     * 更新上下两个图表的索引
     * @param paneIndex
     */

  }, {
    key: "updatePaneIndex",
    value: function updatePaneIndex(paneIndex) {
      this._paneIndex = paneIndex;
    }
    /**
     * 刷新
     */

  }, {
    key: "invalidate",
    value: function invalidate() {
      var separatorOptions = this._chartData.styleOptions().separator;

      this._element.style.top = "".concat(-Math.floor((7 - separatorOptions.size) / 2), "px");
      this._wrapper.style.backgroundColor = separatorOptions.color;
      this._wrapper.style.height = "".concat(separatorOptions.size, "px");
      this._wrapper.style.marginLeft = "".concat(separatorOptions.fill ? 0 : this._offsetLeft, "px");
      this._wrapper.style.width = separatorOptions.fill ? '100%' : "".concat(this._width, "px");
    }
    /**
     * 将图形转换成图片
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "getImage",
    value: function getImage() {
      var separatorOptions = this._chartData.styleOptions().separator;

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._wrapper.offsetWidth;
      var height = separatorOptions.size;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.fillStyle = separatorOptions.color;
      ctx.fillRect(this._offsetLeft, 0, width, height);
      return canvas;
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this._dragEvent) {
        this._dragEvent.destroy();
      }

      this._container.removeChild(this._wrapper);
    }
  }]);

  return SeparatorPane;
}();

function isTouch(event) {
  return event.type === EventType.TOUCH;
}
function isMouse(event) {
  return event.type === EventType.MOUSE;
}

var EventHandler = /*#__PURE__*/function () {
  function EventHandler(chartData) {
    _classCallCheck(this, EventHandler);

    this._chartData = chartData;
    this._chartContentSize = {};
    this._paneContentSize = {};
  }

  _createClass(EventHandler, [{
    key: "_checkEventPointX",
    value: function _checkEventPointX(x) {
      return x > 0 && x < this._chartContentSize.contentRight - this._chartContentSize.contentLeft;
    }
  }, {
    key: "setChartContentSize",
    value: function setChartContentSize(chartContentSize) {
      this._chartContentSize = chartContentSize;
    }
  }, {
    key: "setPaneContentSize",
    value: function setPaneContentSize(paneContentSize) {
      this._paneContentSize = paneContentSize;
    }
  }]);

  return EventHandler;
}();

var TOUCH_MIN_RADIUS = 10;

var ZoomScrollEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(ZoomScrollEventHandler, _EventHandler);

  var _super = _createSuper(ZoomScrollEventHandler);

  function ZoomScrollEventHandler(chartData) {
    var _this;

    _classCallCheck(this, ZoomScrollEventHandler);

    _this = _super.call(this, chartData); // 开始滚动时坐标点

    _this._startScrollPoint = {}; // 开始触摸时坐标

    _this._touchPoint = null; // 是否是取消了十字光标

    _this._touchCancelCrossHair = false; // 是否缩放过

    _this._touchZoomed = false; // 用来记录捏合缩放的尺寸

    _this._pinchScale = 1;
    return _this;
  }

  _createClass(ZoomScrollEventHandler, [{
    key: "pinchStartEvent",
    value: function pinchStartEvent() {
      this._pinchScale = 1;
      this._touchZoomed = true;
    }
  }, {
    key: "pinchEvent",
    value: function pinchEvent(middlePoint, scale) {
      var zoomScale = (scale - this._pinchScale) * 5;
      this._pinchScale = scale;

      this._chartData.zoom(zoomScale, middlePoint);
    }
  }, {
    key: "mouseLeaveEvent",
    value: function mouseLeaveEvent(event) {
      if (isMouse(event)) {
        this._chartData.setCrosshairPointPaneId();
      }
    }
  }, {
    key: "mouseMoveEvent",
    value: function mouseMoveEvent(event) {
      var _this2 = this;

      if (!isMouse(event)) {
        return;
      }

      this._performCross(event, false, function (cross) {
        _this2._chartData.setCrosshairPointPaneId({
          x: event.localX,
          y: cross.y
        }, cross.paneId);
      }, function () {
        _this2._chartData.setCrosshairPointPaneId();
      });
    }
  }, {
    key: "mouseWheelEvent",
    value: function mouseWheelEvent(event) {
      if (!this._checkEventPointX(event.localX)) {
        return;
      }

      var deltaY = -(event.deltaY / 100);

      if (deltaY === 0) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      switch (event.deltaMode) {
        case event.DOM_DELTA_PAGE:
          deltaY *= 120;
          break;

        case event.DOM_DELTA_LINE:
          deltaY *= 32;
          break;
      }

      if (deltaY !== 0) {
        var scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY));

        this._chartData.zoom(scale, {
          x: event.localX,
          y: event.localY
        });
      }
    }
  }, {
    key: "mouseClickEvent",
    value: function mouseClickEvent(event) {
      var _this3 = this;

      this._performCross(event, true, function (cross) {
        if (!_this3._touchPoint && !_this3._touchCancelCrossHair && !_this3._touchZoomed) {
          _this3._touchPoint = {
            x: event.localX,
            y: event.localY
          };

          _this3._chartData.setCrosshairPointPaneId({
            x: event.localX,
            y: cross.y
          }, cross.paneId);
        }
      });
    }
  }, {
    key: "mouseDownEvent",
    value: function mouseDownEvent(event) {
      var _this4 = this;

      this._startScrollPoint = {
        x: event.localX,
        y: event.localY
      };

      this._chartData.startScroll();

      this._performCross(event, true, function (cross) {
        var crossHairPoint = {
          x: event.localX,
          y: cross.y
        };
        _this4._touchZoomed = false;

        if (_this4._touchPoint) {
          var xDif = event.localX - _this4._touchPoint.x;
          var yDif = event.localY - _this4._touchPoint.y;
          var radius = Math.sqrt(xDif * xDif + yDif * yDif);

          if (radius < TOUCH_MIN_RADIUS) {
            _this4._touchPoint = {
              x: event.localX,
              y: event.localY
            };

            _this4._chartData.setCrosshairPointPaneId(crossHairPoint, cross.paneId);
          } else {
            _this4._touchCancelCrossHair = true;
            _this4._touchPoint = null;

            _this4._chartData.setCrosshairPointPaneId();
          }
        } else {
          _this4._touchCancelCrossHair = false;
        }
      });
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      var _this5 = this;

      this._performCross(event, false, function (cross) {
        var crossHairPoint = {
          x: event.localX,
          y: cross.y
        };

        if (isTouch(event)) {
          if (_this5._touchPoint) {
            _this5._touchPoint = {
              x: event.localX,
              y: event.localY
            };

            _this5._chartData.setCrosshairPointPaneId(crossHairPoint, cross.paneId);

            return;
          }
        } else {
          _this5._chartData.setCrosshairPointPaneId(crossHairPoint, cross.paneId, true);
        }

        var distance = event.localX - _this5._startScrollPoint.x;

        _this5._chartData.scroll(distance);
      });
    }
  }, {
    key: "longTapEvent",
    value: function longTapEvent(event) {
      var _this6 = this;

      this._performCross(event, true, function (cross) {
        _this6._touchPoint = {
          x: event.localX,
          y: event.localY
        };

        _this6._chartData.setCrosshairPointPaneId({
          x: event.localX,
          y: cross.y
        }, cross.paneId);
      });
    }
    /**
     * 处理十字光标
     * @param event
     * @param checkTouchEvent
     * @param performFuc
     * @param extendFun
     * @private
     */

  }, {
    key: "_performCross",
    value: function _performCross(event, checkTouchEvent, performFuc, extendFun) {
      if (checkTouchEvent && !isTouch(event)) {
        return;
      }

      if (!this._checkEventPointX(event.localX)) {
        if (extendFun) {
          extendFun();
        }

        return;
      }

      var isPerform = false;

      for (var paneId in this._paneContentSize) {
        var size = this._paneContentSize[paneId];

        if (event.localY > size.contentTop && event.localY < size.contentBottom) {
          isPerform = true;

          if (performFuc) {
            performFuc({
              paneId: paneId,
              y: event.localY - size.contentTop
            });
          }

          break;
        }
      }

      if (!isPerform && extendFun) {
        extendFun();
      }
    }
  }]);

  return ZoomScrollEventHandler;
}(EventHandler);

var OverlayEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(OverlayEventHandler, _EventHandler);

  var _super = _createSuper(OverlayEventHandler);

  function OverlayEventHandler(chartData) {
    var _this;

    _classCallCheck(this, OverlayEventHandler);

    _this = _super.call(this, chartData);
    _this._pressedGraphicMark = null;
    return _this;
  }
  /**
   * 处理覆盖物鼠标hover事件
   * @param overlays
   * @param preHoverOperate
   * @param point
   * @param event
   * @return {*}
   * @private
   */


  _createClass(OverlayEventHandler, [{
    key: "_performOverlayMouseHover",
    value: function _performOverlayMouseHover(overlays, preHoverOperate, point, event) {
      var hoverOperate;

      var _iterator = _createForOfIteratorHelper(overlays),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var overlay = _step.value;
          hoverOperate = overlay.checkMousePointOnGraphic(point);

          if (hoverOperate) {
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!hoverOperate || preHoverOperate.id !== hoverOperate.id) {
        if (preHoverOperate.id && preHoverOperate.instance && isMouse(event)) {
          preHoverOperate.instance.onMouseLeave({
            id: preHoverOperate.id,
            points: preHoverOperate.instance.tpPoints(),
            event: event
          });
        }

        if (hoverOperate && hoverOperate.id !== preHoverOperate.id && hoverOperate.instance && isMouse(event)) {
          hoverOperate.instance.onMouseEnter({
            id: hoverOperate.id,
            points: hoverOperate.instance.tpPoints(),
            event: event
          });
        }
      }

      return hoverOperate;
    }
    /**
     * 鼠标抬起事件
     * @param event
     */

  }, {
    key: "mouseUpEvent",
    value: function mouseUpEvent(event) {
      if (this._pressedGraphicMark) {
        this._pressedGraphicMark = null;

        this._chartData.setDragGraphicMarkFlag(false);
      }
    }
  }, {
    key: "mouseMoveEvent",
    value: function mouseMoveEvent(event) {
      if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
        return;
      }

      var point = {
        x: event.localX,
        y: event.localY
      };

      if (!this._waitingForMouseMoveAnimationFrame) {
        this._waitingForMouseMoveAnimationFrame = true;

        var graphicMarks = this._chartData.graphicMarks();

        var visibleAnnotations = this._chartData.visibleAnnotations();

        var lastGraphicMark = graphicMarks[graphicMarks.length - 1];

        var preGraphicMarkHoverOperate = this._chartData.graphicMarkMouseOperate().hover;

        var preAnnotationHoverOperate = this._chartData.annotationMouseOperate();

        var graphicMarkHoverOperate;
        var graphicMarkClickOperate;
        var annotationHoverOperate;

        if (lastGraphicMark && lastGraphicMark.isDrawing()) {
          lastGraphicMark.mouseMoveForDrawing(point);
          graphicMarkHoverOperate = lastGraphicMark.checkMousePointOnGraphic(point);
          graphicMarkClickOperate = {
            id: '',
            element: GraphicMarkMouseOperateElement.NONE,
            elementIndex: -1
          };
        } else {
          graphicMarkHoverOperate = this._performOverlayMouseHover(graphicMarks, preGraphicMarkHoverOperate, point, event);
          annotationHoverOperate = this._performOverlayMouseHover(visibleAnnotations, preAnnotationHoverOperate, point, event);
        }

        this._chartData.setOverlayMouseOperate({
          hover: graphicMarkHoverOperate || {
            id: '',
            element: GraphicMarkMouseOperateElement.NONE,
            elementIndex: -1
          },
          click: graphicMarkClickOperate
        }, annotationHoverOperate || {
          id: ''
        });

        this._waitingForMouseMoveAnimationFrame = false;
      }
    }
    /**
     * 鼠标按下事件
     * @param event
     */

  }, {
    key: "mouseDownEvent",
    value: function mouseDownEvent(event) {
      if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
        return;
      }

      var point = {
        x: event.localX,
        y: event.localY
      };

      var graphicMarks = this._chartData.graphicMarks();

      var lastGraphicMark = graphicMarks[graphicMarks.length - 1];
      var graphicMarkHoverOperate = {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      };
      var graphicMarkClickOperate;

      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        lastGraphicMark.mouseLeftButtonDownForDrawing(point);
        graphicMarkClickOperate = lastGraphicMark.checkMousePointOnGraphic(point);
      } else {
        var _iterator2 = _createForOfIteratorHelper(graphicMarks),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var graphicMark = _step2.value;
            graphicMarkClickOperate = graphicMark.checkMousePointOnGraphic(point);

            if (graphicMarkClickOperate) {
              if (graphicMarkClickOperate.element === GraphicMarkMouseOperateElement.POINT) {
                this._pressedGraphicMark = graphicMark;

                this._chartData.setDragGraphicMarkFlag(true);

                graphicMarkHoverOperate = _objectSpread2({}, graphicMarkClickOperate);
              }

              graphicMark.onClick({
                id: graphicMarkClickOperate.id,
                points: graphicMark.tpPoints(),
                event: event
              });
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var visibleAnnotations = this._chartData.visibleAnnotations();

        var _iterator3 = _createForOfIteratorHelper(visibleAnnotations),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var annotation = _step3.value;
            var annotationOperate = annotation.checkMousePointOnGraphic(point);

            if (annotationOperate) {
              annotation.onClick({
                id: annotationOperate.id,
                points: annotation.tpPoints(),
                event: event
              });
              break;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      this._chartData.setOverlayMouseOperate({
        hover: graphicMarkHoverOperate,
        click: graphicMarkClickOperate || {
          id: '',
          element: GraphicMarkMouseOperateElement.NONE,
          elementIndex: -1
        }
      });
    }
  }, {
    key: "mouseRightDownEvent",
    value: function mouseRightDownEvent(event) {
      var graphicMarks = this._chartData.graphicMarks();

      for (var i = 0; i < graphicMarks.length; i++) {
        if (graphicMarks[i].checkMousePointOnGraphic({
          x: event.localX,
          y: event.localY
        })) {
          if (!graphicMarks[i].onRightClick({
            id: graphicMarks[i].id(),
            points: graphicMarks[i].tpPoints(),
            event: event
          })) {
            this._chartData.removeGraphicMarkInstance({
              type: RemoveGraphicMarkOperateType.ACTION,
              index: i
            });
          }

          break;
        }
      }

      var visibleAnnotations = this._chartData.visibleAnnotations();

      var _iterator4 = _createForOfIteratorHelper(visibleAnnotations),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var annotation = _step4.value;

          if (annotation.checkMousePointOnGraphic({
            x: event.localX,
            y: event.localY
          })) {
            annotation.onRightClick({
              id: annotation.id(),
              points: annotation.tpPoints(),
              event: event
            });
            break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "pressedMouseMoveEvent",
    value: function pressedMouseMoveEvent(event) {
      var graphicMarks = this._chartData.graphicMarks();

      var lastGraphicMark = graphicMarks[graphicMarks.length - 1];

      if ((!lastGraphicMark || !lastGraphicMark.isDrawing()) && this._pressedGraphicMark) {
        this._pressedGraphicMark.mousePressedMove({
          x: event.localX,
          y: event.localY
        }, event);

        this._chartData.invalidate(InvalidateLevel.OVERLAY);
      }
    }
  }, {
    key: "_checkEventPointY",
    value: function _checkEventPointY(y) {
      var size = this._paneContentSize[CANDLE_PANE_ID];
      return y > size.contentTop && y < size.contentBottom;
    }
  }]);

  return OverlayEventHandler;
}(EventHandler);

var KeyBoardCode = {
  EQUAL: 'Equal',
  MINUS: 'Minus',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
};

var KeyBoardEventHandler = /*#__PURE__*/function (_EventHandler) {
  _inherits(KeyBoardEventHandler, _EventHandler);

  var _super = _createSuper(KeyBoardEventHandler);

  function KeyBoardEventHandler() {
    _classCallCheck(this, KeyBoardEventHandler);

    return _super.apply(this, arguments);
  }

  _createClass(KeyBoardEventHandler, [{
    key: "keyBoardDownEvent",
    value:
    /**
     * 键盘事件
     * @param event
     */
    function keyBoardDownEvent(event) {
      if (event.shiftKey) {
        switch (event.code) {
          case KeyBoardCode.EQUAL:
            {
              this._chartData.zoom(0.5);

              break;
            }

          case KeyBoardCode.MINUS:
            {
              this._chartData.zoom(-0.5);

              break;
            }

          case KeyBoardCode.ARROW_LEFT:
            {
              this._chartData.startScroll();

              this._chartData.scroll(-3 * this._chartData.dataSpace());

              break;
            }

          case KeyBoardCode.ARROW_RIGHT:
            {
              this._chartData.startScroll();

              this._chartData.scroll(3 * this._chartData.dataSpace());

              break;
            }
        }
      }
    }
  }]);

  return KeyBoardEventHandler;
}(EventHandler);

var ChartEvent = /*#__PURE__*/function () {
  function ChartEvent(target, chartData) {
    _classCallCheck(this, ChartEvent);

    this._target = target;
    this._chartData = chartData;
    this._chartContentSize = {};
    this._event = new EventBase(this._target, {
      pinchStartEvent: this._pinchStartEvent.bind(this),
      pinchEvent: this._pinchEvent.bind(this),
      mouseUpEvent: this._mouseUpEvent.bind(this),
      mouseClickEvent: this._mouseClickEvent.bind(this),
      mouseDownEvent: this._mouseDownEvent.bind(this),
      mouseRightDownEvent: this._mouseRightDownEvent.bind(this),
      mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
      mouseMoveEvent: this._mouseMoveEvent.bind(this),
      mouseWheelEvent: this._mouseWheelEvent.bind(this),
      pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
      longTapEvent: this._longTapEvent.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: false,
      treatHorzTouchDragAsPageScroll: false
    });
    this._boundKeyBoardDownEvent = this._keyBoardDownEvent.bind(this);

    this._target.addEventListener('keydown', this._boundKeyBoardDownEvent);

    this._boundContextMenuEvent = function (e) {
      e.preventDefault();
    };

    this._target.addEventListener('contextmenu', this._boundContextMenuEvent, false);

    this._zoomScrollEventHandler = new ZoomScrollEventHandler(chartData);
    this._overlayEventHandler = new OverlayEventHandler(chartData);
    this._keyBoardEventHandler = new KeyBoardEventHandler(chartData);
  }

  _createClass(ChartEvent, [{
    key: "_keyBoardDownEvent",
    value: function _keyBoardDownEvent(event) {
      this._keyBoardEventHandler.keyBoardDownEvent(event);
    }
  }, {
    key: "_pinchStartEvent",
    value: function _pinchStartEvent() {
      this._zoomScrollEventHandler.pinchStartEvent();
    }
  }, {
    key: "_pinchEvent",
    value: function _pinchEvent(middlePoint, scale) {
      this._zoomScrollEventHandler.pinchEvent(middlePoint, scale);
    }
  }, {
    key: "_mouseUpEvent",
    value: function _mouseUpEvent(event) {
      this._target.style.cursor = 'crosshair';

      if (this._shouldPerformOverlayEvent()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._overlayEventHandler.mouseUpEvent(event);
      }
    }
  }, {
    key: "_mouseLeaveEvent",
    value: function _mouseLeaveEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.mouseLeaveEvent(event);
      }
    }
  }, {
    key: "_mouseMoveEvent",
    value: function _mouseMoveEvent(event) {
      event.localX -= this._chartContentSize.contentLeft;

      if (this._shouldPerformOverlayEvent()) {
        this._overlayEventHandler.mouseMoveEvent(event);
      }

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseMoveEvent(event);
      }
    }
  }, {
    key: "_mouseWheelEvent",
    value: function _mouseWheelEvent(event) {
      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseWheelEvent(event);
      }
    }
  }, {
    key: "_mouseClickEvent",
    value: function _mouseClickEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.mouseClickEvent(event);
      }
    }
  }, {
    key: "_mouseDownEvent",
    value: function _mouseDownEvent(event) {
      this._target.style.cursor = 'pointer';
      event.localX -= this._chartContentSize.contentLeft;

      if (this._shouldPerformOverlayEvent()) {
        this._overlayEventHandler.mouseDownEvent(event);
      }

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseDownEvent(event);
      }
    }
  }, {
    key: "_mouseRightDownEvent",
    value: function _mouseRightDownEvent(event) {
      if (this._shouldPerformOverlayEvent()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._overlayEventHandler.mouseRightDownEvent(event);
      }
    }
  }, {
    key: "_pressedMouseMoveEvent",
    value: function _pressedMouseMoveEvent(event) {
      event.localX -= this._chartContentSize.contentLeft;

      if (this._chartData.dragGraphicMarkFlag()) {
        this._overlayEventHandler.pressedMouseMoveEvent(event); // 这里判断一下，如果是在拖拽图形标记，让十字光标不显示


        if (this._chartData.crosshair().paneId) {
          this._chartData.setCrosshairPointPaneId();
        }
      }

      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.pressedMouseMoveEvent(event);
      }
    }
  }, {
    key: "_longTapEvent",
    value: function _longTapEvent(event) {
      if (this._checkZoomScroll()) {
        event.localX -= this._chartContentSize.contentLeft;

        this._zoomScrollEventHandler.longTapEvent(event);
      }
    }
  }, {
    key: "_checkZoomScroll",
    value: function _checkZoomScroll() {
      var graphicMarks = this._chartData.graphicMarks();

      var graphicMarkCount = graphicMarks.length;
      return !this._chartData.dragPaneFlag() && !this._chartData.dragGraphicMarkFlag() && (graphicMarkCount === 0 || !graphicMarks[graphicMarkCount - 1].isDrawing());
    }
    /**
     * 是否需要处理图形标记事件
     * @return {boolean}
     * @private
     */

  }, {
    key: "_shouldPerformOverlayEvent",
    value: function _shouldPerformOverlayEvent() {
      var graphicMarks = this._chartData.graphicMarks();

      var visibleAnnotations = this._chartData.visibleAnnotations();

      return graphicMarks.length > 0 || visibleAnnotations.length > 0;
    }
  }, {
    key: "setChartContentSize",
    value: function setChartContentSize(chartContentSize) {
      this._chartContentSize = chartContentSize;

      this._zoomScrollEventHandler.setChartContentSize(chartContentSize);

      this._overlayEventHandler.setChartContentSize(chartContentSize);
    }
  }, {
    key: "setPaneContentSize",
    value: function setPaneContentSize(paneContentSize) {
      this._zoomScrollEventHandler.setPaneContentSize(paneContentSize);

      this._overlayEventHandler.setPaneContentSize(paneContentSize);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._event.destroy();

      this._target.removeEventListener('keydown', this._boundKeyBoardDownEvent);

      this._target.removeEventListener('contextmenu', this._boundContextMenuEvent);
    }
  }]);

  return ChartEvent;
}();

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function throttle(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var previous = 0;
  return function () {
    var now = Date.now();
    var context = this;
    var args = arguments;

    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 渲染填充菱形
 * @param ctx
 * @param color
 * @param centerPoint
 * @param width
 * @param height
 */
function renderFillDiamond(ctx, color, centerPoint, width, height) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerPoint.x - width / 2, centerPoint.y);
  ctx.lineTo(centerPoint.x, centerPoint.y - height / 2);
  ctx.lineTo(centerPoint.x + width / 2, centerPoint.y);
  ctx.lineTo(centerPoint.x, centerPoint.y + height / 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 渲染填充菱形
 * @param ctx
 * @param color
 * @param centerPoint
 * @param width
 * @param height
 */
function renderFillTriangle(ctx, color, centerPoint, width, height) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerPoint.x - width / 2, centerPoint.y + height / 2);
  ctx.lineTo(centerPoint.x, centerPoint.y - height / 2);
  ctx.lineTo(centerPoint.x + width / 2, centerPoint.y + height / 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * 注解
 */

var Annotation = /*#__PURE__*/function (_Overlay) {
  _inherits(Annotation, _Overlay);

  var _super = _createSuper(Annotation);

  function Annotation(_ref) {
    var _this;

    var id = _ref.id,
        point = _ref.point,
        chartData = _ref.chartData,
        xAxis = _ref.xAxis,
        yAxis = _ref.yAxis,
        styles = _ref.styles;

    _classCallCheck(this, Annotation);

    _this = _super.call(this, {
      id: id,
      chartData: chartData,
      xAxis: xAxis,
      yAxis: yAxis
    });
    _this._tpPoint = point;
    _this._symbolCoordinate = {};

    _this.setStyles(styles, chartData.styleOptions().annotation);

    return _this;
  }
  /**
   * 绘制标识
   * @param ctx
   * @param isActive
   * @param styles
   * @private
   */


  _createClass(Annotation, [{
    key: "_drawSymbol",
    value: function _drawSymbol(ctx, isActive, styles) {
      var barSpace = this._chartData.barSpace();

      var symbolOptions = styles.symbol;
      var styleSize = symbolOptions.size;
      var styleActiveSize = symbolOptions.activeSize;
      var size = isActive ? isNumber(styleActiveSize) ? styleActiveSize : barSpace : isNumber(styleSize) ? styleSize : barSpace;
      var color = isActive ? symbolOptions.activeColor : symbolOptions.color;

      switch (symbolOptions.type) {
        case AnnotationSymbolType.CIRCLE:
          {
            renderFillCircle(ctx, color, this._symbolCoordinate, size / 2);
            break;
          }

        case AnnotationSymbolType.RECT:
          {
            renderFillRect(ctx, color, this._symbolCoordinate.x - size / 2, this._symbolCoordinate.y - size / 2, size, size);
            break;
          }

        case AnnotationSymbolType.DIAMOND:
          {
            renderFillDiamond(ctx, color, this._symbolCoordinate, size, size);
            break;
          }

        case AnnotationSymbolType.TRIANGLE:
          {
            renderFillTriangle(ctx, color, this._symbolCoordinate, size, size);
            break;
          }

        case AnnotationSymbolType.CUSTOM:
          {
            this.drawCustomSymbol({
              ctx: ctx,
              point: this._tpPoint,
              coordinate: this._symbolCoordinate,
              viewport: {
                width: this._xAxis.width(),
                height: this._yAxis.height(),
                barSpace: barSpace
              },
              styles: symbolOptions,
              isActive: isActive
            });
            break;
          }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var styles = this._styles || this._chartData.styleOptions().annotation;

      var isActive = this._id === this._chartData.annotationMouseOperate().id;

      this._drawSymbol(ctx, isActive, styles);

      if (this.drawExtend) {
        ctx.save();
        this.drawExtend({
          ctx: ctx,
          point: this._tpPoint,
          coordinate: this._symbolCoordinate,
          viewport: {
            width: this._xAxis.width(),
            height: this._yAxis.height()
          },
          styles: styles,
          isActive: isActive
        });
        ctx.restore();
      }
    }
  }, {
    key: "checkMousePointOnGraphic",
    value: function checkMousePointOnGraphic(point) {
      var barSpace = this._chartData.barSpace();

      var styles = this._styles || this._chartData.styleOptions().annotation;

      var symbolOptions = styles.symbol;
      var size = isNumber(symbolOptions.size) ? symbolOptions.size : barSpace;
      var isOn;

      switch (symbolOptions.type) {
        case AnnotationSymbolType.CIRCLE:
          {
            isOn = checkPointInCircle(this._symbolCoordinate, size / 2, point);
            break;
          }

        case AnnotationSymbolType.RECT:
          {
            var point1 = {
              x: this._symbolCoordinate.x - size / 2,
              y: this._symbolCoordinate.y - size / 2
            };
            var point2 = {
              x: this._symbolCoordinate.x + size / 2,
              y: this._symbolCoordinate.y + size / 2
            };
            isOn = checkPointInRect(point1, point2, point);
            break;
          }

        case AnnotationSymbolType.DIAMOND:
          {
            isOn = checkPointInDiamond(this._symbolCoordinate, size, size, point);
            break;
          }

        case AnnotationSymbolType.TRIANGLE:
          {
            isOn = checkPointInTriangle([{
              x: this._symbolCoordinate.x - size / 2,
              y: this._symbolCoordinate.y + size / 2
            }, {
              x: this._symbolCoordinate.x,
              y: this._symbolCoordinate.y - size / 2
            }, {
              x: this._symbolCoordinate.x + size / 2,
              y: this._symbolCoordinate.y + size / 2
            }], point);
            break;
          }

        case AnnotationSymbolType.CUSTOM:
          {
            isOn = this.checkPointInCustomSymbol({
              point: point,
              coordinate: this._symbolCoordinate,
              size: size
            });
            break;
          }
      }

      if (isOn) {
        return {
          id: this._id,
          instance: this
        };
      }
    }
    /**
     * 生成标识坐标
     * @param x
     */

  }, {
    key: "createSymbolCoordinate",
    value: function createSymbolCoordinate(x) {
      var y;

      var styles = this._styles || this._chartData.styleOptions().annotation;

      var symbolOptions = styles.symbol;
      var offset = symbolOptions.offset;

      switch (symbolOptions.position) {
        case AnnotationPosition.POINT:
          {
            y = this._yAxis.convertToPixel(this._tpPoint.price);
            break;
          }

        case AnnotationPosition.TOP:
          {
            y = 0;
            break;
          }

        case AnnotationPosition.BOTTOM:
          {
            y = this._yAxis.height();
            break;
          }
      }

      this._symbolCoordinate = {
        x: x + (offset[0] || 0),
        y: y + (offset[1] || 0)
      };
    }
    /**
     * 获取点
     * @return {*}
     */

  }, {
    key: "tpPoints",
    value: function tpPoints() {
      return this._tpPoint;
    }
    /**
     * 检查鼠标点是否在自定义标识内
     * @param point
     * @param coordinate
     * @param size
     */

  }, {
    key: "checkPointInCustomSymbol",
    value: function checkPointInCustomSymbol(_ref2) {
      _ref2.point;
          _ref2.coordinate;
          _ref2.size;
    }
    /**
     * 绘制自定义标识
     * @param ctx
     * @param point
     * @param coordinate
     * @param viewport
     * @param styles
     * @param isActive
     */

  }, {
    key: "drawCustomSymbol",
    value: function drawCustomSymbol(_ref3) {
      _ref3.ctx;
          _ref3.point;
          _ref3.coordinate;
          _ref3.viewport;
          _ref3.styles;
          _ref3.isActive;
    }
  }]);

  return Annotation;
}(Overlay);

var DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT = 100;
var TECHNICAL_INDICATOR_PANE_ID_PREFIX = 'technical_indicator_pane_';
var GRAPHIC_MARK_ID_PREFIX = 'graphic_mark_';
var CANDLE_PANE_ID = 'candle_pane';

var ChartPane = /*#__PURE__*/function () {
  function ChartPane(container, styleOptions) {
    _classCallCheck(this, ChartPane);

    this._initChartContainer(container);

    this._graphicMarkBaseId = 0;
    this._paneBaseId = 0;
    this._technicalIndicatorPanes = [];
    this._separatorPanes = [];
    this._separatorDragStartTechnicalIndicatorHeight = 0;
    this._chartData = new ChartData(styleOptions, this._updatePane.bind(this));
    this._xAxisPane = new XAxisPane({
      container: this._chartContainer,
      chartData: this._chartData
    });
    this._candlePane = new CandlePane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      id: CANDLE_PANE_ID
    });
    this._chartWidth = {};
    this._chartHeight = {};
    this._chartEvent = new ChartEvent(this._chartContainer, this._chartData);

    this._chartData.crosshairDelegate().subscribe(this._crosshairObserver.bind(this));

    this.adjustPaneViewport(true, true, true);
  }
  /**
   * 初始化图表容器
   * @param container
   * @private
   */


  _createClass(ChartPane, [{
    key: "_initChartContainer",
    value: function _initChartContainer(container) {
      this._container = container;
      this._chartContainer = document.createElement('div');
      this._chartContainer.style.userSelect = 'none';
      this._chartContainer.style.webkitUserSelect = 'none';
      this._chartContainer.style.msUserSelect = 'none';
      this._chartContainer.style.MozUserSelect = 'none';
      this._chartContainer.style.webkitTapHighlightColor = 'transparent';
      this._chartContainer.style.position = 'relative';
      this._chartContainer.style.outline = 'none';
      this._chartContainer.style.borderStyle = 'none';
      this._chartContainer.style.width = '100%';
      this._chartContainer.style.cursor = 'crosshair';
      this._chartContainer.tabIndex = 1;
      container.appendChild(this._chartContainer);
    }
    /**
     * 十字光标观察者
     * @private
     */

  }, {
    key: "_crosshairObserver",
    value: function _crosshairObserver(_ref) {
      var dataIndex = _ref.dataIndex,
          kLineData = _ref.kLineData,
          x = _ref.x,
          y = _ref.y;

      if (this.chartData().hasAction(ActionType.crosshair)) {
        var getData = function getData(pane) {
          var data = {};
          pane.technicalIndicators().forEach(function (tech) {
            var result = tech.result;
            data[tech.name] = result[dataIndex];
          });
          return data;
        };

        var technicalIndicatorData = _defineProperty({}, this._candlePane.id(), getData(this._candlePane));

        this._technicalIndicatorPanes.forEach(function (pane) {
          technicalIndicatorData[pane.id()] = getData(pane);
        });

        this._chartData.actionExecute(ActionType.crosshair, {
          coordinate: {
            x: x,
            y: y
          },
          dataIndex: dataIndex,
          kLineData: kLineData,
          technicalIndicatorData: technicalIndicatorData
        });
      }
    }
    /**
     * 分割线拖拽开始
     * @param paneIndex
     * @private
     */

  }, {
    key: "_separatorStartDrag",
    value: function _separatorStartDrag(paneIndex) {
      this._separatorDragStartTechnicalIndicatorHeight = this._technicalIndicatorPanes[paneIndex].height();
    }
    /**
     * 分割线拖拽
     * @param dragDistance
     * @param paneIndex
     * @private
     */

  }, {
    key: "_separatorDrag",
    value: function _separatorDrag(dragDistance, paneIndex) {
      var height = this._separatorDragStartTechnicalIndicatorHeight - dragDistance;

      if (height < 0) {
        height = 0;
      }

      this._technicalIndicatorPanes[paneIndex].setHeight(height);

      this.adjustPaneViewport(true, true, true, true, true);
    }
    /**
     * 更新所有pane
     * @private
     */

  }, {
    key: "_updatePane",
    value: function _updatePane() {
      var invalidateLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : InvalidateLevel.FULL;

      if (invalidateLevel === InvalidateLevel.TOOLTIP) {
        this._xAxisPane.invalidate(invalidateLevel);

        this._candlePane.invalidate(invalidateLevel);

        this._technicalIndicatorPanes.forEach(function (pane) {
          pane.invalidate(invalidateLevel);
        });
      } else {
        var shouldMeasureWidth = this._candlePane.computeAxis();

        if (invalidateLevel !== InvalidateLevel.OVERLAY) {
          this._technicalIndicatorPanes.forEach(function (pane) {
            var should = pane.computeAxis();

            if (should) {
              shouldMeasureWidth = should;
            }
          });
        }

        this.adjustPaneViewport(false, shouldMeasureWidth, true);
      }
    }
    /**
     * 计算所有pane的指标
     * @private
     */

  }, {
    key: "_calcAllPaneTechnicalIndicator",
    value: function _calcAllPaneTechnicalIndicator() {
      var _this = this;

      var tasks = [Promise.resolve(this._candlePane.calcAllTechnicalIndicator())];

      this._technicalIndicatorPanes.forEach(function (pane) {
        tasks.push(Promise.resolve(pane.calcAllTechnicalIndicator()));
      });

      Promise.all(tasks).then(function (result) {
        var shouldMeasureWidth = result.indexOf(true) > -1;

        _this.adjustPaneViewport(false, shouldMeasureWidth, true);
      });
    }
    /**
     * 测量pane高度
     * @private
     */

  }, {
    key: "_measurePaneHeight",
    value: function _measurePaneHeight() {
      var _this2 = this;

      var styleOptions = this._chartData.styleOptions();

      var paneHeight = this._container.offsetHeight;
      var separatorSize = styleOptions.separator.size;
      var separatorTotalHeight = separatorSize * this._separatorPanes.length;

      var xAxisHeight = this._xAxisPane.getSelfAxisHeight();

      var paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorTotalHeight;
      var technicalIndicatorPaneTotalHeight = 0;

      this._technicalIndicatorPanes.forEach(function (pane) {
        var paneHeight = pane.height();
        technicalIndicatorPaneTotalHeight += paneHeight; // 修复拖拽会超出容器高度问题

        if (technicalIndicatorPaneTotalHeight > paneExcludeXAxisSeparatorHeight) {
          var difHeight = technicalIndicatorPaneTotalHeight - paneExcludeXAxisSeparatorHeight;
          technicalIndicatorPaneTotalHeight = paneExcludeXAxisSeparatorHeight;
          pane.setHeight(paneHeight - difHeight);
        }
      });

      var candleStickPaneHeight = paneExcludeXAxisSeparatorHeight - technicalIndicatorPaneTotalHeight;
      var paneContentSize = {};
      paneContentSize[CANDLE_PANE_ID] = {
        contentTop: 0,
        contentBottom: candleStickPaneHeight
      };
      var contentTop = candleStickPaneHeight;
      var contentBottom = candleStickPaneHeight;

      this._candlePane.setHeight(candleStickPaneHeight);

      this._chartHeight[this._candlePane.id()] = candleStickPaneHeight;

      this._technicalIndicatorPanes.forEach(function (pane) {
        var technicalIndicatorPaneHeight = pane.height();
        pane.setHeight(technicalIndicatorPaneHeight);
        contentBottom += technicalIndicatorPaneHeight + separatorSize;
        paneContentSize[pane.id()] = {
          contentTop: contentTop,
          contentBottom: contentBottom
        };
        _this2._chartHeight[pane.id()] = technicalIndicatorPaneHeight;
        contentTop = contentBottom;
      });

      this._xAxisPane.setHeight(xAxisHeight);

      this._chartHeight.xAxis = xAxisHeight;
      this._chartHeight.total = paneHeight;

      this._chartEvent.setPaneContentSize(paneContentSize);
    }
    /**
     * 测量pan宽度
     * @private
     */

  }, {
    key: "_measurePaneWidth",
    value: function _measurePaneWidth() {
      var styleOptions = this._chartData.styleOptions();

      var yAxisOptions = styleOptions.yAxis;
      var isYAxisLeft = yAxisOptions.position === YAxisPosition.LEFT;
      var isOutside = !yAxisOptions.inside;
      var paneWidth = this._container.offsetWidth;
      var mainWidth;
      var yAxisWidth;
      var yAxisOffsetLeft;
      var mainOffsetLeft;

      if (isOutside) {
        yAxisWidth = this._candlePane.getSelfAxisWidth();

        this._technicalIndicatorPanes.forEach(function (pane) {
          yAxisWidth = Math.max(yAxisWidth, pane.getSelfAxisWidth());
        });

        mainWidth = paneWidth - yAxisWidth;

        if (isYAxisLeft) {
          yAxisOffsetLeft = 0;
          mainOffsetLeft = yAxisWidth;
        } else {
          mainOffsetLeft = 0;
          yAxisOffsetLeft = paneWidth - yAxisWidth;
        }
      } else {
        mainWidth = paneWidth;
        yAxisWidth = paneWidth;
        yAxisOffsetLeft = 0;
        mainOffsetLeft = 0;
      }

      this._chartData.setTotalDataSpace(mainWidth);

      this._candlePane.setWidth(mainWidth, yAxisWidth);

      this._candlePane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);

      for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
        var technicalIndicatorPane = this._technicalIndicatorPanes[i];
        var separatorPane = this._separatorPanes[i];
        technicalIndicatorPane.setWidth(mainWidth, yAxisWidth);
        technicalIndicatorPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);
        separatorPane.setSize(mainOffsetLeft, mainWidth);
      }

      this._chartWidth = {
        content: mainWidth,
        yAxis: yAxisWidth,
        total: paneWidth
      };

      this._xAxisPane.setWidth(mainWidth, yAxisWidth);

      this._xAxisPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft);

      this._chartEvent.setChartContentSize({
        contentLeft: mainOffsetLeft,
        contentRight: mainOffsetLeft + mainWidth
      });
    }
    /**
     * 调整窗口尺寸
     * @param shouldMeasureHeight
     * @param shouldMeasureWidth
     * @param shouldLayout
     * @param shouldComputeAxis
     * @param shouldForceComputeAxis
     */

  }, {
    key: "adjustPaneViewport",
    value: function adjustPaneViewport(shouldMeasureHeight, shouldMeasureWidth, shouldLayout, shouldComputeAxis, shouldForceComputeAxis) {
      if (shouldMeasureHeight) {
        this._measurePaneHeight();
      }

      var isAdjust = false;

      if (shouldComputeAxis) {
        isAdjust = this._candlePane.computeAxis(shouldForceComputeAxis);

        this._technicalIndicatorPanes.forEach(function (pane) {
          var adjust = pane.computeAxis(shouldForceComputeAxis);

          if (!isAdjust) {
            isAdjust = adjust;
          }
        });
      }

      if (!shouldComputeAxis && shouldMeasureWidth || shouldComputeAxis && isAdjust) {
        this._measurePaneWidth();
      }

      if (shouldLayout) {
        this._xAxisPane.computeAxis();

        this._xAxisPane.layout();

        this._candlePane.layout();

        this._technicalIndicatorPanes.forEach(function (pane) {
          pane.layout();
        });
      }
    }
    /**
     * 获取图表上的数据
     * @returns {ChartData}
     */

  }, {
    key: "chartData",
    value: function chartData() {
      return this._chartData;
    }
    /**
     * 覆盖技术指标
     * @param name
     * @param calcParams
     * @param calcParamsAllowDecimal
     * @param precision
     * @param styles
     */

  }, {
    key: "overrideTechnicalIndicator",
    value: function overrideTechnicalIndicator(_ref2) {
      var _this3 = this;

      var name = _ref2.name,
          calcParams = _ref2.calcParams,
          calcParamsAllowDecimal = _ref2.calcParamsAllowDecimal,
          precision = _ref2.precision,
          styles = _ref2.styles;

      var technicalIndicator = this._chartData.technicalIndicator(name);

      if (technicalIndicator) {
        technicalIndicator.setCalcParamsAllowDecimal(calcParamsAllowDecimal);
        var calcParamsSuccess = technicalIndicator.setCalcParams(calcParams);
        var precisionSuccess = technicalIndicator.setPrecision(precision);

        var defaultTechnicalStyleOptions = this._chartData.styleOptions().technicalIndicator;

        var styleSuccess = technicalIndicator.setStyles(styles, defaultTechnicalStyleOptions);

        if (calcParamsSuccess || precisionSuccess || styleSuccess) {
          var shouldAdjust = false;
          var tasks = [];

          this._candlePane.technicalIndicators().forEach(function (tech) {
            if (tech.name === name) {
              tech.setCalcParamsAllowDecimal(calcParamsAllowDecimal);

              if (calcParamsSuccess) {
                shouldAdjust = true;
                tech.setCalcParams(calcParams);
                tasks.push(Promise.resolve(_this3._candlePane.calcTechnicalIndicator(tech)));
              }

              if (precisionSuccess) {
                shouldAdjust = true;
                tech.setPrecision(precision);
              }

              if (styleSuccess) {
                shouldAdjust = true;
                tech.setStyles(styles, defaultTechnicalStyleOptions);
              }
            }
          });

          this._technicalIndicatorPanes.forEach(function (pane) {
            pane.technicalIndicators().forEach(function (tech) {
              if (tech.name === name) {
                tech.setCalcParamsAllowDecimal(calcParamsAllowDecimal);

                if (calcParamsSuccess) {
                  shouldAdjust = true;
                  tech.setCalcParams(calcParams);
                  tasks.push(Promise.resolve(pane.calcTechnicalIndicator(tech)));
                }

                if (precisionSuccess) {
                  shouldAdjust = true;
                  tech.setPrecision(precision);
                }

                if (styleSuccess) {
                  shouldAdjust = true;
                  tech.setStyles(styles, defaultTechnicalStyleOptions);
                }
              }
            });
          });

          if (shouldAdjust) {
            Promise.all(tasks).then(function (_) {
              _this3.adjustPaneViewport(false, true, true, true);
            });
          }
        }
      }
    }
    /**
     * 处理数组数据
     * @param dataList
     * @param more
     * @param extendFun
     * @private
     */

  }, {
    key: "_applyDataList",
    value: function _applyDataList(dataList, more, extendFun) {
      if (isArray(dataList)) {
        if (isFunction(extendFun)) {
          extendFun();
        }

        this._chartData.addData(dataList, 0, more);

        this._calcAllPaneTechnicalIndicator();
      }
    }
    /**
     * 添加新数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyNewData",
    value: function applyNewData(dataList, more) {
      var _this4 = this;

      this._applyDataList(dataList, more, function () {
        _this4._chartData.clearDataList();
      });
    }
    /**
     * 添加更多数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyMoreData",
    value: function applyMoreData(dataList, more) {
      this._applyDataList(dataList, more);
    }
    /**
     * 更新数据
     * @param data
     */

  }, {
    key: "updateData",
    value: function updateData(data) {
      if (isObject(data) && !isArray(data)) {
        var dataList = this._chartData.dataList();

        var dataSize = dataList.length; // 这里判断单个数据应该添加到哪个位置

        var timestamp = +formatValue(data, 'timestamp', 0);
        var lastDataTimestamp = +formatValue(dataList[dataSize - 1], 'timestamp', 0);

        if (timestamp >= lastDataTimestamp) {
          var pos = dataSize;

          if (timestamp === lastDataTimestamp) {
            pos = dataSize - 1;
          }

          this._chartData.addData(data, pos);

          this._calcAllPaneTechnicalIndicator();
        }
      }
    }
    /**
     * 移除指标
     * @param paneId
     * @param name
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(paneId, name) {
      if (paneId === CANDLE_PANE_ID) {
        if (this._candlePane.removeTechnicalIndicator(name)) {
          this.adjustPaneViewport(false, true, true, true);
        }
      } else {
        var paneIndex;

        for (var i = 0; i < this._technicalIndicatorPanes.length; i++) {
          var pane = this._technicalIndicatorPanes[i];

          if (pane.id() === paneId) {
            paneIndex = i;
            break;
          }
        }

        if (isValid(paneIndex)) {
          var removed = this._technicalIndicatorPanes[paneIndex].removeTechnicalIndicator(name);

          if (this._technicalIndicatorPanes[paneIndex].isEmptyTechnicalIndicator()) {
            this._technicalIndicatorPanes[paneIndex].destroy();

            this._separatorPanes[paneIndex].destroy();

            this._technicalIndicatorPanes.splice(paneIndex, 1);

            this._separatorPanes.splice(paneIndex, 1);

            for (var _i = 0; _i < this._separatorPanes.length; _i++) {
              this._separatorPanes[_i].updatePaneIndex(_i);
            }

            this.adjustPaneViewport(true, true, true, true, true);
          } else {
            if (removed) {
              this.adjustPaneViewport(false, true, true, true);
            }
          }
        }
      }
    }
    /**
     * 设置指标类型
     * @param technicalIndicator 技术指标实例
     * @param isStack 是否覆盖
     * @param options 配置
     */

  }, {
    key: "createTechnicalIndicator",
    value: function createTechnicalIndicator(technicalIndicator, isStack) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (options.id) {
        if (options.id === CANDLE_PANE_ID) {
          if (this._candlePane.setTechnicalIndicator(technicalIndicator, isStack)) {
            this.adjustPaneViewport(false, true, true, true);
          }

          return options.id;
        }

        var _iterator = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var pane = _step.value;

            if (options.id === pane.id()) {
              if (pane.setTechnicalIndicator(technicalIndicator, isStack)) {
                this.adjustPaneViewport(false, true, true, true);
              }

              return options.id;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      var technicalIndicatorPaneCount = this._technicalIndicatorPanes.length;
      var isDrag = isBoolean(options.dragEnabled) ? options.dragEnabled : true;

      this._separatorPanes.push(new SeparatorPane(this._chartContainer, this._chartData, technicalIndicatorPaneCount, isDrag, {
        startDrag: this._separatorStartDrag.bind(this),
        drag: throttle(this._separatorDrag.bind(this), 50)
      }));

      var id = options.id || "".concat(TECHNICAL_INDICATOR_PANE_ID_PREFIX).concat(++this._paneBaseId);
      var technicalIndicatorPane = new TechnicalIndicatorPane({
        container: this._chartContainer,
        chartData: this._chartData,
        xAxis: this._xAxisPane.xAxis(),
        name: technicalIndicator.name,
        id: id,
        height: options.height || DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT
      });

      this._technicalIndicatorPanes.push(technicalIndicatorPane);

      this.adjustPaneViewport(true, true, true, true, true);
      return id;
    }
    /**
     * 获取窗口技术指标
     * @param paneId
     * @return {{}}
     */

  }, {
    key: "getPaneTechnicalIndicator",
    value: function getPaneTechnicalIndicator(paneId) {
      var technicalIndicatorInfo = function technicalIndicatorInfo(pane) {
        var technicals = {};
        pane.technicalIndicators().forEach(function (technicalIndicator) {
          technicals[technicalIndicator.name] = getTechnicalIndicatorInfo(technicalIndicator);
        });
        return technicals;
      };

      if (isValid(paneId)) {
        if (paneId === CANDLE_PANE_ID) {
          return technicalIndicatorInfo(this._candlePane);
        } else {
          var _iterator2 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var pane = _step2.value;

              if (pane.id() === paneId) {
                return technicalIndicatorInfo(pane);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } else {
        var technicals = {};
        technicals[this._candlePane.id()] = technicalIndicatorInfo(this._candlePane);

        var _iterator3 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _pane = _step3.value;
            technicals[_pane.id()] = technicalIndicatorInfo(_pane);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        return technicals;
      }

      return {};
    }
    /**
     * 创建图形标记
     * @param GraphicMark
     * @param options
     */

  }, {
    key: "createGraphicMark",
    value: function createGraphicMark(GraphicMark) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var id = options.id,
          points = options.points,
          styles = options.styles,
          lock = options.lock,
          onDrawStart = options.onDrawStart,
          onDrawing = options.onDrawing,
          onDrawEnd = options.onDrawEnd,
          onClick = options.onClick,
          onRightClick = options.onRightClick,
          onPressedMove = options.onPressedMove,
          onMouseEnter = options.onMouseEnter,
          onMouseLeave = options.onMouseLeave,
          onRemove = options.onRemove;
      var graphicMarkId = id || "".concat(GRAPHIC_MARK_ID_PREFIX).concat(++this._graphicMarkBaseId);
      var graphicMarkInstance = new GraphicMark({
        id: graphicMarkId,
        chartData: this._chartData,
        xAxis: this._xAxisPane.xAxis(),
        yAxis: this._candlePane.yAxis(),
        points: points,
        styles: styles,
        lock: lock
      });

      if (isFunction(onDrawStart)) {
        graphicMarkInstance.onDrawStart = onDrawStart;
        graphicMarkInstance.onDrawStart({
          id: graphicMarkId
        });
      }

      if (isFunction(onDrawing)) {
        graphicMarkInstance.onDrawing = onDrawing;
      }

      if (isFunction(onDrawEnd)) {
        graphicMarkInstance.onDrawEnd = onDrawEnd;
      }

      if (isFunction(onClick)) {
        graphicMarkInstance.onClick = onClick;
      }

      if (isFunction(onRightClick)) {
        graphicMarkInstance.onRightClick = onRightClick;
      }

      if (isFunction(onPressedMove)) {
        graphicMarkInstance.onPressedMove = onPressedMove;
      }

      if (isFunction(onMouseEnter)) {
        graphicMarkInstance.onMouseEnter = onMouseEnter;
      }

      if (isFunction(onMouseLeave)) {
        graphicMarkInstance.onMouseLeave = onMouseLeave;
      }

      if (isFunction(onRemove)) {
        graphicMarkInstance.onRemove = onRemove;
      }

      if (this._chartData.addGraphicMarkInstance(graphicMarkInstance)) {
        return graphicMarkId;
      }
    }
    /**
     * 创建注解
     * @param annotation
     */

  }, {
    key: "createAnnotation",
    value: function createAnnotation(annotation) {
      var _this5 = this;

      if (annotation) {
        var instances = [];
        var annotations = [].concat(annotation);
        annotations.forEach(function (_ref3) {
          var point = _ref3.point,
              styles = _ref3.styles,
              checkPointInCustomSymbol = _ref3.checkPointInCustomSymbol,
              drawCustomSymbol = _ref3.drawCustomSymbol,
              drawExtend = _ref3.drawExtend,
              onClick = _ref3.onClick,
              onRightClick = _ref3.onRightClick,
              onMouseEnter = _ref3.onMouseEnter,
              onMouseLeave = _ref3.onMouseLeave;

          if (point && point.timestamp) {
            var annotationInstance = new Annotation({
              id: point.timestamp,
              chartData: _this5._chartData,
              point: point,
              xAxis: _this5._xAxisPane.xAxis(),
              yAxis: _this5._candlePane.yAxis(),
              styles: styles
            });

            if (isFunction(drawExtend)) {
              annotationInstance.drawExtend = drawExtend;
            }

            if (isFunction(checkPointInCustomSymbol)) {
              annotationInstance.checkPointInCustomSymbol = checkPointInCustomSymbol;
            }

            if (isFunction(drawCustomSymbol)) {
              annotationInstance.drawCustomSymbol = drawCustomSymbol;
            }

            if (isFunction(onClick)) {
              annotationInstance.onClick = onClick;
            }

            if (isFunction(onRightClick)) {
              annotationInstance.onRightClick = onRightClick;
            }

            if (isFunction(onMouseEnter)) {
              annotationInstance.onMouseEnter = onMouseEnter;
            }

            if (isFunction(onMouseLeave)) {
              annotationInstance.onMouseLeave = onMouseLeave;
            }

            instances.push(annotationInstance);
          }
        });

        this._chartData.addAnnotations(instances);
      }
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._chartData.setTimezone(timezone);

      this._xAxisPane.computeAxis();

      this._xAxisPane.invalidate(InvalidateLevel.FULL);
    }
    /**
     * 将值装换成像素
     * @param timestamp
     * @param value
     * @param paneId
     * @param dataIndexXAxis
     * @param absoluteYAxis
     */

  }, {
    key: "convertToPixel",
    value: function convertToPixel(value, _ref4) {
      var _this6 = this;

      var paneId = _ref4.paneId,
          dataIndexXAxis = _ref4.dataIndexXAxis,
          absoluteYAxis = _ref4.absoluteYAxis;
      var values = [].concat(value);
      var coordinates = [];

      var convert = function convert(pane, absoluteTop) {
        return values.map(function (_ref5) {
          var xAxisValue = _ref5.xAxisValue,
              yAxisValue = _ref5.yAxisValue;
          var coordinate = {};

          if (isValid(xAxisValue)) {
            var dataIndex = dataIndexXAxis ? xAxisValue : _this6._chartData.timestampToDataIndex(xAxisValue);
            coordinate.x = _this6._xAxisPane.xAxis().convertToPixel(dataIndex);
          }

          if (isValid(yAxisValue)) {
            var y = pane.yAxis().convertToPixel(yAxisValue);
            coordinate.y = absoluteYAxis ? absoluteTop + y : y;
          }

          return coordinate;
        });
      };

      if (!paneId || paneId === this._candlePane.id()) {
        coordinates = convert(this._candlePane, 0);
      } else {
        var separatorSize = this._chartData.styleOptions().separator.size;

        var absoluteTop = this._candlePane.height() + separatorSize;

        var _iterator4 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var pane = _step4.value;

            if (paneId === pane.id()) {
              coordinates = convert(pane, absoluteTop);
              break;
            }

            absoluteTop += pane.height() + separatorSize;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      return isArray(value) ? coordinates : coordinates[0] || {};
    }
    /**
     * 将像素转换成值
     * @param coordinate
     * @param paneId
     * @param dataIndexXAxis
     * @param absoluteYAxis
     * @return {{}[]|*[]}
     */

  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(coordinate, _ref6) {
      var _this7 = this;

      var paneId = _ref6.paneId,
          dataIndexXAxis = _ref6.dataIndexXAxis,
          absoluteYAxis = _ref6.absoluteYAxis;
      var coordinates = [].concat(coordinate);
      var values = [];

      var convert = function convert(pane, absoluteTop) {
        return coordinates.map(function (_ref7) {
          var x = _ref7.x,
              y = _ref7.y;
          var value = {};

          if (isValid(x)) {
            var v = _this7._xAxisPane.xAxis().convertFromPixel(x);

            value.xAxisValue = dataIndexXAxis ? v : _this7._chartData.dataIndexToTimestamp(v);
          }

          if (isValid(y)) {
            var ry = absoluteYAxis ? y - absoluteTop : y;
            value.yAxisValue = pane.yAxis().convertFromPixel(ry);
          }

          return value;
        });
      };

      if (!paneId || paneId === this._candlePane.id()) {
        values = convert(this._candlePane, 0);
      } else {
        var separatorSize = this._chartData.styleOptions().separator.size;

        var absoluteTop = this._candlePane.height() + separatorSize;

        var _iterator5 = _createForOfIteratorHelper(this._technicalIndicatorPanes),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var pane = _step5.value;

            if (paneId === pane.id()) {
              values = convert(pane, absoluteTop);
              break;
            }

            absoluteTop += pane.height() + separatorSize;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }

      return isArray(coordinate) ? values : values[0] || {};
    }
    /**
     * 图表宽度
     * @return {*|{}}
     */

  }, {
    key: "chartWidth",
    value: function chartWidth() {
      return this._chartWidth;
    }
    /**
     * 图表高度
     * @return {*|{}}
     */

  }, {
    key: "chartHeight",
    value: function chartHeight() {
      return this._chartHeight;
    }
    /**
     * 获取图表转换为图片后url
     * @param includeTooltip,
     * @param includeOverlay
     * @param type
     * @param backgroundColor
     */

  }, {
    key: "getConvertPictureUrl",
    value: function getConvertPictureUrl(includeTooltip, includeOverlay, type, backgroundColor) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var pixelRatio = getPixelRatio(canvas);
      var width = this._chartContainer.offsetWidth;
      var height = this._chartContainer.offsetHeight;
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      var offsetTop = 0;

      var candleStickPaneHeight = this._candlePane.height();

      ctx.drawImage(this._candlePane.getImage(includeTooltip, includeOverlay), 0, offsetTop, width, candleStickPaneHeight);
      offsetTop += candleStickPaneHeight;

      for (var i = 0; i < this._separatorPanes.length; i++) {
        var separatorPane = this._separatorPanes[i];
        var separatorPaneHeight = separatorPane.height();
        var technicalIndicatorPane = this._technicalIndicatorPanes[i];
        var technicalIndicatorPaneHeight = technicalIndicatorPane.height();
        ctx.drawImage(separatorPane.getImage(), 0, offsetTop, width, separatorPaneHeight);
        offsetTop += separatorPaneHeight;
        ctx.drawImage(technicalIndicatorPane.getImage(includeTooltip), 0, offsetTop, width, technicalIndicatorPaneHeight);
        offsetTop += technicalIndicatorPaneHeight;
      }

      ctx.drawImage(this._xAxisPane.getImage(includeTooltip), 0, offsetTop, width, this._xAxisPane.height());
      return canvas.toDataURL("image/".concat(type));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._candlePane.destroy();

      this._technicalIndicatorPanes.forEach(function (pane) {
        pane.destroy();
      });

      this._separatorPanes.forEach(function (pane) {
        pane.destroy();
      });

      this._xAxisPane.destroy();

      this._container.removeChild(this._chartContainer);

      this._chartEvent.destroy();
    }
  }]);

  return ChartPane;
}();

var Chart = /*#__PURE__*/function () {
  function Chart(container, styleOptions) {
    _classCallCheck(this, Chart);

    this._chartPane = new ChartPane(container, styleOptions);
  }
  /**
   * 获取宽尺寸
   * @return {*|{}}
   */


  _createClass(Chart, [{
    key: "getWidth",
    value: function getWidth() {
      return this._chartPane.chartWidth();
    }
    /**
     * 获取高度尺寸
     * @return {*|{}}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._chartPane.chartHeight();
    }
    /**
     * 设置样式配置
     * @param options
     */

  }, {
    key: "setStyleOptions",
    value: function setStyleOptions(options) {
      if (options) {
        this._chartPane.chartData().applyStyleOptions(options);

        this._chartPane.adjustPaneViewport(true, true, true, true, true);
      }
    }
    /**
     * 获取样式配置
     * @returns {[]|*[]}
     */

  }, {
    key: "getStyleOptions",
    value: function getStyleOptions() {
      return clone(this._chartPane.chartData().styleOptions());
    }
    /**
     * 覆盖技术指标
     * @param override
     */

  }, {
    key: "overrideTechnicalIndicator",
    value: function overrideTechnicalIndicator(override) {
      this._chartPane.overrideTechnicalIndicator(override);
    }
    /**
     * 获取技术指标名字获取技术指标
     * @param name
     * @return {{}|{series: *, calcParams: *, precision: *, name: *}}
     */

  }, {
    key: "getTechnicalIndicatorByName",
    value: function getTechnicalIndicatorByName(name) {
      return this._chartPane.chartData().technicalIndicatorInfo(name);
    }
    /**
     * 获取窗口上的技术指标
     * @param paneId
     * @return {{}}
     */

  }, {
    key: "getTechnicalIndicatorByPaneId",
    value: function getTechnicalIndicatorByPaneId(paneId) {
      return this._chartPane.getPaneTechnicalIndicator(paneId);
    }
    /**
     * 设置价格数量精度
     * @param pricePrecision
     * @param volumePrecision
     */

  }, {
    key: "setPriceVolumePrecision",
    value: function setPriceVolumePrecision(pricePrecision, volumePrecision) {
      if (!isValid(pricePrecision) || !isNumber(pricePrecision) || pricePrecision < 0) {
        {
          console.warn('setPriceVolumePrecision -> Invalid parameter: pricePrecision!!!');
        }

        return;
      }

      if (!isValid(volumePrecision) || !isNumber(volumePrecision) || volumePrecision < 0) {
        {
          console.warn('setPriceVolumePrecision -> Invalid parameter: volumePrecision!!!');
        }

        return;
      }

      this._chartPane.chartData().applyPriceVolumePrecision(pricePrecision, volumePrecision);
    }
    /**
     * 设置时区
     * @param timezone
     */

  }, {
    key: "setTimezone",
    value: function setTimezone(timezone) {
      this._chartPane.setTimezone(timezone);
    }
    /**
     * 获取当前时区
     */

  }, {
    key: "getTimezone",
    value: function getTimezone() {
      return this._chartPane.chartData().timezone();
    }
    /**
     * 重置尺寸，总是会填充父容器
     */

  }, {
    key: "resize",
    value: function resize() {
      this._chartPane.adjustPaneViewport(true, true, true, true, true);
    }
    /**
     * 设置右边间距
     * @param space
     */

  }, {
    key: "setOffsetRightSpace",
    value: function setOffsetRightSpace(space) {
      this._chartPane.chartData().setOffsetRightSpace(space);
    }
    /**
     * 设置左边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setLeftMinVisibleBarCount",
    value: function setLeftMinVisibleBarCount(barCount) {
      if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
        {
          console.warn('setLeftMinVisibleBarCount -> Invalid parameter: barCount!!!');
        }

        return;
      }

      this._chartPane.chartData().setLeftMinVisibleBarCount(Math.ceil(barCount));
    }
    /**
     * 设置右边可见的最小bar数量
     * @param barCount
     */

  }, {
    key: "setRightMinVisibleBarCount",
    value: function setRightMinVisibleBarCount(barCount) {
      if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
        {
          console.warn('setRightMinVisibleBarCount -> Invalid parameter: barCount!!!');
        }

        return;
      }

      this._chartPane.chartData().setRightMinVisibleBarCount(Math.ceil(barCount));
    }
    /**
     * 设置一条数据的空间
     * @param space
     */

  }, {
    key: "setDataSpace",
    value: function setDataSpace(space) {
      this._chartPane.chartData().setDataSpace(space);
    }
    /**
     * 清空数据
     */

  }, {
    key: "clearData",
    value: function clearData() {
      this._chartPane.chartData().clearDataList();
    }
    /**
     * 获取数据源
     */

  }, {
    key: "getDataList",
    value: function getDataList() {
      return this._chartPane.chartData().dataList();
    }
    /**
     * 添加新数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyNewData",
    value: function applyNewData(dataList, more) {
      if (!isArray(dataList)) {
        {
          console.warn('applyNewData -> Invalid parameter: dataList, dataList be an array!!!');
        }

        return;
      }

      this._chartPane.applyNewData(dataList, more);
    }
    /**
     * 添加历史更多数据
     * @param dataList
     * @param more
     */

  }, {
    key: "applyMoreData",
    value: function applyMoreData(dataList, more) {
      if (!isArray(dataList)) {
        {
          console.warn('applyMoreData -> Invalid parameter:dataList, dataList be an array!!!');
        }

        return;
      }

      this._chartPane.applyMoreData(dataList, more);
    }
    /**
     * 更新数据
     * @param data
     */

  }, {
    key: "updateData",
    value: function updateData(data) {
      this._chartPane.updateData(data);
    }
    /**
     * 设置加载更多回调
     * @param cb
     */

  }, {
    key: "loadMore",
    value: function loadMore(cb) {
      this._chartPane.chartData().loadMore(cb);
    }
    /**
     * 创建一个技术指标
     * @param name 指标名
     * @param isStack 是否覆盖
     * @param paneOptions
     * @returns {string|null}
     */

  }, {
    key: "createTechnicalIndicator",
    value: function createTechnicalIndicator(name, isStack, paneOptions) {
      var technicalIndicator = this._chartPane.chartData().technicalIndicator(name);

      if (!technicalIndicator) {
        {
          console.warn('createTechnicalIndicator -> Invalid parameter: name, can not find the corresponding technical indicator!!!');
        }

        return paneOptions && paneOptions.id || null;
      }

      return this._chartPane.createTechnicalIndicator(technicalIndicator, isStack, paneOptions);
    }
    /**
     * 添加自定义技术指标
     * @param technicalIndicatorInfo
     */

  }, {
    key: "addCustomTechnicalIndicator",
    value: function addCustomTechnicalIndicator(technicalIndicatorInfo) {
      this._chartPane.chartData().addCustomTechnicalIndicator(technicalIndicatorInfo);
    }
    /**
     * 移除一个技术指标
     * @param paneId
     * @param name
     */

  }, {
    key: "removeTechnicalIndicator",
    value: function removeTechnicalIndicator(paneId, name) {
      this._chartPane.removeTechnicalIndicator(paneId, name);
    }
    /**
     * 创建图形标记
     * @param name
     * @param options
     */

  }, {
    key: "createGraphicMark",
    value: function createGraphicMark(name, options) {
      var graphicMarkMapping = this._chartPane.chartData().graphicMarkMapping();

      var GraphicMark = graphicMarkMapping[name];

      if (!GraphicMark) {
        {
          console.warn('createGraphicMark -> Invalid parameter: name, can not find the corresponding graphic mark!!!');
        }

        return null;
      }

      var id = this._chartPane.createGraphicMark(GraphicMark, options);

      if (id) {
        return id;
      }

      {
        console.warn('createGraphicMark -> Check whether the parameter options specifies a duplicate id!!!');
      }

      return null;
    }
    /**
     * 获取图形标记
     * @param id
     * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
     */

  }, {
    key: "getGraphicMark",
    value: function getGraphicMark(id) {
      return this._chartPane.chartData().getGraphicMark(id);
    }
    /**
     * 设置图形标记配置
     * @param id
     * @param options
     */

  }, {
    key: "setGraphicMarkOptions",
    value: function setGraphicMarkOptions(id, options) {
      this._chartPane.chartData().setGraphicMarkOptions(id, options);
    }
    /**
     * 添加自定义图形标记
     * @param graphicMark
     */

  }, {
    key: "addCustomGraphicMark",
    value: function addCustomGraphicMark(graphicMark) {
      this._chartPane.chartData().addCustomGraphicMark(graphicMark);
    }
    /**
     * 移除图形标记
     * @param graphicMarkId
     */

  }, {
    key: "removeGraphicMark",
    value: function removeGraphicMark(graphicMarkId) {
      if (graphicMarkId) {
        this._chartPane.chartData().removeGraphicMarkInstance({
          type: 'id',
          id: graphicMarkId
        });
      } else {
        this._chartPane.chartData().clearGraphicMark();
      }
    }
    /**
     * 创建注解
     * @param annotations
     */

  }, {
    key: "createAnnotation",
    value: function createAnnotation(annotations) {
      this._chartPane.createAnnotation(annotations);
    }
    /**
     * 移除注解
     */

  }, {
    key: "removeAnnotation",
    value: function removeAnnotation(points) {
      this._chartPane.chartData().removeAnnotation(points);
    }
    /**
     * 设置是否可以缩放
     * @param enabled
     */

  }, {
    key: "setZoomEnabled",
    value: function setZoomEnabled(enabled) {
      this._chartPane.chartData().setZoomEnabled(enabled);
    }
    /**
     * 是否可以缩放
     * @return {boolean}
     */

  }, {
    key: "isZoomEnabled",
    value: function isZoomEnabled() {
      return this._chartPane.chartData().zoomEnabled();
    }
    /**
     * 设置是否可以拖拽滚动
     * @param enabled
     */

  }, {
    key: "setScrollEnabled",
    value: function setScrollEnabled(enabled) {
      this._chartPane.chartData().setScrollEnabled(enabled);
    }
    /**
     * 是否可以拖拽滚动
     * @return {boolean}
     */

  }, {
    key: "isScrollEnabled",
    value: function isScrollEnabled() {
      return this._chartPane.chartData().scrollEnabled();
    }
    /**
     * 将值装换成像素
     * @param value
     * @param finder
     */

  }, {
    key: "convertToPixel",
    value: function convertToPixel(value, finder) {
      return this._chartPane.convertToPixel(value, finder);
    }
    /**
     * 将像素转换成值
     * @param coordinate
     * @param finder
     */

  }, {
    key: "convertFromPixel",
    value: function convertFromPixel(coordinate, finder) {
      return this._chartPane.convertFromPixel(coordinate, finder);
    }
    /**
     * 订阅图表动作
     * @param type
     * @param callback
     */

  }, {
    key: "subscribeAction",
    value: function subscribeAction(type, callback) {
      if (type === 'drawCandle' || type === 'drawTechnicalIndicator') {
        {
          console.warn('The types drawCandle and drawTechnicalIndicator have been deprecated, please use createAnnotation instead!!!');
        }
      }

      if (!this._chartPane.chartData().subscribeAction(type, callback)) {
        {
          console.warn('subscribeAction -> Invalid parameter: type, type does not exist!!!');
        }
      }
    }
    /**
     * 取消订阅图表动作
     * @param type
     * @param callback
     */

  }, {
    key: "unsubscribeAction",
    value: function unsubscribeAction(type, callback) {
      if (!this._chartPane.chartData().unsubscribeAction(type, callback)) {
        {
          console.warn('unsubscribeAction -> Invalid parameter: type, does not exist!!!');
        }
      }
    }
    /**
     * 获取将图表装换成图片后的url
     * @param includeTooltip
     * @param includeOverlay
     * @param type
     * @param backgroundColor
     */

  }, {
    key: "getConvertPictureUrl",
    value: function getConvertPictureUrl(includeTooltip, includeOverlay) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'jpeg';
      var backgroundColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#333333';

      if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
        {
          console.warn('Picture format only supports jpeg, png and bmp!!!');
        }

        return;
      }

      return this._chartPane.getConvertPictureUrl(includeTooltip, includeOverlay, type, backgroundColor);
    }
    /**
     * 销毁
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._chartPane.destroy();
    }
  }]);

  return Chart;
}();

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var instances = {};
var chartBaseId = 1;
var CHART_NAME_PREFIX = 'k_line_chart_';

function checkContainer(container) {
  return container && container instanceof HTMLElement && container.appendChild && typeof container.appendChild === 'function';
}
/**
 * 获取版本号
 * @returns {string}
 */


function version() {
  return '7.1.0';
}
/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */


function init(ds) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var errorMessage = 'Chart version is 7.1.0. The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!';
  var container;

  if (!ds) {
    {
      console.error(errorMessage);
    }

    return null;
  }

  if (typeof ds === 'string') {
    container = document.getElementById(ds);

    if (!checkContainer(container)) {
      container = document.getElementsByClassName(ds);
    }
  } else {
    container = ds;
  }

  if (!checkContainer(container)) {
    {
      console.error(errorMessage);
    }

    return null;
  }

  var chart = instances[container.chartId || ''];

  if (chart) {
    {
      console.warn('The chart has been initialized on the dom！！！');
    }

    return chart;
  }

  var id = "".concat(CHART_NAME_PREFIX).concat(chartBaseId++);
  chart = new Chart(container, style);
  chart.id = id;
  container.chartId = id;
  instances[id] = chart;
  return chart;
}
/**
 * 销毁
 * @param dcs
 */


function dispose(dcs) {
  if (dcs) {
    var id;
    var container;

    if (typeof dcs === 'string') {
      container = document.getElementById(dcs);

      if (container) {
        id = container.chartId;
      }

      if (!id) {
        container = document.getElementsByClassName(dcs);

        if (container) {
          id = container.chartId;
        }
      }
    }

    if (!id) {
      id = dcs.chartId;
    }

    if (!id && dcs instanceof Chart) {
      id = dcs.id;
    }

    if (id) {
      instances[id].destroy();
      delete instances[id];
    }
  }
}

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
extension.addTechnicalIndicator([averagePrice, bullAndBearIndex, differentOfMovingAverage, directionalMovementIndex, easeOfMovementValue, exponentialMovingAverage, movingAverage, movingAverageConvergenceDivergence, simpleMovingAverage, tripleExponentiallySmoothedAverage, brar, currentRatio, momentum, psychologicalLine, rateOfChange, volumeRatio, awesomeOscillator, bias, commodityChannelIndex, relativeStrengthIndex, stockIndicatorKDJ, williamsR, bollingerBands, stopAndReverse, onBalanceVolume, priceAndVolumeTrend, volume]);

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var horizontalRayLine = {
  name: 'horizontalRayLine',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnRayLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    var point = {
      x: 0,
      y: xyPoints[0].y
    };

    if (xyPoints[1] && xyPoints[0].x < xyPoints[1].x) {
      point.x = viewport.width;
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[xyPoints[0], point]]
    }];
  },
  performMousePressedMove: function performMousePressedMove(tpPoints, pressedPointIndex, _ref) {
    var price = _ref.price;
    tpPoints[0].price = price;
    tpPoints[1].price = price;
  },
  performMouseMoveForDrawing: function performMouseMoveForDrawing(step, tpPoints, _ref2) {
    var price = _ref2.price;

    if (step === 2) {
      tpPoints[0].price = price;
    }
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var horizontalSegment = {
  name: 'horizontalSegment',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnSegment(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints) {
    var lines = [];

    if (xyPoints.length === 2) {
      lines = [xyPoints];
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: lines
    }];
  },
  performMousePressedMove: function performMousePressedMove(tpPoints, pressedPointIndex, _ref) {
    var price = _ref.price;
    tpPoints[0].price = price;
    tpPoints[1].price = price;
  },
  performMouseMoveForDrawing: function performMouseMoveForDrawing(step, tpPoints, _ref2) {
    var price = _ref2.price;

    if (step === 2) {
      tpPoints[0].price = price;
    }
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var horizontalStraightLine = {
  name: 'horizontalStraightLine',
  totalStep: 2,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[{
        x: 0,
        y: xyPoints[0].y
      }, {
        x: viewport.width,
        y: xyPoints[0].y
      }]]
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var verticalRayLine = {
  name: 'verticalRayLine',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnRayLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    var point = {
      x: xyPoints[0].x,
      y: 0
    };

    if (xyPoints[1] && xyPoints[0].y < xyPoints[1].y) {
      point.y = viewport.height;
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[xyPoints[0], point]]
    }];
  },
  performMousePressedMove: function performMousePressedMove(tpPoints, pressedPointIndex, _ref) {
    var dataIndex = _ref.dataIndex,
        timestamp = _ref.timestamp;
    tpPoints[0].timestamp = timestamp;
    tpPoints[0].dataIndex = dataIndex;
    tpPoints[1].timestamp = timestamp;
    tpPoints[1].dataIndex = dataIndex;
  },
  performMouseMoveForDrawing: function performMouseMoveForDrawing(step, tpPoints, _ref2) {
    var timestamp = _ref2.timestamp,
        dataIndex = _ref2.dataIndex;

    if (step === 2) {
      tpPoints[0].timestamp = timestamp;
      tpPoints[0].dataIndex = dataIndex;
    }
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var verticalSegment = {
  name: 'verticalSegment',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnSegment(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints) {
    var lines = [];

    if (xyPoints.length === 2) {
      lines = [xyPoints];
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: lines
    }];
  },
  performMousePressedMove: function performMousePressedMove(tpPoints, pressedPointIndex, _ref) {
    var dataIndex = _ref.dataIndex,
        timestamp = _ref.timestamp;
    tpPoints[0].timestamp = timestamp;
    tpPoints[0].dataIndex = dataIndex;
    tpPoints[1].timestamp = timestamp;
    tpPoints[1].dataIndex = dataIndex;
  },
  performMouseMoveForDrawing: function performMouseMoveForDrawing(step, tpPoints, _ref2) {
    var timestamp = _ref2.timestamp,
        dataIndex = _ref2.dataIndex;

    if (step === 2) {
      tpPoints[0].timestamp = timestamp;
      tpPoints[0].dataIndex = dataIndex;
    }
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var verticalStraightLine = {
  name: 'verticalStraightLine',
  totalStep: 2,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[{
        x: xyPoints[0].x,
        y: 0
      }, {
        x: xyPoints[0].x,
        y: viewport.height
      }]]
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var rayLine = {
  name: 'rayLine',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnRayLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [getRayLine(xyPoints[0], xyPoints[1], {
        x: viewport.width,
        y: viewport.height
      })]
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var segment = {
  name: 'segment',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnSegment(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints) {
    var lines = [];

    if (xyPoints.length === 2) {
      lines = [xyPoints];
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: lines
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var straightLine = {
  name: 'straightLine',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    if (xyPoints.length < 2 || xyPoints[0].x === xyPoints[1].x) {
      return [{
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[{
          x: xyPoints[0].x,
          y: 0
        }, {
          x: xyPoints[0].x,
          y: viewport.height
        }]]
      }];
    }

    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[{
        x: 0,
        y: getLinearYFromPoints(xyPoints[0], xyPoints[1], {
          x: 0,
          y: xyPoints[0].y
        })
      }, {
        x: viewport.width,
        y: getLinearYFromPoints(xyPoints[0], xyPoints[1], {
          x: viewport.width,
          y: xyPoints[0].y
        })
      }]]
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var parallelStraightLine = {
  name: 'parallelStraightLine',
  totalStep: 4,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: getParallelLines(xyPoints, {
        x: viewport.width,
        y: viewport.height
      })
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var priceChannelLine = {
  name: 'priceChannelLine',
  totalStep: 4,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: getParallelLines(xyPoints, {
        x: viewport.width,
        y: viewport.height
      }, 1)
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var priceLine = {
  name: 'priceLine',
  totalStep: 2,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnRayLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) {
    return [{
      type: 'line',
      isDraw: true,
      isCheck: true,
      dataSource: [[xyPoints[0], {
        x: viewport.width,
        y: xyPoints[0].y
      }]]
    }, {
      type: 'text',
      isDraw: true,
      isCheck: false,
      dataSource: [{
        x: xyPoints[0].x,
        y: xyPoints[0].y,
        text: yAxis.convertFromPixel(xyPoints[0].y).toFixed(precision.price)
      }]
    }];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fibonacciLine = {
  name: 'fibonacciLine',
  totalStep: 3,
  checkMousePointOn: function checkMousePointOn(key, type, points, mousePoint) {
    return checkPointOnStraightLine(points[0], points[1], mousePoint);
  },
  createGraphicDataSource: function createGraphicDataSource(step, tpPoints, xyPoints, viewport, precision) {
    if (xyPoints.length > 0) {
      var lines = [];
      var texts = [];
      var startX = 0;
      var endX = viewport.width;

      if (xyPoints.length > 1) {
        var percents = [1, 0.786, 0.618, 0.5, 0.382, 0.236, 0];
        var yDif = xyPoints[0].y - xyPoints[1].y;
        var priceDif = tpPoints[0].price - tpPoints[1].price;
        percents.forEach(function (percent) {
          var y = xyPoints[1].y + yDif * percent;
          var price = (tpPoints[1].price + priceDif * percent).toFixed(precision.price);
          lines.push([{
            x: startX,
            y: y
          }, {
            x: endX,
            y: y
          }]);
          texts.push({
            x: startX,
            y: y,
            text: "".concat(price, " (").concat((percent * 100).toFixed(1), "%)")
          });
        });
      }

      return [{
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: lines
      }, {
        type: 'text',
        isDraw: true,
        isCheck: false,
        dataSource: texts
      }];
    }

    return [];
  }
};

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
extension.addGraphicMark([horizontalRayLine, horizontalSegment, horizontalStraightLine, verticalRayLine, verticalSegment, verticalStraightLine, rayLine, segment, straightLine, parallelStraightLine, priceChannelLine, priceLine, fibonacciLine]);

exports.dispose = dispose;
exports.extension = extension;
exports.init = init;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=klinecharts.js.map
