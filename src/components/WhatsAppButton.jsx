// import { useEffect } from "react";

// // This component injects the Botpress chatbot scripts for WordPress
// export default function ChatbotWidget() {
//   useEffect(() => {
//     // Inject Botpress main script
//     const script1 = document.createElement("script");
//     script1.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
//     script1.async = true;
//     document.body.appendChild(script1);

//     // Inject Botpress config script
//     const script2 = document.createElement("script");
//     script2.src = "https://files.bpcontent.cloud/2025/09/08/12/20250908124113-71Q3RR0M.js";
//     script2.defer = true;
//     document.body.appendChild(script2);

//     return () => {
//       document.body.removeChild(script1);
//       document.body.removeChild(script2);
//     };
//   }, []);

//   return null; // No visible UI, just injects scripts
// }
