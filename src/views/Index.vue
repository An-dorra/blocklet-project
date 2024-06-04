<template>
  <div class="bg-gradient-to-r from-[#6ee7b7] to-[#3b82f6] min-h-screen flex items-center justify-center p-10 md:p-0">
    <div v-if="!isEdit" class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md md:max-w-2xl">
      <div class="flex flex-col md:flex-row items-center">
        <div class="w-full md:w-1/2 mb-4 md:mb-0">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User Avatar"
            class="w-32 h-32 rounded-full mx-auto md:mx-0 shadow-lg" />
        </div>
        <div class="w-full md:w-1/2 text-center md:text-left">
          <h2 class="text-2xl font-bold mb-6 text-[#6ee7b7] text-ellipsis">
            {{ userInfo.userName || '' }}
          </h2>
          <div class="flex items-center justify-center md:justify-start mb-6">
            <svg class="w-5 h-5 text-[#3b82f6] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span class="text-gray-600"> {{ userInfo.userEmail || '' }}</span>
          </div>
          <div class="flex items-center justify-center md:justify-start mb-6">
            <svg class="w-5 h-5 text-[#3b82f6] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span class="text-gray-600"> {{ userInfo.userTel || '' }}</span>
          </div>
          <div class="flex items-center mt-10 justify-center md:justify-start">
            <button
              class="bg-[#6ee7b7] hover:bg-[#3b82f6] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mr-2"
              @click="changeStatus">
              Change
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditUserInfo @cancel-handle="cancelHandle" :userInfo="userInfo" v-else />
  </div>
</template>
  <script setup name="Test">
import axios from '@/libs/api.js';
import { onMounted, reactive, ref, toRefs } from 'vue';
import EditUserInfo from '@/components/EditInfo.vue';
let userInfo = ref('');
const isEdit = ref(false);

onMounted(() => {
  getUserInfo();
});

const cancelHandle = (val) => {
  isEdit.value = val;
  getUserInfo();
};

const changeStatus = () => {
  isEdit.value = true;
};

//优化：利用缓存，减少请求
const getUserInfo = async () => {
  try {
    const { data } = await axios.get('/getUserInfo');
    userInfo.value = data;
  } catch (err) {
    console.log(err);
  }
};
</script>
