const quotationList = [
  { category: '柜体', name: '柜体投影', spec: '', material: '18生态板', color: 'T01', count: 7, quantity: 35.6, unit: '平方', price: 0, amount: 0 },
  { category: '五金', name: '普通拉手', spec: '短拉手1_单孔拉手', material: '', color: '黑色', count: 9, quantity: 9, unit: '个', price: 199, amount: 1791 },
  { category: '五金', name: '铰链', spec: '全盖式_默认铰链', material: '', color: '', count: 42, quantity: 42, unit: '个', price: 0, amount: 0 },
  { category: '五金', name: '铰链', spec: '半盖式_默认铰链', material: '', color: '', count: 27, quantity: 27, unit: '个', price: 0, amount: 0 },
  { category: '五金', name: '灯带', spec: '1164X11X11', material: '', color: '', count: 3, quantity: 3, unit: '个', price: 0, amount: 0 },
  { category: '五金', name: '灯带', spec: '1146X11X11', material: '', color: '', count: 3, quantity: 3, unit: '个', price: 0, amount: 0 },
  { category: '五金', name: '灯带', spec: '760.6X11X11', material: '', color: '', count: 6, quantity: 6, unit: '个', price: 0, amount: 0 },
  { category: '五金', name: '灯带', spec: '367.4X11X11', material: '', color: '', count: 6, quantity: 6, unit: '个', price: 0, amount: 0 },
  { category: '柜门', name: '房间1_板式门', spec: '', material: '18四九尺', color: 'T01', count: 7, quantity: 2.34, unit: '平方', price: 0, amount: 0 },
  { category: '柜门', name: '房间1_玻璃门_灰玻', spec: '390.8*1477*18', material: '', color: '', count: 3, quantity: 1.74, unit: '平方', price: 0, amount: 0 },
  { category: '柜门', name: '房间2_板式门', spec: '', material: '18四九尺', color: 'T01', count: 7, quantity: 2.34, unit: '平方', price: 0, amount: 0 },
  { category: '柜门', name: '房间2_玻璃门_灰玻', spec: '390.8*1477*18', material: '', color: '', count: 3, quantity: 1.74, unit: '平方', price: 0, amount: 0 },
  { category: '柜门', name: '房间2_板式门', spec: '', material: '18四九尺', color: 'T01', count: 7, quantity: 2.34, unit: '平方', price: 0, amount: 0 },
  { category: '柜门', name: '房间2_玻璃门_灰玻', spec: '390.8*1477*18', material: '', color: '', count: 3, quantity: 1.74, unit: '平方', price: 0, amount: 0 },
]

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 2,
})
const numberFormatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 })

const detailBody = document.querySelector('#detailBody')
const searchInput = document.querySelector('#searchInput')
const categoryFilter = document.querySelector('#categoryFilter')
const categoryChart = document.querySelector('#categoryChart')
const chartTitle = document.querySelector('#chartTitle')
const resultCount = document.querySelector('#resultCount')
const metricButtonList = [...document.querySelectorAll('[data-metric]')]
let activeMetric = 'quantity'

function getCategorySummary(metric) {
  return quotationList.reduce((summaryMap, item) => {
    summaryMap[item.category] = (summaryMap[item.category] || 0) + item[metric]
    return summaryMap
  }, {})
}

function renderChart() {
  const summaryMap = getCategorySummary(activeMetric)
  const maxValue = Math.max(...Object.values(summaryMap), 1)
  const isAmount = activeMetric === 'amount'
  chartTitle.textContent = isAmount ? '报价金额分布' : '计价总量分布'
  categoryChart.innerHTML = Object.entries(summaryMap)
    .map(([category, value]) => {
      const width = value === 0 ? 0 : Math.max((value / maxValue) * 100, 2)
      const formattedValue = isAmount ? currencyFormatter.format(value) : numberFormatter.format(value)
      return `<div class="bar-row">
        <span class="bar-row__label">${category}</span>
        <div class="bar-row__track"><div class="bar-row__bar" style="width:${width}%"></div></div>
        <span class="bar-row__value">${formattedValue}</span>
      </div>`
    })
    .join('')
}

function getFilteredList() {
  const keyword = searchInput.value.trim().toLowerCase()
  const category = categoryFilter.value
  return quotationList.filter((item) => {
    const text = [item.name, item.spec, item.material, item.color].join(' ').toLowerCase()
    return (category === 'all' || item.category === category) && (!keyword || text.includes(keyword))
  })
}

function renderTable() {
  const filteredList = getFilteredList()
  resultCount.textContent = `共 ${filteredList.length} 条`
  if (!filteredList.length) {
    detailBody.innerHTML = '<tr><td class="empty-row" colspan="7">没有符合条件的报价明细</td></tr>'
    return
  }
  detailBody.innerHTML = filteredList.map((item) => `
    <tr>
      <td><span class="category-badge category-badge--${item.category}">${item.category}</span></td>
      <td class="cell-title"><strong>${item.name}</strong><small>${item.spec || '—'}</small></td>
      <td class="cell-title"><strong>${item.material || '—'}</strong><small>${item.color || '—'}</small></td>
      <td>${numberFormatter.format(item.count)}</td>
      <td>${numberFormatter.format(item.quantity)} ${item.unit}</td>
      <td>${currencyFormatter.format(item.price)}</td>
      <td class="amount ${item.amount === 0 ? 'amount--zero' : ''}">${currencyFormatter.format(item.amount)}</td>
    </tr>`).join('')
}

function initializeFilters() {
  const categoryList = [...new Set(quotationList.map((item) => item.category))]
  categoryFilter.insertAdjacentHTML('beforeend', categoryList.map((category) => `<option value="${category}">${category}</option>`).join(''))
}

function initializeSummary() {
  const totalAmount = quotationList.reduce((sum, item) => sum + item.amount, 0)
  document.querySelector('#totalAmount').textContent = currencyFormatter.format(totalAmount)
  document.querySelector('#itemCount').innerHTML = `${quotationList.length}<em>项</em>`
}

metricButtonList.forEach((button) => {
  button.addEventListener('click', () => {
    activeMetric = button.dataset.metric
    metricButtonList.forEach((item) => item.classList.toggle('segmented__button--active', item === button))
    renderChart()
  })
})
searchInput.addEventListener('input', renderTable)
categoryFilter.addEventListener('change', renderTable)
document.querySelector('#exportButton').addEventListener('click', () => window.print())

initializeFilters()
initializeSummary()
renderChart()
renderTable()
