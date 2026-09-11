const closeDialogById = (id: string) => {
  const dialog = document.getElementById(id);
  if (dialog instanceof HTMLDialogElement) {
    dialog.close();
  }
};

export { closeDialogById };
