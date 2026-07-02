<template>
  <div class="usage-page">
    <section v-for="model in usageModels" :key="model.id" class="usage-model">
      <h2>{{ model.name }}</h2>

      <div class="usage-chart-row">
        <div class="usage-chart-block">
          <div class="chart-title">
            <span>API 请求次数</span>
            <strong>{{ sumData(model.requestData) }}</strong>
          </div>
          <div
            class="usage-chart"
            :data-chart-id="`${model.id}-requests`"
          />
        </div>

        <div class="usage-chart-block">
          <div class="chart-title">
            <span>Tokens</span>
            <strong>{{ sumData(model.tokenData) }}</strong>
          </div>
          <div
            class="usage-chart"
            :data-chart-id="`${model.id}-tokens`"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  CanvasRenderer
])

const CHART_COLOR = '#1677ff'
const LABEL_COLOR = '#65718a'
const GRID_COLOR = '#d4dbea'

export default {
  name: 'Usage',
  data() {
    return {
      chartInstances: [],
      usageModels: [
        {
          id: 'deepseek-v4-pro',
          name: 'deepseek-v4-pro',
          dates: ['7-1', '7-2', '7-3', '7-4', '7-5'],
          requestData: [4, 3, 5, 2, 0],
          tokenData: [335, 248, 520, 176, 0]
        },
        {
          id: 'deepseek-v4-flash',
          name: 'deepseek-v4-flash',
          dates: ['7-1', '7-2', '7-3', '7-4', '7-5'],
          requestData: [2, 4, 3, 1, 0],
          tokenData: [807, 426, 612, 198, 0]
        }
      ]
    }
  },
  mounted() {
    this.renderCharts()
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    this.chartInstances.forEach(chart => chart.dispose())
    this.chartInstances = []
  },
  methods: {
    renderCharts() {
      this.usageModels.forEach(model => {
        this.createChart(`${model.id}-requests`, this.getRequestOption(model))
        this.createChart(`${model.id}-tokens`, this.getTokenOption(model))
      })
    },
    createChart(chartId, option) {
      const chartDom = this.$el.querySelector(`[data-chart-id="${chartId}"]`)
      if (!chartDom) {
        return
      }

      const chart = echarts.init(chartDom)
      chart.setOption(option)
      this.chartInstances.push(chart)
    },
    resizeCharts() {
      this.chartInstances.forEach(chart => chart.resize())
    },
    sumData(data) {
      return data.reduce((total, value) => total + value, 0).toLocaleString()
    },
    getBaseOption(model, maxValue) {
      return {
        animationDuration: 500,
        grid: {
          left: 42,
          right: 10,
          top: 10,
          bottom: 30
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          padding: [12, 14],
          textStyle: {
            color: '#111827',
            fontSize: 14,
            fontWeight: 600
          },
          extraCssText: 'box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16); border-radius: 10px;',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#cbd5e1',
              type: 'dashed'
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: model.dates,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: GRID_COLOR
            }
          },
          axisLabel: {
            color: LABEL_COLOR,
            fontSize: 13,
            margin: 8
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: maxValue,
          splitNumber: 2,
          axisLabel: {
            color: LABEL_COLOR,
            fontSize: 13
          },
          splitLine: {
            lineStyle: {
              color: GRID_COLOR
            }
          }
        }
      }
    },
    getRequestOption(model) {
      const maxValue = Math.max(5, ...model.requestData)
      const option = this.getBaseOption(model, maxValue)

      return {
        ...option,
        tooltip: {
          ...option.tooltip,
          formatter: params => {
            const item = params[0]
            return `${item.axisValue}<br/><span style="color:#6b7280;font-weight:600;">请求次数 ${item.value}</span>`
          }
        },
        series: [
          {
            name: '请求次数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            showSymbol: false,
            data: model.requestData,
            lineStyle: {
              color: CHART_COLOR,
              width: 2
            },
            itemStyle: {
              color: '#ffffff',
              borderColor: CHART_COLOR,
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(22, 119, 255, 0.42)' },
                { offset: 1, color: 'rgba(22, 119, 255, 0.04)' }
              ])
            }
          }
        ]
      }
    },
    getTokenOption(model) {
      const maxData = Math.max(...model.tokenData)
      const maxValue = maxData > 800 ? 1000 : 800
      const option = this.getBaseOption(model, maxValue)

      return {
        ...option,
        xAxis: {
          ...option.xAxis,
          boundaryGap: true
        },
        tooltip: {
          ...option.tooltip,
          formatter: params => {
            const item = params[0]
            return `${item.axisValue}<br/><span style="color:#6b7280;font-weight:600;">Tokens ${item.value}</span>`
          }
        },
        series: [
          {
            name: 'Tokens',
            type: 'bar',
            data: model.tokenData,
            barWidth: 14,
            itemStyle: {
              color: CHART_COLOR,
              borderRadius: [4, 4, 0, 0]
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.usage-page {
  min-height: calc(100vh - 50px);
  padding: 46px 112px 56px;
  background: #ffffff;
  color: #111827;
}

.usage-model {
  max-width: 1080px;
  margin: 0 auto 36px;

  h2 {
    margin: 0 0 18px;
    color: #111827;
    font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.25;
  }
}

.usage-chart-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 86px;
  row-gap: 20px;
}

.usage-chart-block {
  min-width: 0;
}

.chart-title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  height: 24px;
  margin-bottom: 8px;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  line-height: 24px;

  strong {
    color: #5f6670;
    font-size: 15px;
    font-weight: 700;
  }
}

.usage-chart {
  width: 100%;
  height: 178px;
}

@media (max-width: 1180px) {
  .usage-chart-row {
    grid-template-columns: 1fr;
  }

  .usage-model {
    max-width: 560px;
  }
}

@media (max-width: 640px) {
  .usage-page {
    padding: 28px 20px 36px;
  }

  .chart-title {
    font-size: 15px;

    strong {
      font-size: 15px;
    }
  }

  .usage-chart {
    height: 170px;
  }
}
</style>
