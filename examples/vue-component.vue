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
  },
  initialDate: {
    type: Date,
    default: undefined
  },
  showGregorian: {
    type: Boolean,
    default: true
  },
  useAmharic: {
    type: Boolean,
    default: true
  },
  useEthiopicNumbers: {
    type: Boolean,
    default: false
  },
  mergedView: {
    type: Boolean,
    default: false
  },
  primaryCalendar: {
    type: String,
    default: 'ethiopian',
    validator: (value) => ['ethiopian', 'gregorian'].includes(value)
  }
});

const emit = defineEmits(['select']);

const inputRef = ref(null);
const selectedDate = ref('');
let calendar = null;

onMounted(() => {
  calendar = new EthiopianCalendarUI({
    inputElement: inputRef.value,
    initialDate: props.initialDate,
    showGregorian: props.showGregorian,
    useAmharic: props.useAmharic,
    useEthiopicNumbers: props.useEthiopicNumbers,
    mergedView: props.mergedView,
    primaryCalendar: props.primaryCalendar,
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
    
    <!-- Basic usage -->
    <EthiopianDatePicker @select="handleDateSelect" />
    
    <!-- With Ethiopic numerals -->
    <EthiopianDatePicker 
      @select="handleDateSelect" 
      :useEthiopicNumbers="true"
    />
    
    <!-- Merged view with Gregorian as primary -->
    <EthiopianDatePicker 
      @select="handleDateSelect" 
      :mergedView="true"
      primaryCalendar="gregorian"
    />
    
    <!-- With initial date (Ethiopian New Year 2017) -->
    <EthiopianDatePicker 
      @select="handleDateSelect" 
      :initialDate="new Date(2024, 8, 11)"
    />
    
    <!-- English names -->
    <EthiopianDatePicker 
      @select="handleDateSelect" 
      :useAmharic="false"
    />
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
