<template>
  <input
    ref="inputRef"
    type="text"
    :value="selectedDate"
    :placeholder="placeholder"
    @click="showCalendar"
    readonly
    class="ethiopian-date-input"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EthiopianCalendarUI } from 'ethcal-ui';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Select date'
  }
});

const emit = defineEmits(['select']);

const inputRef = ref(null);
const selectedDate = ref('');
let calendar = null;

onMounted(() => {
  calendar = new EthiopianCalendarUI({
    inputElement: inputRef.value,
    onSelect: (date) => {
      const eth = date.ethiopian;
      selectedDate.value = `${eth.day}/${eth.month}/${eth.year}`;
      emit('select', date);
    }
  });
});

onUnmounted(() => {
  calendar?.destroy();
});

const showCalendar = () => {
  calendar?.show();
};
</script>

<style scoped>
.ethiopian-date-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  cursor: pointer;
}
</style>

<!--
Example usage in a Vue app:

<template>
  <div>
    <h1>Ethiopian Calendar</h1>
    <EthiopianDatePicker @select="handleDateSelect" />
  </div>
</template>

<script setup>
import EthiopianDatePicker from './EthiopianDatePicker.vue';

const handleDateSelect = (date) => {
  console.log('Ethiopian:', date.ethiopian);
  console.log('Gregorian:', date.gregorian);
};
</script>
-->
