<template>
  <div class="add-project-form">
    <h3 class="form-title">Add a New Project</h3>
    <form @submit.prevent="addProject">
      <div class="form-group">
        <label>Title</label>
        <input v-model="title" type="text" required placeholder="Project title" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" rows="3" placeholder="Project description"></textarea>
      </div>
      <div class="form-group">
        <label>Stack (comma separated)</label>
        <input v-model="stack" type="text" placeholder="e.g. Vue, Firebase, Tailwind" />
      </div>
      <div class="form-group">
        <label>Image URL (optional)</label>
        <input v-model="imageUrl" type="text" placeholder="https://..." />
      </div>
      <button type="submit" :disabled="loading">Add Project</button>
      <div v-if="success" class="success-message">Project added successfully!</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { doc, updateDoc, arrayUnion, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../composables/useFirestore';

const props = defineProps({
  userId: { type: String, required: true }
});

const emit = defineEmits(['successfully-added']);

const title = ref('');
const description = ref('');
const stack = ref('');
const imageUrl = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');

async function addProject() {
  loading.value = true;
  error.value = '';
  success.value = false;
  try {
    const project = {
      title: title.value,
      description: description.value,
      stack: stack.value.split(',').map(s => s.trim()).filter(Boolean),
      imageUrl: imageUrl.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'manual'
    };
    const userDocRef = doc(db, 'Users', props.userId);
    await updateDoc(userDocRef, {
      projects: arrayUnion(project)
    });

    // Add notification
    await addDoc(collection(db, 'Notifications'), {
      userId: props.userId,
      created_At: serverTimestamp(),
      type: 'created-project',
      content: project.title
    });

    success.value = true;
    emit('successfully-added');
    // Reset form
    title.value = '';
    description.value = '';
    stack.value = '';
    imageUrl.value = '';
  } catch (e) {
    error.value = e.message || 'Failed to add project.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.add-project-form {
  background: rgba(24, 25, 38, 0.9);
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}
.form-title {
  color: #a996f7;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  color: #b8a4e3;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #a996f7;
  background: #181622;
  color: #f0f6fc;
  font-size: 1rem;
}
button {
  background: linear-gradient(to right, #a996f7, #7e5bef);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.success-message {
  color: #22d3ee;
  margin-top: 1rem;
}
.error-message {
  color: #f87171;
  margin-top: 1rem;
}
</style> 