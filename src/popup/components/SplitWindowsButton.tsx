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

      // まず全ウィンドウを現在のウィンドウに統合
      const currentWin = await chrome.windows.getCurrent();
      const allWins = await chrome.windows.getAll({ populate: true });
      for (const win of allWins) {
        if (win.id === currentWin.id) continue;
        for (const tab of win.tabs || []) {
          await chrome.tabs.move(tab.id!, { windowId: currentWin.id!, index: -1 });
        }
      }

      // 統合後のウィンドウの全タブを取得
      const tabs = await chrome.tabs.query({ windowId: currentWin.id });

      const videoTabs: chrome.tabs.Tab[] = [];
      const otherTabs: chrome.tabs.Tab[] = [];

      for (const tab of tabs) {
        try {
          const urlStr = tab.url || '';
          if (
            urlStr.includes('youtube.com') ||
            urlStr.includes('netflix.com') ||
            urlStr.includes('unext.jp') ||
            urlStr.startsWith('https://www.amazon.co.jp/gp/video')
          ) {
            videoTabs.push(tab);
          } else {
            otherTabs.push(tab);
          }
        } catch {
          otherTabs.push(tab);
        }
      }

      // 動画系グループの新規ウィンドウ作成
      let videoWinId: number | undefined;
      if (videoTabs.length > 0) {
        const firstTab = videoTabs.shift()!;
        const videoWin = await chrome.windows.create({ tabId: firstTab.id! });
        videoWinId = videoWin.id;

        if (videoTabs.length > 0 && videoWinId !== undefined) {
          await chrome.tabs.move(
            videoTabs.map(t => t.id!).filter(Boolean),
            { windowId: videoWinId, index: -1 }
          );
        }
      }

      // その他グループの新規ウィンドウ作成
      let otherWinId: number | undefined;
      if (otherTabs.length > 0) {
        const firstTab = otherTabs.shift()!;
        const otherWin = await chrome.windows.create({ tabId: firstTab.id! });
        otherWinId = otherWin.id;

        if (otherTabs.length > 0 && otherWinId !== undefined) {
          await chrome.tabs.move(
            otherTabs.map(t => t.id!).filter(Boolean),
            { windowId: otherWinId, index: -1 }
          );
        }
      }

      // 念のため元の統合ウィンドウを再度閉じる（空でなくても強制）
      try {
        await chrome.windows.remove(currentWin.id!);
      } catch (e) {
        // 既に閉じていれば無視
      }

      setMessage('全ウィンドウを統合し、動画系とその他に分割しました');
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
