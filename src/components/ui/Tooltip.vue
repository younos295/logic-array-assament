<template>
  <div class="relative inline-block group">
    <div class="inline-block">
      <slot></slot>
    </div>
    
    <div 
      v-if="show"
      ref="tooltip"
      :class="[
        'absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-md shadow-lg',
        'bg-gray-800 dark:bg-gray-700',
        'transform transition-all duration-200 ease-in-out',
        {
          'opacity-100 scale-100': isMounted,
          'opacity-0 scale-95': !isMounted,
          'bottom-full mb-2 left-1/2 -translate-x-1/2': placement === 'top',
          'bottom-full mb-2 left-0': placement === 'top-start',
          'bottom-full mb-2 right-0': placement === 'top-end',
          'bottom-full mb-2 left-1/2 -translate-x-1/2': placement === 'top-middle',
          'top-full mt-2 left-1/2 -translate-x-1/2': placement === 'bottom',
          'top-full mt-2 left-0': placement === 'bottom-start',
          'top-full mt-2 right-0': placement === 'bottom-end',
          'top-full mt-2 left-1/2 -translate-x-1/2': placement === 'bottom-middle',
          'right-full mr-2 top-1/2 -translate-y-1/2': placement === 'left',
          'right-full mr-2 top-0': placement === 'left-start',
          'right-full mr-2 bottom-0': placement === 'left-end',
          'right-full mr-2 top-1/2 -translate-y-1/2': placement === 'left-middle',
          'left-full ml-2 top-1/2 -translate-y-1/2': placement === 'right',
          'left-full ml-2 top-0': placement === 'right-start',
          'left-full ml-2 bottom-0': placement === 'right-end',
          'left-full ml-2 top-1/2 -translate-y-1/2': placement === 'right-middle',
        }
      ]"
      role="tooltip"
    >
      {{ text }}
      <div 
        :class="[
          'absolute w-2 h-2 bg-gray-800 dark:bg-gray-700 transform rotate-45',
          {
            '-bottom-1 left-1/2 -translate-x-1/2': placement === 'top' || placement === 'top-middle',
            '-bottom-1 left-3': placement === 'top-start',
            '-bottom-1 right-3': placement === 'top-end',
            '-top-1 left-1/2 -translate-x-1/2': placement === 'bottom' || placement === 'bottom-middle',
            '-top-1 left-3': placement === 'bottom-start',
            '-top-1 right-3': placement === 'bottom-end',
            '-right-1 top-1/2 -translate-y-1/2': placement === 'left' || placement === 'left-middle',
            '-right-1 top-3': placement === 'left-start',
            '-right-1 bottom-3': placement === 'left-end',
            '-left-1 top-1/2 -translate-y-1/2': placement === 'right' || placement === 'right-middle',
            '-left-1 top-3': placement === 'right-start',
            '-left-1 bottom-3': placement === 'right-end',
          }
        ]"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    text: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      default: 'top',
      validator: (value) => {
        const validPlacements = [
          'top', 'top-start', 'top-middle', 'top-end',
          'bottom', 'bottom-start', 'bottom-middle', 'bottom-end',
          'left', 'left-start', 'left-middle', 'left-end',
          'right', 'right-start', 'right-middle', 'right-end'
        ];
        return validPlacements.includes(value);
      },
    },
    showOnHover: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false,
      isMounted: false,
      touchTimer: null,
    };
  },
  mounted() {
    this.isMounted = true;
    if (this.showOnHover) {
      this.$el.addEventListener('mouseenter', this.showTooltip);
      this.$el.addEventListener('mouseleave', this.hideTooltip);
      
      this.$el.addEventListener('touchstart', this.toggleTooltipOnMobile, { passive: true });
      
      document.addEventListener('touchstart', this.handleClickOutside, { passive: true });
    }
  },
  beforeDestroy() {
    if (this.showOnHover) {
      this.$el.removeEventListener('mouseenter', this.showTooltip);
      this.$el.removeEventListener('mouseleave', this.hideTooltip);
      this.$el.removeEventListener('touchstart', this.toggleTooltipOnMobile);
      document.removeEventListener('touchstart', this.handleClickOutside);
    }
  },
  methods: {
    showTooltip() {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      }
      this.show = true;
      this.$nextTick(() => {
        this.isMounted = true;
      });
    },
    hideTooltip() {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      }
      this.isMounted = false;
      setTimeout(() => {
        this.show = false;
      }, 200);
    },
    toggleTooltipOnMobile(event) {
      event.preventDefault();
      
      if (this.show) {
        this.hideTooltip();
        return;
      }
      
      this.showTooltip();
      
      this.touchTimer = setTimeout(() => {
        this.hideTooltip();
      }, 3000);
    },
    handleClickOutside(event) {
      if (this.show && !this.$el.contains(event.target)) {
        this.hideTooltip();
      }
    },
  },
};
</script>

<style scoped>
</style>
