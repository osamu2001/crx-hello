import React, { useState } from 'react';
import './Popup.css';
import CopyAllUrlsButton from './components/CopyAllUrlsButton';
import SortTabsButton from './components/SortTabsButton';
import MergeWindowsButton from './components/MergeWindowsButton';

export const Popup = () => {
  const [message, setMessage] = useState('');

  return (
    <main>
      <CopyAllUrlsButton setMessage={setMessage} />
      <SortTabsButton setMessage={setMessage} />
      <MergeWindowsButton setMessage={setMessage} />
      {message && <p>{message}</p>}
    </main>
  );
};

export default Popup;
