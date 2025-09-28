/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                "focus": "0 0 0 .25rem rgba(0, 0, 0, .25);"
            },
            colors: {
                "title-text": colors.gray[800],
                "main-text": colors.gray[900],
                "description-text": colors.gray[500],
                "contrast-text": colors.gray[100],

                "blue-focus": colors.blue[300],
                "red-invalid": colors.red[500],
                "white-bg": colors.white,

                "gray-border": colors.gray[300],
                "gray-bg": colors.gray[100],
                "gray-hover": colors.gray[200],
                "gray-disabled": colors.gray[400],

                "blue-border": colors.blue[300],
                "blue-bg": colors.blue[500],
                "blue-hover": colors.blue[600],
                "blue-disabled": colors.blue[300],
            },
            backgroundImage: {
                "radio-input": `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='2' fill='%23fff'/></svg>")`,
                "check-input": `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/></svg>")`
            }
        },
    },
    plugins: [],
}

