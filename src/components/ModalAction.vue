<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { IconDefinition, faClock } from '@fortawesome/free-solid-svg-icons';
import { runTestStore } from '@/store/run-test-store';
import { Action } from '@electron/interfaces/action';
import translate from '@/translate';
import { SelectOption } from '@electron/types/select-option';
import { Input } from '@electron/interfaces/input';
import { generateUUID } from '@electron/utils/utils';

onMounted(() => {
  if (actionCopy.value.id) {
    context.value = actionCopy.value.context;
  }
  actionCopy.value.inputs.forEach((input, index) => {
    selectedType.value[index] = input.select ?? '#';
  });
});

const props = defineProps({
  modalIcon: {
    type: Object as () => IconDefinition,
    required: true,
  },
  modalTitle: {
    type: String,
    required: true,
  },
  waitIcon: {
    type: Boolean,
  },
  action: {
    type: Object as () => Action,
    required: true,
  },
});

const emit = defineEmits(['close-modal', 'save-action']);

const selectedType = ref<SelectOption[]>([]);
const store = runTestStore();
const context = ref<string | undefined>();
const actionCopy = ref<Action>({ ...props.action });
const t = translate.global.t;
const selectOptions = computed<{ value: SelectOption; text: string }[]>(() => {
  const options: { value: SelectOption; text: string }[] = [
    { value: '#', text: t('optionOne') },
    { value: '.', text: t('optionTwo') },
    { value: 'xpath/', text: t('optionThree') },
  ];
  return options;
});

const isSaveButtonDisabled = computed(() => {
  return actionCopy.value.inputs.some(input => input.value === undefined || input.value === '');
});

watch(context, newValue => {
  if (newValue === '') {
    context.value = undefined;
  }
});

function handleSelectChange(input: Input, event: Event): void {
  const target = event.target as HTMLSelectElement;
  input.select = target.value as SelectOption;
}

function closeModal(): void {
  emit('close-modal');
}

function saveAction(): void {
  emit('save-action');
  actionCopy.value.context = context.value;
  if (actionCopy.value.id) {
    store.updateAction({
      ...actionCopy.value,
      inputs: actionCopy.value.inputs,
    });
    return;
  }
  store.addAction({
    id: generateUUID(),
    type: actionCopy.value.type,
    context: actionCopy.value.context,
    inputs: actionCopy.value.inputs,
    title: props.modalTitle,
  });
}
</script>

<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="mr-4">
            <FontAwesomeIcon :icon="modalIcon" />
          </span>
          <span>{{ modalTitle }}</span>
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <VTooltip class="is-block is-size-5 has-text-centered" v-if="waitIcon">
          <FontAwesomeIcon :icon="faClock" />
          <template #popper>
            <span class="is-block">{{ $t('iconTitleTooltip') }}</span>
            <span>{{ $t('iconMessageTooltip') }}</span>
          </template>
        </VTooltip>
        <div class="field">
          <label class="label">{{ $t('labelContext') }}</label>
          <input
            class="input is-medium"
            type="text"
            :placeholder="$t('labelContextExample')"
            v-model.trim="context"
          />
        </div>
        <div class="field" v-if="action.inputs.length === 0">{{ modalTitle }}</div>
        <div class="field" v-for="(input, index) in action.inputs" :key="index" v-else>
          <div class="field" v-if="input.select">
            <label class="label">{{ $t('selectInput') }}</label>
            <div class="select">
              <select v-model="selectedType[index]" @change="handleSelectChange(input, $event)">
                <option v-for="(option, index) in selectOptions" :key="index" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">{{ input.label }}</label>
            <input
              class="input is-medium"
              type="text"
              :placeholder="input.placeholder"
              v-model.trim="input.value"
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="saveAction" :disabled="isSaveButtonDisabled">
            {{ $t('saveButton') }}
          </button>
          <button class="button" @click="closeModal">{{ $t('backButton') }}</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
