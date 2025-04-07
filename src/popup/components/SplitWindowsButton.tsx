import React from 'react';

interface Props {
  setMessage: (msg: string) => void;
}

const SplitWindowsButton: React.FC<Props> = ({ setMessage }) => {
  const handleClick = async () => {
    try {
      const videoDomains = [
        'youtube.com',
        'netflix.com',
        'unext.jp',
        'primevideo.com',
      ];

      // 呼び出し元ウィンドウ＆タブ
      const currentWin = await chrome.windows.getCurrent();
      const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTabUrl = currentTab.url || '';

      const isVideoTab = (
        currentTabUrl.includes('youtube.com') ||
        currentTabUrl.includes('netflix.com') ||
        currentTabUrl.includes('unext.jp') ||
        currentTabUrl.startsWith('https://www.amazon.co.jp/gp/video')
      );

      // すべてのウィンドウのタブを呼び出し元ウィンドウに統合
      const allWins = await chrome.windows.getAll({ populate: true });
      for (const win of allWins) {
        if (win.id === currentWin.id) continue;
        for (const tab of win.tabs || []) {
          await chrome.tabs.move(tab.id!, { windowId: currentWin.id!, index: -1 });
        }
      }

      // 統合後の全タブを取得
      const tabs = await chrome.tabs.query({ windowId: currentWin.id });

      const sameGroupTabs: chrome.tabs.Tab[] = [];
      const otherGroupTabs: chrome.tabs.Tab[] = [];

      for (const tab of tabs) {
        try {
          const urlStr = tab.url || '';
          const isVideo = (
            urlStr.includes('youtube.com') ||
            urlStr.includes('netflix.com') ||
            urlStr.includes('unext.jp') ||
            urlStr.startsWith('https://www.amazon.co.jp/gp/video')
          );

          if (isVideo === isVideoTab) {
            sameGroupTabs.push(tab);
          } else {
            otherGroupTabs.push(tab);
          }
        } catch {
          otherGroupTabs.push(tab);
        }
      }

      // 異なるグループのタブを新規ウィンドウに移動
      if (otherGroupTabs.length > 0) {
        const firstTab = otherGroupTabs.shift()!;
        const newWin = await chrome.windows.create({ tabId: firstTab.id! });
        const newWinId = newWin.id;

        if (otherGroupTabs.length > 0 && newWinId !== undefined) {
          await chrome.tabs.move(
            otherGroupTabs.map(t => t.id!).filter(Boolean),
            { windowId: newWinId, index: -1 }
          );
        }
      }

      // 呼び出し元ウィンドウを最前面に
      await chrome.windows.update(currentWin.id!, { focused: true });

      setMessage('全ウィンドウを統合し、呼び出し元基準で2分割しました');
    } catch (error) {
      console.error(error);
      setMessage('統合と分割に失敗しました: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <button onClick={handleClick}>
      ウィンドウを分割
    </button>
  );
};

export default SplitWindowsButton;
