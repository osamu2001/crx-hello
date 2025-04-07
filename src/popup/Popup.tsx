import React, { useState } from 'react';
import './Popup.css';
import CopyAllUrlsButton from './components/CopyAllUrlsButton';
import SortTabsButton from './components/SortTabsButton';
import MergeWindowsButton from './components/MergeWindowsButton';
import SplitWindowsButton from './components/SplitWindowsButton';

export const Popup = () => {
  const [message, setMessage] = useState('');

  return (
    <main>
      <CopyAllUrlsButton setMessage={setMessage} />
      <SortTabsButton setMessage={setMessage} />
      <MergeWindowsButton setMessage={setMessage} />
      <SplitWindowsButton setMessage={setMessage} />
      {message && <p>{message}</p>}
    </main>
  );
};

export default Popup;
