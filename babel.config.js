module.exports = function(api) {
    api.cache.never();
    return {
        presets: [
            "@babel/preset-env"
        ],
        plugins: [
            "@babel/plugin-syntax-dynamic-import"
        ]
    }
}
