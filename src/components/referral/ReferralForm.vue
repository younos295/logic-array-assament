<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref, watch, computed } from 'vue';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  district: string;
  upazila: string;
  address: string;
  packageName: string;
};

const districts = [
  { value: 'dhaka', label: 'Dhaka' },
  { value: 'chittagong', label: 'Chittagong' },
  { value: 'sylhet', label: 'Sylhet' },
  { value: 'rajshahi', label: 'Rajshahi' },
  { value: 'khulna', label: 'Khulna' },
  { value: 'barisal', label: 'Barisal' },
  { value: 'rangpur', label: 'Rangpur' },
  { value: 'mymensingh', label: 'Mymensingh' },
];

type SelectOption = {
  value: string;
  label: string;
}

const upazilas = ref([] as SelectOption[]);

const packages: SelectOption[] = [
  { value: 'basic', label: 'Basic Package' },
  { value: 'standard', label: 'Standard Package' },
  { value: 'premium', label: 'Premium Package' },
];

const updateUpazilas = (district: string): void => {
  if (!district) {
    upazilas.value = [];
    return;
  }

  const districtLower = district.toLowerCase().trim();
  
  const upazilaMap: Record<string, Array<SelectOption>> = {
    dhaka: [
      { value: 'dhanmondi', label: 'Dhanmondi' },
      { value: 'gulshan', label: 'Gulshan' },
      { value: 'mirpur', label: 'Mirpur' },
      { value: 'uttara', label: 'Uttara' },
      { value: 'banani', label: 'Banani' },
      { value: 'mohammadpur', label: 'Mohammadpur' },
    ],
    chittagong: [
      { value: 'patenga', label: 'Patenga' },
      { value: 'halishahar', label: 'Halishahar' },
      { value: 'agrabad', label: 'Agrabad' },
      { value: 'nasirabad', label: 'Nasirabad' },
    ],
    sylhet: [
      { value: 'sylhet_sadar', label: 'Sylhet Sadar' },
      { value: 'zindabazar', label: 'Zindabazar' },
      { value: 'upashahar', label: 'Upashahar' },
    ],
    rajshahi: [
      { value: 'rajshahi_sadar', label: 'Rajshahi Sadar' },
      { value: 'shah_mokdum', label: 'Shah Mokdum' },
    ],
    khulna: [
      { value: 'khulna_sadar', label: 'Khulna Sadar' },
      { value: 'sonadanga', label: 'Sonadanga' },
    ],
    barisal: [
      { value: 'barisal_sadar', label: 'Barisal Sadar' },
      { value: 'bakerganj', label: 'Bakerganj' },
    ],
    rangpur: [
      { value: 'rangpur_sadar', label: 'Rangpur Sadar' },
      { value: 'gangachara', label: 'Gangachara' },
    ],
    mymensingh: [
      { value: 'mymensingh_sadar', label: 'Mymensingh Sadar' },
      { value: 'trishal', label: 'Trishal' },
    ]
  };
  
  const matchedDistrict = Object.keys(upazilaMap).find(key => key.toLowerCase() === districtLower);
  const matchedUpazilas = matchedDistrict ? upazilaMap[matchedDistrict] : [];
  upazilas.value = matchedUpazilas;
};

defineProps<{
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: 'submit', formData: FormValues): void;
}>();

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  district: yup.string().required('District is required'),
  upazila: yup.string().required('Upazila is required'),
  address: yup.string().required('Address is required'),
  packageName: yup.string().required('Package is required'),
});

const { handleSubmit, setFieldValue, values, resetForm } = useForm<FormValues>({
  validationSchema: schema,
  initialValues: {
    name: '',
    phone: '',
    email: '',
    district: '',
    upazila: '',
    address: '',
    packageName: ''
  } as FormValues
});

const resetFormState = () => {
  resetForm();
  upazilas.value = [];
  currentDistrict.value = '';
};

defineExpose({
  resetFormState
});

const onSubmit = handleSubmit((values: FormValues) => {
  emit('submit', values);
});
const onInvalidSubmit = (): void => {};

const currentDistrict = ref('');
const hasDistrict = computed(() => !!currentDistrict.value);

watch(() => values.district, (newVal) => {
  currentDistrict.value = newVal || '';

  if (!newVal) {
    upazilas.value = [];
    setFieldValue('upazila', '');
  } else {
    const normalized = newVal.toLowerCase().trim();
    updateUpazilas(normalized);
    setFieldValue('upazila', '');
  }
});
</script>

<template>
  <Form @submit="onSubmit" @invalid-submit="onInvalidSubmit" :validation-schema="schema" class="space-y-3 font-sans">
    <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            {{ error }}
          </h3>
        </div>
      </div>
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Full Name <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="name"
        >
          <input
            type="text"
            v-bind="field"
            id="name"
            :disabled="loading"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
            :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': errorMessage }"
            placeholder="John Doe"
          />
        </Field>
      </div>
      <ErrorMessage name="name" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Phone Number <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="phone"
        >
          <div class="relative">
            <input
              type="tel"
              v-bind="field"
              id="phone"
              :disabled="loading"
              class="pl-3 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 h-10 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
              :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': errorMessage }"
              placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
          </div>
        </Field>
      </div>
      <ErrorMessage name="phone" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Email <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="email"
        >
          <div class="relative">
            <input
              type="email"
              v-bind="field"
              id="email"
              :disabled="loading"
              class="pl-3 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 h-10 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
              :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': errorMessage }"
              placeholder="you@example.com"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </Field>
      </div>
      <ErrorMessage name="email" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="district" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        District Name <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="district"
        >
          <select
            v-bind="field"
            id="district"
            :disabled="loading"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
            :class="{ 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': errorMessage }"
          >
            <option value="" disabled selected>Select District</option>
            <option v-for="district in districts" :key="district.value" :value="district.value">
              {{ district.label }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="district" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="upazila" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Upazila Name <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage, value }"
          name="upazila"
          v-model="values.upazila"
        >
          <select
            v-bind="field"
            id="upazila"
            :disabled="loading || !hasDistrict"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
            :class="{ 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': errorMessage }"
          >
            <option value="" disabled selected>Select Upazila</option>
            <option v-for="upazila in upazilas" :key="upazila.value" :value="upazila.value">
              {{ upazila.label }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="upazila" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Address <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="address"
        >
          <input
            type="text"
            v-bind="field"
            id="address"
            :disabled="loading"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
            :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': errorMessage }"
            placeholder="House #, Road #, Area, etc."
          />
        </Field>
      </div>
      <ErrorMessage name="address" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div>
      <label for="packageName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Package Name <span class="text-gray-500">*</span>
      </label>
      <div class="mb-1">
        <Field
          v-slot="{ field, errorMessage }"
          name="packageName"
        >
          <select
            v-bind="field"
            id="packageName"
            :disabled="loading"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-2 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
            :class="{ 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': errorMessage }"
          >
            <option value="" disabled selected>Select Package</option>
            <option v-for="pkg in packages" :key="pkg.value" :value="pkg.value">
              {{ pkg.label }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="packageName" v-slot="{ message }" class="mb-1 text-sm text-red-700 dark:text-red-400">
        {{ message }}
      </ErrorMessage>
    </div>

    <div class="flex space-x-3 pt-4">
      <button
        type="submit"
        :disabled="loading"
        class="py-2 flex-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? 'Requesting...' : 'Request for New Connection' }}
      </button>
    </div>
  </Form>
</template>
