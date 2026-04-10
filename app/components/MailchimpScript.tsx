"use client";

import Script from "next/script";

export default function MailchimpScript() {
  return (
    <Script id="mcjs" strategy="lazyOnload">
      {`
        !function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","//chimpstatic.com/mcjs-connected/js/users/b0414cc4330aac012a8dc1512/5f7ec991b7.js");
      `}
    </Script>
  );
}
