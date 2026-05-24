const frame = document.getElementById('tool-frame')
const tabs = document.querySelectorAll('.tab')
const BASE = 'https://devtoolssuite.dev'

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    frame.src = BASE + tab.dataset.path
  })
})
