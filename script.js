// script.js
const prayerForm = document.getElementById('prayer-form');
const prayerList = document.getElementById('prayer-list');
const filterStatusSelect = document.getElementById('filter-status');
const prayerProgressChart = document.getElementById('prayer-progress-chart').getContext('2d');

let prayers = JSON.parse(localStorage.getItem('prayers')) || [];

function renderPrayerList() {
  prayerList.innerHTML = '';

  const filteredPrayers = filterStatusSelect.value
    ? prayers.filter(prayer => prayer.status === filterStatusSelect.value)
    : prayers;

  filteredPrayers.forEach(prayer => {
    const prayerItem = document.createElement('div');
    prayerItem.classList.add('prayer-item');

    prayerItem.innerHTML = `
      <h3>${prayer.topic}</h3>
      <p>Date: ${prayer.date}</p>
      <p>Notes: ${prayer.notes}</p>
      <span class="badge ${getPrayerStatusClass(prayer.status)}">${prayer.status}</span>
    `;

    prayerList.appendChild(prayerItem);
  });

  updatePrayerProgressChart();
}

function getPrayerStatusClass(status) {
  switch (status) {
    case 'Praying':
      return 'badge-praying';
    case 'Answered':
      return 'badge-answered';
    case 'Unanswered':
      return 'badge-unanswered';
    default:
      return '';
  }
}

function updatePrayerProgressChart() {
  const prayingCount = prayers.filter(prayer => prayer.status === 'Praying').length;
  const answeredCount = prayers.filter(prayer => prayer.status === 'Answered').length;
  const unansweredCount = prayers.filter(prayer => prayer.status === 'Unanswered').length;

  new Chart(prayerProgressChart, {
    type: 'pie',
    data: {
      labels: ['Praying', 'Answered', 'Unanswered'],
      datasets: [{
        data: [prayingCount, answeredCount, unansweredCount],
        backgroundColor: ['#ffc107', '#28a745', '#dc3545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

prayerForm.addEventListener('submit', event => {
  event.preventDefault();

  const prayerDate = document.getElementById('prayer-date').value;
  const prayerTopic = document.getElementById('prayer-topic').value;
  const prayerNotes = document.getElementById('prayer-notes').value;

  const newPrayer = {
    date: prayerDate,
    topic: prayerTopic,
    notes: prayerNotes,
    status: 'Praying'
  };

  prayers.push(newPrayer);
  localStorage.setItem('prayers', JSON.stringify(prayers));

  prayerForm.reset();
  renderPrayerList();
});

filterStatusSelect.addEventListener('change', renderPrayerList);

renderPrayerList();