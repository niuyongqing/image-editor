
export const usePsStore = defineStore('ps', () => {
    const FabricCanvas = storeToRefs(null);
    const FabricImage = storeToRefs(null);
    const Props = storeToRefs({
        canvasWidth:0,
        canvasHeight:0,
        imgUrl:"",
    });
    return {
        FabricCanvas,
        FabricImage,
        Props
    }
})