import React from 'react';

interface Props {
  setMessage: (msg: string) => void;
}

const CopyAllUrlsButton: React.FC<Props> = ({ setMessage }) => {
  const handleClick = async () => {
    try {
      const tabs = await chrome.tabs.query({});
      const urls = tabs.map(tab => tab.url).sort().join('\n');
      await navigator.clipboard.writeText(urls);
      setMessage('アクティブなタブのURLをコピーしました');
    } catch (error) {
      console.error(error);
      setMessage('コピーに失敗しました');
    }
  };

  return (
    <button onClick={handleClick}>
      URL一覧コピー
    </button>
  );
};

export default CopyAllUrlsButton;
