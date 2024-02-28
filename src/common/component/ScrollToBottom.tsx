// import { useState, useEffect } from "react";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import { Box } from "@mui/material";

// const ScrollToBottom = () => {
//   const [showBottomBtn, setShowBottomBtn] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 100) {
//         setShowBottomBtn(true);
//       } else {
//         setShowBottomBtn(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const goToBottom = () => {
//     window.scrollTo({
//       top: document.body.scrollHeight,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <Box
//       style={{
//         position: "fixed",
//         bottom: "20px",
//         right: "30px",
//         zIndex: "1",
//       }}
//     >
//       <KeyboardArrowUpIcon
//         sx={{ color: "white", transform: "rotate(180deg)", my: 15 }} // Adjust rotation here
//         onClick={goToBottom}
//         style={{
//           height: "35px",
//           width: "35px",
//           cursor: "pointer",
//           color: " #57ccb5",
//           boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",
//           borderRadius: "50%",
//           visibility: showBottomBtn ? "visible" : "hidden",
//         }}
//       />
//     </Box>
//   );
// };

// export default ScrollToBottom;
