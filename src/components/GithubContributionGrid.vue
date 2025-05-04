<template>
  <div class="contribution-section">
    <h3>GitHub Contributions for {{ username }}</h3>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="contribution-heatmap">
      <div
        class="heatmap-grid"
        :style="{
          width: `${30 + structuredWeeks.length * 14 + (structuredWeeks.length - 1) * 4}px`,
          gridTemplateColumns: `30px repeat(${structuredWeeks.length}, 14px)`
        }"
      >
        <!-- Day labels (left column) -->
        <template v-for="(day, index) in dayLabels" :key="index">
          <div class="day-label">{{ day }}</div>
        </template>

        <!-- Loop through each week (columns) -->
        <template v-for="(week, weekIndex) in structuredWeeks" :key="weekIndex">
          <!-- Each day in the week (rows) -->
          <template v-for="(day, dayIndex) in week" :key="dayIndex">
            <div
              class="day-box"
              :title="`${day.date}: ${day.contributionCount} contributions`"
              :style="{
                backgroundColor: getContributionColor(day.contributionCount),
                gridRow: dayIndex + 1,
                gridColumn: weekIndex + 2
              }"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';


const props = defineProps(
    {
      username: String
    }
)

const username = props.username// remplace avec ton username
const loading = ref(true);
const error = ref(null);
const contributions = ref([]);
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const contributionColors = [
  "#181622", // much darker for empty
  "#a996f7", // low
  "#7e5bef", // medium
  "#6c47d9", // high
  "#a084e8"  // very high
];

function getContributionColor(count) {
  if (count === 0) return contributionColors[0];
  if (count < 2) return contributionColors[1];
  if (count < 5) return contributionColors[2];
  if (count < 10) return contributionColors[3];
  return contributionColors[4];
}


const token = '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';


const structuredWeeks = ref([]); // use this for rendering

const monthLabels = computed(() => []);

async function fetchContributions() {
  try {
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!res.ok) throw new Error('GitHub API error');
    const json = await res.json();

    const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;

    // Find the week index where the 12th month ago starts
    const now = new Date();
    let monthsFound = 0;
    let startIdx = weeks.length - 1;
    let lastMonth = null;
    for (let i = weeks.length - 1; i >= 0; i--) {
      const week = weeks[i];
      const firstDay = week.contributionDays[0];
      if (!firstDay) continue;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthsFound++;
        lastMonth = month;
      }
      if (monthsFound === 12) {
        startIdx = i;
        break;
      }
    }
    structuredWeeks.value = weeks.slice(startIdx).map(week => week.contributionDays);

  } catch (err) {
    error.value = err.message || 'Failed to load contributions.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  console.log(username)


  fetchContributions();
});
</script>

<style scoped>
.contribution-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.10) 100%);
  border-radius: 14px;
  border: 1.5px solid rgba(126, 91, 239, 0.10);
  box-shadow: 0 4px 16px 0 rgba(126, 91, 239, 0.08);
  color: #f0f6fc;
}

.loading,
.error {
  color: #f0f6fc;
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.12) 100%);
  border: 1.5px solid rgba(126, 91, 239, 0.15);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(126, 91, 239, 0.15);
  padding: 20px;
  border-radius: 16px;
}

.contribution-heatmap {
  overflow-x: auto;
  margin-top: 10px;
  display: block;
  justify-content: unset;
}

.heatmap-grid {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-rows: repeat(7, 14px);
  gap: 4px;
  padding: 12px;
}

.day-label {
  grid-column: 1;
  font-size: 12px;
  color: #c9d1d9;
  padding-right: 6px;
  height: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
}

.day-box {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: transparent;
}

.day-box:hover {
  transform: scale(1.2);
  z-index: 1;
  box-shadow: 0 2px 8px 0 rgba(126, 91, 239, 0.18);
}

.months-row,
.month-label,
.month-label-spacer {
  display: none;
}

.activity-chart {
  margin-bottom: 30px;
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.10) 100%);
  border-radius: 14px;
  padding: 20px;
  border: 1.5px solid rgba(126, 91, 239, 0.10);
  box-shadow: 0 4px 16px 0 rgba(126, 91, 239, 0.08);
}
</style>
