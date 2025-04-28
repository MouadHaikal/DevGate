<template>
  <div
    class="w-full max-w-4xl mx-auto mt-12 p-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl relative"
    @mousemove="handleMouseMove"
  >
    <!-- Source Logo -->
    <div class="absolute top-6 left-6">
      <img
        v-if="project.source === 'github'"
        src="../assets/logos/github-mark-white.png"
        alt="GitHub"
        class="w-10 h-10"
      />
      <img
        v-else-if="project.source === 'devto'"
        src="../assets/logos/devto-white.png"
        alt="Dev.to"
        class="w-10 h-10"
      />
      <div
        v-else
        class="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
      >
        M
      </div>
    </div>

    <!-- Project Title -->
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text">
        {{ project.title }}
      </h2>
      <p class="text-gray-400 text-sm mt-2">{{ project.source === 'manual' ? 'Ajouté manuellement' : 'Importé depuis ' + project.source }}</p>
    </div>

    <!-- Project Image -->
    <div v-if="project.imageUrl" class="w-full h-64 rounded-xl overflow-hidden mb-8 shadow-inner">
      <img :src="project.imageUrl" alt="Project image" class="object-cover w-full h-full" />
    </div>

    <!-- Description -->
    <div class="text-gray-300 leading-relaxed mb-8">
      {{ project.longDescription || project.description }}
    </div>

    <!-- Date Info -->
    <div class="text-sm text-gray-500 mb-4">
      <div>Créé le : {{ formatDate(project.createdAt) }}</div>
      <div>Modifié le : {{ formatDate(project.updatedAt) }}</div>
    </div>

    <!-- Stack Info -->
    <div v-if="project.stack?.length" class="flex flex-wrap gap-3 mb-8">
      <span
        v-for="tech in project.stack"
        :key="tech"
        class="bg-gradient-to-tr from-violet-500 to-purple-600 px-4 py-2 rounded-full text-sm text-white font-semibold"
      >
        {{ tech }}
      </span>
    </div>

    <!-- Link Button -->
    <div v-if="project.link" class="text-center">
      <a
        :href="project.link"
        target="_blank"
        class="px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:bg-gradient-to-l transition-all duration-300"
      >
        Voir le projet &nbsp;›
      </a>
    </div>

    <!-- Close Button -->
    <button
      class="absolute top-6 right-6 text-red-400 hover:text-red-500 font-bold text-lg"
      @click="$emit('close')"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
defineProps({
  project: Object
})

const handleMouseMove = (e) => {
  const { currentTarget: target } = e;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  target.style.setProperty("--mouse-x", `${x}px`);
  target.style.setProperty("--mouse-y", `${y}px`);
}

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>

</style>
