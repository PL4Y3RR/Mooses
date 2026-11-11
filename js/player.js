class Player {

    constructor(scene, x, y) {

        this.scene = scene;

        this.speed = 180;

        this.sprite =
            scene.physics.add.sprite(
                x,
                y,
                "moses"
            );

        this.sprite.setCollideWorldBounds(
            true
        );

        this.cursors =
            scene.input.keyboard.createCursorKeys();

        this.direction = "down";

        this.isMoving = false;
    }

    update() {

        let vx = 0;
        let vy = 0;

        this.isMoving = false;

        if (this.cursors.left.isDown) {

            vx = -this.speed;

            this.direction = "left";

            this.isMoving = true;
        }

        else if (this.cursors.right.isDown) {

            vx = this.speed;

            this.direction = "right";

            this.isMoving = true;
        }

        if (this.cursors.up.isDown) {

            vy = -this.speed;

            this.direction = "up";

            this.isMoving = true;
        }

        else if (this.cursors.down.isDown) {

            vy = this.speed;

            this.direction = "down";

            this.isMoving = true;
        }

        this.sprite.setVelocity(
            vx,
            vy
        );

        this.updateVisuals();
    }

    updateVisuals() {

        if (this.isMoving) {

            const pulse =
                1 +
                Math.sin(
                    Date.now() / 100
                ) * 0.03;

            this.sprite.setScale(
                pulse
            );

        } else {

            this.sprite.setScale(
                1
            );
        }

        switch (this.direction) {

            case "left":

                this.sprite.setFlipX(
                    true
                );

                break;

            case "right":

                this.sprite.setFlipX(
                    false
                );

                break;
        }
    }

    getX() {

        return this.sprite.x;
    }

    getY() {

        return this.sprite.y;
    }

    getSprite() {

        return this.sprite;
    }

    setPosition(x, y) {

        this.sprite.setPosition(
            x,
            y
        );
    }

    stop() {

        this.sprite.setVelocity(
            0,
            0
        );
    }

    savePosition() {

        const data = {

            x: this.sprite.x,
            y: this.sprite.y

        };

        localStorage.setItem(
            "playerPosition",
            JSON.stringify(data)
        );
    }

    loadPosition() {

        const data =
            localStorage.getItem(
                "playerPosition"
            );

        if (!data) return;

        try {

            const parsed =
                JSON.parse(data);

            this.setPosition(
                parsed.x,
                parsed.y
            );

        } catch (e) {

            console.error(
                "Tallennuksen lataus epäonnistui",
                e
            );
        }

    }

    distanceTo(gameObject) {

        return Phaser.Math.Distance.Between(

            this.sprite.x,
            this.sprite.y,

            gameObject.x,
            gameObject.y
        );
    }

}