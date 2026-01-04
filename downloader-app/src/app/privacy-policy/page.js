export const metadata = {
  title: "Privacy Policy - Multi-Platform Downloader",
  description: "Read the Privacy Policy for Multi-Platform Downloader to understand how we handle your data. We are committed to protecting your privacy.",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
      </p>

      <h2>Interpretation and Definitions</h2>
      <h3>Interpretation</h3>
      <p>
        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
      </p>
      <h3>Definitions</h3>
      <p>For the purposes of this Privacy Policy:</p>
      <ul>
        <li><strong>Service</strong> refers to the Multi-Platform Downloader website.</li>
        <li><strong>We</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Multi-Platform Downloader.</li>
        <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
      </ul>

      <h2>Collecting and Using Your Personal Data</h2>
      <h3>Types of Data Collected</h3>
      <h4>Personal Data</h4>
      <p>
        While using Our Service, We do not require you to provide us with any personally identifiable information. The service can be used completely anonymously.
      </p>
      <h4>Usage Data</h4>
      <p>
        Usage Data is collected automatically when using the Service. We do not collect any personal usage data that can identify you. We only collect anonymous data for the purpose of analytics, such as the number of visitors to the site.
      </p>
      <h3>Log Files</h3>
      <p>
        Our server logs requests for the purpose of monitoring and debugging. These logs may include your IP address, but this data is stored temporarily and is not shared with any third parties. We use this information for troubleshooting and to protect our service from abuse.
      </p>
      <h3>Cookies</h3>
      <p>
        We do not use cookies for tracking purposes. The website is static and does not require cookies to function.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.
      </p>

      <h2>Links to Other Websites</h2>
      <p>
        Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party&apos;s site. We strongly advise You to review the Privacy Policy of every site You visit.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>
        We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, You can contact us through our contact page.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
