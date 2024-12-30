import { definePluginSettings } from "@api/Settings";
import { React, Toasts } from "@webpack/common";
import definePlugin, { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    externalUrl: {
        type: OptionType.STRING,
        description: "Enter the external server URL",
        restartNeeded: false,
        default: ""
    }
});


async function handleFileUpload(file) {
    Toasts.show({
        message: `Uploading file...`,
        id: Toasts.genId(),
        type: Toasts.Type.SUCCESS,
        timeout: 1000
    });
    try {
        const endpoint = settings.store.externalUrl || "";
        if (!endpoint) {
            throw new Error("No external server URL defined");
        }
        const fileLink = await uploadFileToServer(file, endpoint);
        
        Toasts.show({
            message: `File uploaded.`,
            id: Toasts.genId(),
            type: Toasts.Type.SUCCESS,
            timeout: 1000
        });

        const linkWindow = document.createElement("div");
        linkWindow.style.position = "fixed";
        linkWindow.style.top = "50%";
        linkWindow.style.left = "50%";
        linkWindow.style.transform = "translate(-50%, -50%)";
        linkWindow.style.backgroundColor = "#1e1f22";
        linkWindow.style.padding = "25px";
        linkWindow.style.borderRadius = "12px";
        linkWindow.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
        linkWindow.style.zIndex = "1000";
        linkWindow.style.color = "#e0e0e0";

        const linkText = document.createElement("input");
        linkText.type = "text";
        linkText.value = fileLink;
        linkText.readOnly = true;
        linkText.style.width = "88%";
        linkText.style.marginBottom = "15px";
        linkText.style.padding = "10px";
        linkText.style.border = "1px solid #5a5a5a";
        linkText.style.borderRadius = "6px";
        linkText.style.backgroundColor = "#2c2f33";
        linkText.style.color = "#e0e0e0";
        linkWindow.appendChild(linkText);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.style.backgroundColor = "#4a90e2";
        copyButton.style.color = "#ffffff";
        copyButton.style.border = "none";
        copyButton.style.padding = "12px 18px";
        copyButton.style.borderRadius = "6px";
        copyButton.style.cursor = "pointer";
        copyButton.style.marginRight = "12px";
        copyButton.onclick = () => {
            linkText.select();
            document.execCommand("copy");
            Toasts.show({
                message: "Link copied to clipboard!",
                id: Toasts.genId(),
                type: Toasts.Type.SUCCESS,
                timeout: 1000
            });
        };
        buttonContainer.appendChild(copyButton);

        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.backgroundColor = "#e74c3c";
        closeButton.style.color = "#ffffff";
        closeButton.style.border = "none";
        closeButton.style.padding = "12px 18px";
        closeButton.style.borderRadius = "6px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = () => {
            document.body.removeChild(linkWindow);
        };
        buttonContainer.appendChild(closeButton);

        linkWindow.appendChild(buttonContainer);
        document.body.appendChild(linkWindow);

    } catch (error) {
        Toasts.show({
            message: `File upload error: ${error.message}`,
            id: Toasts.genId(),
            type: Toasts.Type.FAILURE
        });
    }
}

async function uploadFileToServer(file, endpoint) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(endpoint + "/upload", {
            method: "POST",
            body: formData
        });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.fileLink;
    } catch (error) {
        throw new Error(`File upload error: ${error.message}`);
    }
}


export default definePlugin({
    name: "FakeNitroUploader",
    description: "Uploads files > 10MB to a server and returns a link to them.",
    authors: ["k0aziu"],

    settings,

    patches: [
        {
            find: "toolbar:function",
            replacement: {
                match: /(function \i\(\i\){)(.{1,200}toolbar.{1,100}mobileToolbar)/,
                replace: "$1$self.addIconToToolBar(arguments[0]);$2"
            }
        },
    ],

    addIconToToolBar(e: { toolbar: React.ReactNode[] | React.ReactNode; }) {
        const fileUploadButton = (
            <div key="file-upload">
                <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <i className="file-icon" style={{ marginRight: '8px' }}></i>
                    <span>Upload File</span>
                </label>
                <input
                    id="file-upload-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(event) => handleFileUpload(event.target.files[0])}
                />
            </div>
        );

        if (Array.isArray(e.toolbar)) {
            return e.toolbar.push(fileUploadButton);
        }

        e.toolbar = [fileUploadButton, e.toolbar];
    },
});
