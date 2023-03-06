import { KeyboardEventTypes } from "@babylonjs/core";
import { GLTFLoader, GLTFLoadingInfo, Viewer } from "bim-viewer";
import {
    HoldKeyType,
    KeyType,
} from "bim-viewer/build/main/components/input-manager";
import "./hyperModel.css";

class KairnialViewer {
    viewer: Viewer;
    loader: GLTFLoader;
    constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.loader = new GLTFLoader();
        this.viewer = new Viewer(canvas);
    }

    load(info: GLTFLoadingInfo) {
        return this.viewer.modelManager.load(info, this.loader);
    }

    delete(id: string) {
        return this.viewer.modelManager.remove(id);
    }

    toggleCamera() {
        const active = this.viewer.navigation.activeCamera;
        const changed =
            active === this.viewer.navigation.orbitCamera
                ? this.viewer.navigation.flyCamera
                : this.viewer.navigation.orbitCamera;
        this.viewer.navigation.activeCamera = changed;
    }

    async setDebugMode() {
        const viewer = this.viewer;

        viewer.inputManager.onKeyPressed(
            KeyboardEventTypes.KEYDOWN,
            KeyType.SPACE,
            HoldKeyType.NONE,
            () => viewer.showDebugGUI()
        );
    }

    setInputs() {
        const viewer = this.viewer;

        viewer.inputManager.onKeyPressed(
            KeyboardEventTypes.KEYDOWN,
            KeyType.C,
            HoldKeyType.NONE,
            () => this.toggleCamera()
        );
    }
}

enum FrontAction {
    DELETE_MODEL = "delete_model",
    LOAD_MODEL = "changeView",
}

type FrontEvent = Event & {
    data: { action: FrontAction; url: string; r__model: string };
};

window.addEventListener("DOMContentLoaded", (event) => {
    const viewer = new KairnialViewer();

    viewer.setInputs();
    viewer.setDebugMode();
    window.addEventListener("message", (event: FrontEvent) => {
        switch (event.data.action) {
            case FrontAction.DELETE_MODEL:
                console.log("Deleting");
                console.log(event.data);
                viewer.delete(event.data.r__model);
                break;
            case FrontAction.LOAD_MODEL:
                console.log("Loading");
                const dbId = event.data.url.match(/rmodel=([^\.]+)/)![1];
                const modelId = event.data.r__model;
                viewer.load({
                    id: modelId,
                    url: `${
                        import.meta.env.VITE_GLTF_URL
                    }/glb/${dbId}.${modelId}`,
                });
                break;
        }
    });
});
