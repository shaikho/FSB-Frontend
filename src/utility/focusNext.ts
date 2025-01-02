export const focusNextField = (currentFieldId: string) => {
  const inputs = Array.from(document.querySelectorAll("input"));
  const currentIndex = inputs.findIndex((input) => input.id === currentFieldId);
  const nextField =
    currentFieldId === "MotherName"
      ? inputs[currentIndex + 2]
      : inputs[currentIndex + 2];
  const selectInput = document.querySelector("select");
  if (nextField || selectInput) {
    nextField.focus();
  }
};
