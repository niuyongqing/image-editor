import {usePsStore} from "~/stores/ps.js";

export  default function download() {
    const imageSrc = usePsStore().FabricCanvas.value.toDataURL();
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
