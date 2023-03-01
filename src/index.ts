import { KeyboardEventTypes } from "@babylonjs/core";
import { GLTFLoader } from "bim-viewer/build/module/scene/gltf/loader";
import { Viewer, World } from "bim-viewer";
import {
    HoldKeyType,
    KeyType,
} from "bim-viewer/build/main/components/input-manager";
import "./hyperModel.css";

class KairnialViewer {
    viewer: Viewer;
    loader: GLTFLoader;
    actions: Map<string, () => void> = new Map();
    constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.viewer = new Viewer(canvas);
        this.loader = new GLTFLoader();
    }

    load(url: string) {
        return this.loader.load(url, this.viewer.scene);
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
            () => viewer.navigation.toggle()
        );
    }

    setAction(key: string, action: () => void) {
        this.actions.set(key, action);
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
                break;
            case FrontAction.LOAD_MODEL:
                console.log("Loading");
                const dbId = event.data.url.match(/rmodel=([^\.]+)/)![1];
                const modelId = event.data.r__model;
                viewer.load(
                    `https://local-gltf.kairnial.io/glb/${dbId}.${modelId}`
                );
                break;
        }
    });
});
