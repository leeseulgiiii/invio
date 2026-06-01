import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const WEEKS = ['1주', '2주', '3주', '4주', '5주']

const ITEMS = [
  { key: 'milk',  label: '우유',    unit: '팩',  data: [32, 28, 24, 30, 16], color: '#1D9E75' },
  { key: 'bean',  label: '원두',    unit: '박스', data: [2, 2, 1, 2, 1],     color: '#378ADD' },
  { key: 'cream', label: '휘핑크림', unit: '병',  data: [3, 2, 3, 2, 1],     color: '#7F77DD' },
]

function Graph() {
  const [active, setActive] = useState('milk')
  const chartRef = useRef(null)
  const canvasRef = useRef(null)

  const current = ITEMS.find((i) => i.key === active)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.data.datasets[0].data = current.data
      chartRef.current.data.datasets[0].label = `${current.label} (${current.unit})`
      chartRef.current.data.datasets[0].borderColor = current.color
      chartRef.current.data.datasets[0].backgroundColor = current.color + '22'
      chartRef.current.data.datasets[0].pointBackgroundColor = current.color
      chartRef.current.update()
      return
    }

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: WEEKS,
        datasets: [{
          label: `${current.label} (${current.unit})`,
          data: current.data,
          borderColor: current.color,
          backgroundColor: current.color + '22',
          pointBackgroundColor: current.color,
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.35,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true },
        },
      },
    })
  }, [active])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">그래프</h1>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex gap-2 mb-4">
            {ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={
                  active === item.key
                    ? { background: item.color, color: '#fff' }
                    : { background: 'transparent', color: '#888', border: '0.5px solid #e5e7eb' }
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', height: '180px' }}>
            <canvas ref={canvasRef} />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">5주 평균</span>
            <span className="text-sm font-semibold" style={{ color: current.color }}>
              {(current.data.reduce((a, b) => a + b, 0) / current.data.length).toFixed(1)}
              {current.unit} / 주
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Graph;