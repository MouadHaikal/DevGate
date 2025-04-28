<template>
  <div
    class="card hover:shadow-violet-500 relative group transition-all duration-300 rounded-xl overflow-hidden w-full"
    @mousemove="handleMouseMove"
  >
    <div class="card-content p-6 flex flex-row text-left items-center gap-6">
      <!-- Image rectangle du projet -->
      <div
        v-if="project.imageUrl"
        class="w-1/2 min-w-[250px] h-40 bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center rounded-lg overflow-hidden"
      >
        <img
          :src="project.imageUrl"
          alt="Project Image"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- Texte et infos du projet -->
      <div class="flex flex-col flex-1">
        <!-- Logo de la source -->
        <div class="mb-2">
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

        <!-- Titre -->
        <div class="fancy-title bg-gradient-to-r from-violet-400 to-purple-400 mb-2">
          {{ project.title }}
        </div>

        <hr class="fancy-hr" />

        <!-- Description -->
        <p class="desc mt-4 text-gray-400">
          {{ project.description }}
        </p>

        <!-- Voir plus -->
        <button
          class="fancyButton fancyButton-purple mt-6 self-start"
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
/* Ton style fancy-title, fancy-hr, fancyButton reste ici */
</style>
