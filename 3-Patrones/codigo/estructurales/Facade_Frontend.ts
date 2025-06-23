// --- Definición del Patrón en: frontend/src/patterns/facade/FirebaseFacade.ts ---

// La fachada encapsula la lógica compleja del SDK de Firebase
export class FirebaseFacade {
    /**
     * Simplifica la subida de un archivo a una sola llamada de método.
     */
    static async uploadFile(file: File, path: string): Promise<string> {
        // Lógica interna: crear referencia, subir, obtener URL
        const storageRef = ref(storage, `${path}${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    }

    /**
     * Provee una interfaz simple para escuchar cambios de autenticación.
     */
    static onAuthStateChanged(callback: (user: User | null) => void) {
        // Delega al método original de Firebase, pero oculta su origen.
        return firebaseOnAuthStateChanged(auth, callback);
    }
}


// --- Uso en el Cliente: frontend/src/pages/CustomizePage.tsx ---

const handleFinalAction = async () => {
    try {
        const dataUrl = await generateFinalImage(); // Lógica propia del componente
        const snapshotFile = dataURLtoFile(dataUrl, `design.png`);

        // El componente cliente solo realiza una llamada simple a la fachada,
        // sin conocer la complejidad que hay detrás (ref, uploadBytes, getDownloadURL).
        const finalImageUrl = await FirebaseFacade.uploadFile(
            snapshotFile, 
            'custom-design-previews/'
        );

        // ... resto de la lógica con la URL obtenida ...
        console.log('Imagen subida con éxito:', finalImageUrl);

    } catch (error: any) {
        console.error("Error al subir imagen:", error);
    }
};