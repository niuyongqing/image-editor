// 发送窗口通信
export function usePostMessage() {
  const targetWindow = window.opener
  if (targetWindow) {
    targetWindow.postMessage('refresh', targetWindow.location.origin)
  }
}

// 接收窗口通信并刷新列表
export function useReceiveMessage(fn) {
  window.addEventListener('message', receiveMessage)

  onBeforeUnmount(() => {
    window.removeEventListener('message', receiveMessage)
  })

  function receiveMessage(event) {
    if (event.origin === window.location.origin && event.data === 'refresh') {
      fn()
    }
  }
}
