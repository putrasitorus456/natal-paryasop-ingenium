import "./styles.css";
import { initForm, showClosed } from "./form";
import { isFormOpen, msUntilClose } from "./lib/deadline";
import { renderSnow } from "./ui/snow";

const sky = document.getElementById("sky");
if (sky) {
  renderSnow(sky);
}

if (isFormOpen()) {
  initForm();
  const remaining = msUntilClose();
  if (remaining > 0 && remaining < 2_147_483_647) {
    window.setTimeout(() => {
      showClosed();
    }, remaining);
  }
} else {
  showClosed();
}
