<script>
export default {
  name: 'MyButton',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<template>
  <button>
    <span class="text" @click="handleClick">
      <slot v-if="!text"></slot>
      <template v-else>{{ text }}</template>
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '../../styles/theme.scss';

button {
  align-items: center;
  background-image: linear-gradient(144deg, var(--ui-secondary-color), var(--ui-primary-color) 50%, var(--ui-accent-color));
  border: 0;
  border-radius: var(--ui-border-radius);
  box-shadow: var(--ui-box-shadow);
  box-sizing: border-box;
  color: var(--ui-text-color);
  display: flex;
  font-size: var(--ui-button-font-size);
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: var(--ui-button-min-width);
  padding: var(--ui-button-padding);
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--ui-transition-duration);
}

button:active,
button:hover {
  outline: 0;
}

button span {
  background-color: var(--ui-background-color);
  padding: 16px 24px;
  border-radius: calc(var(--ui-border-radius) - 2px);
  width: 100%;
  height: 100%;
  transition: 300ms;
}

button:hover span {
  background: none;
}

button:active {
  transform: scale(0.9);
}

</style>