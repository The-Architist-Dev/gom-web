import React, { useState } from 'react';
import { HomePage } from './HomePage';

export const HomeWrapper = ({ token, notify, quota, setQuota, setView, user, ResultDashboard }) => {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleShowResult = (resultData, previewUrl) => {
    setResult(resultData);
    setPreview(previewUrl);
  };

  const handleResetPreview = () => {
    setResult(null);
    setPreview(null);
  };

  if (result) {
    return (
      <ResultDashboard
        result={result}
        token={token}
        user={user}
        preview={preview}
        resetPreview={handleResetPreview}
      />
    );
  }

  return (
    <HomePage
      token={token}
      notify={notify}
      quota={quota}
      setQuota={setQuota}
      setView={setView}
      user={user}
      onShowResult={handleShowResult}
    />
  );
};
