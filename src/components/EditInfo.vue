<template>
  <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md md:max-w-2xl">
    <div class="flex flex-col items-center justify-around">
      <h2 class="text-2xl font-bold mb-4">Change User Information</h2>

      <div class="my-4 w-full">
        <label for="name" class="block text-gray-700 font-bold mb-2 text-left"
          ><span class="text-red-500">*</span>Name：</label
        >
        <input
          type="text"
          id="name"
          v-model="userInfo.userName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter your name"
          required />
      </div>
      <div class="my-4 w-full relative">
        <label for="email" class="block text-gray-700 font-bold mb-2 text-left"
          ><span class="text-red-500">*</span>Email：</label
        >
        <input
          type="email"
          id="email"
          v-model="userInfo.userEmail"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :class="!emailFlag ? 'border-1 border-red-500 text-red-500' : ''"
          placeholder="Enter your email"
          required />
        <p class="text-red-500 mt-2 text-[12px] absolute -bottom-5" v-if="!emailFlag">邮箱格式不正确，请重新输入</p>
      </div>
      <div class="my-4 w-full">
        <label for="tel" class="block text-gray-700 font-bold mb-2 text-left"
          ><span class="text-red-500">*</span>Tel：</label
        >
        <input
          type="text"
          id="tel"
          v-model="userInfo.userTel"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter your telephone"
          required />
      </div>
      <p class="text-red-500 text-[12px] w-full" v-if="flag">非空校验不通过，请检查</p>
      <div class="btn mt-4">
        <button
          class="bg-[#6ee7b7] hover:bg-[#3b82f6] mx-2 text-gray-700 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          @click="saveHandle">
          Save
        </button>
        <button
          class="bg-gray-100 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          @click="cancelHandle">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup name="EditInfo">
import axios from '@/libs/api.js';
import { computed, onMounted, ref, toRefs, defineProps, defineEmits } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const { userInfo } = defineProps(['userInfo']);
const emit = defineEmits(['cancel-handle']);

const flag = ref(false);
const saveHandle = async () => {
  const res = validate();
  if (res && emailFlag.value) {
    const flag = await ElMessageBox.confirm('确定完成修改吗?', '温馨提示', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    });

    try {
      const r = await axios.post('/writeUserInfo', {
        ...userInfo,
      });
      if (r.status === 200) {
        ElMessage({
          type: 'success',
          message: '修改成功，3秒后跳转。。。',
        });

        setTimeout(() => {
          emit('cancel-handle', false);
        }, 3000);
      } else {
        ElMessage({
          type: 'warning',
          message: '修改失败',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  // isEdit.value = false;
};

const cancelHandle = () => {
  emit('cancel-handle', false);
};

//实际开发中使用ui库的表单校验
//这里只做了必填校验
const validate = () => {
  if (!userInfo.userEmail || !userInfo.userTel || !userInfo.userName) {
    flag.value = true;
    return false;
  } else {
    flag.value = false;
  }

  return true;
};

// 实际开发中，需要对用户输入的值进行校验，比如手机号，邮箱，密码等
// 这里只做了邮箱的校验，
const emailFlag = computed(() => {
  const reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
  return reg.test(userInfo.userEmail);
});
</script>
