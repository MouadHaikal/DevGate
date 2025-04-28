<template>
  <section class="w-full min-h-screen pt-20 fade-edge">
    <!-- Affichage du détail du projet sélectionné -->
    <div v-if="selectedProject">
      <CardProjectDetail :project="selectedProject" @close="selectedProject = null" />
    </div>
    <!-- Affichage des cartes de projet si aucun projet n'est sélectionné -->
    <div v-else class="w-full mx-auto py-10 flex flex-col gap-8">
      <CardProject
        v-for="(project, index) in projects"
        :key="index"
        :project="project"
        @select="selectProject"
        class="w-full"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CardProject from '../components/CardProject.vue';
import CardProjectDetail from '../components/CardProjectDetails.vue';
import { fetchGithubProjects } from '../composables/useGithub.js';
import { fetchDevtoProjects } from '../composables/useDevto.js';
import { fetchManualProjects } from '../composables/useUser.js';

const projects = ref([]);
const selectedProject = ref(null);

onMounted(async () => {
  const github = await fetchGithubProjects('Nasrouhg24');
  const devto = await fetchDevtoProjects('ben');
  const manual = await fetchManualProjects('userIdFirestore');

  projects.value = [...github, ...devto, ...manual]
      .sort((a, b) => b.createdAt - a.createdAt); // Tri décroissant par date
});

function selectProject(project) {
  selectedProject.value = project;
}
</script>
