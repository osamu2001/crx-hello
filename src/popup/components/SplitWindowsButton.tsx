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
      // AIツールのドメインリスト
      const aiDomains = [
        'chat.openai.com',
        'chatgpt.com',
        'gemini.google.com',
        'perplexity.ai',
        // 必要に応じて追加
      ];

      // 呼び出し元ウィンドウ＆タブ
      const currentWin = await chrome.windows.getCurrent();
      const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTabUrl = currentTab.url || '';

      const isVideoTab = (
        videoDomains.some(domain => currentTabUrl.includes(domain)) ||
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

      // カレントタブのグループを判定
      const isCurrentAI = aiDomains.some(domain => currentTabUrl.includes(domain));
      const isCurrentVideo = (
        videoDomains.some(domain => currentTabUrl.includes(domain)) ||
        currentTabUrl.startsWith('https://www.amazon.co.jp/gp/video')
      );
      let currentGroup: 'ai' | 'video' | 'other' = 'other';
      if (isCurrentAI) currentGroup = 'ai';
      else if (isCurrentVideo) currentGroup = 'video';

      // タブをグループ分け
      const aiTabs: chrome.tabs.Tab[] = [];
      const videoTabs: chrome.tabs.Tab[] = [];
      const otherTabs: chrome.tabs.Tab[] = [];
      for (const tab of tabs) {
        try {
          const urlStr = tab.url || '';
          const isAI = aiDomains.some(domain => urlStr.includes(domain));
          const isVideo = (
            videoDomains.some(domain => urlStr.includes(domain)) ||
            urlStr.startsWith('https://www.amazon.co.jp/gp/video')
          );
          if (isAI) {
            aiTabs.push(tab);
          } else if (isVideo) {
            videoTabs.push(tab);
          } else {
            otherTabs.push(tab);
          }
        } catch {
          otherTabs.push(tab);
        }
      }

      // カレントグループ以外を新規ウィンドウに分離
      if (currentGroup !== 'ai' && aiTabs.length > 0) {
        const firstAITab = aiTabs.shift()!;
        const aiWin = await chrome.windows.create({ tabId: firstAITab.id! });
        const aiWinId = aiWin.id;
        if (aiTabs.length > 0 && aiWinId !== undefined) {
          await chrome.tabs.move(
            aiTabs.map(t => t.id!).filter(Boolean),
            { windowId: aiWinId, index: -1 }
          );
        }
      }
      if (currentGroup !== 'video' && videoTabs.length > 0) {
        const firstVideoTab = videoTabs.shift()!;
        const videoWin = await chrome.windows.create({ tabId: firstVideoTab.id! });
        const videoWinId = videoWin.id;
        if (videoTabs.length > 0 && videoWinId !== undefined) {
          await chrome.tabs.move(
            videoTabs.map(t => t.id!).filter(Boolean),
            { windowId: videoWinId, index: -1 }
          );
        }
      }
      if (currentGroup !== 'other' && otherTabs.length > 0) {
        const firstOtherTab = otherTabs.shift()!;
        const otherWin = await chrome.windows.create({ tabId: firstOtherTab.id! });
        const otherWinId = otherWin.id;
        if (otherTabs.length > 0 && otherWinId !== undefined) {
          await chrome.tabs.move(
            otherTabs.map(t => t.id!).filter(Boolean),
            { windowId: otherWinId, index: -1 }
          );
        }
      }

      // 呼び出し元ウィンドウを最前面に
      await chrome.windows.update(currentWin.id!, { focused: true });

      setMessage('全ウィンドウを統合し、カレントタブ基準でAI/動画/その他に3分割しました');
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
