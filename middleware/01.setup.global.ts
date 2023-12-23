export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const getPublicUser = async () => {
    if (user.value) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.value.id)
      useHandleSupabaseReturnError(error)
      return data
    } else {
      useErrorNotice()
    }
  }

  const storePublicUser = (publicUser: any) => {
    const authStore = useAuthStore()
    authStore.publicUser = publicUser
  }

  const createPublicUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .insert({ user_id: user.value.id })
      .select()

    useHandleSupabaseIssue(data, error)

    if (data && data[0]) { return data[0] }
  }

  if (user.value) {
    const publicUser = await getPublicUser()

    if (publicUser && publicUser[0]) {
      storePublicUser(publicUser)
    } else {
      const newPublicUser = await createPublicUser()

      if (newPublicUser) {
        storePublicUser(newPublicUser)
      }
    }
  }
})
