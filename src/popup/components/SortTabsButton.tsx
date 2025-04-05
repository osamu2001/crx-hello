import React from 'react';

interface Props {
  setMessage: (msg: string) => void;
}

const SortTabsButton: React.FC<Props> = ({ setMessage }) => {
  const handleClick = async () => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const sorted = [...tabs].sort((a, b) => (a.url || '').localeCompare(b.url || ''));
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].index !== i) {
          chrome.tabs.move(sorted[i].id!, { index: i });
        }
      }
      setMessage('タブをURL順に並び替えました');
    } catch (error) {
      console.error(error);
      setMessage('並び替えに失敗しました');
    }
  };

  return (
    <button onClick={handleClick}>
      タブをURL順に並び替え
    </button>
  );
};

export default SortTabsButton;
