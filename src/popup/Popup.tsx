import { useState, useEffect } from 'react'

import './Popup.css'

export const Popup = () => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const link = 'https://github.com/guocaoyi/create-chrome-ext'

  const minus = () => {
    if (count > 0) setCount(count - 1)
  }

  const add = () => setCount(count + 1)

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result) => {
      setCount(result.count || 0)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ count })
    chrome.runtime.sendMessage({ type: 'COUNT', count })
  }, [count])

  const copyTabUrls = async () => {
    try {
      const tabs = await chrome.tabs.query({})
      const urls = tabs.map(tab => tab.url).join('\n')
      await navigator.clipboard.writeText(urls)
      setMessage('アクティブなタブのURLをコピーしました')
    } catch (error) {
      console.error(error)
      setMessage('コピーに失敗しました')
    }
  }

  return (
    <main>
      <h3>Popup Page</h3>
      <div className="calc">
        <button onClick={minus} disabled={count <= 0}>
          -
        </button>
        <label>{count}</label>
        <button onClick={add}>+</button>
      </div>
      <button onClick={copyTabUrls}>URL一覧コピー</button>
      {message && <p>{message}</p>}
      <a href={link} target="_blank">
        generated by create-chrome-ext
      </a>
    </main>
  )
}

export default Popup
