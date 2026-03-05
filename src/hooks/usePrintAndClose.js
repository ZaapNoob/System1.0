export const usePrintAndClose = () => {
  const handlePrintAndClose = () => {
    window.print();
    setTimeout(() => {
      window.close();
    }, 500);
  };

  return { handlePrintAndClose };
};
