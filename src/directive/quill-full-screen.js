// Quill 编辑器全屏指令
const domList = [
  {
    dom: `<svg  t="1637824425355" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10463"><path d="M243.2 780.8v-179.2H153.6v179.2c0 49.28 40.32 89.6 89.6 89.6h179.2v-89.6H243.2zM780.8 153.6h-179.2v89.6h179.2v179.2h89.6V243.2c0-49.28-40.32-89.6-89.6-89.6zM243.2 243.2h179.2V153.6H243.2c-49.28 0-89.6 40.32-89.6 89.6v179.2h89.6V243.2z m537.6 537.6h-179.2v89.6h179.2c49.28 0 89.6-40.32 89.6-89.6v-179.2h-89.6v179.2z" p-id="10464" fill="#000000"></path></svg>`,
    tit: '最大化'
  },
  {
    dom: `<svg t="1637824296192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6336"><path d="M341.065143 910.189714v-146.285714c0-53.686857-43.885714-97.572571-97.572572-97.572571h-146.285714a48.786286 48.786286 0 0 0 0 97.499428h146.285714v146.285714a48.786286 48.786286 0 1 0 97.499429 0z m-292.571429-617.910857c0 26.916571 21.796571 48.786286 48.713143 48.786286h146.285714c53.686857 0 97.572571-43.885714 97.572572-97.572572v-146.285714a48.786286 48.786286 0 0 0-97.499429 0v146.285714h-146.285714a48.786286 48.786286 0 0 0-48.786286 48.786286z m910.409143 0a48.786286 48.786286 0 0 0-48.713143-48.786286h-146.285714v-146.285714a48.786286 48.786286 0 1 0-97.499429 0v146.285714c0 53.686857 43.885714 97.572571 97.499429 97.572572h146.285714a48.786286 48.786286 0 0 0 48.713143-48.786286z m0 422.765714a48.786286 48.786286 0 0 0-48.713143-48.713142h-146.285714c-53.686857 0-97.572571 43.885714-97.572571 97.572571v146.285714a48.786286 48.786286 0 1 0 97.499428 0v-146.285714h146.285714a48.786286 48.786286 0 0 0 48.786286-48.786286z" fill="#000000" p-id="6337"></path></svg>`,
    tit: '还原'
  }
]

export default {
  bind(el, binding, vnode, oldVnode) {
    setTimeout(() => {
      // 获取控制条
      let dialogHeaderEl = el.querySelector('.ql-toolbar')
      // 获取内容区
      let qlContainer = el.querySelector('.ql-container')

      // 全屏按钮
      let dom1 = document.createElement('span')
      dom1.className = 'ql-formats'
      dom1.style.display = 'inline-block'
      dom1.innerHTML = `<button type="button" class="ql-full-screen">${domList[0].dom}</button>`
      dialogHeaderEl.appendChild(dom1)
      // 取消全屏
      let dom2 = document.createElement('span')
      dom2.className = 'ql-formats'
      dom2.style.display = 'none'
      dom2.innerHTML = `<button type="button" class="ql-restore">${domList[1].dom}</button>`
      dialogHeaderEl.appendChild(dom2)

      dom1.onclick = () => {
        el.style.width = 100 + 'vw'
        el.style.height = 100 + 'vh'
        el.style.padding = '0 25vw'
        el.style.position = 'fixed'
        el.style.top = 0
        el.style.left = 0
        el.style.zIndex = 1500
        el.style.background = 'white'
        // 要给内容区的高度减去控制条的高度，不然会有遮挡
        qlContainer.style.height = 'calc(100% - 48px)'

        dom1.style.display = 'none'
        dom2.style.display = 'inline-block'
      }
      dom2.onclick = () => {
        el.style.width = '70%'
        el.style.height = '400px'
        el.style.padding = 0
        el.style.position = 'inherit'
        el.style.zIndex = 0

        dom1.style.display = 'inline-block'
        dom2.style.display = 'none'
      }
    }, 0)
  }
}
