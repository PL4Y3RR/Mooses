(() => {
    const controls = document.getElementById("mobile-controls");
    const stickBase = document.getElementById("joystick-base");
    const stickKnob = document.getElementById("joystick-knob");
    const actionButton = document.getElementById("btn-action");

    if (!controls || !stickBase || !stickKnob || !actionButton) return;

    const keyData = {
        ArrowLeft: { key: "ArrowLeft", keyCode: 37 },
        ArrowUp: { key: "ArrowUp", keyCode: 38 },
        ArrowRight: { key: "ArrowRight", keyCode: 39 },
        ArrowDown: { key: "ArrowDown", keyCode: 40 },
        Space: { key: " ", keyCode: 32 }
    };
    const heldKeys = new Set();
    const actionPointers = new Set();
    let stickPointer = null;
    let originX = 0;
    let originY = 0;

    function setKey(code, isDown) {
        const alreadyDown = heldKeys.has(code);
        if (alreadyDown === isDown) return;

        if (isDown) heldKeys.add(code);
        else heldKeys.delete(code);

        const data = keyData[code];
        const event = new KeyboardEvent(isDown ? "keydown" : "keyup", {
            key: data.key,
            code,
            bubbles: true,
            cancelable: true
        });
        Object.defineProperty(event, "keyCode", { get: () => data.keyCode });
        Object.defineProperty(event, "which", { get: () => data.keyCode });
        document.dispatchEvent(event);
    }

    function updateStick(clientX, clientY) {
        const deltaX = clientX - originX;
        const deltaY = clientY - originY;
        const distance = Math.hypot(deltaX, deltaY);
        const limit = 54;
        const scale = distance > limit ? limit / distance : 1;
        const knobX = deltaX * scale;
        const knobY = deltaY * scale;

        stickKnob.style.left = `${50 + (knobX / limit) * 34}%`;
        stickKnob.style.top = `${50 + (knobY / limit) * 34}%`;

        const nextKeys = new Set();
        if (distance > 16) {
            if (Math.abs(deltaX) > 18) {
                nextKeys.add(deltaX < 0 ? "ArrowLeft" : "ArrowRight");
            }
            if (Math.abs(deltaY) > 18) {
                nextKeys.add(deltaY < 0 ? "ArrowUp" : "ArrowDown");
            }
        }

        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].forEach(code => {
            setKey(code, nextKeys.has(code));
        });
    }

    document.addEventListener("pointerdown", event => {
        if (
            !window.matchMedia("(max-width: 900px)").matches ||
            event.button !== 0 ||
            event.clientX > window.innerWidth * 0.62 ||
            event.target.closest("#btn-action") ||
            stickPointer !== null
        ) return;

        stickPointer = event.pointerId;
        originX = event.clientX;
        originY = event.clientY;
        stickBase.style.left = `${originX}px`;
        stickBase.style.top = `${originY}px`;
        stickBase.classList.add("visible");
        updateStick(originX, originY);
    }, { passive: true });

    document.addEventListener("pointermove", event => {
        if (event.pointerId !== stickPointer) return;
        updateStick(event.clientX, event.clientY);
        if (event.cancelable) event.preventDefault();
    }, { passive: false });

    function releasePointer(event) {
        if (event.pointerId === stickPointer) {
            stickPointer = null;
            stickBase.classList.remove("visible");
            stickKnob.style.left = "50%";
            stickKnob.style.top = "50%";
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].forEach(code => {
                setKey(code, false);
            });
        }

        if (actionPointers.delete(event.pointerId) && actionPointers.size === 0) {
            setKey("Space", false);
        }
    }

    document.addEventListener("pointerup", releasePointer);
    document.addEventListener("pointercancel", releasePointer);

    actionButton.addEventListener("pointerdown", event => {
        event.preventDefault();
        actionPointers.add(event.pointerId);
        setKey("Space", true);
    });

    window.addEventListener("blur", () => {
        if (stickPointer !== null) {
            stickPointer = null;
            stickBase.classList.remove("visible");
        }
        actionPointers.clear();
        heldKeys.forEach(code => setKey(code, false));
    });
})();
