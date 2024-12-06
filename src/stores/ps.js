
export const usePsStore = defineStore('ps', () => {
    const FabricCanvas = storeToRefs(null);
    const FabricImage = storeToRefs(null);

    return {
        FabricCanvas,
        FabricImage
    }
})