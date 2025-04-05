import React from 'react';

interface Props {
  setMessage: (msg: string) => void;
}

const MergeWindowsButton: React.FC<Props> = ({ setMessage }) => {
  const handleClick = async () => {
    try {
      const currentWin = await chrome.windows.getCurrent();
      const allWins = await chrome.windows.getAll({ populate: true });
      for (const win of allWins) {
        if (win.id === currentWin.id) continue;
        for (const tab of win.tabs || []) {
          chrome.tabs.move(tab.id!, { windowId: currentWin.id!, index: -1 });
        }
      }
      setMessage('全ウィンドウのタブを統合しました');
    } catch (error) {
      console.error(error);
      setMessage('統合に失敗しました');
    }
  };

  return (
    <button onClick={handleClick}>
      全ウィンドウのタブを統合
    </button>
  );
};

export default MergeWindowsButton;
