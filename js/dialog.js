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

        this.messages = [];
        this.currentIndex = 0;
        this.active = false;

        document.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.code === "Space" &&
                    this.active
                ) {

                    e.preventDefault();

                    this.next();
                }
            }
        );
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
}

window.DialogManager =
    DialogManager;