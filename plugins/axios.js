export default ({ $axios, $toast, store, $isJson }, inject) => {

  $axios.onRequest(function() {
    // store.dispatch('toggleLoading', true)
  })

  $axios.onResponse(function(response) {
    // store.dispatch('toggleLoading', false)
    const res = response.data
    if (!res) $toast.error('No response')
    else if (!res.success) $toast.error(res.message)
  })

  $axios.onError(function (error) {
    // store.dispatch('toggleLoading', false)

    if (error.response === undefined) {
      $toast.error('Network Error: Please refresh and try again.')
      throw error
    }

    const res = error.response
    if (res.status === 404) {
      $toast.error('Resource does not exist on server')
      throw error
    }

    const data = res.data
    if (!data) {
      $toast.error(res.messageerror)
      throw error
    }

    if ($isJson(data)) {
      if (data.message.toLowerCase() === 'unauthorized') throw error
      const messages = data.message.split(', ').map(m => m.trim())
      for (const msg of messages) $toast.error(msg)
    } else $toast.error('an error occurred')

    throw error
  })
}
