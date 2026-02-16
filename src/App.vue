<script setup>
import { ref, onMounted, computed, watch } from "vue"
import Tooltip from "bootstrap/js/dist/tooltip"
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import Fuse from "fuse.js"


const qnaList = ref([])
const search = ref("")
const autoCopied = ref(false)
const copyBtns = ref([])
const fuse = ref(null)

onMounted(async () => {
  const res = await fetch(import.meta.env.BASE_URL + "quiz.json")
  qnaList.value = await res.json()

  fuse.value = new Fuse(qnaList.value, {
    keys: ["question", "answer"],
    threshold: 0.35,        // lower = stricter, higher = fuzzier
    ignoreLocation: true
  })
})

const filteredList = computed(() => {
  if (!search.value.trim()) return qnaList.value

  return fuse.value
    ? fuse.value.search(search.value).map(r => r.item)
    : []
})

watch(filteredList, async (newList) => {
  if (newList.length === 1 && copyBtns.value.length === 1 && !autoCopied.value) {
    const answer = newList[0].answer
    const btn = copyBtns.value[0]

    toClipboard(answer)
    showTooltip(btn)

    autoCopied.value = true
  }

  if (newList.length !== 1) {
    autoCopied.value = false
  }
})


const copySuccess = async (e) => {
  const button = e.trigger

  showTooltip(button)
}

const showTooltip = (button) => {
  let tooltip = Tooltip.getInstance(button)
  if (!tooltip) {
    tooltip = new Tooltip(button, {
      title: "Copied!",
      trigger: "manual",
      placement: "top"
    })
  }

  tooltip.show()

  setTimeout(() => {
    tooltip.hide()
  }, 1200)
}

</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Quiz Q&A</h2>

    <!-- Search Box -->
    <div class="input-group mb-3">
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Search question or answer..."
      />
      <button class="btn btn-outline-secondary" type="button">
        <i class="bi bi-x-lg" @click="search=''"></i>
      </button>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped align-middle">
        <thead class="table-dark">
          <tr>
            <th style="width: 60%">Question</th>
            <th style="width: 40%" colspan="2">Answer</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredList" :key="item.id">
            <td>{{ item.question }}</td>
            <td>
              <span class="user-select-all">
                {{ item.answer }}
              </span>
            </td>
            <td class="text-center">
              <button
                ref="copyBtns"
                class="btn btn-sm btn-outline-secondary"
                v-clipboard:copy=item.answer
                v-clipboard:success="copySuccess"
                data-bs-toggle="tooltip"
                data-bs-title="Copy"
              >
                <i class="bi bi-clipboard"></i>
              </button>
            </td>
          </tr>

          <tr v-if="filteredList.length === 0">
            <td colspan="3" class="text-center text-muted">
              No results found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>