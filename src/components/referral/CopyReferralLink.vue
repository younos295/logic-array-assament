<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

const props = defineProps({
  referralCode: {
    type: String,
    required: true
  }
});

const { copy, copied } = useClipboard();
const referralLink = ref(`${window.location.origin}/ref/${props.referralCode}`);

const copyToClipboard = () => {
  copy(referralLink.value);
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const shareMessage = `Join me on this awesome platform! Use my referral code: ${props.referralCode} - ${referralLink.value}`;

const shareOnWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  window.open(url, '_blank');
};

const shareViaEmail = () => {
  const subject = 'Join me on this platform!';
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage)}`;
  window.location.href = mailtoLink;
};

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink.value)}&quote=${encodeURIComponent(shareMessage)}`;
  window.open(url, '_blank', 'width=600,height=400');
};
</script>

<template>
  <div class="bg-[url('/images/gradient.svg')] bg-cover bg-center bg-background-dark dark:bg-blue-600 rounded-lg p-4">
    <h2 class="text-2xl md:text-3xl font-semibold md:font-bold text-white mb-3">Refried friend and Get ৳10 off. Get up to ৳600</h2>
    <h3 class="font-medium text-white mb-2">Your referral invite link</h3>
    <div class="flex gap-2 my-4">
      <div class="relative flex-1">
        <input
          type="text"
          :value="referralLink"
          readonly
          class="w-full px-4 py-2 pr-12 bg-gray-50 dark:bg-transparent border border-gray-50 rounded-md text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <span v-if="copied" class="text-sm text-green-600 dark:text-green-400">
            Copied!
          </span>
        </div>
      </div>
      <button
        @click="copyToClipboard"
        class="inline-flex gap-2 items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-white focus:ring-2 focus:ring-offset-2"
      >
        <IconCopy class="h-4 w-4" />
        <span class="hidden md:block">{{ copied ? 'Copied!' : 'Copy Link' }}</span>
        <span class="block md:hidden">{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
    <div class="my-4 flex gap-2 justify-between">
      <div>
        <p class="text-white text-sm mb-2">Share with</p>
        <div class="flex items-center space-x-3">
          <!-- WhatsApp Button -->
          <button 
            @click="shareOnWhatsApp"
            class="p-2 rounded bg-white text-gray-600 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.476196 17.3687L1.66543 13.0265C0.931953 11.7558 0.546059 10.3141 0.54653 8.83729C0.54841 4.21693 4.30844 0.458008 8.92895 0.458008C11.1712 0.459102 13.2757 1.33168 14.8585 2.91561C16.4408 4.49953 17.3122 6.60483 17.3114 8.84405C17.3093 13.4641 13.5487 17.2236 8.92895 17.2236C8.92861 17.2236 8.9293 17.2236 8.92895 17.2236H8.92534C7.52259 17.2231 6.14418 16.8712 4.91978 16.2035L0.476196 17.3687Z" fill="white"/>
              <path d="M8.93208 1.87402C5.08901 1.87402 1.96369 4.9982 1.96228 8.8383C1.96171 10.1542 2.32998 11.4359 3.02735 12.5449L3.19314 12.8084L2.48914 15.3784L5.12606 14.687L5.38068 14.8379C6.45013 15.4726 7.67626 15.8082 8.92672 15.8089H8.92937C12.7695 15.8089 15.8948 12.6844 15.8963 8.84395C15.897 6.98293 15.1731 5.23291 13.8576 3.91651C12.5422 2.60011 10.7931 1.87481 8.93208 1.87402Z" fill="url(#paint0_linear_3400_3855)"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.83413 5.33452C6.67713 4.98583 6.51198 4.97877 6.36283 4.97264C6.24069 4.96746 6.10096 4.96778 5.96139 4.96778C5.82167 4.96778 5.59481 5.02021 5.40297 5.2298C5.21096 5.43939 4.6698 5.94601 4.6698 6.97653C4.6698 8.00704 5.42039 9.0027 5.52495 9.14258C5.62967 9.28231 6.97385 11.4645 9.10286 12.304C10.872 13.0017 11.232 12.8629 11.6162 12.828C12.0002 12.7932 12.8553 12.3214 13.0298 11.8324C13.2043 11.3433 13.2043 10.9243 13.1521 10.8367C13.0996 10.7493 12.9601 10.697 12.7505 10.5923C12.541 10.4876 11.5113 9.98078 11.3193 9.91092C11.1273 9.84105 10.9877 9.8062 10.848 10.0158C10.7084 10.2254 10.3073 10.697 10.185 10.8367C10.0629 10.9766 9.94074 10.994 9.73115 10.8893C9.52172 10.7843 8.84711 10.5634 8.04691 9.84985C7.42427 9.29471 7.004 8.60912 6.8817 8.39953C6.75956 8.18994 6.86867 8.07659 6.9737 7.97219C7.06774 7.87831 7.18313 7.72759 7.288 7.60529C7.3924 7.48299 7.42741 7.3957 7.49712 7.25613C7.56698 7.11625 7.53213 6.99395 7.47969 6.88924C7.42741 6.78452 7.02032 5.74867 6.83413 5.33452Z" fill="white"/>
              <defs>
              <linearGradient id="paint0_linear_3400_3855" x1="8.78747" y1="2.71026" x2="8.85814" y2="14.6184" gradientUnits="userSpaceOnUse">
              <stop stop-color="#57D163"/>
              <stop offset="1" stop-color="#23B33A"/>
              </linearGradient>
              </defs>
            </svg>
  
          </button>
  
          <button 
            @click="shareViaEmail"
            class="p-2 rounded bg-white text-gray-600 transition-colors"
            aria-label="Share via Email"
          >
            <IconMail class="h-5 w-5" />
          </button>
  
          <button 
            @click="shareOnFacebook"
            class="p-2 rounded bg-white text-gray-600 transition-colors"
            aria-label="Share on Facebook"
          >
            <IconFacebook class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <p class="text-white text-sm mb-1.5 text-right">Scan Me</p>
        <img src="/images/QR.png" >
      </div>
    </div>
    <button class="bg-blue-600 dark:bg-white text-white md:text-base text-sm dark:text-gray-800 rounded-md p-2 w-full" @click="$emit('new-connection')">Request for New Connection</button>
  </div>
</template>
