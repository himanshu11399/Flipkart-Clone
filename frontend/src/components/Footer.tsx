import React from 'react';
import { HelpCircle, Briefcase, Gift, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: "ABOUT",
      links: ["Contact Us", "About Us", "Careers", "Flipkart Stories", "Press", "Corporate Information"]
    },
    {
      title: "GROUP COMPANIES",
      links: ["Myntra", "Cleartrip", "Shopsy"]
    },
    {
      title: "HELP",
      links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"]
    },
    {
      title: "CONSUMER POLICY",
      links: ["Cancellation & Returns", "Terms Of Use", "Security", "Privacy", "Sitemap", "Grievance Redressal", "EPR Compliance"]
    }
  ];

  return (
    <footer className="bg-[#212121] text-white pt-10 pb-6 font-sans text-sm">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
          {/* Main Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <h2 className="text-[#878787] font-medium mb-2">{section.title}</h2>
              {section.links.map((link, lIndex) => (
                <a key={lIndex} href="#" className="hover:underline text-[14px] font-normal">
                  {link}
                </a>
              ))}
            </div>
          ))}

          {/* Mail Us */}
          <div className="flex flex-col space-y-2 lg:border-l lg:border-[#454d5e] lg:pl-8">
            <h2 className="text-[#878787] font-medium mb-2 uppercase">Mail Us:</h2>
            <p className="text-[14px] leading-relaxed">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
          </div>

          {/* Registered Office Address */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-[#878787] font-medium mb-2 uppercase">Registered Office Address:</h2>
            <p className="text-[14px] leading-relaxed">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India<br />
              CIN : U51109KA2012PTC066107<br />
              Telephone: 044-45614700 / 044-67415800
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#454d5e] pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <a href="#" className="flex items-center gap-2 hover:text-[#2874f0] transition-colors">
              <Briefcase size={18} className="text-[#ff9f00]" />
              <span>Become a Seller</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-[#2874f0] transition-colors">
              <ShieldCheck size={18} className="text-[#ff9f00]" />
              <span>Advertise</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-[#2874f0] transition-colors">
              <Gift size={18} className="text-[#ff9f00]" />
              <span>Gift Cards</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-[#2874f0] transition-colors">
              <HelpCircle size={18} className="text-[#ff9f00]" />
              <span>Help Center</span>
            </a>
          </div>

          <div className="text-sm font-normal">
            &copy; 2007-{new Date().getFullYear()} Flipkart.com
          </div>

          <div className="flex items-center gap-4">
            {/* Payment Icons Placeholder */}
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-[12px] font-bold tracking-tighter italic">VISA</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-[12px] font-bold tracking-tighter italic">MasterCard</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-[12px] font-bold tracking-tighter italic">Maestro</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-[12px] font-bold tracking-tighter italic">RuPay</span>
            </div>
            <div className="bg-white/10 px-2 py-1 rounded text-nowrap">
              <span className="text-[12px] font-bold tracking-tighter italic">Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
