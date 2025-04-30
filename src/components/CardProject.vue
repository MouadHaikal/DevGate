<template>
  <div
    class="interactive-glass-card relative rounded-3xl overflow-hidden p-1 w-full mb-6"
    @mousemove="handleMouseMove"
    @mouseleave="resetMouse"
    ref="card"
  >
    <div class="flex flex-row p-6 gap-6 items-start profile-card bg-transparent w-full">

      <!-- Project Image -->
      <div
        v-if="project.imageUrl"
        class="w-48 h-48 bg-gray-800/50 rounded-lg overflow-hidden shrink-0 flex justify-center items-center"
      >
        <img
          :src="project.imageUrl"
          alt="Project Image"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- Text content -->
      <div class="flex flex-col flex-1 text-left">

        <!-- Source Logo -->
        <div class="mb-2 flex justify-end">
          <img
            v-if="project.source === 'github'"
            src="../assets/logos/github-mark-white.png"
            alt="GitHub"
            class="w-8 h-8"
          />
          <img
            v-else-if="project.source === 'devto'"
            src="../assets/logos/devto-white.png"
            alt="Dev.to"
            class="w-8 h-8"
          />
          <div
            v-else
            class="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            M
          </div>
        </div>

        <!-- Title -->
        <div class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {{ project.title }}
        </div>

        <!-- Horizontal rule -->
        <hr class="fancy-hr mb-4" />

        <!-- Description -->
        <p class="text-gray-400 text-base">
          {{ project.description }}
        </p>

        <!-- Voir plus button -->
        <button
          class="fancy-button mt-6 self-start px-5 py-2 text-white font-semibold rounded-lg transition"
          @click="$emit('select', project)"
        >
          Voir Détail ›
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  project: Object,
})

const card = ref(null)

const handleMouseMove = (e) => {
  const { currentTarget: target } = e
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  target.style.setProperty('--mouse-x', `${x}px`)
  target.style.setProperty('--mouse-y', `${y}px`)
}

const resetMouse = () => {
  card.value.style.setProperty('--mouse-x', `-9999px`)
  card.value.style.setProperty('--mouse-y', `-9999px`)
}
</script>

<style scoped>
/* Fancy title */
.fancy-title {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #7e5bef, #9b4de2);
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

/* Fancy HR */
.fancy-hr {
  border-top: 2px solid #7e5bef;
  width: 100%;
}

/* Fancy button */
.fancy-button {
  background: linear-gradient(to right, #7e5bef, #9b4de2);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}
.fancy-button:hover {
  background: linear-gradient(to right, #9b4de2, #7e5bef);
}

/* Glass effect */
.profile-card {
  background: transparent;
  box-shadow: none;
  transition: transform 0.4s ease;
}
.profile-card:hover {
  transform: translateY(-4px);
}

.interactive-glass-card {
  background: rgba(24, 25, 38, 0.9);
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  transition: transform 0.4s ease, background 0.4s ease, border 0.4s ease;
}
.interactive-glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(168, 85, 247, 0.15),
    transparent 60%
  );
  transition: background 0.4s ease;
  z-index: 1;
}
.interactive-glass-card:hover {
  border-color: rgba(168, 85, 247, 0.4);
}
</style>
