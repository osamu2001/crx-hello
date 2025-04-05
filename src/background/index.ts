console.log('background is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }

  if (request.type === 'GET_TAB_URLS') {
    console.log('GET_TAB_URLSリクエスト受信')
    chrome.tabs.query({}, (tabs) => {
      console.log('取得したtabs:', tabs)
      const urls = tabs.map(tab => tab.url)
      sendResponse({ urls })
    })
    return true
  }
})
