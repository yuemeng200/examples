<template>
  <div class="test-card">
    <github-card :packageInfo="packageInfo"/>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import GithubCard from './GithubCard.vue';
import mockData from '../../mock/package';

const {
  name,
  description,
  stars,
  forks,
  watchers,
  mainLanguage,
  languages,
  topics,
  url,
  createdAt,
  owner
} = mockData

const packageInfo = reactive({
  name,
  description,
  stars,
  forks,
  watchers,
  mainLanguage,
  languages,
  topics,
  url,
  createdAt,
  owner
});
</script>

<style scoped lang="less">

</style>