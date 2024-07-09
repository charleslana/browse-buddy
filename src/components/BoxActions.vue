<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faComputerMouse,
  faPlus,
  faSearch,
  faClock,
  faFill,
  faCircleInfo,
  faKeyboard,
  faAngleDown,
  faAngleUp,
  faEraser,
  faCopy,
  faEye,
  faEyeSlash,
  faReply,
  faRoute,
  faRotate,
  faCaretDown,
  faHandBackFist,
} from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import ModalConfirm from './ModalConfirm.vue';
import ModalAction from './ModalAction.vue';
import BoxAction from '@/interfaces/box-action';
import { ActionCategory } from '@/types/action-category';
import { runTestStore } from '@/store/run-test-store';
import { Action } from '@electron/interfaces/action';
import translate from '@/translate';
import { getIcon } from '@/utils/utils';
import { generateUUID } from '@electron/utils/utils';

defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
  isSkeleton: {
    type: Boolean,
    required: true,
  },
});

const isActive = ref(false);
const activeAction = ref('');
const currentCategory = ref<ActionCategory>('all');
const searchTerm = ref('');
const store = runTestStore();
const isConfirmModalActive = ref(false);
const actionIdToDelete = ref<string>('');
const t = translate.global.t;

const actions = computed<BoxAction[]>(() => {
  const translatedActions: BoxAction[] = [
    {
      label: t('actionWaitClick'),
      icon: faComputerMouse,
      category: 'click',
      type: 'wait-click',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionClick'),
      icon: faComputerMouse,
      category: 'click',
      type: 'click',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionFill'),
      icon: faFill,
      category: 'fill',
      type: 'fill',
      tooltip: t('fillTooltip'),
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelTextToFill'),
          placeholder: t('placeholderText'),
        },
      ],
    },
    {
      label: t('actionType'),
      icon: faKeyboard,
      category: 'fill',
      type: 'type',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelTextToType'),
          placeholder: t('placeholderText'),
        },
      ],
    },
    {
      label: t('actionClear'),
      icon: faEraser,
      category: 'fill',
      type: 'clear',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionWaitVisible'),
      icon: faEye,
      category: 'wait',
      type: 'wait-visible',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionWaitHidden'),
      icon: faEyeSlash,
      category: 'wait',
      type: 'wait-hidden',
      tooltip: t('waitHiddenTooltip'),
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionClickWaitResponse'),
      icon: faReply,
      category: 'wait',
      type: 'click-wait-response',
      inputs: [
        {
          label: t('labelClickElement'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelURLExpression'),
          placeholder: 'url',
        },
      ],
    },
    {
      label: t('navigateTo'),
      icon: faRoute,
      category: 'all',
      type: 'navigate',
      inputs: [
        {
          label: 'URL',
          placeholder: 'url',
        },
      ],
    },
    {
      label: t('actionEnter'),
      icon: faKeyboard,
      category: 'fill',
      type: 'enter',
      inputs: [],
    },
    {
      label: t('actionReload'),
      icon: faRotate,
      category: 'all',
      type: 'reload',
      inputs: [],
    },
    {
      label: t('actionSelect'),
      icon: faCaretDown,
      category: 'all',
      type: 'select',
      inputs: [
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelSelectValue'),
          placeholder: t('placeholderValue'),
        },
      ],
    },
    {
      label: t('actionDragAndDrop'),
      icon: faHandBackFist,
      category: 'all',
      type: 'drag-and-drop',
      inputs: [
        {
          label: t('labelStartSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelTargetSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
      ],
    },
    {
      label: t('actionIframeType'),
      icon: faKeyboard,
      category: 'iframe',
      type: 'iframe-type',
      inputs: [
        {
          label: t('labelSelectorIFrameText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelSelectorText'),
          placeholder: t('placeholderElement'),
          select: '#',
        },
        {
          label: t('labelTextToType'),
          placeholder: t('placeholderText'),
        },
      ],
    },
  ];
  return translatedActions;
});

const modalIcon = ref(faClock);
const modalTitle = ref('Title');
const waitIcon = ref(true);
const action = ref<Action>({} as Action);
const modalIsActive = ref(false);

function handleCloseModal(): void {
  action.value = {} as Action;
  modalIsActive.value = false;
}

function handleSaveAction(): void {
  action.value = {} as Action;
  modalIsActive.value = false;
  isActive.value = false;
  setDefaultSearchTerm();
}

function openModal(): void {
  isActive.value = true;
}

function closeModal(): void {
  isActive.value = false;
  setDefaultSearchTerm();
}

function setDefaultSearchTerm(): void {
  searchTerm.value = '';
  currentCategory.value = 'all';
}

const filteredActions = computed(() => {
  return actions.value.filter((action) => {
    if (currentCategory.value !== 'all' && action.category !== currentCategory.value) {
      return false;
    }
    if (searchTerm.value && !action.label.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return false;
    }
    return true;
  });
});

function handleActionClick(boxAction: BoxAction): void {
  modalIcon.value = boxAction.icon;
  modalTitle.value = boxAction.label;
  modalIsActive.value = true;
  waitIcon.value = boxAction.type.includes('wait');
  const inputsCopy = boxAction.inputs.map((input) => ({ ...input }));
  inputsCopy.forEach((input) => {
    input.value = '';
  });
  action.value.inputs = inputsCopy;
  action.value.type = boxAction.type;
}

function handleActionUpdate(act: Action): void {
  modalIcon.value = getIcon(act.type);
  modalTitle.value = act.title ?? '';
  waitIcon.value = act.type.includes('wait');
  const duplicatedAction = JSON.parse(JSON.stringify(act)) as Action;
  action.value = duplicatedAction;
  modalIsActive.value = true;
}

function toggleCard(actionId: string): void {
  store.toggleActionVisible(actionId);
}

function isCardVisible(isVisible?: boolean): boolean {
  if (isVisible === undefined) {
    return true;
  }
  return isVisible;
}

function handleChangeAction(event: { newIndex: number; oldIndex: number }): void {
  const { newIndex, oldIndex } = event;
  const updatedActions = [...store.runTest.actions];
  const movedAction = updatedActions.splice(oldIndex, 1)[0];
  updatedActions.splice(newIndex, 0, movedAction);
  store.setActions(updatedActions);
}

function deleteAction(actionId: string): void {
  actionIdToDelete.value = actionId;
  isConfirmModalActive.value = true;
}

function confirmDeleteAction(): void {
  isConfirmModalActive.value = false;
  store.removeAction(actionIdToDelete.value);
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}

function duplicateAction(action: Action): void {
  const index = store.runTest.actions.findIndex((a) => a.id === action.id);
  if (index !== -1) {
    const duplicatedAction = JSON.parse(JSON.stringify(action)) as Action;
    duplicatedAction.id = generateUUID();
    store.runTest.actions.splice(index + 1, 0, duplicatedAction);
  }
}

function toggleActionStatus(id: string): void {
  store.toggleActionStatus(id);
}
</script>

<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2">
        <FontAwesomeIcon :icon="faComputerMouse" />
      </span>
      <span>{{ $t('actions') }}</span>
    </div>
    <button class="button is-info" :disabled="disabled" @click="openModal">
      <span class="icon">
        <FontAwesomeIcon :icon="faPlus" />
      </span>
      <span>{{ $t('addActionsButton') }}</span>
    </button>
    <div class="py-4">
      <div :class="{ 'skeleton-block': isSkeleton }"></div>
      <VueDraggableNext :list="store.runTest.actions" @change="handleChangeAction">
        <transition-group type="transition" name="flip-list">
          <div
            class="card is-fullwidth"
            v-for="action in store.runTest.actions"
            :key="action.id"
            :class="{ 'disabled-card': action.disabled }"
          >
            <header class="card-header card-toggle is-clickable" @click="toggleCard(action.id)">
              <p class="card-header-title">
                <span class="mr-2">
                  <FontAwesomeIcon :icon="getIcon(action.type)" />
                </span>
                {{ action.title }}
              </p>
              <div class="is-flex">
                <a
                  class="card-header-icon"
                  @click.stop="toggleActionStatus(action.id)"
                  v-tooltip="action.disabled ? $t('activeText') : $t('inactiveText')"
                >
                  <FontAwesomeIcon :icon="action.disabled ? faEyeSlash : faEye" />
                </a>
                <a class="card-header-icon">
                  <FontAwesomeIcon
                    :icon="isCardVisible(action.isVisible) ? faAngleUp : faAngleDown"
                  />
                </a>
              </div>
            </header>
            <div class="card-content" :class="{ 'is-hidden': !isCardVisible(action.isVisible) }">
              <div class="content break-words">
                <div>{{ action.context }}</div>
                <div v-for="(input, index) in action.inputs" :key="index">
                  {{ `${input.select ?? ''}${input.value}` }}
                </div>
              </div>
              <footer class="buttons">
                <button
                  class="button card-footer-item is-primary"
                  @click="handleActionUpdate(action)"
                >
                  {{ $t('editButton') }}
                </button>
                <button class="button card-footer-item is-danger" @click="deleteAction(action.id)">
                  {{ $t('deleteButton') }}
                </button>
                <button class="button card-footer-item" @click="duplicateAction(action)">
                  <span class="icon is-left">
                    <FontAwesomeIcon :icon="faCopy" />
                  </span>
                  <span>{{ $t('duplicateButton') }}</span>
                </button>
              </footer>
            </div>
          </div>
        </transition-group>
      </VueDraggableNext>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        <article class="panel is-primary">
          <p class="panel-heading">{{ $t('chooseActions') }}</p>
          <p class="panel-tabs">
            <a
              :class="{ 'is-active': currentCategory === 'all' }"
              @click="currentCategory = 'all'"
              >{{ $t('filterAll') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'click' }"
              @click="currentCategory = 'click'"
              >{{ $t('actionClick') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'fill' }"
              @click="currentCategory = 'fill'"
              >{{ $t('actionFill') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'wait' }"
              @click="currentCategory = 'wait'"
              >{{ $t('actionWait') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'iframe' }"
              @click="currentCategory = 'iframe'"
              >{{ $t('actionIframe') }}</a
            >
          </p>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input
                class="input is-primary"
                type="text"
                :placeholder="t('inputSearch')"
                v-model.trim="searchTerm"
              />
              <span class="icon is-left">
                <FontAwesomeIcon :icon="faSearch" />
              </span>
            </p>
          </div>
          <a
            class="panel-block"
            v-for="boxAction in filteredActions"
            :key="boxAction.label"
            :class="{ 'is-active': activeAction === boxAction.label }"
            @mouseover="activeAction = boxAction.label"
            @mouseleave="activeAction = ''"
            @click="handleActionClick(boxAction)"
          >
            <span class="panel-icon">
              <FontAwesomeIcon :icon="boxAction.icon" />
            </span>
            <span class="buttons">
              <span> {{ boxAction.label }}</span>
              <span v-if="boxAction.tooltip" v-tooltip="boxAction.tooltip">
                <FontAwesomeIcon :icon="faCircleInfo" class="is-size-7" />
              </span>
            </span>
          </a>
        </article>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="closeModal">{{ $t('cancelButton') }}</button>
        </div>
      </footer>
    </div>
  </div>
  <ModalConfirm
    v-if="isConfirmModalActive"
    @confirm-modal="confirmDeleteAction"
    @close-modal="closeConfirmModal"
  />
  <ModalAction
    :modal-icon="modalIcon"
    :modal-title="modalTitle"
    :wait-icon="waitIcon"
    :action="action"
    @close-modal="handleCloseModal"
    @save-action="handleSaveAction"
    v-if="modalIsActive"
  />
</template>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.card {
  cursor: move;
}

.disabled-card {
  opacity: 0.5;
}
</style>
