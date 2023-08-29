export const useAuthStore = defineStore("auth", () => {
  const statusMsg = ref("")
  const isError = ref(false)

  const resetAuthStore = () => {
    statusMsg.value = ""
    isError.value = false
  }

  return { statusMsg, isError, resetAuthStore }
})
