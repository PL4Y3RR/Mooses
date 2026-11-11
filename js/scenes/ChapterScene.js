class ChapterScene extends Phaser.Scene {
    constructor(key, title, backgroundColor = 0x243b35) {
        super(key);
        this.chapterTitle = title;
        this.backgroundColor = backgroundColor;
        this.worldWidth = 1800;
        this.worldHeight = 900;
    }

    preload() {
        const assets = new AssetLoader(this);
        assets.preload();
    }

    create() {
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setBackgroundColor(this.backgroundColor);

        this.add.text(800, 48, this.chapterTitle, {
            fontSize: "38px",
            color: "#fff4cf",
            fontStyle: "bold",
            stroke: "#17231f",
            strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.player = this.physics.add.sprite(120, 720, "moses");
        this.player.setDepth(30);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.dialog = new DialogManager();
        this.events.once("shutdown", () => this.dialog.destroy());
        this.nextScene = null;
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    movePlayer(speed = 190) {
        this.player.setVelocity(0, 0);

        if (this.dialog.isActive() || this.nextScene) {
            return false;
        }

        let moving = false;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            moving = true;
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            moving = true;
        }

        if (moving) {
            this.player.body.velocity.normalize().scale(speed);
            this.player.rotation = Math.sin(this.time.now * 0.015) * 0.04;
        } else {
            this.player.rotation = 0;
        }

        return moving;
    }

    setQuest(lines) {
        const questList = document.getElementById("quest-list");
        const questPanel = document.getElementById("quest-panel");

        if (questPanel) questPanel.style.display = "block";
        if (!questList) return;

        questList.innerHTML = lines.map(line => `<li>${line}</li>`).join("");
    }

    transitionAfterDialog(sceneKey, messages) {
        this.nextScene = sceneKey;
        this.dialog.start(messages);
    }

    updateTransition() {
        if (this.nextScene && !this.dialog.isActive()) {
            this.scene.start(this.nextScene);
        }
    }
}
