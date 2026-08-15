import "./styles.css";
import { initForm } from "./form";
import { renderSnow } from "./ui/snow";

const sky = document.getElementById("sky");
if (sky) {
  renderSnow(sky);
}

initForm();
