import React from 'react';
import { Helmet } from 'react-helmet';

const AdSenseScript = () => {
  return (
    <Helmet>
      <script
        async
        src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
    </Helmet>
  );
};

export default AdSenseScript;