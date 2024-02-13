import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { SnackbarSeverityEnum } from "../enums/SnackbarSeverityEnum";
import { useSnackBar } from "../context/SnackBarContext";
import { ISnackBarContextType } from "../interface/snackBar";

function CustomSnackBar() {
  const { snackBarState } = useSnackBar() as ISnackBarContextType;

  useEffect(() => {
    if (snackBarState && snackBarState.snackbarOpen) {
      if (snackBarState.snackbarSeverity == SnackbarSeverityEnum.SUCCESS) {
        toast.success(snackBarState.snackbarMessage, {});
      } else if (snackBarState.snackbarSeverity == SnackbarSeverityEnum.ERROR) {
        toast.error(snackBarState.snackbarMessage);
      }
    }
  }, [snackBarState]);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
        }}
      />
    </>
  );
}

export default CustomSnackBar;
