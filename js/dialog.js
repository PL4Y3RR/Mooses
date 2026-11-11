class DialogManager {

    constructor() {

        this.dialogBox =
            document.getElementById(
                "dialog-box"
            );

        this.dialogText =
            document.getElementById(
                "dialog-text"
            );

        this.speakerName =
            document.getElementById(
                "speaker-name"
            );
        this.continueButton =
            document.getElementById(
                "dialog-continue"
            );

        this.messages = [];
        this.currentIndex = 0;
        this.active = false;

        this.handleKeyDown = (event) => {
            if (
                (event.code === "Space" || event.code === "Enter") &&
                this.active &&
                !event.repeat
            ) {
                event.preventDefault();
                this.next();
            }
        };
        this.handleContinue = () => this.next();
        this.handleDialogClick = (event) => {
            if (event.target === this.dialogBox) this.next();
        };

        document.addEventListener("keydown", this.handleKeyDown);
        this.continueButton?.addEventListener("click", this.handleContinue);
        this.dialogBox?.addEventListener("click", this.handleDialogClick);
    }

    start(messages) {

        this.messages = messages;
        this.currentIndex = 0;
        this.active = true;

        this.showCurrent();
    }

    showCurrent() {

        const current =
            this.messages[
                this.currentIndex
            ];

        if (!current) {

            this.hide();

            return;
        }

        this.dialogBox.classList.remove(
            "hidden"
        );

        if (this.continueButton) {
            this.continueButton.textContent =
                this.currentIndex === this.messages.length - 1
                    ? "Jatka (välilyönti)"
                    : "Seuraava (välilyönti)";
        }

        this.speakerName.textContent =
            current.speaker;

        this.dialogText.textContent =
            current.text;
    }

    next() {

        this.currentIndex++;

        if (
            this.currentIndex >=
            this.messages.length
        ) {

            this.hide();

            return;
        }

        this.showCurrent();
    }

    hide() {

        this.active = false;

        this.dialogBox.classList.add(
            "hidden"
        );
    }

    isActive() {

        return this.active;
    }

    destroy() {
        this.active = false;
        document.removeEventListener("keydown", this.handleKeyDown);
        this.continueButton?.removeEventListener("click", this.handleContinue);
        this.dialogBox?.removeEventListener("click", this.handleDialogClick);
    }
}

window.DialogManager =
    DialogManager;