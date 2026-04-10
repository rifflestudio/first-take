import { X, Instagram, Linkedin } from "./../Social.logos";

export default function Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-20 pb-12 md:pb-16 relative z-20">
      <div className="max-w-6xl mx-auto bg-black/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative">
        <footer className="text-gray-400 py-8 md:py-12 px-4 md:px-10">
          <div className="flex flex-col">
            {/* Logo */}
            <div className="mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 28 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M27.1191 22.9683V21.5383C27.1191 14.2508 20.9271 13.3515 17.3072 13.3501H23.624C24.8474 13.3501 25.4591 13.3501 25.9264 13.112C26.3374 12.9026 26.6716 12.5684 26.881 12.1574C27.1191 11.6902 27.1191 11.0785 27.1191 9.85509V6.79351C27.1191 5.43663 27.1191 4.75818 26.9907 4.19704C26.5544 2.29037 25.0656 0.801514 23.1589 0.365274C22.5978 0.236885 21.9193 0.236885 20.5625 0.236885H14.0058H7.4492C6.09232 0.236885 5.41388 0.236885 4.85273 0.365274C2.94606 0.801514 1.45721 2.29037 1.02097 4.19704C0.892578 4.75818 0.892578 5.43663 0.892578 6.79351V13.3501V22.9683C0.892578 24.1917 0.892578 24.8034 1.13066 25.2707C1.34009 25.6817 1.67426 26.0159 2.08528 26.2253C2.55255 26.4634 3.16424 26.4634 4.38763 26.4634H5.81423C12.3708 26.4634 14.0044 20.2621 14.0058 16.6422L14.0058 22.9683C14.0058 24.1917 14.0058 24.8034 14.2439 25.2707C14.4533 25.6817 14.7875 26.0159 15.1985 26.2253C15.6658 26.4634 16.2775 26.4634 17.5009 26.4634H23.624C24.8474 26.4634 25.4591 26.4634 25.9264 26.2253C26.3374 26.0159 26.6716 25.6817 26.881 25.2707C27.1191 24.8034 27.1191 24.1917 27.1191 22.9683Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Copyright */}
            <div className="mb-6">
              <p className="text-body3">© 2025 Riffle, Inc</p>
              <p className="text-body3">All rights reserved.</p>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://x.com/riffledotstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <div className="w-5 h-5 [&_svg_path]:fill-current">
                  <X />
                </div>
              </a>
              <a
                href="https://www.instagram.com/riffledotstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <div className="w-5 h-5 [&_svg_path]:fill-current">
                  <Instagram />
                </div>
              </a>
              <a
                href="https://www.linkedin.com/company/rifflestudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <div className="w-5 h-5 [&_svg_path]:fill-current">
                  <Linkedin />
                </div>
              </a>
              <a
                href="https://docs.riffle.studio/hiring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-body3"
              >
                Hiring
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
