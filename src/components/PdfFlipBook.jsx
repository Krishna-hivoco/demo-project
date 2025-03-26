// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Explicitly set the worker src using an absolute CDN path
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const PdfFlipbook = ({ file }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [width, setWidth] = useState(window.innerWidth);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Calculate responsive page width
//   const getPageWidth = () => {
//     const maxWidth = 800;
//     const padding = 40;
//     return Math.min(width - padding, maxWidth);
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const changePage = (offset) => {
//     setPageNumber((prevPageNumber) =>
//       Math.min(Math.max(1, prevPageNumber + offset), numPages)
//     );
//   };

//   return (
//     <div className="pdf-container p-4 max-w-4xl mx-auto">
//       <div className="pdf-viewer">
//         <Document
//           file={file}
//           onLoadSuccess={onDocumentLoadSuccess}
//           options={{
//             cMapUrl: "cmaps/",
//             cMapPacked: true,
//           }}
//           loading={<div className="text-center text-xl">Loading PDF...</div>}
//           error={
//             <div className="text-center text-xl text-red-500">
//               Error loading PDF
//             </div>
//           }
//         >
//           {numPages && (
//             <Page
//               pageNumber={pageNumber}
//               width={getPageWidth()}
//               renderAnnotationLayer={false}
//               renderTextLayer={false}
//             />
//           )}
//         </Document>

//         {numPages && (
//           <div className="navigation flex justify-between items-center mt-4">
//             <button
//               onClick={() => changePage(-1)}
//               disabled={pageNumber <= 1}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <div className="page-info">
//               Page {pageNumber} of {numPages}
//             </div>
//             <button
//               onClick={() => changePage(1)}
//               disabled={pageNumber >= numPages}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default PdfFlipbook
