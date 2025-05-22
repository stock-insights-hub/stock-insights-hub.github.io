import React from 'react';
import { Helmet } from 'react-helmet';
import { adsense } from '../../../blog-config';

const AdSenseScript = () => {
  return (
    <Helmet>
      <script
        async
        src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${adsense.client}",
              enable_page_level_ads: false
            });
          `,
        }}
      />
    </Helmet>
  );
};

export default AdSenseScript;