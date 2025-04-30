<template>
  <div class="contribution-section">
    <h3>GitHub Contributions for {{ username }}</h3>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="contribution-heatmap">
      <div class="heatmap-grid">
        <template v-for="(day, dayIndex) in dayLabels" :key="day">
          <div class="day-label">{{ day }}</div>
          <template v-for="(week, weekIndex) in contributions" :key="weekIndex">
            <div
              v-if="week[dayIndex]"
              class="day-box"
              :style="{ backgroundColor: week[dayIndex].color }"
              :title="`${week[dayIndex].date}: ${week[dayIndex].contributionCount} contributions`"
            ></div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


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

const contributionColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

function getContributionColor(count) {
  if (count === 0) return contributionColors[0];
  if (count < 2) return contributionColors[1];
  if (count < 5) return contributionColors[2];
  if (count < 10) return contributionColors[3];
  return contributionColors[4];
}

async function fetchContributions() {
  try {
    const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    contributions.value = data.contributions || [];
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
  padding: 20px;
  background: #0d1117;
  color: white;
  border-radius: 8px;
  max-width: 100%;
}

.loading,
.error {
  color: #fff;
  margin-top: 1rem;
}

.contribution-heatmap {
  overflow-x: auto;
  margin-top: 10px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: 30px repeat(53, 12px);
  grid-template-rows: repeat(7, 12px);
  gap: 3px;
  padding: 10px;
}

.day-label {
  grid-column: 1;
  font-size: 10px;
  color: #8b949e;
  padding-right: 4px;
  height: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
}

.day-box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  transition: transform 0.2s;
}

.day-box:hover {
  transform: scale(1.2);
  z-index: 1;
}
</style>
