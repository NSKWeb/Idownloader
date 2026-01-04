export const metadata = {
  title: "Terms of Service - Multi-Platform Downloader",
  description: "Read the Terms of Service for Multi-Platform Downloader. By using our service, you agree to these terms.",
};

const TermsOfServicePage = () => {
  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
      </p>

      <h2>2. Use of Service</h2>
      <p>
        Our service allows you to download videos and other media from various social media platforms for personal use. You are responsible for ensuring that your use of the service complies with all applicable laws and the terms of service of the platforms from which you are downloading content.
      </p>
      <p>
        You agree not to use the service for any purpose that is illegal or prohibited by these terms. You may not use the service in any manner that could damage, disable, overburden, or impair the service.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are and will remain the exclusive property of Multi-Platform Downloader and its licensors. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries.
      </p>
      <p>
        Our service does not grant you any rights to the downloaded content. All rights to the content belong to their respective owners. You are solely responsible for any copyright infringement or other violation of intellectual property rights that may occur as a result of your use of the service.
      </p>

      <h2>4. Disclaimer</h2>
      <p>
        The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall Multi-Platform Downloader, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
      </p>

      <h2>6. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the service is hosted, without regard to its conflict of law provisions.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us.
      </p>
    </div>
  );
};

export default TermsOfServicePage;
