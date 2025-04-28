<template>
  <div
    class="max-w-4xl mb-3 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-violet-500 transition-all duration-300 relative group w-full"
    @mousemove="handleMouseMove"
  >
    <div class="flex flex-row p-6 gap-6 items-start">
      <!-- Image -->
      <div
        v-if="project.imageUrl"
        class="w-48 h-48 bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center rounded-lg overflow-hidden shrink-0"
      >
        <img
          :src="project.imageUrl"
          alt="Project Image"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- Text content -->
      <div class="flex flex-col flex-1 text-left">
        <!-- Source logo -->
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

        <!-- Fancy horizontal rule -->
        <hr class="fancy-hr mb-4" />

        <!-- Description -->
        <p class="mt-4 text-gray-500 text-base">
          {{ project.description }}
        </p>

        <!-- Voir plus button -->
        <button
          class="fancy-button mt-6 self-start px-4 py-2 text-white font-semibold rounded-lg transition"
          @click="$emit('select', project)"
        >
          Voir Détail ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: Object,
})

const handleMouseMove = (e) => {
  const { currentTarget: target } = e;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  target.style.setProperty("--mouse-x", `${x}px`);
  target.style.setProperty("--mouse-y", `${y}px`);
}
</script>

<style scoped>
/* Fancy title styles */
.fancy-title {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #7e5bef, #9b4de2);
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

/* Fancy horizontal rule */
.fancy-hr {
  border-top: 2px solid #7e5bef;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* Fancy button style */
.fancy-button {
  background-color: #7e5bef;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.fancy-button:hover {
  background-color: #9b4de2;
}

</style>
