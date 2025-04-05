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
      const urls = tabs.map(tab => tab.url).sort().join('\n')
      await navigator.clipboard.writeText(urls)
      setMessage('アクティブなタブのURLをコピーしました')
    } catch (error) {
      console.error(error)
      setMessage('コピーに失敗しました')
    }
  }

  const sortTabsByUrl = async () => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true })
      const sorted = [...tabs].sort((a, b) => (a.url || '').localeCompare(b.url || ''))
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].index !== i) {
          chrome.tabs.move(sorted[i].id!, { index: i })
        }
      }
      setMessage('タブをURL順に並び替えました')
    } catch (error) {
      console.error(error)
      setMessage('並び替えに失敗しました')
    }
  }

  return (
    <main>
      <button onClick={copyTabUrls}>URL一覧コピー</button>
      <button onClick={sortTabsByUrl}>タブをURL順に並び替え</button>
      {message && <p>{message}</p>}
    </main>
  )
}

export default Popup
