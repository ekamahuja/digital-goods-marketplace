const allResponseBtns = document
  .querySelector("#premade-responses-div")
  .querySelectorAll("button");

for (let i = 0; allResponseBtns.length > 0; i++) {
  allResponseBtns[i].addEventListener("click", () => {
    copyData(allResponseBtns[i].id);
  });
}

async function copyData(copyElementId) {
  try {
    const element = document.querySelector(`#${copyElementId}-textarea`);
    navigator.clipboard.writeText(element.value);
    toastr.message("Successfully copied response!", "success", 3000);
  } catch (err) {
    toastr.message(err.message, "errror", 3000);
  }
}
