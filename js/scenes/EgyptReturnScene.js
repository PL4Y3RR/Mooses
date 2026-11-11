
// Luku 2: Paluu Egyptiin -kohtaus
class EgyptReturnScene extends Phaser.Scene {
    constructor() {
        super("EgyptReturn");
    }

    preload() {
        const assets = new AssetLoader(this);
        assets.preload();
    }

    create() {
        this.physics.world.setBounds(0, 0, 2000, 900);
        this.cameras.main.setBounds(0, 0, 2000, 900);
        this.cameras.main.setBackgroundColor("#d4a359");

        this.createEnvironment();
        this.createPlayer();
        this.createAaron();

        this.playerFacing = 1;
        this.aaronFollowing = false;
        this.pendingAaronJoin = false;
        this.pendingMiracleStart = false;
        this.pendingPalaceTransition = false;

        this.cameras.main.startFollow(this.player);
        this.createInput();
        
        this.dialog = new DialogManager();

        this.metAaron = false;
        this.miracleQuestActive = false;
        this.miraclesCollected = 0;
        this.totalMiraclesNeeded = 3;

        this.updateQuestText();
    }

    createEnvironment() {
        const graphics = this.add.graphics();
        graphics.setDepth(-10);

        graphics.fillStyle(0xb58043, 0.8);
        graphics.beginPath();
        graphics.moveTo(1400, 500);
        graphics.lineTo(1650, 250);
        graphics.lineTo(1900, 500);
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0xc2934f, 0.9);
        graphics.fillRect(0, 420, 2000, 160);

        this.add.image(580, 510, "oasis")
            .setScale(0.7)
            .setDepth(-8);

        [
            [520, 440, 1],
            [675, 445, 0.9],
            [1880, 390, 1.2]
        ].forEach(([x, y, scale]) => {
            this.add.image(x, y, "palm")
                .setScale(scale)
                .setDepth(-7);
        });
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 500, "moses");
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
    }

    createAaron() {
        this.aaron = this.physics.add.sprite(1100, 500, "aaron");
        this.aaron.setDepth(9);
        this.aaron.setCollideWorldBounds(true);
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-SPACE", () => this.interact());
    }

    interact() {
        if (this.dialog.isActive()) return;

        const distanceToAaron = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.aaron.x, this.aaron.y
        );

        if (distanceToAaron < 100 && !this.metAaron) {
            this.metAaron = true;
            this.pendingAaronJoin = true;

            this.dialog.start([
                { speaker: "Aaron", text: "Mooses! Herra lähetti minut sinua vastaan." },
                { speaker: "Mooses", text: "Jumala ilmestyi minulle palavassa pensaassa." },
                { speaker: "Aaron", text: "Kulkekaamme yhdessä. Näytämme kansalle merkit, jotka Herra antoi." },
                { speaker: "Mooses", text: "Sitten menemme faraon luo ja vaadimme kansalle vapautta." }
            ]);

            this.updateQuestText();
        }
    }

    createMiracleMinigame() {
        this.miracleQuestActive = true;
        this.miracleGroup = this.physics.add.group();

        const miraclePositions = [
            { type: "sauva", label: "SAUVA", x: 1300, y: 350 },
            { type: "käsi", label: "KÄSI", x: 1550, y: 600 },
            { type: "vesi", label: "VESI", x: 1800, y: 400 }
        ];

        miraclePositions.forEach(pos => {
            const symbol = this.add.text(
                pos.x, pos.y + 44, pos.label,
                {
                    fontSize: "18px",
                    color: "#fff7c2",
                    backgroundColor: "#8a5817",
                    padding: 8
                }
            ).setOrigin(0.5);
            symbol.setDepth(12);
            symbol.type = pos.type;
            symbol.iconParts = this.createMiracleIcon(pos);

            this.physics.add.existing(symbol);
            this.miracleGroup.add(symbol);

            this.tweens.add({
                targets: symbol,
                scale: 1.1,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        });
    }

    createMiracleIcon(pos) {
        const parts = [
            this.add.circle(pos.x, pos.y, 32, 0xffdf8a, 0.3)
                .setDepth(10)
        ];

        if (pos.type === "sauva") {
            parts.push(
                this.add.image(pos.x, pos.y, "staff")
                    .setScale(0.55)
                    .setDepth(11)
            );
        } else if (pos.type === "käsi") {
            const skin = 0xd99b7c;
            parts.push(
                this.add.rectangle(pos.x, pos.y + 7, 18, 19, skin).setDepth(11),
                this.add.rectangle(pos.x - 7, pos.y - 5, 5, 19, skin).setDepth(11),
                this.add.rectangle(pos.x, pos.y - 8, 5, 23, skin).setDepth(11),
                this.add.rectangle(pos.x + 7, pos.y - 6, 5, 20, skin).setDepth(11),
                this.add.rectangle(pos.x + 14, pos.y + 1, 5, 14, skin).setDepth(11),
                this.add.rectangle(pos.x - 13, pos.y + 9, 6, 15, skin)
                    .setAngle(-40)
                    .setDepth(11)
            );
        } else {
            parts.push(
                this.add.ellipse(pos.x, pos.y + 2, 46, 30, 0x238fbd)
                    .setDepth(11),
                this.add.ellipse(pos.x, pos.y - 2, 27, 8, 0xa8efff)
                    .setDepth(12)
            );
        }

        this.tweens.add({
            targets: parts[0],
            scale: 1.2,
            alpha: 0.08,
            duration: 900,
            yoyo: true,
            repeat: -1
        });

        parts.slice(1).forEach(part => {
            this.tweens.add({
                targets: part,
                y: part.y - 7,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        });

        return parts;
    }

    update() {
        const speed = 180;
        this.player.setVelocity(0);

        let isMoving = false;

        if (!this.dialog.isActive()) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
                this.playerFacing = -1;
                isMoving = true;
            }
            if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
                this.playerFacing = 1;
                isMoving = true;
            }
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-speed);
                isMoving = true;
            }
            if (this.cursors.down.isDown) {
                this.player.setVelocityY(speed);
                isMoving = true;
            }
        }

        if (isMoving) {
            this.player.rotation = Math.sin(this.time.now * 0.015) * 0.05;
            this.player.setFlipX(this.playerFacing < 0);
        } else {
            this.player.rotation = 0;
        }

        if (this.pendingAaronJoin && !this.dialog.isActive()) {
            this.pendingAaronJoin = false;
            this.aaronFollowing = true;
            this.aaronSide = Math.sign(this.aaron.x - this.player.x) || 1;
            this.pendingMiracleStart = true;
        }

        if (this.pendingMiracleStart && !this.dialog.isActive()) {
            this.pendingMiracleStart = false;
            this.createMiracleMinigame();
        }

        this.updateAaron();
        this.checkMiracles();

        if (this.pendingPalaceTransition && !this.dialog.isActive()) {
            this.scene.start("PharaohPalace");
        }
    }

    updateAaron() {
        if (!this.aaronFollowing) {
            this.aaron.setVelocity(0, 0);
            return;
        }

        const targetX = this.player.x + this.aaronSide * 48;
        const targetY = this.player.y + 12;
        const distance = Phaser.Math.Distance.Between(
            this.aaron.x,
            this.aaron.y,
            targetX,
            targetY
        );

        if (distance > 8) {
            this.physics.moveTo(
                this.aaron,
                targetX,
                targetY,
                Math.min(220, Math.max(80, distance * 2))
            );
        } else {
            this.aaron.setVelocity(0, 0);
        }

        if (Math.abs(this.aaron.body.velocity.x) > 1) {
            this.aaron.setFlipX(this.aaron.body.velocity.x < 0);
        }
    }

    checkMiracles() {
        if (
            !this.miracleQuestActive ||
            !this.miracleGroup ||
            this.dialog.isActive()
        ) return;

        this.miracleGroup.children.each(item => {
            if (item.collected) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                item.x, item.y
            );

            if (distance < 50) {
                item.collected = true;
                item.iconParts.forEach(part => part.destroy());
                item.destroy();
                this.miraclesCollected++;
                this.updateQuestText();

                if (this.miraclesCollected >= this.totalMiraclesNeeded) {
                    this.miracleQuestActive = false;
                    this.pendingPalaceTransition = true;

                    this.dialog.start([
                        { speaker: "Aaron", text: "Nyt meillä on merkit, jotka Herra antoi kansalle." },
                        { speaker: "Mooses", text: "Kulkekaamme faraon palatsiin. Herra on kanssamme." }
                    ]);
                } else {
                    const lines = {
                        sauva: "Sauva muuttui käärmeeksi ja palasi taas sauvaksi.",
                        "käsi": "Mooses näyttää, ettei Herra hylkää häntä.",
                        vesi: "Niilin vesi muuttuu merkiksi faraolle."
                    };

                    this.dialog.start([
                        { speaker: "Aaron", text: lines[item.type] }
                    ]);
                }
            }
        });
    }

    updateQuestText() {
        const questList = document.getElementById("quest-list");
        if (!questList) return;

        if (!this.metAaron) {
            questList.innerHTML = `
                <li>Matkusta erämaan halki</li>
                <li>⬜ Kohtaa Aaron (SPACE)</li>
            `;
        } else if (this.miraclesCollected >= this.totalMiraclesNeeded) {
            questList.innerHTML = `
                <li>✅ Aaron kulkee mukana</li>
                <li>✅ Merkit kerätty</li>
                <li>Matka faraon palatsiin</li>
            `;
        } else if (!this.miracleQuestActive) {
            questList.innerHTML = `
                <li>✅ Aaron kohdattu</li>
                <li>Kuuntele Aaronin viesti</li>
            `;
        } else {
            questList.innerHTML = `
                <li>✅ Aaron kulkee mukana</li>
                <li>Todisteet: ${this.miraclesCollected}/${this.totalMiraclesNeeded}</li>
                <li>
                    ${
                        this.miraclesCollected >= this.totalMiraclesNeeded
                        ? "✅ Kaikki todisteet kerätty!"
                        : "⬜ Kerää todisteet"
                    }
                </li>
            `;
        }
    }

}