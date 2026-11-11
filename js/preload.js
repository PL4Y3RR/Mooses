class AssetLoader {

    constructor(scene) {
        this.scene = scene;
    }

    svgToDataUrl(svg) {

        return (
            "data:image/svg+xml;base64," +
            btoa(
                unescape(
                    encodeURIComponent(svg)
                )
            )
        );
    }

    createTexture(key, svg) {

        this.scene.load.image(
            key,
            this.svgToDataUrl(svg)
        );
    }

    loadPlayerSprites() {

        const mosesSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="48">

            <circle
                cx="24"
                cy="12"
                r="8"
                fill="#d9b38c"/>

            <rect
                x="14"
                y="20"
                width="20"
                height="20"
                rx="3"
                fill="#f5f5f5"/>

            <rect
                x="16"
                y="40"
                width="5"
                height="8"
                fill="#5d4037"/>

            <rect
                x="27"
                y="40"
                width="5"
                height="8"
                fill="#5d4037"/>

            <rect
                x="8"
                y="22"
                width="5"
                height="12"
                fill="#d9b38c"/>

            <rect
                x="35"
                y="22"
                width="5"
                height="12"
                fill="#d9b38c"/>
        </svg>`;

        this.createTexture(
            "moses",
            mosesSvg
        );
    const aaronSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="48"
     height="48">

    <circle
        cx="24"
        cy="10"
        r="8"
        fill="#d9b38c"/>

    <rect
        x="14"
        y="18"
        width="20"
        height="20"
        fill="#4e73df"/>

    <rect
        x="16"
        y="38"
        width="5"
        height="10"
        fill="#5d4037"/>

    <rect
        x="27"
        y="38"
        width="5"
        height="10"
        fill="#5d4037"/>

</svg>
`;

this.createTexture(
    "aaron",
    aaronSvg
);

const pharaohSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="48"
     height="48">

    <circle
        cx="24"
        cy="10"
        r="8"
        fill="#d9b38c"/>

    <rect
        x="14"
        y="18"
        width="20"
        height="22"
        fill="#FFD700"/>

    <rect
        x="10"
        y="4"
        width="28"
        height="6"
        fill="#1E3A8A"/>

    <rect
        x="16"
        y="40"
        width="5"
        height="8"
        fill="#5d4037"/>

    <rect
        x="27"
        y="40"
        width="5"
        height="8"
        fill="#5d4037"/>

</svg>
`;

this.createTexture(
    "pharaoh",
    pharaohSvg
);


    }

    loadNpcSprites() {

        const sheepSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="48"
             viewBox="0 0 48 48">
            <ellipse cx="21" cy="27" rx="15" ry="11" fill="#f4f0e5"/>
            <circle cx="13" cy="21" r="7" fill="#fffaf0"/>
            <circle cx="23" cy="17" r="8" fill="#fffaf0"/>
            <circle cx="32" cy="22" r="7" fill="#fffaf0"/>
            <ellipse cx="35" cy="27" rx="7" ry="8" fill="#d9b38c"/>
            <circle cx="38" cy="25" r="1.2" fill="#222222"/>
            <path d="M12 34v8m17-8v8" stroke="#55483c" stroke-width="3" stroke-linecap="round"/>
            <path d="M40 20l4-3" stroke="#d9b38c" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

        const staffSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="64"
             viewBox="0 0 48 64">
            <path d="M28 57 19 12a7 7 0 1 1 14-2" fill="none" stroke="#6b4226" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="m25 55-8-42" fill="none" stroke="#bd8752" stroke-width="2" stroke-linecap="round"/>
            <circle cx="27" cy="9" r="2" fill="#e2bd82"/>
        </svg>`;

        const snakeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="64"
             height="48"
             viewBox="0 0 64 48">
            <path d="M7 35c1-11 13-16 23-10 8 5 15 3 19-4 4-7 12-7 13-1 1 5-5 8-10 6-7-3-9 5-15 10-10 8-28 9-30-1Z" fill="#3e8b57" stroke="#235638" stroke-width="3" stroke-linejoin="round"/>
            <path d="M12 35c7 5 19 2 25-4" fill="none" stroke="#9acb74" stroke-width="3" stroke-linecap="round"/>
            <circle cx="56" cy="19" r="1.5" fill="#fff4c2"/>
            <circle cx="57" cy="19" r="0.7" fill="#202820"/>
            <path d="m61 23 3 1-3 1" fill="none" stroke="#d85c54" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;

        this.createTexture("sheep", sheepSvg);
        this.createTexture("staff", staffSvg);
        this.createTexture("snake", snakeSvg);
    }

    loadNatureSprites() {

        const rockSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="48">

            <polygon
                points="
                8,40
                4,20
                14,8
                32,5
                43,16
                40,38"
                fill="#777"/>

            <polygon
                points="
                12,34
                17,16
                30,11
                35,22
                30,35"
                fill="#999"/>
        </svg>`;

        const bushSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="48"
             height="48">

            <circle
                cx="24"
                cy="30"
                r="14"
                fill="#228B22"/>

            <path
                d="
                M24 4
                L32 20
                L25 15
                L18 21
                Z"
                fill="orange"/>

            <path
                d="
                M24 10
                L28 18
                L24 16
                L20 18
                Z"
                fill="#FFD700"/>
        </svg>`;

        const palmSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="64"
             height="64">

            <rect
                x="28"
                y="24"
                width="8"
                height="35"
                fill="#8B4513"/>

            <ellipse
                cx="18"
                cy="20"
                rx="18"
                ry="6"
                fill="#2e8b57"/>

            <ellipse
                cx="46"
                cy="20"
                rx="18"
                ry="6"
                fill="#2e8b57"/>

            <ellipse
                cx="32"
                cy="10"
                rx="18"
                ry="6"
                fill="#3cb371"/>
        </svg>`;

        const oasisSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="160"
             height="160">

            <ellipse
                cx="80"
                cy="80"
                rx="70"
                ry="55"
                fill="#00AEEF"/>

            <ellipse
                cx="80"
                cy="80"
                rx="78"
                ry="63"
                fill="none"
                stroke="#3CB371"
                stroke-width="8"/>
        </svg>`;

        const mountainSvg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="128"
             height="128">

            <polygon
                points="64,5 10,120 118,120"
                fill="#8d6e63"/>

            <polygon
                points="64,5 40,48 88,48"
                fill="#f5f5f5"/>
        </svg>`;

        this.createTexture(
            "rock",
            rockSvg
        );

        this.createTexture(
            "bush",
            bushSvg
        );

        this.createTexture(
            "palm",
            palmSvg
        );

        this.createTexture(
            "oasis",
            oasisSvg
        );

        this.createTexture(
            "mountain",
            mountainSvg
        );
    }

    preload() {

        this.loadPlayerSprites();

        this.loadNpcSprites();

        this.loadNatureSprites();

        console.log(
            "Midian assets loaded."
        );
    }
}